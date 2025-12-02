import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./scenes/home";
import AuthScene from "./scenes/auth";
import LoginScene from "./scenes/auth";
import MapScene from "./scenes/map";

import 'leaflet/dist/leaflet.css';
import {AuthProvider} from "./context/AuthContext.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import ResetPasswordConfirm from "./scenes/reset_password";


function App() {
    return (
        <div className="app bg-basic-dark">
            <BrowserRouter>
                <AuthProvider>

                <Routes>
                    <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/mapa" element={<MapScene />} />
                    </Route>

                    <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />
                    <Route path="/auth" element={<AuthScene />} />
                    <Route path="/login" element={<LoginScene />} />
                </Routes>

                </AuthProvider>
            </BrowserRouter>
        </div>
    )
}

export default App;