import Logo from "@/assets/Logo.png";
import ActionButton from "../../shared/ActionButton.tsx";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAurh.ts";

const NavbarRigid = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    const isLoggedOut = !isLoggedIn;

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    // Style tekstowe z Figmy (wyciągnięte dla czytelności, ale zachowujące fonty)
    //const textStyle = "text-white text-base font-semibold font-['Montserrat'] leading-5 hover:text-red-500 transition-colors cursor-pointer";

    // Styl "szklanej" kulki z Figmy
    //const glassBubbleStyle = "w-11 h-11 bg-neutral-700 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] flex items-center justify-center hover:bg-neutral-600 transition-colors cursor-pointer";

    return (
        // GLÓWNY KONTENER
        // flex: ustawia elementy w rzędzie
        // items-center: centruje w pionie
        // px-4 lg:px-8: odstępy od krawędzi ekranu
        <nav className="w-full h-24 flex items-center px-4 lg:px-8 relative bg-transparent z-50">

            {/* --- 1. LEWA STRONA: LOGO --- */}
            <div className="relative w-80 h-24 shrink-0">
                {/* Tło pod logo (Twoje style) */}
                <div className="w-80 h-16 left-[6px] top-[17px] absolute bg-gradient-to-r from-neutral-400/70 via-neutral-500/50 to-stone-900/30 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]"></div>

                {/* Tekst */}
                <div className="left-[91px] top-[37px] absolute justify-start text-white text-lg font-semibold leading-6 tracking-widest whitespace-nowrap">
                    PIŁKARSKIE KOSY
                </div>

                {/* Obrazek Logo */}
                <Link to="/">
                    <img className="w-24 h-24 left-0 top-0 absolute cursor-pointer hover:scale-105 transition-transform" src={Logo} alt="Logo" />
                </Link>
            </div>

            {/* --- 2. LEWA STRONA (zaraz za logiem): LINKI --- */}
            {/* ml-4: mały odstęp od logo */}
            {/* hidden md: flex: ukrywamy na telefonach, pokazujemy od tabletu */}
            <div className="hidden md:flex items-center gap-6 ml-4">
                <Link
                    to="/mapa"
                    className="text-white text-base font-semibold leading-5 hover:text-green-400 transition-colors whitespace-nowrap"
                >
                    Mapa klubów
                </Link>
                <Link
                    to="/obserwowani"
                    className="text-white text-base font-semibold leading-5 hover:text-green-400 transition-colors whitespace-nowrap"
                >
                    Obserwowane
                </Link>
            </div>

            {/* --- 3. PRAWA STRONA: LOGOWANIE / REJESTRACJA --- */}
            {/* ml-auto: TO JEST KLUCZ wypycha ten kontener maksymalnie w prawo */}
            <div className="flex items-center gap-6 ml-auto">
                {isLoggedOut ? (
                    // WIDOK DLA NIEZALOGOWANEGO
                        <>
                            <ActionButton
                                onClick={() => navigate('auth')}
                            >
                                Zarejestruj się
                            </ActionButton>
                        </>
                ) : (
                    // WIDOK DLA ZALOGOWANEGO
                    <button
                        onClick={handleLogout}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-5 py-2 rounded-full font-semibold text-sm lg:text-base transition-colors shadow-lg whitespace-nowrap cursor-pointer"
                    >
                        Wyloguj
                    </button>
                )}

            </div>

        </nav>
    )
    };

export default NavbarRigid;