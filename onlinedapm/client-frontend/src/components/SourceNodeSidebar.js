import React, { useState } from "react";
import { Box, Typography, Select, MenuItem, Checkbox, TextField, Button } from "@mui/material";

const SourceNodeSidebar = ({ node, onClose }) => {
    const [selectedOrg, setSelectedOrg] = useState("");
    const [customData, setCustomData] = useState("");
    const [useCustomData, setUseCustomData] = useState(false);

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
                variant={"filled"}>
                <MenuItem value="Org-1">Org-1</MenuItem>
                <MenuItem value="Org-2">Org-2</MenuItem>
            </Select>

            {/* Custom Data Input */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Checkbox
                    checked={useCustomData}
                    onChange={() => setUseCustomData(!useCustomData)}
                />
                <Typography variant="body2">Select own Data</Typography>
            </Box>

            {useCustomData && (
                <TextField
                    fullWidth
                    placeholder="Enter Source URL"
                    value={customData}
                    onChange={(e) => setCustomData(e.target.value)}
                    sx={{ mt: 1 }}
                />
            )}

            {/* Ingest and Done Button */}
            <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                onClick={onClose}
            >
                Ingest Data
            </Button>
            <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                onClick={onClose}
            >
                Done
            </Button>
        </Box>
    );
};

export default SourceNodeSidebar;
