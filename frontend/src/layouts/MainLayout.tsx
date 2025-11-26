import { Outlet } from 'react-router-dom';
import Navbar from "../scenes/navbar";

const MainLayout = () => {
    return (
        <>
            <Navbar />
            {/* Outlet to "placeholder", w który React Router wstawi
                komponent Home albo MapScene, w zależności od URL */}
            <div className="content-container">
                <Outlet />
            </div>
        </>
    );
};

export default MainLayout;