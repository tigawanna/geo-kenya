import { MainLoader } from "@/components/wrappers/MainLoader";
import { AppConfig } from "@/utils/system";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <Suspense fallback={<MainLoader />}>
      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{AppConfig.name} hub</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">
            Manage sync events from the mobile app. Verify submissions before they propagate to
            other devices.
          </p>
        </div>
        <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
          <p className="text-sm text-base-content/70">
            The sync API accepts mobile pushes at{" "}
            <code className="text-xs">POST /api/sync/events</code> and serves verified events at{" "}
            <code className="text-xs">GET /api/sync/events</code>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/sync" className="btn btn-sm btn-primary">
              Open sync status
            </Link>
            <Link to="/admin/events" className="btn btn-outline btn-sm">
              Review events
            </Link>
            <Link to="/privacy" className="btn btn-ghost btn-sm">
              Privacy policy
            </Link>
          </div>
        </div>
      </section>
    </Suspense>
  );
}
