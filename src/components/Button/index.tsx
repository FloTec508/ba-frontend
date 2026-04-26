import React from "react";

const Button = ({
  loading,
  children,
  type = "ghost",
  size ="md",
  onClick,
  disabled,
  className = "",
}: {
  loading?: boolean;
  children: React.ReactNode;
  type: "ghost" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?:string;
}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`${size === "md" && "px-6 py-4"}  ${size === "sm" && "px-5 py-3"}  transition flex items-center rounded-full ${className} ${type === "ghost" && " hover:bg-button-hover disabled:opacity-50 "}  ${
        type === "primary" && "bg-primary hover:bg-primary/90 text-white"
      } cursor-pointer ${loading ? "disabled:opacity-50" : ""}`}
    >
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin mr-2 rounded-full h-3 w-3 border-2 loader-foreground"></div>
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
