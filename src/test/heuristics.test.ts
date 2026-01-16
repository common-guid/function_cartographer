import { describe, expect, it } from 'vitest'
import {
  detectModuleIdFromSnippet,
  scoreConfidence,
  AnalysisWorker,
} from '../workers/analysis.worker'
import type { GraphPayload } from '../types/graph'

describe('detectModuleIdFromSnippet', () => {
  it('detects webpack require path', () => {
    const id = detectModuleIdFromSnippet("__webpack_require__('src/foo.js')")
    expect(id).toBe('src/foo.js')
  })

  it('returns undefined when absent', () => {
    expect(detectModuleIdFromSnippet('console.log("hi")')).toBeUndefined()
  })
})

describe('scoreConfidence', () => {
  it('bumps medium to high', () => {
    expect(scoreConfidence('medium', 1)).toBe('high')
  })
  it('caps at high', () => {
    expect(scoreConfidence('high', 2)).toBe('high')
  })
})

describe('AnalysisWorker.resolveNodeDetail', () => {
  it('returns node and incident edges', async () => {
    const worker = new AnalysisWorker()
    const payload: GraphPayload = {
      nodes: [
        { id: 'a', label: 'a', confidence: 'medium', tags: ['source'] },
        { id: 'b', label: 'b', confidence: 'low', tags: ['source'] },
      ],
      edges: [
        { source: 'a', target: 'b' },
        { source: 'b', target: 'a' },
        { source: 'b', target: 'c' },
      ],
    }
    ;(worker as any).lastPayload = payload
    const res = await worker.resolveNodeDetail('a')
    expect(res.success).toBe(true)
    if (res.success) {
      expect(res.data.nodes).toHaveLength(1)
      expect(res.data.nodes[0].id).toBe('a')
      expect(res.data.edges.map((e) => `${e.source}-${e.target}`).sort()).toEqual([
        'a-b',
        'b-a',
      ])
    }
  })
})
