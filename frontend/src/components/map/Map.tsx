import { useState, useMemo, useEffect, memo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { type LatLngTuple, type LatLngBoundsExpression } from 'leaflet';
import { 
    type RelationsMap, 
    type TerritoryData, 
    RELATION_COLORS 
} from '../../utils/geoUtils';

// --- KOMPONENTY POMOCNICZE ---

// 1. Helper do ustawiania widoku (startowy)
const ChangeView = memo(({ center, zoom }: { center: LatLngTuple; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
});

const MapController = memo(({ bounds }: { bounds: LatLngBoundsExpression | null }) => {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.flyToBounds(bounds, {
                padding: [50, 50],
                duration: 1.5,
                maxZoom: 14
            });
        }
    }, [bounds, map]);

    return null;
});

// --- GŁÓWNY KOMPONENT ---

interface MapProps {
    territories: TerritoryData[];
    userClub: string | null;
    relationsMap: RelationsMap;
    onLocationFound: (lat: number, lng: number) => void;
    focusedTerritoryBounds: LatLngBoundsExpression | null;
}

function Map({
    territories,
    userClub,
    relationsMap,
    onLocationFound,
    focusedTerritoryBounds
}: MapProps) {
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([52.23, 21.01]);
    const [mapZoom, setMapZoom] = useState<number>(6);
    const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);

    const sortedTerritories = useMemo(() => {
        return [...territories].sort((a, b) => {
            const getWeight = (t: TerritoryData) => {
                const owner = t.owner_name;

                if (!userClub || !owner) return 2;

                if (owner === userClub) return 1;

                const relation = relationsMap[userClub]?.[owner]?.toUpperCase();

                if (relation === 'KOSA') return 4;
                if (relation === 'NEUTRALNIE') return 3;
                if (relation === 'ZGODA') return 1;

                return 2;
            };

            const weightA = getWeight(a);
            const weightB = getWeight(b);

            return weightA - weightB;
        });
    }, [territories, userClub, relationsMap]);

    // --- LOGIKA KOLOROWANIA ---
    const getTerritoryColor = useCallback((owner: string | null): string => {
        if (!userClub || !owner) return RELATION_COLORS.DEFAULT;
        if (owner === userClub) return RELATION_COLORS.FRIENDLY;

        const relation = relationsMap[userClub]?.[owner]?.toUpperCase();

        switch (relation) {
            case 'KOSA':
                return RELATION_COLORS.HOSTILE;
            case 'ZGODA':
                return RELATION_COLORS.FRIENDLY;
            case 'NEUTRALNIE':
                return RELATION_COLORS.NEUTRAL;
            default:
                return RELATION_COLORS.DEFAULT;
        }
    }, [userClub, relationsMap]);

    // --- GEOLOKALIZACJA ---
    const handleLocateClick = useCallback(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                setUserLocation([lat, lng]);
                setMapCenter([lat, lng]);
                setMapZoom(13);
                onLocationFound(lat, lng);
            },
            (err) => console.error("Błąd GPS:", err)
        );
    }, [onLocationFound]);

    return (
        <div className="relative w-full h-[450px] rounded-[30px] overflow-hidden shadow-xl border border-[#2a2a2a] antialiased">

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
                <MapController bounds={focusedTerritoryBounds} />

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Renderowanie posortowanych stref */}
                {sortedTerritories.map(t => {
                    const isPoint = !t.polygon || t.polygon.length < 4;
                    const color = getTerritoryColor(t.owner_name);

                    const pathOptions = {
                        color,
                        fillOpacity: 0.35, // Lekka przezroczystość
                        weight: 2
                    };

                    return isPoint ? (
                        <Circle
                            key={`c-${t.id}`}
                            center={t.polygon[0] as LatLngTuple}
                            radius={2000}
                            pathOptions={pathOptions}
                        />
                    ) : (
                        <Polygon
                            key={`p-${t.id}`}
                            positions={t.polygon as LatLngTuple[]}
                            pathOptions={pathOptions}
                        />
                    );
                })}

                {userLocation && <Marker position={userLocation} />}
            </MapContainer>
        </div>
    );
}

export default memo(Map);