import React from 'react';

interface AdminStatCardProps {
    title: string;
    value: string | number;
    isError?: boolean;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ title, value = false }) => {
    return (
        <div className={`w-80 h-52 relative p-7 bg-zinc-800 rounded-[30px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] border-[0.50px]`}>

            {/* Tytuł Statystyki */}
            <div className="text-white text-xl font-semibold font-['Montserrat'] leading-6 mb-4">
                {title}
            </div>

            {/* Wartość Statystyki */}
            <div className="text-white text-4xl font-semibold font-['Montserrat'] leading-10">
                {value}
            </div>

            {/* Usunięto warunkowe renderowanie ikony (brak bloku {icon && ...}) */}
        </div>
    );
};

export default AdminStatCard;