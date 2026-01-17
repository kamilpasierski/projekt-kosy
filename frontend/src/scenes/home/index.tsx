// src/scenes/home/index.tsx
import { useNavigate } from "react-router-dom";
import Baner from "@/assets/Baner.png";
import PopularClubs from "../../components/PopularClubs";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col items-center pb-20">
            {/* BANER */}
            <div className="relative w-full max-w-[1920px] min-h-[500px] lg:h-[619px] rounded-[40px] overflow-hidden flex flex-col justify-center px-6 lg:px-24 shadow-2xl bg-zinc-800">
                {/* Background image */}
                <img
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src={Baner}
                    alt="Baner stadionu"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent lg:from-transparent z-0"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-start px-6 lg:pl-[74px] gap-6 mt-20 lg:mt-32">
                    <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight tracking-[2px] lg:tracking-[4.80px] drop-shadow-md">
                        ZNAJDŹ KLUB <br/>
                        ZNAJ RYWALI
                    </h1>

                    <p className="text-sky-500 text-base md:text-lg font-semibold leading-6">
                        Bezpieczeństwo na meczu to podstawa.
                    </p>

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


            {/* OPTIONAL: Simple navigation links */}
            <div className="w-full max-w-[1175px] mx-auto mt-12 px-4 md:px-0">
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <button
                        onClick={() => navigate('/mapa')}
                        className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-medium transition-colors"
                    >
                        🗺️ Przejdź do mapy klubów
                    </button>
                    
                </div>
            </div>
        </div>
    )
};

export default Home;