
import { describe, it, expect, vi } from 'vitest'
import { AnalysisWorker, moduleIdFromPath } from './analysis.worker'
import fs from 'fs'
import path from 'path'

// Mock the FileSystem API
class MockFileSystemFileHandle {
  kind = 'file' as const
  name: string
  private content: string

  constructor(name: string, content: string) {
    this.name = name
    this.content = content
  }

  async getFile() {
    return {
      name: this.name,
      size: this.content.length,
      text: async () => this.content,
    }
  }
}

class MockFileSystemDirectoryHandle {
    kind = 'directory' as const
    name: string
    private entries: (MockFileSystemFileHandle | MockFileSystemDirectoryHandle)[]

    constructor(name: string, entries: (MockFileSystemFileHandle | MockFileSystemDirectoryHandle)[] = []) {
        this.name = name
        this.entries = entries
    }

    async *values() {
        for (const entry of this.entries) {
            yield entry
        }
    }
}

describe('AnalysisWorker', () => {
  it('should process a raw file correctly (fallback or single module)', async () => {
    const worker = new AnalysisWorker()
    const simpleCode = `
      function hello() { console.log('world'); }
      hello();
    `
    const fileHandle = new MockFileSystemFileHandle('test.js', simpleCode)
    const dirHandle = new MockFileSystemDirectoryHandle('root', [fileHandle])

    const result = await worker.processDirectory(dirHandle as any)

    expect(result.success).toBe(true)
    expect(result.data?.nodes).toBeDefined()

    // Check if nodes are created for the file
    // Even if unpacked as single module, we expect file:test.js and nodes linked to it
    const fileNode = result.data!.nodes.find(n => n.id === 'file:test.js')
    expect(fileNode).toBeDefined()
    expect(fileNode?.tags).toContain('source')

    // Function node should exist, either as test.js::hello or similar
    const fnNode = result.data!.nodes.find(n => n.id.includes('hello'))
    expect(fnNode).toBeDefined()
  })

  it('should detect tags correctly based on path', async () => {
      const worker = new AnalysisWorker()
      const simpleCode = `console.log('vendor stuff')`

      const libFile = new MockFileSystemFileHandle('lib.js', simpleCode)
      const nodeModulesDir = new MockFileSystemDirectoryHandle('node_modules', [libFile])
      const rootDir = new MockFileSystemDirectoryHandle('root', [nodeModulesDir])

      const result = await worker.processDirectory(rootDir as any)

      expect(result.success).toBe(true)
      const fileNode = result.data!.nodes.find(n => n.id.includes('lib.js'))
      // The path should be node_modules/lib.js
      expect(fileNode?.file).toContain('node_modules/lib.js')
      // It should inherit vendor tag from the directory structure
      expect(fileNode?.tags).toContain('vendor')
  })

  it('should attempt to unpack a real bundle', async () => {
      // Load a real sample file
      const samplePath = path.resolve(__dirname, '../../sample_js-files/0a4e671ec986bb74.contentHashV1.bundle.js')
      if (!fs.existsSync(samplePath)) {
          console.warn('Sample file not found, skipping real unpacking test')
          return
      }
      const bundleContent = fs.readFileSync(samplePath, 'utf-8')

      const worker = new AnalysisWorker()
      const fileHandle = new MockFileSystemFileHandle('bundle.js', bundleContent)
      const dirHandle = new MockFileSystemDirectoryHandle('root', [fileHandle])

      const result = await worker.processDirectory(dirHandle as any)

      expect(result.success).toBe(true)

      const nodes = result.data!.nodes
      expect(nodes.length).toBeGreaterThan(0)
  })
})
