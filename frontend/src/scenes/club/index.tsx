import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Baner from "../../components/club/Baner";
import Description from "../../components/club/Description";
import Relations, { type RelatedClub } from "../../components/club/Relations";
import MatchesTable from '../../shared/MatchesTable';
import { getClubImageUrl } from '../../utils/imageUtils';

// Typ danych z API
interface ClubDetailData {
  id: number;
  name: string;
  desc: string;
  path_image: string;
  kosy: RelatedClub[];
  zgody: RelatedClub[];
  neutralne: RelatedClub[];
}

const API_BASE = "http://127.0.0.1:8000"; // Still used for API calls

export default function ClubPage() {
  const { id } = useParams<{ id: string }>(); // Pobieramy ID z URL
  const [clubData, setClubData] = useState<ClubDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${API_BASE}/api/clubs/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setClubData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-10">Ładowanie danych klubu...</div>;
  if (!clubData) return <div className="text-red-500 text-center mt-10">Nie znaleziono klubu.</div>;

  const fullLogoUrl = getClubImageUrl(clubData.path_image);

  return (
    <div className="w-full">
      <Baner 
        clubName={clubData.name} 
        logoImage={fullLogoUrl} 
      />
      
      <Description 
        clubName={clubData.name} 
        description={clubData.desc} 
      />
      
      <Relations 
        kosaClubs={clubData.kosy}
        zgodaClubs={clubData.zgody}
        neutralClubs={clubData.neutralne}
      />
      
      {/*<MatchesTable /> CZEKAMY NA API */}
      </div>
  );
}