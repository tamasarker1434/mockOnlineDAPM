import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import PipelineDesignerSidebar from "../components/PipelineDesignerSidebar";
import PipelineEditor from "../components/PipelineEditor";
import PipelineDesignerTopBar from "../components/PipelineDesignerTopBar";
import { savePipeline } from "../store";
import { toPng } from "html-to-image";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const PipelineDesigner = () => {
    const query = useQuery();
    const pipelineIndex = query.get("id");
    const savedPipelines = useSelector((state) => state.pipelines.pipelines);
    const dispatch = useDispatch();

    const editorRef = useRef(null);
    const [pipelineName, setPipelineName] = useState("New Pipeline");
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false); // Prevent multiple overwrites

    // Load saved pipeline when component mounts
    useEffect(() => {
        if (pipelineIndex !== null && savedPipelines[pipelineIndex] && !isLoaded) {
            const pipeline = savedPipelines[pipelineIndex];
            setPipelineName(pipeline.name || "New Pipeline");
            setNodes([...pipeline.nodes]); // Load saved nodes
            setEdges([...pipeline.edges]); // Load saved edges
            setIsLoaded(true);
        }
    }, [pipelineIndex, savedPipelines, isLoaded]);

    const handleSave = () => {
        if (editorRef.current) {
            toPng(editorRef.current)
                .then((dataUrl) => {
                    const pipelineData = {
                        id: pipelineIndex !== null ? Number(pipelineIndex) : savedPipelines.length,
                        name: pipelineName,
                        nodes: [...nodes],  // Save the current nodes
                        edges: [...edges],  // Save the current edges
                        image: dataUrl,
                    };

                    dispatch(savePipeline(pipelineData)); // Update the pipeline in Redux
                    alert("Pipeline saved successfully!");
                })
                .catch((error) => console.error("Error capturing pipeline preview:", error));
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <PipelineDesignerSidebar />
            <Box sx={{ flexGrow: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                <PipelineDesignerTopBar
                    pipelineName={pipelineName}
                    setPipelineName={setPipelineName}
                    nodes={nodes}
                    edges={edges}
                    onSave={handleSave}
                />
                <Box ref={editorRef}>
                    <PipelineEditor nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
                </Box>
            </Box>
        </Box>
    );
};

export default PipelineDesigner;
