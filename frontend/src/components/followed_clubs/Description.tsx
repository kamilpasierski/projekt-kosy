export default function Description() {
  return (
    /* Usunięto px-4/sm/lg oraz styl czcionki, bo page-container i index.css już to mają */
    <div
      className="relative w-full mb-[75px] antialiased"
      data-name="OBSERWOWANE - OPIS"
    >
      {/* Nagłówek - Odstęp 40px od panelu poniżej */}
      <p className="font-medium text-[16px] sm:text-[18px] md:text-[20px] text-white uppercase leading-[130%] mb-[40px]">
        TWOJE obserwowane kluby
      </p>

      {/* Panel opisu - Teraz w-full, aby wypełnił 1180px page-containera */}
      <div
        className="bg-[#2a2a2a] rounded-[30px] px-4 sm:px-6 md:px-8 py-6 min-h-[108px] flex items-center w-full"
        style={{
          boxShadow: '-19px 13px 25.3px 0px rgba(0, 0, 0, 0.19)'
        }}
      >
        <p className="font-medium text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-white leading-[130%] tracking-[0.6px]">
          Lista klubów, które obserwujesz. Monitoruj aktualne relacje i bądź na bieżąco z informacjami.
        </p>
      </div>
    </div>
  );
}