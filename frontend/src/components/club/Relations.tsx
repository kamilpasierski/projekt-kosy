import { useNavigate } from 'react-router-dom';
import { getClubImageUrl } from '../../utils/imageUtils';

export interface RelatedClub {
  id: number;
  name: string;
  path_image: string;
}

interface RelationsProps {
  kosaClubs: RelatedClub[];
  neutralClubs: RelatedClub[];
  zgodaClubs: RelatedClub[];
}

export default function Relations({
  kosaClubs,
  neutralClubs,
  zgodaClubs,
}: RelationsProps) {

  const navigate = useNavigate();

  const handleClubClick = (clubId: number) => {
    navigate(`/club/${clubId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderList = (clubs: RelatedClub[]) => (
      <div className="space-y-4 px-4 py-4">
        {clubs.map((club, index) => (
        <div key={club.id}>
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleClubClick(club.id)}
            >
            <img
                src={getClubImageUrl(club.path_image)}
                alt={club.name}
                className="h-[45px] w-[45px] object-contain"
            />
            <p className="font-['Montserrat'] text-[15px] font-medium uppercase text-white tracking-[0.6px]">
                {club.name}
            </p>
            </div>
            {index < clubs.length - 1 && (
            /* Linia podziału #575757 o grubości 0.2px */
            <div className="mt-4 h-[0.2px] bg-[#575757] w-full" />
            )}
        </div>
        ))}
        {clubs.length === 0 && (
          <p className="font-['Montserrat'] text-gray-500 text-sm italic text-center py-4">Brak danych</p>
        )}
      </div>
  );

  return (
    /* W-FULL zapewnia tło na całą szerokość, jeśli byś go potrzebowała,
       ale MX-AUTO i MAX-W-[1180px] pilnują szerokości kontenera z Figmy */
    <div className="w-full py-8 md:py-16 antialiased font-['Montserrat']">
      <div className="max-w-[1180px] mx-auto px-4 md:px-0">

        {/* Header sekcji */}
        <div className="mb-10">
          <h2 className="font-['Montserrat'] text-[18px] md:text-[20px] font-medium uppercase leading-[130%] text-white">
            RELACJE Z INNYMI KLUBAMI
          </h2>
        </div>

        {/* Główna karta - tło #2A2A2A, zaokrąglenie 30px */}
        <div className="w-full rounded-[30px] bg-[#2a2a2a] p-4 md:p-6 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* KOLUMNA KOSA - tło nagłówka #8A2525, tło listy 10% */}
            <div className="flex flex-col bg-[#8a25251a] rounded-[30px] overflow-hidden min-h-[341px]">
              <div className="bg-[#8a2525] h-[50px] flex items-center justify-center rounded-t-[30px]">
                <h3 className="font-['Montserrat'] text-[18px] font-semibold uppercase text-white">KOSA</h3>
              </div>
              {renderList(kosaClubs)}
            </div>

            {/* KOLUMNA NEUTRALNIE - tło nagłówka #FBF201, tło listy 10% */}
            <div className="flex flex-col bg-[#fbf2011a] rounded-[30px] overflow-hidden min-h-[341px]">
              <div className="bg-[#fbf201] h-[50px] flex items-center justify-center rounded-t-[30px]">
                  <h3 className="font-['Montserrat'] text-[18px] font-semibold uppercase text-black">NEUTRALNIE</h3>
              </div>
              {renderList(neutralClubs)}
            </div>

            {/* KOLUMNA ZGODA - tło nagłówka #247F46, tło listy 10% */}
            <div className="flex flex-col bg-[#247f461a] rounded-[30px] overflow-hidden min-h-[341px]">
              <div className="bg-[#247f46] h-[50px] flex items-center justify-center rounded-t-[30px]">
                <h3 className="font-['Montserrat'] text-[18px] font-semibold uppercase text-white">ZGODA</h3>
              </div>
              {renderList(zgodaClubs)}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}