import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { startIngestion } from "../services/ingestionService";

const SourceNodeSidebar = ({ node, onClose, updateNodeData }) => {
    const [wikiUrl, setWikiUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        if (node?.data?.url) {
            setWikiUrl(node.data.url);
        }
    }, [node]);

    const handleIngestData = async () => {
        if (!wikiUrl) {
            alert("Please enter a valid Wikipedia URL!");
            return;
        }

        setLoading(true);
        setStatusMessage("Starting ingestion...");

        const response = await startIngestion(wikiUrl);

        if (response?.error) {
            setStatusMessage("❌ Failed to start ingestion.");
        } else {
            setStatusMessage("✅ Ingestion started successfully!");
            updateNodeData(node.id, { url: wikiUrl });
        }

        setLoading(false);
    };

    return (
        <Box sx={{ width: 300, p: 2 }}>
            <Typography variant="h6">Source Node</Typography>
            <TextField
                fullWidth
                placeholder="Enter Wikipedia URL"
                value={wikiUrl}
                onChange={(e) => setWikiUrl(e.target.value)}
                sx={{ mt: 1 }}
            />
            <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleIngestData}
                disabled={loading}
            >
                {loading ? "Ingesting..." : "Ingest Data"}
            </Button>
            {statusMessage && <Typography sx={{ mt: 2 }}>{statusMessage}</Typography>}
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onClose}>
                Done
            </Button>
        </Box>
    );
};

export default SourceNodeSidebar;
