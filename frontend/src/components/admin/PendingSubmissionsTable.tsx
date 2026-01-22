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
    <div className="w-full max-w-[1440px] mx-auto px-[8.4%] py-8">
      <h2 className="font-['Montserrat'] text-[20px] font-medium uppercase text-white leading-[1.3] mb-6">
        oczekujące zgłoszenia użytkowników
      </h2>

      <div className="w-full max-w-[1175px] bg-[#343434] rounded-[30px] overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#2a2a2a] border-[0.5px] border-[#274fde] px-6 py-4 grid grid-cols-4 gap-4">
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">Data</div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">Zgłaszający</div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white">Szczegóły zgłoszenia</div>
          <div className="font-['Montserrat'] text-[16px] font-medium text-white text-right">Akcja</div>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-[#2a2a2a]">
          {submissions.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="font-['Montserrat'] text-[16px] font-medium text-gray-400">
                Brak oczekujących zgłoszeń.
              </p>
            </div>
          ) : (
            submissions.map((submission) => (
            <div
              key={submission.id}
              className={`px-6 py-6 grid grid-cols-4 gap-4 items-center transition-opacity duration-300 ${processingId === submission.id ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {/* Date */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white">
                {submission.date}
              </div>

              {/* Reporter */}
              <div className="font-['Montserrat'] text-[16px] font-medium text-white">
                {submission.reporter}
              </div>

              {/* Clubs & Relation Visual */}
              <div className="flex items-center gap-3">
                <img
                  src={submission.clubA.logoUrl ? (submission.clubA.logoUrl.startsWith('http') ? submission.clubA.logoUrl : `${API_URL}${submission.clubA.logoUrl}`) : "https://via.placeholder.com/38"}
                  alt={submission.clubA.name}
                  className="w-[38px] h-[48px] object-contain"
                />

                <svg width="24" height="12" viewBox="0 0 34 12" fill="none" className="shrink-0">
                  <path d="M1 6H33M33 6L28 1M33 6L28 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M33 6H1M1 6L6 1M1 6L6 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <img
                  src={submission.clubB.logoUrl ? (submission.clubB.logoUrl.startsWith('http') ? submission.clubB.logoUrl : `${API_URL}${submission.clubB.logoUrl}`) : "https://via.placeholder.com/38"}
                  alt={submission.clubB.name}
                  className="w-[38px] h-[48px] object-contain"
                />
                
                {/* Relation Badge */}
                <div className="ml-2 px-2 py-1 rounded bg-[#2a2a2a] border border-gray-600 flex items-center gap-2">
                   <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getRelationColor(submission.relation) }}
                   />
                   <span className="text-xs font-bold uppercase text-gray-300">{submission.relation}</span>
                </div>
              </div>

              {/* Actions (Buttons) */}
              <div className="flex items-center justify-end gap-3">
                {/* Accept Button */}
                <button 
                  onClick={() => handleDecision(submission.id, 'approve')}
                  disabled={processingId === submission.id}
                  className="bg-[#20ca5f] hover:bg-[#1ab552] transition-colors rounded-full px-4 py-2 flex items-center gap-2 group"
                >
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-['Montserrat'] text-[14px] font-medium text-white hidden xl:inline">
                    Akceptuj
                  </span>
                </button>

                {/* Reject Button */}
                <button 
                  onClick={() => handleDecision(submission.id, 'reject')}
                  disabled={processingId === submission.id}
                  className="bg-[#cb0000] hover:bg-[#a50000] transition-colors rounded-full px-4 py-2 flex items-center gap-2 group"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-['Montserrat'] text-[14px] font-medium text-white hidden xl:inline">
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