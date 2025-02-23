import React, { useState } from "react";
import { AppBar, Toolbar, Typography, TextField, Button, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { savePipeline } from "../store";

const PipelineDesignerTopBar = ({ nodes, edges }) => {
    const [pipelineName, setPipelineName] = useState("New Pipeline");
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSave = () => {
        const pipelineData = {
            name: pipelineName,
            nodes,
            edges,
        };
        dispatch(savePipeline(pipelineData));
        alert("Pipeline saved successfully!");
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#333", padding: "10px" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Left Section - Back Button & Title */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => navigate("/")} sx={{ color: "white", marginRight: "10px" }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ color: "white" }}>Pipeline Designer</Typography>
                </Box>

                {/* Center Section - Editable Pipeline Name */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        backgroundColor: isEditing ? "#222" : "transparent",
                        padding: isEditing ? "4px 8px" : "0",
                        borderRadius: "5px",
                        transition: "0.3s",
                    }}
                    onClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <TextField
                            value={pipelineName}
                            onChange={(e) => setPipelineName(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            variant="outlined"
                            size="small"
                            autoFocus
                            sx={{
                                backgroundColor: "#222",
                                color: "white",
                                input: { color: "white", textAlign: "center" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#555" },
                                    "&:hover fieldset": { borderColor: "#777" },
                                    "&.Mui-focused fieldset": { borderColor: "#bbb" },
                                },
                            }}
                        />
                    ) : (
                        <Typography variant="h6" sx={{ color: "white", textAlign: "center" }}>
                            {pipelineName}
                        </Typography>
                    )}
                </Box>

                {/* Right Section - Save Button */}
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default PipelineDesignerTopBar;
