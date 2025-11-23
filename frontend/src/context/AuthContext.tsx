import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem('accessToken');
        if (!token) {
            token = sessionStorage.getItem('accessToken');
        }
        if (token) {
            setIsLoggedIn(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const login = (access: string, refresh: string, remember: boolean) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('accessToken', access);
        storage.setItem('refreshToken', refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};