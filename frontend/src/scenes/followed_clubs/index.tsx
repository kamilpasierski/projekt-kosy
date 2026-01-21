import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

import NoClubs from "../../components/followed_clubs/NoClubs";
import Description from "../../components/followed_clubs/Description";
import { useAuth } from "../../context/AuthContext";
import { FollowButton } from "../../components/shared/FollowButton";

interface FavoriteClubRaw { id: number; club: number; }
interface ClubDetails { id: number; name: string; logo?: string; }
interface HydratedFavoriteClub { favoriteId: number; details: ClubDetails; }

const FollowedClubsScene = () => {
    const navigate = useNavigate();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [clubsData, setClubsData] = useState<HydratedFavoriteClub[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            if (!user) {
                setIsDataLoading(false);
                return;
            }

            try {
                const { data: watchedList } = await api.get<FavoriteClubRaw[]>('/add_fav/watched_clubs');

                if (watchedList.length === 0) {
                    setClubsData([]);
                    setIsDataLoading(false);
                    return;
                }

                const requests = watchedList.map((item) => 
                    api.get<ClubDetails>(`/clubs/${item.club}/`)
                        .then(res => ({
                            favoriteId: item.id,
                            details: res.data
                        }))
                        .catch(err => {
                            console.error(`Failed to fetch club ${item.club}`, err);
                            return null;
                        })
                );

                const results = await Promise.all(requests);
                const validClubs = results.filter((c): c is HydratedFavoriteClub => c !== null);
                
                setClubsData(validClubs);

            } catch (error) {
                console.error("Critical error fetching followed clubs:", error);
            } finally {
                setIsDataLoading(false);
            }
        };

        if (!isAuthLoading) {
            fetchClubs();
        }
    }, [user, isAuthLoading]);

    
    if (isAuthLoading || (user && isDataLoading)) return <div>Loading...</div>;
    if (!user) return <NoClubs title="Zaloguj się..." description="..." actionLabel="Zaloguj" onAction={() => navigate('/login')} />;
    if (clubsData.length === 0) return <NoClubs title="Brak klubów" description="..." actionLabel="Szukaj" onAction={() => navigate('/mapa')} />;
    
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <Description />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubsData.map(({ favoriteId, details }) => (
                    <div key={favoriteId} className="relative group bg-gray-900/50 border border-gray-700 rounded-xl p-5 flex items-center gap-5">
                         {/* Renderowanie klubów */}
                         <div className="w-16 h-16 ...">
                            {details.logo ? <img src={details.logo} className="w-full h-full object-contain" /> : <span>{details.name.substring(0,2)}</span>}
                         </div>
                         <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">{details.name}</h3>
                         </div>
                         <div className="absolute top-4 right-4 z-10">
                            {/* Gwiazdka z propsami */}
                            <FollowButton clubId={details.id} initialRelationId={favoriteId} />
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowedClubsScene;