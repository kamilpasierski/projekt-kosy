import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type TicketStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type RelationType = 'kosa' | 'zgoda' | 'neutralnie';

interface TicketHistory {
  id: number;
  created_at: string;
  club_a: {
    name: string;
  };
  club_b: {
    name: string;
  };
  relation: RelationType;
  status: TicketStatus;
  description?: string;
}

export default function History() {
  const [tickets, setTickets] = useState<TicketHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      const response = await api.get<TicketHistory[]>('/tickets/user/');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeTypeLabel = (): string => {
    return 'Relacja klubów';
  };

  const getStatusInfo = (status: TicketStatus) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Oczekuje', color: '#fbf201' }; //
      case 'APPROVED':
        return { label: 'Zatwierdzono', color: '#20ca5f' };
      case 'REJECTED':
        return { label: 'Odrzucono', color: '#cb0000' };
    }
  };

  const getRelationLabel = (relation: RelationType, clubA: string, clubB: string): string => {
    const relationType = relation === 'kosa' ? 'KOSA' : relation === 'zgoda' ? 'ZGODA' : 'NEUTRALNIE';
    return `${clubA} – ${clubB} (${relationType})`;
  };

  // Pagination
  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

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

  // Definicja siatki z pionowymi liniami (identyczna jak w tabelach admina)
  const gridLayout = "grid-cols-[1fr_0.8px_1fr_0.8px_1.8fr_0.8px_1fr]";

  if (loading) {
    return (
      <div className="w-full max-w-[1180px] mx-auto py-8">
        <p className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3] mb-8">
          Historia zgłoszonych zmian
        </p>
        <div className="text-white text-center py-8">Ładowanie historii...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1180px] mx-auto py-8 pb-[120px]" data-component="History ">
      <p className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3] mb-10">
        Historia zgłoszonych zmian
      </p>

      {tickets.length === 0 ? (
        <div className="bg-[#343434] rounded-[30px] p-8 text-center border-x border-b border-transparent">
          <p className="text-white text-[16px]">Brak zgłoszonych zmian</p>
        </div>
      ) : (
        <>
          {/* Nagłówek tabeli - wysokość 63.6px, kolor #2A2A2A, ramka #274FDE */}
          <div className="bg-[#2a2a2a] border-[#274fde] border-[0.5px] border-solid h-[63.602px] rounded-t-[30px] overflow-hidden">
            <div className={`grid ${gridLayout} h-full items-center`}>
              <p className="font-montserrat font-medium text-[16px] text-white text-center">Data</p>
              <div className="h-full w-full" /> {/* Separator space */}
              <p className="font-montserrat font-medium text-[16px] text-white text-center">Typ zmiany</p>
              <div className="h-full w-full" /> {/* Separator space */}
              <p className="font-montserrat font-medium text-[16px] text-white text-center">Szczegóły</p>
              <div className="h-full w-full" /> {/* Separator space */}
              <p className="font-montserrat font-medium text-[16px] text-white text-center">Status</p>
            </div>
          </div>

          {/* Body tabeli - kolor #343434, linie pionowe */}
          <div className="bg-[#343434] rounded-b-[30px] overflow-hidden border-x border-b border-transparent">
            <div className="divide-y divide-[#274fde]/40">
              {currentTickets.map((ticket) => {
                const statusInfo = getStatusInfo(ticket.status);
                return (
                  <div key={ticket.id} className={`grid ${gridLayout} w-full min-h-[80px] items-center hover:bg-[#3a3a3a] transition-colors`}>
                    {/* Date */}
                    <p className="font-montserrat font-medium text-[16px] text-white text-center px-4">
                      {formatDate(ticket.created_at)}
                    </p>

                    {/* Vertical Line */}
                    <div className="h-full w-[0.8px] bg-[#274fde]/40 mx-auto" />

                    {/* Change Type */}
                    <p className="font-montserrat font-medium text-[16px] text-white text-center px-4">
                      {getChangeTypeLabel()}
                    </p>

                    {/* Vertical Line */}
                    <div className="h-full w-[0.8px] bg-[#274fde]/40 mx-auto" />

                    {/* Details */}
                    <p className="font-montserrat font-medium text-[16px] text-white text-center whitespace-pre-wrap px-4">
                      {getRelationLabel(ticket.relation, ticket.club_a.name, ticket.club_b.name)}
                    </p>

                    {/* Vertical Line */}
                    <div className="h-full w-[0.8px] bg-[#274fde]/40 mx-auto" />

                    {/* Status */}
                    <div className="flex items-center justify-center gap-3 px-4">
                      <div
                        className="w-[26px] h-[26px] rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: statusInfo.color }}
                      />
                      <p className="font-montserrat font-medium text-[16px] text-white">
                        {statusInfo.label}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Puste wiersze dla równej wysokości */}
              {Array.from({ length: Math.max(0, itemsPerPage - currentTickets.length) }).map((_, index) => (
                <div key={`empty-${index}`} className={`grid ${gridLayout} w-full min-h-[80px] items-center`}>
                  <p className="text-transparent">-</p>
                  <div className="h-full w-[0.8px] bg-[#274fde]/40 mx-auto" />
                  <p className="text-transparent">-</p>
                  <div className="h-full w-[0.8px] bg-[#274fde]/40 mx-auto" />
                  <p className="text-transparent">-</p>
                  <div className="h-full w-[0.8px] bg-[#274fde]/40 mx-auto" />
                  <p className="text-transparent">-</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-[10px] mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="bg-[#2a2a2a] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center disabled:opacity-50 hover:bg-[#3a3a3a] transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
                    rounded-[10px] w-[35px] h-[35px] flex items-center justify-center
                    font-montserrat font-medium text-[16px] text-white leading-[1.3]
                    transition-colors
                    ${pageNum === currentPage
                      ? 'bg-[rgba(39,79,222,0.2)] border-[#274fde] border-[0.5px] border-solid'
                      : 'bg-transparent hover:bg-white/10'
                    }
                  `}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-[#2a2a2a] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center disabled:opacity-50 hover:bg-[#3a3a3a] transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}