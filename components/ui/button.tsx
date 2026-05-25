import React from "react";

type buttonProps = {
  text: string;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  bgColor?: string; // e.g. "primary" or "white"
  className?: string;
};

const Button = ({ text, onClick, type, bgColor, className }: buttonProps) => {
  // Safe mapping for backgrounds if you want to use the bgColor prop
  const bgMapping: Record<string, string> = {
    primary: "bg-(--primary) text-white border border-(--primary",
    white: "bg-white text-black border border-gray-200",
  };

  // Fallback to primary if no bgColor is provided, or let className handle it completely
  const selectedBg = bgColor ? bgMapping[bgColor] : "";

  return (
    <button
      type={type}
      // Removed hardcoded text sizes/colors so your custom className works
      className={`rounded-xl w-full font-bold transition-colors p-3.5 ${selectedBg} ${className || ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
