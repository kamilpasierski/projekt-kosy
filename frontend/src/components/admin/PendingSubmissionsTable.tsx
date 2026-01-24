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
    case "kosa": return "#cb0000"; //
    case "zgoda": return "#20ca5f"; //
    case "neutralnie": return "#fbf201"; //
    default: return "#464646";
  }
};

const PendingSubmissionsTable: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

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

  const handleDecision = async (id: number, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      await api.post(`/tickets/${id}/action/`, { action });
      setSubmissions((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Błąd akcji:", error);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <div className="text-white text-center py-20 font-montserrat">Ładowanie zgłoszeń...</div>;

  const API_URL = "http://localhost:8000";

  return (

    <div className="w-full max-w-[1180px] mx-auto mt-[55px] mb-[65px] font-montserrat antialiased">

      {/* NAGŁÓWEK SEKCJI - mb-[10px] */}
      <h2 className="text-[20px] font-medium uppercase text-white leading-[1.3] py-10">
        oczekujące zgłoszenia użytkowników
      </h2>


      <div className="hidden md:block border border-[#274FDE] rounded-t-[30px] bg-[#2A2A2A] overflow-hidden">
        <div className="grid grid-cols-[0.8fr_1.0fr_2.0fr_1.2fr] items-center h-[64px]">
          <p className="text-center text-[16px] font-medium text-white">Data</p>
          <p className="text-center text-[16px] font-medium text-white">Zgłaszający</p>
          <p className="text-center text-[16px] font-medium text-white">Typ zmiany / sugestia</p>
          <p className="text-center text-[16px] font-medium text-white">Akcja</p>
        </div>
      </div>

      {/* BODY TABELI */}
      <div className="bg-[#343434] rounded-b-[30px] overflow-hidden border-x border-b border-[#274FDE]/20">
        <div className="divide-y divide-[#274FDE]/40">
          {submissions.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 font-medium">
              Brak oczekujących zgłoszeń.
            </div>
          ) : (
            submissions.map((submission) => (
              /* Wiersz z dopasowaną siatką i liniami pionowymi */
              <div
                key={submission.id}
                className={`hidden md:grid grid-cols-[0.8fr_0.8px_1.0fr_0.8px_2.0fr_0.8px_1.2fr] items-center min-h-[80px] hover:bg-[#3a3a3a] transition-colors ${processingId === submission.id ? 'opacity-50' : ''}`}
              >
                {/* 1. DATA */}
                <div className="text-center text-[16px] font-medium text-white px-2">
                  {submission.date}
                </div>

                <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                {/* 2. ZGŁASZAJĄCY */}
                <div className="text-center text-[16px] font-medium text-white px-2">
                  {submission.reporter}
                </div>

                <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                {/* 3. SZCZEGÓŁY ZMIANY - Teraz ma dużo więcej miejsca */}
                <div className="flex items-center justify-center gap-6 px-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={submission.clubA.logoUrl ? (submission.clubA.logoUrl.startsWith('http') ? submission.clubA.logoUrl : `${API_URL}${submission.clubA.logoUrl}`) : "https://via.placeholder.com/38"}
                      alt={submission.clubA.name}
                      className="h-[48px] w-[38px] object-contain"
                    />
                    <svg width="24" height="12" viewBox="0 0 34 12" fill="none">
                      <path d="M1 6H33M33 6L28 1M33 6L28 11M1 6L6 1M1 6L6 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <img
                      src={submission.clubB.logoUrl ? (submission.clubB.logoUrl.startsWith('http') ? submission.clubB.logoUrl : `${API_URL}${submission.clubB.logoUrl}`) : "https://via.placeholder.com/38"}
                      alt={submission.clubB.name}
                      className="h-[48px] w-[38px] object-contain"
                    />
                  </div>

                  {/* Relation Badge - 118x36px */}
                  <div className="flex items-center gap-3 bg-[#2A2A2A] rounded-[50px] w-[125px] h-[38px] justify-center border border-[#274FDE]/30">
                    <div
                      className="w-[28px] h-[28px] rounded-full"
                      style={{ backgroundColor: getRelationColor(submission.relation) }}
                    />
                    <span className="text-[15px] font-medium uppercase text-white">
                      {submission.relation === 'neutralnie' ? 'NEUTR.' : submission.relation.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="h-full w-[0.8px] bg-[#274FDE]/40" />

                {/* 4. AKCJA - Przyciski mają teraz margines od krawędzi */}
                <div className="flex items-center justify-center gap-4 px-4">
                  <button
                    onClick={() => handleDecision(submission.id, 'approve')}
                    disabled={!!processingId}
                    className="w-[127px] h-[40px] bg-[#20CA5F] hover:bg-[#1ab552] transition-all rounded-[50px] flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(32,202,95,0.2)]"
                  >
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[14px] font-bold text-white">Akceptuj</span>
                  </button>

                  <button
                    onClick={() => handleDecision(submission.id, 'reject')}
                    disabled={!!processingId}
                    className="w-[127px] h-[40px] bg-[#CB0000] hover:bg-[#a50000] transition-all rounded-[50px] flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(203,0,0,0.2)]"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[14px] font-bold text-white">Odrzuć</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingSubmissionsTable;