import React, { useEffect } from 'react'
import { SigmaContainer, useLoadGraph, useRegisterEvents } from '@react-sigma/core'
import '@react-sigma/core/lib/style.css'
import Graph from 'graphology'
import { useGraphStore } from '../store/useGraphStore'
import { layoutGraph } from '../layout/runLayout'

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

const GraphLoader: React.FC = () => {
  const loadGraph = useLoadGraph()
  const registerEvents = useRegisterEvents()
  const payload = useGraphStore((state) => state.payload)
  const setGraph = useGraphStore((state) => state.setGraph)
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode)
  const setHoveredNode = useGraphStore((state) => state.setHoveredNode)

  useEffect(() => {
    if (!payload) return

    const graph = new Graph()
    const nodeCount = payload.nodes.length || 1
    payload.nodes.forEach((node, idx) => {
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
      const edgeId = `${edge.source}->${edge.target}-${idx}`
      // @ts-ignore - graphology type mismatch for edge attributes
      graph.addEdgeWithKey(edgeId, edge.source, edge.target, {
        color: edge.weak ? '#555' : '#999',
        size: edge.weak ? 1 : 2,
      })
    })
    layoutGraph(graph)

    loadGraph(graph)
    setGraph(graph)
  }, [payload, loadGraph])

  useEffect(() => {
    registerEvents({
      clickNode: ({ node }) => setSelectedNode(node),
      enterNode: ({ node }) => setHoveredNode(node),
      leaveNode: () => setHoveredNode(null),
    })
  }, [registerEvents])

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
