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
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[672px] w-full max-w-[1440px]">
      {/* Background Image */}
      <div className="absolute left-0 top-0 h-full w-full rounded-bl-[20px] rounded-br-[20px] sm:rounded-bl-[30px] sm:rounded-br-[30px] md:rounded-bl-[40px] md:rounded-br-[40px]">
        <img 
          alt="background" 
          className="h-full w-full rounded-bl-[20px] rounded-br-[20px] sm:rounded-bl-[30px] sm:rounded-br-[30px] md:rounded-bl-[40px] md:rounded-br-[40px] object-cover pointer-events-none" 
          src={BanerImage} 
        />
      </div>

      {/* Circle background for logo */}
      {/* Outer white circle (border) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[239px] md:h-[239px] top-[80px] sm:top-[120px] md:top-[166px] rounded-full bg-white shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]" />
      
      {/* Inner white circle (background) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[150px] h-[150px] sm:w-[188px] sm:h-[188px] md:w-[226px] md:h-[226px] top-[85px] sm:top-[126px] md:top-[172px] rounded-full bg-white z-20" />

      {/* Club Logo - Dynamiczne */}
      <div className="absolute left-1/2 top-[105px] sm:top-[150px] md:top-[209px] aspect-[609/768] w-[100px] sm:w-[125px] md:w-[151px] -translate-x-1/2 z-30">
        {logoImage && (
            <img 
            alt={clubName} 
            className="h-full w-full object-contain pointer-events-none" 
            src={logoImage} 
            />
        )}
      </div>

      {/* Club Name */}
      <p className="absolute left-1/2 top-[260px] sm:top-[350px] md:top-[448px] w-[90%] sm:w-[450px] md:w-[550px] -translate-x-1/2 text-center font-['Montserrat'] text-[28px] sm:text-[36px] md:text-[48px] font-bold leading-[1.43] tracking-[2.8px] sm:tracking-[3.6px] md:tracking-[4.8px] text-white uppercase whitespace-pre-wrap px-4">
        {clubName || "Ładowanie..."}
      </p>

      {/* Follow Button */}
      <div className="absolute left-1/2 top-[340px] sm:top-[460px] md:top-[572px] -translate-x-1/2">
        <button
          onClick={clubId ? handleToggleFollowed : undefined}
          disabled={!clubId}
          className="h-[56px] w-[180px] sm:h-[62px] sm:w-[200px] md:h-[69px] md:w-[227px] rounded-[40px] bg-[#274fde] hover:bg-[#1e3fbd] transition-colors flex items-center justify-center gap-2 px-4 cursor-pointer disabled:opacity-50"
        >
          <p className="font-['Montserrat'] text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3] text-center text-white">
            {isFollowed ? 'OBSERWUJESZ' : 'OBSERWUJ'}
          </p>
          {clubId && (
            isFollowed ? (
              <StarSolid className="w-6 h-6 text-yellow-400 transition-colors duration-300" />
            ) : (
              <StarOutline className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
            )
          )}
        </button>
      </div>
    </div>
  );
}