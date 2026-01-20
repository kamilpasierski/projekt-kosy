import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Club {
  id: number;
  name: string;
  city: string;
  path_image: string;
  points: number;
}

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
          throw new Error('Błąd HTTP: ' + response.status);
        }
        const data = await response.json();
        setClubs(data);
      } catch (err) {
        console.error(err);
        setError('Nie udało się załadować danych.');
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
      {/* Nagłówek tabeli */}
      <div className="hidden md:block border-b border-[#274fde] bg-[#2a2a2a]">
        <div className="grid grid-cols-[1fr_auto_2fr_auto_2fr_auto_1.5fr] items-center gap-4 px-6 py-4">
          <p className="text-sm md:text-[16px] font-medium text-white">Herb</p>
          <div className="h-8 md:h-12 w-px bg-gray-700" />
          <p className="text-sm md:text-[16px] font-medium text-white">Nazwa klubu</p>
          <div className="h-8 md:h-12 w-px bg-gray-700" />
          <p className="text-sm md:text-[16px] font-medium text-white">Lokalizacja</p>
          <div className="h-8 md:h-12 w-px bg-gray-700" />
          <p className="text-sm md:text-[16px] font-medium text-white">Strona klubu</p>
        </div>
      </div>

      {/* Wiersze */}
      <div className="divide-y divide-gray-800 md:divide-gray-700">
        {clubs.map((club) => (
          <div key={club.id} className="group">
            {/* Karta mobilna (domyślnie) */}
            <div className="flex md:hidden items-center gap-4 px-4 py-4 hover:bg-[#3a3a3a] transition-colors">
              <Link to={`/club/${club.id}`} className="shrink-0">
                <img
                  src={club.path_image ? `${MEDIA_URL}${club.path_image}` : 'https://via.placeholder.com/40x32'}
                  alt={club.name}
                  className="h-[40px] w-[32px] object-contain transition-opacity hover:opacity-80"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/club/${club.id}`}
                  className="block truncate text-base font-semibold text-white hover:text-[#274fde] transition-colors"
                >
                  {club.name}
                </Link>
                <p className="text-sm text-white">{club.city}</p>
              </div>
              <div className="shrink-0">
                <Link
                  to={`/club/${club.id}`}
                  className="rounded-[50px] bg-[#274fde] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e3fbd] transition-colors"
                >
                  Szczegóły
                </Link>
              </div>
            </div>

            {/* Wiersz desktop */}
            <div className="hidden md:grid grid-cols-[1fr_auto_2fr_auto_2fr_auto_1.5fr] items-center gap-4 px-6 py-6 hover:bg-[#3a3a3a] transition-colors">
              {/* Logo */}
              <div className="flex justify-start">
                <Link to={`/club/${club.id}`} className="block">
                  <img
                    src={club.path_image ? `${MEDIA_URL}${club.path_image}` : 'https://via.placeholder.com/40x32'}
                    alt={club.name}
                    className="h-[40px] w-[32px] object-contain transition-opacity hover:opacity-80"
                  />
                </Link>
              </div>

              <div className="h-12 w-px bg-gray-700" />

              {/* Nazwa klubu */}
              <div className="flex justify-start">
                <Link
                  to={`/club/${club.id}`}
                  className="text-[16px] font-medium text-white hover:text-[#274fde] transition-colors"
                >
                  {club.name}
                </Link>
              </div>

              <div className="h-12 w-px bg-gray-700" />

              {/* Miasto */}
              <p className="text-[16px] font-medium text-white">{club.city}</p>

              <div className="h-12 w-px bg-gray-700" />

              {/* Przycisk szczegółów */}
              <div className="flex justify-start">
                <Link
                  to={`/club/${club.id}`}
                  className="rounded-[50px] bg-[#274fde] px-6 py-2 text-[16px] font-medium text-white hover:bg-[#1e3fbd] transition-colors"
                >
                  Szczegóły
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}