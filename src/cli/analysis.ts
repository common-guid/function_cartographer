
import * as acorn from 'acorn'
import { unpack } from '@wakaru/unpacker'
import { humanifyCode, type HumanifyOptions } from 'humanifyjs/lib'
import fs from 'fs/promises'
import path from 'path'
import { beautify } from './beautify.js'
import type {
  EdgePayload,
  GraphPayload,
  NodePayload,
  WorkerResult,
  Confidence,
  NodeType,
} from '../types/graph.js'

type FileEntry = { path: string, relativePath: string, size: number }

const MAX_PARSE_BYTES = 5_000_000 // safety cap; warn if exceeded

export function moduleIdFromPath(p: string) {
  return p.replace(/\.js$/i, '')
}

export function detectModuleIdFromSnippet(snippet: string): string | undefined {
  const webpack = snippet.match(/__webpack_require__\(['"]([^'"]+)['"]\)/)
  if (webpack?.[1]) return webpack[1]
  const rollup = snippet.match(/\bdefine\(\s*\["([^"]+)"/)
  if (rollup?.[1]) return rollup[1]
  return undefined
}

export function detectTags(p: string, snippet: string): NodeType[] {
  const tags: NodeType[] = []
  const lowerPath = p.toLowerCase()
  const isVendor =
    lowerPath.includes('node_modules') ||
    lowerPath.includes('vendor') ||
    lowerPath.includes('chunk-vendors') ||
    lowerPath.includes('polyfill')
  tags.push(isVendor ? 'vendor' : 'source')

  if (
    snippet.includes('__webpack_require__') ||
    snippet.includes('self.webpackChunk') ||
    snippet.includes('(function(modules)')
  ) {
    tags.push('boilerplate')
  }

  if (
    snippet.includes('React.createElement') ||
    snippet.includes('.jsx') ||
    snippet.includes('$$typeof')
  ) {
    tags.push('framework')
  }

  return Array.from(new Set(tags))
}

export function scoreConfidence(base: Confidence, bonus = 0): Confidence {
  const levels: Confidence[] = ['low', 'medium', 'high']
  let idx = levels.indexOf(base)
  idx = Math.min(levels.length - 1, Math.max(0, idx + bonus))
  return levels[idx]
}

export function stringifyCallee(node: any): string | null {
  switch (node?.type) {
    case 'Identifier':
      return node.name || null
    case 'Literal':
      return String(node.value)
    case 'MemberExpression': {
      const object = stringifyCallee(node.object)
      const property = node.computed
        ? stringifyCallee(node.property)
        : node.property?.name
      if (object && property) return `${object}.${property}`
      if (object) return object
      return property ?? null
    }
    default:
      return null
  }
}

async function collectJsFiles(
  dir: string,
  rootDir: string
): Promise<FileEntry[]> {
  const results: FileEntry[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const nested = await collectJsFiles(fullPath, rootDir)
      results.push(...nested)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const stats = await fs.stat(fullPath)
      const relativePath = path.relative(rootDir, fullPath)
      results.push({ path: fullPath, relativePath, size: stats.size })
    }
  }
  return results
}

interface ModuleContext {
  path: string
  code: string
  tags: NodeType[]
  moduleId?: string
}

export interface PostProcessOptions {
    enabled: boolean
    inputRoot: string
    outputDir: string
    archiveDir: string
    dupesDir: string
}

export interface AnalyzerOptions extends HumanifyOptions {
    enabled?: boolean;
    scope?: string;
    postProcess?: PostProcessOptions;
    disableUnpacking?: boolean;
}

