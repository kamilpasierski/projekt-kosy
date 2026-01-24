import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../../utils/config';

interface Club {
    id: number;
    name: string;
}

export default function ClubSearch() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Club[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                try {
                    const response = await axios.get<Club[]>(`${API_BASE_URL}/clubs/autocomplete/?q=${query}`);
                    setSuggestions(response.data);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Błąd autocomplete:", error);
                }
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Zamykanie po kliknięciu poza komponent
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = async (club: Club) => {
        setQuery(club.name);
        setIsOpen(false);
        console.log("Wybrano:", club.name);

        // Inkrementuj punkty klubu
        try {
            await axios.post(`${API_BASE_URL}/api/clubs/popular/increment/${club.id}/`);
        } catch (error) {
            console.error("Błąd inkrementacji punktów:", error);
        }

        navigate(`/club/${club.id}`);
    };

    return (
        <div ref={wrapperRef} className="relative w-full flex-1">

            {/* --- INPUT STYLIZOWANY NA BUTTON Z FIGMY --- */}
            <div className="flex h-[55px] md:h-[60px] items-center gap-4 md:gap-4 rounded-[50px] bg-[#2A2A2A] px-4 md:px-6  shadow-[0px_6px_7px_rgba(0,0,0,0.25)]">

                {/* Ikona wyszukiwania */}
                <MagnifyingGlassIcon className="h-5 w-5 md:h-8 md:w-18 flex-shrink-0 text-white" />

                {/* Input zastępujący span "Nazwa klubu" */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Szukaj klubu"
                    className="flex-1 bg-transparent text-sm md:text-[18px] font-medium text-white placeholder-gray-400 outline-none w-full"
                />
            </div>

            {/* --- DROPDOWN LISTA --- */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute left-0 top-[56px] md:top-[65px] z-50 w-full overflow-hidden rounded-[20px] border border-[#444] bg-[#2a2a2a] shadow-xl">
                    <ul className="max-h-[200px] overflow-y-auto py-2">
                        {suggestions.map((club) => (
                            <li
                                key={club.id}
                                onClick={() => handleSelect(club)}
                                className="cursor-pointer px-4 md:px-6 py-2 md:py-3 text-sm md:text-[14px] text-white hover:bg-[#343434] transition-colors"
                            >
                                {club.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}