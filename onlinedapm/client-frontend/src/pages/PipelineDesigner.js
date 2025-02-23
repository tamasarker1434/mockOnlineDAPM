import React, { useState, useEffect, useRef } from "react";
import { Box, Drawer } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import PipelineDesignerSidebar from "../components/PipelineDesignerSidebar";
import PipelineEditor from "../components/PipelineEditor";
import PipelineDesignerTopBar from "../components/PipelineDesignerTopBar";
import { savePipeline } from "../store";
import { toPng } from "html-to-image";
import SourceNodeSidebar from "../components/SourceNodeSidebar";

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
    const [selectedNode, setSelectedNode] = useState(null);

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <PipelineDesignerSidebar />
            <Box sx={{ flexGrow: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                <PipelineDesignerTopBar
                    pipelineName={pipelineName}
                    setPipelineName={setPipelineName}
                    nodes={nodes}
                    edges={edges}
                />
                <Box ref={editorRef}>
                    <PipelineEditor
                        onNodeSelect={setSelectedNode} // Handle node selection
                    />
                </Box>
            </Box>

            {/* Right Sidebar for Source Node Configuration */}
            <Drawer
                anchor="right"
                open={selectedNode?.type === "source"}
                onClose={() => setSelectedNode(null)}
            >
                <SourceNodeSidebar node={selectedNode} onClose={() => setSelectedNode(null)} />
            </Drawer>
        </Box>
    );
};

export default PipelineDesigner;
