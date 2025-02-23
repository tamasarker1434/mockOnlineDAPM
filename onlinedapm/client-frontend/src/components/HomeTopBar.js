import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const HomeTopBar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: "#333" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
                    Welcome to DAPM
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default HomeTopBar;
