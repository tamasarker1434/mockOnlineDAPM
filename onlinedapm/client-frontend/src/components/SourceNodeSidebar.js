import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem, Checkbox, TextField, Button } from "@mui/material";
import { startIngestion } from "../services/ingestionService"; // Import the API service

const SourceNodeSidebar = ({ node, onClose, updateNodeData }) => {
    const [selectedOrg, setSelectedOrg] = useState("");
    const [wikiUrl, setWikiUrl] = useState("");
    const [useCustomData, setUseCustomData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // Load the existing URL from the selected node when the sidebar opens
    useEffect(() => {
        if (node?.data?.url) {
            setWikiUrl(node.data.url);
            setUseCustomData(true);
        }
    }, [node]);

    const handleIngestData = async () => {
        if (!wikiUrl) {
            alert("Please enter a valid Wikipedia URL!");
            return;
        }

        setLoading(true);
        setStatusMessage("Starting ingestion...");

        // Call API to start ingestion with the dynamically entered URL
        const response = await startIngestion(wikiUrl);

        if (response?.error) {
            setStatusMessage("❌ Failed to start ingestion.");
        } else {
            setStatusMessage("✅ Ingestion started successfully!");
            updateNodeData(node.id, { url: wikiUrl }); // Update the node with the latest URL
        }

        setLoading(false);
    };

    return (
        <Box sx={{ width: 300, p: 2 }}>
            <Typography variant="h6">Source</Typography>

            {/* Organization Selection Dropdown */}
            <Typography variant="body2" sx={{ mt: 2 }}>Select one</Typography>
            <Select
                fullWidth
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                sx={{ mt: 1 }}
                variant="filled"
            >
                <MenuItem value="Org-1">Org-1</MenuItem>
                <MenuItem value="Org-2">Org-2</MenuItem>
            </Select>

            {/* Wikipedia URL Input */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Checkbox
                    checked={useCustomData}
                    onChange={() => setUseCustomData(!useCustomData)}
                />
                <Typography variant="body2">Enter Wikipedia URL</Typography>
            </Box>

            {useCustomData && (
                <TextField
                    fullWidth
                    placeholder="Enter Wikipedia URL"
                    value={wikiUrl}
                    onChange={(e) => setWikiUrl(e.target.value)}
                    sx={{ mt: 1 }}
                />
            )}

            {/* Ingest Data Button */}
            <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleIngestData}
                disabled={loading}
            >
                {loading ? "Ingesting..." : "Ingest Data"}
            </Button>

            {/* Status Message */}
            {statusMessage && (
                <Typography sx={{ mt: 2, textAlign: "center", fontWeight: "bold" }}>
                    {statusMessage}
                </Typography>
            )}

            {/* Close Sidebar */}
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onClose}>
                Done
            </Button>
        </Box>
    );
};

export default SourceNodeSidebar;
