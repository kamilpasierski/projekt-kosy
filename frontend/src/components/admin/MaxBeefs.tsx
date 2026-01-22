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
    return <div className="text-white text-center py-8">Ładowanie rankingu...</div>;
  }

  if (clubs.length === 0) {
     return null; 
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[8.4%] py-8">
      {/* Section Title */}
      <div className="w-full max-w-[1175px] bg-[rgba(138,37,37,0.42)] rounded-[30px] px-9 py-7 mb-8">
        <h2 className="font-['Montserrat'] text-[20px] font-medium uppercase text-white leading-[1.3]">
          KLUBY Z NAJWIĘKSZĄ ILOŚCIĄ KOS
        </h2>
      </div>

      {/* Club Cards */}
      <div className="flex gap-[22px] flex-wrap">
        {clubs.map((club, index) => (
          <div
            key={club.id}
            className="w-[273px] h-[312px] bg-[#343434] rounded-[30px] border-[0.5px] border-[#222629] shadow-[-5px_5px_18px_0px_rgba(0,0,0,0.6)] relative hover:bg-[#3d3d3d] transition-colors"
          >
            {/* Rank Badge */}
            <div className="absolute left-[26px] top-[16px] w-[60px] h-[60px] bg-[#1f1f1f] rounded-tl-[30px] rounded-br-[30px] flex items-center justify-center">
              <span className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white">
                {index + 1}
              </span>
            </div>

            {/* Club Logo */}
            <div className="flex justify-center mt-[36px] mb-4">
              <Link to={`/club/${club.id}`}>
                <img
                    src={getClubImageUrl(club.path_image)}
                    alt={club.name}
                    className="w-[90px] h-[92px] object-contain hover:scale-110 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Club Name */}
            <Link to={`/club/${club.id}`} className="block">
                <p className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white text-center px-4 mb-4 hover:text-[#cb0000] transition-colors truncate">
                {club.name}
                </p>
            </Link>

            {/* KOS Count */}
            <div className="flex items-center justify-center gap-2">
              <p className="font-['Montserrat'] text-[36px] font-semibold text-[#cb0000] leading-[1.3]">
                {club.kos_count}
              </p>
              <p className="font-['Montserrat'] text-[20px] font-medium uppercase text-white leading-[1.3]">
                KOS
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaxBeefs;