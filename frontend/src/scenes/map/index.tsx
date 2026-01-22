import { useState, useEffect } from 'react';
import Map from '../../components/map/Map';
import SafetyCheck from '../../components/map/SafetyCheck';
import Legend from '../../components/map/Legend';
import ClubList from '../../components/map/ClubList';
import { type LatLngBoundsExpression } from 'leaflet';

// Importy logiki biznesowej
import { 
    analyzeSafety, 
    parseRelationsToMap, 
    type TerritoryData, 
    type RelationsMap 
} from '../../utils/geoUtils';

// Definicja kształtu stanu dla SafetyCheck
interface SafetyState {
    title: string;
    statusTitle: string;
    description: string;
    color: string;
}

const MapScene = () => {
    // --- STANY DANYCH ---
    const [territories, setTerritories] = useState<TerritoryData[]>([]);
    const [relationsMap, setRelationsMap] = useState<RelationsMap>({});

    // --- STAN FOKUSU TERYTORIUM ---
    const [focusBounds, setFocusBounds] = useState<LatLngBoundsExpression | null>(null);


    // --- STAN UŻYTKOWNIKA ---
    const [userClub, setUserClub] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // --- STAN UI (SafetyCheck) ---
    // Ustawiamy domyślny kolor na neutralny szary (#6b7280)
    const [safetyProps, setSafetyProps] = useState<SafetyState>({
        title: "WITAJ KIBICU",
        statusTitle: "ŁADOWANIE DANYCH...",
        description: "Pobieramy informacje o strefach i Twoim profilu.",
        color: "#6b7280" 
    });

    // 1. POBIERANIE DANYCH (Init)
    useEffect(() => {
        const initData = async () => {
            try {
                // Fetch równoległy dla wydajności
                const [areasRes, relRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/area/'),
                    fetch('http://127.0.0.1:8000/api/relations/')
                ]);

                const areas = await areasRes.json();
                const rels = await relRes.json();

                setTerritories(areas);
                setRelationsMap(parseRelationsToMap(rels));

                // Obsługa User Context
                const token = localStorage.getItem('accessToken'); 
                
                if (token) {
                    const userRes = await fetch('http://127.0.0.1:8000/api/clubs/user/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (userRes.ok) {
                        const userData = await userRes.json();
                        // console.log("Dane profilu:", userData);

                        if (userData.club_name) {
                            setUserClub(userData.club_name);
                            setIsLoggedIn(true);
                        } else {
                            console.warn("User zalogowany, brak wybranego klubu.");
                            setIsLoggedIn(true); 
                            setUserClub(null);
                        }
                    }
                }

            } catch (e) {
                console.error("Critical API Error in MapScene:", e);
                setSafetyProps(prev => ({
                    ...prev,
                    statusTitle: "BŁĄD DANYCH",
                    description: "Nie udało się pobrać danych z serwera.",
                    color: "#ef4444" // Red error state
                }));
            }
        };
        initData();
    }, []);

    // 2. AKTUALIZACJA UI STATUSU (Based on Auth)
    useEffect(() => {
        // Jeśli mamy dane, ale user jeszcze nie kliknął "Zlokalizuj",
        // ustawiamy stan oczekiwania.
        if (isLoggedIn && userClub) {
            setSafetyProps({
                title: "TWOJE POŁOŻENIE",
                statusTitle: "OCZEKIWANIE NA LOKALIZACJĘ",
                description: `Ulubiony klub: ${userClub}. Kliknij przycisk 'Zlokalizuj mnie' na mapie.`,
                color: "#6b7280" // Neutralny szary
            });
        } else if (!isLoggedIn) {
            setSafetyProps({
                title: "WITAJ KIBICU",
                statusTitle: "WYMAGANE LOGOWANIE",
                description: "Zaloguj się i wybierz swój ulubiony klub w profilu, aby korzystać z mapy.",
                color: "#6b7280" // Neutralny szary
            });
        }
    }, [isLoggedIn, userClub]);

    // 3. LOGIKA GEOLOKALIZACJI
    const handleLocationFound = (lat: number, lng: number) => {
        if (!userClub) {
            alert("Nie wykryto ulubionego klubu! Zaloguj się.");
            return;
        }

        // Funkcja analyzeSafety zwraca teraz obiekt zawierający 'color'
        const result = analyzeSafety(
            lat, 
            lng, 
            territories, 
            userClub, 
            relationsMap
        );

        setSafetyProps({
            title: "TWOJE POŁOŻENIE",
            statusTitle: result.statusTitle,
            description: result.description,
            color: result.color // Mapujemy kolor zwrócony z logiki biznesowej
        });
    };

    const handleClubSelect = (clubName: string) => {
        const targetTerritory = territories.find(t => t.owner_name === clubName);

        if (targetTerritory && targetTerritory.polygon && targetTerritory.polygon.length > 0) {
            
            const bounds = targetTerritory.polygon.map(coord => [coord[0], coord[1]] as [number, number]);
            
            console.log(`Przelatuję do: ${clubName}`, bounds);
            setFocusBounds(bounds);
            
            const mapElement = document.querySelector('.leaflet-container')?.closest('div');
            if (mapElement) {
                mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            alert(`Nie znaleziono strefy na mapie dla klubu: ${clubName}`);
        }
    };

    return (
        <section className="mx-auto w-5/6 pt-24 pb-20 md:h-5/6">
            <div className="md:mt-16 mx-auto flex flex-col gap-8">
                
                {/* Komponent bezstanowy - przyjmuje propsy wprost */}
                <SafetyCheck 
                    title={safetyProps.title}
                    statusTitle={safetyProps.statusTitle}
                    description={safetyProps.description}
                    color={safetyProps.color}
                />
                
                <Map 
                    territories={territories}
                    userClub={userClub}
                    relationsMap={relationsMap}
                    onLocationFound={handleLocationFound}
                    focusedTerritoryBounds={focusBounds} // <--- Przekazujemy bounds
                />

                <Legend />
                <ClubList onClubSelect={handleClubSelect} />
            </div>
        </section>
    );
};

export default MapScene;