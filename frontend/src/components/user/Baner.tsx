import BanerImage from "@/assets/Baner_klub.png";
import { useClubFollow } from "../../hooks/useClubFollow";
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface BanerProps {
  userName?: string;
  avatarImage?: string;
  clubId?: number;
  initialRelationId?: number | null;
}

export default function Baner({
  userName = "Użytkownik",
  avatarImage,
  clubId,
  initialRelationId
}: BanerProps) {
  const { isFollowed, handleToggleFollowed } = useClubFollow(
    Number(clubId) || 0,
    initialRelationId
  );

  const firstLetter = userName?.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="relative w-full h-[594px] -mt-[125px] antialiased overflow-hidden font-['Montserrat']">
      <div className="absolute inset-0 w-full h-full">
        <img
          alt="background"
          className="h-full w-full object-cover pointer-events-none rounded-b-[40px]"
          src={BanerImage}
        />
        <div className="absolute inset-0 bg-black/40 rounded-b-[40px]" />
      </div>

      <div className="relative h-full w-full flex flex-col items-center justify-center pt-[40px] z-10">
        <div className="relative flex items-center justify-center w-[239px] h-[239px] rounded-full bg-white shadow-2xl overflow-hidden border-4 border-white/20">
          <div className="w-[226px] h-[226px] rounded-full bg-[#1F1F1F] flex items-center justify-center overflow-hidden">
            {avatarImage ? (
              <img alt={userName} className="h-full w-full object-cover" src={avatarImage} />
            ) : (
              <span className="text-white text-[80px] font-bold font-['Montserrat'] leading-none">
                {firstLetter}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center mt-[25px]">
          <h1 className="text-center text-[36px] md:text-[48px] font-bold tracking-[4.8px] text-white uppercase drop-shadow-2xl px-4 font-['Montserrat'] leading-[143%]">
            {userName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#20CA5F]" />
            <p className="text-white/90 text-[14px] md:text-[16px] font-['Montserrat'] font-medium uppercase tracking-[0.5px]">
              {userName}
            </p>
          </div>
        </div>

        {clubId && (
          <div className="mt-[30px]">
            <button
              onClick={handleToggleFollowed}
              className="h-[65px] w-[230px] rounded-[40px] bg-[#274fde] hover:bg-[#1e3fbd] transition-all active:scale-95 flex items-center justify-center gap-2 px-4 cursor-pointer shadow-lg"
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
        )}
      </div>
    </div>
  );
}