import {useEffect} from "react";
import { Outlet } from 'react-router-dom';
import Navbar from "../components/navbar";

const MainLayout = () => {
    useEffect(() => {
        // Sprawdzenie parametrów URL zaraz po załadowaniu komponentu
        const queryParams = new URLSearchParams(window.location.search);

        if (queryParams.get('status') === 'activated') {

            // Wywołanie alertu
            alert('Twoje konto zostało pomyślnie aktywowane! Możesz się zalogować.');

            // Czyszczenie URL (aby alert nie wyskakiwał po odświeżeniu)
            // Usunięcie parametru 'status' z adresu bez przeładowania strony
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, []);
    return (
        <>
            <Navbar />
            {/* Outlet to "placeholder", w który React Router wstawi
                komponent Home albo MapScene, w zależności od URL */}
            <main className="flex-1 w-full px-4 md:px-8 xl:px-[45px]">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;