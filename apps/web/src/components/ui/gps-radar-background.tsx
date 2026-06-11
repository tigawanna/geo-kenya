import { cn } from "@/lib/utils";

type Blip = {
  top: string;
  left: string;
  delay: string;
  tone: "green" | "red" | "ink";
};

type GpsRadarBackgroundProps = {
  className?: string;
  rings?: number;
  ringInterval?: number;
  originX?: string;
  originY?: string;
};

const BLIP_TONE: Record<Blip["tone"], string> = {
  green: "bg-primary",
  red: "bg-flag-red",
  ink: "bg-base-content",
};

const BLIPS: Blip[] = [
  { top: "22%", left: "30%", delay: "0ms", tone: "green" },
  { top: "64%", left: "21%", delay: "900ms", tone: "red" },
  { top: "38%", left: "58%", delay: "1800ms", tone: "ink" },
  { top: "74%", left: "67%", delay: "2700ms", tone: "green" },
  { top: "15%", left: "78%", delay: "1300ms", tone: "red" },
  { top: "52%", left: "44%", delay: "2200ms", tone: "green" },
];

export function GpsRadarBackground({
  className,
  rings = 4,
  ringInterval = 1100,
  originX = "26%",
  originY = "50%",
}: GpsRadarBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "[--radar-color:color-mix(in_oklch,var(--color-primary)_60%,transparent)]",
        "dark:[--radar-color:color-mix(in_oklch,var(--color-primary)_75%,transparent)]",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-grid opacity-60"
        style={{
          maskImage: `radial-gradient(120% 120% at ${originX} ${originY}, black, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(120% 120% at ${originX} ${originY}, black, transparent 70%)`,
        }}
      />

      <div
        className="absolute aspect-square w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          top: originY,
          left: originX,
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, var(--radar-color) 350deg, transparent 360deg)`,
          maskImage: "radial-gradient(circle, black 0%, black 55%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, black 55%, transparent 70%)",
          animation: "radar-sweep 7s linear infinite",
        }}
      />

      {Array.from({ length: rings }).map((_, index) => (
        <div
          key={index}
          className="absolute aspect-square w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-radar-ping rounded-full border border-(--radar-color)"
          style={{
            top: originY,
            left: originX,
            animationDelay: `${index * ringInterval}ms`,
          }}
        />
      ))}

      <div
        className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_24px_4px_var(--radar-color)]"
        style={{ top: originY, left: originX }}
      />

      {BLIPS.map((blip) => (
        <span
          key={`${blip.top}-${blip.left}`}
          className={cn("absolute size-2 animate-radar-blip rounded-full", BLIP_TONE[blip.tone])}
          style={{ top: blip.top, left: blip.left, animationDelay: blip.delay }}
        />
      ))}
    </div>
  );
}
