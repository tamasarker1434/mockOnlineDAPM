import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

const SourceModal = ({ open, onClose, node }) => {
    const [url, setUrl] = useState(""); // Stores the input URL

    const handleSubmit = () => {
        console.log(`URL saved for node ${node?.id}:`, url);
        onClose(); // ✅ Close modal after submission
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Configure Source Node</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Wikipedia URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SourceModal;
