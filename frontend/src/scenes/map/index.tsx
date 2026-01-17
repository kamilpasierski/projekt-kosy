import { useState, useEffect } from 'react';
import Map from '../../components/map/Map';
import SafetyCheck from '../../components/map/SafetyCheck';
import Legend from '../../components/map/Legend';
import ClubList from '../../components/map/ClubList';

// Importy logiki biznesowej
import { 
    analyzeSafety, 
    parseRelationsToMap, 
    type TerritoryData, 
    type RelationsMap 
} from '../../utils/geoUtils';

const MapScene = () => {
    // --- STANY DANYCH ---
    const [territories, setTerritories] = useState<TerritoryData[]>([]);
    const [relationsMap, setRelationsMap] = useState<RelationsMap>({});

    // --- STAN UŻYTKOWNIKA ---
    const [userClub, setUserClub] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // --- STAN UI (Dla SafetyCheck) ---
    const [safetyProps, setSafetyProps] = useState({
        title: "WITAJ KIBICU",
        statusTitle: "ŁADOWANIE DANYCH...",
        description: "Pobieramy informacje o strefach i Twoim profilu.",
        isSafe: true
    });

    // POBIERANIE WSZYSTKICH DANYCH (Init)
    useEffect(() => {
        const initData = async () => {
            try {
                // POBIERAMY DANE PUBLICZNE (Obszary i Relacje)
                const [areasRes, relRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/area/'),
                    fetch('http://127.0.0.1:8000/api/relations/')
                ]);

                const areas = await areasRes.json();
                const rels = await relRes.json();

                setTerritories(areas);
                setRelationsMap(parseRelationsToMap(rels));

                // POBIERAMY DANE UŻYTKOWNIKA
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
                        console.log("Dane profilu:", userData);

                        // Logika obsługi NULL-a
                        if (userData.club_name) {
                            setUserClub(userData.club_name);
                            setIsLoggedIn(true);
                        } else {
                            console.warn("User zalogowany, ale nie wybrał klubu.");
                            setIsLoggedIn(true); 
                            setUserClub(null);
                        }
                    }
                }

            } catch (e) {
                console.error("Błąd API w MapScene:", e);
            }
        };
        initData();
    }, []);

    // AKTUALIZACJA UI PO ZAŁADOWANIU DANYCH
    useEffect(() => {
        if (isLoggedIn && userClub) {
            setSafetyProps({
                title: "TWOJE POŁOŻENIE",
                statusTitle: "OCZEKIWANIE NA LOKALIZACJĘ",
                description: `Wybrany klub: ${userClub}. Kliknij przycisk 'Zlokalizuj mnie'.`,
                isSafe: true
            });
        } else {
            setSafetyProps({
                title: "WITAJ KIBICU",
                statusTitle: "WYMAGANE LOGOWANIE",
                description: "Zaloguj się i wybierz swój ulubiony klub w profilu, aby korzystać z mapy.",
                isSafe: true
            });
        }
    }, [isLoggedIn, userClub]);

    // LOGIKA: Co robimy, gdy Mapa zgłosi "Mam lokalizację!"
    const handleLocationFound = (lat: number, lng: number) => {
        if (!userClub) {
            alert("Nie wykryto ulubionego klubu! Zaloguj się.");
            return;
        }

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
            isSafe: result.isSafe
        });
    };

    return (
        <section className="mx-auto w-5/6 pt-24 pb-20 md:h-5/6">
            <div className="md:mt-16 mx-auto flex flex-col gap-8">
                
                <SafetyCheck 
                    title={safetyProps.title}
                    statusTitle={safetyProps.statusTitle}
                    description={safetyProps.description}
                    isSafe={safetyProps.isSafe}
                />
                
                <Map 
                    territories={territories}
                    userClub={userClub}
                    onLocationFound={handleLocationFound}
                />

                <Legend />
                <ClubList />
                
            </div>
        </section>
    );
};

export default MapScene;