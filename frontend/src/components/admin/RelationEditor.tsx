import React, { useState } from 'react';
import type { Club, RelationEditorState, RelationType } from "../../types/admin.ts";

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

const RelationEditor: React.FC = () => {
    const [state, setState] = useState<RelationEditorState>({
        clubA: null,
        clubB: null,
        relationType: null,
        description: '',
    });

    const handleClubChange = (field: 'clubA' | 'clubB', clubId: string) => {
        const club = MOCK_CLUBS.find(c => c.id === parseInt(clubId));
        setState(prev => ({ ...prev, [field]: club || null }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting relation:", state);
        // TUTAJ nastąpiłby call do DRF POST /api/relations/
        alert(`Zapisywanie relacji: ${state.clubA?.name} vs ${state.clubB?.name} jako ${state.relationType}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-full lg:max-w-[1200px] p-8 rounded-[30px] shadow-2xl bg-gray-800 border border-gray-700"
        >
            <h2 className="text-white text-xl font-semibold mb-6">EDYCJA RELACJI</h2>

            {/* 1. SELEKTORY KLUBÓW (Klub A vs Klub B) */}
            <div className="mb-8">
                <label className="text-white text-base font-medium mb-3 block">Wybierz klub</label>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">

                    {/* Klub A */}
                    <div className="flex-1 w-full relative">
                        <select
                            value={state.clubA?.id?.toString() || ''}
                            onChange={(e) => handleClubChange('clubA', e.target.value)}
                            className="w-full h-12 px-5 text-gray-400 text-base rounded-[50px] bg-gray-700 shadow-inner appearance-none pr-10 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                        >
                            <option value="" disabled>Klub A</option>
                            {MOCK_CLUBS.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                        {/* Placeholder 'vs' */}
                    </div>

                    <span className="text-white text-lg font-medium">vs</span>

                    {/* Klub B */}
                    <div className="flex-1 w-full relative">
                        <select
                            value={state.clubB?.id?.toString() || ''}
                            onChange={(e) => handleClubChange('clubB', e.target.value)}
                            className="w-full h-12 px-5 text-gray-400 text-base rounded-[50px] bg-gray-700 shadow-inner appearance-none pr-10 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                        >
                            <option value="" disabled>Klub B</option>
                            {MOCK_CLUBS.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>

            {/* 2. TYP RELACJI (KOSA, ZGODA, NEUTRALNIE) */}
            <div className="mb-8">
                <label className="text-white text-base font-medium mb-3 block">Typ relacji</label>
                <div className="flex flex-wrap gap-4">
                    {RELATION_OPTIONS.map(option => (
                        <button
                            key={option.type}
                            type="button"
                            onClick={() => setState(prev => ({ ...prev, relationType: option.type }))}
                            className={`
                                flex items-center px-6 py-3 rounded-[30px] shadow-lg transition-all duration-200
                                text-white text-base font-medium uppercase
                                ${option.color} 
                                ${state.relationType === option.type ? 'ring-4 ring-offset-2 ring-offset-gray-800 ring-blue-500' : 'bg-opacity-80 hover:bg-opacity-100'}
                            `}
                        >
                            <div className={`w-6 h-6 rounded-full shadow-inner mr-3 ${option.color} border-2 border-white/50`}></div>
                            {option.type}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. OPIS */}
            <div className="mb-10">
                <label className="text-white text-base font-medium mb-3 block">Opis</label>
                <textarea
                    value={state.description}
                    onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Opisz nową relację...."
                    rows={6}
                    className="w-full h-64 p-8 text-gray-200 text-base font-medium rounded-[50px] bg-gray-700 shadow-inner resize-none focus:ring-blue-600 focus:border-blue-600 focus:outline-none placeholder-gray-400"
                ></textarea>
            </div>

            {/* 4. PRZYCISK ZAPISZ */}
            <button
                type="submit"
                disabled={!state.clubA || !state.clubB || !state.relationType}
                className="w-full h-14 bg-blue-700 hover:bg-blue-600 text-white text-lg font-semibold rounded-[50px] shadow-lg transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                Zapisz relację
            </button>
        </form>
    );
};

export default RelationEditor;