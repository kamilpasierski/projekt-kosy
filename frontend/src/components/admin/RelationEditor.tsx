import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { relationsApi, type Club } from '../../api/relations';

// --- TYPY I STAŁE ---
type RelationType = 'kosa' | 'zgoda' | 'neutralnie';

interface RelationOption {
    type: RelationType;
    label: string;
    color: string;
}

const RELATION_OPTIONS: RelationOption[] = [
    { type: 'kosa', label: 'KOSA', color: 'bg-red-700' },
    { type: 'zgoda', label: 'ZGODA', color: 'bg-green-600' },
    { type: 'neutralnie', label: 'NEUTRALNIE', color: 'bg-yellow-400' },
];

interface RelationEditorProps {
    relationId?: number | null;
    onSuccess?: () => void;
    onCancel?: () => void;
    
    // Czy to tryb administratora (bezpośredni zapis)?
    isDirectMode?: boolean; 
}

const RelationEditor: React.FC<RelationEditorProps> = ({ 
    relationId: propId, 
    onSuccess, 
    onCancel,
    isDirectMode = false 
}) => {
    const { id: urlId } = useParams();
    const navigate = useNavigate();

    const effectiveId = propId !== undefined ? propId : (urlId ? Number(urlId) : null);
    const isEditMode = effectiveId !== null;

    // --- STATE ---
    const [availableClubs, setAvailableClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // NOWY STAN: Liczba automatycznie rozwiązanych zgłoszeń (zwracana przez Backend)
    const [resolvedCount, setResolvedCount] = useState<number>(0);

    // Form State
    const [selectedClubA, setSelectedClubA] = useState<string>('');
    const [selectedClubB, setSelectedClubB] = useState<string>('');
    const [relationType, setRelationType] = useState<RelationType | null>(null);
    const [description, setDescription] = useState('');

    // --- 1. POBIERANIE DANYCH ---
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const data = await relationsApi.getAllClubs();
                setAvailableClubs(data);
            } catch (err) {
                console.error(err);
                setErrorMessage("Nie udało się pobrać listy klubów.");
            }
        };
        fetchClubs();
    }, []);

    // --- 2. OBSŁUGA ZAPISU ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        const clubAObj = availableClubs.find(c => c.id.toString() === selectedClubA);
        const clubBObj = availableClubs.find(c => c.id.toString() === selectedClubB);

        if (!clubAObj || !clubBObj || !relationType) {
            setErrorMessage("Uzupełnij wszystkie wymagane pola.");
            setIsLoading(false);
            return;
        }

        const payload = {
            club_a: clubAObj.name,
            club_b: clubBObj.name,
            relation: relationType,
            description: description // W trybie Admina to jest "admin_response"
        };

        try {
            if (isDirectMode) {
                // Tryb Admina: Zapisuje relację i odbiera info o zamkniętych ticketach
                const response = await relationsApi.updateRelationDirectly(payload);
                
                // Backend zwraca np: { status: "success", tickets_resolved: 5, ... }
                if (response && typeof response.tickets_resolved === 'number') {
                    setResolvedCount(response.tickets_resolved);
                }
            } else {
                // Tryb Usera: Tworzy ticket
                await relationsApi.createTicket(payload);
            }

            setIsSuccess(true);
            
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const data = error.response.data;
                if (data.non_field_errors) {
                    setErrorMessage(data.non_field_errors.join(' '));
                } else if (Array.isArray(data)) {
                    setErrorMessage(data.join(' '));
                } else {
                    const details = Object.entries(data)
                        .map(([key, msg]) => `${key}: ${msg}`)
                        .join(', ');
                    setErrorMessage(details || "Wystąpił błąd walidacji danych.");
                }
            } else {
                setErrorMessage("Błąd połączenia z serwerem.");
            }
        } finally {
            setIsLoading(false);
        }
    };

   const handleCloseSuccess = () => {
        setIsSuccess(false);

        setSelectedClubA('');
        setSelectedClubB('');
        setRelationType(null);
        setDescription('');
        
        setResolvedCount(0);
        
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        else navigate(-1);
    };

    // --- TEKSTY DYNAMICZNE ---
    const titleText = isDirectMode 
        ? (isEditMode ? `EDYCJA RELACJI #${effectiveId}` : 'ZARZĄDZANIE RELACJĄ')
        : (isEditMode ? `EDYCJA ZGŁOSZENIA` : 'NOWA RELACJA (ZGŁOSZENIE)');
        
    const buttonText = isLoading 
        ? 'Zapisywanie...' 
        : (isDirectMode ? 'Zapisz w bazie i zamknij zgłoszenia' : 'Wyślij zgłoszenie');

    const successTitle = isDirectMode ? "Baza zaktualizowana!" : "Ticket utworzony!";
    
    // Dynamiczny opis sukcesu
    let successDesc = "Twoje zgłoszenie relacji zostało wysłane do akceptacji.";
    if (isDirectMode) {
        successDesc = "Zmiany zostały wprowadzone bezpośrednio do bazy danych.";
        if (resolvedCount > 0) {
            successDesc += ` System automatycznie zamknął ${resolvedCount} oczekujących zgłoszeń dla tej pary klubów.`;
        }
    }

    // Placeholder opisu
    const descPlaceholder = isDirectMode 
        ? "Wpisz powód zmiany / komentarz dla użytkowników (np. 'Potwierdzone info')..." 
        : "Opisz nową relację...";

    // --- WIDOK SUKCESU ---
    if (isSuccess) {
        return (
            <div className="w-full p-8 md:p-12 rounded-[30px] shadow-xl bg-color-basic-dark border border-gray-700 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className={`w-20 h-20 ${isDirectMode ? 'bg-blue-600 shadow-blue-900/50' : 'bg-green-600 shadow-green-900/50'} rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{successTitle}</h2>
                <p className="text-gray-300 mb-8 max-w-sm leading-relaxed">
                    {successDesc}
                </p>
                <button
                    onClick={handleCloseSuccess}
                    className={`px-8 py-3 ${isDirectMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'} text-white font-bold rounded-[25px] transition-all transform hover:scale-105 shadow-lg`}
                >
                    OK
                </button>
            </div>
        );
    }

    // --- WIDOK FORMULARZA ---
    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full p-6 md:p-8 rounded-[30px] shadow-xl bg-color-basic-dark border ${isDirectMode ? 'border-blue-500/50' : 'border-gray-700'} relative`}
        >
             {isLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-[30px] z-50 flex items-center justify-center">
                    <div className="text-white font-bold animate-pulse">Przetwarzanie...</div>
                </div>
            )}

            {/* Nagłówek */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${isDirectMode ? 'text-blue-400' : 'text-white'}`}>
                    {titleText}
                </h2>
                {isDirectMode && (
                    <span className="px-3 py-1 bg-blue-900/50 text-blue-200 text-xs font-bold rounded-full border border-blue-500/30">
                        TRYB ADMINA
                    </span>
                )}
            </div>

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-900/40 border border-red-500 rounded-[20px] text-red-100 text-sm">
                    ⚠️ {errorMessage}
                </div>
            )}

            {/* SELEKTORY KLUBÓW */}
            <div className="mb-8">
                <label className="text-white text-base font-medium mb-3 block">Wybierz kluby</label>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1 w-full">
                        <select
                            value={selectedClubA}
                            onChange={(e) => setSelectedClubA(e.target.value)}
                            className="w-full h-12 px-4 text-gray-200 text-base rounded-[20px] bg-gray-700 shadow-inner appearance-none focus:ring-2 focus:ring-blue-600 focus:outline-none border-r-[16px] border-transparent"
                        >
                            <option value="" disabled>Klub A</option>
                            {availableClubs.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>

                    <span className="text-gray-400 font-bold text-sm">VS</span>

                    <div className="flex-1 w-full">
                        <select
                            value={selectedClubB}
                            onChange={(e) => setSelectedClubB(e.target.value)}
                            className="w-full h-12 px-4 text-gray-200 text-base rounded-[20px] bg-gray-700 shadow-inner appearance-none focus:ring-2 focus:ring-blue-600 focus:outline-none border-r-[16px] border-transparent"
                        >
                            <option value="" disabled>Klub B</option>
                            {availableClubs.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* TYP RELACJI */}
            <div className="mb-8">
                <label className="text-white text-base font-medium mb-3 block">Typ relacji</label>
                <div className="flex flex-wrap gap-3">
                    {RELATION_OPTIONS.map(option => (
                        <button
                            key={option.type}
                            type="button"
                            onClick={() => setRelationType(option.type)}
                            className={`
                                flex items-center px-4 py-2 rounded-[20px] transition-all duration-200
                                text-white text-sm font-bold uppercase tracking-wider
                                ${option.color} 
                                ${relationType === option.type 
                                    ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-105' 
                                    : 'opacity-70 hover:opacity-100'}
                            `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* OPIS */}
            <div className="mb-8">
                <label className="text-white text-base font-medium mb-3 block">
                    {isDirectMode ? "Komentarz dla zgłaszających" : "Opis"}
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={descPlaceholder}
                    rows={4}
                    className="w-full p-4 text-gray-200 text-base rounded-[20px] bg-gray-700 shadow-inner resize-none focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-gray-500"
                ></textarea>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 pt-4 border-t border-gray-700">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-transparent border border-gray-600 hover:bg-gray-700 text-gray-300 font-semibold rounded-[25px] transition-colors disabled:opacity-50"
                >
                    Anuluj
                </button>
                <button
                    type="submit"
                    disabled={!selectedClubA || !selectedClubB || !relationType || isLoading}
                    className={`flex-[2] h-12 ${isDirectMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'} text-white font-semibold rounded-[25px] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {buttonText}
                </button>
            </div>
        </form>
    );
};

export default RelationEditor;