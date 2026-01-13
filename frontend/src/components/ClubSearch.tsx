import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ClubSearch() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const API_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                try {
                    const response = await axios.get<string[]>(`${API_URL}/clubs/autocomplete/?q=${query}`);
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

    const handleSelect = (clubName: string) => {
        setQuery(clubName);
        setIsOpen(false);
        console.log("Wybrano:", clubName);
        // Tu później dodam: navigate(`/club/${id}`)
    };

    return (
        <div ref={wrapperRef} className="relative w-full flex-1">
            
            {/* --- INPUT STYLIZOWANY NA BUTTON Z FIGMY --- */}
            <div className="flex h-[59px] items-center gap-4 rounded-[50px] bg-[#343434] px-6 transition-colors focus-within:bg-[#404040] hover:bg-[#404040]">
                
                {/* Ikona (z kodu) */}
                <svg className="h-6 w-6 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>

                {/* Input zastępujący span "Nazwa klubu" */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nazwa klubu"
                    className="flex-1 bg-transparent font-['Montserrat'] text-[16px] font-medium text-white placeholder-gray-400 outline-none w-full"
                />
            </div>

            {/* --- DROPDOWN LISTA --- */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute left-0 top-[65px] z-50 w-full overflow-hidden rounded-[20px] border border-[#444] bg-[#2a2a2a] shadow-xl">
                    <ul className="max-h-[200px] overflow-y-auto py-2">
                        {suggestions.map((club, index) => (
                            <li 
                                key={index}
                                onClick={() => handleSelect(club)}
                                className="cursor-pointer px-6 py-3 font-['Montserrat'] text-[14px] text-white hover:bg-[#343434] transition-colors"
                            >
                                {club}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}