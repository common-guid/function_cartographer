import { create } from 'zustand'
import Graph from 'graphology'
import type { GraphPayload } from '../types/graph'

type Status = 'idle' | 'loading' | 'ready' | 'error'

interface GraphState {
  graph: Graph | null
  payload: GraphPayload | null
  status: Status
  warnings: string[]
  error: string | null
  hoveredNode: string | null
  selectedNode: string | null
  setGraph: (graph: Graph | null) => void
  setPayload: (payload: GraphPayload | null) => void
  setStatus: (status: Status) => void
  setWarnings: (warnings: string[]) => void
  setError: (error: string | null) => void
  setHoveredNode: (node: string | null) => void
  setSelectedNode: (node: string | null) => void
  reset: () => void
}

export const useGraphStore = create<GraphState>((set) => ({
  graph: null,
  payload: null,
  status: 'idle',
  warnings: [],
  error: null,
  hoveredNode: null,
  selectedNode: null,
  setGraph: (graph) => set({ graph }),
  setPayload: (payload) => set({ payload }),
  setStatus: (status) => set({ status }),
  setWarnings: (warnings) => set({ warnings }),
  setError: (error) => set({ error }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  reset: () =>
    set({
      graph: null,
      payload: null,
      status: 'idle',
      warnings: [],
      error: null,
      hoveredNode: null,
      selectedNode: null,
    }),
}))
