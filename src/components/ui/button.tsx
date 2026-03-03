import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const classesByVariant = {
  primary:
    "bg-zinc-100 text-zinc-950 hover:bg-white border border-zinc-200 transition-colors duration-200",
  secondary:
    "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-zinc-700 transition-colors duration-200",
  ghost: "bg-transparent text-zinc-200 hover:bg-zinc-800 border border-zinc-700 transition-colors duration-200",
  danger: "bg-red-500 text-zinc-50 hover:bg-red-400 border border-red-300 transition-colors duration-200",
};

export const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`h-10 px-4 text-sm font-semibold uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-40 ${classesByVariant[variant]} ${className}`}
      {...props}
    />
  );
};
