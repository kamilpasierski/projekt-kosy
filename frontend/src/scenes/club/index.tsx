import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Baner from "../../components/club/Baner";
import Description from "../../components/club/Description";
import Relations, { type RelatedClub } from "../../components/club/Relations";
//import MatchesTable from '../../shared/MatchesTable';
import { getClubImageUrl } from '../../utils/imageUtils';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import NewestRelations from '../../components/club/NewestRelations';

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

interface WatchedClubItem {
  id: number;
  club: number;
}

const API_BASE = "http://127.0.0.1:8000"; // Still used for API calls

export default function ClubPage() {
  const { id } = useParams<{ id: string }>(); // Pobieramy ID z URL
  const { user } = useAuth();
  const [clubData, setClubData] = useState<ClubDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [followedRelationId, setFollowedRelationId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const [clubRes, watchedRes] = await Promise.allSettled([
          fetch(`${API_BASE}/api/clubs/${id}/`),
          ...(user ? [api.get<WatchedClubItem[]>('/add_fav/watched_clubs/')] : [])
        ]);

        if (clubRes.status === 'fulfilled' && clubRes.value.ok) {
          const data = await clubRes.value.json();
          setClubData(data);

          // Check if this club is in watched list
          if (watchedRes && watchedRes.status === 'fulfilled') {
            const watchedData = watchedRes.value.data as WatchedClubItem[];
            const watchedItem = watchedData.find(item => item.club === data.id);
            if (watchedItem) {
              setFollowedRelationId(watchedItem.id);
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  if (loading) return <div className="text-white text-center mt-10 px-4">Ładowanie danych klubu...</div>;
  if (!clubData) return <div className="text-red-500 text-center mt-10 px-4">Nie znaleziono klubu.</div>;

  const fullLogoUrl = getClubImageUrl(clubData.path_image);

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto max-w-[1440px]">
        <Baner
          clubName={clubData.name}
          logoImage={fullLogoUrl}
          clubId={clubData.id}
          initialRelationId={followedRelationId}
        />

        <Description
          description={clubData.desc}
        />

        <Relations
          kosaClubs={clubData.kosy}
          zgodaClubs={clubData.zgody}
          neutralClubs={clubData.neutralne}
        />

        <NewestRelations 
          clubName={clubData.name}
          clubImage={clubData.path_image}
          kosaClubs={clubData.kosy}
          zgodaClubs={clubData.zgody}
          neutralClubs={clubData.neutralne}
        />

        {/*<MatchesTable /> CZEKAMY NA API */}
      </div>
    </div>
  );
}