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
const MEDIA_URL = `${API_BASE_URL}`;

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
    /* Zmieniono na w-full antialiased, aby komponent wypełnił page-container strony głównej */
    <div className="relative w-full overflow-hidden bg-transparent antialiased">

      {/* NAGŁÓWEK TABELI */}
      <div className="hidden md:block border border-[#274FDE] rounded-t-[30px] bg-[#2A2A2A] overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr] items-center h-[64px]">
          <p className="text-center text-[16px] font-medium text-white leading-[130%]">Herb</p>
          <p className="text-center text-[16px] font-medium text-white leading-[130%]">Nazwa klubu</p>
          <p className="text-center text-[16px] font-medium text-white leading-[130%]">Lokalizacja</p>
          <p className="text-center text-[16px] font-medium text-white leading-[130%]">Relacje</p>
        </div>
      </div>

      {/* WIERSZE */}
      <div className="bg-[#343434] rounded-b-[30px] overflow-hidden border-x border-b border-transparent">
        <div className="divide-y divide-[#274FDE]/40">
          {clubs.map((club) => (
            <div key={club.id} className="group border-b border-[#274FDE]/40 last:border-0">

              {/* WIDOK MOBILNY */}
              <div className="flex md:hidden items-center gap-4 px-4 py-4 hover:bg-[#3a3a3a] transition-colors text-white">
                <Link to={`/club/${club.id}`} className="shrink-0">
                  <img
                    src={club.path_image ? `${MEDIA_URL}${club.path_image}` : 'https://via.placeholder.com/40x32'}
                    alt={club.name}
                    className="h-[40px] w-[32px] object-contain"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/club/${club.id}`} className="block truncate text-base font-semibold leading-[130%]">
                    {club.name}
                  </Link>
                  <p className="text-sm text-gray-400 leading-[130%]">{club.city}</p>
                </div>
                <Link to={`/club/${club.id}`} className="rounded-[50px] bg-[#274fde] px-4 py-2 text-sm font-medium">
                  Szczegóły
                </Link>
              </div>

              {/* WIDOK DESKTOP*/}
              <div className="hidden md:grid grid-cols-[1fr_0.8px_1.5fr_0.8px_1fr_0.8px_1fr] items-center h-[80px] hover:bg-[#3a3a3a] transition-colors">

                {/* HERB */}
                <div className="flex justify-center items-center">
                  <Link to={`/club/${club.id}`}>
                    <img
                      src={club.path_image ? `${MEDIA_URL}${club.path_image}` : 'https://via.placeholder.com/40x32'}
                      alt={club.name}
                      className="h-[50px] w-[40px] object-contain"
                    />
                  </Link>
                </div>

                <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                {/* NAZWA KLUBU */}
                <div className="flex justify-center items-center">
                  <Link
                    to={`/club/${club.id}`}
                    className="text-[16px] font-medium text-white hover:text-[#274fde] transition-colors leading-[130%]"
                  >
                    {club.name}
                  </Link>
                </div>

                <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                {/* LOKALIZACJA */}
                <div className="flex justify-center items-center text-center text-white font-medium leading-[130%]">
                  {club.city}
                </div>

                <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                {/* PRZYCISK SZCZEGÓŁÓW */}
                <div className="flex justify-center items-center">
                  <Link
                    to={`/club/${club.id}`}
                    className="rounded-[50px] bg-[#274fde] px-15 py-2.5 text-[14px] font-medium text-white hover:bg-[#1e3fbd] transition-all hover:scale-105 leading-[130%]"
                  >
                    Szczegóły
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}