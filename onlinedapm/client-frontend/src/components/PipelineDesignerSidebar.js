import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const PipelineDesignerSidebar = () => {
    const handleDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <Box sx={{ width: "200px", padding: "20px", borderRight: "2px solid #ddd", bgcolor: "black", color: "white" }}>
            <Typography variant="h6">Nodes</Typography>
            <Paper
                draggable
                onDragStart={(e) => handleDragStart(e, "source")}
                sx={{ padding: "10px", marginTop: "10px", cursor: "grab", bgcolor: "#333", color: "white" }}
            >
                Source Node
            </Paper>
            <Paper
                draggable
                onDragStart={(e) => handleDragStart(e, "transformation")}
                sx={{ padding: "10px", marginTop: "10px", cursor: "grab", bgcolor: "#333", color: "white" }}
            >
                Transformation Node
            </Paper>
        </Box>
    );
};

export default PipelineDesignerSidebar;
