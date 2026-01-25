import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth"; // Importujemy naszego hooka
  import { API_BASE_URL } from '../../utils/config';

// --- TYPY I INTERFEJSY ---
type IconType = "arrow-up" | "arrow-down" | "users" | "clock" | "none";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: IconType;
}

interface DashboardStats {
  relations: number;
  clubs: number;
  users: number;
  tickets: number;
}

// --- KOMPONENT POJEDYNCZEJ KARTY ---
const StatCard: React.FC<StatCardProps> = ({ title, value, icon = "none" }) => {
  const renderIcon = () => {
    switch (icon) {
      case "arrow-up":
        return (
          /* Zielona strzałka - usunięto rotację, aby pokazywała naturalnie w górę */
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 6L16 26M16 6L10 12M16 6L22 12" stroke="#247F46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "arrow-down":
        return (
          /* Niebieska strzałka - dodano rotate-180, aby zamiast w dół pokazywała w górę */
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="rotate-180">
            <path d="M16 26L16 6M16 26L10 20M16 26L22 20" stroke="#274FDE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "users":
        return (
          <svg width="45" height="45" viewBox="0 0 57 57" fill="none">
            <path d="M38.475 49.4999V45.1249C38.475 42.8095 37.5549 40.5896 35.9171 38.9518C34.2793 37.314 32.0594 36.3939 29.744 36.3939H16.2819C13.9665 36.3939 11.7466 37.314 10.1088 38.9518C8.47099 40.5896 7.55089 42.8095 7.55089 45.1249V49.4999" stroke="#20CA5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23.0129 27.6439C27.827 27.6439 31.7284 23.7425 31.7284 18.9284C31.7284 14.1143 27.827 10.2129 23.0129 10.2129C18.1988 10.2129 14.2974 14.1143 14.2974 18.9284C14.2974 23.7425 18.1988 27.6439 23.0129 27.6439Z" stroke="#20CA5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "clock":
        return (
          <svg width="35" height="35" viewBox="0 0 43 43" fill="none">
            <path d="M21.5 39.4167C31.3452 39.4167 39.4167 31.3452 39.4167 21.5C39.4167 11.6548 31.3452 3.58333 21.5 3.58333C11.6548 3.58333 3.58333 11.6548 3.58333 21.5C3.58333 31.3452 11.6548 39.4167 21.5 39.4167Z" stroke="#FBF201" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21.5 10.75V21.5L28.6667 28.6667" stroke="#FBF201" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    /* Karta: 270x240px, BG #343434, Shadow -5px 5px 18px */
    <div className="w-[270px] h-[240px] bg-[#343434] rounded-[30px] border-[0.5px] border-[#222629] shadow-[-5px_5px_18px_0px_rgba(0,0,0,0.6)] p-11 flex flex-col justify-between font-montserrat antialiased">
      {/* Tytuł: Montserrat 20px, font-weight 600 */}
      <h3 className="text-[20px] font-mmedium uppercase text-white leading-[130%] w-[191px] whitespace-pre-wrap">
        {title}
      </h3>
      <div className="flex items-center justify-between mt-auto">
        {/* Wartość: Montserrat 36px, font-weight 600 */}
        <p className="text-[36px] font-semibold text-white leading-[130%]">
          {value}
        </p>
        {icon !== "none" && <div className="flex-shrink-0">{renderIcon()}</div>}
      </div>
    </div>
  );
};

// --- GŁÓWNY KOMPONENT STATS ---
const Stats: React.FC = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    relations: 0,
    clubs: 0,
    users: 0,
    tickets: 0
  });

  const [dataLoading, setDataLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
        if (authLoading) return;
        if (!isLoggedIn) {
            setDataLoading(false);
            return;
        }
        try {
            const response = await axios.get<DashboardStats>(`${API_BASE_URL}/api/stats/global/`);
            setStats(response.data);
        } catch (error) {
            console.error("Błąd pobierania statystyk:", error);
        } finally {
            setDataLoading(false);
        }
    };
    fetchStats();
  }, [authLoading, isLoggedIn]);

  return (
    /* Wymuszona szerokość 1180px dla całego modułu */
    <div className="w-full max-w-[1180px] mb-[65px] mx-auto pt-[65px] font-montserrat antialiased">

      {/* Tytuł sekcji (bez tła) */}
      <h2 className="text-[20px] font-medium uppercase text-white leading-[1.3] mb-10">
        Statystyki globalne
      </h2>

      {/* Kontener kart: Szerokość 1182px, tło blue alpha 0.19, Radius 30px */}
      <div className="w-full min-h-[264px] bg-[rgba(39,79,222,0.19)] rounded-[30px] p-4 flex flex-wrap justify-between items-center gap-y-4">
        <StatCard
          title="Liczba relacji w systemie"
          value={dataLoading || authLoading ? "..." : stats.relations}
          icon="arrow-up"
        />
        <StatCard
            title="Aktywne kluby"
            value={dataLoading || authLoading ? "..." : stats.clubs}
            icon="arrow-down"
        />
        <StatCard
            title="Liczba użytkowników"
            value={dataLoading || authLoading ? "..." : stats.users}
            icon="users"
        />
        <StatCard
            title="Zgłoszenia oczekujące"
            value={dataLoading || authLoading ? "..." : stats.tickets}
            icon="clock"
        />
      </div>
    </div>
  );
};

export default Stats;