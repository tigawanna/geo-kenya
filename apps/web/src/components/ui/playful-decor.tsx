import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

type DecorProps = {
  className?: string;
  style?: CSSProperties;
};

export function Blob({ className, style }: DecorProps) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      className={cn("text-primary", className)}
      style={style}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M52.7,-57.7C66.7,-46.9,75.5,-29.3,77.8,-11C80.1,7.3,75.9,26.3,65.3,40.9C54.7,55.5,37.7,65.7,19.2,70.9C0.7,76.1,-19.3,76.3,-36.4,69C-53.5,61.7,-67.7,46.9,-73.9,29.5C-80.1,12.1,-78.3,-7.9,-71,-25.2C-63.7,-42.5,-50.9,-57.1,-36,-67.1C-21.1,-77.1,-4.1,-82.5,11.6,-79.9C27.3,-77.3,38.7,-68.5,52.7,-57.7Z"
      />
    </svg>
  );
}

export function Sparkle({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn("text-flag-red", className)} style={style} aria-hidden>
      <path
        fill="currentColor"
        d="M50 0 C 54 30 70 46 100 50 C 70 54 54 70 50 100 C 46 70 30 54 0 50 C 30 46 46 30 50 0 Z"
      />
    </svg>
  );
}

export function Squiggle({ className, style }: DecorProps) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={cn("text-primary", className)}
      style={style}
      fill="none"
      aria-hidden
    >
      <path
        d="M4 24 C 18 4 30 4 44 24 S 70 44 84 24 S 110 4 116 16"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Ring({ className, style }: DecorProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("text-base-content", className)}
      style={style}
      fill="none"
      aria-hidden
    >
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" />
    </svg>
  );
}

export function Dots({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 90 60" className={cn("text-flag-red", className)} style={style} aria-hidden>
      <g fill="currentColor">
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <circle key={`${row}-${col}`} cx={9 + col * 18} cy={9 + row * 21} r="4" />
          )),
        )}
      </g>
    </svg>
  );
}
