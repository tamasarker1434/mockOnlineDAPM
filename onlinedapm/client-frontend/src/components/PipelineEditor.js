import React, { useState } from "react";
import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    Handle,
    Position
} from "reactflow";
import "reactflow/dist/style.css";
import { Drawer } from "@mui/material";
import SourceNodeSidebar from "../components/SourceNodeSidebar";

const SourceNode = ({ data, selected }) => (
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
        {data.label || "Source Node"}
    </div>
);

const nodeTypes = {
    source: SourceNode,
};

const PipelineEditor = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const onDrop = (event) => {
        event.preventDefault();
        const nodeType = event.dataTransfer.getData("application/reactflow");
        if (!nodeType) return;

        const position = { x: event.clientX - 250, y: event.clientY - 100 };
        const newNode = {
            id: `${nodes.length + 1}`,
            type: nodeType,
            position,
            data: { label: "Source Node", url: "" },
        };

        setNodes((nds) => [...nds, newNode]);
    };

    const updateNodeData = (nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
            )
        );
    };

    return (
        <>
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
                    onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
                    nodeTypes={nodeTypes}
                    onNodeClick={(event, node) => setSelectedNode(node)}
                    fitView
                />
            </div>

            {/* Right Sidebar for Source Node Configuration */}
            <Drawer
                anchor="right"
                open={selectedNode?.type === "source"}
                onClose={() => setSelectedNode(null)}
            >
                <SourceNodeSidebar
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                    updateNodeData={updateNodeData}
                />
            </Drawer>
        </>
    );
};

export default PipelineEditor;
