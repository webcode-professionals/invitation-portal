import React from 'react';
import {StrictMode } from "react";
import {createRoot } from "react-dom/client";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Error404 from "./pages/Error404"

function ReactRoute() {
    return (
        <Router>
            <Routes>
                <Route path="/"  exact element={<Home/>} />
                <Route path="/en"  exact element={<Home/>} />
                <Route path="/hn"  exact element={<Home/>} />
                <Route path="*"  element={<Error404/>} />
            </Routes>
        </Router>
    );
}
export default ReactRoute;  
if (document.getElementById('sfinv_app')) {
    const rootElement = document.getElementById("sfinv_app");
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <ReactRoute />
        </StrictMode>
    );
}