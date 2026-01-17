import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {type  LatLngTuple } from 'leaflet';
import { type TerritoryData } from '../../utils/geoUtils';

// Helper do przesuwania widoku mapy
function ChangeView({ center, zoom }: { center: LatLngTuple; zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

interface MapProps {
    territories: TerritoryData[];
    userClub: string | null;
    onLocationFound: (lat: number, lng: number) => void;
}

export default function Map({ territories, userClub, onLocationFound }: MapProps) {
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([52.23, 21.01]);
    const [mapZoom, setMapZoom] = useState<number>(6);
    const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);

    const handleLocateClick = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                
                // Aktualizujemy widok mapy (lokalnie)
                setUserLocation([lat, lng]);
                setMapCenter([lat, lng]);
                setMapZoom(13);

                // Wysyłamy sygnał do MapScene (Rodzica)
                onLocationFound(lat, lng);
            },
            (err) => console.error("Błąd GPS:", err)
        );
    };

    return (
        <div className="relative w-full h-[450px] rounded-[30px] overflow-hidden shadow-xl border border-[#2a2a2a]">
            
            {/* Przycisk wyświetlamy tylko jak jest userClub */}
            {userClub && (
                <button 
                    onClick={handleLocateClick}
                    className="absolute top-4 right-4 z-[1000] bg-[#2a2a2a] text-white px-6 py-3 rounded-xl font-bold uppercase hover:bg-black transition border border-gray-600 shadow-lg"
                >
                    Zlokalizuj mnie
                </button>
            )}

            <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full z-0">
                <ChangeView center={mapCenter} zoom={mapZoom} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {territories.map(t => {
                    const isPoint = !t.polygon || t.polygon.length < 4;
                    // Jeśli user nie zalogowany - wszystko na szaro, jeśli tak - kolorujemy strefy
                    const color = userClub 
                        ? (t.owner_name === userClub ? '#10b981' : '#ef4444') 
                        : '#6b7280';
                    //TO JESZCZE DO POPRAWY - kolory stref powinny być inne w zależności od relacji klubu użytkownika z właścicielem strefy
                    return isPoint ? (
                        <Circle key={t.id} center={t.polygon[0] as LatLngTuple} radius={2000} pathOptions={{ color, fillOpacity: 0.2 }} />
                    ) : (
                        <Polygon key={t.id} positions={t.polygon as LatLngTuple[]} pathOptions={{ color, fillOpacity: 0.2 }} />
                    );
                })}

                {userLocation && <Marker position={userLocation} />}
            </MapContainer>
        </div>
    );
}