import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth.ts"; // Hook pozostaje bez zmian
import { BellIcon, UserIcon, ArrowRightStartOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Logo from "@/assets/Logo.png";
import ActionButton from "../../shared/ActionButton.tsx";

const NavbarRigid = () => {
    const navigate = useNavigate();
    
    // TERAZ BIERZEMY USERA Z CONTEXTU
    const { isLoggedIn, logout, user } = useAuth(); 
    
    const isLoggedOut = !isLoggedIn;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    // USUNĄŁEM CAŁY BLOK useEffect Z AXIOS - JUŻ NIEPOTRZEBNY

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const iconContainerStyles = "w-11 h-11 relative bg-neutral-700 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] flex items-center justify-center text-white hover:bg-neutral-600 transition-colors cursor-pointer";

    return (
        <nav className="w-full h-24 flex items-center px-4 lg:px-8 relative bg-transparent z-50">
            {/* --- LEWA STRONA (LOGO + LINKI) BEZ ZMIAN --- */}
            <div className="relative w-80 h-24 shrink-0">
                <div className="w-80 h-16 left-[6px] top-[17px] absolute bg-gradient-to-r from-neutral-400/70 via-neutral-500/50 to-stone-900/30 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]"></div>
                <div className="left-[91px] top-[37px] absolute justify-start text-white text-lg font-semibold leading-6 tracking-widest whitespace-nowrap">
                    PIŁKARSKIE KOSY
                </div>
                <Link to="/">
                    <img className="w-24 h-24 left-0 top-0 absolute cursor-pointer hover:scale-105 transition-transform" src={Logo} alt="Logo" />
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-6 ml-4">
                <Link to="/mapa" className="text-white text-base font-semibold leading-5 hover:text-green-400 transition-colors whitespace-nowrap">
                    Mapa klubów
                </Link>
                <Link to="/obserwowani" className="text-white text-base font-semibold leading-5 hover:text-green-400 transition-colors whitespace-nowrap">
                    Obserwowane
                </Link>
            </div>

            {/* --- PRAWA STRONA --- */}
            <div className="flex items-center gap-6 ml-auto">
                {isLoggedOut ? (
                    <ActionButton onClick={() => navigate('auth')}>
                        Zaloguj się
                    </ActionButton>
                ) : (
                    <div className="flex items-center gap-4">
                        
                        {/* --- IKONA ADMINA (TERAZ KORZYSTA Z USERA Z CONTEXTU) --- */}
                        {user?.is_staff && (
                            <Link
                                to="/adminpanel"
                                className={iconContainerStyles}
                                aria-label="Panel Administratora"
                            >
                                <Cog6ToothIcon className="w-6 h-6" />
                            </Link>
                        )}

                        <button className={iconContainerStyles} aria-label="Powiadomienia">
                            <BellIcon className="w-6 h-6" />
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                className={iconContainerStyles}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <UserIcon className="w-6 h-6" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                                    >
                                        <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                                        Wyloguj się
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
};

export default NavbarRigid;