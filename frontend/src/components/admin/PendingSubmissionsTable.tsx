import React from "react";

type RelationType = "KOSA" | "ZGODA" | "NEUTR.";

interface Submission {
  id: number;
  date: string;
  reporter: string;
  clubA: {
    name: string;
    logoUrl: string;
  };
  clubB: {
    name: string;
    logoUrl: string;
  };
  relation: RelationType;
}

const getRelationColor = (relation: RelationType) => {
  switch (relation) {
    case "KOSA":
      return "#cb0000";
    case "ZGODA":
      return "#20ca5f";
    case "NEUTR.":
      return "#fbf201";
    default:
      return "#464646";
  }
};

const PendingSubmissionsTable: React.FC = () => {
  // Sample data - replace with API data later
  const submissions: Submission[] = [
    {
      id: 1,
      date: "03.12.2025, 14:30",
      reporter: "Kibic_AREK",
      clubA: {
        name: "Legia Warszawa",
        logoUrl: "https://www.figma.com/api/mcp/asset/eeaefd6a-fc9b-426e-804c-7746551c4792",
      },
      clubB: {
        name: "Lechia Gdańsk",
        logoUrl: "https://www.figma.com/api/mcp/asset/d0b6bbc4-28d3-403e-b28e-f5282f9a6d0a",
      },
      relation: "KOSA",
    },
    {
      id: 2,
      date: "03.12.2025, 14:30",
      reporter: "Kibic_AREK",
      clubA: {
        name: "Legia Warszawa",
        logoUrl: "https://www.figma.com/api/mcp/asset/eeaefd6a-fc9b-426e-804c-7746551c4792",
      },
      clubB: {
        name: "Lechia Gdańsk",
        logoUrl: "https://www.figma.com/api/mcp/asset/d0b6bbc4-28d3-403e-b28e-f5282f9a6d0a",
      },
      relation: "ZGODA",
    },
    {
      id: 3,
      date: "03.12.2025, 14:30",
      reporter: "Kibic_AREK",
      clubA: {
        name: "Legia Warszawa",
        logoUrl: "https://www.figma.com/api/mcp/asset/eeaefd6a-fc9b-426e-804c-7746551c4792",
      },
      clubB: {
        name: "Lechia Gdańsk",
        logoUrl: "https://www.figma.com/api/mcp/asset/d0b6bbc4-28d3-403e-b28e-f5282f9a6d0a",
      },
      relation: "KOSA",
    },
    {
      id: 4,
      date: "03.12.2025, 14:30",
      reporter: "Kibic_AREK",
      clubA: {
        name: "Legia Warszawa",
        logoUrl: "https://www.figma.com/api/mcp/asset/eeaefd6a-fc9b-426e-804c-7746551c4792",
      },
      clubB: {
        name: "Lechia Gdańsk",
        logoUrl: "https://www.figma.com/api/mcp/asset/d0b6bbc4-28d3-403e-b28e-f5282f9a6d0a",
      },
      relation: "NEUTR.",
    },
  ];


  return (
    <div className="w-full max-w-[1440px] mx-auto px-[8.4%] py-8">
      {/* Section Title */}
      <h2 className="font-['Montserrat'] text-[20px] font-medium uppercase text-white leading-[1.3] mb-6">
        oczekujące zgłoszenia użytkowników
      </h2>

      {/* Table Container */}
      <div className="w-full max-w-[1175px] bg-[#343434] rounded-[30px] overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#2a2a2a] border-[0.5px] border-[#274fde] px-6 py-4 grid grid-cols-4 gap-4">
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">
            Data
          </div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">
            Zgłaszający
          </div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">
            Typ zmiany / sugestia
          </div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white text-right">
            Akcja
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#2a2a2a]">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="px-6 py-6 grid grid-cols-4 gap-4 items-center"
            >
              {/* Date */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white">
                {submission.date}
              </div>

              {/* Reporter */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white">
                {submission.reporter}
              </div>

              {/* Relation Change */}
              <div className="flex items-center gap-3">
                {/* Club A Logo */}
                <img
                  src={submission.clubA.logoUrl}
                  alt={submission.clubA.name}
                  className="w-[38px] h-[48px] object-contain"
                />

                {/* Arrow */}
                <svg
                  width="34"
                  height="12"
                  viewBox="0 0 34 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 6H33M33 6L28 1M33 6L28 11"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M33 6H1M1 6L6 1M1 6L6 11"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Club B Logo */}
                <img
                  src={submission.clubB.logoUrl}
                  alt={submission.clubB.name}
                  className="w-[70px] h-[71px] object-contain"
                />

                {/* Relation Badge */}
                <div className="flex items-center gap-2 ml-2">
                  <div
                    className="w-[28px] h-[28px] rounded-full"
                    style={{ backgroundColor: getRelationColor(submission.relation) }}
                  />
                  <div className="bg-[#2a2a2a] rounded-full px-3 py-1">
                    <span className="font-['Montserrat'] text-[16px] font-medium text-white">
                      {submission.relation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                {/* Accept Button */}
                <button className="bg-[#20ca5f] hover:bg-[#1ab552] transition-colors rounded-full px-6 py-2 flex items-center gap-2">
                  <svg
                    width="14"
                    height="11"
                    viewBox="0 0 14 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5L5 9.5L13 1.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-['Montserrat'] text-[16px] font-medium text-white">
                    Akceptuj
                  </span>
                </button>

                {/* Reject Button */}
                <button className="bg-[#cb0000] hover:bg-[#a50000] transition-colors rounded-full px-6 py-2 flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L11 11M11 1L1 11"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-['Montserrat'] text-[16px] font-medium text-white">
                    Odrzuć
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingSubmissionsTable;