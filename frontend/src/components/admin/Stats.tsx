import React from 'react';
import AdminStatCard from './AdminStatCard';

const Stats: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-8 justify-start p-4">

            {/* Karta 1: Liczba użytkowników */}
            <AdminStatCard
                title="Liczba użytkowników"
                value="15,234"
            />

            {/* Karta 2: Ilość relacji zdefiniowanych */}
            <AdminStatCard
                title="Ilość relacji zdefiniowanych"
                value="450"
            />

            {/* Karta 3: Krytyczne błędy systemu */}
            <AdminStatCard
                title="Krytyczne błędy systemu"
                value="2"
                isError={true}
            />
        </div>
    );
};

export default Stats;