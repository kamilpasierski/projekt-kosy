import { useState } from 'react';
import api from '../api/axiosConfig'; // Importujemy Twoją instancję
import { useAuth } from '../context/AuthContext'; 

interface FollowResponse {
    id: number;
    club: number;
}

export const useClubFollow = (clubId: number, initialFollowedId: number | null = null) => {
    const { user } = useAuth();
    
    const [isFollowed, setIsFollowed] = useState<boolean>(!!initialFollowedId);
    const [followedRelationId, setFollowedRelationId] = useState<number | null>(initialFollowedId);
    const [isLoading, setIsLoading] = useState(false);

    const ENDPOINT = '/add_fav/watched_clubs';

    const handleToggleFollowed = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!user) return; 

        setIsLoading(true);

        try {
            if (isFollowed && followedRelationId) {
                // --- UNFOLLOW (DELETE) ---
                await api.delete(`${ENDPOINT}/${followedRelationId}/`);
                
                setIsFollowed(false);
                setFollowedRelationId(null);
            } else {
                // --- FOLLOW (POST) ---
                const response = await api.post<FollowResponse>(ENDPOINT, {
                    club: clubId
                });

                setIsFollowed(true);
                setFollowedRelationId(response.data.id);
            }
        } catch (error) {
            console.error("Błąd api/add_fav:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isFollowed, isLoading, handleToggleFollowed };
};