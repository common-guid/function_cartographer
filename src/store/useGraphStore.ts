import { create } from 'zustand'
import Graph from 'graphology'
import type { FilterState, GraphPayload } from '../types/graph'

type Status = 'idle' | 'loading' | 'ready' | 'error'
const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  showVendor: false,
  showBoilerplate: false,
  showFramework: false,
  minConfidence: 'low',
  includeNeighbors: false,
}

interface GraphState {
  graph: Graph | null
  payload: GraphPayload | null
  status: Status
  warnings: string[]
  error: string | null
  hoveredNode: string | null
  selectedNode: string | null
  filters: FilterState
  setGraph: (graph: Graph | null) => void
  setPayload: (payload: GraphPayload | null) => void
  setStatus: (status: Status) => void
  setWarnings: (warnings: string[]) => void
  setError: (error: string | null) => void
  setHoveredNode: (node: string | null) => void
  setSelectedNode: (node: string | null) => void
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
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
  filters: DEFAULT_FILTERS,
  setGraph: (graph) => set({ graph }),
  setPayload: (payload) => set({ payload }),
  setStatus: (status) => set({ status }),
  setWarnings: (warnings) => set({ warnings }),
  setError: (error) => set({ error }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  reset: () =>
    set({
      graph: null,
      payload: null,
      status: 'idle',
      warnings: [],
      error: null,
      hoveredNode: null,
      selectedNode: null,
      filters: DEFAULT_FILTERS,
    }),
}))
