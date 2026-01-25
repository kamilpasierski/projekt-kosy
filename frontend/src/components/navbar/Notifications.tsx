import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';

// --- Types ---
export interface Notification {
  id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

// --- Sub-components ---

const Backdrop = ({ onClick }: { onClick: () => void }) => (
  <div
    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px] transition-opacity"
    onClick={onClick}
  />
);

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const isApproved = notification.content.toLowerCase().includes('zatwierdzono');
  const isRisk = notification.content.toLowerCase().includes('ryzyko');
  const strokeColor = isApproved ? '#20CA5F' : isRisk ? '#CB0000' : '#464646';

  return (
    <div 
      className={`relative flex items-start gap-4 p-5 transition-all cursor-default group hover:bg-white/5 ${!notification.is_read ? 'border-l-4 border-red-500' : ''}`}
      onMouseEnter={() => {
        if (!notification.is_read) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      {/* Kółko ikony */}
      <div
        className="w-[30px] h-[30px] rounded-full flex-shrink-0 bg-[#464646] border-[0.5px] flex items-center justify-center mt-1"
        style={{ borderColor: strokeColor }}
      >
        <BellIcon className="w-[16px] h-[16px] text-[#939393]" />
      </div>

      <div className="flex-1 pr-8">
        {/* Treść: Zmieniona na FONT-MEDIUM */}
        <p className="text-[16px] font-medium text-white leading-tight capitalize font-montserrat">
          {notification.content}
        </p>
        <span className="text-[#FFF] text-[11px] font-normal lowercase font-montserrat opacity-60">
          {notification.timestamp}
        </span>
      </div>

      {/* PRZYCISK X: Usuwa powiadomienie z listy */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="absolute right-4 top-5 text-gray-500 hover:text-white transition-colors p-1"
      >
        <XMarkIcon className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
};

// --- Main Component ---

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // NOWA LOGIKA: Zapamiętujemy ile powiadomień użytkownik "zaakceptował" wzrokiem
  const [lastSeenCount, setLastSeenCount] = useState(0);

  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/api/notifications/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      // Filter to only show unread notifications
      const unreadOnly = response.data.filter((n: Notification) => !n.is_read);
      setNotifications(unreadOnly);
    } catch (error) {
      console.error("Błąd pobierania", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      // --- RĘCZNA REGULACJA POZYCJI (PRAWO / LEWO) ---
      // Aby przesunąć baner w PRAWO: zmniejsz tę liczbę (np. na -20)
      // Aby przesunąć baner w LEWO: zwiększ tę liczbę (np. na 20)
      const manualOffset = -80;

      setCoords({
        top: rect.bottom + 15,
        right: Math.max(10, (window.innerWidth - rect.right) + manualOffset)
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && triggerRef.current && dropdownRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Disable body scrolling when notifications are open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      await axios.patch(`${API_BASE_URL}/api/tickets/notifications/${notificationId}/read/`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));

      // Jeśli czytamy powiadomienie, musimy też zaktualizować licznik "widzianych",
      // żeby kółko nie wróciło nagle z powodu różnicy liczb
      setLastSeenCount(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error("Błąd oznaczania", error);
    }
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // Aktualizuj licznik widzianych jeśli usunięte powiadomienie było nieprzeczytane
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.is_read) {
      setLastSeenCount(prev => Math.max(0, prev - 1));
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);

  // Funkcja obsługująca kliknięcie w dzwonek
  const handleToggle = () => {
    if (!isOpen) {
      // W momencie otwarcia menu, uznajemy że użytkownik "zobaczył" wszystkie obecne powiadomienia.
      // Czerwona kropka zniknie, dopóki unreadNotifications.length nie stanie się większe niż ta wartość.
      setLastSeenCount(unreadNotifications.length);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      {/* IKONA DZWONKA NA NAVBARZE */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className="w-[50px] h-[50px] relative bg-[#343434] rounded-full flex items-center justify-center text-white hover:bg-[#444444] transition-all cursor-pointer z-50"
      >
        <BellIcon className="w-7 h-7" />

        {/* IKONKA LICZNIKA: Pojawia się tylko, gdy liczba nieprzeczytanych jest WIĘKSZA niż liczba ostatnio widzianych */}
        {unreadNotifications.length > lastSeenCount && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#343434]">
            {unreadNotifications.length - lastSeenCount}
          </span>
        )}
      </button>

      {isOpen && createPortal(
        <>
          <Backdrop onClick={() => setIsOpen(false)} />

          <div
            ref={dropdownRef}
            style={{
              top: coords.top,
              right: coords.right,
              maxWidth: 'calc(100vw - 20px)'
            }}
            className="fixed w-[450px] bg-[#343434] rounded-[30px] shadow-[-8px_4px_5px_3px_rgba(0,0,0,0.25)] z-50 overflow-hidden flex flex-col font-montserrat animate-in fade-in slide-in-from-top-2"
          >
            {/* NAGŁÓWEK */}
            <div className="flex items-center gap-3 px-10 pt-7 pb-4">
              <BellIcon className="w-[26px] h-[28px] text-[#E9E44B] fill-[#E9E44B]" />
              <h3 className="text-white text-[18px] font-bold capitalize tracking-[0.05em]">
                Powiadomienia
              </h3>
            </div>

            {/* LINIA */}
            <div className="h-[1px] w-[92%] mx-auto bg-[#464646] mb-2" />

            <div className="max-h-[500px] overflow-y-auto divide-y divide-[#464646]">
              {isLoading ? (
                <div className="p-10 text-center text-white">Ładowanie...</div>
              ) : notifications.length === 0 ? (
                <div className="h-[250px] flex flex-col items-center justify-center text-center px-10">
                  <BellIcon className="w-14 h-14 text-[#939393] mb-4 opacity-10" />
                  <p className="text-white text-[15px] font-bold mb-2 tracking-[0.05em]">
                    Nie masz powiadomień
                  </p>
                  <p className="text-white text-[13px] font-normal opacity-60">
                    Brak powiadomień do wyświetlenia.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              )}
            </div>
            <div className="h-4 w-full" />
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default Notifications;