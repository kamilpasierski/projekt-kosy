import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from "./scenes/navbar";
import RegisterScene from './scenes/register';
import LoginScene from "./scenes/login";
import MapScene from "./scenes/map";

import 'leaflet/dist/leaflet.css';
import {AuthProvider} from "./context/AuthContext.tsx";

const MainPage = () => {

    return (
        <div>
            <div style={{ paddingTop: '100px', height: '200vh' }}>
            </div>
        </div>
    );
};


function App() {

    return (
        <div className="app bg-gray-20">
            <BrowserRouter>
                <AuthProvider>
                <Navbar/>

                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/mapa" element={<MapScene />} />
                    <Route path="/register" element={<RegisterScene />} />
                    <Route path="/login" element={<LoginScene />} />
                </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>
    )
}

export default App;