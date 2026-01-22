import { useMatches, type RelationStatus } from "../../hooks/useMatches";

// Helper do kolorów kropki statusu
const getStatusColor = (status: RelationStatus) => {
    switch (status) {
        case "kosa": return "bg-red-700";
        case "zgoda": return "bg-green-500";
        case "neutralnie": return "bg-yellow-400";
        default: return "bg-gray-400";
    }
};

const MatchesTable = () => {
    const { data, isLoading, error } = useMatches();

    if (isLoading) return <div className="text-white p-4">Ładowanie meczów...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="w-full max-w-[1175px] mx-auto space-y-6">

            {/* --- NAGŁÓWEK SEKCJI --- */}
            <div className="w-full h-8 flex items-center justify-start text-white text-xl font-medium uppercase leading-6">
                Nadchodzące wydarzenia
            </div>

            {/* --- LEGENDA --- */}
            <div className="w-full bg-zinc-800 rounded-[30px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] border-[0.5px] border-blue-700 p-4 md:h-24 flex items-center">
                <div className="flex flex-wrap items-center gap-4 md:gap-16 px-4 md:px-12 w-full justify-center md:justify-start">
                    <span className="text-white/80 text-base font-medium uppercase">LEGENDA :</span>

                    <div className="flex items-center gap-4">
                        <span className="text-white text-base font-medium uppercase">KOSA</span>
                        <div className="w-11 h-11 bg-red-700 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]"></div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-white text-base font-medium uppercase">ZGODA</span>
                        <div className="w-11 h-11 bg-green-500 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]"></div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-white text-base font-medium uppercase">NEUTRALNIE</span>
                        <div className="w-11 h-11 bg-yellow-400 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]"></div>
                    </div>
                </div>
            </div>

            {/* --- LISTA MECZÓW --- */}
            <div className="flex flex-col gap-6">
                {data.map((match) => (
                    <div key={match.id} className="relative group">
                        {/* Karta Meczu */}
                        <div className="bg-zinc-800 rounded-[30px] overflow-hidden shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]">

                            {/* Belka z datą (Góra) */}
                            <div className="bg-zinc-700 h-9 flex items-center px-6 shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]">
                 <span className="text-white text-sm md:text-base font-medium">
                    {/* Przykładowe formatowanie daty */}
                     Sobota, 22 listopada 2025
                 </span>
                            </div>

                            {/* Zawartość meczu */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 min-h-[110px]">

                                {/* Lewa strona: Gwiazdka "Obserwuj" */}
                                <div className="flex flex-col items-center justify-center gap-1 md:absolute md:left-8 md:top-16">
                                    <div className="text-yellow-400 text-2xl cursor-pointer">☆</div>
                                    <span className="text-white text-xs font-normal">Obserwuj</span>
                                </div>

                                {/* Środek: Drużyny */}
                                <div className="flex flex-1 items-center justify-center w-full md:pl-20 md:pr-16">
                                    <div className="flex items-center justify-between w-full max-w-3xl">

                                        {/* Gospodarz */}
                                        <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-10 h-12 object-contain" />
                                        <div className="flex items-center gap-4 w-1/3 justify-end">
                            <span className="text-white text-sm md:text-base font-medium uppercase text-right hidden md:block">
                                {match.homeTeam.name}
                            </span>
                                        </div>

                                        {/* VS / Info */}
                                        <div className="flex flex-col items-center justify-center px-4 w-1/3">
                                            <span className="text-white text-base font-medium uppercase mb-1">VS</span>
                                            <span className="text-white text-xs text-center leading-tight opacity-80">
                                20:15 - {match.leagueName} <br/> {match.gameweek}. kolejka
                            </span>
                                        </div>

                                        {/* Gość */}
                                        <div className="flex items-center gap-4 w-1/3 justify-start">
                                            <span className="text-white text-sm md:text-base font-medium uppercase hidden md:block">
                                {match.awayTeam.name}
                            </span>
                                        </div>
                                        <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-10 h-12 object-contain" />
                                    </div>
                                </div>

                                {/* Prawa strona: Status Kropka */}
                                <div className="md:absolute md:right-8 md:top-[calc(50%+9px)] md:-translate-y-1/2 flex justify-center w-full md:w-auto mt-4 md:mt-0">
                                    <div
                                        className={`w-11 h-11 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] ${getStatusColor(match.awayTeam.relation)}`}
                                        title={`Relacja: ${match.awayTeam.relation}`}
                                    ></div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- BUTTON NA DOLE --- */}
            <div className="flex justify-center mt-8 pb-8">
                <button className="bg-blue-700 hover:bg-blue-600 text-white px-12 py-3 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] transition-colors font-medium text-base cursor-pointer">
                    Zobacz pełny harmonogram
                </button>
            </div>

        </div>
    );
};

export default MatchesTable;