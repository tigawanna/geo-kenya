import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";

type PulseTarget = "center" | "random";

/**
 * An interactive grid background that emits ripple waves on cell click.
 *
 * @param rows - Number of grid rows. Default: `12`
 * @param cols - Number of grid columns. Default: `50`
 * @param cellSize - Size of each cell in pixels. Default: `56`
 * @param className - Additional class names applied to the root element.
 *
 * ### Auto-pulse (loading indicator)
 *
 * Enable `pulse` to make the grid automatically fire a ripple on an interval —
 * useful as a background loading indicator.
 *
 * @param pulse - Enable the auto-ripple loop. Default: `false`
 * @param pulseInterval - Milliseconds between each ripple. Default: `2000`
 * @param pulseTarget - Origin cell strategy: `"center"` uses the grid midpoint,
 *   `"random"` picks a different cell each time. Default: `"center"`
 *
 * @example
 * // Static interactive grid
 * <BackgroundRippleEffect />
 *
 * @example
 * // Loading indicator — center pulse every 2 s
 * <BackgroundRippleEffect pulse />
 *
 * @example
 * // Faster center pulse
 * <BackgroundRippleEffect pulse pulseInterval={800} />
 *
 * @example
 * // Random cell, slower cadence
 * <BackgroundRippleEffect pulse pulseTarget="random" pulseInterval={3500} />
 */
export const BackgroundRippleEffect = ({
  rows = 12,
  cols = 50,
  cellSize = 56,
  className,
  pulse = false,
  pulseInterval = 2000,
  pulseTarget = "center",
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
  pulse?: boolean;
  pulseInterval?: number;
  pulseTarget?: PulseTarget;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const triggerRipple = (row: number, col: number) => {
    setClickedCell({ row, col });
    setRippleKey((k) => k + 1);
  };

  useEffect(() => {
    if (!pulse) return;

    const id = setInterval(() => {
      const row =
        pulseTarget === "center" ? Math.floor(rows / 2) : Math.floor(Math.random() * rows);
      const col =
        pulseTarget === "center" ? Math.floor(cols / 2) : Math.floor(Math.random() * cols);
      triggerRipple(row, col);
    }, pulseInterval);

    return () => clearInterval(id);
  }, [pulse, pulseInterval, pulseTarget, rows, cols]);

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "absolute inset-0 h-screen w-full",
        "[--cell-border-color:color-mix(in_oklch,var(--color-primary)_70%,transparent)] [--cell-fill-color:color-mix(in_oklch,var(--color-primary)_35%,transparent)] [--cell-shadow-color:var(--color-primary)]",
        "dark:[--cell-border-color:var(--color-primary)] dark:[--cell-fill-color:color-mix(in_oklch,var(--color-primary)_20%,transparent)] dark:[--cell-shadow-color:var(--color-primary)]",
      )}
    >
      <div className="relative size-auto overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-2 size-full overflow-hidden" />
        <DivGrid
          key={`base-${rippleKey}`}
          className="mask-radial-from-20% mask-radial-at-top opacity-600"
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="var(--cell-border-color)"
          fillColor="var(--cell-fill-color)"
          clickedCell={clickedCell}
          onCellClick={triggerRipple}
          interactive
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number; // in pixels
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows,
  cols,
  cellSize,
  borderColor,
  fillColor,
  clickedCell,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(() => Array.from({ length: rows * cols }, (_, idx) => idx), [rows, cols]);

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn("relative z-3", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0; // ms
        const duration = 200 + distance * 80; // ms

        const style: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border opacity-50 shadow-[0px_0px_20px_1px_var(--cell-shadow-color)_inset] transition-opacity duration-150 will-change-transform hover:opacity-80 dark:opacity-40 dark:shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset] hover:dark:opacity-60",
              clickedCell && "animate-cell-ripple fill-mode-none",
              !interactive && "pointer-events-none",
            )}
            style={{
              backgroundColor: fillColor,
              borderColor: borderColor,
              ...style,
            }}
            onClick={interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined}
          />
        );
      })}
    </div>
  );
};
