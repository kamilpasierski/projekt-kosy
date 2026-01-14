import React from 'react';

// Assets
const IMG_STADIUM = "https://www.figma.com/api/mcp/asset/a91f5929-8edd-4e83-b3ba-7701c1cb26e5";
const IMG_AVATAR_BG = "https://www.figma.com/api/mcp/asset/54ac7048-6b72-4443-bf17-db747dfad9ac";
const IMG_AVATAR_BORDER = "https://www.figma.com/api/mcp/asset/c4e3aa08-df43-489e-a262-b3199fed63d0";

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
            src={IMG_STADIUM} 
          />
        </div>
      </div>

      {/* Avatar Layer */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[239px] h-[239px] top-[190px]">
        <img alt="" className="block max-w-none w-full h-full" src={IMG_AVATAR_BG} />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 w-[226px] h-[226px] top-[196px] z-20 pointer-events-none">
        <img alt="" className="block max-w-none w-full h-full" src={IMG_AVATAR_BORDER} />
      </div>

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