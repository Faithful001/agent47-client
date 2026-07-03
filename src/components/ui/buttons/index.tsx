import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({ className, children, variant = "primary", ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold font-mono tracking-wide transition-all duration-200 outline-none focus:ring-1 focus:ring-white";
  
  const variants = {
    primary: "bg-white hover:bg-zinc-200 text-zinc-950 shadow-sm",
    secondary: "border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100",
    danger: "bg-red-650 hover:bg-red-550 text-white shadow-sm",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
