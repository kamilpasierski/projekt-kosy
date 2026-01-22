import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

// --- Types ---
export interface Notification {
  id: string;
  content: string;
  timestamp: string;
}

// --- Sub-components ---

const Backdrop = ({ onClick }: { onClick: () => void }) => (
  <div 
    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px] transition-opacity"
    onClick={onClick}
  />
);

const NotificationItem = ({ notification }: { notification: Notification }) => (
  <div className="p-4 rounded-2xl bg-neutral-700/60 border border-neutral-600/50 shadow-sm mb-2">
    <p className="text-white text-sm leading-snug mb-1.5">{notification.content}</p>
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

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative inline-block">
      {/* Trigger: Bell Icon */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className="w-11 h-11 relative bg-neutral-700 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] flex items-center justify-center text-white hover:bg-neutral-600 transition-all active:scale-95 cursor-pointer z-50"
      >
        <BellIcon className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <>
          {createPortal(
            <>
              <Backdrop onClick={() => setIsOpen(false)} />
              
              <div className="fixed right-4 top-20 w-[380px] max-w-[95vw] bg-[#2a2a2a]/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden border border-neutral-700/50 animate-in fade-in slide-in-from-top-2 duration-200">
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