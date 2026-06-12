import { cn } from "@/lib/utils";

export type FlagAccent = {
  bar: string;
  text: string;
  soft: string;
  border: string;
  dot: string;
};

export const FLAG_ACCENTS: FlagAccent[] = [
  {
    bar: "bg-flag-green",
    text: "text-flag-green",
    soft: "bg-flag-green-soft",
    border: "border-flag-green/40",
    dot: "bg-flag-green",
  },
  {
    bar: "bg-flag-red",
    text: "text-flag-red",
    soft: "bg-flag-red-soft",
    border: "border-flag-red/40",
    dot: "bg-flag-red",
  },
  {
    bar: "bg-base-content",
    text: "text-base-content",
    soft: "bg-base-content/5",
    border: "border-base-content/30",
    dot: "bg-base-content",
  },
];

type FlagStripeProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
  withSheen?: boolean;
};

export function FlagStripe({
  className,
  orientation = "horizontal",
  withSheen = false,
}: FlagStripeProps) {
  const isVertical = orientation === "vertical";

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex overflow-hidden",
        isVertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      <span className="flex-5 bg-base-content" />
      <span className="flex-1 bg-base-100" />
      <span className="flex-5 bg-flag-red" />
      <span className="flex-1 bg-base-100" />
      <span className="flex-5 bg-flag-green" />
      {withSheen ? (
        <span className="pointer-events-none absolute inset-y-0 w-1/4 animate-flag-sheen bg-linear-to-r from-transparent via-white/40 to-transparent" />
      ) : null}
    </div>
  );
}

type KenyaOutlineProps = {
  className?: string;
};

export function KenyaOutline({ className }: KenyaOutlineProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      className={cn("text-primary", className)}
      fill="none"
      role="presentation"
      aria-hidden
    >
      <path
        d="M152 16 L214 44 L252 78 L257 120 L236 152 L205 178 L176 180 L166 161 L150 178 L106 169 L64 150 L50 126 L45 92 L72 54 L110 28 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type KenyaShieldProps = {
  className?: string;
};

export function KenyaShield({ className }: KenyaShieldProps) {
  return <KenyaShieldGraphic className={className} />;
}

type KenyaShieldBackdropProps = {
  className?: string;
};

export function KenyaShieldBackdrop({ className }: KenyaShieldBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      <KenyaShieldGraphic className="h-[min(130vh,95vw)] w-auto opacity-[0.07] dark:opacity-[0.09]" />
    </div>
  );
}

function KenyaShieldGraphic({ className }: KenyaShieldProps) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={cn(className)}
      fill="none"
      role="presentation"
      aria-hidden
    >
      <g
        className="text-flag-red"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="52" y1="42" x2="148" y2="238" strokeWidth="3.5" />
        <line x1="148" y1="42" x2="52" y2="238" strokeWidth="3.5" />
        <path d="M52 42 L46 28 L58 34 Z" fill="currentColor" stroke="none" />
        <path d="M148 42 L154 28 L142 34 Z" fill="currentColor" stroke="none" />
      </g>

      <g className="text-flag-green" stroke="currentColor" strokeLinecap="round">
        <path d="M92 52 Q72 140 92 228" strokeWidth="5" />
        <path d="M108 52 Q128 140 108 228" strokeWidth="5" />
        <path d="M96 68 Q84 140 96 212" strokeWidth="2.5" opacity="0.85" />
        <path d="M104 68 Q116 140 104 212" strokeWidth="2.5" opacity="0.85" />
        <line x1="100" y1="58" x2="100" y2="222" strokeWidth="2.5" />
        <circle cx="100" cy="140" r="9" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
