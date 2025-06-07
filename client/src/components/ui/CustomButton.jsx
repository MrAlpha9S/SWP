import React from "react";
import clsx from "clsx"; // Optional: install clsx for cleaner conditional classNames

const CustomButton = ({ type = "primary", onClick, children, disabled = false }) => {
    const baseClasses =
        " flex items-center justify-center gap-2 h-[42px] min-w-[120px] px-2 py-2 rounded-md transition font-medium";

    const typeStyles = {
        primary:
            "bg-primary-500 text-white hover:bg-primary-600",
        secondary:
            "border border-primary-500 text-primary-500 hover:text-white hover:bg-primary-500",
        cancel:
            "border border-red-500 text-red-500 hover:text-white hover:bg-red-500",
    };

    return (
        <button disabled={disabled} onClick={onClick} className={clsx(baseClasses, typeStyles[type])}>
            {children}
        </button>
    );
};

export default CustomButton;
