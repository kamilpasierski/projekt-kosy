import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./scenes/home";
import AuthScene from "./scenes/auth";
import MapScene from "./scenes/map";
import 'leaflet/dist/leaflet.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {AuthProvider} from "./context/AuthContext.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import ResetPasswordConfirm from "./scenes/reset_password";
import AdminPanel from "./scenes/adminpanel";


function App() {
    return (
        <div className="app min-h-screen flex flex-col font-['Montserrat']">
            <BrowserRouter>
                <GoogleOAuthProvider clientId="591435600928-jkcr94pim0taieevj0mlcv112j85verk.apps.googleusercontent.com">
                <AuthProvider>

                <Routes>
                    <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/mapa" element={<MapScene />} />
                        <Route path="/adminpanel" element={<AdminPanel />} />
                    </Route>

                    <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />
                    <Route path="/auth" element={<AuthScene />} />
                </Routes>

                </AuthProvider>
                </GoogleOAuthProvider>
            </BrowserRouter>
        </div>
    )
}

export default App;