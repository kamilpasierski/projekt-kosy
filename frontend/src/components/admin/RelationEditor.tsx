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
    { type: 'kosa', label: 'KOSA', color: 'bg-[#CB0000]' },
    { type: 'zgoda', label: 'ZGODA', color: 'bg-[#20CA5F]' },
    { type: 'neutralnie', label: 'NEUTRALNIE', color: 'bg-[#FBF201]' },
];

interface RelationEditorProps {
    relationId?: number | null;
    onSuccess?: () => void;
    onCancel?: () => void;
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

    const [availableClubs, setAvailableClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [resolvedCount, setResolvedCount] = useState<number>(0);

    const [selectedClubA, setSelectedClubA] = useState<string>('');
    const [selectedClubB, setSelectedClubB] = useState<string>('');
    const [relationType, setRelationType] = useState<RelationType | null>(null);
    const [description, setDescription] = useState('');

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
            description: description
        };

        try {
            if (isDirectMode) {
                const response = await relationsApi.updateRelationDirectly(payload);
                if (response && typeof response.tickets_resolved === 'number') {
                    setResolvedCount(response.tickets_resolved);
                }
            } else {
                await relationsApi.createTicket(payload);
            }
            setIsSuccess(true);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const data = error.response.data;
                setErrorMessage(typeof data === 'string' ? data : "Wystąpił błąd zapisu.");
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
        if (onSuccess) onSuccess();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        else navigate(-1);
    };

    const titleText = isDirectMode
        ? (isEditMode ? `EDYCJA RELACJI #${effectiveId}` : 'EDYTOR RELACJI')
        : (isEditMode ? `EDYCJA ZGŁOSZENIA` : 'NOWA RELACJA (ZGŁOSZENIE)');

    const buttonText = isLoading
        ? 'Zapisywanie...'
        : (isDirectMode ? 'Zapisz w bazie i zamknij zgłoszenie' : 'Wyślij zgłoszenie');

    const successTitle = isDirectMode ? "Baza zaktualizowana!" : "Ticket utworzony!";

    let successDesc = "Twoje zgłoszenie relacji zostało wysłane do akceptacji.";
    if (isDirectMode) {
        successDesc = "Zmiany zostały wprowadzone bezpośrednio do bazy danych.";
        if (resolvedCount > 0) {
            successDesc += ` System automatycznie zamknął ${resolvedCount} oczekujących zgłoszeń dla tej pary klubów.`;
        }
    }

    const descPlaceholder = isDirectMode
        ? "Wpisz powód zmiany / komentarz dla użytkowników (np. 'Potwierdzone info')..."
        : "Opisz nową relację...";

    if (isSuccess) {
        return (
            <div className="w-full max-w-[1180px] mx-auto mt-[50px] font-montserrat antialiased">
                <div className="w-full bg-[#2A2A2A] rounded-[30px] border-[0.5px] border-[#222629] p-12 flex flex-col items-center justify-center text-center shadow-[0_7px_9.9px_rgba(0,0,0,0.25)] min-h-[350px]">
                    <div className={`w-20 h-20 ${isDirectMode ? 'bg-blue-600' : 'bg-green-600'} rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce`}>
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{successTitle}</h2>
                    <p className="text-base text-gray-300 mb-8 max-w-md leading-relaxed">{successDesc}</p>
                    <button onClick={handleCloseSuccess} className="px-12 py-3 bg-[#274FDE] hover:bg-[#1e3fbd] text-white font-bold rounded-[50px] transition-all transform hover:scale-105 shadow-lg">OK</button>
                </div>
            </div>
        );
    }

