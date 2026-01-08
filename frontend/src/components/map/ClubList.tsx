interface Club {
  id: number;
  name: string;
  city: string;
  logoUrl: string;
  relation: 'safe' | 'dangerous' | 'neutral';
  isFavorite?: boolean;
}

interface ClubListProps {
  title?: string;
  searchPlaceholder?: string;
  clubs?: Club[];
  onSearch?: (query: string) => void;
  onToggleFavorite?: (clubId: number) => void;
  onClubClick?: (clubId: number) => void;
}

const imgSearchIcon = "https://www.figma.com/api/mcp/asset/297743f0-a31b-482f-b43d-4bfca7918583";
const imgStarOutline = "https://www.figma.com/api/mcp/asset/8a7e4590-fb53-4cc5-b26c-41a17a0aee95";
const imgStarFilled = "https://www.figma.com/api/mcp/asset/e36aade4-3f3a-4620-b04c-5aeb0d94ef5e";

const defaultClubs: Club[] = [
  { id: 1, name: "Legia Warszawa", city: "Warszawa", logoUrl: "https://www.figma.com/api/mcp/asset/67a88408-752b-414f-9a3a-8dd5d7e8a78b", relation: 'safe', isFavorite: true },
  { id: 2, name: "Polonia Warszawa", city: "Warszawa", logoUrl: "https://www.figma.com/api/mcp/asset/aa9cf8c2-bbbd-4179-8477-647a27abc6ce", relation: 'dangerous', isFavorite: false },
  { id: 3, name: "Lechia Gdańsk", city: "Gdańsk", logoUrl: "https://www.figma.com/api/mcp/asset/4044f8db-1f46-4463-8826-bc95b6622165", relation: 'safe', isFavorite: false },
  { id: 4, name: "Lech Poznań", city: "Poznań", logoUrl: "https://www.figma.com/api/mcp/asset/80a3c0f0-82a0-4db9-8124-8c1f8b65d4b0", relation: 'neutral', isFavorite: false },
];

export default function ClubList({
  title = "Lista klubów",
  searchPlaceholder = "Szukaj klubu",
  clubs = defaultClubs,
  onSearch,
  onToggleFavorite,
  onClubClick
}: ClubListProps) {
  const getRelationStyle = (relation: Club['relation']) => {
    switch (relation) {
      case 'safe':
        return { bg: 'bg-[#20ca5f]', text: 'text-white', label: 'Bezpiecznie' };
      case 'dangerous':
        return { bg: 'bg-[#cb0000]', text: 'text-white', label: 'Niebezpiecznie' };
      case 'neutral':
        return { bg: 'bg-[#fbf201]', text: 'text-black', label: 'Neutralnie' };
    }
  };

  return (
    <div className="relative w-full max-w-[1440px] py-8">
      {/* Title */}
      <h2 className="mb-6 px-[calc(6.25%+40px)] font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
        {title}
      </h2>

      {/* Search Bar */}
      <div className="mx-[8.96%] mb-6 flex items-center gap-4 rounded-[30px] bg-[#2a2a2a] px-6 py-4">
        <img src={imgSearchIcon} alt="" className="h-6 w-6" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="flex-1 bg-transparent font-['Montserrat'] text-[16px] font-medium text-white placeholder:text-white outline-none"
        />
      </div>

      {/* Table */}
      <div className="mx-[calc(6.25%+33px)] overflow-hidden rounded-[30px] bg-[#343434]">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4 border-b-[0.5px] border-[#274fde] bg-[#2a2a2a] px-6 py-4">
          <div className="w-12" /> {/* Spacer for favorite icon */}
          <p className="font-['Montserrat'] text-[16px] font-medium text-white">Klub</p>
          <p className="text-center font-['Montserrat'] text-[16px] font-medium text-white">Miasto</p>
          <p className="text-center font-['Montserrat'] text-[16px] font-medium text-white">Relacje</p>
        </div>

        {/* Club Rows */}
        <div className="divide-y divide-gray-700">
          {clubs.map((club) => {
            const relationStyle = getRelationStyle(club.relation);
            return (
              <div
                key={club.id}
                className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                onClick={() => onClubClick?.(club.id)}
              >
                {/* Favorite Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.(club.id);
                  }}
                  className="flex h-12 w-12 items-center justify-center"
                >
                  <img
                    src={club.isFavorite ? imgStarFilled : imgStarOutline}
                    alt=""
                    className="h-6 w-6"
                  />
                </button>

                {/* Club Name and Logo */}
                <div className="flex items-center gap-4">
                  <img src={club.logoUrl} alt="" className="h-[54px] w-[54px] object-cover" />
                  <p className="font-['Montserrat'] text-[16px] font-medium text-white">
                    {club.name}
                  </p>
                </div>

                {/* City */}
                <p className="text-center font-['Montserrat'] text-[16px] font-medium text-white">
                  {club.city}
                </p>

                {/* Relation Badge */}
                <div className="flex justify-center">
                  <span className={`${relationStyle.bg} ${relationStyle.text} rounded-[50px] px-6 py-2 font-['Montserrat'] text-[16px] font-medium`}>
                    {relationStyle.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
