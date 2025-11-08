import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Logo from "@/assets/Logo.png";
import Link from "./Link.tsx";
import useMediaQuery from "../../hooks/useMediaQuery.ts";
import ActionButton from "../../shared/ActionButton.tsx";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAurh.ts";

const Navbar = () => {
        const flexBetween = "flex items-center justify-between";
        const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
        const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
        const navigate = useNavigate();
        const { isLoggedIn, logout } = useAuth();


        const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
        useEffect(() => {
            const handleScroll = () => {
                if (window.scrollY === 0) {
                    setIsTopOfPage(true);
                } else {
                    setIsTopOfPage(false);
                }
            };
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }, []);


        const navbarBackground = isTopOfPage ? "" : "bg-primary-100 drop-shadow";

        const isLoggedOut = !isLoggedIn;
        const handleLogout = () => {
            logout();
            navigate('/');
        }

    return <nav>
            <div
                className={`${navbarBackground} ${flexBetween} fixed top-0 z-30 w-full py-6`}
            >
                <div className={`${flexBetween} mx-auto w-5/6`}>
                    <div className={`${flexBetween} w-full gap-16`}>

                        {/* lewa strona */}
                        <Link to="/"> <img alt={"logo"} src={Logo} /> </Link>
                        {/* prawa strona */}
                        {isAboveMediumScreens ? (
                            <div className={`${flexBetween} w-full`}>
                                <div className={`${flexBetween} gap-8 text-sm`}>

                                    <Link to="/">Strona główna</Link>
                                    <Link to="/mapa">Mapa</Link>
                                    <Link to="/placeholder1">Placeholder</Link>
                                    <Link to="/placeholder2">Placeholder</Link>

                                </div>
                                {isLoggedOut ? (
                                    <div className={`${flexBetween} gap-8`}>
                                    <Link to="/login">Zaloguj się</Link>
                                    <ActionButton onClick={() => navigate('register')}>Zarejestruj się</ActionButton>
                                    </div>
                                ) : (
                                    <div className={`${flexBetween} gap-8`}>
                                        <ActionButton onClick={handleLogout}>Wyloguj się</ActionButton>
                                    </div>
                                    )}
                            </div>
                        ) : (
                            <button
                                className="rounded-full bg-secondary-500 p-2"
                                onClick={() => setIsMenuToggled (!isMenuToggled)}
                            >
                                <Bars3Icon className="h-6 w-6 text-white"/>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* menu mobilne */}
            {!isAboveMediumScreens && isMenuToggled && (
                <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 drop-shadow-xl">
                    {/* ikonka zamykania */}
                    <div className="flex justify-end p-12">
                        <button onClick={() => setIsMenuToggled (!isMenuToggled)}>
                            <XMarkIcon className="h-6 w-6 text-gray-400" />
                        </button>
                    </div>
                    {/* zawartość menu mobilnego */}
                    <div className="ml-[33%] flex flex-col gap-10 text-2xl">

                        <Link to="/" onClick={() => setIsMenuToggled(!isMenuToggled)}>Strona główna</Link>
                        <Link to="/mapa" onClick={() => setIsMenuToggled(!isMenuToggled)}>Mapa</Link>
                        <Link to="/placeholder" onClick={() => setIsMenuToggled(!isMenuToggled)}>placeholder</Link>
                        <Link to="/placeholder" onClick={() => setIsMenuToggled(!isMenuToggled)}>placeholder</Link>


                    </div>
                </div>
            )}
        </nav>
    };


    export default Navbar;