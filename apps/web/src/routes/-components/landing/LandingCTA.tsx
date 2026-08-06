import { FlagHairline, FlagMark } from "@/components/ui/flag-accents";
import { Reveal } from "@/components/ui/reveal";
import { landingCta } from "@/content/landing";
import {
  getLandingAccessMode,
  publicReleasesQueryOptions,
} from "@/data-access-layer/dashboard/releases";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

/**
 * Bottom CTA mirrors mid-page access mode with early returns per scenario.
 */
export function LandingCTA() {
  const { data, isLoading } = useQuery(publicReleasesQueryOptions);
  const [before, after] = landingCta.title.split(landingCta.highlight);

  if (isLoading || !data) {
    return (
      <CtaShell before={before} after={after} description={landingCta.description}>
        <a
          href="#waitlist"
          className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
        >
          <span>{landingCta.primaryCta}</span>
          <FlagMark />
        </a>
        <SecondaryCapabilitiesLink />
      </CtaShell>
    );
  }

  const mode = getLandingAccessMode(data);

  if (mode === "open_and_production") {
    return (
      <CtaShell before={before} after={after} description={landingCta.dualDescription}>
        <a
          href={data.openTesting!.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
        >
          <span>{data.openTesting!.label?.trim() || landingCta.openTestingCta}</span>
          <FlagMark />
        </a>
        <a
          href={data.production!.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-flag-red/45 px-5 py-3.5 text-[15px] text-base-content transition-colors hover:bg-flag-red-soft"
        >
          {data.production!.label?.trim() || landingCta.productionCta}
        </a>
      </CtaShell>
    );
  }

  if (mode === "open_testing") {
    return (
      <CtaShell
        before={before}
        after={after}
        description="Open testing is live — install the build and explore GeoKenya on Android."
      >
        <a
          href={data.openTesting!.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
        >
          <span>{data.openTesting!.label?.trim() || landingCta.openTestingCta}</span>
          <FlagMark />
        </a>
        <SecondaryCapabilitiesLink />
      </CtaShell>
    );
  }

  if (mode === "production") {
    return (
      <CtaShell
        before={before}
        after={after}
        description="Download GeoKenya from Google Play and get to know your Kenya."
      >
        <a
          href={data.production!.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
        >
          <span>{data.production!.label?.trim() || landingCta.productionCta}</span>
          <FlagMark />
        </a>
        <SecondaryCapabilitiesLink />
      </CtaShell>
    );
  }

  return (
    <CtaShell before={before} after={after} description={landingCta.description}>
      <a
        href="#waitlist"
        className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
      >
        <span>{landingCta.primaryCta}</span>
        <FlagMark />
      </a>
      <SecondaryCapabilitiesLink />
    </CtaShell>
  );
}

function CtaShell({
  before,
  after,
  description,
  children,
}: {
  before: string | undefined;
  after: string | undefined;
  description: string;
  children: ReactNode;
}) {
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
          <p className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground">{description}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SecondaryCapabilitiesLink() {
  return (
    <a
      href="#capabilities"
      className="rounded-md border border-flag-red/45 px-5 py-3.5 text-[15px] text-base-content transition-colors hover:bg-flag-red-soft"
    >
      {landingCta.secondaryCta}
    </a>
  );
}
