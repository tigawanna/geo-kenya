import { FlagMark } from "@/components/ui/flag-accents";
import { Link } from "@tanstack/react-router";
import { RouteStatusShell } from "./RouteStatusShell";

export function RouterNotFoundComponent() {
  return (
    <RouteStatusShell
      data-test="router-not-found"
      eyebrow="Off the map"
      title={
        <>
          This page isn’t in any <span className="text-flag-red">ward</span>
        </>
      }
      description="The route you followed doesn’t exist — or it moved. Head home and pick a clearer path."
      actions={
        <Link
          to="/"
          data-test="router-not-found-home"
          className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold text-flag-green-content shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-opacity hover:opacity-90"
        >
          Back home
          <FlagMark className="ring-white/20" />
        </Link>
      }
    />
  );
}
