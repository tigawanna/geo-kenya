import { cn } from "@/lib/utils";

/** Compact Kenya flag mark: black · white · red · white · green */
export function FlagMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        // Light plate so black/green stripes stay visible on green CTAs
        "inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-[3px] bg-flag-white ring-1 ring-black/20 dark:ring-white/40",
        className,
      )}
    >
      <span className="w-[22%] bg-flag-black" />
      <span className="w-[8%] bg-flag-white" />
      <span className="w-[40%] bg-flag-red-solid" />
      <span className="w-[8%] bg-flag-white" />
      <span className="w-[22%] bg-flag-green-solid" />
    </span>
  );
}

/** Full-width hairline Kenya flag stripe */
export function FlagHairline({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex h-px w-full overflow-hidden", className)}>
      <span className="w-[22%] bg-flag-black" />
      <span className="w-[6%] bg-flag-white" />
      <span className="flex-1 bg-flag-red-solid" />
      <span className="w-[6%] bg-flag-white" />
      <span className="w-[22%] bg-flag-green-solid" />
    </div>
  );
}

/** Tiny status pulse using flag colors */
export function FlagPulseDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-flex size-1.5", className)}>
      <span className="absolute inset-0 animate-ping rounded-full bg-flag-red opacity-40" />
      <span className="relative size-1.5 rounded-full bg-flag-green" />
    </span>
  );
}

export const FLAG_STEP_ACCENTS = [
  { text: "text-flag-green", bar: "bg-flag-green-solid", soft: "bg-flag-green-soft" },
  { text: "text-flag-red", bar: "bg-flag-red-solid", soft: "bg-flag-red-soft" },
  { text: "text-base-content", bar: "bg-base-content", soft: "bg-base-content/8" },
] as const;
