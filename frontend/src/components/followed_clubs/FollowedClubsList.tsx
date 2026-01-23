import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { getClubImageUrl } from '../../utils/imageUtils';
import api from '../../api/axiosConfig';

interface FollowedClub {
  favoriteId: number;
  created_at: string;
  mute: boolean;
  details: {
    id: number;
    name: string;
    path_image?: string;
  };
}

interface FollowedClubsListProps {
  clubs: FollowedClub[];
}

type SortOption = 'default' | 'alphabetical' | 'date';

const FollowedClubsList = ({ clubs }: FollowedClubsListProps) => {
  const navigate = useNavigate();
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [notificationsEnabled, setNotificationsEnabled] = useState<Record<number, boolean>>(
    clubs.reduce((acc, club) => ({ ...acc, [club.favoriteId]: !club.mute }), {})
  );

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setSortMenuOpen(false);
  };

  const toggleNotifications = async (favoriteId: number) => {
    const currentValue = notificationsEnabled[favoriteId];
    const newValue = !currentValue;
    
    // Optymistycznie zaktualizuj UI
    setNotificationsEnabled(prev => ({
      ...prev,
      [favoriteId]: newValue
    }));

    try {
      // Zaktualizuj bazę danych (mute jest odwrotnością włączonych powiadomień)
      await api.patch(`/add_fav/watched_clubs/${favoriteId}/`, {
        mute: !newValue
      });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Cofnij zmiany w przypadku błędu
      setNotificationsEnabled(prev => ({
        ...prev,
        [favoriteId]: currentValue
      }));
    }
  };

  const getSortedClubs = () => {
    const sorted = [...clubs];
    
    switch (sortBy) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.details.name.localeCompare(b.details.name));
      case 'date':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'default':
      default:
        return sorted;
    }
  };

  const sortedClubs = getSortedClubs();

  const getSortLabel = () => {
    switch (sortBy) {
      case 'alphabetical':
        return 'Alfabetycznie';
      case 'date':
        return 'Data dodania';
      case 'default':
      default:
        return 'Sortuj według';
    }
  };

  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-8">
      {/* Przycisk Sortowania */}
      <div className="relative mb-6 sm:mb-8">
        <button
          onClick={() => setSortMenuOpen(!sortMenuOpen)}
          className="bg-[#343434] hover:bg-[#404040] rounded-[50px] px-6 py-3 flex items-center gap-3 transition-colors"
        >
          <span className="font-['Montserrat'] font-medium text-[16px] text-white uppercase">
            {getSortLabel()}
          </span>
          <ChevronDownIcon 
            className={`w-5 h-5 text-white transition-transform ${sortMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* MENU SORTOWANIA */}
        {sortMenuOpen && (
          <div className="absolute top-full mt-2 left-0 bg-[#2a2a2a] border border-[#274fde] rounded-[20px] shadow-lg overflow-hidden z-10 min-w-[200px]">
            <button
              onClick={() => handleSortChange('alphabetical')}
              className="w-full px-6 py-3 text-left text-white hover:bg-[#343434] transition-colors font-['Montserrat'] font-medium text-[14px]"
            >
              Alfabetycznie
            </button>
            <button
              onClick={() => handleSortChange('date')}
              className="w-full px-6 py-3 text-left text-white hover:bg-[#343434] transition-colors font-['Montserrat'] font-medium text-[14px]"
            >
              Data dodania
            </button>
          </div>
        )}
      </div>

      {/* LISTA KLUBÓW */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {sortedClubs.map((club) => (
          <div
            key={club.favoriteId}
            className="bg-[#343434] border border-[#274fde] border-opacity-50 rounded-[30px] p-4 sm:p-5 md:p-6 hover:border-opacity-100 transition-all"
          >
            <div className="flex items-center gap-4 md:gap-6">
              {/* LOGO KLUBU */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center">
                <img
                  src={getClubImageUrl(club.details.path_image)}
                  alt={club.details.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* INFO KLUBU */}
              <div className="flex-1 min-w-0">
                <h3 className="font-['Montserrat'] font-medium text-[18px] sm:text-[20px] text-white mb-2">
                  {club.details.name}
                </h3>
                <p className="font-['Montserrat'] font-medium text-[14px] sm:text-[16px] text-white opacity-80">
                  Data dodania do obserwowanych - {new Date(club.created_at).toLocaleDateString('pl-PL')}
                </p>
              </div>

              {/* PRZEŁĄCZNIK POWIADOMIEŃ */}
              <div className="flex-shrink-0 hidden sm:flex flex-col items-center gap-2">
                <p className="font-['Montserrat'] font-medium text-[15px] text-white">
                  Powiadomienia
                </p>
                <button
                  onClick={() => toggleNotifications(club.favoriteId)}
                  className={`relative w-[38px] h-[19px] rounded-full shadow-md transition-colors ${
                    notificationsEnabled[club.favoriteId] ? 'bg-[#274fde]' : 'bg-[#939292]'
                  }`}
                >
                  <div
                    className={`absolute top-[1.5px] w-[16.625px] h-[16.625px] bg-white rounded-full shadow-md transition-transform ${
                      notificationsEnabled[club.favoriteId] ? 'right-[1.5px]' : 'left-[1.5px]'
                    }`}
                  />
                </button>
              </div>

              {/* PRZYCISK ZOBACZ KLUB */}
              <div className="flex-shrink-0 hidden md:block">
                <button
                  onClick={() => navigate(`/club/${club.details.id}`)}
                  className="bg-[#274fde] hover:bg-[#1e3fbd] text-white font-['Montserrat'] font-medium text-[16px] px-6 py-3 rounded-[50px] shadow-md transition-all"
                >
                  Zobacz klub
                </button>
              </div>
            </div>

            {/* KONTROLKI MOBILNE */}
            <div className="mt-4 flex flex-col sm:hidden gap-3">
              {/* PRZEŁĄCZNIK POWIADOMIEŃ MOBILNY */}
              <div className="flex items-center justify-between">
                <p className="font-['Montserrat'] font-medium text-[15px] text-white">
                  Powiadomienia
                </p>
                <button
                  onClick={() => toggleNotifications(club.favoriteId)}
                  className={`relative w-[38px] h-[19px] rounded-full shadow-md transition-colors ${
                    notificationsEnabled[club.favoriteId] ? 'bg-[#274fde]' : 'bg-[#939292]'
                  }`}
                >
                  <div
                    className={`absolute top-[1.5px] w-[16.625px] h-[16.625px] bg-white rounded-full shadow-md transition-transform ${
                      notificationsEnabled[club.favoriteId] ? 'right-[1.5px]' : 'left-[1.5px]'
                    }`}
                  />
                </button>
              </div>

              {/* PRZYCISK ZOBACZ KLUB MOBILNY */}
              <button
                onClick={() => navigate(`/club/${club.details.id}`)}
                className="md:hidden bg-[#274fde] hover:bg-[#1e3fbd] text-white font-['Montserrat'] font-medium text-[16px] px-6 py-3 rounded-[50px] shadow-md transition-all w-full"
              >
                Zobacz klub
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowedClubsList;
