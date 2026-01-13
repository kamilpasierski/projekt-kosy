// Zmieniamy interfejs propsów, aby pasował do danych z backendu
export interface RelatedClub {
  id: number;
  name: string;
  path_image: string; // Mapowanie z pola w DB
}

interface RelationsProps {
  kosaClubs: RelatedClub[];
  neutralClubs: RelatedClub[];
  zgodaClubs: RelatedClub[];
  onReportChange?: () => void;
}

// Stała dla base URL mediów
const API_BASE_URL = 'http://127.0.0.1:8000/media/'; 

export default function Relations({
  kosaClubs,
  neutralClubs,
  zgodaClubs,
  onReportChange
}: RelationsProps) {
    
  // Helper do renderowania listy, żeby nie powielać kodu HTML
  const renderList = (clubs: RelatedClub[]) => (
      <div className="space-y-4">
        {clubs.map((club, index) => (
        <div key={club.id}>
            <div className="flex items-center gap-3">
            <img 
                src={club.path_image ? `${API_BASE_URL}${club.path_image}` : "https://via.placeholder.com/57"} 
                alt={club.name} 
                className="h-[57px] w-[56px] object-contain" 
            />
            <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white">
                {club.name}
            </p>
            </div>
            {index < clubs.length - 1 && (
            <div className="my-4 h-[1px] bg-gray-600" />
            )}
        </div>
        ))}
        {clubs.length === 0 && <p className="text-gray-500 text-sm">Brak danych</p>}
      </div>
  );

  return (
    <div className="relative w-full max-w-[1440px] py-16">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-[calc(6.25%+54px)] pr-[calc(10.76%)]">
        <h2 className="font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
          RELACJE Z INNYMI KLUBAMI
        </h2>
        {/* Button code... */}
      </div>

      {/* Main Container */}
      <div className="mx-[8.75%] rounded-[30px] bg-[#2a2a2a] p-4">
        <div className="grid grid-cols-3 gap-4">
          
          {/* KOSA */}
          <div className="flex flex-col">
            <div className="mb-4 rounded-[30px] bg-[rgba(138,37,37,0.1)] pb-2">
              <div className="rounded-t-[30px] bg-[#8a2525] py-3 text-center">
                <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white">KOSA</h3>
              </div>
            </div>
            {renderList(kosaClubs)}
          </div>

          {/* NEUTRALNIE */}
          <div className="flex flex-col">
             {/* Header neutral ... */}
             <div className="mb-4 rounded-[30px] bg-[rgba(251,242,1,0.1)] pb-2">
                <div className="rounded-t-[30px] bg-[#fbf201] py-3 text-center">
                    <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-black">NEUTRALNIE</h3>
                </div>
            </div>
            {renderList(neutralClubs)}
          </div>

          {/* ZGODA */}
          <div className="flex flex-col">
            {/* Header zgoda ... */}
            <div className="mb-4 rounded-[30px] bg-[rgba(36,127,70,0.1)] pb-2">
              <div className="rounded-t-[30px] bg-[#247f46] py-3 text-center">
                <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white">ZGODA</h3>
              </div>
            </div>
            {renderList(zgodaClubs)}
          </div>

        </div>
      </div>
    </div>
  );
}