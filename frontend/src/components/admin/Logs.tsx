import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface LogEntry {
  id: number;
  created_at: string;
  user: string;
  action: string;
  object: string;
  details: string;
}

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    fetchLogs();

    const updateItemsPerPage = () => {
      if (window.innerWidth < 1024) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(6);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get<LogEntry[]>("/activity_logs/");
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pl-PL", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = logs.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (loading) return <div className="text-white text-center py-20 font-montserrat antialiased">Ładowanie logów...</div>;

  return (

    <div className="w-full max-w-[1180px] mx-auto mt-[50px] mb-[120px] font-montserrat antialiased">


      <h2 className="text-[20px] font-medium uppercase text-white pt-10 py-10 tracking-normal">
        logi aplikacji
      </h2>

      {logs.length === 0 ? (
        <div className="bg-[#343434] rounded-[30px] p-8 text-center text-white">Brak logów</div>
      ) : (
        <>
          {/* --- WIDOK DESKTOP (TABELA) --- */}
          <div className="hidden lg:block w-full border-x border-b border-[#274FDE]/20 rounded-[30px] overflow-hidden">
            {/* Header h-[57px] */}
            <div className="bg-[#2A2A2A] border border-[#274FDE] h-[57px] grid grid-cols-[1.1fr_1fr_1.1fr_1.4fr_1.4fr] items-center rounded-t-[30px]">
              <div className="text-center text-[16px] font-medium text-white">Data i godzina</div>
              <div className="text-center text-[16px] font-medium text-white">Użytkownik</div>
              <div className="text-center text-[16px] font-medium text-white">Akcja</div>
              <div className="text-center text-[16px] font-medium text-white">Obiekt</div>
              <div className="text-center text-[16px] font-medium text-white">Szczegóły</div>
            </div>


            <div className="bg-[#343434] divide-y divide-[#274FDE]/40">
              {currentLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-[1.1fr_0.8px_1fr_0.8px_1.1fr_0.8px_1.4fr_0.8px_1.4fr] items-center min-h-[80px] hover:bg-white/5 transition-colors">
                  <div className="text-center text-white text-[16px] font-medium px-2">{formatDate(log.created_at)}</div>
                  <div className="h-full w-[0.8px] bg-[#274FDE]/40" />


                  <div className="text-center text-white text-[16px] font-medium px-4 break-all leading-tight">
                    {log.user}
                  </div>

                  <div className="h-full w-[0.8px] bg-[#274FDE]/40" />
                  <div className="text-center text-white text-[16px] font-medium px-2">{log.action}</div>
                  <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                  <div className="text-center text-white text-[16px] font-medium px-4 break-words leading-tight">
                    {log.object}
                  </div>

                  <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                  <div className="text-center text-white text-[16px] font-medium px-4 break-words leading-tight">
                    {log.details}
                  </div>
                </div>
              ))}

              {Array.from({ length: Math.max(0, itemsPerPage - currentLogs.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="h-[80px] grid grid-cols-1 opacity-0"><div>-</div></div>
              ))}
            </div>
          </div>

          {/* --- WIDOK MOBILNY --- */}
          <div className="lg:hidden space-y-4">
            {currentLogs.map((log) => (
              <div key={log.id} className="bg-[#343434] rounded-[20px] p-6 border border-[#274FDE]/20">
                <div className="flex justify-between text-[#888] text-[12px] mb-4">
                  <span>{formatDate(log.created_at)}</span>
                  <span className="break-all ml-4">{log.user}</span>
                </div>
                <div className="text-white space-y-3">
                  <div><span className="text-[#888] block text-[11px] uppercase mb-1">Akcja:</span> {log.action}</div>
                  <div className="break-words"><span className="text-[#888] block text-[11px] uppercase mb-1">Obiekt:</span> {log.object}</div>
                  {log.details && <div className="break-words"><span className="text-[#888] block text-[11px] uppercase mb-1">Szczegóły:</span> {log.details}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-[10px] mt-8">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-[#2a2a2a] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center disabled:opacity-50 hover:bg-[#3a3a3a] transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>

            {getPageNumbers().map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === 'number' && setCurrentPage(p)}
                disabled={p === '...'}
                className={`rounded-[10px] w-[35px] h-[35px] text-white text-[16px] font-medium transition-colors ${
                  currentPage === p ? "bg-[rgba(39,79,222,0.2)] border-[#274fde] border-[0.5px]" : "bg-transparent hover:bg-white/10"
                } ${p === '...' ? 'cursor-default' : ''}`}
              >
                {p}
              </button>
            ))}

            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-[#2a2a2a] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center disabled:opacity-50 hover:bg-[#3a3a3a] transition-colors">
              <ChevronRightIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Logs;