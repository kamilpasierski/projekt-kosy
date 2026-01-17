import * as turf from '@turf/turf';

// --- TYPY DANYCH ---

// Struktura pojedynczego obszaru z API
export interface TerritoryData {
    id: number;
    polygon: number[][]; // [Lat, Lng]
    owner_name: string | null;
}

// Mapa relacji dla szybkiego wyszukiwania O(1)
// Struktura: { "Legia": { "Lech": "KOSA", "Zagłębie": "ZGODA" } }
export type RelationsMap = Record<string, Record<string, string>>;

// Wynik analizy gotowy do wyświetlenia w komponencie SafetyCheck
export interface SafetyAnalysisResult {
    statusTitle: string;
    description: string;
    isSafe: boolean;
    owner: string;
}

// --- HELPERY ---

// Funkcja parsująca surową listę relacji z API na mapę
export const parseRelationsToMap = (rawData: any[]): RelationsMap => {
    const map: RelationsMap = {};
    
    rawData.forEach(rel => {
        const { club_a_name, club_b_name, relation_type } = rel;
        
        if (!map[club_a_name]) map[club_a_name] = {};
        if (!map[club_b_name]) map[club_b_name] = {};
        
        map[club_a_name][club_b_name] = relation_type;
        map[club_b_name][club_a_name] = relation_type;
    });

    return map;
};

// --- GŁÓWNA LOGIKA ANALIZY ---

export const analyzeSafety = (
    userLat: number,
    userLng: number,
    territories: TerritoryData[],
    myClubName: string,
    relationsMap: RelationsMap
): SafetyAnalysisResult => {

    const userPoint = turf.point([userLng, userLat]); // Turf [Lng, Lat]
    const foundOwners: string[] = [];
    
    // System priorytetów: Jeśli stoisz na terenie neutralnym I wrogim, to wygrywa wrogi (3)
    // 3 = HOSTILE (Kosa)
    // 2 = UNKNOWN (Brak danych)
    // 1 = NEUTRAL (Neutralnie)
    // 0 = FRIENDLY (Mój klub lub Zgoda)
    let maxRiskLevel = 1; // Domyślnie startujemy od Neutral
    let worstRelationType = 'NEUTRAL';

    for (const t of territories) {
        // Pomijamy puste lub uszkodzone dane
        if (!t.polygon || !Array.isArray(t.polygon) || t.polygon.length === 0) continue;

        try {
            // Normalizacja danych z API
            // API wysyła [Lat, Lng], Turf wymaga [Lng, Lat]. Musimy to zamienić (swap).
            const rawCoords = t.polygon.map((c: any) => [c[1], c[0]]);

            let geometry;

            // Naprawa Geometrii ("Kuloodporność")
            if (rawCoords.length < 3) {
                 // Jeśli mniej niż 3 punkty -> Traktujemy jak punkt centralny i robimy wokół niego okrąg
                 // Promień np. 2km (w stopniach ok. 0.02 - 0.03,)
                 const center = turf.point(rawCoords[0]);
                 geometry = turf.circle(center, 2, { units: 'kilometers' }); 
            } else {
                // Jeśli to poligon, musi być domknięty (pierwszy punkt == ostatni)
                const first = rawCoords[0];
                const last = rawCoords[rawCoords.length - 1];
                
                // Kopiujemy tablicę, żeby nie modyfikować oryginału w React State
                const closedCoords = [...rawCoords]; 

                if (first[0] !== last[0] || first[1] !== last[1]) {
                    closedCoords.push(first);
                }

                geometry = turf.polygon([closedCoords]);
            }

            // Sprawdzenie czy użytkownik jest w środku
            if (geometry && turf.booleanPointInPolygon(userPoint, geometry)) {
                const owner = t.owner_name || 'Nieznany';
                foundOwners.push(owner);

                // Analiza relacji
                let risk = 1; 
                let relation = 'NEUTRAL';

                if (owner === myClubName) {
                    risk = 0; 
                    relation = 'FRIENDLY';
                } else {
                    // Sprawdzamy w mapie relacji
                    // Używamy toUpperCase() dla bezpieczeństwa
                    const dbRel = relationsMap[myClubName]?.[owner]?.toUpperCase();
                    
                    if (dbRel === 'KOSA') { 
                        risk = 3; 
                        relation = 'HOSTILE'; 
                    } else if (dbRel === 'ZGODA' || dbRel === 'UKŁAD') { 
                        risk = 0; 
                        relation = 'FRIENDLY'; 
                    }
                }

                // Aktualizujemy globalny status, jeśli znaleziono coś gorszego
                if (risk > maxRiskLevel) {
                    maxRiskLevel = risk;
                    worstRelationType = relation;
                }
            }

        } catch (e) {
            // Ignorujemy błędy pojedynczych poligonów, żeby nie wywalić całej mapy
            console.warn(`Błąd geometrii dla terenu ID ${t.id}`, e);
        }
    }

    // --- GENEROWANIE WYNIKU DLA UI ---
    
    // Łączymy nazwy właścicieli
    const ownersStr = [...new Set(foundOwners)].join(' & ');
    const displayOwner = ownersStr || 'Teren nieznany';

    // Przypadek 0: Nie znaleziono żadnego terenu
    if (foundOwners.length === 0) {
        return {
            statusTitle: "TEREN NEUTRALNY",
            description: "Znajdujesz się poza znanymi strefami wpływów. Brak aktywnych grup w pobliżu.",
            isSafe: true,
            owner: ''
        };
    }

    // Przypadek 1: KOSA (Najwyższy priorytet)
    if (worstRelationType === 'HOSTILE') {
        return {
            statusTitle: "JESTEŚ ZAGROŻONY!",
            description: `Znajdujesz się na terenie: ${displayOwner}. To wrogie barwy (KOSA). Zachowaj czujność!`,
            isSafe: false,
            owner: ownersStr
        };
    }

    // Przypadek 2: PRZYJACIEL (Mój klub lub Zgoda)
    if (worstRelationType === 'FRIENDLY') {
        return {
            statusTitle: "JESTEŚ BEZPIECZNY!",
            description: `Znajdujesz się na terenie: ${displayOwner}. Jesteś u siebie lub wśród przyjaciół.`,
            isSafe: true,
            owner: ownersStr
        };
    }

    // Przypadek 3: NEUTRALNY (Inny klub, ale bez kosy)
    return {
        statusTitle: "TEREN NEUTRALNY",
        description: `Znajdujesz się na terenie: ${displayOwner}. Relacje są neutralne.`,
        isSafe: true,
        owner: ownersStr
    };
};