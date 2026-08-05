import { syncStatusQueryOptions } from "@/data-access-layer/sync/sync.functions";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";

export function SyncStatusPanel() {
  const { data, isLoading, error, refetch, isFetching } = useQuery(syncStatusQueryOptions);

  const unverifiedCount = data?.events.filter((event) => !event.verified).length ?? 0;
  const verifiedCount = data?.events.filter((event) => event.verified).length ?? 0;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sync status</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">
            Monitor verified events on the sync server. Mobile devices push events via{" "}
            <code className="text-xs">POST /api/sync/events</code>.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="h-32 w-full skeleton rounded-2xl" />
      ) : error ? (
        <div className="alert alert-error">
          <span>{error instanceof Error ? error.message : "Failed to load sync status"}</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
            <p className="font-mono text-xs text-base-content/60">Total events</p>
            <p className="mt-2 text-3xl font-semibold">{data?.totalCount ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
            <p className="font-mono text-xs text-base-content/60">Verified (sample)</p>
            <p className="mt-2 text-3xl font-semibold">{verifiedCount}</p>
          </div>
          <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
            <p className="font-mono text-xs text-base-content/60">Pending (sample)</p>
            <p className="mt-2 text-3xl font-semibold">{unverifiedCount}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
        <p className="text-sm text-base-content/70">
          Admins can review and verify pending events before they propagate to other devices.
        </p>
        <div className="mt-4">
          <Link to="/admin/events" className="btn btn-sm btn-primary">
            Review events
          </Link>
        </div>
      </div>
    </section>
  );
}
