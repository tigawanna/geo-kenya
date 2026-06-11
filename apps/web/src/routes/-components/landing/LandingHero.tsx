import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { landingHero } from "@/content/landing";
import { Link } from "@tanstack/react-router";
import { Mountain, Navigation, Route as RouteIcon, Timer } from "lucide-react";

const LEGEND_TONE: Record<string, string> = {
  primary: "bg-primary",
  info: "bg-sky-500",
  warning: "bg-amber-500",
};

export function LandingHero() {
  return (
    <section
      data-test="landing-hero"
      className="relative mx-auto min-h-dvh max-w-360 border-x border-border/50"
    >
      <BackgroundRippleEffect
        rows={10}
        cols={40}
        pulse
        pulseTarget="random"
        pulseInterval={2600}
        className="mt-5"
      />

      <div className="relative z-10 border-b border-border/50 px-8 py-16 md:px-16 md:py-24">
        <div className="flex max-w-3xl flex-col gap-8">
          <div className="flex animate-fade-in items-center gap-3 font-mono">
            <span className="border border-primary/30 bg-primary/5 px-2 py-1 text-xs tracking-widest text-primary uppercase">
              {landingHero.eyebrow}
            </span>
          </div>

          <h1 className="animate-fade-in text-5xl font-semibold tracking-tighter text-balance text-base-content md:text-7xl">
            {landingHero.title}
          </h1>

          <p className="max-w-[52ch] animate-fade-in text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
            {landingHero.description}
          </p>

          <div className="mt-2 flex animate-fade-in flex-wrap gap-4">
            <Link
              to="/auth"
              search={{ returnTo: "/dashboard" }}
              className="bg-primary px-6 py-3 font-mono font-medium text-primary-content transition-opacity hover:opacity-90"
            >
              {landingHero.primaryCta} →
            </Link>
            <Link
              to="/dashboard"
              className="border border-border bg-base-100/60 px-6 py-3 font-mono text-base-content backdrop-blur-sm transition-colors hover:bg-neutral"
            >
              {landingHero.secondaryCta}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col gap-4 border-b border-border/50 bg-base-100/60 p-6 backdrop-blur-sm md:p-12 lg:col-span-7 lg:border-r lg:border-b-0">
          <div className="flex items-end justify-between border-b border-border pb-3 font-mono">
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

          <TrailMap />

          <div className="flex flex-wrap gap-5 font-mono text-xs text-muted-foreground">
            {landingHero.mapPanel.legend.map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${LEGEND_TONE[item.tone] ?? "bg-primary"}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-6 border-b border-border/50 bg-neutral/30 p-6 backdrop-blur-sm md:p-12 lg:col-span-5 lg:border-b-0">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Navigation className="size-4 text-primary" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Navigate
            </span>
          </div>

          <div className="text-2xl font-semibold tracking-tight text-base-content">
            {landingHero.navPanel.title}
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden border border-border bg-border">
            <Stat icon={RouteIcon} label="Distance" value={landingHero.navPanel.distance} />
            <Stat icon={Mountain} label="Elevation" value={landingHero.navPanel.elevation} />
            <Stat icon={Timer} label="Est. time" value={landingHero.navPanel.eta} />
          </div>

          <div className="mt-auto space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-base-content/10" />
            <div className="h-1.5 w-4/5 rounded-full bg-base-content/10" />
            <div className="h-1.5 w-2/3 rounded-full bg-primary/40" />
          </div>
        </div>
      </div>
    </section>
  );
}

type StatProps = {
  icon: typeof RouteIcon;
  label: string;
  value: string;
};

function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-2 bg-base-100 p-4">
      <Icon className="size-4 text-primary" />
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-mono text-sm text-base-content tabular-nums">{value}</span>
    </div>
  );
}

function TrailMap() {
  return (
    <div className="relative aspect-video w-full overflow-hidden border border-border bg-base-200">
      <svg
        viewBox="0 0 320 180"
        className="size-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Stylized forest trail map"
      >
        <g className="text-base-content/10" stroke="currentColor" strokeWidth="1">
          <path d="M-10 40 C 70 10 150 70 230 30 S 360 40 360 40" />
          <path d="M-10 80 C 80 50 160 110 240 70 S 360 80 360 80" />
          <path d="M-10 120 C 70 95 150 150 230 115 S 360 125 360 125" />
          <path d="M-10 160 C 90 140 170 185 250 155 S 360 165 360 165" />
        </g>

        <path
          d="M30 150 C 70 120 60 90 100 80 S 150 60 170 95 S 220 110 250 70 290 35 300 30"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 7"
        />

        <circle cx="30" cy="150" r="5" className="fill-primary" />
        <circle cx="100" cy="80" r="4" className="fill-sky-500" />
        <circle cx="170" cy="95" r="4" className="fill-sky-500" />
        <circle cx="250" cy="70" r="4" className="fill-amber-500" />
        <circle cx="300" cy="30" r="5" className="fill-primary" />

        <circle cx="30" cy="150" r="11" className="fill-primary/15" />
        <circle cx="300" cy="30" r="11" className="fill-primary/15" />
      </svg>
    </div>
  );
}
