import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BellIcon } from '@heroicons/react/24/outline';

// --- Types ---
export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  link?: string;
}

interface NotificationsProps {
  notifications?: Notification[]; // ? oznacza, że prop jest opcjonalny
  isLoading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onReadAll?: () => void;
}

// --- Sub-components ---

/**
 * Backdrop obsługujący zamykanie i efekt blura
 */
const Backdrop = ({ onClick }: { onClick: () => void }) => (
  <div 
    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px] transition-opacity"
    onClick={onClick}
  />
);

/**
 * Pojedynczy element listy powiadomień
 */
const NotificationItem = ({ notification, onClick }: { notification: Notification; onClick: () => void }) => (
  <div
    onClick={() => onClick()}
    className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent ${
      notification.is_read 
        ? 'bg-neutral-800/40 hover:bg-neutral-800/60 opacity-70' 
        : 'bg-neutral-700/60 hover:bg-neutral-700 border-neutral-600/50 shadow-sm'
    }`}
  >
    <p className="text-white text-sm leading-snug mb-1.5">{notification.message}</p>
    <span className="text-neutral-400 text-[10px] uppercase tracking-wider font-medium">
      {notification.timestamp}
    </span>
  </div>
);

// --- Main Component ---

export const Notifications = ({ 
  notifications = [], // domyślnie pusta tablica
  isLoading = false,
  onMarkAsRead = () => {}, // pusta funkcja (no-op)
  onReadAll = () => {} 
}: NotificationsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative inline-block">
      {/* Trigger: Bell Icon */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className="w-11 h-11 relative bg-neutral-700 rounded-full shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] flex items-center justify-center text-white hover:bg-neutral-600 transition-all active:scale-95 cursor-pointer z-50"
        aria-label="Powiadomienia"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-black rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-in zoom-in-50 duration-300">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Overlay: Portal & Backdrop */}
      {isOpen && (
        <>
          {createPortal(
            <>
              <Backdrop onClick={() => setIsOpen(false)} />
              
              <div 
                className="fixed right-4 top-20 w-[380px] max-w-[95vw] bg-[#2a2a2a]/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden border border-neutral-700/50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="p-6">
                  <header className="flex items-center justify-between mb-5">
                    <h3 className="text-white text-xl font-bold tracking-tight">Powiadomienia</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={onReadAll}
                        className="text-xs text-green-400 hover:text-green-300 font-semibold transition-colors"
                      >
                        Oznacz wszystkie jako przeczytane
                      </button>
                    )}
                  </header>

                  <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                    {isLoading ? (
                      <div className="flex flex-col gap-3 animate-pulse">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-20 bg-neutral-700/50 rounded-2xl" />
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-neutral-500 font-medium">Brak nowych powiadomień</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onClick={() => {
                            onMarkAsRead(notification.id);
                          }}
                        />
                      ))
                    )}
                  </div>

                  <footer className="mt-5 pt-4 border-t border-neutral-700/50 text-center">
                    <button className="text-neutral-400 hover:text-white text-sm font-medium transition-colors">
                      Przejdź do pełnej listy
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