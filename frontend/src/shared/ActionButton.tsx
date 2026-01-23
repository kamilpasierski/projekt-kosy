import React from "react";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string; // << DODANE
}

const ActionButton = ({ children, onClick, type = "button", disabled = false, className = "" }: Props) => {
    return (
        <button
            className={
                "bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold text-sm lg:text-base transition-colors shadow-lg whitespace-nowrap cursor-pointer "
                + className
            }
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default ActionButton;
