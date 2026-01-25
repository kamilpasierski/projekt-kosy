import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import api from '../../api/axiosConfig';
import { useDebounce } from '../../hooks/useDebounce';
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { parseRelationsToMap, type RelationsMap } from '../../utils/geoUtils';
import { FollowButton } from '../common/FollowButton';
import { useAuth } from '../../context/AuthContext';
import { getClubImageUrl, DEFAULT_LOGO } from '../../utils/imageUtils';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';

interface ClubListProps {
  onClubSelect: (clubName: string) => void;
}

interface Club {
  id: number;
  name: string;
  city: string;
  path_image?: string | null;
}

interface WatchedClubItem {
    id: number;
    club: number;
}

type SortField = 'name' | 'city' | 'relation';
type SortOrder = 'asc' | 'desc';
type RelationStatus = 'favorite' | 'safe' | 'dangerous' | 'neutral' | 'unknown';

// Memoized ClubRow component to prevent unnecessary re-renders
const ClubRow = memo(({ 
  club, 
  status, 
  followedMap, 
  onClubSelect 
}: { 
  club: Club; 
  status: RelationStatus; 
  followedMap: Map<number, number>; 
  onClubSelect: (name: string) => void;
}) => {
  const getRelationStyle = (status: RelationStatus) => {
    switch (status) {
      case 'favorite': return { bg: 'bg-[#20CA5F]/30', border: 'border-[#20CA5F]', label: 'Ulubiony' };
      case 'safe': return { bg: 'bg-[#20CA5F]/30', border: 'border-[#20CA5F]', label: 'Zgoda' };
      case 'dangerous': return { bg: 'bg-[#CB0000]/30', border: 'border-[#CB0000]', label: 'Kosa' };
      case 'neutral': return { bg: 'bg-[#FBF201]/30', border: 'border-[#FBF201]', label: 'Neutralnie' };
      default: return { bg: 'bg-[#727681]/30', border: 'border-[#727681]', label: 'Brak danych' };
    }
  };

  const style = useMemo(() => getRelationStyle(status), [status]);
  const handleClick = useCallback(() => onClubSelect(club.name), [club.name, onClubSelect]);

  return (
    <div className="group hover:bg-[#3a3a3a] transition-colors">
      <div className="hidden md:grid grid-cols-[1fr_0.8px_1.5fr_0.8px_1fr_0.8px_1fr] items-center h-[80px]">
        <div className="flex justify-center items-center">
          <FollowButton clubId={club.id} initialRelationId={followedMap.get(club.id)} />
        </div>
        <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

        <div className="flex items-center justify-start gap-4 pl-12 cursor-pointer" onClick={handleClick}>
          <img
            src={getClubImageUrl(club.path_image)}
            alt={club.name}
            className="h-[54px] w-[54px] object-contain"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_LOGO; }}
          />
          <p className="text-[16px] font-medium text-white truncate leading-[130%]">{club.name}</p>
        </div>
        <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

        <div className="flex justify-center items-center cursor-pointer" onClick={handleClick}>
          <p className="text-[16px] font-medium text-white leading-[130%]">{club.city}</p>
        </div>
        <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

        <div className="flex justify-center items-center">
          <div className={`${style.bg} ${style.border} border-2 w-[180px] h-[40px] rounded-[30px] flex items-center justify-center text-white text-[14px] font-medium tracking-wide leading-[130%]`}>
            {style.label}
          </div>
        </div>
      </div>

      <div className="flex md:hidden items-center gap-4 px-4 py-4 text-white cursor-pointer" onClick={handleClick}>
        <img src={getClubImageUrl(club.path_image)} className="h-10 w-10 object-contain" />
        <div className="flex-1">
          <p className="font-semibold leading-[130%]">{club.name}</p>
          <p className="text-xs text-gray-400 leading-[130%]">{club.city}</p>
        </div>
        <div className={`${style.bg} ${style.border} border px-3 py-1 rounded-full text-[10px] text-white font-medium leading-[130%]`}>{style.label}</div>
      </div>
    </div>
  );
});