export class Analyzer {
  async processDirectory(dirPath: string, options?: AnalyzerOptions): Promise<WorkerResult> {
    const warnings: string[] = []
    try {
      const files = await collectJsFiles(dirPath, dirPath)
      if (!files.length) {
        warnings.push('No .js bundles discovered in the selected directory')
        return { success: false, error: 'No JS bundles found', warnings }
      }

      const nodeMap = new Map<string, NodePayload>()
      const edgeSet = new Set<string>()
      const edges: EdgePayload[] = []

      // Helper to add nodes/edges from anywhere
      const addNode = (id: string, label: string, meta: Partial<NodePayload>) => {
        if (!nodeMap.has(id)) {
          // Defaults if not provided in meta
           const defaultTags: NodeType[] = ['source']
           nodeMap.set(id, {
             id,
             label,
             moduleId: '',
             file: '',
             confidence: 'medium',
             tags: defaultTags,
             ...meta,
           })
        }
      }

      const addEdge = (source: string, target: string, weak = false, confidence: Confidence = 'medium') => {
        const key = `${source}->${target}${weak ? ':w' : ''}`
        if (edgeSet.has(key)) return
        edgeSet.add(key)
        edges.push({ source, target, weak, confidence: weak ? 'low' : confidence })
      }

      for (const fileEntry of files) {
        if (fileEntry.size > MAX_PARSE_BYTES) {
          warnings.push(
            `${fileEntry.relativePath} exceeds ${MAX_PARSE_BYTES} bytes; analysis may be partial`,
          )
        }

        let code: string
        let skipUnpack = options?.disableUnpacking ?? false
        let shouldWriteOutput = false
        let destForInput: string | null = null
        let usedCachedOutput = false

        if (options?.postProcess?.enabled) {
            const relPath = fileEntry.relativePath
            const outputPath = path.join(options.postProcess.outputDir, relPath)

            let outputExists = false
            try {
                await fs.access(outputPath)
                outputExists = true
            } catch {
                // ignore
            }

            if (outputExists) {
                console.log(`Using cached output for ${relPath}`)
                code = await fs.readFile(outputPath, 'utf-8')
                skipUnpack = true
                usedCachedOutput = true

                const archivePath = path.join(options.postProcess.archiveDir, relPath)
                let archiveExists = false
                try {
                    await fs.access(archivePath)
                    archiveExists = true
                } catch {
                    // ignore
                }

                if (archiveExists) {
                    destForInput = path.join(options.postProcess.dupesDir, relPath)
                } else {
                    destForInput = archivePath
                }
            } else {
                code = await fs.readFile(fileEntry.path, 'utf-8')
                shouldWriteOutput = true
                destForInput = path.join(options.postProcess.archiveDir, relPath)
            }
        } else {
            code = await fs.readFile(fileEntry.path, 'utf-8')
        }

        // Attempt to unpack first
        let unpackedModules: any[] = []
        if (!skipUnpack) {
            try {
                const result = await unpack(code)
                if (result) unpackedModules = result.modules
            } catch (err) {
                console.warn('De-bundling failed, analyzing raw file', err)
                warnings.push(`${fileEntry.relativePath}: de-bundling failed, fallback to raw`)
            }
        }

        // Always create a node for the physical file
        const fileTags = detectTags(fileEntry.relativePath, code.slice(0, 1000))
        const fileNodeId = `file:${fileEntry.relativePath}`
        addNode(fileNodeId, fileEntry.relativePath, {
             moduleId: moduleIdFromPath(fileEntry.relativePath),
             file: fileEntry.relativePath,
             size: fileEntry.size,
             confidence: 'medium',
             tags: fileTags,
        })

        if (unpackedModules.length > 0) {
            // Unpack Success
            for (const mod of unpackedModules) {
                // Determine tags based on module path AND original file path
                const pathStr = mod.path ?? ''

                const isVendorFile = fileEntry.relativePath.includes('node_modules') || fileEntry.relativePath.includes('vendor')
                const isVendorModule = pathStr.includes('node_modules') || pathStr.startsWith('vendor')

                const isVendor = isVendorFile || isVendorModule
                const tags: NodeType[] = isVendor ? ['vendor'] : ['source']

                // Prefix node IDs with the bundle name to avoid collisions
                // If pathStr is empty, we treat it as the file itself.
                const uniquePath = pathStr ? `${fileEntry.relativePath}::${pathStr}` : fileEntry.relativePath

                let moduleCode = mod.code;
                if (options?.enabled) {
                    const shouldHumanify = options.scope === 'all' || tags.includes('source');
                    if (shouldHumanify) {
                        try {
                            console.log(`Humanifying ${uniquePath}...`);
                            moduleCode = await humanifyCode(moduleCode, options);
                        } catch (err) {
                            console.error(`Humanify failed for ${uniquePath}:`, err);
                            warnings.push(`${uniquePath}: humanify failed, using original code`);
                        }
                    }
                }

                this.analyzeModule({
                    path: uniquePath,
                    code: moduleCode,
                    tags,
                    moduleId: moduleIdFromPath(uniquePath)
                }, addNode, addEdge, warnings)
            }
        } else {
             // Fallback: Raw analysis
             const moduleId = detectModuleIdFromSnippet(code.slice(0, 2000)) ?? moduleIdFromPath(fileEntry.relativePath)

             let fileCode = code;
             let finalCodeForOutput = code;

             if (options?.enabled) {
                 const shouldHumanify = options.scope === 'all' || fileTags.includes('source');
                 if (shouldHumanify && !usedCachedOutput) {
                     try {
                         console.log(`Humanifying ${fileEntry.relativePath}...`);
                         fileCode = await humanifyCode(fileCode, options);
                         finalCodeForOutput = fileCode
                     } catch (err) {
                         console.error(`Humanify failed for ${fileEntry.relativePath}:`, err);
                         warnings.push(`${fileEntry.relativePath}: humanify failed, using original code`);
                     }
                 } else if (shouldWriteOutput && !usedCachedOutput) {
                     // Fallback to beautify if humanification is skipped (e.g. vendor file)
                     finalCodeForOutput = await beautify(fileCode)
                     fileCode = finalCodeForOutput
                 }
             } else if (shouldWriteOutput) {
                 // Format with prettier if humanify is disabled but we are archiving
                 finalCodeForOutput = await beautify(fileCode)
                 fileCode = finalCodeForOutput
             }

             if (shouldWriteOutput && options?.postProcess?.enabled) {
                 const outputPath = path.join(options.postProcess.outputDir, fileEntry.relativePath)
                 try {
                     await fs.mkdir(path.dirname(outputPath), { recursive: true })
                     await fs.writeFile(outputPath, finalCodeForOutput)
                 } catch (err) {
                     warnings.push(`Failed to write output for ${fileEntry.relativePath}: ${err}`)
                     destForInput = null // Prevent move if write failed
                 }
             }

             if (destForInput && options?.postProcess?.enabled) {
                 try {
                     await fs.mkdir(path.dirname(destForInput), { recursive: true })
                     await fs.rename(fileEntry.path, destForInput)
                 } catch (err) {
                     warnings.push(`Failed to move input for ${fileEntry.relativePath}: ${err}`)
                 }
             }

             this.analyzeModule({
                 path: fileEntry.relativePath,
                 code: fileCode,
                 tags: fileTags,
                 moduleId
             }, addNode, addEdge, warnings, fileNodeId)
        }
      }

      const payload: GraphPayload = {
        nodes: Array.from(nodeMap.values()),
        edges,
      }

      return { success: true, data: payload, warnings }
    } catch (error) {
      warnings.push(String(error))
      return { success: false, error: String(error), warnings }
    }
  }

