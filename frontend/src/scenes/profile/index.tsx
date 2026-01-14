import { useAuth } from "../../hooks/useAuth"; 

import Baner from "../../components/user/Baner";
import DataEditor from "../../components/user/DataEditor";
import FollowedClubs from "../../components/user/FollowedClubs";
import History from "../../components/user/History";

export default function ProfilePage() {
  const { user, isLoading } = useAuth(); 

  if (isLoading) {
    return <div className="w-full text-center py-20 text-white">Ładowanie...</div>;
  }

  // Guard clause
  if (!user) {
    return <div className="w-full text-center py-20 text-red-500">Brak danych użytkownika.</div>;
  }

  return (
    <div className="w-full bg-[#1E1E1E] min-h-screen">
      <Baner 
        username={user.username}
        is_staff={user.is_staff}
       />
      
      <DataEditor />
      <FollowedClubs />
      <History />
    </div>
  );
}