import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L, {type LatLngTuple } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Ikonki leaflet
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;


interface ChangeViewProps {
    center: LatLngTuple;
    zoom: number;
}

function ChangeView({ center, zoom }: ChangeViewProps) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function MapComponent() {

    // Stan na współrzędne [lat, lng] (lub null na starcie)
    const [location, setLocation] = useState<LatLngTuple | null>(null);
    // Stan na błędy
    const [error, setError] = useState<string | null>(null);
    // Domyślna pozycja mapy (typ LatLngTuple)
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([52.23, 21.01]);
    const [mapZoom, setMapZoom] = useState<number>(7); // Domyślny zoom

    const USER_ZOOM: number = 15; // Zoom po znalezieniu użytkownika

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolokalizacja nie jest wspierana przez Twoją przeglądarkę.");
            return;
        }

        setError(null);

        navigator.geolocation.getCurrentPosition(
            // Callback 'success' (z typem)
            (position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                const userCoords: LatLngTuple = [latitude, longitude];

                console.log("Znaleziono lokalizację:", userCoords);
                setLocation(userCoords);

                setMapCenter(userCoords);
                setMapZoom(USER_ZOOM);
            },
            // Callback 'error' (z typem)
            (err: GeolocationPositionError) => {
                setError(`Błąd: ${err.message}`);
                console.warn(`BŁĄD(${err.code}): ${err.message}`);
            }
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={handleGetLocation} style={{ marginBottom: '15px' }}>
                Zlokalizuj mnie
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '400px', width: '100%' }}
            >
                <ChangeView center={mapCenter} zoom={mapZoom} />

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Znacznik (Marker) - bez zmian w logice */}
                {location && (
                    <Marker position={location}>
                        <Popup>
                            Jesteś tutaj! <br /> (lub bardzo blisko)
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}

export default MapComponent;