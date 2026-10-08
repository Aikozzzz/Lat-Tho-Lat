import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-[#ff765f] text-[#132238] shadow-[0_8px_22px_rgba(255,118,95,0.22)] hover:bg-[#ff8874]",
  secondary: "border border-[#d8d6ce] bg-white text-[#132238] hover:border-[#132238] hover:bg-[#faf9f6]",
  ghost: "text-[#566071] hover:bg-[#f2f2ed] hover:text-[#132238]",
  dark: "bg-[#132238] text-white shadow-[0_8px_20px_rgba(19,34,56,0.18)] hover:bg-[#203854]",
};

const sizes = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-6 text-sm",
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5964d9] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
