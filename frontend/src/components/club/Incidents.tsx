interface Incident {
  id: number;
  clubName: string;
  logoUrl: string;
  location: string;
  date: string;
  timeAgo: string;
}

interface IncidentsProps {
  title?: string;
  kosaIncidents?: Incident[];
  neutralIncidents?: Incident[];
  zgodaIncidents?: Incident[];
}

const defaultLogoUrl = "https://www.figma.com/api/mcp/asset/3da6c111-f1ea-4151-8296-8cdad6bdfb85";

const defaultKosaIncidents: Incident[] = [
  { id: 1, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
  { id: 2, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
  { id: 3, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
];

const defaultNeutralIncidents: Incident[] = [
  { id: 1, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
  { id: 2, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
  { id: 3, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
  { id: 4, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
];

const defaultZgodaIncidents: Incident[] = [
  { id: 1, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
  { id: 2, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
  { id: 3, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
  { id: 4, clubName: "LECHIA GDAŃSK", logoUrl: defaultLogoUrl, location: "Zabrze", date: "12.09.2024", timeAgo: "3 dni temu" },
];

export default function Incidents({
  title = "OSTATNIE INCYDENTY",
  kosaIncidents = defaultKosaIncidents,
  neutralIncidents = defaultNeutralIncidents,
  zgodaIncidents = defaultZgodaIncidents
}: IncidentsProps) {
  return (
    <div className="relative w-full max-w-[1440px] py-16">
      {/* Title */}
      <h2 className="mb-6 px-[calc(6.25%+58px)] font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
        {title}
      </h2>

      {/* Main Container */}
      <div className="mx-[8.19%] rounded-[30px] bg-[#2a2a2a]">
        <div className="grid grid-cols-3">
          {/* KOSA Column */}
          <div className="flex flex-col border-r border-gray-700">
            <div className="rounded-tl-[30px] bg-[#8a2525] py-3 text-center">
              <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white">
                KOSA
              </h3>
            </div>
            <div className="divide-y divide-gray-700">
              {kosaIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start gap-3 p-4">
                  <img src={incident.logoUrl} alt="" className="h-[57px] w-[56px] flex-shrink-0 object-cover" />
                  <div>
                    <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white">
                      {incident.clubName}
                    </p>
                    <p className="mt-1 font-['Montserrat'] text-[10px] text-white">
                      {incident.location} · {incident.date} · {incident.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEUTRALNIE Column */}
          <div className="flex flex-col border-r border-gray-700">
            <div className="bg-[#fbf201] py-3 text-center">
              <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-black">
                NEUTRALNIE
              </h3>
            </div>
            <div className="divide-y divide-gray-700">
              {neutralIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start gap-3 p-4">
                  <img src={incident.logoUrl} alt="" className="h-[57px] w-[56px] flex-shrink-0 object-cover" />
                  <div>
                    <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white">
                      {incident.clubName}
                    </p>
                    <p className="mt-1 font-['Montserrat'] text-[10px] text-white">
                      {incident.location} · {incident.date} · {incident.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ZGODA Column */}
          <div className="flex flex-col">
            <div className="rounded-tr-[30px] bg-[#247f46] py-3 text-center">
              <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white">
                ZGODA
              </h3>
            </div>
            <div className="divide-y divide-gray-700">
              {zgodaIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start gap-3 p-4">
                  <img src={incident.logoUrl} alt="" className="h-[57px] w-[56px] flex-shrink-0 object-cover" />
                  <div>
                    <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white">
                      {incident.clubName}
                    </p>
                    <p className="mt-1 font-['Montserrat'] text-[10px] text-white">
                      {incident.location} · {incident.date} · {incident.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
