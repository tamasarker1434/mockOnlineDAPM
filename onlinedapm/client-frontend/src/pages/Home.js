import React from "react";
import { Box, Button, Typography, IconButton, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deletePipeline } from "../store";
import HomeSidebar from "../components/HomeSidebar";
import HomeTopBar from "../components/HomeTopBar";
import ReactFlow, { MiniMap, Controls } from "reactflow";
import "reactflow/dist/style.css";
import DeleteIcon from "@mui/icons-material/Delete";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const savedPipelines = useSelector((state) => state.pipelines.pipelines);

    const handleDelete = (index) => {
        dispatch(deletePipeline(index));
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#121212", color: "white" }}>
            {/* Sidebar */}
            <HomeSidebar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Top Bar */}
                <HomeTopBar />

                {/* Add New Pipeline Button - Top Center */}
                <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: "16px", fontWeight: "bold" }}
                        onClick={() => navigate("/pipeline-designer")}
                    >
                        Add New Pipeline
                    </Button>
                </Box>

                {/* Display Saved Pipelines with Mini-Map */}
                <Box sx={{ padding: "20px", display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {savedPipelines.map((pipeline, index) => (
                        <Paper
                            key={index}
                            sx={{
                                width: "200px",
                                height: "150px",
                                position: "relative",
                                backgroundColor: "#1e1e1e",
                                padding: "10px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate(`/pipeline-designer?id=${index}`)}
                        >
                            <Typography variant="body1" sx={{ color: "white", marginBottom: "5px" }}>
                                {pipeline.name}
                            </Typography>
                            <Box sx={{ width: "100%", height: "100px", backgroundColor: "#2b2b2b", borderRadius: "5px" }}>
                                <ReactFlow
                                    nodes={pipeline.nodes}
                                    edges={pipeline.edges}
                                    fitView
                                    nodesDraggable={false}
                                    nodesConnectable={false}
                                    elementsSelectable={false}
                                >
                                    <MiniMap />
                                    <Controls showZoom={false} showInteractive={false} />
                                </ReactFlow>
                            </Box>
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    color: "red",
                                    backgroundColor: "#333",
                                    "&:hover": { backgroundColor: "#555" },
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigation on delete
                                    handleDelete(index);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Paper>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
