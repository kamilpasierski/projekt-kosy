import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getClubImageUrl } from '../../utils/imageUtils';

interface ClubData {
  id: number;
  name: string;
  path_image: string | null;
  kos_count: number;
}

const MaxBeefs: React.FC = () => {
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE_URL = 'http://127.0.0.1:8000'; 

  useEffect(() => {
    const fetchMaxBeefs = async () => {
      try {
        const response = await axios.get<ClubData[]>(`${API_BASE_URL}/api/stats/max-beefs/`);
        setClubs(response.data);
      } catch (error) {
        console.error("Failed to fetch max beefs clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaxBeefs();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20 font-montserrat">Ładowanie rankingu...</div>;
  }

  if (clubs.length === 0) {
     return null;
  }

  return (
    <div className="w-full flex justify-center py-8 antialiased font-montserrat">
      <div className="w-full max-w-[1180px] ">

        {/* Nagłówek sekcji */}
        <h2 className="text-[20px] font-medium uppercase text-white leading-[1.3] mb-10 ">
          KLUBY Z NAJWIĘKSZĄ ILOŚCIĄ KOS
        </h2>


        <div className="w-full min-h-[336px] bg-[rgba(138,37,37,0.42)] rounded-[30px] px-[25px] py-[30px] flex flex-wrap justify-between items-center shadow-2xl">

          {clubs.slice(0, 4).map((club, index) => (
            /* KARTA (273x312px) */
            <div
              key={club.id}
              className="w-[273px] h-[312px] bg-[#343434] rounded-[30px] border-[0.5px] border-[#222629] shadow-[-5px_5px_18px_0px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center"
            >
              {/* Rank Badge */}
              <div className="absolute left-0 top-0 w-[62px] h-[58px] bg-[#1F1F1F] rounded-tl-[30px] rounded-br-[30px] flex items-center justify-center">
                <span className="text-[20px] font-semibold uppercase text-white">
                  {index + 1}
                </span>
              </div>

              {/* Logo */}
              <div className="flex justify-center mt-[45px] mb-6 h-[92px] items-center">
                <Link to={`/club/${club.id}`}>
                  <img
                      src={getClubImageUrl(club.path_image)}
                      alt={club.name}
                      className="max-w-[90px] max-h-[92px] object-contain transition-transform duration-300 hover:scale-110"
                  />
                </Link>
              </div>

              {/* Nazwa Klubu */}
              <Link to={`/club/${club.id}`} className="block w-full px-4 mb-4">
                  <p className="text-[20px] font-medium uppercase text-white text-center hover:text-[#cb0000] transition-colors truncate">
                    {club.name}
                  </p>
              </Link>

              {/* Statystyka KOS */}
              <div className="flex items-center justify-center gap-2 mt-auto pb-10">
                <p className="text-[36px] font-semibold text-[#cb0000] leading-none">
                  {club.kos_count}
                </p>
                <p className="text-[20px] font-medium uppercase text-white leading-none pt-2">
                  KOS
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MaxBeefs;