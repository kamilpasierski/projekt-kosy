import { useState, useEffect } from "react";

// Typy - to jest kontrakt, który kiedyś spełni backend
export type RelationStatus = "kosa" | "zgoda" | "neutralnie";

export interface Team {
    id: number;
    name: string;
    logoUrl: string; // Tu wstawisz placeholder albo URL do swojego assets
    relation: RelationStatus;
}

export interface Match {
    id: number;
    date: string;
    leagueName: string;
    gameweek: number;
    homeTeam: Team;
    awayTeam: Team;
}

const MOCK_DATA: Match[] = [
    {
        id: 1,
        date: "2025-11-22T20:15:00",
        leagueName: "PKO Ekstraklasa",
        gameweek: 16,
        homeTeam: {
            id: 101,
            name: "Legia Warszawa",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Legia_Warszawa.svg",
            relation: "neutralnie",
        },
        awayTeam: {
            id: 202,
            name: "Lechia Gdańsk",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Lechia_Gda%C5%84sk.svg",
            relation: "kosa",
        },
    },
    {
        id: 2,
        date: "2025-11-29T17:30:00",
        leagueName: "PKO Ekstraklasa",
        gameweek: 17,
        homeTeam: {
            id: 101,
            name: "Legia Warszawa",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Legia_Warszawa.svg",
            relation: "neutralnie",
        },
        awayTeam: {
            id: 303,
            name: "Zagłębie Sosnowiec",
            logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/52/Zaglebie_Sosnowiec_logo.svg",
            relation: "zgoda",
        },
    },
];

export const useMatches = () => {
    const [data, setData] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Symulacja zapytania do API (1 sekunda opóźnienia)
        const fetchMatches = async () => {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setData(MOCK_DATA);
            } catch {
                setError("Nie udało się pobrać harmonogramu.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatches();
    }, []);

    return { data, isLoading, error };
};