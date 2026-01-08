import { Link } from 'react-router-dom';

interface Club {
  id: number;
  name: string;
  city: string;
  logoUrl: string;
}

const defaultLogoUrl = "https://www.figma.com/api/mcp/asset/f72a7032-8b30-4875-a185-3e21d468e9a7";

const SAMPLE_CLUBS: Club[] = [
  {
    id: 1,
    name: 'Legia Warszawa',
    city: 'Warszawa',
    logoUrl: defaultLogoUrl,
  },
  {
    id: 2,
    name: 'Legia Warszawa',
    city: 'Warszawa',
    logoUrl: defaultLogoUrl,
  },
  {
    id: 3,
    name: 'Legia Warszawa',
    city: 'Warszawa',
    logoUrl: defaultLogoUrl,
  },
  {
    id: 4,
    name: 'Legia Warszawa',
    city: 'Warszawa',
    logoUrl: defaultLogoUrl,
  },
  {
    id: 5,
    name: 'Legia Warszawa',
    city: 'Warszawa',
    logoUrl: defaultLogoUrl,
  },
  {
    id: 6,
    name: 'Legia Warszawa',
    city: 'Warszawa',
    logoUrl: defaultLogoUrl,
  },
];

export default function PopularClubs() {
  return (
    <div className="relative w-full overflow-hidden rounded-[30px] border border-[#343434] bg-[#343434]">
      {/* Table Header */}
      <div className="border-b border-[#274fde] bg-[#2a2a2a]">
        <div className="grid grid-cols-[1fr_auto_2fr_auto_2fr_auto_1.5fr] items-center gap-4 px-6 py-4">
          <p className="font-['Montserrat'] text-[16px] font-medium text-white">Herb</p>
          <div className="h-12 w-px bg-gray-700" />
          <p className="font-['Montserrat'] text-[16px] font-medium text-white">Nazwa klubu</p>
          <div className="h-12 w-px bg-gray-700" />
          <p className="font-['Montserrat'] text-[16px] font-medium text-white">Lokalizacja</p>
          <div className="h-12 w-px bg-gray-700" />
          <p className="font-['Montserrat'] text-[16px] font-medium text-white">Relacje</p>
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-700">
        {SAMPLE_CLUBS.map((club) => (
          <div
            key={club.id}
            className="grid grid-cols-[1fr_auto_2fr_auto_2fr_auto_1.5fr] items-center gap-4 px-6 py-6 hover:bg-[#3a3a3a] transition-colors"
          >
            {/* Logo */}
            <div className="flex justify-start">
              <img src={club.logoUrl} alt={club.name} className="h-[40px] w-[32px] object-cover" />
            </div>
            
            <div className="h-12 w-px bg-gray-700" />

            {/* Club Name */}
            <p className="font-['Montserrat'] text-[16px] font-medium text-white">
              {club.name}
            </p>

            <div className="h-12 w-px bg-gray-700" />

            {/* City */}
            <p className="font-['Montserrat'] text-[16px] font-medium text-white">
              {club.city}
            </p>

            <div className="h-12 w-px bg-gray-700" />

            {/* Details Button */}
            <div className="flex justify-start">
              <Link
                to="/club"
                className="rounded-[50px] bg-[#274fde] px-6 py-2 font-['Montserrat'] text-[16px] font-medium text-white hover:bg-[#1e3fbd] transition-colors"
              >
                Szczegóły
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
