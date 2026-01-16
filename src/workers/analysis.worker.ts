import * as Comlink from 'comlink'
import * as acorn from 'acorn'
import type {
  EdgePayload,
  GraphPayload,
  NodePayload,
  WorkerResult,
  Confidence,
  NodeType,
} from '../types/graph'

type FileEntry = { handle: FileSystemFileHandle; path: string }

const MAX_PARSE_BYTES = 5_000_000 // safety cap; warn if exceeded

export function moduleIdFromPath(path: string) {
  return path.replace(/\.js$/i, '')
}

export function detectModuleIdFromSnippet(snippet: string): string | undefined {
  const webpack = snippet.match(/__webpack_require__\(['"]([^'"]+)['"]\)/)
  if (webpack?.[1]) return webpack[1]
  const rollup = snippet.match(/\bdefine\(\s*\["([^"]+)"/)
  if (rollup?.[1]) return rollup[1]
  return undefined
}
export function detectTags(path: string, snippet: string): NodeType[] {
  const tags: NodeType[] = []
  const lowerPath = path.toLowerCase()
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
  dir: FileSystemDirectoryHandle,
  prefix = '',
): Promise<FileEntry[]> {
  const results: FileEntry[] = []
  // @ts-ignore - FileSystemDirectoryHandle.values() is standard but TS may lag
  for await (const entry of dir.values()) {
    const path = `${prefix}${entry.name}`
    if (entry.kind === 'file' && entry.name.endsWith('.js')) {
      results.push({ handle: entry, path })
    } else if (entry.kind === 'directory') {
      const nested = await collectJsFiles(entry, `${path}/`)
      results.push(...nested)
    }
  }
  return results
}

export class AnalysisWorker {
  private lastPayload: GraphPayload | null = null

  async resolveNodeDetail(nodeId: string): Promise<WorkerResult> {
    if (!this.lastPayload) {
      return { success: false, error: 'No analysis run yet', warnings: [] }
    }
    const node = this.lastPayload.nodes.find((n) => n.id === nodeId)
    if (!node) {
      return { success: false, error: `Node ${nodeId} not found`, warnings: [] }
    }
    const edges = this.lastPayload.edges.filter((e) => e.source === nodeId || e.target === nodeId)
    return { success: true, data: { nodes: [node], edges }, warnings: [] }
  }
  async processDirectory(handle: FileSystemDirectoryHandle): Promise<WorkerResult> {
    const warnings: string[] = []
    try {
      const files = await collectJsFiles(handle)
      if (!files.length) {
        warnings.push('No .js bundles discovered in the selected directory')
        return { success: false, error: 'No JS bundles found', warnings }
      }

      const nodeMap = new Map<string, NodePayload>()
      const edgeSet = new Set<string>()
      const edges: EdgePayload[] = []

      for (const fileEntry of files) {
        const file = await fileEntry.handle.getFile()
        const fileNodeId = `file:${fileEntry.path}`

        if (file.size > MAX_PARSE_BYTES) {
          warnings.push(
            `${fileEntry.path} exceeds ${MAX_PARSE_BYTES} bytes; analysis may be partial`,
          )
        }

        const code = await file.text()
        const snippet = code.slice(0, 1000)
        const fileTags = detectTags(fileEntry.path, snippet)
        nodeMap.set(fileNodeId, {
          id: fileNodeId,
          label: fileEntry.path,
          moduleId: moduleIdFromPath(fileEntry.path),
          file: fileEntry.path,
          size: file.size,
          confidence: 'medium',
          tags: fileTags,
        })
        const parseResult = this.safeParse(code)
        if (!parseResult.ok) {
          warnings.push(`${fileEntry.path}: parse failed (${parseResult.reason})`)
          continue
        }

        const moduleId =
          detectModuleIdFromSnippet(code.slice(0, 2000)) ?? moduleIdFromPath(fileEntry.path)

        let fnCounter = 0
        const ctxStack: string[] = []

        const addNode = (id: string, label: string, meta: Partial<NodePayload>) => {
          if (!nodeMap.has(id)) {
            nodeMap.set(id, {
              id,
              label,
              moduleId,
              file: fileEntry.path,
              confidence: 'high',
              tags: fileTags,
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
              const id = `${fileEntry.path}::${name}`
              addNode(id, name, { inferredName: name, confidence: 'high' })
              ctxStack.push(id)
              visit(node.body)
              ctxStack.pop()
              break
            }
            case 'FunctionExpression':
            case 'ArrowFunctionExpression': {
              const name = node.id?.name ?? `fn_${fnCounter++}`
              const id = `${fileEntry.path}::${name}`
              addNode(id, name, { inferredName: name, confidence: 'medium' })
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
                const id = `${fileEntry.path}::${name}`
                addNode(id, name, { inferredName: name, confidence: 'medium' })
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
              const targetId = `${fileEntry.path}::${calleeName}`
              addNode(targetId, calleeName, {
                inferredName: calleeName,
                confidence: scoreConfidence('low', calleeName === 'unknown' ? 0 : 1),
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

      const payload: GraphPayload = {
        nodes: Array.from(nodeMap.values()),
        edges,
      }

      this.lastPayload = payload
      return { success: true, data: payload, warnings }
    } catch (error) {
      warnings.push(String(error))
      return { success: false, error: String(error), warnings }
    }
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

Comlink.expose(new AnalysisWorker())
