import { NavLink } from "react-router-dom";
import React from "react";

type Props = {
    to: string; // Ścieżka, do której linkujemy, np. "/login"
    children: React.ReactNode; // Tekst, który wyświetli się w linku
    onClick?: () => void;
};

const Link = ({ to, children, onClick }: Props) => {
    // Podstawowe klasy dla wszystkich linków
    const baseClasses = "transition duration-500 hover:text-primary-300";

    // Klasy, które zostaną dodane tylko, gdy link jest aktywny
    const activeClasses = "text-primary-500 font-bold";

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                // Funkcja, która dynamicznie łączy klasy
                isActive ? `${baseClasses} ${activeClasses}` : baseClasses
            }
            onClick={onClick}
        >
            {children}
        </NavLink>
    );
};

export default Link;