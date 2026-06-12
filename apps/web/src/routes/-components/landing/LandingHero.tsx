import { GpsRadarBackground } from "@/components/ui/gps-radar-background";
import { FlagStripe } from "@/components/ui/kenya-marks";
import { Blob, Dots, Ring, Sparkle, Squiggle } from "@/components/ui/playful-decor";
import { Reveal } from "@/components/ui/reveal";
import { landingHero } from "@/content/landing";
import { Link } from "@tanstack/react-router";
import { Crosshair, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

const LEGEND_TONE: Record<string, string> = {
  red: "bg-flag-red",
  green: "bg-flag-green",
  ink: "bg-base-content",
};

const WARD_MARKERS: { cx: number; cy: number; tone: string; delay: string }[] = [
  { cx: 150, cy: 150, tone: "fill-flag-red", delay: "0ms" },
  { cx: 118, cy: 96, tone: "fill-flag-green", delay: "400ms" },
  { cx: 196, cy: 120, tone: "fill-base-content", delay: "800ms" },
  { cx: 96, cy: 138, tone: "fill-flag-red", delay: "1200ms" },
  { cx: 178, cy: 74, tone: "fill-flag-green", delay: "600ms" },
  { cx: 214, cy: 150, tone: "fill-base-content", delay: "1000ms" },
];

type DecorStyle = CSSProperties & { "--blob-rotate"?: string };

export function LandingHero() {
  return (
    <section
      data-test="landing-hero"
      className="relative mx-auto min-h-dvh max-w-360 overflow-hidden border-x border-border/50"
    >
      <GpsRadarBackground />

      <FlagStripe withSheen className="absolute inset-x-0 top-0 z-20 h-1" />

      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Blob
          className="absolute top-24 -right-16 w-72 animate-blob-float text-flag-green/20"
          style={{ "--blob-rotate": "8deg" } as DecorStyle}
        />
        <Sparkle
          className="absolute top-28 right-[34%] w-9 animate-wiggle text-flag-green"
          style={{ "--blob-rotate": "-8deg" } as DecorStyle}
        />
        <Ring className="absolute bottom-32 left-6 w-14 animate-blob-float text-flag-red/40" />
        <Squiggle className="absolute top-14 left-[42%] w-24 text-flag-green/60" />
        <Dots className="absolute right-10 bottom-24 w-20 text-base-content/15" />
      </div>

      <div className="relative z-10 px-8 pt-20 pb-12 md:px-16 md:pt-28">
        <div className="flex max-w-3xl flex-col gap-7">
          <div className="flex animate-fade-in items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-flag-green/30 bg-flag-green-soft px-4 py-1.5 text-xs font-medium tracking-wide text-flag-green">
              <span className="size-1.5 animate-pulse rounded-full bg-flag-red" />
              {landingHero.eyebrow}
            </span>
          </div>

          <h1 className="animate-fade-in font-display text-6xl leading-[0.95] font-bold tracking-tighter text-balance text-base-content md:text-8xl">
            {landingHero.title}
          </h1>

          <p className="max-w-[54ch] animate-fade-in text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
            {landingHero.description}
          </p>

          <div className="mt-2 flex animate-fade-in flex-wrap items-center gap-4">
            <Link
              to="/auth"
              search={{ returnTo: "/dashboard" }}
              className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {landingHero.primaryCta} →
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full border border-border bg-base-100/70 px-7 py-3.5 text-base-content backdrop-blur-sm transition-colors hover:bg-neutral"
            >
              {landingHero.secondaryCta}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6 px-8 pb-20 md:px-16 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-base-100/70 p-6 shadow-sm backdrop-blur-md md:p-8 lg:col-span-7">
          <div className="flex items-end justify-between border-b border-border/70 pb-3 font-mono">
            <div className="flex gap-4">
              <span className="text-xs font-semibold text-base-content">
                {landingHero.mapPanel.fileLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                {landingHero.mapPanel.pathLabel}
              </span>
            </div>
            <span className="text-xs text-primary">{landingHero.mapPanel.coords}</span>
          </div>

          <KenyaMap />

          <div className="flex flex-wrap gap-2">
            {landingHero.mapPanel.legend.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 rounded-full bg-base-200 px-3 py-1.5 text-xs text-base-content"
              >
                <span className={`size-2 rounded-full ${LEGEND_TONE[item.tone] ?? "bg-primary"}`} />
                {item.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={120}
          className="relative flex flex-col gap-6 rounded-3xl border border-border/60 bg-neutral/40 p-6 shadow-sm backdrop-blur-md md:p-8 lg:col-span-5"
        >
          <div className="flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1.5">
            <Crosshair className="size-4 text-primary" />
            <span className="text-xs font-medium tracking-wide text-primary">Where you are</span>
          </div>

          <div>
            <div className="font-display text-2xl font-bold tracking-tight text-base-content">
              {landingHero.navPanel.title}
            </div>
            <div className="mt-1 font-mono text-xs text-muted-foreground">
              {landingHero.navPanel.context}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {landingHero.navPanel.stats.map((stat, index) => (
              <Stat
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                iconTone={index % 2 === 0 ? "text-flag-green" : "text-flag-red"}
              />
            ))}
          </div>

          <div className="mt-auto space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-base-content/10" />
            <div className="h-1.5 w-4/5 rounded-full bg-base-content/10" />
            <div className="h-1.5 w-2/3 rounded-full bg-primary/40" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type StatProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  iconTone: string;
};

function Stat({ icon: Icon, label, value, iconTone }: StatProps) {
  return (
    <div className="flex flex-col gap-2 bg-base-100 p-4">
      <Icon className={`size-4 ${iconTone}`} />
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-mono text-sm text-base-content tabular-nums">{value}</span>
    </div>
  );
}

function KenyaMap() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-base-200">
      <svg
        viewBox="0 0 320 220"
        className="size-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Stylized map of Kenya with county regions and ward markers"
      >
        <defs>
          <clipPath id="kenya-clip">
            <path d="M152 16 L214 44 L252 78 L257 120 L236 152 L205 178 L176 180 L166 161 L150 178 L106 169 L64 150 L50 126 L45 92 L72 54 L110 28 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#kenya-clip)">
          <rect
            x="0"
            y="0"
            width="320"
            height="220"
            className="fill-flag-green/10 dark:fill-flag-green/15"
          />
          <g className="text-base-content/15" stroke="currentColor" strokeWidth="1.2">
            <path d="M150 16 L150 178" />
            <path d="M45 92 L150 100 L257 120" />
            <path d="M110 28 L150 100 L205 178" />
            <path d="M252 78 L150 100 L64 150" />
          </g>
          <ellipse cx="52" cy="138" rx="22" ry="16" className="fill-sky-500/35" />
        </g>

        <path
          d="M152 16 L214 44 L252 78 L257 120 L236 152 L205 178 L176 180 L166 161 L150 178 L106 169 L64 150 L50 126 L45 92 L72 54 L110 28 Z"
          className="text-flag-green"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {WARD_MARKERS.map((marker) => (
          <circle
            key={`${marker.cx}-${marker.cy}`}
            cx={marker.cx}
            cy={marker.cy}
            r="3.5"
            className={`${marker.tone} animate-pulse`}
            style={{ animationDelay: marker.delay }}
          />
        ))}

        <g>
          <circle cx="150" cy="150" r="12" className="fill-flag-red/15" />
          <circle cx="150" cy="150" r="5" className="fill-flag-red" />
          <text
            x="150"
            y="138"
            textAnchor="middle"
            className="fill-base-content font-mono text-[9px]"
          >
            Nairobi
          </text>
        </g>
      </svg>
    </div>
  );
}
