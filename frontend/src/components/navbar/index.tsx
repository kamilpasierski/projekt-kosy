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

    const iconContainerStyles = "w-[45px] h-[45px] min-w-[35px] min-h-[35px] relative bg-[#343434] rounded-full flex items-center justify-center text-white hover:bg-[#444444] transition-colors cursor-pointer";

    return (
        <nav className="w-full h-20 md:h-24 relative bg-transparent z-50">

            <div className="w-full max-w-[1250px] mx-auto h-full flex items-center px-4 lg:px-0">

                {/* Logo i nazwa */}
                <div className="relative shrink-0 md:w-80 md:h-24">
                    <div className="hidden md:block w-80 h-16 left-[6px] top-[17px] absolute bg-gradient-to-r from-neutral-400/70 via-neutral-500/50 to-stone-900/30 rounded-[50px]"></div>
                    <div className="hidden md:block left-[91px] top-[37px] absolute justify-start text-white text-lg font-semibold leading-[130%] tracking-[1.8px] whitespace-nowrap font-montserrat">
                       PIŁKARSKIE KOSY
                    </div>

                    <Link to="/">
                        <img className="w-16 h-16 md:w-24 md:h-24 md:absolute md:left-0 md:top-0 cursor-pointer hover:scale-105 transition-transform" src={Logo} alt="Logo" />
                    </Link>
                </div>


                <div className="hidden lg:flex items-center gap-[50px] ml-15">
                    <Link to="/mapa" className="text-white font-montserrat text-[16px] font-semibold leading-[130%] tracking-[0.5px] hover:text-[#274FDE] transition-colors whitespace-nowrap">
                        Mapa klubów
                    </Link>
                    <Link to="/obserwowane" className="text-white font-montserrat text-[16px] font-semibold leading-[130%] tracking-[0.5px] hover:text-[#274FDE] transition-colors whitespace-nowrap">
                        Obserwowane
                    </Link>
                </div>

                {/* Prawa strona */}
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    {isLoggedOut ? (
                        <>
                            <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>

                            <ActionButton onClick={() => navigate('auth')}
                              className="w-[150px] h-[64px] !bg-[#44444480] !hover:bg-[#444444cc] rounded-[50px] text-white font-montserrat font-semibold text-[16px] leading-[150%] tracking-[0.5px] flex items-center justify-center">
                              <span className="hidden sm:inline">ZALOGUJ SIĘ</span>
                              <span className="sm:hidden">Zaloguj</span>
                            </ActionButton>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 md:gap-4">
                            <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>

                            {user?.is_staff && (
                                <Link to="/adminpanel" className={iconContainerStyles} aria-label="Panel Administratora">
                                    <Cog6ToothIcon className="w-5 h-5" />
                                </Link>
                            )}

                            <Notifications />

                            <div className="relative" ref={dropdownRef}>
                                <button className={iconContainerStyles} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <UserIcon className="w-5 h-5" />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-4 w-[271px] h-[230px] bg-[#343434] rounded-[30px] shadow-[-8px_4px_5px_3px_rgba(0,0,0,0.32)] py-8 z-50 flex flex-col font-montserrat overflow-hidden">
                                        <button onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                                            className="w-full text-left px-9 py-3 text-[16px] font-medium text-white hover:bg-neutral-700/30 flex items-center gap-4 transition-colors">
                                            <UserIcon className="w-5 h-5" />
                                            Mój profil
                                        </button>
                                        <button onClick={() => { openEditor(); setIsDropdownOpen(false); }}
                                            className="w-full text-left px-9 py-3 text-[16px] font-medium text-white hover:bg-neutral-700/30 flex items-center gap-4 transition-colors">
                                            <InformationCircleIcon className="w-5 h-5" />
                                            Zgłoś zmianę
                                        </button>

                                        <div className="h-[1px] w-[200px] bg-[#464646] mx-auto my-3 shrink-0"></div>

                                        <button onClick={handleLogout}
                                            className="w-full text-left px-9 py-3 text-[16px] font-medium text-[#983E3E] hover:bg-neutral-700/30 flex items-center gap-4 transition-colors">
                                            <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-[#983E3E]" />
                                            Wyloguj się
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* menu mobilne - pozostaje na całej szerokości navbara */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-neutral-900/95 backdrop-blur-sm lg:hidden shadow-lg border-t border-white/10">
                    <div className="flex flex-col p-4 gap-3">
                        <Link to="/mapa" className="text-white text-base font-semibold py-3 px-4 hover:bg-neutral-800 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            Mapa klubów
                        </Link>
                        <Link to="/obserwowane" className="text-white text-base font-semibold py-3 px-4 hover:bg-neutral-800 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            Obserwowane
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarRigid;