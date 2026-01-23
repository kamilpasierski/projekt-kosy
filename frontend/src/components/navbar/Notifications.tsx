import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

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
  onMarkAsRead
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) => (
  <div
    className={`p-4 rounded-2xl border shadow-sm mb-2 relative transition-all cursor-default ${
      notification.is_read
        ? 'bg-neutral-700/60 border-neutral-600/50'
        : 'bg-neutral-700/80 border-red-500/30 hover:bg-neutral-700/70'
    }`}
    onMouseEnter={() => {
      if (!notification.is_read) {
        onMarkAsRead(notification.id);
      }
    }}
  >
    {!notification.is_read && (
      <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
    )}
    <p className={`text-sm leading-snug mb-1.5 ${notification.is_read ? 'text-neutral-300' : 'text-white font-medium'}`}>
      {notification.content}
    </p>
    <span className="text-neutral-400 text-[10px] uppercase tracking-wider font-medium">
      {notification.timestamp}
    </span>
  </div>
);

// --- Main Component ---

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/api/notifications/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Błąd pobierania powiadomień", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Odświeżanie co 30 sekund
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      await axios.patch(
        `http://localhost:8000/api/tickets/notifications/${notificationId}/read/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update local state optimistically
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Błąd oznaczania powiadomienia jako przeczytane", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative inline-block">
      {/* Trigger: Bell Icon - Rozmiar ustawiony na 45x45px, kolor #343434, brak cieni */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className="w-[45px] h-[45px] min-w-[45px] min-h-[45px] relative bg-[#343434] rounded-full flex items-center justify-center text-white hover:bg-[#444444] transition-all active:scale-95 cursor-pointer z-50"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-[#343434]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <>
          {createPortal(
            <>
              <Backdrop onClick={() => setIsOpen(false)} />

              <div
                ref={dropdownRef}
                className="fixed right-4 top-20 w-[380px] max-w-[95vw] bg-[#2a2a2a]/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden border border-neutral-700/50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="p-6">
                  <header className="flex items-center justify-between mb-5">
                    <h3 className="text-white text-xl font-bold tracking-tight">Powiadomienia</h3>
                  </header>

                  <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                    {isLoading ? (
                      <div className="flex flex-col gap-3 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-neutral-700/50 rounded-2xl" />)}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-neutral-500 font-medium">Brak powiadomień</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                        />
                      ))
                    )}
                  </div>

                  <footer className="mt-5 pt-4 border-t border-neutral-700/50 text-center">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-neutral-400 hover:text-white text-sm font-medium transition-colors"
                    >
                      Zamknij
                    </button>
                  </footer>
                </div>
              </div>
            </>,
            document.body
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;