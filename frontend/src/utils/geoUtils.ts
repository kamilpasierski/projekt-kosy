import * as turf from '@turf/turf';

// --- KONFIGURACJA KOLORÓW ---
export const RELATION_COLORS = {
    HOSTILE:  '#ef4444',
    FRIENDLY: '#10b981',
    NEUTRAL:  '#d3d91e',
    DEFAULT:  '#6b7280',
};

// --- TYPY DANYCH ---

// Struktura pojedynczego obszaru z API
export interface TerritoryData {
    id: number;
    polygon: number[][]; // [Lat, Lng]
    owner_name: string | null;
}

// Mapa relacji dla szybkiego wyszukiwania O(1)
export type RelationsMap = Record<string, Record<string, string>>;

// Wynik analizy gotowy do wyświetlenia w komponencie SafetyCheck
export interface SafetyAnalysisResult {
    statusTitle: string;
    description: string;
    isSafe: boolean; 
    owner: string;
    color: string;
}

// --- HELPERY ---

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

    const userPoint = turf.point([userLng, userLat]);
    const foundOwners: string[] = [];
    
    // Priorytety: 3=KOSA, 0=ZGODA, 1=NEUTRAL
    let maxRiskLevel = 1; 
    let worstRelationType = 'NEUTRAL';

    for (const t of territories) {
        if (!t.polygon || !Array.isArray(t.polygon) || t.polygon.length === 0) continue;

        try {
            // Normalizacja: API [Lat, Lng] -> Turf [Lng, Lat]
            const rawCoords = t.polygon.map((c: any) => [c[1], c[0]]);
            let geometry;

            // Naprawa geometrii
            if (rawCoords.length < 3) {
                 const center = turf.point(rawCoords[0]);
                 geometry = turf.circle(center, 2, { units: 'kilometers' }); 
            } else {
                const first = rawCoords[0];
                const last = rawCoords[rawCoords.length - 1];
                const closedCoords = [...rawCoords]; 

                if (first[0] !== last[0] || first[1] !== last[1]) {
                    closedCoords.push(first);
                }
                geometry = turf.polygon([closedCoords]);
            }

            // Sprawdzenie kolizji
            if (geometry && turf.booleanPointInPolygon(userPoint, geometry)) {
                const owner = t.owner_name || 'Nieznany';
                foundOwners.push(owner);

                let risk = 1; 
                let relation = 'NEUTRAL';

                if (owner === myClubName) {
                    risk = 0; 
                    relation = 'FRIENDLY';
                } else {
                    const dbRel = relationsMap[myClubName]?.[owner]?.toUpperCase();
                    
                    if (dbRel === 'KOSA') { 
                        risk = 3; 
                        relation = 'HOSTILE'; 
                    } else if (dbRel === 'ZGODA') { 
                        risk = 0; 
                        relation = 'FRIENDLY'; 
                    }
                }

                if (risk > maxRiskLevel) {
                    maxRiskLevel = risk;
                    worstRelationType = relation;
                }
            }
        } catch (e) {
            console.warn(`Błąd geometrii dla terenu ID ${t.id}`, e);
        }
    }

    // --- WYNIK ---
    
    const ownersStr = [...new Set(foundOwners)].join(' & ');
    const displayOwner = ownersStr || 'Teren nieznany';

    if (foundOwners.length === 0) {
        return {
            statusTitle: "TEREN NEUTRALNY",
            description: "Znajdujesz się poza znanymi strefami wpływów. Brak aktywnych grup w pobliżu.",
            isSafe: true,
            owner: '',
            color: RELATION_COLORS.DEFAULT
        };
    }

    // Przypadek 1: KOSA
    if (worstRelationType === 'HOSTILE') {
        return {
            statusTitle: "JESTEŚ ZAGROŻONY!",
            description: `Znajdujesz się na terenie: ${displayOwner}. To wrogie barwy. Zachowaj czujność!`,
            isSafe: false,
            owner: ownersStr,
            color: RELATION_COLORS.HOSTILE
        };
    }

    // Przypadek 2: PRZYJACIEL
    if (worstRelationType === 'FRIENDLY') {
        return {
            statusTitle: "JESTEŚ BEZPIECZNY!",
            description: `Znajdujesz się na terenie: ${displayOwner}. Jesteś u siebie lub wśród przyjaciół.`,
            isSafe: true,
            owner: ownersStr,
            color: RELATION_COLORS.FRIENDLY
        };
    }

    // Przypadek 3: NEUTRALNY
    return {
        statusTitle: "TEREN NEUTRALNY",
        description: `Znajdujesz się na terenie: ${displayOwner}. Relacje są neutralne.`,
        isSafe: true,
        owner: ownersStr,
        color: RELATION_COLORS.NEUTRAL
    };
};