import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

// --- TYPES ---
type RelationType = "kosa" | "zgoda" | "neutralnie";

interface ClubData {
  name: string;
  logoUrl: string;
}

interface Submission {
  id: number;
  date: string;
  reporter: string;
  clubA: ClubData;
  clubB: ClubData;
  relation: RelationType;
}

const getRelationColor = (relation: string) => {
  const type = relation.toLowerCase();
  switch (type) {
    case "kosa": return "#cb0000";
    case "zgoda": return "#20ca5f";
    case "neutralnie": return "#fbf201";
    default: return "#464646";
  }
};

const PendingSubmissionsTable: React.FC = () => {
  // --- STATE ---
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get<Submission[]>("/tickets/pending/");
        setSubmissions(response.data);
      } catch (err) {
        console.error("Błąd pobierania:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // --- HANDLER AKCJI ---
  const handleDecision = async (id: number, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      await api.post(`/tickets/${id}/action/`, { action });

      setSubmissions((prev) => prev.filter((item) => item.id !== id));
      
    } catch (error) {
      console.error("Błąd akcji:", error);
      alert("Wystąpił błąd podczas przetwarzania zgłoszenia.");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <div className="text-white text-center py-10">Ładowanie...</div>;

  const API_URL = "http://localhost:8000"; 

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[8.4%] py-6 sm:py-8">
      <h2 className="text-[16px] sm:text-[20px] font-medium uppercase text-white leading-[1.3] mb-4 sm:mb-6">
        oczekujące zgłoszenia użytkowników
      </h2>

      <div className="w-full max-w-[1175px] bg-[#343434] rounded-[20px] sm:rounded-[30px] overflow-hidden">
        {/* HEADER */}
        <div className="hidden md:grid bg-[#2a2a2a] border-[0.5px] border-[#274fde] px-4 sm:px-6 py-3 sm:py-4 grid-cols-4 gap-4">
          <div className="text-[14px] sm:text-[16px] font-medium text-white">Data</div>
          <div className="text-[14px] sm:text-[16px] font-medium text-white">Zgłaszający</div>
          <div className="text-[14px] sm:text-[16px] font-medium text-white">Szczegóły zgłoszenia</div>
          <div className="text-[14px] sm:text-[16px] font-medium text-white text-right">Akcja</div>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-[#2a2a2a]">
          {submissions.length === 0 ? (
            <div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
              <p className="text-[14px] sm:text-[16px] font-medium text-gray-400">
                Brak oczekujących zgłoszeń.
              </p>
            </div>
          ) : (
            submissions.map((submission) => (
            <div
              key={submission.id}
              className={`px-4 sm:px-6 py-4 sm:py-6 md:grid md:grid-cols-4 gap-4 items-center transition-opacity duration-300 ${processingId === submission.id ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {/* Date */}
              <div className="text-[14px] sm:text-[16px] font-medium text-white mb-2 md:mb-0">
                <span className="md:hidden text-gray-400 mr-2">Data:</span>
                {submission.date}
              </div>

              {/* Reporter */}
              <div className="text-[14px] sm:text-[16px] font-medium text-white mb-3 md:mb-0">
                <span className="md:hidden text-gray-400 mr-2">Zgłaszający:</span>
                {submission.reporter}
              </div>

              {/* Clubs & Relation Visual */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 md:mb-0">
                <img
                  src={submission.clubA.logoUrl ? (submission.clubA.logoUrl.startsWith('http') ? submission.clubA.logoUrl : `${API_URL}${submission.clubA.logoUrl}`) : "https://via.placeholder.com/38"}
                  alt={submission.clubA.name}
                  className="w-[38px] h-[48px] object-contain"
                />

                <svg width="20" height="10" viewBox="0 0 34 12" fill="none" className="shrink-0 sm:w-6 sm:h-3">
                  <path d="M1 6H33M33 6L28 1M33 6L28 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M33 6H1M1 6L6 1M1 6L6 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <img
                  src={submission.clubB.logoUrl ? (submission.clubB.logoUrl.startsWith('http') ? submission.clubB.logoUrl : `${API_URL}${submission.clubB.logoUrl}`) : "https://via.placeholder.com/38"}
                  alt={submission.clubB.name}
                  className="w-[32px] h-[40px] sm:w-[38px] sm:h-[48px] object-contain"
                />
                
                {/* Relation Badge */}
                <div className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-[#2a2a2a] border border-gray-600 flex items-center gap-1 sm:gap-2">
                   <div 
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" 
                      style={{ backgroundColor: getRelationColor(submission.relation) }}
                   />
                   <span className="text-[10px] sm:text-xs font-bold uppercase text-gray-300">{submission.relation}</span>
                </div>
              </div>

              {/* Actions (Buttons) */}
              <div className="flex items-center justify-start md:justify-end gap-2 sm:gap-3">
                {/* Accept Button */}
                <button 
                  onClick={() => handleDecision(submission.id, 'approve')}
                  disabled={processingId === submission.id}
                  className="bg-[#20ca5f] hover:bg-[#1ab552] transition-colors rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 group"
                >
                  <svg width="12" height="10" viewBox="0 0 14 11" fill="none" className="sm:w-[14px] sm:h-[11px]">
                    <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[12px] sm:text-[14px] font-medium text-white hidden sm:inline xl:inline">
                    Akceptuj
                  </span>
                </button>

                {/* Reject Button */}
                <button 
                  onClick={() => handleDecision(submission.id, 'reject')}
                  disabled={processingId === submission.id}
                  className="bg-[#cb0000] hover:bg-[#a50000] transition-colors rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 group"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="sm:w-3 sm:h-3">
                    <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[12px] sm:text-[14px] font-medium text-white hidden sm:inline xl:inline">
                    Odrzuć
                  </span>
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default PendingSubmissionsTable;