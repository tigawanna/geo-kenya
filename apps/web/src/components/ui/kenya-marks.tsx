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
    bar: "bg-primary",
    text: "text-primary",
    soft: "bg-primary/10",
    border: "border-primary/40",
    dot: "bg-primary",
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
      <span className="flex-5 bg-primary" />
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
  return (
    <svg
      viewBox="0 0 120 150"
      className={cn("text-base-content", className)}
      fill="none"
      role="img"
      aria-label="Stylized Kenyan shield and spears emblem"
    >
      <defs>
        <clipPath id="kenya-shield-clip">
          <ellipse cx="60" cy="75" rx="30" ry="48" />
        </clipPath>
      </defs>

      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="30" y1="18" x2="90" y2="132" />
        <line x1="90" y1="18" x2="30" y2="132" />
      </g>
      <g fill="currentColor">
        <path d="M30 18 L24 30 L38 28 Z" />
        <path d="M90 18 L96 30 L82 28 Z" />
      </g>

      <g clipPath="url(#kenya-shield-clip)">
        <rect x="28" y="24" width="64" height="102" className="fill-base-content" />
        <rect x="28" y="44" width="64" height="62" className="fill-base-100" />
        <rect x="28" y="52" width="64" height="46" className="fill-flag-red" />
        <g className="fill-base-100">
          <ellipse cx="60" cy="75" rx="5" ry="16" />
          <rect x="57.5" y="58" width="5" height="34" rx="2.5" />
        </g>
      </g>

      <ellipse
        cx="60"
        cy="75"
        rx="30"
        ry="48"
        stroke="currentColor"
        strokeWidth="3"
        className="text-primary"
      />
    </svg>
  );
}
