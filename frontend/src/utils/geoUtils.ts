import * as turf from '@turf/turf';

// --- KONFIGURACJA KOLORÓW ---
export const RELATION_COLORS = {
    HOSTILE:  '#ef4444', // Red-500
    FRIENDLY: '#10b981', // Emerald-500
    NEUTRAL:  '#d3d91e', // Yellow-500 (Jawna neutralność)
    DEFAULT:  '#6b7280', // Gray-500 (Brak danych / Nieznany)
};

// --- TYPY DANYCH ---

export interface TerritoryData {
    id: number;
    polygon: number[][]; // [Lat, Lng]
    owner_name: string | null;
}

export type RelationsMap = Record<string, Record<string, string>>;

export interface SafetyAnalysisResult {
    statusTitle: string;
    description: string;
    isSafe: boolean; 
    owner: string;
    color: string;
}

// --- HELPERY ---

export const parseRelationsToMap = (rawData: { club_a_name: string; club_b_name: string; relation_type: string }[]): RelationsMap => {
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
    
    // Priorytety ryzyka:
    // 3 = HOSTILE (Kosa)
    // 2 = NEUTRAL (Jawna relacja neutralna)
    // 1 = UNKNOWN (Brak danych w bazie - Szary)
    // 0 = FRIENDLY (Mój klub lub Zgoda)
    let maxRiskLevel = -1; 
    let worstRelationType = 'UNKNOWN';

    for (const t of territories) {
        if (!t.polygon || !Array.isArray(t.polygon) || t.polygon.length === 0) continue;

        try {
            // Normalizacja: API [Lat, Lng] -> Turf [Lng, Lat]
            const rawCoords = t.polygon.map((c: number[]) => [c[1], c[0]]);
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

                let risk = 1; // Domyślnie UNKNOWN (Brak danych)
                let relation = 'UNKNOWN';

                if (owner === myClubName) {
                    risk = 0; 
                    relation = 'FRIENDLY';
                } else {
                    const dbRel = relationsMap[myClubName]?.[owner]?.toUpperCase();
                    
                    if (dbRel === 'KOSA') { 
                        risk = 3; 
                        relation = 'HOSTILE'; 
                    } 
                    else if (dbRel === 'NEUTRALNIE') { // Musi być jawnie w bazie jako NEUTRALNIE
                        risk = 2;
                        relation = 'NEUTRAL';
                    }
                    else if (dbRel === 'ZGODA' || dbRel === 'UKŁAD') { 
                        risk = 0; 
                        relation = 'FRIENDLY'; 
                    }
                    else {
                        // Brak wpisu w bazie relacji = Szary
                        risk = 1;
                        relation = 'UNKNOWN';
                    }
                }

                // Aktualizacja globalnego statusu (bierzemy najgorszą opcję)
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

    // Przypadek 0: Nie jesteś na żadnym terenie
    if (foundOwners.length === 0) {
        return {
            statusTitle: "TEREN NIEZNANY",
            description: "Znajdujesz się poza znanymi strefami wpływów. Brak aktywnych grup w pobliżu.",
            isSafe: true,
            owner: '',
            color: RELATION_COLORS.DEFAULT // Szary
        };
    }

    // Przypadek 1: KOSA (Priorytet 3)
    if (worstRelationType === 'HOSTILE') {
        return {
            statusTitle: "JESTEŚ ZAGROŻONY!",
            description: `Znajdujesz się na terenie: ${displayOwner}. To wrogie barwy. Zachowaj czujność!`,
            isSafe: false,
            owner: ownersStr,
            color: RELATION_COLORS.HOSTILE // Czerwony
        };
    }

    // Przypadek 2: NEUTRALNY (Priorytet 2 - tylko jeśli w bazie jest relacja NEUTRALNIE)
    if (worstRelationType === 'NEUTRAL') {
        return {
            statusTitle: "TEREN NEUTRALNY",
            description: `Znajdujesz się na terenie: ${displayOwner}. Relacje są neutralne.`,
            isSafe: true,
            owner: ownersStr,
            color: RELATION_COLORS.NEUTRAL // Żółty
        };
    }

    // Przypadek 3: UNKNOWN / BRAK DANYCH (Priorytet 1)
    // To łapie sytuację, gdy jesteś na terenie klubu X, ale nie masz z nim zdefiniowanej relacji
    if (worstRelationType === 'UNKNOWN') {
        return {
            statusTitle: "STATUS NIEZNANY",
            description: `Znajdujesz się na terenie: ${displayOwner}. Brak danych o relacjach z tym klubem.`,
            isSafe: true, // Zakładamy true, ale kolor szary ostrzega
            owner: ownersStr,
            color: RELATION_COLORS.DEFAULT // Szary
        };
    }

    // Przypadek 4: PRZYJACIEL (Priorytet 0)
    return {
        statusTitle: "JESTEŚ BEZPIECZNY!",
        description: `Znajdujesz się na terenie: ${displayOwner}. Jesteś u siebie lub wśród przyjaciół.`,
        isSafe: true,
        owner: ownersStr,
        color: RELATION_COLORS.FRIENDLY // Zielony
    };
};