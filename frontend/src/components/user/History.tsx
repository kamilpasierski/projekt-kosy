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
        return { label: 'Oczekuje', color: '#fbf201' };
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
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = tickets.slice(startIndex, endIndex);

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

  if (loading) {
    return (
      <div className="w-full max-w-[1175px] mx-auto py-8 ">
        <p className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3] mb-8">
          Historia zgłoszonych zmian
        </p>
        <div className="text-white text-center py-8">Ładowanie historii...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1175px] mx-auto py-8 pb-[120px]" data-component="History ">
      <p className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3] mb-10">
        Historia zgłoszonych zmian
      </p>

      {tickets.length === 0 ? (
        <div className="bg-[#343434] rounded-[30px] p-8 text-center">
          <p className="text-white text-[16px]">Brak zgłoszonych zmian</p>
        </div>
      ) : (
        <>
          {/* Main Table Container */}
          <div className="bg-[#343434] rounded-[30px] overflow-hidden">
            {/* Header */}
            <div className="bg-[#2a2a2a] border-[#274fde] border-[0.5px] border-solid h-[63.602px] rounded-tl-[30px] rounded-tr-[30px] flex items-center px-8">
              <div className="grid grid-cols-4 w-full gap-4">
                <p className="font-montserrat font-medium text-[16px] text-white">Data</p>
                <p className="font-montserrat font-medium text-[16px] text-white text-center">Typ zmiany</p>
                <p className="font-montserrat font-medium text-[16px] text-white text-center">Szczegóły</p>
                <p className="font-montserrat font-medium text-[16px] text-white text-center">Status</p>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#555]">
              {currentTickets.map((ticket) => {
                const statusInfo = getStatusInfo(ticket.status);
                return (
                  <div key={ticket.id} className="grid grid-cols-4 w-full gap-4 px-8 py-6 items-center">
                    {/* Date */}
                    <p className="font-montserrat font-medium text-[16px] text-white">
                      {formatDate(ticket.created_at)}
                    </p>

                    {/* Change Type */}
                    <p className="font-montserrat font-medium text-[16px] text-white text-center">
                      {getChangeTypeLabel()}
                    </p>

                    {/* Details */}
                    <p className="font-montserrat font-medium text-[16px] text-white text-center whitespace-pre-wrap">
                      {getRelationLabel(ticket.relation, ticket.club_a.name, ticket.club_b.name)}
                    </p>

                    {/* Status */}
                    <div className="flex items-center justify-center gap-2">
                      <div 
                        className="w-[26px] h-[26px] rounded-full" 
                        style={{ backgroundColor: statusInfo.color }}
                      />
                      <p className="font-montserrat font-semibold text-[16px] text-white">
                        {statusInfo.label}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {Array.from({ length: Math.max(0, itemsPerPage - currentTickets.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="grid grid-cols-4 w-full gap-4 px-8 py-6 items-center">
                  <p className="font-montserrat font-medium text-[16px] text-transparent">-</p>
                  <p className="font-montserrat font-medium text-[16px] text-transparent text-center">-</p>
                  <p className="font-montserrat font-medium text-[16px] text-transparent text-center">-</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="font-montserrat font-semibold text-[16px] text-transparent">-</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-[10px] mt-8">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="bg-[#2a2a2a] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>

              {/* Page Numbers */}
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
                      : 'bg-transparent hover:bg-[rgba(67,27,27,0.1)]'
                    }
                  `}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-[#2a2a2a] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
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
