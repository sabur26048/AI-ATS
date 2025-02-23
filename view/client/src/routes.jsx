import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MyRoutes = () => {
    const location = useLocation();
    useEffect(() => {
        const landingDiv = document.getElementById("landing");
        if (landingDiv) {
            if (location.pathname === "/") {
                landingDiv.style.display = "block"; 
            } else {
                landingDiv.style.display = "none"; 
            }
        }
    }, [location]);
    return (
        <Routes>
            <Route path="/AI-ATS" element={<App />} />
        </Routes>
    );
};

export default MyRoutes;
