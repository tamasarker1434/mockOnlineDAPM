import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PipelineDesigner from "./pages/PipelineDesigner";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pipeline-designer" element={<PipelineDesigner />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
