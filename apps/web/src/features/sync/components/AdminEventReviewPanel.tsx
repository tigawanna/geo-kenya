import {
  adminSyncEventsQueryOptions,
  parseSyncEventPayload,
  verifySyncEvent,
} from "@/data-access-layer/sync/sync.functions";
import type { SyncEventRecord } from "@/types/sync";
import { formatDate } from "@/utils/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AdminEventReviewPanel() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery(adminSyncEventsQueryOptions(page, 50));

  const verifyMutation = useMutation({
    mutationFn: (eventId: string) => verifySyncEvent({ data: { eventId } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sync"] });
    },
  });

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Review sync events</h1>
        <p className="mt-2 max-w-2xl text-base-content/70">
          Verify mobile-submitted events before they are included in pull responses for other
          devices.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 w-full skeleton rounded-2xl" />
      ) : error ? (
        <div className="alert alert-error">
          <span>{error instanceof Error ? error.message : "Failed to load events"}</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-base-content/10">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Device</th>
                  <th>Table</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(data?.events ?? []).map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    isVerifying={verifyMutation.isPending && verifyMutation.variables === event.id}
                    onVerify={() => verifyMutation.mutate(event.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-base-content/60">
              Page {data?.page ?? page} of {Math.max(data?.totalPages ?? 1, 1)} ·{" "}
              {data?.totalCount ?? 0} total
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={!data?.hasMore}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function EventRow({
  event,
  isVerifying,
  onVerify,
}: {
  event: SyncEventRecord;
  isVerifying: boolean;
  onVerify: () => void;
}) {
  const payload = parseSyncEventPayload(event);

  return (
    <tr>
      <td className="font-mono text-xs whitespace-nowrap">
        {formatDate(event.createdAt, "datetime")}
      </td>
      <td className="max-w-32 truncate font-mono text-xs">{event.deviceId}</td>
      <td className="font-mono text-xs">{event.tableName}</td>
      <td className="font-mono text-xs">{event.action}</td>
      <td>
        {event.verified ? (
          <span className="badge badge-sm badge-success">Verified</span>
        ) : (
          <span className="badge badge-sm badge-warning">Pending</span>
        )}
      </td>
      <td className="text-right">
        {!event.verified ? (
          <button
            type="button"
            className="btn btn-xs btn-primary"
            disabled={isVerifying}
            onClick={onVerify}
          >
            Verify
          </button>
        ) : (
          <details className="text-left">
            <summary className="cursor-pointer font-mono text-xs text-base-content/60">
              Payload
            </summary>
            <pre className="mt-2 max-w-md overflow-x-auto rounded bg-base-200 p-2 text-[10px]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </details>
        )}
      </td>
    </tr>
  );
}
