import { getClubImageUrl } from '../../utils/imageUtils';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export interface RelatedClub {
  id?: number;
  name: string;
  path_image: string;
}

interface Relation {
  clubA: RelatedClub;
  clubB: RelatedClub;
  relationType: 'kosa' | 'zgoda' | 'neutralnie';
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

  const renderRelationCard = (relation: Relation) => {
    const { clubA, clubB, relationType } = relation;
    
    return (

      <div key={`${clubA.name}-${clubB.name}`} className="p-4 md:p-6 flex flex-col justify-center font-montserrat min-h-[100px]">
        <div className="flex items-center gap-4">
          <img
            src={getClubImageUrl(clubA.path_image)}
            alt={clubA.name}
            className="h-[50px] w-[50px] md:h-[60px] md:w-[60px] object-contain flex-shrink-0"
          />
            <div className="flex items-center justify-center flex-shrink-0">
            <ArrowRightIcon
              className="h-5 w-5 md:h-6 md:w-6"
              style={{ color: getArrowColor(relationType) }}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
            <p className="font-montserrat text-[16px] font-medium uppercase text-white leading-[130%] truncate">
              {clubA.name}
            </p>

            <p className="font-montserrat text-[16px] font-medium uppercase text-white leading-[130%] truncate">
              {clubB.name}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-8 md:py-12 lg:py-16 antialiased font-montserrat">
      {/* Kontener ograniczony do 1180px */}
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 lg:px-0">
        {/* Header Sekcji */}
        <div className="mb-6 md:mb-10">
          <h2 className="text-[20px] font-medium uppercase leading-[130%] text-white tracking-normal">
            NAJNOWSZE RELACJE
          </h2>
        </div>

        <div className="w-full border-x border-b border-[#274FDE]/20 rounded-[30px] overflow-hidden bg-[#2a2a2a] shadow-xl">


          <div className="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[50px]">
            <div className="bg-[#8A2525] flex items-center justify-center py-3 md:py-0 border-b md:border-b-0 md:border-r border-[#575757]/30">
              <h3 className="text-white text-[18px] font-semibold uppercase tracking-wider">Kosa</h3>
            </div>
            <div className="bg-[#FBF201] flex items-center justify-center py-3 md:py-0 border-b md:border-b-0 md:border-r border-[#575757]/30">
              <h3 className="text-black text-[18px] font-semibold uppercase tracking-wider">Neutralnie</h3>
            </div>
            <div className="bg-[#247F46] flex items-center justify-center py-3 md:py-0">
              <h3 className="text-white text-[18px] font-semibold uppercase tracking-wider">Zgoda</h3>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#575757]">
            {/* Kolumna KOSA */}
            <div className="flex flex-col divide-y divide-[#575757]/40">
              {kosaRelations.length > 0 ? (
                kosaRelations.map(rel => renderRelationCard(rel))
              ) : (
                <div className="p-8 text-center text-gray-500 italic text-sm flex items-center justify-center min-h-[100px]">Brak nowych relacji</div>
              )}
            </div>

            {/* Kolumna NEUTRALNIE */}
            <div className="flex flex-col divide-y divide-[#575757]/40">
              {neutralRelations.length > 0 ? (
                neutralRelations.map(rel => renderRelationCard(rel))
              ) : (
                <div className="p-8 text-center text-gray-500 italic text-sm flex items-center justify-center min-h-[100px]">Brak nowych relacji</div>
              )}
            </div>

            {/* Kolumna ZGODA */}
            <div className="flex flex-col divide-y divide-[#575757]/40">
              {zgodaRelations.length > 0 ? (
                zgodaRelations.map(rel => renderRelationCard(rel))
              ) : (
                <div className="p-8 text-center text-gray-500 italic text-sm flex items-center justify-center min-h-[100px]">Brak nowych relacji</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}