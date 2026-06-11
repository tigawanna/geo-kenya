import { FlagStripe, KenyaShield } from "@/components/ui/kenya-marks";
import { Reveal } from "@/components/ui/reveal";
import { landingCta } from "@/content/landing";
import { Link, useLocation } from "@tanstack/react-router";

export function LandingCTA() {
  const { pathname } = useLocation();
  const [before, after] = landingCta.title.split(landingCta.highlight);

  return (
    <section
      data-test="landing-cta"
      className="relative mx-auto max-w-360 overflow-hidden border-x border-border/50"
    >
      <FlagStripe withSheen className="absolute inset-x-0 top-0 z-10 h-1" />

      <KenyaShield className="pointer-events-none absolute top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] md:w-96" />

      <div className="relative border-t border-border/50 px-8 py-28 md:px-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-display text-5xl font-bold tracking-tighter text-balance text-base-content md:text-8xl">
            {before}
            <span className="bg-linear-to-r from-flag-green to-flag-red bg-clip-text text-transparent">
              {landingCta.highlight}
            </span>
            {after}
          </h2>
          <p className="mx-auto mb-6 max-w-md text-pretty text-muted-foreground">
            {landingCta.description}
          </p>

          <FlagStripe className="mx-auto mb-10 h-1 w-32 rounded-full" />

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/auth"
              search={{ returnTo: pathname }}
              className="rounded-full bg-primary px-8 py-3.5 font-medium text-primary-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {landingCta.primaryCta} →
            </Link>
            <Link
              to="/auth/signup"
              search={{ returnTo: "/dashboard" }}
              className="rounded-full border border-flag-red/50 px-8 py-3.5 text-base-content transition-colors hover:bg-flag-red-soft"
            >
              {landingCta.secondaryCta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
