import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { sourceNodeTitle, sourceNodeID, attributeSettingNodeTitle,attributeSettingNodeID,
    filteringNodeID,filteringNodeTitle,processMiningNodeID,processMiningNodeTitle,sinkNodeID,sinkNodeTitle }
    from "../globalConstantFile";

const nodeTypes = [
    { id: sourceNodeID, label: sourceNodeTitle },
    { id: attributeSettingNodeID, label: attributeSettingNodeTitle },
    { id: filteringNodeID, label: filteringNodeTitle },
    { id: processMiningNodeID, label: processMiningNodeTitle },
    { id: sinkNodeID, label: sinkNodeTitle }
];

const PipelineDesignerSidebar = () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <Box
            sx={{
                width: 200,
                height: "100vh",
                backgroundColor: "#282c34",
                padding: 2,
                color: "white",
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Nodes
            </Typography>

            {nodeTypes.map((node) => (
                <Paper
                    key={node.id}
                    sx={{
                        padding: 1,
                        marginBottom: 1,
                        textAlign: "center",
                        backgroundColor: "#3b3f46",
                        cursor: "grab",
                    }}
                    draggable
                    onDragStart={(event) => onDragStart(event, node.id)}
                >
                    {node.label}
                </Paper>
            ))}
        </Box>
    );
};

export default PipelineDesignerSidebar;
