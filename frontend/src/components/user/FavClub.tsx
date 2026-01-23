import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { relationsApi } from '../../api/relations';
import { getClubImageUrl, DEFAULT_LOGO } from '../../utils/imageUtils';

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

  useEffect(() => {
    const initData = async () => {
      try {
        const clubsData = await relationsApi.getAllClubs();
        setClubs(clubsData);
        const userRes = await api.get('/add_fav/');
        if (userRes.data.club_id) setSelectedClubId(userRes.data.club_id);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

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

  if (isLoading) return <div className="text-white p-6">Ładowanie...</div>;

  return (
    <div className="relative w-full max-w-[1180px] mx-auto font-montserrat antialiased" data-name="MOJE OBSERWOWANE KLUBY">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 px-2 md:px-0">
        <p className="font-medium text-[20px] text-white uppercase tracking-widest">
          Mój ulubiony klub
        </p>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-[#343434] rounded-[30px] px-6 py-2 border border-transparent hover:border-[#247f46] transition-all">
            <span className="text-[14px] text-white uppercase">Zmień klub</span>
          </button>
        )}
      </div>


      <div className="w-full min-h-[336px] bg-[#2A2A2A] border border-[#247F46] rounded-[30px] p-[30px] flex items-center justify-center">


        <div className="w-full h-full min-h-[276px] bg-[#247F46]/50 border border-[#247F46] rounded-[30px] p-8 md:p-[43px] flex items-center overflow-hidden">

          {isEditing ? (
            <div className="flex flex-col gap-6 w-full relative z-10">
              <label className="text-white text-lg font-medium">Wybierz klub z listy:</label>
              <select
                value={selectedClubId || ''}
                onChange={(e) => setSelectedClubId(Number(e.target.value))}
                className="w-full max-w-[500px] bg-[#343434] text-white border border-[#555] rounded-[15px] p-4 focus:border-[#247f46] outline-none"
              >
                <option value="" disabled>-- Wybierz klub --</option>
                {clubs.map(club => <option key={club.id} value={club.id}>{club.name}</option>)}
              </select>
              <div className="flex gap-4">
                <button onClick={handleSave} disabled={isSaving || !selectedClubId} className="bg-[#247f46] text-white px-8 py-3 rounded-[30px] font-semibold uppercase text-sm disabled:opacity-50">
                  {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
                <button onClick={() => setIsEditing(false)} className="border border-white/20 text-white px-8 py-3 rounded-[30px] font-medium uppercase text-sm">
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col md:flex-row items-center gap-10">
              {currentClub ? (
                <>

                  <div className="w-[273px] h-[250px] bg-[#343434] border-[0.5px] border-[#222629] rounded-[30px] shadow-[-5px_5px_18px_rgba(0,0,0,0.6)] flex-shrink-0 flex items-center justify-center p-6">
                    <img
                      src={getClubImageUrl(currentClub.path_image)}
                      alt={currentClub.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== DEFAULT_LOGO) target.src = DEFAULT_LOGO;
                      }}
                    />
                  </div>

                  {/* SEKCJA TEKSTOWA */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-white font-semibold text-[20px] uppercase mb-2 tracking-[0.5px]">
                      Twój ulubiony klub:
                    </span>
                    <div className="h-[1px] w-[314px] bg-white mb-5 opacity-80" />
                    <h2 className="font-bold text-[32px] text-white uppercase leading-[130%] tracking-[1px]">
                      {currentClub.name}
                    </h2>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 w-full">
                  <p className="text-gray-300 text-lg mb-4">Brak wybranego klubu.</p>
                  <button onClick={() => setIsEditing(true)} className="text-[#247f46] font-bold uppercase tracking-widest hover:underline">
                    Wybierz teraz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowedClubs;