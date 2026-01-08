import { useMatches, type RelationStatus, type Match } from "../hooks/useMatches";
import Legend from "../components/map/Legend";

// Helper to get relation color
const getRelationColor = (status: RelationStatus) => {
  switch (status) {
    case "kosa":
      return "#cb0000";
    case "zgoda":
      return "#20ca5f";
    case "neutralnie":
      return "#fbf201";
    default:
      return "#464646";
  }
};

const MatchesTable = () => {
  const { data, isLoading, error } = useMatches();

  if (isLoading)
    return (
      <div className="font-['Montserrat'] text-white p-4">
        Ładowanie meczów...
      </div>
    );
  if (error)
    return (
      <div className="font-['Montserrat'] text-red-500 p-4">{error}</div>
    );

  // Group matches by date
  const groupedMatches = data.reduce(
    (acc, match) => {
      const date = match.date || "Sobota, 22 listopada 2025";
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(match);
      return acc;
    },
    {} as Record<string, Match[]>
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[8.4%] py-8 space-y-6">
      {/* Title */}
      <h2 className="font-['Montserrat'] text-[20px] font-medium uppercase text-white leading-[1.3]">
        Nadchodzące wydarzenia
      </h2>

      {/* Legend */}
      <Legend />

      {/* Matches grouped by date */}
      <div className="space-y-0">
        {Object.entries(groupedMatches).map(([date, matches], dateIndex) => (
          <div key={dateIndex}>
            {/* Date Header */}
            <div className="bg-[#464646] rounded-t-[30px] px-6 py-3 mt-6">
              <p className="font-['Montserrat'] text-[16px] font-medium text-white leading-[1.3]">
                {date}
              </p>
            </div>

            {/* Matches for this date */}
            {matches.map((match, matchIndex) => (
              <div key={match.id}>
                <div className="bg-[#2a2a2a] px-6 py-6 flex items-center justify-between relative">
                  {/* Star - Obserwuj (Left) */}
                  <div className="flex flex-col items-center gap-1 absolute left-6">
                    <svg
                      width="24"
                      height="23"
                      viewBox="0 0 24 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer"
                    >
                      <path
                        d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"
                        fill="white"
                        fillOpacity="0.2"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>
                    <span className="font-['Montserrat'] text-[11px] font-normal text-white">
                      Obserwuj
                    </span>
                  </div>

                  {/* Team logos and names */}
                  <div className="flex items-center gap-8 flex-1 justify-center pl-20 pr-20">
                    {/* Home team logo */}
                    <img
                      src={match.homeTeam.logoUrl}
                      alt={match.homeTeam.name}
                      className="w-[38px] h-[48px] object-contain"
                    />

                    {/* Home team name */}
                    <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white w-[165px] text-right">
                      {match.homeTeam.name}
                    </p>

                    {/* VS and match details */}
                    <div className="flex flex-col items-center justify-center min-w-[190px] text-center">
                      <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white mb-1">
                        VS
                      </p>
                      <p className="font-['Montserrat'] text-[16px] font-medium text-white leading-[1.3]">
                        {match.date || "20:15"} - PKO Ekstraklasa, 16 kolejka
                      </p>
                    </div>

                    {/* Away team name */}
                    <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white w-[141px] text-left">
                      {match.awayTeam.name}
                    </p>

                    {/* Away team logo */}
                    <img
                      src={match.awayTeam.logoUrl}
                      alt={match.awayTeam.name}
                      className="w-[38px] h-[48px] object-contain"
                    />
                  </div>

                  {/* Relation indicator (Right) */}
                  <div
                    className="w-[45px] h-[45px] rounded-full absolute right-6"
                    style={{
                      backgroundColor: getRelationColor(match.awayTeam.relation),
                    }}
                  />
                </div>

                {/* Divider line between matches (not after last match of date) */}
                {matchIndex < matches.length - 1 && (
                  <div className="h-[1px] bg-[#464646] mx-6" />
                )}
              </div>
            ))}

            {/* Bottom rounded corners for last match */}
            <div className="bg-[#2a2a2a] h-0 rounded-b-[30px]" />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center pt-8">
        <button className="bg-[#274fde] hover:bg-[#1e3eb5] transition-colors rounded-full px-8 py-3 font-['Montserrat'] text-[16px] font-medium text-white cursor-pointer">
          Zobacz pełny harmonogram
        </button>
      </div>
    </div>
  );
};

export default MatchesTable;
