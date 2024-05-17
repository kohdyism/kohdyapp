import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuthenticated') === 'true'
    );
    const [isAdmin, setIsAdmin] = useState(
        localStorage.getItem('isAdmin') === 'true'
    );

    const login = (admin = false) => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdmin', admin ? 'true' : 'false');
        setIsAuthenticated(true);
        setIsAdmin(admin);
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
