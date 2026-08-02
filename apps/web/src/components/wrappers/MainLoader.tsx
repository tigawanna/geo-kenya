import { FlagMark } from "@/components/ui/flag-accents";
import { RouteStatusShell } from "@/lib/tanstack/router/RouteStatusShell";

interface MainLoaderProps {
  className?: string;
  /** Uppercase eyebrow above the headline */
  eyebrow?: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Branded full-page pending state — same atmosphere as router error / 404 shells.
 */
export function MainLoader({
  className,
  children,
  eyebrow = "Charting the route",
  description = "Pulling boundaries and place names — hang tight.",
}: MainLoaderProps) {
  return (
    <RouteStatusShell
      data-test="main-loader"
      busy
      className={className}
      eyebrow={eyebrow}
      visual={
        children ?? (
          <span className="relative inline-flex items-center justify-center">
            <span
              aria-hidden
              className="absolute size-16 animate-pulse rounded-md bg-flag-green-soft"
            />
            <FlagMark className="relative h-10 w-10 animate-blob-float rounded-md ring-1 ring-white/20" />
          </span>
        )
      }
      title={
        <>
          Just a <span className="text-flag-green">moment</span>
        </>
      }
      description={description}
    />
  );
}
