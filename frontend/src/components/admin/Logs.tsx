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

    // Aktualizuj ilość elementów na stronę w zależności od rozmiaru ekranu
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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Paginacja
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Wygeneruj numery stron do wyświetlenia (max 10 widocznych)
  const getPageNumbers = () => {
    const maxVisible = 10;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      // Pokaż wszystkie strony jeśli suma jest mniejsza lub równa max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Zawsze pokaż pierwszą stronę
      pages.push(1);

      // Oblicz zakres wokół aktualnej strony
      const leftSide = Math.max(2, currentPage - 3);
      const rightSide = Math.min(totalPages - 1, currentPage + 3);

      // Dodaj wielokropek po pierwszej stronie jeśli potrzebne
      if (leftSide > 2) {
        pages.push('...');
      }

      // Dodaj strony wokół aktualnej strony
      for (let i = leftSide; i <= rightSide; i++) {
        pages.push(i);
      }

      // Dodaj wielokropek przed ostatnią stroną jeśli potrzebne
      if (rightSide < totalPages - 1) {
        pages.push('...');
      }

      // Zawsze pokaż ostatnią stronę
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-[8.4%] py-8">
        <h2 className="text-[20px] font-medium uppercase text-white leading-[1.3] mb-6">
          logi aplikacji
        </h2>
        <div className="text-white text-center py-8">Ładowanie logów...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[8.4%] py-4 sm:py-8">
      {/* Tytuł sekcji */}
      <h2 className="text-[16px] sm:text-[20px] font-medium uppercase text-white leading-[1.3] mb-4 sm:mb-6">
        logi aplikacji
      </h2>

      {logs.length === 0 ? (
        <div className="bg-[#343434] rounded-[20px] sm:rounded-[30px] p-6 sm:p-8 text-center">
          <p className="text-white text-[14px] sm:text-[16px]">Brak logów</p>
        </div>
      ) : (
        <>
          {/* Widok tabeli na desktop - ukryty na mobile */}
          <div className="hidden lg:block w-full max-w-[1175px] bg-[#343434] rounded-[30px] overflow-hidden">
            {/* Nagłówek tabeli */}
            <div className="bg-[#2a2a2a] border-[0.5px] border-[#274fde] px-10 py-4 grid grid-cols-5 gap-6">
              <div className="text-[16px] font-medium text-white">
                Data i godzina
              </div>
              <div className="text-[16px] font-medium text-white">
                Użytkownik
              </div>
              <div className="text-[16px] font-medium text-white">
                Akcja
              </div>
              <div className="text-[16px] font-medium text-white">
                Obiekt
              </div>
              <div className="text-[16px] font-medium text-white">
                Szczegóły
              </div>
            </div>

            {/* Wiersze tabeli */}
            <div className="divide-y divide-[#2a2a2a]">
              {currentLogs.map((log) => (
                <div
                  key={log.id}
                  className="px-10 py-4 grid grid-cols-5 gap-6 items-start"
                >
                  <div className="text-[16px] font-medium text-white">
                    {formatDate(log.created_at)}
                  </div>
                  <div className="text-[16px] font-medium text-white">
                    {log.user}
                  </div>
                  <div className="text-[16px] font-medium text-white">
                    {log.action}
                  </div>
                  <div className="text-[16px] font-medium text-white whitespace-pre-wrap">
                    {log.object}
                  </div>
                  <div className="text-[16px] font-medium text-white">
                    {log.details}
                  </div>
                </div>
              ))}

              {/* Puste wiersze */}
              {Array.from({
                length: Math.max(0, itemsPerPage - currentLogs.length),
              }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="px-10 py-4 grid grid-cols-5 gap-6 items-start"
                >
                  <div className="text-[16px] font-medium text-transparent">-</div>
                  <div className="text-[16px] font-medium text-transparent">-</div>
                  <div className="text-[16px] font-medium text-transparent">-</div>
                  <div className="text-[16px] font-medium text-transparent">-</div>
                  <div className="text-[16px] font-medium text-transparent">-</div>
                </div>
              ))}
            </div>
          </div>

          {/* Widok kart na mobile - widoczny tylko na mobile/tablet */}
          <div className="lg:hidden space-y-4">
            {currentLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#343434] rounded-[20px] p-4 sm:p-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="text-[12px] sm:text-[14px] font-medium text-[#888]">
                    {formatDate(log.created_at)}
                  </div>
                  <div className="text-[12px] sm:text-[14px] font-medium text-[#888]">
                    {log.user}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-[12px] text-[#888] block mb-1">Akcja:</span>
                    <span className="text-[14px] sm:text-[16px] font-medium text-white">
                      {log.action}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-[12px] text-[#888] block mb-1">Obiekt:</span>
                    <span className="text-[14px] sm:text-[16px] font-medium text-white whitespace-pre-wrap">
                      {log.object}
                    </span>
                  </div>
                  
                  {log.details && (
                    <div>
                      <span className="text-[12px] text-[#888] block mb-1">Szczegóły:</span>
                      <span className="text-[14px] sm:text-[16px] font-medium text-white">
                        {log.details}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Puste karty dla spójnej wysokości */}
            {Array.from({
              length: Math.max(0, itemsPerPage - currentLogs.length),
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-[#343434] rounded-[20px] p-4 sm:p-6 opacity-0"
              >
                <div className="h-[100px]"></div>
              </div>
            ))}
          </div>

          {/* Paginacja */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-[6px] sm:gap-[10px] mt-6 sm:mt-8">
              {/* Przycisk poprzednia */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="bg-[#2a2a2a] rounded-[8px] sm:rounded-[10px] w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>

              {/* Numery stron */}
              {pageNumbers.map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] flex items-center justify-center font-medium text-[14px] sm:text-[16px] text-white"
                    >
                      ...
                    </span>
                  );
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum as number)}
                    className={`
                    rounded-[8px] sm:rounded-[10px] w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] flex items-center justify-center
                    font-medium text-[14px] sm:text-[16px] text-white leading-[1.3]
                    transition-colors
                    ${
                      pageNum === currentPage
                        ? "bg-[rgba(39,79,222,0.2)] border-[#274fde] border-[0.5px] border-solid"
                        : "bg-transparent hover:bg-[rgba(67,27,27,0.1)]"
                    }
                  `}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Przycisk następna */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-[#2a2a2a] rounded-[8px] sm:rounded-[10px] w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Logs;
