import React from 'react';
import BanerProfilImage from "@/assets/Baner_profil.png";

interface BanerProps {
  /** Mapujemy tutaj pole 'username' z tabeli auth_user */
  username: string;
  /** Status administratora (is_staff z Django) */
  is_staff: boolean;
}

const Baner: React.FC<BanerProps> = ({ username, is_staff }) => {
  // Logic: Pobranie pierwszej litery
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  // Logic: Określenie roli i koloru kropki
  const roleLabel = is_staff ? "Administrator" : "Użytkownik";
  // Używamy jasnego fioletu dla admina (np. Tailwind purple-500: #A855F7)
  const statusColorClass = is_staff ? "bg-[#A855F7]" : "bg-[#4ADE80]";
  // Opcjonalnie: efekt poświaty (glow) zależny od koloru
  const shadowClass = is_staff ? "shadow-[0_0_8px_#A855F7]" : "shadow-[0_0_8px_#4ADE80]";

  return (
    <div className="relative w-full h-[594px]" data-component="Baner">
      {/* Background Layer */}
      <div className="absolute h-full left-0 rounded-bl-[40px] rounded-br-[40px] top-0 w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img 
            alt="Stadium Background" 
            className="absolute h-[178.74%] left-[-1.28%] max-w-none top-[-70.69%] w-[101.34%] object-cover" 
            src={BanerProfilImage} 
          />
        </div>
      </div>

      {/* Avatar Layer */}
      {/* Outer dark circle (border) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[239px] h-[239px] top-[190px] rounded-full bg-white shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]" />
      
      {/* Inner white circle (background) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[226px] h-[226px] top-[196px] rounded-full bg-neutral-900 z-20" />

      {/* Avatar Initial */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[196px] w-[226px] h-[226px] flex items-center justify-center z-30">
          <p className="font-montserrat font-bold text-[89px] text-white tracking-[8.9px] leading-[1.43] pt-4">
            {initial}
          </p>
      </div>

      {/* Username Display */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[447px] w-full text-center">
        <p className="font-montserrat font-bold text-[48px] text-white tracking-[4.8px] leading-[1.43] truncate px-4">
          {username}
        </p>
      </div>

      {/* Role / Status Badge */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[529px] flex items-center gap-2">
        {/* Dynamic Dot */}
        <div className={`w-[12px] h-[12px] rounded-full ${statusColorClass} ${shadowClass}`} />
        
        <p className="font-montserrat font-medium text-[14px] text-white tracking-[1.4px] uppercase">
          {roleLabel}
        </p>
      </div>
    </div>
  );
};

export default Baner;