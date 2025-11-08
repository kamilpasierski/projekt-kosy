import { createContext } from 'react';

export interface AuthContextType {
    isLoggedIn: boolean;
    login: (access: string, refresh: string, remember: boolean) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);