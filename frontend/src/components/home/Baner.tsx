import { useNavigate } from 'react-router-dom';
import Baner from '@/assets/Baner.png';

export default function BanerComponent() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-[1920px] min-h-[500px] lg:h-[619px] rounded-[40px] overflow-hidden flex flex-col justify-center px-6 lg:px-24 shadow-2xl bg-zinc-800">
      {/* Zdjęcie w tle */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={Baner}
        alt="Baner stadionu"
      />

      {/* Gradient dla lepszej czytelności tekstu */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent lg:from-transparent z-0"></div>

      {/* Treść */}
      <div className="relative z-10 flex flex-col items-start px-6 lg:pl-[74px] gap-6 mt-20 lg:mt-32">
        {/* Główny nagłówek */}
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight tracking-[2px] lg:tracking-[4.80px] drop-shadow-md">
          ZNAJDŹ KLUB <br />
          ZNAJ RYWALI
        </h1>

        {/* Podtytuł */}
        <p className="text-sky-500 text-base md:text-lg font-semibold leading-6">
          Bezpieczeństwo na meczu to podstawa.
        </p>

        {/* Przycisk */}
        <button
          onClick={() => navigate('/mapa')}
          className="group relative w-56 h-16 bg-blue-700 rounded-[40px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <span className="text-white text-lg font-semibold uppercase tracking-wide">
            WYSZUKAJ KLUB
          </span>
        </button>
      </div>
    </div>
  );
}
