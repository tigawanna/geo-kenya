import { DotGridBackground } from "@/components/ui/dot-grid-background";
import { FlagHairline, FlagPulseDot } from "@/components/ui/flag-accents";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type RouteStatusShellProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  /** Optional mark / loader between the hairline and headline */
  visual?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  busy?: boolean;
  className?: string;
  "data-test"?: string;
};

/**
 * Branded full-viewport shell for router 404 / error / pending surfaces.
 * Matches landing atmosphere: dot grid, flag hairline, display type, muted copy.
 */
export function RouteStatusShell({
  eyebrow,
  title,
  description,
  visual,
  actions,
  footer,
  busy = false,
  className,
  "data-test": dataTest,
}: RouteStatusShellProps) {
  return (
    <div
      data-test={dataTest}
      role={busy ? "status" : undefined}
      aria-live={busy ? "polite" : undefined}
      aria-busy={busy || undefined}
      className={cn(
        "relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-base-100 px-6 py-20 text-base-content",
        className,
      )}
    >
      <DotGridBackground />
      <FlagHairline className="absolute inset-x-0 top-0 z-20 h-0.5" />
      <FlagHairline className="absolute inset-x-0 bottom-0 z-20 h-0.5" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <p className="inline-flex items-center gap-2.5 text-[12px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          <FlagPulseDot />
          <span className="text-flag-green">{eyebrow}</span>
        </p>

        <FlagHairline className="mx-auto mt-8 h-0.5 w-16 rounded-full" />

        {visual ? <div className="mt-8">{visual}</div> : null}

        <h1 className="mt-6 font-display text-[clamp(2.25rem,7vw,3.5rem)] leading-[1.02] font-normal tracking-[-0.03em] text-balance">
          {title}
        </h1>

        {description ? (
          <p className="mt-5 max-w-sm text-[1.05rem] leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}

        {actions ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{actions}</div>
        ) : null}
      </div>

      {footer ? <div className="relative z-10 mt-10 w-full max-w-3xl min-w-0">{footer}</div> : null}
    </div>
  );
}
