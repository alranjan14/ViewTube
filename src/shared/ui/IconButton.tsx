import React, { ButtonHTMLAttributes } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "solid" | "outline";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  "aria-label": string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = "ghost",
  size = "md",
  active = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    ghost: active 
      ? "bg-slate-200 text-slate-900" 
      : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    solid: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
  };

  const sizes = {
    sm: "h-8 w-8 [&>svg]:w-4 [&>svg]:h-4",
    md: "h-10 w-10 [&>svg]:w-5 [&>svg]:h-5",
    lg: "h-12 w-12 [&>svg]:w-6 [&>svg]:h-6",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
