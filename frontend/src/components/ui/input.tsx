import { InputHTMLAttributes } from "react";

export const Input = ({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`h-10 w-full border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-300 focus:outline-none transition-colors duration-200 ${className}`}
      {...props}
    />
  );
};
