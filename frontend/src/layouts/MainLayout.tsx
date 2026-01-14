import { useEffect } from "react";
import { Outlet } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { RelationEditorProvider } from "../context/RelationEditorContext";
import { GlobalRelationEditor } from "../components/common/GlobalRelationEditor";

const MainLayout = () => {
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('status') === 'activated') {
            alert('Twoje konto zostało pomyślnie aktywowane! Możesz się zalogować.');
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, []);

    return (
        <RelationEditorProvider>
            
            <Navbar />
            
            <main className="flex-1 w-full px-4 md:px-8 xl:px-[45px]">
                <Outlet />
            </main>
            
            <Footer />

            <GlobalRelationEditor />

        </RelationEditorProvider>
    );
};

export default MainLayout;