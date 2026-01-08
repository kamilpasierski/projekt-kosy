import React from "react";

interface ClubData {
  rank: number;
  name: string;
  logoUrl: string;
  kosCount: number;
}

const MaxBeefs: React.FC = () => {
  // Sample data - replace with real data later
  const clubs: ClubData[] = [
    {
      rank: 1,
      name: "LEGIA WARSZAWA",
      logoUrl: "https://www.figma.com/api/mcp/asset/aa4db2db-6283-4d2e-a4c7-bc3c8bc607df",
      kosCount: 12,
    },
    {
      rank: 2,
      name: "LECHIA GDAŃSK",
      logoUrl: "https://www.figma.com/api/mcp/asset/69e296ca-6998-4913-952f-ae1db994e97f",
      kosCount: 12,
    },
    {
      rank: 3,
      name: "LEGIA WARSZAWA",
      logoUrl: "https://www.figma.com/api/mcp/asset/aa4db2db-6283-4d2e-a4c7-bc3c8bc607df",
      kosCount: 12,
    },
    {
      rank: 4,
      name: "LECHIA GDAŃSK",
      logoUrl: "https://www.figma.com/api/mcp/asset/69e296ca-6998-4913-952f-ae1db994e97f",
      kosCount: 12,
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[8.4%] py-8">
      {/* Section Title */}
      <div className="w-full max-w-[1175px] bg-[rgba(138,37,37,0.42)] rounded-[30px] px-9 py-7 mb-8">
        <h2 className="font-['Montserrat'] text-[20px] font-medium uppercase text-white leading-[1.3]">
          KLUBY Z NAJWIĘKSZĄ ILOŚCIĄ KOS
        </h2>
      </div>

      {/* Club Cards */}
      <div className="flex gap-[22px] flex-wrap">
        {clubs.map((club) => (
          <div
            key={club.rank}
            className="w-[273px] h-[312px] bg-[#343434] rounded-[30px] border-[0.5px] border-[#222629] shadow-[-5px_5px_18px_0px_rgba(0,0,0,0.6)] relative"
          >
            {/* Rank Badge */}
            <div className="absolute left-[26px] top-[16px] w-[60px] h-[60px] bg-[#1f1f1f] rounded-tl-[30px] rounded-br-[30px] flex items-center justify-center">
              <span className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white">
                {club.rank}
              </span>
            </div>

            {/* Club Logo */}
            <div className="flex justify-center mt-[36px] mb-4">
              <img
                src={club.logoUrl}
                alt={club.name}
                className="w-[90px] h-[92px] object-contain"
              />
            </div>

            {/* Club Name */}
            <p className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white text-center px-4 mb-4">
              {club.name}
            </p>

            {/* KOS Count */}
            <div className="flex items-center justify-center gap-2">
              <p className="font-['Montserrat'] text-[36px] font-semibold text-[#cb0000] leading-[1.3]">
                {club.kosCount}
              </p>
              <p className="font-['Montserrat'] text-[20px] font-medium uppercase text-white leading-[1.3]">
                KOS
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaxBeefs;
