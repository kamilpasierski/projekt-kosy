import React from 'react';

interface NoClubsProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const imgImage50 = "https://www.figma.com/api/mcp/asset/6861fb54-75bb-4da0-9a64-219511b84d12";

export default function NoClubs({ title, description, actionLabel, onAction }: NoClubsProps) {
  // Styl wymuszający czcionkę bezpośrednio
  const montserratStyle = { fontFamily: "'Montserrat', sans-serif" };

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center text-center antialiased pb-[120px] min-h-[400px]"
      style={montserratStyle}
    >

      <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[393px] h-auto aspect-[393/262] mb-[50px] mx-auto">
        <img
          alt="Status pusty"
          className="w-full h-full object-contain pointer-events-none mx-auto"
          src={imgImage50}
        />
      </div>

      <p
        style={montserratStyle}
        className="font-medium text-[16px] sm:text-[18px] md:text-[20px] text-white uppercase leading-[130%] mb-6 px-4 w-full flex justify-center"
      >
        {title}
      </p>

      <p
        style={montserratStyle}
        className="font-medium text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-white leading-[130%] tracking-[0.6px] max-w-[806px] mb-[50px] px-4 w-full mx-auto flex justify-center"
      >
        {description}
      </p>

      <div className="w-full flex justify-center">
        <button
          onClick={onAction}
          style={montserratStyle}
          className="bg-[#274fde] hover:bg-[#1e3eb5] active:scale-95 text-white font-medium text-[16px] px-12 h-[50px] rounded-[50px] shadow-[0px_6px_7px_0px_rgba(0,0,0,0.25)] transition-all cursor-pointer flex items-center justify-center leading-[130%]"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}