  private analyzeModule(
      ctx: ModuleContext,
      addNode: (id: string, label: string, meta: Partial<NodePayload>) => void,
      addEdge: (source: string, target: string, weak?: boolean, confidence?: Confidence) => void,
      warnings: string[],
      parentNodeId?: string
  ) {
    const parseResult = this.safeParse(ctx.code)
    if (!parseResult.ok) {
      warnings.push(`${ctx.path}: parse failed (${(parseResult as any).reason})`)
      return
    }

    let fnCounter = 0
    const ctxStack: string[] = []
    const fileNodeId = parentNodeId ?? `file:${ctx.path}`

     addNode(fileNodeId, ctx.path, {
        moduleId: ctx.moduleId ?? moduleIdFromPath(ctx.path),
        file: ctx.path,
        confidence: 'medium',
        tags: ctx.tags,
     })


    const visit = (node: any) => {
      if (!node) return
      switch (node.type) {
        case 'Program':
          for (const stmt of node.body) visit(stmt)
          break
        case 'BlockStatement':
          for (const stmt of node.body) visit(stmt)
          break
        case 'FunctionDeclaration': {
          const name = node.id?.name ?? `fn_${fnCounter++}`
          const id = `${ctx.path}::${name}`
          addNode(id, name, {
              inferredName: name,
              confidence: 'high',
              tags: ctx.tags,
              moduleId: ctx.moduleId,
              file: ctx.path
          })
          ctxStack.push(id)
          visit(node.body)
          ctxStack.pop()
          break
        }
        case 'FunctionExpression':
        case 'ArrowFunctionExpression': {
          const name = node.id?.name ?? `fn_${fnCounter++}`
          const id = `${ctx.path}::${name}`
          addNode(id, name, {
              inferredName: name,
              confidence: 'medium',
              tags: ctx.tags,
              moduleId: ctx.moduleId,
              file: ctx.path
          })
          ctxStack.push(id)
          if (node.body) visit(node.body)
          ctxStack.pop()
          break
        }
        case 'VariableDeclaration':
          for (const decl of node.declarations || []) visit(decl)
          break
        case 'VariableDeclarator':
          if (node.init && ['FunctionExpression', 'ArrowFunctionExpression'].includes(node.init.type)) {
            const name = node.id?.name ?? `fn_${fnCounter++}`
            const id = `${ctx.path}::${name}`
            addNode(id, name, {
                inferredName: name,
                confidence: 'medium',
                tags: ctx.tags,
                moduleId: ctx.moduleId,
                file: ctx.path
            })
            ctxStack.push(id)
            visit(node.init.body)
            ctxStack.pop()
          } else {
            visit(node.init)
          }
          break
        case 'ExpressionStatement':
          visit(node.expression)
          break
        case 'CallExpression': {
          const calleeName = stringifyCallee(node.callee) ?? 'unknown'
          const targetId = `${ctx.path}::${calleeName}`
          addNode(targetId, calleeName, {
            inferredName: calleeName,
            confidence: scoreConfidence('low', calleeName === 'unknown' ? 0 : 1),
            tags: ctx.tags, // Inherit tags from current module? Or source?
            moduleId: ctx.moduleId,
            file: ctx.path
          })
          const sourceId = ctxStack[ctxStack.length - 1] ?? fileNodeId
          addEdge(sourceId, targetId, calleeName === 'unknown', calleeName === 'unknown' ? 'low' : 'medium')
          for (const arg of node.arguments || []) visit(arg)
          break
        }
        case 'IfStatement':
          visit(node.test)
          visit(node.consequent)
          visit(node.alternate)
          break
        case 'ReturnStatement':
          visit(node.argument)
          break
        case 'AwaitExpression':
        case 'UnaryExpression':
        case 'UpdateExpression':
        case 'SpreadElement':
        case 'YieldExpression':
          visit(node.argument)
          break
        case 'BinaryExpression':
        case 'LogicalExpression':
          visit(node.left)
          visit(node.right)
          break
        case 'MemberExpression':
          visit(node.object)
          visit(node.property)
          break
        case 'ObjectExpression':
          for (const prop of node.properties || []) {
            if (prop.value) visit(prop.value)
          }
          break
        case 'ArrayExpression':
          for (const el of node.elements || []) visit(el)
          break
        default:
          // intentionally ignore other node types for speed
          break
      }
    }

    visit(parseResult.ast)
  }

  private safeParse(code: string): { ok: true; ast: any } | { ok: false; reason: string } {
    try {
      const ast = acorn.parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
      } as any)
      return { ok: true, ast }
    } catch (errModule) {
      try {
        const ast = acorn.parse(code, {
          ecmaVersion: 'latest',
          sourceType: 'script',
          allowReturnOutsideFunction: true,
          allowAwaitOutsideFunction: true,
        } as any)
        return { ok: true, ast }
      } catch (errScript) {
        return { ok: false, reason: (errScript as Error).message }
      }
    }
  }
}
