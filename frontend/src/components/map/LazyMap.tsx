import { lazy, Suspense } from 'react';
import { type LatLngBoundsExpression } from 'leaflet';
import { type RelationsMap, type TerritoryData } from '../../utils/geoUtils';

const Map = lazy(() => import('./Map'));

interface LazyMapProps {
    territories: TerritoryData[];
    userClub: string | null;
    relationsMap: RelationsMap;
    onLocationFound: (lat: number, lng: number) => void;
    focusedTerritoryBounds: LatLngBoundsExpression | null;
}

export default function LazyMap(props: LazyMapProps) {
    return (
        <Suspense fallback={
            <div className="relative w-full h-[450px] rounded-[30px] overflow-hidden shadow-xl border border-[#2a2a2a] antialiased bg-[#2a2a2a] flex items-center justify-center">
                <p className="text-white text-lg">Ładowanie mapy...</p>
            </div>
        }>
            <Map {...props} />
        </Suspense>
    );
}
