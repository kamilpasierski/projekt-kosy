// frontend/src/components/admin/PendingSubmissionsTable.tsx

import React from 'react';
import type { TicketDTO } from '../../types/admin'; // Używamy zaktualizowanego interfejsu
 // Używamy zaktualizowanego interfejsu

// --- DANE MOCKUPOWE (Mockup Data) ---
const MOCK_TICKETS: TicketDTO[] = [
    {
        pk: 1,
        created_at: '2025-12-03T14:30:00Z', // Będziemy formatować
        user: { username: 'Kibic_AREK' },
        club_a: { name: 'Wisła', logoUrl: '/logos/w.png' }, // Zastąp ścieżki
        club_b: { name: 'Cracovia', logoUrl: '/logos/c.png' }, // Zastąp ścieżki
        relation: 'KOSA',
        description: 'Suggested KOSA relation between Wisla and Cracovia.',
    },
    {
        pk: 2,
        created_at: '2025-12-03T14:30:00Z',
        user: { username: 'Kibic_AREK' },
        club_a: { name: 'Lech', logoUrl: '/logos/l.png' },
        club_b: { name: 'ŁKS', logoUrl: '/logos/lks.png' },
        relation: 'ZGODA',
        description: 'Suggested ZGODA relation between Lech and ŁKS.',
    },
    {
        pk: 3,
        created_at: '2025-12-03T14:30:00Z',
        user: { username: 'Fan_47' },
        club_a: { name: 'Śląsk', logoUrl: '/logos/s.png' },
        club_b: { name: 'Legia', logoUrl: '/logos/leg.png' },
        relation: 'ZGODA',
        description: 'Suggested ZGODA relation between Slask and Legia.',
    },
    {
        pk: 4,
        created_at: '2025-12-03T14:30:00Z',
        user: { username: 'Ultra_99' },
        club_a: { name: 'Pogoń', logoUrl: '/logos/pog.png' },
        club_b: { name: 'Arka', logoUrl: '/logos/ark.png' },
        relation: 'KOSA',
        description: 'Suggested KOSA relation between Pogoń and Arka.',
    },
];

// Funkcja formatująca datę (opcjonalnie, można użyć biblioteki np. date-fns)
const PendingSubmissionsTable: React.FC = () => {
    const tickets: TicketDTO[] = MOCK_TICKETS;
    const formatDate = (isoString: string): string => {
        try {
            const date = new Date(isoString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Miesiące są 0-indeksowane
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${day}.${month}.${year}, ${hours}:${minutes}`;
        } catch (error) {
            console.error("Error parsing date:", error);
            return isoString; // Zwracamy surowy string w przypadku błędu
        }
        };

    return (
        // Główny kontener - RWD friendly, z minimalnym paddingiem i cieniem jak w Figmie
        // Zastępujemy stałe w-[1175px] i h-[518px]
        <div className="mx-auto mt-8 max-w-full lg:max-w-[1200px] p-0 rounded-[30px] shadow-2xl bg-gray-800/90 border-[0.5px] border-blue-700/50">

            {/* Nagłówek wizualny - odpowiada top barowi z Figmy */}
            <div className="px-6 py-4 bg-gray-900 rounded-t-[30px] border-b-[0.5px] border-blue-700">
                <h2 className="text-xl font-bold text-gray-100 uppercase tracking-wider">Oczekujące Zgłoszenia Użytkowników</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">

                    {/* Nagłówki (Headers) - Linię Figmy imitujemy poprzez border-b w thead */}
                    <thead className="bg-gray-800/80">
                    <tr>
                        {/* Używamy klas w-1/6 dla RWD i elastycznego podziału */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">Zgłaszający</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-2/6">Typ zmiany / Sugestia</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-2/6">Akcja</th>
                    </tr>
                    </thead>

                    {/* Ciało tabeli (Body) */}
                    <tbody className="divide-y divide-gray-700/50">
                    {tickets.map((ticket) => (
                        // Rząd - dostosowujemy kolory do UI Figmy
                        <tr key={ticket.pk} className="hover:bg-gray-700/50 transition-colors duration-150">

                            {/* Kolumna: Data */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-300 align-top pt-8">
                                {formatDate(ticket.created_at)}
                            </td>

                            {/* Kolumna: Zgłaszający */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300 font-semibold align-top pt-8">
                                {ticket.user.username}
                            </td>

                            {/* Kolumna: Typ zmiany / Sugestia (Centralny element wizualny) */}
                            <td className="px-6 py-4 text-sm text-gray-300 pt-5">
                                <div className="flex items-center space-x-3">

                                    {/* Logo Klubu A: w-10 h-12 -> h-12 w-10 (dla RWD) + center/cover */}
                                    <img
                                        src={ticket.club_a.logoUrl}
                                        alt={ticket.club_a.name}
                                        className="h-12 w-10 object-cover"
                                    />

                                    {/* Linia/Strzałka Figmy: w-7 h-0 border border-white */}
                                    <span className="text-2xl text-gray-400 font-bold mx-2">
                       &larr; &rarr; {/* Użycie strzałek zamiast skomplikowanej linii CSS */}
                    </span>

                                    {/* Logo Klubu B: w-16 h-16 -> h-16 w-16 (większe, jak w Figmie) */}
                                    <img
                                        src={ticket.club_b.logoUrl}
                                        alt={ticket.club_b.name}
                                        className="h-16 w-16 object-cover"
                                    />

                                    {/* Typ Zmiany (Badge) - Używamy stylów Figmy dla KOSA/ZGODA */}
                                    <div className="ml-8 flex items-center">
                                        {/* Kółko koloru (w-8 h-8) */}
                                        <div className={`w-8 h-8 rounded-full shadow-lg mr-3 ${
                                            ticket.relation === 'KOSA' ? 'bg-red-700' : 'bg-green-600'
                                        }`}></div>

                                        {/* Tekst - w-32 h-10 left-[695px] top-[90px] absolute bg-zinc-800... */}
                                        <span className={`px-4 py-2 text-base font-medium rounded-[30px] text-white ${
                                            ticket.relation === 'KOSA' ? 'bg-red-800/30' : 'bg-green-800/30' // Przezroczyste tło dla czytelności
                                        }`}>
                            {ticket.relation}
                        </span>
                                    </div>
                                </div>
                            </td>

                            {/* Kolumna: Akcja (Przyciski) */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top pt-7">
                                {/* Przycisk Akceptuj - kolory i styl przycisków z Figmy (zielony/czerwony) */}
                                <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 mr-3 transition-colors"
                                >
                                    <span className="mr-1">✔</span> Akceptuj
                                </button>
                                {/* Przycisk Odrzuć */}
                                <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 transition-colors"
                                >
                                    <span className="mr-1">✘</span> Odrzuć
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingSubmissionsTable;