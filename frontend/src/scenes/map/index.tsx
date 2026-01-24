import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import LazyMap from '../../components/map/LazyMap';
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
    description: string | ReactNode;
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
    const [isLoading, setIsLoading] = useState(true);

    // --- STAN UI (SafetyCheck) ---
    const [safetyProps, setSafetyProps] = useState<SafetyState>({
        title: "WITAJ KIBICU",
        statusTitle: "ŁADOWANIE DANYCH...",
        description: "Pobieramy informacje o strefach.",
        color: "#6b7280"
    });

    // 1. POBIERANIE DANYCH (Init)
    useEffect(() => {
        const initData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                
                // Show loading message for logged in users
                if (token) {
                    setSafetyProps({
                        title: "WITAJ KIBICU",
                        statusTitle: "ŁADOWANIE RELACJI...",
                        description: "Pobieramy informacje o Twoim profilu i relacjach klubowych.",
                        color: "#6b7280"
                    });
                }
                
                const [areasRes, relRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/area/'),
                    fetch('http://127.0.0.1:8000/api/relations/')
                ]);
                const areas = await areasRes.json();
                const rels = await relRes.json();
                setTerritories(areas);
                setRelationsMap(parseRelationsToMap(rels));
                
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
                        if (userData.club_name) {
                            setUserClub(userData.club_name);
                            setIsLoggedIn(true);
                        } else {
                            setIsLoggedIn(true);
                            setUserClub(null);
                        }
                    }
                }
                setIsLoading(false);
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
        if (isLoading) return; // Don't update while loading
        
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
                description: (
                    <span>
                        <a href="/auth" className="text-[#274fde] hover:underline font-semibold">Zaloguj się</a>
                        {' '}i wybierz swój ulubiony klub w profilu, aby korzystać z mapy.
                    </span>
                ),
                color: "#6b7280"
            });
        }
    }, [isLoggedIn, userClub, isLoading]);

    // 3. LOGIKA GEOLOKALIZACJI
    const handleLocationFound = useCallback((lat: number, lng: number) => {
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
    }, [userClub, territories, relationsMap]);

    const handleClubSelect = useCallback((clubName: string) => {
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
    }, [territories]);

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
                    <LazyMap
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