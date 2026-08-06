import { FlagHairline, FlagMark } from "@/components/ui/flag-accents";
import { Reveal } from "@/components/ui/reveal";
import { landingAccess } from "@/content/landing";
import {
  getLandingAccessMode,
  publicReleasesQueryOptions,
  type AppRelease,
  type PublicReleaseState,
} from "@/data-access-layer/dashboard/releases";
import { useQuery } from "@tanstack/react-query";
import { LandingWaitlist } from "./LandingWaitlist";

/**
 * Mid-page access section: waitlist while closed-only, otherwise Play links.
 * Early returns keep modes isolated — no nested ternaries.
 */
export function LandingAccess() {
  const { data, isLoading, isError } = useQuery(publicReleasesQueryOptions);

  if (isLoading) {
    return <LandingAccessSkeleton />;
  }

  // Fail open to waitlist so closed testing still collects emails if the query fails.
  if (isError || !data) {
    return <LandingWaitlist />;
  }

  const mode = getLandingAccessMode(data);

  if (mode === "open_and_production") {
    return <OpenAndProductionAccess state={data} />;
  }

  if (mode === "open_testing") {
    return <SingleChannelAccess release={data.openTesting!} copy={landingAccess.openTesting} />;
  }

  if (mode === "production") {
    return <SingleChannelAccess release={data.production!} copy={landingAccess.production} />;
  }

  return <LandingWaitlist />;
}

function LandingAccessSkeleton() {
  return (
    <section id="get-app" data-test="landing-access" className="scroll-mt-20">
      <FlagHairline className="h-px opacity-80" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto h-64 max-w-xl skeleton rounded-2xl" />
      </div>
    </section>
  );
}

function SingleChannelAccess({
  release,
  copy,
}: {
  release: AppRelease;
  copy: { eyebrow: string; heading: string; description: string; cta: string };
}) {
  const label = release.label?.trim() || copy.cta;

  return (
    <section id="get-app" data-test="landing-access" className="scroll-mt-20">
      <FlagHairline className="h-px opacity-80" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.14em] text-flag-green uppercase">
            <span className="size-1.5 rounded-full bg-flag-red" />
            {copy.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-balance text-base-content">
            {copy.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-120 text-pretty text-muted-foreground">
            {copy.description}
          </p>
          <div className="mt-10">
            <a
              href={release.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
            >
              <span>{label}</span>
              <FlagMark />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OpenAndProductionAccess({ state }: { state: PublicReleaseState }) {
  const open = state.openTesting!;
  const production = state.production!;
  const copy = landingAccess.openAndProduction;

  return (
    <section id="get-app" data-test="landing-access" className="scroll-mt-20">
      <FlagHairline className="h-px opacity-80" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.14em] text-flag-green uppercase">
            <span className="size-1.5 rounded-full bg-flag-red" />
            {copy.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-balance text-base-content">
            {copy.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-120 text-pretty text-muted-foreground">
            {copy.description}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={open.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
            >
              <span>{open.label?.trim() || copy.openCta}</span>
              <FlagMark />
            </a>
            <a
              href={production.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-flag-red/45 px-5 py-3.5 text-[15px] text-base-content transition-colors hover:bg-flag-red-soft"
            >
              {production.label?.trim() || copy.productionCta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