export default function ClubList({ onClubSelect }: ClubListProps) {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [userClub, setUserClub] = useState<string | null>(null);
  const [relationsMap, setRelationsMap] = useState<RelationsMap>({});
  const [followedMap, setFollowedMap] = useState<Map<number, number>>(new Map());


  const debouncedSearch = useDebounce(searchQuery, 500);



  useEffect(() => {
    const fetchContextData = async () => {
        try {
            // Fetch followed clubs first for faster UI feedback
            if (user) {
                try {
                    const watchedRes = await api.get<WatchedClubItem[]>('/add_fav/watched_clubs');
                    const newMap = new Map<number, number>();
                    watchedRes.data.forEach(item => newMap.set(item.club, item.id));
                    setFollowedMap(newMap);
                } catch (error) {
                    console.error("Błąd pobierania obserwowanych klubów:", error);
                }
            }

            // Then fetch other context data in parallel
            const [relationsRes, userClubRes] = await Promise.allSettled([
                api.get('/relations/'),
                api.get('/clubs/user/')
            ]);
            if (relationsRes.status === 'fulfilled') setRelationsMap(parseRelationsToMap(relationsRes.value.data));
            if (userClubRes.status === 'fulfilled') {
                const userData = userClubRes.value.data;
                if (userData && userData.club_name) setUserClub(userData.club_name);
            }
        } catch (error) { console.error("Błąd danych kontekstowych:", error); }
    };
    fetchContextData();
  }, [user]);

  const fetchClubs = useCallback(async (pageNumber: number, isLoadMore: boolean) => {
    if (isLoadMore) setIsLoadingMore(true); else setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      params.append('ordering', `${sortOrder === 'desc' ? '-' : ''}${sortField}`);
      params.append('page', pageNumber.toString());
      const response = await api.get<{ results: Club[]; next: string | null }>(`/clubs/search/?${params.toString()}`);
      const data = response.data;
      const newClubs = Array.isArray(data) ? data : (data?.results || []);
      const hasNextPage = !!data?.next;
      if (isLoadMore) setClubs(prev => [...(prev || []), ...newClubs]);
      else setClubs(newClubs);
      setHasMore(hasNextPage);
    } catch (error) { console.error("Błąd pobierania klubów:", error); }
    finally { setIsLoading(false); setIsLoadingMore(false); }
  }, [debouncedSearch, sortField, sortOrder]);

  useEffect(() => { setPage(1); fetchClubs(1, false); }, [debouncedSearch, sortField, sortOrder, fetchClubs]);

  const handleLoadMore = () => { const nextPage = page + 1; setPage(nextPage); fetchClubs(nextPage, true); };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const calculateRelation = useCallback((clubName: string): RelationStatus => {
    if (!userClub) return 'unknown';
    if (clubName === userClub) return 'favorite';
    const relation = relationsMap[userClub]?.[clubName]?.toUpperCase();
    if (relation === 'KOSA') return 'dangerous';
    if (relation === 'ZGODA') return 'safe';
    if (relation === 'NEUTRALNIE') return 'neutral';
    return 'unknown';
  }, [userClub, relationsMap]);

  const renderSortArrow = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ArrowDownIcon className="ml-1 h-4 w-4" /> : <ArrowUpIcon className="ml-1 h-4 w-4" />;
  };

  return (
    <div className="relative w-full py-6 md:py-8 antialiased">
      <h2 className="mb-4 md:mb-[40px] text-lg md:text-[20px] font-medium uppercase text-white leading-[130%]">
        Lista klubów
      </h2>

        <div className="relative w-full mb-[40px]">
        <div className="flex h-[60px] items-center gap-4 rounded-[50px] bg-[#2A2A2A] px-6 shadow-[0px_6px_7px_rgba(0,0,0,0.25)] border border-transparent focus-within:border-[#274fde]/50 transition-all">
          <MagnifyingGlassIcon className="h-7 w-7 text-white" />
          <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Szukaj klubu..."
          className="flex-1 bg-transparent text-[18px] font-medium text-white placeholder-gray-400 outline-none w-full leading-[130%]"
          />
        </div>
        </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-white text-lg">Ładowanie...</p>
        </div>
      ) : (
      <div className="relative w-full overflow-hidden bg-transparent">
        <div className="hidden md:block border border-[#274FDE] rounded-t-[30px] bg-[#2A2A2A] overflow-hidden">
          <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr] items-center h-[64px] select-none">
            <p className="text-center text-[16px] font-medium text-white leading-[130%]">Obserwuj</p>
            <div className="flex justify-center items-center cursor-pointer hover:text-[#274fde] transition-colors" onClick={() => handleSort('name')}>
                <p className="text-[16px] font-medium text-white leading-[130%]">Klub</p>
                {renderSortArrow('name')}
            </div>
            <div className="flex justify-center items-center cursor-pointer hover:text-[#274fde] transition-colors" onClick={() => handleSort('city')}>
                <p className="text-[16px] font-medium text-white leading-[130%]">Miasto</p>
                {renderSortArrow('city')}
            </div>
            <div className="flex justify-center items-center cursor-pointer hover:text-[#274fde] transition-colors" onClick={() => handleSort('relation')}>
                <p className="text-[16px] font-medium text-white leading-[130%]">Relacje</p>
                {renderSortArrow('relation')}
            </div>
          </div>
        </div>

        <div className="bg-[#343434] rounded-b-[30px] overflow-hidden border-x border-b border-[#274FDE]/40">
          <div className="divide-y divide-[#274FDE]/40">
            {clubs.map((club) => {
              const status = calculateRelation(club.name);
              return (
                <ClubRow 
                  key={club.id}
                  club={club}
                  status={status}
                  followedMap={followedMap}
                  onClubSelect={onClubSelect}
                />
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center py-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="rounded-[50px] bg-[#274fde] px-10 h-[45px] text-white font-medium hover:bg-[#1e3fbd] transition-all flex items-center justify-center shadow-md active:scale-95 leading-[130%]"
                >
                    {isLoadingMore ? 'Ładowanie...' : 'Załaduj więcej'}
                </button>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}