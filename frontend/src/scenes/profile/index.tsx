import { useAuth } from "../../hooks/useAuth"; 
import Baner from "../../components/user/Baner";
import DataEditor from "../../components/user/DataEditor";
import FollowedClubs from "../../components/user/FavClub";
import History from "../../components/user/History";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-full text-center py-20 text-white">Ładowanie...</div>;
  }

  if (!user) {
    return <div className="w-full text-center py-20 text-red-500">Brak danych użytkownika.</div>;
  }

  return (

    <div className="w-full min-h-screen flex flex-col items-center">


      <Baner
        username={user.username}
        is_staff={user.is_staff}
      />


      <div className="w-full max-w-[1180px] flex flex-col items-center px-4 md:px-0">
        <DataEditor />
        <FollowedClubs />
        <History />
      </div>

    </div>
  );
}