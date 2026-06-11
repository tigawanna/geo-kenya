import { landingCta } from "@/content/landing";
import { Link, useLocation } from "@tanstack/react-router";

export function LandingCTA() {
  const { pathname } = useLocation();
  const [before, after] = landingCta.title.split(landingCta.highlight);

  return (
    <section data-test="landing-cta" className="mx-auto max-w-360 border-x border-border/50">
      <div className="border-t border-border/50 px-8 py-24 md:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-base-content md:text-5xl">
            {before}
            <span className="text-primary italic">{landingCta.highlight}</span>
            {after}
          </h2>
          <p className="mx-auto mb-10 max-w-md text-pretty text-muted-foreground">
            {landingCta.description}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/auth"
              search={{ returnTo: pathname }}
              className="bg-primary px-8 py-3 font-mono text-sm font-medium text-primary-content transition-opacity hover:opacity-90"
            >
              {landingCta.primaryCta} →
            </Link>
            <Link
              to="/auth/signup"
              search={{ returnTo: "/dashboard" }}
              className="border border-border px-8 py-3 font-mono text-sm text-base-content transition-colors hover:bg-neutral"
            >
              {landingCta.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
