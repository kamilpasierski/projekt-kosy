interface Club {
  id: number;
  name: string;
  logoUrl: string;
}

interface RelationsProps {
  title?: string;
  kosaClubs?: Club[];
  neutralClubs?: Club[];
  zgodaClubs?: Club[];
  onReportChange?: () => void;
}

const defaultLogoUrl = "https://www.figma.com/api/mcp/asset/2e09621a-2a00-4c88-baa2-9892205f67b6";
const imgVector = "https://www.figma.com/api/mcp/asset/5eb45f7b-ee75-4022-a362-8584cbfc083c";

const defaultKosaClubs: Club[] = [
  { id: 1, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
  { id: 2, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
];

const defaultNeutralClubs: Club[] = [
  { id: 1, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
  { id: 2, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
  { id: 3, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
];

const defaultZgodaClubs: Club[] = [
  { id: 1, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
  { id: 2, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
  { id: 3, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
  { id: 4, name: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl },
];

export default function Relations({
  title = "RELACJE Z INNYMI KLUBAMI",
  kosaClubs = defaultKosaClubs,
  neutralClubs = defaultNeutralClubs,
  zgodaClubs = defaultZgodaClubs,
  onReportChange
}: RelationsProps) {
  return (
    <div className="relative w-full max-w-[1440px] py-16">
      {/* Header with Title and Report Button */}
      <div className="mb-6 flex items-center justify-between px-[calc(6.25%+54px)] pr-[calc(10.76%)]">
        <h2 className="font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
          {title}
        </h2>
        <button 
          onClick={onReportChange}
          className="flex items-center gap-2 rounded-[30px] bg-[#343434] px-6 py-2 font-['Montserrat'] text-[16px] font-medium text-white hover:bg-[#404040] transition-colors"
        >
          <img src={imgVector} alt="" className="h-4 w-4" />
          Zgłoś zmianę
        </button>
      </div>

      {/* Main Container */}
      <div className="mx-[8.75%] rounded-[30px] bg-[#2a2a2a] p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* KOSA Column */}
          <div className="flex flex-col">
            <div className="mb-4 rounded-[30px] bg-[rgba(138,37,37,0.1)] pb-2">
              <div className="rounded-t-[30px] bg-[#8a2525] py-3 text-center">
                <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white">
                  KOSA
                </h3>
              </div>
            </div>
            <div className="space-y-4">
              {kosaClubs.map((club, index) => (
                <div key={club.id}>
                  <div className="flex items-center gap-3">
                    <img src={club.logoUrl} alt="" className="h-[57px] w-[56px] object-cover" />
                    <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white">
                      {club.name}
                    </p>
                  </div>
                  {index < kosaClubs.length - 1 && (
                    <div className="my-4 h-[1px] bg-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* NEUTRALNIE Column */}
          <div className="flex flex-col">
            <div className="mb-4 rounded-[30px] bg-[rgba(251,242,1,0.1)] pb-2">
              <div className="rounded-t-[30px] bg-[#fbf201] py-3 text-center">
                <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-black">
                  NEUTRALNIE
                </h3>
              </div>
            </div>
            <div className="space-y-4">
              {neutralClubs.map((club, index) => (
                <div key={club.id}>
                  <div className="flex items-center gap-3">
                    <img src={club.logoUrl} alt="" className="h-[57px] w-[56px] object-cover" />
                    <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white">
                      {club.name}
                    </p>
                  </div>
                  {index < neutralClubs.length - 1 && (
                    <div className="my-4 h-[1px] bg-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ZGODA Column */}
          <div className="flex flex-col">
            <div className="mb-4 rounded-[30px] bg-[rgba(36,127,70,0.1)] pb-2">
              <div className="rounded-t-[30px] bg-[#247f46] py-3 text-center">
                <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white">
                  ZGODA
                </h3>
              </div>
            </div>
            <div className="space-y-4">
              {zgodaClubs.map((club, index) => (
                <div key={club.id}>
                  <div className="flex items-center gap-3">
                    <img src={club.logoUrl} alt="" className="h-[57px] w-[56px] object-cover" />
                    <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white">
                      {club.name}
                    </p>
                  </div>
                  {index < zgodaClubs.length - 1 && (
                    <div className="my-4 h-[1px] bg-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
