export default function Description() {
  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12" data-name="OBSERWOWANE - OPIS">
      {/* Nagłówek */}
      <p className="font-medium text-[16px] sm:text-[18px] md:text-[20px] text-white uppercase leading-[1.3] mb-3 sm:mb-4 md:mb-6">
        TWOJE obserwowane kluby
      </p>

      {/* Opis */}
      <div className="bg-[#2a2a2a] rounded-[15px] sm:rounded-[20px] md:rounded-[25px] lg:rounded-[30px] shadow-[-10px_8px_20px_0px_rgba(0,0,0,0.19)] sm:shadow-[-15px_10px_22px_0px_rgba(0,0,0,0.19)] md:shadow-[-19px_13px_25.3px_0px_rgba(0,0,0,0.19)] px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
        <p className="font-medium text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-white leading-[1.5] sm:leading-[1.55] md:leading-[1.63] tracking-[0.2px] sm:tracking-[0.3px] md:tracking-[0.4px] lg:tracking-[0.6px]">
          Lista klubów, które obserwujesz. Monitoruj aktualne relacje i bądź na bieżąco z informacjami.
        </p>
      </div>
    </div>
  );
}
