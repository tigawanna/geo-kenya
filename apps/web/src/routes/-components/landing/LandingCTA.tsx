import { FlagHairline, FlagMark } from "@/components/ui/flag-accents";
import { Reveal } from "@/components/ui/reveal";
import { landingCta } from "@/content/landing";

export function LandingCTA() {
  const [before, after] = landingCta.title.split(landingCta.highlight);

  return (
    <section data-test="landing-cta">
      <FlagHairline className="h-px opacity-80" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <FlagHairline className="mx-auto mb-10 h-0.5 w-24 rounded-full" />
          <h2 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.02] tracking-[-0.02em] text-balance text-base-content">
            {before}
            <em className="text-flag-green not-italic">{landingCta.highlight}</em>
            {after}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground">
            {landingCta.description}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold text-flag-green-content transition-opacity hover:opacity-90"
            >
              {landingCta.primaryCta}
              <FlagMark className="ring-white/20" />
            </a>
            <a
              href="#capabilities"
              className="rounded-md border border-flag-red/45 px-5 py-3.5 text-[15px] text-base-content transition-colors hover:bg-flag-red-soft"
            >
              {landingCta.secondaryCta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
