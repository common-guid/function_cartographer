import React, { useEffect } from 'react'
import { SigmaContainer, useLoadGraph, useRegisterEvents } from '@react-sigma/core'
import '@react-sigma/core/lib/style.css'
import Graph from 'graphology'
import { useGraphStore } from '../store/useGraphStore'
import { layoutGraph } from '../layout/runLayout'
import type { FilterState, NodePayload, Confidence } from '../types/graph'

const colorForConfidence = (confidence?: 'high' | 'medium' | 'low') => {
  switch (confidence) {
    case 'high':
      return '#FA4F40'
    case 'medium':
      return '#40FAFA'
    default:
      return '#808080'
  }
}
const confidenceRank: Record<Confidence, number> = {
  low: 0,
  medium: 1,
  high: 2,
}

const passesTagFilters = (node: NodePayload, filters: FilterState) => {
  if (!filters.showVendor && node.tags.includes('vendor')) return false
  if (!filters.showBoilerplate && node.tags.includes('boilerplate')) return false
  if (!filters.showFramework && node.tags.includes('framework')) return false
  return true
}

const passesConfidence = (node: NodePayload, filters: FilterState) =>
  confidenceRank[node.confidence] >= confidenceRank[filters.minConfidence]

const matchesSearch = (node: NodePayload, query: string) => {
  if (!query) return true
  const haystack = [
    node.label,
    node.inferredName,
    node.minifiedName,
    node.moduleId,
    node.file,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

const GraphLoader: React.FC = () => {
  const loadGraph = useLoadGraph()
  const registerEvents = useRegisterEvents()
  const payload = useGraphStore((state) => state.payload)
  const setGraph = useGraphStore((state) => state.setGraph)
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode)
  const setHoveredNode = useGraphStore((state) => state.setHoveredNode)
  const filters = useGraphStore((state) => state.filters)

  useEffect(() => {
    if (!payload) return

    const graph = new Graph()
    const query = filters.searchQuery.trim().toLowerCase()
    const nodeById = new Map(payload.nodes.map((node) => [node.id, node]))
    const baseMatches = payload.nodes.filter(
      (node) =>
        passesTagFilters(node, filters) &&
        passesConfidence(node, filters) &&
        matchesSearch(node, query),
    )
    const visibleIds = new Set(baseMatches.map((node) => node.id))

    if (query && filters.includeNeighbors) {
      payload.edges.forEach((edge) => {
        if (visibleIds.has(edge.source)) {
          const target = nodeById.get(edge.target)
          if (target && passesTagFilters(target, filters) && passesConfidence(target, filters)) {
            visibleIds.add(edge.target)
          }
        }
        if (visibleIds.has(edge.target)) {
          const source = nodeById.get(edge.source)
          if (source && passesTagFilters(source, filters) && passesConfidence(source, filters)) {
            visibleIds.add(edge.source)
          }
        }
      })
    }

    const visibleNodes = payload.nodes.filter((node) => visibleIds.has(node.id))
    const nodeCount = visibleNodes.length || 1
    visibleNodes.forEach((node, idx) => {
      const angle = (idx / nodeCount) * Math.PI * 2
      const radius = 10 + (idx % 5)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      graph.addNode(node.id, {
        label: node.inferredName ?? node.label,
        x,
        y,
        size: node.confidence === 'high' ? 10 : node.confidence === 'medium' ? 7 : 5,
        color: colorForConfidence(node.confidence),
        moduleId: node.moduleId,
        file: node.file,
        confidence: node.confidence,
      })
    })

    payload.edges.forEach((edge, idx) => {
      if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return
      const edgeId = `${edge.source}->${edge.target}-${idx}`
      // @ts-ignore - graphology type mismatch for edge attributes
      graph.addEdgeWithKey(edgeId, edge.source, edge.target, {
        color: edge.weak ? '#555' : '#999',
        size: edge.weak ? 1 : 2,
      })
    })
    if (graph.order > 0) {
      layoutGraph(graph)
    }

    loadGraph(graph)
    setGraph(graph)
  }, [payload, filters, loadGraph, setGraph])

  useEffect(() => {
    registerEvents({
      clickNode: ({ node }) => setSelectedNode(node),
      enterNode: ({ node }) => setHoveredNode(node),
      leaveNode: () => setHoveredNode(null),
    })
  }, [registerEvents, setSelectedNode, setHoveredNode])

  return null
}

export const GraphCanvas: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-900">
      <SigmaContainer style={{ height: '100%', width: '100%' }}>
        <GraphLoader />
      </SigmaContainer>
    </div>
  )
}
