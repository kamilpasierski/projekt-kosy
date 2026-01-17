// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./scenes/home";
import MapScene from "./scenes/map";
import ClubPage from "./scenes/club";
import 'leaflet/dist/leaflet.css';
import MainLayout from "./layouts/MainLayout.tsx";

function App() {
    return (
        <div className="app min-h-screen flex flex-col font-['Montserrat']">
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/mapa" element={<MapScene />} />
                        <Route path="/club/:id" element={<ClubPage />} />
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;