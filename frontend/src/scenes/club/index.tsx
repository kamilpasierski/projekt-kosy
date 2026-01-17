import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Baner from "../../components/club/Baner";
import Description from "../../components/club/Description";
import Relations, { type RelatedClub } from "../../components/club/Relations";
import Incidents from "../../components/club/Incidents";
import MatchesTable from '../../shared/MatchesTable';

interface ClubDetailData {
  id: number;
  name: string;
  desc: string;
  path_image: string;
  kosy: RelatedClub[];
  zgody: RelatedClub[];
  neutralne: RelatedClub[];
}

export default function ClubPage() {
  const { id } = useParams<{ id: string }>();
  const [clubData, setClubData] = useState<ClubDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      console.log('🔄 Loading club ID:', id);
      
      try {
        // The files are at: frontend/public/data/clubs/{id}.json
        // So the web path should be: /data/clubs/{id}.json
        const url = `/data/clubs/${id}.json`;
        console.log('📡 Fetching from:', url);
        
        const response = await fetch(url);
        console.log('📊 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Loaded:', data.name);
        setClubData(data);
        
      } catch (error) {
        console.error('❌ Fetch failed:', error);
        
        // Debug: Try to list what's available
        try {
          const allClubsResponse = await fetch('/data/all_clubs.json');
          if (allClubsResponse.ok) {
            const allClubs = await allClubsResponse.json();
            console.log('📋 Available club IDs:', allClubs.map((c: ClubDetailData) => c.id));
          }
        } catch (e) {
          console.log('Cannot load all_clubs.json');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Ładowanie danych klubu {id}...
        <div className="text-sm text-gray-400 mt-2">
          Sprawdzanie: /data/clubs/{id}.json
        </div>
      </div>
    );
  }
  
  if (!clubData) {
    return (
      <div className="text-red-500 text-center mt-10">
        <div className="text-lg font-bold">Nie znaleziono klubu ID: {id}</div>
        <div className="text-sm mt-4">
          Sprawdź konsolę przeglądarki (F12) dla szczegółów
        </div>
      </div>
    );
  }

  const fullLogoUrl = clubData.path_image 
    ? `/media/${clubData.path_image}`
    : undefined;

  return (
    <div className="w-full">
      <Baner clubName={clubData.name} logoImage={fullLogoUrl} />
      <Description clubName={clubData.name} description={clubData.desc} />
      <Relations 
        kosaClubs={clubData.kosy}
        zgodaClubs={clubData.zgody}
        neutralClubs={clubData.neutralne}
      />
      <Incidents /> 
      <MatchesTable />
    </div>
  );
}