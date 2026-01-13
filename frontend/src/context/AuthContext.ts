import { createContext } from 'react';

export interface User {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
}

export interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;      
    isLoading: boolean;
    login: (access: string, refresh: string, remember: boolean) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);