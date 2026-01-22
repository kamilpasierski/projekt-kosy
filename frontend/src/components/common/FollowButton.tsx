import React from 'react';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useClubFollow } from '../../hooks/useClubFollow';

interface FollowButtonProps {
    clubId: number;
    initialRelationId?: number | null;
    className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
    clubId, 
    initialRelationId = null,
    className = "" 
}) => {
    const { isFollowed, isLoading, handleToggleFollowed } = useClubFollow(clubId, initialRelationId);

    return (
        <button
            onClick={handleToggleFollowed}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all hover:bg-white/10 active:scale-95 ${className}`}
            title={isFollowed ? "Przestań obserwować" : "Obserwuj klub"}
        >
            {isFollowed ? (
                <StarSolid className={`w-6 h-6 text-yellow-400 transition-colors duration-300 ${isLoading ? "opacity-50 cursor-wait" : ""}`} />
            ) : (
                <StarOutline className={`w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300 ${isLoading ? "opacity-50 cursor-wait" : ""}`} />
            )}
        </button>
    );
};