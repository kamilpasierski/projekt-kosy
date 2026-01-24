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
import { API_BASE_URL } from '../../utils/config';

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
                const [areasRes, relRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/area/`),
                    fetch(`${API_BASE_URL}/api/relations/`)
                ]);
                const areas = await areasRes.json();
                const rels = await relRes.json();
                setTerritories(areas);
                setRelationsMap(parseRelationsToMap(rels));
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const userRes = await fetch(`${API_BASE_URL}/api/clubs/user/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        if (userData.club_name) {
                            setUserClub(userData.club_name);
                            setIsLoggedIn(true);
                        } else {
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
                    color: "#ef4444"
                }));
            }
        };
        initData();
    }, []);

    // 2. AKTUALIZACJA UI STATUSU
    useEffect(() => {
        if (isLoggedIn && userClub) {
            setSafetyProps({
                title: "TWOJE POŁOŻENIE",
                statusTitle: "OCZEKIWANIE NA LOKALIZACJĘ",
                description: `Ulubiony klub: ${userClub}. Kliknij przycisk 'Zlokalizuj mnie' na mapie.`,
                color: "#6b7280"
            });
        } else if (!isLoggedIn) {
            setSafetyProps({
                title: "WITAJ KIBICU",
                statusTitle: "WYMAGANE LOGOWANIE",
                description: "Zaloguj się i wybierz swój ulubiony klub w profilu, aby korzystać z mapy.",
                color: "#6b7280"
            });
        }
    }, [isLoggedIn, userClub]);

    // 3. LOGIKA GEOLOKALIZACJI
    const handleLocationFound = (lat: number, lng: number) => {
        if (!userClub) {
            alert("Nie wykryto ulubionego klubu! Zaloguj się.");
            return;
        }
        const result = analyzeSafety(lat, lng, territories, userClub, relationsMap);
        setSafetyProps({
            title: "TWOJE POŁOŻENIE",
            statusTitle: result.statusTitle,
            description: result.description,
            color: result.color
        });
    };

    const handleClubSelect = (clubName: string) => {
        const targetTerritory = territories.find(t => t.owner_name === clubName);
        if (targetTerritory && targetTerritory.polygon && targetTerritory.polygon.length > 0) {
            const bounds = targetTerritory.polygon.map(coord => [coord[0], coord[1]] as [number, number]);
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
        /* Zastosowano page-container dla szerokości 1180px.
           Zachowano oryginalne pt-[30px] oraz pb-20. */
        <section className="page-container pt-[30px] pb-20 antialiased">
            <div className="flex flex-col">

                {/* Zachowano odstęp mb-[20px] */}
                <div className="mb-[20px]">
                    <SafetyCheck
                        title={safetyProps.title}
                        statusTitle={safetyProps.statusTitle}
                        description={safetyProps.description}
                        color={safetyProps.color}
                    />
                </div>

                {/* Zachowano odstęp mb-[10px] */}
                <div className="mb-[10px]">
                    <Map
                        territories={territories}
                        userClub={userClub}
                        relationsMap={relationsMap}
                        onLocationFound={handleLocationFound}
                        focusedTerritoryBounds={focusBounds}
                    />
                </div>

                {/* Zachowano odstęp mb-[60px] */}
                <div className="mb-[60px]">
                    <Legend />
                </div>

                {/* Lista klubów rozciągnięta do szerokości kontenera */}
                <div className="w-full">
                    <ClubList onClubSelect={handleClubSelect} />
                </div>

            </div>
        </section>
    );
};

export default MapScene;