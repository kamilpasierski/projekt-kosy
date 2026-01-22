import { getClubImageUrl } from '../../utils/imageUtils';

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
} 

export default function Relations({
  kosaClubs,
  neutralClubs,
  zgodaClubs,
}: RelationsProps) {
    
  // Helper do renderowania listy, żeby nie powielać kodu HTML
  const renderList = (clubs: RelatedClub[]) => (
      <div className="space-y-3 sm:space-y-4">
        {clubs.map((club, index) => (
        <div key={club.id}>
            <div className="flex items-center gap-2 sm:gap-3">
            <img 
                src={getClubImageUrl(club.path_image)} 
                alt={club.name} 
                className="h-[45px] w-[44px] sm:h-[50px] sm:w-[49px] md:h-[57px] md:w-[56px] object-contain" 
            />
            <p className="font-['Montserrat'] text-[13px] sm:text-[14px] md:text-[16px] font-medium uppercase text-white">
                {club.name}
            </p>
            </div>
            {index < clubs.length - 1 && (
            <div className="my-3 sm:my-4 h-[1px] bg-gray-600" />
            )}
        </div>
        ))}
        {clubs.length === 0 && <p className="text-gray-500 text-xs sm:text-sm">Brak danych</p>}
      </div>
  );

  return (
    <div className="relative w-full max-w-[1440px] py-8 sm:py-12 md:py-16">
      {/* Header */}
      <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-between px-4 sm:px-8 md:px-[calc(6.25%+54px)] pr-4 sm:pr-8 md:pr-[calc(10.76%)]">
        <h2 className="font-['Montserrat'] text-[14px] sm:text-[16px] md:text-[20px] font-medium uppercase leading-[1.3] text-white">
          RELACJE Z INNYMI KLUBAMI
        </h2>
        {/* Button code... */}
      </div>

      {/* Main Container */}
      <div className="mx-4 sm:mx-8 md:mx-[8.75%] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] bg-[#2a2a2a] p-3 sm:p-3.5 md:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          
          {/* KOSA */}
          <div className="flex flex-col">
            <div className="mb-3 sm:mb-4 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] bg-[rgba(138,37,37,0.1)] pb-1.5 sm:pb-2">
              <div className="rounded-t-[20px] sm:rounded-t-[25px] md:rounded-t-[30px] bg-[#8a2525] py-2 sm:py-2.5 md:py-3 text-center">
                <h3 className="font-['Montserrat'] text-[16px] sm:text-[18px] md:text-[20px] font-semibold uppercase text-white">KOSA</h3>
              </div>
            </div>
            {renderList(kosaClubs)}
          </div>

          {/* NEUTRALNIE */}
          <div className="flex flex-col">
             {/* Header neutral ... */}
             <div className="mb-3 sm:mb-4 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] bg-[rgba(251,242,1,0.1)] pb-1.5 sm:pb-2">
                <div className="rounded-t-[20px] sm:rounded-t-[25px] md:rounded-t-[30px] bg-[#fbf201] py-2 sm:py-2.5 md:py-3 text-center">
                    <h3 className="font-['Montserrat'] text-[16px] sm:text-[18px] md:text-[20px] font-semibold uppercase text-black">NEUTRALNIE</h3>
                </div>
            </div>
            {renderList(neutralClubs)}
          </div>

          {/* ZGODA */}
          <div className="flex flex-col">
            {/* Header zgoda ... */}
            <div className="mb-3 sm:mb-4 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] bg-[rgba(36,127,70,0.1)] pb-1.5 sm:pb-2">
              <div className="rounded-t-[20px] sm:rounded-t-[25px] md:rounded-t-[30px] bg-[#247f46] py-2 sm:py-2.5 md:py-3 text-center">
                <h3 className="font-['Montserrat'] text-[16px] sm:text-[18px] md:text-[20px] font-semibold uppercase text-white">ZGODA</h3>
              </div>
            </div>
            {renderList(zgodaClubs)}
          </div>

        </div>
      </div>
    </div>
  );
}