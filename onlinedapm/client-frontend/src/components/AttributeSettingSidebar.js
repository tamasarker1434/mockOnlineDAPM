import React from "react";
import { Box, Typography, Button } from "@mui/material";
import RealtimeTable from "./RealtimeTable"; // Adjust the path as needed

const AttributeSettingSidebar = ({ node, onClose }) => {
    if (!node) return null;

    return (
        <Box sx={{ width: 300, p: 2 }}>
            {/* Header: Title on left; realtime table and Save button on right */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">
                    Attribute Setting for process mining
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Realtime data table can be scaled as needed */}
                    <RealtimeTable />
                    <Button variant="contained" sx={{ ml: 1 }} onClick={onClose}>
                        Save
                    </Button>
                </Box>
            </Box>
            {/*
          Optionally, you can add further content below the header
          or remove the below section if only the header is needed.
      */}
        </Box>
    );
};

export default AttributeSettingSidebar;
