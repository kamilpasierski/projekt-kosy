import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

import NoClubs from "../../components/followed_clubs/NoClubs";
import Description from "../../components/followed_clubs/Description";
import FollowedClubsList from "../../components/followed_clubs/FollowedClubsList";
import { useAuth } from "../../context/AuthContext";

interface FavoriteClubRaw { id: number; club: number; created_at: string; mute: boolean; }
interface ClubDetails { id: number; name: string; path_image?: string; }
interface HydratedFavoriteClub { favoriteId: number; created_at: string; mute: boolean; details: ClubDetails; }

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
                            created_at: item.created_at,
                            mute: item.mute,
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
        <div className="w-full max-w-7xl mx-auto py-8">
            <Description />
            <div className="mt-8">
                <FollowedClubsList clubs={clubsData} />
            </div>
        </div>
    );
};

export default FollowedClubsScene;