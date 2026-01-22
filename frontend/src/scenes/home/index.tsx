//import MatchesTable from "../../shared/MatchesTable";
import PopularClubs from "../../components/home/PopularClubs";
import ClubSearch from "../../components/home/ClubSearch";
import BanerComponent from "../../components/home/Baner";

const Home = () => {

    return (
        <div className="w-full flex flex-col items-center pb-12 md:pb-20">
            {/* Banner */}
            <div className="w-full max-w-[1920px] px-4 md:px-6 lg:px-8 mb-12 md:mb-20">
                <BanerComponent />
            </div>

            {/* Sprawdź relacje */}
            <div className="w-full max-w-[1175px] mx-auto mb-12 md:mb-16 px-4 md:px-6 lg:px-0">
                <h2 className="mb-6 md:mb-8 text-lg md:text-[20px] font-medium uppercase leading-[1.3] text-white">
                    Sprawdź relacje, zgody i kosy.
                </h2>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <ClubSearch />
                </div>
            </div>

            {/* Popularne kluby */}
            <div className="w-full max-w-[1175px] mx-auto px-4 md:px-6 lg:px-0">
                <h2 className="mb-6 md:mb-8 text-lg md:text-[20px] font-medium uppercase leading-[1.3] text-white">
                    Popularne kluby
                </h2>
                <PopularClubs />
            </div>

            {/* <MatchesTable /> - CZEKAMY NA API*/}
        </div>
    )
};

export default Home;