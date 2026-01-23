import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth.ts";
import { UserIcon, ArrowRightStartOnRectangleIcon, Cog6ToothIcon, InformationCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from "@/assets/Logo.png";
import ActionButton from "../../shared/ActionButton.tsx";
import { useRelationEditor } from '../../hooks/useRelationEditor';
import Notifications from './Notifications.tsx';

const NavbarRigid = () => {
    const navigate = useNavigate();
    
    const { isLoggedIn, logout, user } = useAuth(); 
    
    const isLoggedOut = !isLoggedIn;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const { openEditor } = useRelationEditor();


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const iconContainerStyles = "w-9 h-9 md:w-11 md:h-11 relative bg-neutral-700 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] flex items-center justify-center text-white hover:bg-neutral-600 transition-colors cursor-pointer";

    return (
        <nav className="w-full h-20 md:h-24 flex items-center px-4 lg:px-8 relative bg-transparent z-50">
            {/* Logo i nazwa */}
            <div className="relative shrink-0 md:w-80 md:h-24">
                <div className="hidden md:block w-80 h-16 left-[6px] top-[17px] absolute bg-gradient-to-r from-neutral-400/70 via-neutral-500/50 to-stone-900/30 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]"></div>
                <div className="hidden md:block left-[91px] top-[37px] absolute justify-start text-white text-lg font-semibold leading-6 tracking-widest whitespace-nowrap">
                    PIŁKARSKIE KOSY
                </div>
                <Link to="/">
                    <img className="w-16 h-16 md:w-24 md:h-24 md:absolute md:left-0 md:top-0 cursor-pointer hover:scale-105 transition-transform" src={Logo} alt="Logo" />
                </Link>
            </div>

            {/* Linki desktop */}
            <div className="hidden lg:flex items-center gap-6 ml-4">
                <Link to="/mapa" className="text-white text-base font-semibold leading-5 hover:text-green-400 transition-colors whitespace-nowrap">
                    Mapa klubów
                </Link>
                <Link to="/obserwowane" className="text-white text-base font-semibold leading-5 hover:text-green-400 transition-colors whitespace-nowrap">
                    Obserwowane
                </Link>
            </div>

            {/* Prawa strona */}
            <div className="flex items-center gap-3 md:gap-6 ml-auto">
                {isLoggedOut ? (
                    <>
                        {/* Hamburger menu dla mobile (gdy wylogowany) */}
                        <button
                            className="lg:hidden text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                        
                        <ActionButton onClick={() => navigate('auth')}>
                            <span className="hidden sm:inline">Zaloguj się</span>
                            <span className="sm:hidden">Zaloguj</span>
                        </ActionButton>
                    </>
                ) : (
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Hamburger menu dla mobile (gdy zalogowany) */}
                        <button
                            className="lg:hidden text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                        
                        {/* Ikona admina */}
                        {user?.is_staff && (
                            <Link
                                to="/adminpanel"
                                className={iconContainerStyles}
                                aria-label="Panel Administratora"
                            >
                                <Cog6ToothIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </Link>
                        )}

                        <Notifications />

                        <div className="relative" ref={dropdownRef}>
                            <button
                                className={iconContainerStyles}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        Mój profil
                                    </button>
                                    <button
                                        onClick={() => {
                                            openEditor();
                                            setIsDropdownOpen(false);
                                        }}    
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
 
                                    >
                                        <InformationCircleIcon className="w-4 h-4" />
                                        Zgłoś zmianę
                                    </button>
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

            {/* menu mobilne */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-neutral-900/95 backdrop-blur-sm lg:hidden shadow-lg border-t border-white/10">
                    <div className="flex flex-col p-4 gap-3">
                        <Link 
                            to="/mapa" 
                            className="text-white text-base font-semibold py-3 px-4 hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Mapa klubów
                        </Link>
                        <Link 
                            to="/obserwowane" 
                            className="text-white text-base font-semibold py-3 px-4 hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Obserwowane
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
};

export default NavbarRigid;