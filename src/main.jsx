import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./index.css";

// Protected Route Component
function ProtectedRoute({ children }) {
    const isAuthenticated =
        sessionStorage.getItem("adminAuthenticated") === "true";
    return isAuthenticated ? children : <Navigate to="/admin" replace />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
