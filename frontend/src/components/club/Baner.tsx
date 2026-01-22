import BanerImage from "@/assets/Baner_klub.png";

interface BanerProps {
  clubName?: string;
  logoImage?: string;
  onFollow?: () => void;
}


export default function Baner({ 
  clubName,
  logoImage,
  onFollow 
}: BanerProps) {
  return (
    <div className="relative h-[672px] w-full max-w-[1440px]">
      {/* Background Image */}
      <div className="absolute left-0 top-0 h-[672px] w-full rounded-bl-[40px] rounded-br-[40px]">
        <img 
          alt="background" 
          className="h-full w-full rounded-bl-[40px] rounded-br-[40px] object-cover pointer-events-none" 
          src={BanerImage} 
        />
      </div>

      {/* Circle background for logo */}
      {/* Outer white circle (border) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[239px] h-[239px] top-[166px] rounded-full bg-white shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]" />
      
      {/* Inner white circle (background) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[226px] h-[226px] top-[172px] rounded-full bg-white z-20" />

      {/* Club Logo - Dynamiczne */}
      <div className="absolute left-1/2 top-[209px] aspect-[609/768] w-[151px] -translate-x-1/2 z-30">
        {logoImage && (
            <img 
            alt={clubName} 
            className="h-full w-full object-contain pointer-events-none" 
            src={logoImage} 
            />
        )}
      </div>

      {/* Club Name */}
      <p className="absolute left-1/2 top-[448px] w-[550px] -translate-x-1/2 text-center font-['Montserrat'] text-[48px] font-bold leading-[1.43] tracking-[4.8px] text-white uppercase whitespace-pre-wrap">
        {clubName || "Ładowanie..."}
      </p>

      {/* Follow Button */}
      <div className="absolute left-1/2 top-[572px] -translate-x-1/2">
        <button 
          onClick={onFollow}
          className="h-[69px] w-[227px] cursor-pointer rounded-[40px] bg-[#274fde] hover:bg-[#1e3fbd] transition-colors"
        >
          <p className="font-['Montserrat'] text-[20px] font-semibold leading-[1.3] text-center text-white">
            OBSERWUJ
          </p>
        </button>
      </div>
    </div>
  );
}