import { useNavigate } from "react-router-dom";
import Baner from "@/assets/Baner.png";
import MatchesTable from "../../components/MatchesTable.tsx";

const Home = () => {
    const navigate = useNavigate();

    return (
        // WRAPPER GŁÓWNY: Centruje baner na stronie i daje marginesy na mniejszych ekranach
        <div className="w-full flex flex-col items-center pb-20">

            {/* KONTENER BANERU */}
            {/* max-w-[1341px]: zachowuje oryginalną maksymalną szerokość */}
            {/* aspect-video lub min-h: zapewnia wysokość na mobile */}
            <div className="relative w-full max-w-[1920px] min-h-[500px] lg:h-[619px] rounded-[40px] overflow-hidden flex flex-col justify-center px-6 lg:px-24 shadow-2xl bg-zinc-800">
                {/* --- 1. ZDJĘCIE W TLE --- */}
                {/* object-cover: przycina zdjęcie, ale zachowuje proporcje (nie rozciąga) */}
                <img
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src={Baner}
                    alt="Baner stadionu"
                />

                {/* Opcjonalnie: Ciemniejszy gradient z lewej strony, żeby tekst był czytelny na każdym tle (szczególnie na mobile) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent lg:from-transparent z-0"></div>

                {/* --- 2. TREŚĆ --- */}
                {/* z-10: musi być nad zdjęciem */}
                {/* pl-8 lg:pl-[74px]: responsywny padding z lewej (na mobile mniejszy) */}
                <div className="relative z-10 flex flex-col items-start px-6 lg:pl-[74px] gap-6 mt-20 lg:mt-32">

                    {/* Główny Nagłówek */}
                    {/* text-3xl na mobile -> text-5xl na desktopie */}
                    <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight tracking-[2px] lg:tracking-[4.80px] drop-shadow-md">
                        ZNAJDŹ KLUB <br/>
                        ZNAJ RYWALI
                    </h1>

                    {/* Podtytuł */}
                    <p className="text-sky-500 text-base md:text-lg font-semibold leading-6">
                        Bezpieczeństwo na meczu to podstawa.
                    </p>

                    {/* Przycisk - Połączony div z tekstem w jeden button */}
                    <button
                        onClick={() => navigate('/mapa')} // Zakładam, że ma szukać na mapie
                        className="group relative w-56 h-16 bg-blue-700 rounded-[40px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                    >
                        <span className="text-white text-lg font-semibold uppercase tracking-wide">
                            WYSZUKAJ KLUB
                        </span>
                    </button>

                </div>
            </div>
            <MatchesTable />
        </div>
    )
};

export default Home;