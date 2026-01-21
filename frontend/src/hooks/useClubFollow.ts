import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
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

    // Jeśli backend przyśle dane z opóźnieniem, ten useEffect zaktualizuje gwiazdkę
    useEffect(() => {
        setIsFollowed(!!initialFollowedId);
        setFollowedRelationId(initialFollowedId);
    }, [initialFollowedId]);

    const handleToggleFollowed = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!user) return;

        setIsLoading(true);

        try {
            if (isFollowed && followedRelationId) {
                await api.delete(`${ENDPOINT}/${followedRelationId}/`);
                setIsFollowed(false);
                setFollowedRelationId(null);
            } else {
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