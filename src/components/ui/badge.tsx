import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#4f5a6d] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
