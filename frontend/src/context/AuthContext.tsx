import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext, type User } from './AuthContext'; // Importujemy typy z pliku .ts
import { API_BASE_URL } from '../utils/config';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    // 3. Wylogowanie - moved before fetchUserData to avoid dependency issue
    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        
        delete axios.defaults.headers.common['Authorization'];
        
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
    }, []);

    // Funkcja pomocnicza do pobierania danych
    const fetchUserData = useCallback(async (token: string) => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get<User>(`${API_BASE_URL}/api/users/me/`);
            setUser(response.data);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Błąd weryfikacji użytkownika", error);
            logout(); // Jeśli token jest zły -> wyloguj
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL, logout]);

    // 1. Sprawdzenie przy starcie aplikacji (F5)
    useEffect(() => {
        const initAuth = async () => {
            let token = localStorage.getItem('accessToken');
            if (!token) token = sessionStorage.getItem('accessToken');

            if (token) {
                await fetchUserData(token);
            } else {
                setIsLoading(false);
            }
        };
        initAuth();
    }, [fetchUserData]);

    // 2. Logowanie
    const login = async (access: string, refresh: string, remember: boolean) => {
        setIsLoading(true);
        const storage = remember ? localStorage : sessionStorage;
        
        storage.setItem('accessToken', access);
        storage.setItem('refreshToken', refresh);
        
        // Pobierz dane usera od razu po zapisaniu tokena
        await fetchUserData(access);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};