import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./scenes/home";
import AuthScene from "./scenes/auth";
import MapScene from "./scenes/map";
import ClubPage from "./scenes/club";
import AboutUs from "./scenes/about_us";
import 'leaflet/dist/leaflet.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {AuthProvider} from "./context/AuthContext.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import ResetPasswordConfirm from "./scenes/reset_password";
import AdminPanel from "./scenes/adminpanel";
import { ProtectedRoute } from "./components/common/ProtectedRoute.tsx";
import ProfilePage from './scenes/profile/index.tsx';
import FollowedClubsScene from './scenes/followed_clubs/index.tsx';


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
                    <Route path="/club/:id" element={<ClubPage />} />
                    <Route path="/obserwowane" element={<FollowedClubsScene />} />
                    <Route path="/o-nas" element={<AboutUs />} />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/adminpanel" element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminPanel />
                        </ProtectedRoute>
                    } />
                    </Route>

                    <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />
                    <Route path="/auth" element={<AuthScene />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                </AuthProvider>
                </GoogleOAuthProvider>
            </BrowserRouter>
        </div>
    )
}

export default App;