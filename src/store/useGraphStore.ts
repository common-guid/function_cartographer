import { create } from 'zustand';
import Graph from 'graphology';

interface GraphState {
    graph: Graph | null;
    setGraph: (graph: Graph) => void;
    hoveredNode: string | null;
    setHoveredNode: (node: string | null) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
    graph: null,
    setGraph: (graph) => set({ graph }),
    hoveredNode: null,
    setHoveredNode: (node) => set({ hoveredNode: node }),
}));
