import React from "react";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const ActionButton = ({ children, onClick, type = "button", disabled = false }: Props) => {
    return (
        <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold text-sm lg:text-base transition-colors shadow-lg whitespace-nowrap cursor-pointer"
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default ActionButton;