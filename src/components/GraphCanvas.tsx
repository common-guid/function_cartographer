import React, { useEffect } from 'react';
import { SigmaContainer, useLoadGraph } from '@react-sigma/core';
import '@react-sigma/core/lib/style.css';
import Graph from 'graphology';
import { useGraphStore } from '../store/useGraphStore';

const GraphLoader: React.FC = () => {
    const loadGraph = useLoadGraph();
    const setGraph = useGraphStore((state) => state.setGraph);

    useEffect(() => {
        const graph = new Graph();
        // Dummy data for visualization proof
        graph.addNode("A", { x: 0, y: 0, size: 20, label: "Entry Point", color: "#FA4F40" });
        graph.addNode("B", { x: 10, y: 5, size: 10, label: "Module B", color: "#40FAFA" });
        graph.addNode("C", { x: 10, y: -5, size: 10, label: "Module C", color: "#40FAFA" });
        graph.addEdge("A", "B");
        graph.addEdge("A", "C");

        loadGraph(graph);
        setGraph(graph);
    }, [loadGraph, setGraph]);

    return null;
};

export const GraphCanvas: React.FC = () => {
    return (
        <div className="w-full h-screen bg-gray-900">
            <SigmaContainer style={{ height: "100%", width: "100%" }}>
                <GraphLoader />
            </SigmaContainer>
        </div>
    );
};