    return (
        /* GŁÓWNY KONTENER: 1180px, 50px od góry */
        <div className="w-full max-w-[1180px] mx-auto mt-[50px] mb-12 font-montserrat antialiased">

            {/* Tytuł: 10px odstępu do ramki */}
            <h2 className="text-[20px] font-medium uppercase text-white py-10 tracking-normal">
                {titleText}
            </h2>

            <form
                onSubmit={handleSubmit}
                /* Baner: shadow 0 7 9.9 25% black */
                className="w-full bg-[#2A2A2A] rounded-[30px] border-[0.5px] border-[#222629] shadow-[0_7px_9.9px_rgba(0,0,0,0.25)] pt-10 px-10 pb-8 relative overflow-hidden"
            >
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="text-white font-bold animate-pulse">Przetwarzanie...</div>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-8 p-4 bg-red-900/40 border border-red-500 rounded-[20px] text-red-100 text-sm">
                        ⚠️ {errorMessage}
                    </div>
                )}

                {/* WYBÓR KLUBÓW */}
                <div className="mb-10">
                    <label className="text-white text-[16px] font-medium mb-4 block">Wybierz kluby</label>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 w-full relative">
                            <select
                                value={selectedClubA}
                                onChange={(e) => setSelectedClubA(e.target.value)}
                                className="w-full h-[48px] px-6 text-white text-[16px] rounded-[50px] bg-[#464646] appearance-none focus:ring-2 focus:ring-[#274FDE] outline-none border-none shadow-inner cursor-pointer"
                            >
                                <option value="" disabled>Klub A</option>
                                {availableClubs.map(club => (
                                    <option key={club.id} value={club.id}>{club.name}</option>
                                ))}
                            </select>
                        </div>

                        <span className="text-white font-bold text-[16px] uppercase">vs</span>

                        <div className="flex-1 w-full relative">
                            <select
                                value={selectedClubB}
                                onChange={(e) => setSelectedClubB(e.target.value)}
                                className="w-full h-[48px] px-6 text-white text-[16px] rounded-[50px] bg-[#464646] appearance-none focus:ring-2 focus:ring-[#274FDE] outline-none border-none shadow-inner cursor-pointer"
                            >
                                <option value="" disabled>Klub B</option>
                                {availableClubs.map(club => (
                                    <option key={club.id} value={club.id}>{club.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* TYP RELACJI - Szara "ramka" i szary buton pojawiają się tylko po kliknięciu */}
                <div className="mb-10">
                    <label className="text-white text-[16px] font-medium mb-4 block">Typ relacji</label>
                    <div className="flex flex-wrap gap-10">
                        {RELATION_OPTIONS.map(option => (
                            <button
                                key={option.type}
                                type="button"
                                onClick={() => setRelationType(option.type)}
                                className={`
                                    flex items-center gap-3 h-[56px] px-6 rounded-[50px] transition-all duration-200
                                    text-white text-[16px] font-medium uppercase tracking-wider
                                    ${relationType === option.type
                                        ? 'bg-[#3A3A3A] ring-2 ring-gray-500 ring-offset-2 ring-offset-[#2A2A2A]'
                                        : 'bg-transparent border-none'}
                                `}
                            >
                                <div className={`w-[28px] h-[28px] rounded-full ${option.color}`} />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* OPIS - SKRÓCONY DO 120px */}
                <div className="mb-4">
                    <label className="text-white text-[16px] font-medium mb-4 block">
                        {isDirectMode ? "Komentarz dla zgłaszających" : "Opis"}
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={descPlaceholder}
                        className="w-full h-[120px] p-6 text-white text-[16px] rounded-[30px] bg-[#464646] shadow-inner resize-none focus:ring-2 focus:ring-[#274FDE] outline-none placeholder-gray-500"
                    ></textarea>
                </div>

                {/* ACTIONS - Sentence Case, mt-0 */}
                <div className="flex flex-row gap-6 mt-0">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 h-[55px] bg-transparent border border-gray-600 hover:bg-white/5 text-gray-300 font-bold rounded-[50px] transition-all disabled:opacity-50 text-[16px]"
                    >
                        Anuluj
                    </button>
                    <button
                        type="submit"
                        disabled={!selectedClubA || !selectedClubB || !relationType || isLoading}
                        className="flex-[2] h-[55px] bg-[#274FDE] hover:bg-[#1e3fbd] text-white font-bold rounded-[50px] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[16px]"
                    >
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RelationEditor;