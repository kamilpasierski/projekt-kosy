// Definiujemy interfejs dla propsów
interface NoClubsProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void; // Callback do obsługi kliknięcia
}

const imgImage50 = "https://www.figma.com/api/mcp/asset/6861fb54-75bb-4da0-9a64-219511b84d12";

export default function NoClubs({ title, description, actionLabel, onAction }: NoClubsProps) {
  return (
    <div className="relative w-full flex flex-col items-center px-4 py-8 md:py-12 lg:py-16" data-name="OBSERWOWANE - PUSTA STRONA">
      
      {/* Ikona/Obraz */}
      <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[393px] h-auto aspect-[393/262] mb-8 md:mb-10 lg:mb-12">
        <img 
          alt="Status pusty" 
          className="w-full h-full object-contain pointer-events-none" 
          src={imgImage50} 
        />
      </div>

      {/* Dynamiczny Nagłówek */}
      <p className="font-medium text-[16px] sm:text-[18px] md:text-[20px] text-center text-white uppercase leading-[1.3] mb-4 md:mb-6 px-4">
        {title}
      </p>

      {/* Dynamiczny Opis */}
      <p className="font-medium text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-center text-white leading-[1.63] tracking-[0.3px] md:tracking-[0.6px] max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[806px] mb-6 md:mb-8 px-4">
        {description}
      </p>

      {/* Dynamiczny Przycisk */}
      <button 
        onClick={onAction}
        className="bg-[#274fde] hover:bg-[#1e3eb5] active:scale-95 text-white font-medium text-[14px] sm:text-[15px] md:text-[16px] px-8 sm:px-10 md:px-12 py-3 md:py-4 rounded-[50px] shadow-[0px_6px_7px_0px_rgba(0,0,0,0.25)] transition-all cursor-pointer"
      >
        {actionLabel}
      </button>
    </div>
  );
}