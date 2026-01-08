import React from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  object: string;
  details: string;
}

const Logs: React.FC = () => {
  // Sample data - replace with API data later
  const logs: LogEntry[] = [
    {
      id: 1,
      timestamp: "03.12.2025, 14:30",
      user: "Król_AnDrk",
      action: "Akceptacja zgłoszenia",
      object: "Legia Warszawa ↔ Lechia Gdańsk",
      details: "Typ relacji: KOSA",
    },
    {
      id: 2,
      timestamp: "03.12.2025, 15:39",
      user: "KibicArek",
      action: "Edycja relacji",
      object: "Śląsk Wrocław ↔ Zagłębie Lubin",
      details: "ZGODA → KOSA",
    },
    {
      id: 3,
      timestamp: "03.12.2025, 16:30",
      user: "System",
      action: "Błąd zapisu",
      object: "Relacja klubowa",
      details: "Konflikt danych",
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[8.4%] py-8">
      {/* Section Title */}
      <h2 className="font-['Montserrat'] text-[20px] font-medium uppercase text-white leading-[1.3] mb-6">
        logi aplikacji
      </h2>

      {/* Table Container */}
      <div className="w-full max-w-[1175px] bg-[#343434] rounded-[30px] overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#2a2a2a] border-[0.5px] border-[#274fde] px-10 py-4 grid grid-cols-5 gap-6">
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">
            Data i godzina
          </div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">
            Użytkownik
          </div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">
            Akcja
          </div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">
            Obiekt
          </div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">
            Szczegóły
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#2a2a2a]">
          {logs.map((log) => (
            <div
              key={log.id}
              className="px-10 py-4 grid grid-cols-5 gap-6 items-start"
            >
              {/* Timestamp */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white">
                {log.timestamp}
              </div>

              {/* User */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white">
                {log.user}
              </div>

              {/* Action */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white">
                {log.action}
              </div>

              {/* Object */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white whitespace-pre-wrap">
                {log.object}
              </div>

              {/* Details */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white">
                {log.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logs;
