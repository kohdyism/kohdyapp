import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    console.log(`Attempting to access: ${location.pathname}, Auth: ${isAuthenticated}, Admin: ${isAdmin}`);

    if (!isAuthenticated) {
        console.log("Redirecting to login: Not authenticated.");
        return <Navigate to="/" replace />;
    }

    if (adminOnly && !isAdmin) {
        console.log("Redirecting to admin login: Not an admin.");
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
