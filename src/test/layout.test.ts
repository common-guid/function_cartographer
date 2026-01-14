import { describe, expect, it, vi, beforeEach } from 'vitest'
import Graph from 'graphology'
import { layoutGraph } from '../layout/runLayout'

vi.mock('graphology-layout-forceatlas2', () => {
  const assign = vi.fn()
  return {
    __esModule: true,
    default: { assign },
    assign,
  }
})

import forceAtlas2 from 'graphology-layout-forceatlas2'
const mockedAssign = (forceAtlas2 as any).assign as ReturnType<typeof vi.fn>

describe('layoutGraph', () => {
  beforeEach(() => {
    mockedAssign.mockClear()
  })

  it('skips when graph is empty', () => {
    const g = new Graph()
    layoutGraph(g)
    expect(mockedAssign).not.toHaveBeenCalled()
  })

  it('calls forceatlas2.assign with iterations', () => {
    const g = new Graph()
    g.addNode('a', { x: 0, y: 0 })
    layoutGraph(g, { iterations: 5 })
    expect(mockedAssign).toHaveBeenCalledTimes(1)
    const [graphArg, opts] = mockedAssign.mock.calls[0]
    expect(graphArg).toBe(g)
    expect(opts.iterations).toBe(5)
  })
})
