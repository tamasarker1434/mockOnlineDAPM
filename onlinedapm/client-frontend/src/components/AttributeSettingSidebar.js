import React from "react";
import { Box, Typography, Select, MenuItem, TextField, Button } from "@mui/material";

const AttributeSettingSidebar = ({ node, onClose }) => {
    if (!node) return null;

    return (
        <Box sx={{ width: 300, p: 2 }}>
            <Typography variant="h6">Attribute Setting</Typography>

            {/* Attribute Selection */}
            <Typography variant="body2" sx={{ mt: 2 }}>Select Attribute Type</Typography>
            <Select fullWidth sx={{ mt: 1 }}>
                <MenuItem value="case_id">Case ID</MenuItem>
                <MenuItem value="activity">Activity</MenuItem>
                <MenuItem value="timestamp">Timestamp</MenuItem>
            </Select>

            {/* Additional Metadata */}
            <Typography variant="body2" sx={{ mt: 2 }}>Additional Metadata (Optional)</Typography>
            <TextField fullWidth placeholder="Enter metadata..." sx={{ mt: 1 }} />

            {/* Done Button */}
            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={onClose}>
                Done
            </Button>
        </Box>
    );
};

export default AttributeSettingSidebar;
