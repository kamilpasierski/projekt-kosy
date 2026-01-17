// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar - now dark gray */}
            <Navbar />
            
            {/* Main content with bottom spacing */}
            <main className="flex-1 w-full px-4 md:px-8 xl:px-[45px] pb-24">
                <Outlet />
            </main>
            
            {/* Footer will push to bottom naturally */}
            <Footer />
        </div>
    );
};

export default MainLayout;