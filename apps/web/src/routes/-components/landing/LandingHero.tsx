import { DotGridBackground } from "@/components/ui/dot-grid-background";
import { FlagHairline, FlagMark, FlagPulseDot } from "@/components/ui/flag-accents";
import { SplitKenyaShieldEdges } from "@/components/ui/split-kenya-shield";
import { landingHero } from "@/content/landing";

export function LandingHero() {
  return (
    <section
      data-test="landing-hero"
      className="relative flex min-h-[calc(100dvh-4.75rem)] flex-col items-center justify-center overflow-hidden"
    >
      <DotGridBackground />
      <SplitKenyaShieldEdges />
      <FlagHairline className="absolute inset-x-0 bottom-0 z-20 h-0.5" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center md:px-10 md:py-28">
        <p
          className="mb-8 inline-flex animate-fade-up items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
          style={{ animationDelay: "40ms" }}
        >
          <FlagPulseDot />
          <span className="text-flag-green">{landingHero.eyebrow}</span>
        </p>

        <h1
          className="animate-fade-up font-display text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.98] font-normal tracking-[-0.03em] text-balance text-base-content"
          style={{ animationDelay: "120ms" }}
        >
          Know your <span className="text-flag-red">ward</span>,{" "}
          <span className="text-flag-green">constituency</span>, and county.
        </h1>

        <p
          className="mt-6 max-w-[34rem] animate-fade-up text-[1.05rem] leading-relaxed text-pretty text-muted-foreground md:text-[1.15rem] md:leading-[1.55]"
          style={{ animationDelay: "220ms" }}
        >
          {landingHero.description}
        </p>

        <div className="mt-10 animate-fade-up" style={{ animationDelay: "320ms" }}>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold text-flag-green-content shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-opacity hover:opacity-90"
          >
            {landingHero.primaryCta}
            <FlagMark className="ring-white/20" />
          </a>
        </div>
      </div>
    </section>
  );
}
