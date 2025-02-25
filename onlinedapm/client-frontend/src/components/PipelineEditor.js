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
import AttributeSettingSidebar from "../components/AttributeSettingSidebar"; // Import new sidebar
import {
    sourceNodeTitle, sourceNodeID, attributeSettingNodeTitle, attributeSettingNodeID,
    filteringNodeID, filteringNodeTitle, processMiningNodeID, processMiningNodeTitle, sinkNodeID, sinkNodeTitle
} from "../globalConstantFile";

// Source Node Component
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
        {data.label || sourceNodeTitle}
    </div>
);

// Attribute Setting Node Component
const AttributeSettingNode = ({ data, selected }) => (
    <div
        style={{
            padding: 10,
            borderRadius: 5,
            background: selected ? "#f57c00" : "#ef6c00",
            color: "white",
            textAlign: "center",
            position: "relative",
            border: selected ? "2px solid white" : "none",
        }}
    >
        <Handle type="target" position={Position.Left} style={{ background: "#fff" }} />
        {data.label || attributeSettingNodeTitle}
        <Handle type="source" position={Position.Right} style={{ background: "#fff" }} />
    </div>
);

// Filtering Node Component
const FilteringNode = ({ data, selected }) => (
    <div
        style={{
            padding: 10,
            borderRadius: 5,
            background: selected ? "#43a047" : "#388e3c",
            color: "white",
            textAlign: "center",
            position: "relative",
            border: selected ? "2px solid white" : "none",
        }}
    >
        <Handle type="target" position={Position.Left} style={{ background: "#fff" }} />
        {data.label || filteringNodeTitle}
        <Handle type="source" position={Position.Right} style={{ background: "#fff" }} />
    </div>
);

// Process Mining Node Component
const ProcessMiningNode = ({ data, selected }) => (
    <div
        style={{
            padding: 10,
            borderRadius: 5,
            background: selected ? "#d21919" : "#d21919",
            color: "white",
            textAlign: "center",
            position: "relative",
            border: selected ? "2px solid white" : "none",
        }}
    >
        <Handle type="target" position={Position.Left} style={{ background: "#fff" }} />
        {data.label || processMiningNodeTitle}
        <Handle type="source" position={Position.Right} style={{ background: "#fff" }} />
    </div>
);

// Sink Node Component
const SinkNode = ({ data, selected }) => (
    <div
        style={{
            padding: 10,
            borderRadius: 5,
            background: selected ? "#8e24aa" : "#7b1fa2",
            color: "white",
            textAlign: "center",
            position: "relative",
            border: selected ? "2px solid white" : "none",
        }}
    >
        <Handle type="target" position={Position.Left} style={{ background: "#fff" }} />
        {data.label || sinkNodeTitle}
    </div>
);

// Node Types Configuration
const nodeTypes = {
    source: SourceNode,
    attributeSetting: AttributeSettingNode,
    filtering: FilteringNode,
    processMining: ProcessMiningNode,
    sink: SinkNode,
};

const PipelineEditor = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [sourceSidebarOpen, setSourceSidebarOpen] = useState(false);
    const [attributeSidebarOpen, setAttributeSidebarOpen] = useState(false);

    const onDrop = (event) => {
        event.preventDefault();
        const nodeType = event.dataTransfer.getData("application/reactflow");
        if (!nodeType) return;

        const position = { x: event.clientX - 250, y: event.clientY - 100 };

        const newNode = {
            id: `${nodes.length + 1}`,
            type: nodeType,
            position,
            data: {
                label: getNodeLabel(nodeType),
                url: ""
            },
        };

        setNodes((nds) => [...nds, newNode]);
    };

    const getNodeLabel = (nodeType) => {
        switch (nodeType) {
            case sourceNodeID: return sourceNodeTitle;
            case attributeSettingNodeID: return attributeSettingNodeTitle;
            case filteringNodeID: return filteringNodeTitle;
            case processMiningNodeID: return processMiningNodeTitle;
            case sinkNodeID: return sinkNodeTitle;
            default: return "Unknown Node";
        }
    };

    const onNodeClick = (event, node) => {
        setSelectedNode(node);

        if (node.type === "source") {
            setSourceSidebarOpen(true);
            setAttributeSidebarOpen(false);
        } else if (node.type === "attributeSetting") {
            setAttributeSidebarOpen(true);
            setSourceSidebarOpen(false);
        }
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
                    onNodeClick={onNodeClick} // Open respective sidebar
                    fitView
                />
            </div>

            {/* Source Node Sidebar */}
            <Drawer
                anchor="right"
                open={sourceSidebarOpen}
                onClose={() => setSourceSidebarOpen(false)}
            >
                <SourceNodeSidebar node={selectedNode} onClose={() => setSourceSidebarOpen(false)} />
            </Drawer>

            {/* Attribute Setting Node Sidebar */}
            <Drawer
                anchor="right"
                open={attributeSidebarOpen}
                onClose={() => setAttributeSidebarOpen(false)}
            >
                <AttributeSettingSidebar node={selectedNode} onClose={() => setAttributeSidebarOpen(false)} />
            </Drawer>
        </>
    );
};

export default PipelineEditor;
