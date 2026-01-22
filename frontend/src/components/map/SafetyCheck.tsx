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
  color = RELATION_COLORS.DEFAULT
}: SafetyCheckProps) {
  
  return (
    <div className="relative w-full py-6 md:py-8 px-4">
      {/* Title */}
      <h2 className="mb-4 md:mb-6 text-lg md:text-[20px] font-medium uppercase leading-[1.3] text-white">
        {title}
      </h2>

      {/* Flex Container */}
      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
        
        {/* Ikona */}
        <div className="flex h-12 w-12 sm:h-16 md:h-[68px] sm:w-16 md:w-[68px] flex-shrink-0 items-center justify-center">
          <MapPinIcon 
            className="h-full w-full transition-all duration-300 drop-shadow-md"
            style={{ color: color }}
          />
        </div>

        {/* Tekst */}
        <div className="flex-1 pt-0 sm:pt-1">
          <h3 
            className="mb-1 md:mb-2 text-base md:text-[20px] font-semibold uppercase leading-[1.63] tracking-[0.6px]"
            style={{ color: color }}
          >
            {statusTitle}
          </h3>
          <p className="text-sm md:text-[20px] font-medium leading-[1.63] tracking-[0.6px] text-white">
            {description}
          </p>
        </div>
        
      </div>
    </div>
  );
}