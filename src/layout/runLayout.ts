import forceAtlas2 from 'graphology-layout-forceatlas2'
import type Graph from 'graphology'

export interface LayoutOptions {
  iterations?: number
}

export function layoutGraph(graph: Graph, options: LayoutOptions = {}) {
  if (!graph || graph.order === 0) return
  const iterations = options.iterations ?? 30
  forceAtlas2.assign(graph, {
    iterations,
    settings: {
      slowDown: 10,
      gravity: 1,
      adjustSizes: true,
    },
  })
}
