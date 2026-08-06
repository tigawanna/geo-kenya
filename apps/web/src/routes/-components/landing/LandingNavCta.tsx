import { FlagMark } from "@/components/ui/flag-accents";
import {
  getLandingAccessMode,
  publicReleasesQueryOptions,
  type PublicReleaseState,
} from "@/data-access-layer/dashboard/releases";
import { useQuery } from "@tanstack/react-query";

const navLinkClass =
  "inline-flex items-center gap-2 rounded-md border border-flag-green/35 bg-flag-green-soft px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-base-content transition-colors hover:border-flag-green/60";

/**
 * Header CTA switches with release phase. Early returns — waitlist vs Play links.
 */
export function LandingNavCta() {
  const { data, isLoading } = useQuery(publicReleasesQueryOptions);

  if (isLoading || !data) {
    return <WaitlistNavLink />;
  }

  const mode = getLandingAccessMode(data);

  if (mode === "open_and_production") {
    return <DualNavLinks state={data} />;
  }

  if (mode === "open_testing") {
    return (
      <a href={data.openTesting!.url} target="_blank" rel="noreferrer" className={navLinkClass}>
        <span>{data.openTesting!.label?.trim() || "Try open testing"}</span>
        <FlagMark className="h-4 w-4" />
      </a>
    );
  }

  if (mode === "production") {
    return (
      <a href={data.production!.url} target="_blank" rel="noreferrer" className={navLinkClass}>
        <span>{data.production!.label?.trim() || "Get the app"}</span>
        <FlagMark className="h-4 w-4" />
      </a>
    );
  }

  return <WaitlistNavLink />;
}

function WaitlistNavLink() {
  return (
    <a href="#waitlist" className={navLinkClass}>
      <span>Join waitlist</span>
      <FlagMark className="h-4 w-4" />
    </a>
  );
}

function DualNavLinks({ state }: { state: PublicReleaseState }) {
  return (
    <div className="hidden items-center gap-2 sm:flex">
      <a href={state.openTesting!.url} target="_blank" rel="noreferrer" className={navLinkClass}>
        <span>{state.openTesting!.label?.trim() || "Open testing"}</span>
        <FlagMark className="h-4 w-4" />
      </a>
      <a
        href={state.production!.url}
        target="_blank"
        rel="noreferrer"
        className="hidden rounded-md border border-flag-red/35 px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-base-content transition-colors hover:bg-flag-red-soft lg:inline-flex"
      >
        {state.production!.label?.trim() || "Production"}
      </a>
    </div>
  );
}
