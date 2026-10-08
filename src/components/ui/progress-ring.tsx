type ProgressRingProps = {
  value: number;
  size?: number;
};

export function ProgressRing({ value, size = 104 }: ProgressRingProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#5964d9 ${clampedValue * 3.6}deg, #e8e9ef ${clampedValue * 3.6}deg)`,
      }}
      aria-label={`${clampedValue}% funded`}
      role="img"
    >
      <div className="grid place-items-center rounded-full bg-white" style={{ width: size - 14, height: size - 14 }}>
        <span className="text-xl font-bold tracking-[-0.04em] text-[#132238]">{clampedValue}%</span>
      </div>
    </div>
  );
}
