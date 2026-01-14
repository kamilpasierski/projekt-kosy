import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Club, RelationEditorState, RelationType } from "../../types/admin";

// MOCK DATA (tymczasowo w pliku, docelowo z API)
const MOCK_CLUBS: Club[] = [
    { id: 1, name: "Wisła Kraków" },
    { id: 2, name: "Cracovia" },
    { id: 3, name: "Lech Poznań" },
];

const RELATION_OPTIONS: { type: RelationType, color: string }[] = [
    { type: 'KOSA', color: 'bg-red-700' },
    { type: 'ZGODA', color: 'bg-green-600' },
    { type: 'NEUTRALNIE', color: 'bg-yellow-400' },
];

// 1. Definicja interfejsu dla trybu Hybrydowego
interface RelationEditorProps {
    relationId?: number | null; // Opcjonalne: jeśli podane, nadpisuje URL
    onSuccess?: () => void;     // Callback dla Modala
    onCancel?: () => void;      // Callback dla Modala
}

const RelationEditor: React.FC<RelationEditorProps> = ({ 
    relationId: propId, 
    onSuccess, 
    onCancel 
}) => {
    // Hooki routera
    const { id: urlId } = useParams();
    const navigate = useNavigate();

    // 2. Logika unifikacji ID (Priorytet: Props > URL)
    // Jeśli propId jest undefined, sprawdzamy URL. Jeśli jest null, to znaczy "tryb tworzenia w modalu".
    const effectiveId = propId !== undefined ? propId : (urlId ? Number(urlId) : null);
    const isEditMode = effectiveId !== null;

    const [state, setState] = useState<RelationEditorState>({
        clubA: null,
        clubB: null,
        relationType: null,
        description: '',
    });

    // 3. Symulacja pobierania danych (Fetch) w trybie edycji
    useEffect(() => {
        if (isEditMode && effectiveId) {
            console.log(`[Mock Fetch] Pobieranie danych dla relacji ID: ${effectiveId}`);
            // TUTAJ: call do API GET /api/relations/{id}/
            
            // Mockowe wypełnienie formularza dla testu
            // setState({
            //     clubA: MOCK_CLUBS[0],
            //     clubB: MOCK_CLUBS[1],
            //     relationType: 'KOSA',
            //     description: 'Przykładowa edytowana relacja'
            // });
        }
    }, [effectiveId, isEditMode]);

    const handleClubChange = (field: 'clubA' | 'clubB', clubId: string) => {
        const club = MOCK_CLUBS.find(c => c.id === parseInt(clubId));
        setState(prev => ({ ...prev, [field]: club || null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Logika zapisu (API call)
        console.log("Submitting relation payload:", { ...state, id: effectiveId });
        
        // 4. Warunkowa obsługa sukcesu
        if (onSuccess) {
            onSuccess(); // Zamknij modal
        } else {
            alert('Zapisano! Przekierowanie...');
            navigate('/admin/relations'); // Wróć do listy (tryb strony)
        }
    };

    const handleCancel = () => {
        // 5. Warunkowa obsługa anulowania
        if (onCancel) {
            onCancel();
        } else {
            navigate(-1); // Wstecz w historii przeglądarki
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            // Usunięto 'mt-8' i 'mx-auto' dla lepszej responsywności w modalu
            className="w-full p-6 md:p-8 rounded-[30px] shadow-xl bg-color-basic-dark border border-gray-700"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-semibold">
                    {isEditMode ? `EDYCJA RELACJI #${effectiveId}` : 'NOWA RELACJA'}
                </h2>
                {/* Opcjonalny przycisk zamknięcia "X" w prawym rogu, 
                    jeśli nie jest obsługiwany przez wrapper Modala */}
            </div>

            {/* 1. SELEKTORY KLUBÓW */}
            <div className="mb-8">
                <label className="text-white text-base font-medium mb-3 block">Wybierz kluby</label>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    {/* Klub A */}
                    <div className="flex-1 w-full">
                        <select
                            value={state.clubA?.id?.toString() || ''}
                            onChange={(e) => handleClubChange('clubA', e.target.value)}
                            className="w-full h-12 px-4 text-gray-200 text-base rounded-[20px] bg-gray-700 shadow-inner appearance-none focus:ring-2 focus:ring-blue-600 focus:outline-none border-r-[16px] border-transparent"
                        >
                            <option value="" disabled>Klub A</option>
                            {MOCK_CLUBS.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>

                    <span className="text-gray-400 font-bold text-sm">VS</span>

                    {/* Klub B */}
                    <div className="flex-1 w-full">
                        <select
                            value={state.clubB?.id?.toString() || ''}
                            onChange={(e) => handleClubChange('clubB', e.target.value)}
                            className="w-full h-12 px-4 text-gray-200 text-base rounded-[20px] bg-gray-700 shadow-inner appearance-none focus:ring-2 focus:ring-blue-600 focus:outline-none border-r-[16px] border-transparent"
                        >
                            <option value="" disabled>Klub B</option>
                            {MOCK_CLUBS.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 2. TYP RELACJI */}
            <div className="mb-8">
                <label className="text-white text-base font-medium mb-3 block">Typ relacji</label>
                <div className="flex flex-wrap gap-3">
                    {RELATION_OPTIONS.map(option => (
                        <button
                            key={option.type}
                            type="button"
                            onClick={() => setState(prev => ({ ...prev, relationType: option.type }))}
                            className={`
                                flex items-center px-4 py-2 rounded-[20px] transition-all duration-200
                                text-white text-sm font-bold uppercase tracking-wider
                                ${option.color} 
                                ${state.relationType === option.type 
                                    ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-105' 
                                    : 'opacity-70 hover:opacity-100'}
                            `}
                        >
                            {option.type}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. OPIS */}
            <div className="mb-8">
                <label className="text-white text-base font-medium mb-3 block">Opis</label>
                <textarea
                    value={state.description}
                    onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Opisz nową relację...."
                    rows={4}
                    className="w-full p-4 text-gray-200 text-base rounded-[20px] bg-gray-700 shadow-inner resize-none focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-gray-500"
                ></textarea>
            </div>

            {/* 4. ACTIONS (Zapisz / Anuluj) */}
            <div className="flex gap-4 pt-4 border-t border-gray-700">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 h-12 bg-transparent border border-gray-600 hover:bg-gray-700 text-gray-300 font-semibold rounded-[25px] transition-colors"
                >
                    Anuluj
                </button>
                <button
                    type="submit"
                    disabled={!state.clubA || !state.clubB || !state.relationType}
                    className="flex-[2] h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-[25px] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEditMode ? 'Zapisz zmiany' : 'Utwórz relację'}
                </button>
            </div>
        </form>
    );
};

export default RelationEditor;