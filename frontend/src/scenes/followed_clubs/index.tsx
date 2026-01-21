import { useNavigate } from 'react-router-dom';
import NoClubs from "../../components/followed_clubs/NoClubs";
import { useAuth } from "../../hooks/useAuth";

const FollowedClubsScene = () => {
    const navigate = useNavigate();
    // Pobieramy stan użytkownika bezpośrednio w komponencie
    const { user, isLoading } = useAuth(); 

    // 1. Loading state (opcjonalnie)
    if (isLoading) return <div>Ładowanie...</div>;

    // 2. SCENARIUSZ: Użytkownik NIEZALOGOWANY
    // Wyświetlamy Twój komponent "Empty State" z zachętą do logowania
    if (!user) {
        return (
            <NoClubs 
                title="Zaloguj się, aby obserwować"
                description="Dołącz do społeczności kibiców. Zaloguj się, aby śledzić ulubione kluby."
                actionLabel="Zaloguj się"
                onAction={() => navigate('/auth')}
            />
        );
    }

    // 3. SCENARIUSZ: Użytkownik ZALOGOWANY, ale nie obserwuje żadnych klubów
    const clubs = []; // Mock pustej listy

    if (clubs.length === 0) {
        return (
            <NoClubs 
                title="Nie obserwujesz jeszcze żadnych klubów"
                description="Obserwuj kluby, aby otrzymywać powiadomienia o relacjach."
                actionLabel="Przeglądaj kluby"
                onAction={() => navigate('/mapa')}
            />
        );
    }

    return (
        <div>
            {/* Lista klubów */}
            <h1>Twoje kluby</h1>
        </div>
    );
};

export default FollowedClubsScene;