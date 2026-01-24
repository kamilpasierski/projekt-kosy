import { memo } from 'react';
import type { ReactNode } from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { RELATION_COLORS } from '../../utils/geoUtils';

interface SafetyCheckProps {
  title?: string;
  statusTitle: string;
  description: string | ReactNode;
  color?: string;
}

function SafetyCheck({
  title = "TWOJE POŁOŻENIE",
  statusTitle,
  description,
  color = RELATION_COLORS.DEFAULT
}: SafetyCheckProps) {

  return (
    <div className="relative w-full py-6 md:py-8 antialiased">
      <h2 className="mb-4 md:mb-6 text-lg md:text-[20px] font-medium uppercase leading-[130%] text-white">
        {title}
      </h2>

      <div
        className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 p-6 md:px-10 rounded-[30px] bg-[#2A2A2A] w-full"
        style={{
          minHeight: '167px',
          boxShadow: '-19px 13px 25.3px 0 rgba(0, 0, 0, 0.19)'
        }}
      >
        <div className="flex h-12 w-12 sm:h-16 md:h-[80px] sm:w-16 md:w-[80px] flex-shrink-0 items-center justify-center">
          <MapPinIcon
            className="h-full w-full transition-all duration-300 drop-shadow-md"
            style={{ color: color }}
          />
        </div>

        <div className="flex-1 pt-0 sm:pt-1">
          <h3
            className="mb-1 md:mb-2 text-base md:text-[22px] font-bold uppercase leading-[130%] tracking-[0.6px]"
            style={{ color: color }}
          >
            {statusTitle}
          </h3>
          <p className="text-sm md:text-[20px] font-medium leading-[130%] tracking-[0.6px] text-white">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(SafetyCheck);