import { cn } from "@/lib/utils";

type SplitKenyaShieldProps = {
  className?: string;
};

/**
 * Quiet edge decoration: two halves of a simplified Kenyan shield
 * (curved board + tiny spear stubs). Curves face inward; the join
 * sits off-screen through the page center so it never becomes a focal point.
 */
export function SplitKenyaShieldEdges({ className }: SplitKenyaShieldProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
    >
      {/* Left half — curve opens toward center */}
      <svg
        viewBox="0 0 120 280"
        className="absolute top-1/2 left-0 h-[min(78vh,640px)] w-auto -translate-x-[42%] -translate-y-1/2 text-base-content opacity-[0.055] dark:opacity-[0.08]"
        fill="none"
        role="presentation"
      >
        <ShieldHalf />
      </svg>

      {/* Right half — mirrored so curve also faces inward */}
      <svg
        viewBox="0 0 120 280"
        className="absolute top-1/2 right-0 h-[min(78vh,640px)] w-auto translate-x-[42%] -translate-y-1/2 -scale-x-100 text-base-content opacity-[0.055] dark:opacity-[0.08]"
        fill="none"
        role="presentation"
      >
        <ShieldHalf />
      </svg>
    </div>
  );
}

/** Left half of a simplified Kenyan shield + short spear stubs */
function ShieldHalf() {
  return (
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Outer shield curve (bow) */}
      <path
        d="M118 28
           C 78 48, 42 90, 36 140
           C 42 190, 78 232, 118 252"
        strokeWidth="2.25"
      />
      {/* Inner parallel curve */}
      <path
        d="M118 48
           C 86 64, 58 96, 52 140
           C 58 184, 86 216, 118 232"
        strokeWidth="1.4"
        opacity="0.7"
      />
      {/* Mid rib hint */}
      <path
        d="M118 70
           C 92 88, 72 112, 68 140
           C 72 168, 92 192, 118 210"
        strokeWidth="1"
        opacity="0.45"
      />

      {/* Tiny spear stubs (not full spears) */}
      <g className="text-flag-red" stroke="currentColor">
        {/* Upper stub */}
        <line x1="96" y1="62" x2="78" y2="48" strokeWidth="2" />
        <path d="M78 48 L74 40 L82 44 Z" fill="currentColor" stroke="none" />
        {/* Lower stub */}
        <line x1="96" y1="218" x2="78" y2="232" strokeWidth="2" />
        <path d="M78 232 L74 240 L82 236 Z" fill="currentColor" stroke="none" />
      </g>

      {/* Soft green accent on the bow tips */}
      <g className="text-flag-green" stroke="currentColor">
        <circle cx="118" cy="28" r="2.5" fill="currentColor" stroke="none" opacity="0.8" />
        <circle cx="118" cy="252" r="2.5" fill="currentColor" stroke="none" opacity="0.8" />
      </g>
    </g>
  );
}
