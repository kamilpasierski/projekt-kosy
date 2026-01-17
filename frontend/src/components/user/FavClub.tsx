import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig'; 
import { relationsApi } from '../../api/relations';

// --- KONFIGURACJA ---
const API_BASE_URL = 'http://127.0.0.1:8000';
const MEDIA_URL = `${API_BASE_URL}/media/`;

// Fallback, gdy brak zdjęcia lub path_image jest null
const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTAgMTUwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMzNDM0MzQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZHk9Ii4zZW0iIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkZMQUc8L3RleHQ+PC9zdmc+";

// --- INTERFEJSY ---
interface ClubData {
  id: number;
  name: string;
  path_image?: string | null; 
}

const FollowedClubs = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const initData = async () => {
      try {
        const clubsData = await relationsApi.getAllClubs();
        setClubs(clubsData);

        const userRes = await api.get('/add_fav/');
        if (userRes.data.club_id) {
            setSelectedClubId(userRes.data.club_id);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // --- Save Handler ---
  const handleSave = async () => {
    if (!selectedClubId) return;
    setIsSaving(true);
    try {
      await api.post('/add_fav/', { club_id: selectedClubId });
      setIsEditing(false);
    } catch (error) {
      console.error("Nie udało się zapisać:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const currentClub = clubs.find(c => c.id === selectedClubId);

  if (isLoading) return <div className="text-white p-6">Ładowanie preferencji...</div>;

  return (
    <div className="relative w-full font-montserrat" data-name="MOJE OBSERWOWANE KLUBY">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <p className="font-medium text-[20px] text-white uppercase leading-[1.3]">
          Mój ulubiony klub
        </p>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-[#343434] rounded-[30px] px-6 py-2 flex items-center gap-2 hover:bg-[#404040] transition-colors border border-transparent hover:border-[#247f46]"
          >
            <span className="font-medium text-[16px] text-white leading-[1.3]">
              Zmień klub
            </span>
          </button>
        )}
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-[rgba(36,127,70,0.15)] border border-[#247f46] rounded-[30px] p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#247f46]/20 to-transparent pointer-events-none" />

        {isEditing ? (
          // --- EDIT MODE ---
          <div className="flex flex-col gap-6 relative z-10 animate-in fade-in duration-300">
            <label className="text-white text-lg">Wybierz klub z listy:</label>
            <select
              value={selectedClubId || ''}
              onChange={(e) => setSelectedClubId(Number(e.target.value))}
              className="w-full bg-[#343434] text-white border border-[#555] rounded-[15px] p-4 text-lg focus:outline-none focus:border-[#247f46] transition-colors"
            >
              <option value="" disabled>-- Wybierz klub --</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>

            <div className="flex gap-4 mt-4">
              <button 
                onClick={handleSave}
                disabled={isSaving || !selectedClubId}
                className="bg-[#247f46] hover:bg-[#1e6b3b] text-white px-8 py-3 rounded-[30px] font-semibold transition-all disabled:opacity-50"
              >
                {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-transparent border border-[#555] text-[#ccc] hover:text-white hover:border-white px-8 py-3 rounded-[30px] font-medium transition-all"
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : (
          // --- VIEW MODE ---
          <div className="relative z-10">
            {currentClub ? (
              <div className="flex flex-col md:flex-row items-center gap-8">
                
                {/* LOGO CONTAINER */}
                <div className="bg-[#343434] border-[0.5px] border-[#222629] rounded-[30px] p-6 shadow-xl w-full md:w-auto min-w-[200px] flex justify-center">
                  <img src={currentClub.path_image 
                          ? `${MEDIA_URL}${currentClub.path_image}` 
                          : DEFAULT_LOGO
                      } 
                      alt={currentClub.name}
                      className="h-[120px] w-auto object-contain drop-shadow-lg"
                      onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // CRITICAL FIX: Sprawdzamy, czy obrazek to już nie jest nasz placeholder.
                          // Jeśli tak - przerywamy, żeby nie robić pętli.
                          if (target.src !== DEFAULT_LOGO) {
                              target.src = DEFAULT_LOGO;
                          }
                      }}
                    />
                </div>

                <div className="flex flex-col gap-2 text-center md:text-left">
                  <span className="text-[#247f46] font-bold tracking-wider text-sm uppercase">Twój ulubiony klub:</span>
                  <h2 className="font-semibold text-[32px] text-white uppercase leading-tight tracking-wide">
                    {currentClub.name}
                  </h2>
                  <div className="h-[2px] w-[60px] bg-[#247f46] my-2 mx-auto md:mx-0"></div>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg mb-4">Nie wybrałeś jeszcze ulubionego klubu.</p>
                <button onClick={() => setIsEditing(true)} className="text-[#247f46] font-bold hover:underline">
                  Wybierz teraz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedClubs;