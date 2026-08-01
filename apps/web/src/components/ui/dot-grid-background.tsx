import { useId, useMemo } from "react";

type DotGridProps = {
  className?: string;
  cols?: number;
  rows?: number;
  /** Skip a centered hole so text stays readable */
  clearCenter?: boolean;
};

/**
 * Primora-style sparse grid of 2×2 dots with staggered color-pulse.
 * Kenya accents: flag green ↔ flag red (instead of purple ↔ coral).
 */
export function DotGridBackground({
  className = "",
  cols = 13,
  rows = 8,
  clearCenter = true,
}: DotGridProps) {
  const uid = useId().replace(/:/g, "");
  const dots = useMemo(() => {
    const step = 71;
    const pad = 31;
    const items: {
      x: number;
      y: number;
      kind: "a" | "b";
      duration: number;
      delay: number;
    }[] = [];

    const cx0 = Math.floor(cols / 2) - 2;
    const cx1 = Math.ceil(cols / 2) + 2;
    const cy0 = Math.floor(rows / 2) - 2;
    const cy1 = Math.ceil(rows / 2) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (clearCenter && col >= cx0 && col <= cx1 && row >= cy0 && row <= cy1) {
          continue;
        }
        const i = row * cols + col;
        items.push({
          x: pad + col * step,
          y: pad + row * step,
          kind: i % 2 === 0 ? "a" : "b",
          duration: 2.6 + ((i * 17) % 30) / 10,
          delay: -((i * 13) % 35) / 10,
        });
      }
    }
    return items;
  }, [cols, rows, clearCenter]);

  const width = 31 + (cols - 1) * 71 + 33;
  const height = 31 + (rows - 1) * 71 + 33;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        className="size-full opacity-70 dark:opacity-90"
      >
        <defs>
          <style>{`
            @keyframes gk-dot-ab {
              0%, 100% { fill: var(--flag-green); }
              33% { fill: var(--flag-black); }
              66% { fill: var(--flag-red); }
            }
            @keyframes gk-dot-ba {
              0%, 100% { fill: var(--flag-red); }
              33% { fill: var(--flag-green); }
              66% { fill: var(--flag-white); }
            }
            .gk-dot-a { animation: gk-dot-ab ease-in-out infinite; opacity: 0.28; }
            .gk-dot-b { animation: gk-dot-ba ease-in-out infinite; opacity: 0.28; }
            [data-theme="dark"] .gk-dot-a,
            [data-theme="dark"] .gk-dot-b { opacity: 0.4; }
            @media (prefers-reduced-motion: reduce) {
              .gk-dot-a, .gk-dot-b { animation: none; fill: var(--flag-green); opacity: 0.18; }
            }
          `}</style>
        </defs>
        {dots.map((dot) => (
          <rect
            key={`${dot.x}-${dot.y}`}
            className={dot.kind === "a" ? "gk-dot-a" : "gk-dot-b"}
            x={dot.x}
            y={dot.y}
            width="2"
            height="2"
            style={{
              animationDuration: `${dot.duration}s`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </svg>
      {/* CSS vignette — SVG stopColor can't resolve DaisyUI oklch tokens (fell back to black). */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_55%,color-mix(in_oklch,var(--color-base-100)_55%,transparent)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,color-mix(in_oklch,var(--color-base-100)_75%,transparent)_100%)]"
        data-fade={uid}
      />
    </div>
  );
}
