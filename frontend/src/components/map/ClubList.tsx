import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useDebounce } from '../../hooks/useDebounce';
import { MagnifyingGlassIcon, StarIcon as StarOutline, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { parseRelationsToMap, type RelationsMap } from '../../utils/geoUtils';

interface ClubListProps {
  onClubSelect: (clubName: string) => void;
}

// --- KONFIGURACJA ---
const MEDIA_URL = 'http://127.0.0.1:8000/media/';
const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTAgMTUwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMzNDM0MzQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZHk9Ii4zZW0iIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkZMQUc8L3RleHQ+PC9zdmc+";

// --- TYPES ---
interface Club {
  id: number;
  name: string;
  city: string;
  path_image?: string | null;
  isFavorite?: boolean;
}

type SortField = 'name' | 'city' | 'relation';
type SortOrder = 'asc' | 'desc';
type RelationStatus = 'favorite' | 'safe' | 'dangerous' | 'neutral' | 'unknown';

export default function ClubList({ onClubSelect }: ClubListProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Sort State
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [userClub, setUserClub] = useState<string | null>(null);
  const [relationsMap, setRelationsMap] = useState<RelationsMap>({});

  const debouncedSearch = useDebounce(searchQuery, 500);

  // --- POBIERANIE KONTEKSTU UŻYTKOWNIKA I RELACJI ---
  useEffect(() => {
    const fetchContextData = async () => {
        try {
            const [relRes, userRes] = await Promise.allSettled([
                api.get('/relations/'),
                api.get('/clubs/user/')
            ]);

            if (relRes.status === 'fulfilled') {
                setRelationsMap(parseRelationsToMap(relRes.value.data));
            }

            if (userRes.status === 'fulfilled') {
                const userData = userRes.value.data;
                if (userData && userData.club_name) {
                    setUserClub(userData.club_name);
                }
            }
        } catch (error) {
            console.error("Błąd pobierania danych kontekstowych:", error);
        }
    };

    fetchContextData();
  }, []);

  // --- GŁÓWNA FUNKCJA POBIERAJĄCA KLUBY ---
  const fetchClubs = async (pageNumber: number, isLoadMore: boolean) => {
    if (isLoadMore) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      
      const orderingPrefix = sortOrder === 'desc' ? '-' : '';
      params.append('ordering', `${orderingPrefix}${sortField}`);
      params.append('page', pageNumber.toString());

      const response = await api.get<any>(`/clubs/search/?${params.toString()}`);
      const data = response.data;
      
      let newClubs: Club[] = [];
      let hasNextPage = false;

      if (Array.isArray(data)) {
          newClubs = data;
      } else if (data && Array.isArray(data.results)) {
          newClubs = data.results;
          hasNextPage = !!data.next;
      } else {
          newClubs = [];
      }

      if (isLoadMore) {
        setClubs(prev => [...(prev || []), ...newClubs]);
      } else {
        setClubs(newClubs);
      }
      setHasMore(hasNextPage);

    } catch (error) {
      console.error("Błąd pobierania klubów:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchClubs(1, false);
  }, [debouncedSearch, sortField, sortOrder]); 

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchClubs(nextPage, true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // --- LOGIKA OBLICZANIA RELACJI ---
  const calculateRelation = (clubName: string): RelationStatus => {
    if (!userClub) return 'unknown';
    if (clubName === userClub) return 'favorite';

    const relation = relationsMap[userClub]?.[clubName]?.toUpperCase();

    if (relation === 'KOSA') return 'dangerous';
    if (relation === 'ZGODA') return 'safe';
    if (relation === 'NEUTRALNIE') return 'neutral';

    return 'unknown';
  };

  // --- STYLOWANIE PILLSÓW ---
  const getRelationStyle = (status: RelationStatus) => {
    switch (status) {
      case 'favorite':
        return { bg: 'bg-[#20ca5f]', text: 'text-white', label: 'ULUBIONY' };
      
      case 'safe': 
        return { bg: 'bg-[#20ca5f]', text: 'text-white', label: 'ZGODA' };
      
      case 'dangerous': 
        return { bg: 'bg-[#cb0000]', text: 'text-white', label: 'KOSA' };
      
      case 'neutral': 
        return { bg: 'bg-[#fbf201]', text: 'text-black', label: 'NEUTRALNIE' };
      
      case 'unknown':
      default: 
        return { bg: 'bg-gray-600', text: 'text-white', label: 'BRAK DANYCH' };
    }
  };

  const getClubImageUrl = (path?: string | null) => {
    if (!path) return DEFAULT_LOGO;
    return path.startsWith('http') ? path : `${MEDIA_URL}${path}`;
  };

  const renderSortArrow = (field: SortField) => {
    if (sortField !== field) return null;
    const ArrowIcon = sortOrder === 'asc' ? ArrowDownIcon : ArrowUpIcon;
    return <ArrowIcon className="ml-1 h-4 w-4 text-[#274fde]" />;
  };

   // --- HANDLER ULUBIONYCH (MOCK FRONTEND) ---
  const handleToggleFavorite = (e: React.MouseEvent, clubId: number) => {
    e.stopPropagation();
    setClubs(currentClubs => currentClubs.map(club => {
      if (club.id === clubId) {
        return { ...club, isFavorite: !club.isFavorite };
      }
      return club;
    })
  );
};

  return (
    <div className="relative w-full max-w-[1440px] py-8">
      <h2 className="mb-6 px-[calc(6.25%+40px)] font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
        Lista klubów
      </h2>

      {/* SEARCH BAR */}
      <div className="mx-[8.96%] mb-6 flex items-center gap-4 rounded-[30px] bg-[#2a2a2a] px-6 py-4 border border-transparent focus-within:border-[#274fde] transition-colors">
        <MagnifyingGlassIcon className="h-6 w-6 text-white flex-shrink-0" />
        <input
          type="text"
          placeholder="Szukaj klubu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent font-['Montserrat'] text-[16px] font-medium text-white placeholder:text-gray-500 outline-none"
        />
        {isLoading && !isLoadingMore && <span className="text-xs text-gray-400 animate-pulse">Ładowanie...</span>}
      </div>

      {/* TABLE */}
      <div className="mx-[calc(6.25%+33px)] overflow-hidden rounded-[30px] bg-[#343434] min-h-[300px] pb-4">
        
        {/* HEADER */}
        <div className="grid grid-cols-[auto_2fr_1.5fr_1.5fr] gap-4 border-b-[0.5px] border-[#274fde] bg-[#2a2a2a] px-6 py-4 select-none">
          <div className="w-12" />
          <div className="flex items-center cursor-pointer hover:text-[#274fde]" onClick={() => handleSort('name')}>
            <p className="font-['Montserrat'] text-[16px] font-medium text-white">Klub</p>
            {renderSortArrow('name')}
          </div>
          <div className="flex items-center justify-center cursor-pointer hover:text-[#274fde]" onClick={() => handleSort('city')}>
            <p className="text-center font-['Montserrat'] text-[16px] font-medium text-white">Miasto</p>
            {renderSortArrow('city')}
          </div>
          <div className="flex items-center justify-center cursor-pointer hover:text-[#274fde]" onClick={() => handleSort('relation')}>
            <p className="text-center font-['Montserrat'] text-[16px] font-medium text-white">Relacje</p>
            {renderSortArrow('relation')}
          </div>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-gray-700">
          {(clubs || []).map((club) => {
            const relationStatus = calculateRelation(club.name);
            const relationStyle = getRelationStyle(relationStatus);

            return (
              <div key={club.id} className="grid grid-cols-[auto_2fr_1.5fr_1.5fr] gap-4 items-center px-6 py-4 hover:bg-[#3a3a3a] transition-colors cursor-pointer group">
                
                {/* Ikona Gwiazdki */}
                <button 
                  onClick={(e) => handleToggleFavorite(e, club.id)}
                  className="flex h-12 w-12 items-center justify-center transition-transform active:scale-95 group/star"
                >
                  {club.isFavorite ? (
                    <StarSolid className="h-6 w-6 text-yellow-400 drop-shadow-sm" />
                  ) : (
                    <StarOutline className="h-6 w-6 text-white group-hover/star:text-yellow-400 transition-colors" />
                  )}
                </button>

                {/* NAZWA KLUBU - CLICKABLE */}
                <div 
                    className="flex items-center gap-4"
                    onClick={() => onClubSelect(club.name)}
                >
                  <img 
                    src={getClubImageUrl(club.path_image)} 
                    alt={club.name} 
                    className="h-[54px] w-[54px] object-contain bg-white/5 rounded-full p-1"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_LOGO; }}
                  />
                  <p className="font-['Montserrat'] text-[16px] font-medium text-white group-hover:text-[#274fde] transition-colors">
                    {club.name}
                  </p>
                </div>

                {/* MIASTO - CLICKABLE */}
                <p 
                    className="text-center font-['Montserrat'] text-[16px] font-medium text-white hover:text-[#274fde] transition-colors"
                    onClick={() => onClubSelect(club.name)}
                >
                  {club.city}
                </p>

                {/* Relacja */}
                <div className="flex justify-center">
                  <span className={`${relationStyle.bg} ${relationStyle.text} rounded-[50px] px-6 py-2 font-['Montserrat'] text-[14px] font-semibold uppercase tracking-wide shadow-md whitespace-nowrap`}>
                    {relationStyle.label}
                  </span>
                </div>
              </div>
            );
          })}
          
          {clubs.length === 0 && !isLoading && (
            <div className="text-center py-10 text-gray-400">Brak wyników</div>
          )}
        </div>

        {/* LOAD MORE BUTTON */}
        {hasMore && (
            <div className="flex justify-center pt-6 pb-2">
                <button 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="bg-[#2a2a2a] hover:bg-[#274fde] border border-[#274fde] text-white px-8 py-3 rounded-[30px] font-['Montserrat'] font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoadingMore ? 'Ładowanie...' : 'Załaduj więcej'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
}