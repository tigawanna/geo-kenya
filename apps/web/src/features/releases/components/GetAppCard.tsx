import { FlagMark } from "@/components/ui/flag-accents";
import {
  getLandingAccessMode,
  type PublicReleaseState,
} from "@/data-access-layer/dashboard/releases";

/**
 * Signed-in hub card for Play links. Early returns per distribution phase.
 */
export function GetAppCard({ state }: { state: PublicReleaseState }) {
  const mode = getLandingAccessMode(state);

  if (mode === "open_and_production") {
    return (
      <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6 md:col-span-2">
        <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">
          Android app
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">Get GeoKenya</h2>
        <p className="mt-2 max-w-xl text-sm text-base-content/70">
          Open testing has the newest features. Production is the stable Play Store build.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={state.openTesting!.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            <span>{state.openTesting!.label?.trim() || "Try open testing"}</span>
            <FlagMark className="h-4 w-4" />
          </a>
          <a
            href={state.production!.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-flag-red/45 px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors hover:bg-flag-red-soft"
          >
            {state.production!.label?.trim() || "Get production"}
          </a>
        </div>
      </div>
    );
  }

  if (mode === "open_testing") {
    return (
      <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6 md:col-span-2">
        <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">
          Open testing
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">Try the latest build</h2>
        <p className="mt-2 max-w-xl text-sm text-base-content/70">
          Open testing is live on Google Play. Install and help us polish the newest features.
        </p>
        <div className="mt-4">
          <a
            href={state.openTesting!.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            <span>{state.openTesting!.label?.trim() || "Join open testing"}</span>
            <FlagMark className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6 md:col-span-2">
      <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">Google Play</p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight">Download GeoKenya</h2>
      <p className="mt-2 max-w-xl text-sm text-base-content/70">
        The production release is available on Google Play.
      </p>
      <div className="mt-4">
        <a
          href={state.production!.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90 active:scale-[0.97]"
        >
          <span>{state.production!.label?.trim() || "Get the app"}</span>
          <FlagMark className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
