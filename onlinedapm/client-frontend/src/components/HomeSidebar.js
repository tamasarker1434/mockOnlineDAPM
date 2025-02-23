import React from "react";
import { Drawer, Toolbar, Typography, Box } from "@mui/material";

const drawerWidth = 240;

const HomeSidebar = () => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "#1e1e1e",
                    color: "white",
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Online DAPM
                </Typography>
            </Toolbar>
            <Box sx={{ flexGrow: 1, p: 2 }}>{/* Empty for now */}</Box>
        </Drawer>
    );
};

export default HomeSidebar;
