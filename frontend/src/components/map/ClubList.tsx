import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useDebounce } from '../../hooks/useDebounce';
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { parseRelationsToMap, type RelationsMap } from '../../utils/geoUtils';
import { FollowButton } from '../common/FollowButton';
import { useAuth } from '../../context/AuthContext';
import { getClubImageUrl, DEFAULT_LOGO } from '../../utils/imageUtils';
import axios from 'axios';

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

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Club[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const API_URL = 'http://127.0.0.1:8000';

  // Obsługa Autocomplete (podpowiedzi)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await axios.get<Club[]>(`${API_URL}/clubs/autocomplete/?q=${searchQuery}`);
          setSuggestions(response.data);
          setIsSuggestionsOpen(true);
        } catch (error) {
          console.error("Błąd autocomplete:", error);
        }
      } else {
        setSuggestions([]);
        setIsSuggestionsOpen(false);
      }
    };
    fetchSuggestions();
  }, [searchQuery]);

  // Zamykanie podpowiedzi po kliknięciu poza
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchContextData = async () => {
        try {
            const [relationsRes, userClubRes, watchedRes] = await Promise.allSettled([
                api.get('/relations/'),
                api.get('/clubs/user/'),
                ...(user ? [api.get<WatchedClubItem[]>('/add_fav/watched_clubs')] : [])
            ]);
            if (relationsRes.status === 'fulfilled') setRelationsMap(parseRelationsToMap(relationsRes.value.data));
            if (userClubRes.status === 'fulfilled') {
                const userData = userClubRes.value.data;
                if (userData && userData.club_name) setUserClub(userData.club_name);
            }
            if (watchedRes && watchedRes.status === 'fulfilled') {
                const watchedData = watchedRes.value.data as WatchedClubItem[];
                const newMap = new Map<number, number>();
                watchedData.forEach(item => newMap.set(item.club, item.id));
                setFollowedMap(newMap);
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

  const calculateRelation = (clubName: string): RelationStatus => {
    if (!userClub) return 'unknown';
    if (clubName === userClub) return 'favorite';
    const relation = relationsMap[userClub]?.[clubName]?.toUpperCase();
    if (relation === 'KOSA') return 'dangerous';
    if (relation === 'ZGODA') return 'safe';
    if (relation === 'NEUTRALNIE') return 'neutral';
    return 'unknown';
  };

  const getRelationStyle = (status: RelationStatus) => {
    switch (status) {
      case 'favorite': return { bg: 'bg-[#20CA5F]/30', border: 'border-[#20CA5F]', label: 'Ulubiony' };
      case 'safe': return { bg: 'bg-[#20CA5F]/30', border: 'border-[#20CA5F]', label: 'Zgoda' };
      case 'dangerous': return { bg: 'bg-[#CB0000]/30', border: 'border-[#CB0000]', label: 'Kosa' };
      case 'neutral': return { bg: 'bg-[#FBF201]/30', border: 'border-[#FBF201]', label: 'Neutralnie' };
      default: return { bg: 'bg-[#727681]/30', border: 'border-[#727681]', label: 'Brak danych' };
    }
  };

  const renderSortArrow = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ArrowDownIcon className="ml-1 h-4 w-4" /> : <ArrowUpIcon className="ml-1 h-4 w-4" />;
  };

  return (
    <div className="relative w-full py-6 md:py-8 px-4">
      <h2 className="mb-4 md:mb-[40px] text-lg md:text-[20px] font-medium uppercase text-white tracking-widest">Lista klubów</h2>

      {/* --- WYSZUKIWARKA IDENTYCZNA JAK NA STRONIE GŁÓWNEJ --- */}
      <div ref={wrapperRef} className="relative w-full mb-[40px]">
          <div className="flex h-[60px] items-center gap-4 rounded-[50px] bg-[#2A2A2A] px-6 shadow-[0px_6px_7px_rgba(0,0,0,0.25)] border border-transparent focus-within:border-[#274fde]/50 transition-all">
              <MagnifyingGlassIcon className="h-7 w-7 text-white" />
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj klubu..."
                  className="flex-1 bg-transparent text-[18px] font-medium text-white placeholder-gray-400 outline-none w-full"
              />
          </div>

          {/* DROPDOWN PODPOWIEDZI */}
          {isSuggestionsOpen && suggestions.length > 0 && (
              <div className="absolute left-0 top-[65px] z-[100] w-full overflow-hidden rounded-[20px] border border-[#444] bg-[#2a2a2a] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <ul className="max-h-[250px] overflow-y-auto py-2 custom-scrollbar">
                      {suggestions.map((club) => (
                          <li
                              key={club.id}
                              onClick={() => {
                                setSearchQuery(club.name);
                                setIsSuggestionsOpen(false);
                                onClubSelect(club.name);
                              }}
                              className="cursor-pointer px-6 py-3 text-[16px] text-white hover:bg-[#343434] transition-colors border-b border-white/5 last:border-0"
                          >
                              {club.name}
                          </li>
                      ))}
                  </ul>
              </div>
          )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-white text-lg">Ładowanie...</p>
        </div>
      ) : (
      <div className="relative w-full overflow-hidden bg-transparent">
        {/* NAGŁÓWEK TABELI */}
        <div className="hidden md:block border border-[#274FDE] rounded-t-[30px] bg-[#2A2A2A] overflow-hidden">
          <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr] items-center h-[64px] select-none">
            <p className="text-center text-[16px] font-medium text-white">Obserwuj</p>
            <div className="flex justify-center items-center cursor-pointer hover:text-[#274fde]" onClick={() => handleSort('name')}>
                <p className="text-[16px] font-medium text-white">Klub</p>
            </div>
            <div className="flex justify-center items-center cursor-pointer hover:text-[#274fde]" onClick={() => handleSort('city')}>
                <p className="text-[16px] font-medium text-white">Miasto</p>
                {renderSortArrow('city')}
            </div>
            <div className="flex justify-center items-center cursor-pointer hover:text-[#274fde]" onClick={() => handleSort('relation')}>
                <p className="text-[16px] font-medium text-white">Relacje</p>
                {renderSortArrow('relation')}
            </div>
          </div>
        </div>

        {/* WIERSZE */}
        <div className="bg-[#343434] rounded-b-[30px] overflow-hidden border-x border-b border-transparent">
          <div className="divide-y divide-[#274FDE]/40">
            {clubs.map((club) => {
              const status = calculateRelation(club.name);
              const style = getRelationStyle(status);
              return (
                <div key={club.id} className="group border-b border-[#274FDE]/40 last:border-0 hover:bg-[#3a3a3a] transition-colors">
                  <div className="hidden md:grid grid-cols-[1fr_0.8px_1.5fr_0.8px_1fr_0.8px_1fr] items-center h-[80px]">

                    <div className="flex justify-center items-center">
                        <FollowButton clubId={club.id} initialRelationId={followedMap.get(club.id)} />
                    </div>
                    <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                    <div className="flex items-center justify-start gap-4 pl-12 cursor-pointer" onClick={() => onClubSelect(club.name)}>
                        <img
                          src={getClubImageUrl(club.path_image)}
                          alt={club.name}
                          className="h-[54px] w-[54px] object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_LOGO; }}
                        />
                        <p className="text-[16px] font-medium text-white truncate">{club.name}</p>
                    </div>
                    <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                    <div className="flex justify-center items-center cursor-pointer" onClick={() => onClubSelect(club.name)}>
                        <p className="text-[16px] font-medium text-white">{club.city}</p>
                    </div>
                    <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                    <div className="flex justify-center items-center">
                        <div className={`${style.bg} ${style.border} border-2 w-[180px] h-[40px] rounded-[30px] flex items-center justify-center text-white text-[14px] font-medium tracking-wide`}>
                            {style.label}
                        </div>
                    </div>
                  </div>

                  <div className="flex md:hidden items-center gap-4 px-4 py-4 text-white" onClick={() => onClubSelect(club.name)}>
                      <img src={getClubImageUrl(club.path_image)} className="h-10 w-10 object-contain" />
                      <div className="flex-1">
                          <p className="font-semibold">{club.name}</p>
                          <p className="text-xs text-gray-400">{club.city}</p>
                      </div>
                      <div className={`${style.bg} ${style.border} border px-3 py-1 rounded-full text-[10px] text-white font-medium`}>{style.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center py-6">
                <button onClick={handleLoadMore} disabled={isLoadingMore} className="rounded-[50px] bg-[#274fde] px-10 py-2.5 text-white font-medium hover:bg-[#1e3fbd] transition-all">
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