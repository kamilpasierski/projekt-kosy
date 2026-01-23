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
  const { isFollowed, handleToggleFollowed } = useClubFollow(
    clubId || 0,
    initialRelationId
  );

  return (
    /* Wysokość zmniejszona do 480px (ok. 2/3 pierwotnej wysokości).
       Zachowano -mt, aby baner zaczynał się pod Navbarem. */
    <div className="relative w-full h-[580px] -mt-[85px] antialiased overflow-hidden">

      {/* Background Image - Pełna szerokość ekranu */}
      <div className="absolute inset-0 w-full h-full">
        <img
          alt="background"
          className="h-full w-full object-cover pointer-events-none rounded-bl-[40px] rounded-br-[40px]"
          src={BanerImage}
        />
        {/* Overlay dla czytelności (nieco ciemniejszy, by skompensować mniejszą wysokość) */}
        <div className="absolute inset-0 bg-black/40 rounded-bl-[40px] rounded-br-[40px]" />
      </div>

      {/* Kontener treści - Skalowanie elementów w górę przy mniejszej wysokości baneru */}
      <div className="relative h-full w-full flex flex-col items-center justify-center pt-[60px] z-10">

        {/* Herb - Zeskalowany minimalnie w górę (280px zamiast 260px), by wypełnić przestrzeń */}
        <div className="relative flex items-center justify-center w-[240px] h-[240px] md:w-[260px] md:h-[260px] rounded-full bg-white shadow-2xl">
          <div className="w-[230px] h-[230px] md:w-[260px] md:h-[260px] rounded-full bg-white flex items-center justify-center overflow-hidden">
            {logoImage && (
              <img
                alt={clubName}
                className="h-[180px] w-[180px] md:h-[200px] md:w-[200px] object-contain"
                src={logoImage}
              />
            )}
          </div>
        </div>

        {/* Nazwa Klubu - Montserrat BOLD, nieco większa skala (52px) i mniejszy margines góra */}
        <h1 className="mt-[25px] text-center text-[32px] md:text-[52px] font-bold leading-[110%] tracking-[4.8px] text-white uppercase drop-shadow-2xl px-4">
          {clubName || "Ładowanie..."}
        </h1>

        {/* Przycisk Obserwuj - Zmniejszony odstęp, by zmieścić się w 480px */}
        <div className="mt-[30px]">
          <button
            onClick={clubId ? handleToggleFollowed : undefined}
            disabled={!clubId}
            className="group h-[60px] w-[210px] md:h-[65px] md:w-[230px] rounded-[40px] bg-[#274fde] hover:bg-[#1e3fbd] transition-all active:scale-95 flex items-center justify-center gap-3 px-6 cursor-pointer shadow-lg"
          >
            <span className="text-[18px] md:text-[20px] font-semibold text-white uppercase leading-none">
              {isFollowed ? 'OBSERWUJESZ' : 'OBSERWUJ'}
            </span>
            {clubId && (
              isFollowed ? (
                <StarSolid className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
              ) : (
                <StarOutline className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white transition-colors" />
              )
            )}
          </button>
        </div>
      </div>
    </div>
  );
}