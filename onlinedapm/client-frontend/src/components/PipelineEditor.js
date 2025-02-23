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
import SourceModal from "./SourceModal";

const SourceNode = ({ data, selected }) => {
    return (
        <div
            style={{
                padding: 10,
                borderRadius: 5,
                background: selected ? "#2196f3" : "#1976d2", // Highlight if selected
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
                background: selected ? "#e53935" : "#d32f2f", // Highlight if selected
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

const PipelineEditor = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedElements, setSelectedElements] = useState({ nodes: [], edges: [] });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const allowDrop = (event) => {
        event.preventDefault();
    };

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

    // Handle selection of nodes or edges and update only if different
    const onSelectionChange = (selection) => {
        if (
            JSON.stringify(selection.nodes) !== JSON.stringify(selectedElements.nodes) ||
            JSON.stringify(selection.edges) !== JSON.stringify(selectedElements.edges)
        ) {
            setSelectedElements(selection);
        }
    };

    // Function to handle delete confirmation
    const handleDelete = () => {
        const selectedNodeIds = selectedElements.nodes?.map((n) => n.id) || [];
        const selectedEdgeIds = selectedElements.edges?.map((e) => e.id) || [];

        setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)));
        setEdges((eds) =>
            eds.filter(
                (edge) =>
                    !selectedEdgeIds.includes(edge.id) &&
                    !selectedNodeIds.includes(edge.source) &&
                    !selectedNodeIds.includes(edge.target)
            )
        );

        setSelectedElements({ nodes: [], edges: [] }); // Clear selection after deletion
        setDeleteDialogOpen(false);
    };

    // Open confirmation dialog when delete key is pressed
    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "Delete" && (selectedElements.nodes.length > 0 || selectedElements.edges.length > 0)) {
                setDeleteDialogOpen(true);
            }
        },
        [selectedElements]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            <div
                style={{ width: "100%", height: "100vh", background: "#1e1e1e" }}
                onDragOver={allowDrop}
                onDrop={onDrop}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onSelectionChange={onSelectionChange}
                    fitView
                >
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the selected node/edge?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PipelineEditor;
