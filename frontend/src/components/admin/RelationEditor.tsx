import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { relationsApi, type Club } from '../../api/relations';

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
}

const RelationEditor: React.FC<RelationEditorProps> = ({ 
    relationId: propId, 
    onSuccess, 
    onCancel 
}) => {
    const { id: urlId } = useParams();
    const navigate = useNavigate();

    const effectiveId = propId !== undefined ? propId : (urlId ? Number(urlId) : null);
    const isEditMode = effectiveId !== null;

    const [availableClubs, setAvailableClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const [isSuccess, setIsSuccess] = useState(false);

    // Stan formularza
    const [selectedClubA, setSelectedClubA] = useState<string>('');
    const [selectedClubB, setSelectedClubB] = useState<string>('');
    const [relationType, setRelationType] = useState<RelationType | null>(null);
    const [description, setDescription] = useState('');

    // --- POBIERANIE DANYCH ---
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

    // --- OBSŁUGA ZAPISU ---
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

        try {
            await relationsApi.createTicket({
                club_a: clubAObj.name,
                club_b: clubBObj.name,
                relation: relationType,
                description: description
            });

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
        if (onSuccess) onSuccess();
        else navigate('/admin/relations');
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        else navigate(-1);
    };

    if (isSuccess) {
        return (
            <div className="w-full p-8 md:p-12 rounded-[30px] shadow-xl bg-color-basic-dark border border-gray-700 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/50 animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ticket utworzony!</h2>
                <p className="text-gray-400 mb-8 max-w-sm">
                    Twoje zgłoszenie relacji zostało wysłane do akceptacji.
                </p>
                <button
                    onClick={handleCloseSuccess}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-[25px] transition-all transform hover:scale-105 shadow-lg"
                >
                    OK, rozumiem
                </button>
            </div>
        );
    }

    // --- WIDOK FORMULARZA ---
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full p-6 md:p-8 rounded-[30px] shadow-xl bg-color-basic-dark border border-gray-700 relative"
        >
             {isLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-[30px] z-50 flex items-center justify-center">
                    <div className="text-white font-bold animate-pulse">Przetwarzanie...</div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-semibold">
                    {isEditMode ? `EDYCJA RELACJI #${effectiveId}` : 'NOWA RELACJA'}
                </h2>
            </div>

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-900/40 border border-red-500 rounded-[20px] text-red-100 text-sm">
                    {errorMessage}
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
                <label className="text-white text-base font-medium mb-3 block">Opis</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opisz nową relację...."
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
                    className="flex-[2] h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-[25px] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Zapisywanie...' : (isEditMode ? 'Zapisz zmiany' : 'Utwórz relację')}
                </button>
            </div>
        </form>
    );
};

export default RelationEditor;