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

    // 1. Loading
    if (isAuthLoading || (user && isDataLoading)) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-white animate-pulse">Ładowanie Twoich klubów...</div>
            </div>
        );
    }

    // 2. Niezalogowany (Teksty przywrócone)
    if (!user) {
        return (
            <NoClubs 
                title="Zaloguj się, aby obserwować"
                description="Dołącz do społeczności kibiców. Zaloguj się, aby śledzić ulubione kluby i otrzymywać powiadomienia."
                actionLabel="Zaloguj się"
                onAction={() => navigate('/auth')}
            />
        );
    }

    // 3. Zalogowany, ale brak klubów (Teksty przywrócone)
    if (clubsData.length === 0) {
        return (
            <NoClubs 
                title="Nie obserwujesz jeszcze żadnych klubów"
                description="Obserwuj kluby, aby otrzymywać powiadomienia o relacjach i poziomie bezpieczeństwa w Twojej okolicy."
                actionLabel="Przeglądaj kluby"
                onAction={() => navigate('/mapa')}
            />
        );
    }
    
    // 4. Lista klubów
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <Description />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubsData.map(({ favoriteId, details }) => (
                    <div key={favoriteId} className="relative group bg-gray-900/50 border border-gray-700 hover:border-blue-600 transition-all duration-300 rounded-xl p-5 flex items-center gap-5">
                         {/* Logo Klubu */}
                         <div className="w-16 h-16 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center p-2">
                            {details.logo ? (
                                <img src={details.logo} alt={details.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-xl font-bold text-gray-500">{details.name.substring(0,2).toUpperCase()}</span>
                            )}
                         </div>
                         
                         {/* Nazwa Klubu */}
                         <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                {details.name}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                                Kliknij, aby zobaczyć szczegóły
                            </p>
                         </div>

                         {/* Gwiazdka */}
                         <div className="absolute top-4 right-4 z-10">
                            <FollowButton clubId={details.id} initialRelationId={favoriteId} />
                         </div>

                         {/* Niewidoczny link na całą kartę */}
                         <div 
                            className="absolute inset-0 cursor-pointer" 
                            onClick={() => navigate(`/clubs/${details.id}`)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowedClubsScene;