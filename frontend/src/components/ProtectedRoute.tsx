import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { type User } from '../types/admin';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { isLoggedIn } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get<User>('http://127.0.0.1:8000/api/users/me/');
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUser();
    }, [isLoggedIn]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-900">
                <div className="text-white text-xl">Ładowanie...</div>
            </div>
        );
    }

    if (!isLoggedIn || requireAdmin && !user?.is_staff) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
