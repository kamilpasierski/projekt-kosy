export interface Club {
    id: number;
    name: string;
}

export type RelationType = 'KOSA' | 'ZGODA' | 'NEUTRALNIE';

export interface RelationEditorState {
    clubA: Club | null;
    clubB: Club | null;
    relationType: RelationType | null;
    description: string;
}

export interface TicketDTO {
    pk: number;
    created_at: string;     // Czas zgłoszenia
    user: {                // Zagnieżdżony obiekt użytkownika
        username: string;
    };
    club_a: {              // Zagnieżdżony obiekt klubu A
        name: string;
        logoUrl: string;
    };
    club_b: {              // Zagnieżdżony obiekt klubu B
        name: string;
        logoUrl: string;
    };
    relation: RelationType | string;
    description: string;    // Pełny opis zgłoszenia
}