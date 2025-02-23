import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const SourceNode = ({ data, selected }) => {
    return (
        <div
            style={{
                padding: 10,
                borderRadius: 5,
                background: selected ? "#2196f3" : "#1976d2",
                color: "white",
                textAlign: "center",
                position: "relative",
                border: selected ? "2px solid white" : "none",
            }}
        >
            <Handle type="source" position={Position.Right} style={{ background: "#fff" }} />
            {data.label}
        </div>
    );
};

const TransformationNode = ({ data, selected }) => {
    return (
        <div
            style={{
                padding: 10,
                borderRadius: 5,
                background: selected ? "#e53935" : "#d32f2f",
                color: "white",
                textAlign: "center",
                position: "relative",
                border: selected ? "2px solid white" : "none",
            }}
        >
            <Handle type="target" position={Position.Left} style={{ background: "#fff" }} />
            {data.label}
            <Handle type="source" position={Position.Right} style={{ background: "#fff" }} />
        </div>
    );
};

const nodeTypes = {
    source: SourceNode,
    transformation: TransformationNode,
};

const PipelineEditor = ({ onNodeSelect }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onDrop = (event) => {
        event.preventDefault();
        const nodeType = event.dataTransfer.getData("application/reactflow");
        if (!nodeType) return;

        const position = { x: event.clientX - 250, y: event.clientY - 100 };
        const newNode = {
            id: `${nodes.length + 1}`,
            type: nodeType,
            position,
            data: { label: nodeType === "source" ? "Source Node" : "Transformation Node" },
        };

        setNodes((nds) => [...nds, newNode]);
    };

    const onConnect = (params) => {
        setEdges((eds) => addEdge(params, eds));
    };

    return (
        <div
            style={{ width: "100%", height: "100vh", background: "#1e1e1e" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeClick={(event, node) => onNodeSelect(node)} // Send selected node to parent
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default PipelineEditor;
