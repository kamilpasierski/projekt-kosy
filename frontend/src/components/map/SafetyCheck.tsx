import { MapPinIcon } from '@heroicons/react/24/solid';
import { RELATION_COLORS } from '../../utils/geoUtils'; // Importujemy stałe kolory

interface SafetyCheckProps {
  title?: string;
  statusTitle: string;
  description: string;
  color?: string; // Opcjonalny - jeśli brak, wejdzie default
}

export default function SafetyCheck({
  title = "TWOJE POŁOŻENIE",
  statusTitle,
  description,
  color = RELATION_COLORS.DEFAULT // Używamy stałej zamiast hardcodowania '#6b7280'
}: SafetyCheckProps) {
  
  return (
    <div className="relative w-full max-w-[1440px] py-8">
      {/* Title */}
      <h2 className="mb-6 px-[calc(6.25%+34px)] font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
        {title}
      </h2>

      {/* Flex Container */}
      <div className="flex items-start gap-4 px-[calc(6.25%+34px)]">
        
        {/* Ikona */}
        <div className="flex h-[68px] w-[68px] flex-shrink-0 items-center justify-center">
          <MapPinIcon 
            className="h-full w-full transition-all duration-300 drop-shadow-md"
            style={{ color: color }}
          />
        </div>

        {/* Tekst */}
        <div className="flex-1 pt-1">
          <h3 
            className="mb-2 font-['Montserrat'] text-[20px] font-semibold uppercase leading-[1.63] tracking-[0.6px]"
            style={{ color: color }}
          >
            {statusTitle}
          </h3>
          <p className="font-['Montserrat'] text-[20px] font-medium leading-[1.63] tracking-[0.6px] text-white">
            {description}
          </p>
        </div>
        
      </div>
    </div>
  );
}