import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Definicja interfejsu zgodna z odpowiedzią z Django Serializer
interface Club {
  id: number;
  name: string;
  city: string;
  path_image: string; 
  points: number;
}

// Stała dla adresu API (warto przenieść do zmiennych środowiskowych .env w przyszłości)
const API_BASE_URL = 'http://127.0.0.1:8000'; 
const MEDIA_URL = `${API_BASE_URL}/media/`; 

export default function PopularClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/clubs/popular/`);
        if (!response.ok) {
          throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        setClubs(data);
      } catch (err) {
        console.error(err);
        setError('Nie udało się załadować klubów.');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <div className="text-white p-6">Ładowanie rankingu...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

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
        {clubs.map((club) => (
          <div
            key={club.id}
            className="grid grid-cols-[1fr_auto_2fr_auto_2fr_auto_1.5fr] items-center gap-4 px-6 py-6 hover:bg-[#3a3a3a] transition-colors"
          >
            {/* Logo */}
            <div className="flex justify-start">
              <img 
                // Konstrukcja pełnego URL do obrazka
                src={club.path_image ? `${MEDIA_URL}${club.path_image}` : "https://via.placeholder.com/32"} 
                alt={club.name} 
                className="h-[40px] w-[32px] object-contain" 
              />
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
                to={`/club/${club.id}`} // Dynamiczne linkowanie do ID
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