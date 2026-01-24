import { getClubImageUrl } from '../../utils/imageUtils';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export interface RelatedClub {
  id: number;
  name: string;
  path_image: string;
}

interface NewestRelationsProps {
  clubName: string;
  clubImage: string;
  kosaClubs: RelatedClub[];
  neutralClubs: RelatedClub[];
  zgodaClubs: RelatedClub[];
}

export default function NewestRelations({ 
  clubName,
  clubImage,
  kosaClubs, 
  neutralClubs, 
  zgodaClubs 
}: NewestRelationsProps) {
  const renderRelations = (clubs: RelatedClub[], relationType: 'kosa' | 'zgoda' | 'neutralnie') => {
    return clubs.slice(0, 3).map((club) => ({
      clubA: {
        name: clubName,
        path_image: clubImage
      },
      clubB: {
        name: club.name,
        path_image: club.path_image
      },
      relationType
    }));
  };

  const kosaRelations = renderRelations(kosaClubs, 'kosa');
  const neutralRelations = renderRelations(neutralClubs, 'neutralnie');
  const zgodaRelations = renderRelations(zgodaClubs, 'zgoda');

  // Pobierz kolor strzałki na podstawie typu relacji
  const getArrowColor = (type: 'kosa' | 'zgoda' | 'neutralnie') => {
    if (type === 'kosa') return '#8A2525';
    if (type === 'zgoda') return '#247F46';
    return '#FBF201';
  };

  const renderRelationCard = (relation: any) => {
    const { clubA, clubB, relationType } = relation;
    
    return (
      <div key={`${clubA.name}-${clubB.name}`} className="bg-[#2a2a2a] rounded-[20px] md:rounded-[30px] p-4 md:p-6 flex flex-col gap-2 md:gap-3">
        {/* Loga i nazwy klubów */}
        <div className="flex items-center gap-3 md:gap-4">
          <img
            src={getClubImageUrl(clubA.path_image)}
            alt={clubA.name}
            className="h-[50px] w-[50px] md:h-[70px] md:w-[69px] object-contain flex-shrink-0"
          />
            <div className="flex items-center justify-center flex-shrink-0">
            <ArrowRightIcon 
              className="h-5 w-5 md:h-6 md:w-6" 
              style={{ color: getArrowColor(relationType) }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-['Montserrat'] text-[14px] md:text-[16px] font-medium uppercase text-white leading-[1.3] truncate">
              {clubA.name}
            </p>
            <div className="h-[0.3px] bg-white/40 my-1.5 md:my-2" />
            <p className="font-['Montserrat'] text-[14px] md:text-[16px] font-medium uppercase text-white leading-[1.3] truncate">
              {clubB.name}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderColumn = (
    title: string,
    bgColor: string,
    textColor: string,
    relations: any[]
  ) => {
    return (
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Nagłówek */}
        <div
          className="h-[45px] md:h-[50px] flex items-center justify-center rounded-t-[20px] md:rounded-t-[30px]"
          style={{ backgroundColor: bgColor }}
        >
          <h3
            className="font-['Montserrat'] text-[16px] md:text-[18px] lg:text-[20px] font-semibold uppercase leading-[1.3]"
            style={{ color: textColor }}
          >
            {title}
          </h3>
        </div>

        {/* Lista relacji */}
        <div className="space-y-3 md:space-y-4">
          {relations.length > 0 ? (
            relations.map(relation => renderRelationCard(relation))
          ) : (
            <div className="bg-[#2a2a2a] rounded-[20px] md:rounded-[30px] p-4 md:p-6 text-center">
              <p className="font-['Montserrat'] text-gray-500 text-xs md:text-sm italic">
                Brak nowych relacji
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-8 md:py-12 lg:py-16 antialiased font-['Montserrat']">
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 lg:px-0">
        {/* Header */}
        <div className="mb-6 md:mb-8 lg:mb-10">
          <h2 className="font-['Montserrat'] text-[16px] md:text-[18px] lg:text-[20px] font-medium uppercase leading-[130%] text-white">
            NAJNOWSZE RELACJE
          </h2>
        </div>

        {/* Siatka trzech kolumn */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {/* Kolumna KOSA */}
          {renderColumn('KOSA', '#8A2525', '#FFFFFF', kosaRelations)}

          {/* Kolumna NEUTRALNIE */}
          {renderColumn('NEUTRALNIE', '#FBF201', '#000000', neutralRelations)}

          {/* Kolumna ZGODA */}
          {renderColumn('ZGODA', '#247F46', '#FFFFFF', zgodaRelations)}
        </div>
      </div>
    </div>
  );
}
