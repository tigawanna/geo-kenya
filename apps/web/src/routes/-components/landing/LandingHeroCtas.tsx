import { FlagMark } from "@/components/ui/flag-accents";
import {
  getLandingAccessMode,
  publicReleasesQueryOptions,
  type PublicReleaseState,
} from "@/data-access-layer/dashboard/releases";
import { landingHero } from "@/content/landing";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const primaryClass =
  "inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-opacity hover:opacity-90";

const secondaryClass =
  "inline-flex items-center gap-2 rounded-md border border-flag-green/35 bg-flag-green-soft px-5 py-3.5 text-[15px] font-medium whitespace-nowrap text-base-content transition-colors hover:border-flag-green/60";

/**
 * Hero CTAs: Play / waitlist primary on the left, Get started secondary on the right.
 */
export function LandingHeroCtas() {
  const { data, isLoading } = useQuery(publicReleasesQueryOptions);

  if (isLoading || !data) {
    return (
      <CtaRow>
        <WaitlistPrimary />
        <GetStartedSecondary />
      </CtaRow>
    );
  }

  const mode = getLandingAccessMode(data);

  if (mode === "open_and_production") {
    return (
      <CtaRow>
        <OpenTestingPrimary state={data} />
        <GetStartedSecondary />
      </CtaRow>
    );
  }

  if (mode === "open_testing") {
    return (
      <CtaRow>
        <OpenTestingPrimary state={data} />
        <GetStartedSecondary />
      </CtaRow>
    );
  }

  if (mode === "production") {
    return (
      <CtaRow>
        <a href={data.production!.url} target="_blank" rel="noreferrer" className={primaryClass}>
          <span>{data.production!.label?.trim() || "Get the app"}</span>
          <FlagMark />
        </a>
        <GetStartedSecondary />
      </CtaRow>
    );
  }

  return (
    <CtaRow>
      <WaitlistPrimary />
      <GetStartedSecondary />
    </CtaRow>
  );
}

function CtaRow({ children }: { children: ReactNode }) {
  return (
    <div
      className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
      style={{ animationDelay: "340ms" }}
    >
      {children}
    </div>
  );
}

function WaitlistPrimary() {
  return (
    <a href="#waitlist" className={primaryClass}>
      <span>Join waitlist</span>
      <FlagMark />
    </a>
  );
}

function OpenTestingPrimary({ state }: { state: PublicReleaseState }) {
  return (
    <a href={state.openTesting!.url} target="_blank" rel="noreferrer" className={primaryClass}>
      <span>{state.openTesting!.label?.trim() || "Try open testing"}</span>
      <FlagMark />
    </a>
  );
}

function GetStartedSecondary() {
  return (
    <Link to="/dashboard" className={secondaryClass}>
      <span>{landingHero.primaryCta}</span>
    </Link>
  );
}
