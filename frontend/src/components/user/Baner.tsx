import BanerImage from "@/assets/Baner_klub.png";
import { useClubFollow } from "../../hooks/useClubFollow";
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface BanerProps {
  clubName?: string;
  logoImage?: string;
  clubId?: number;
  initialRelationId?: number | null;
}

export default function Baner({
  clubName,
  logoImage,
  clubId,
  initialRelationId
}: BanerProps) {
  // Przekazujemy clubId do hooka
  const { isFollowed, handleToggleFollowed } = useClubFollow(
    Number(clubId) || 0,
    initialRelationId
  );

  return (
    <div className="relative w-full h-[580px] -mt-[85px] antialiased overflow-hidden">
      {/* Zdjęcie tła na całą szerokość */}
      <div className="absolute inset-0 w-full h-full">
        <img
          alt="background"
          className="h-full w-full object-cover pointer-events-none rounded-bl-[40px] rounded-br-[40px]"
          src={BanerImage}
        />
        <div className="absolute inset-0 bg-black/40 rounded-bl-[40px] rounded-br-[40px]" />
      </div>

      <div className="relative h-full w-full flex flex-col items-center justify-center pt-[60px] z-10">
        {/* Herb 260x260px */}
        <div className="relative flex items-center justify-center w-[260px] h-[260px] rounded-full bg-white shadow-2xl">
          {logoImage && (
            <img alt={clubName} className="h-[190px] w-[190px] object-contain" src={logoImage} />
          )}
        </div>

        {/* Nazwa 52px Montserrat */}
        <h1 className="mt-[25px] text-center text-[32px] md:text-[52px] font-bold tracking-[4.8px] text-white uppercase drop-shadow-2xl px-4 font-['Montserrat']">
          {clubName || "Ładowanie..."}
        </h1>

        {/* Przycisk Obserwuj - Przywrócona struktura <p>, która działała */}
        <div className="mt-[30px]">
          <button
            onClick={handleToggleFollowed} // Hook sam obsługuje clubId
            disabled={!clubId}
            className="h-[65px] w-[230px] rounded-[40px] bg-[#274fde] hover:bg-[#1e3fbd] transition-all active:scale-95 flex items-center justify-center gap-2 px-4 cursor-pointer disabled:opacity-50 shadow-lg"
          >
            <p className="font-['Montserrat'] text-[18px] md:text-[20px] font-semibold text-white">
              {isFollowed ? 'OBSERWUJESZ' : 'OBSERWUJ'}
            </p>
            {isFollowed ? (
              <StarSolid className="w-6 h-6 text-yellow-400" />
            ) : (
              <StarOutline className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}