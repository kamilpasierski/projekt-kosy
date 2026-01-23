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
    /* Usunięto px-4 i py, aby page-container i scena (pt-85) przejęły kontrolę nad układem */
    <div className="relative w-full flex flex-col items-center antialiased" data-name="OBSERWOWANE - PUSTA STRONA">

      {/* Ikona/Obraz - margines 50px zgodnie z wymaganiami kosmetycznymi */}
      <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[393px] h-auto aspect-[393/262] mb-[50px]">
        <img
          alt="Status pusty"
          className="w-full h-full object-contain pointer-events-none"
          src={imgImage50}
        />
      </div>

      {/* Dynamiczny Nagłówek - Montserrat (Medium 500) i Line Height 130% z index.css */}
      <p className="font-medium text-[16px] sm:text-[18px] md:text-[20px] text-center text-white uppercase leading-[130%] mb-6 px-4">
        {title}
      </p>

      {/* Dynamiczny Opis - Odstęp 50px do przycisku, tracking i leading jak w Figmie */}
      <p className="font-medium text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-center text-white leading-[130%] tracking-[0.6px] max-w-[806px] mb-[50px] px-4">
        {description}
      </p>

      {/* Dynamiczny Przycisk - Wysokość 50px, Cień i kolor zgodny z Twoim CSS */}
      <button
        onClick={onAction}
        className="bg-[#274fde] hover:bg-[#1e3eb5] active:scale-95 text-white font-medium text-[16px] px-12 h-[50px] rounded-[50px] shadow-[0px_6px_7px_0px_rgba(0,0,0,0.25)] transition-all cursor-pointer flex items-center justify-center leading-[130%]"
      >
        {actionLabel}
      </button>
    </div>
  );
}