import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext, type User } from './AuthContext'; // Importujemy typy z pliku .ts

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = 'http://127.0.0.1:8000';

    // Funkcja pomocnicza do pobierania danych
    const fetchUserData = async (token: string) => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get<User>(`${API_URL}/api/users/me/`);
            setUser(response.data);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Błąd weryfikacji użytkownika", error);
            logout(); // Jeśli token jest zły -> wyloguj
        } finally {
            setIsLoading(false);
        }
    };

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
    }, []);

    // 2. Logowanie
    const login = async (access: string, refresh: string, remember: boolean) => {
        setIsLoading(true);
        const storage = remember ? localStorage : sessionStorage;
        
        storage.setItem('accessToken', access);
        storage.setItem('refreshToken', refresh);
        
        // Pobierz dane usera od razu po zapisaniu tokena
        await fetchUserData(access);
    };

    // 3. Wylogowanie
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        
        delete axios.defaults.headers.common['Authorization'];
        
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};