import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
};

export function ProgressBar({ value, className, barClassName, label = "Funding progress" }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-[#e9e9e2]", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
    >
      <div
        className={cn("h-full rounded-full bg-[#5964d9] transition-[width] duration-500", barClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
