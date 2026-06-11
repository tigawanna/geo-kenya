import { SiteIcon } from "@/components/icon/SiteIcon";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { cn } from "@/lib/utils";

interface MainLoaderProps {
  className?: string;
  rows?: number;
  cols?: number;
  cellSize?: number;
  pulse?: boolean;
  pulseInterval?: number;
  pulseTarget?: "center" | "random";
  bgClassName?: string;
  children?: React.ReactNode;
}

export function MainLoader({
  className,
  children,
  rows = 10,
  cols = 10,
  cellSize = 56,
  pulse = true,
  pulseInterval = 3000,
  pulseTarget = "random",
  bgClassName = "mt-20",
}: MainLoaderProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden",
        className,
      )}
    >
      <BackgroundRippleEffect
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        className={bgClassName}
        pulse={pulse}
        pulseTarget={pulseTarget}
        pulseInterval={pulseInterval}
      />

      {children ? children : <SiteIcon size={250} />}
    </div>
  );
}
