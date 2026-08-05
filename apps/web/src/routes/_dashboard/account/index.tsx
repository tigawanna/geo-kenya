import { isAdminUser, useViewer } from "@/data-access-layer/auth/viewer";
import { fetchMySyncEvents, withdrawMySyncEvent } from "@/services/sync/sync.api";
import { fetchMyWaitlist, removeMyWaitlist } from "@/services/waitlist/waitlist.api";
import { formatDate } from "@/utils/date";
import { AppConfig } from "@/utils/system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/account/")({
  component: AccountPage,
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Account` }],
  }),
});

function AccountPage() {
  const { viewer } = useViewer();
  const user = viewer.user;
  const qc = useQueryClient();

  const waitlistQuery = useQuery({
    queryKey: ["waitlist", "me"],
    queryFn: fetchMyWaitlist,
  });

  const contributionsQuery = useQuery({
    queryKey: ["sync", "mine"],
    queryFn: () => fetchMySyncEvents(50),
  });

  const removeWaitlistMutation = useMutation({
    mutationFn: removeMyWaitlist,
    onSuccess: async () => {
      toast.success("Removed from waitlist");
      await qc.invalidateQueries({ queryKey: ["waitlist", "me"] });
    },
    onError: (error) => {
      toast.error("Could not remove waitlist email", {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: withdrawMySyncEvent,
    onSuccess: async () => {
      toast.success("Contribution withdrawn");
      await qc.invalidateQueries({ queryKey: ["sync", "mine"] });
    },
    onError: (error) => {
      toast.error("Could not withdraw contribution", {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  if (!user) {
    return null;
  }

  const waitlistEntry = waitlistQuery.data?.entry ?? null;
  const contributions = contributionsQuery.data?.events ?? [];
  const pendingCount = contributions.filter((event) => !event.verified).length;
  const verifiedCount = contributions.filter((event) => event.verified).length;

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-2 max-w-2xl text-base-content/70">
          Your profile, waitlist status, and synced contributions. Pending contributions can be
          withdrawn before review; verified ones stay in the shared dataset.
        </p>
      </div>

      <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">
              Profile
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">{user.name}</h2>
            <p className="mt-1 text-sm text-base-content/70">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isAdminUser(user) ? (
              <span className="rounded-md bg-flag-green-solid px-2.5 py-1 text-xs font-medium text-flag-green-content">
                Admin
              </span>
            ) : (
              <span className="rounded-md bg-base-content/8 px-2.5 py-1 text-xs font-medium text-base-content/70">
                Member
              </span>
            )}
          </div>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-base-content/60">Member since</dt>
            <dd className="mt-1 text-sm">{formatDate(user.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-base-content/60">Email verified</dt>
            <dd className="mt-1 text-sm">{user.emailVerified ? "Yes" : "Not yet"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">
              Waitlist
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">Testing waitlist</h2>
            <p className="mt-1 max-w-xl text-sm text-base-content/70">
              If you joined with this account email, you can remove it here anytime.
            </p>
          </div>
          {waitlistEntry ? (
            <button
              type="button"
              className="btn border-flag-red/45 btn-outline btn-sm hover:bg-flag-red-soft"
              disabled={removeWaitlistMutation.isPending}
              onClick={() => {
                if (
                  window.confirm(
                    `Remove ${waitlistEntry.email} from the GeoKenya testing waitlist?`,
                  )
                ) {
                  removeWaitlistMutation.mutate();
                }
              }}
            >
              {removeWaitlistMutation.isPending ? "Removing…" : "Remove from waitlist"}
            </button>
          ) : null}
        </div>

        {waitlistQuery.isLoading ? (
          <div className="mt-6 h-16 skeleton rounded-xl" />
        ) : waitlistQuery.isError ? (
          <div className="mt-6 alert alert-error">
            <span>
              {waitlistQuery.error instanceof Error
                ? waitlistQuery.error.message
                : "Failed to load waitlist"}
            </span>
          </div>
        ) : waitlistEntry ? (
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-base-content/60">Email</dt>
              <dd className="mt-1 text-sm">{waitlistEntry.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-base-content/60">Joined</dt>
              <dd className="mt-1 text-sm">{formatDate(waitlistEntry.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-base-content/60">Source</dt>
              <dd className="mt-1 text-sm">{waitlistEntry.source}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-6 text-sm text-base-content/60">
            No waitlist entry for {user.email}. Join from the{" "}
            <a href="/#waitlist" className="text-flag-green hover:underline">
              landing page
            </a>{" "}
            if you want Android testing invites.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">
              Contributions
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">Synced events</h2>
            <p className="mt-1 max-w-xl text-sm text-base-content/70">
              Events stamped to your account when pushed while signed in. Withdraw pending items
              before review; verified ones are already part of shared data.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="rounded-md bg-base-content/8 px-2.5 py-1">Pending {pendingCount}</span>
            <span className="rounded-md bg-flag-green-soft px-2.5 py-1 text-flag-green">
              Merged {verifiedCount}
            </span>
          </div>
        </div>

        {contributionsQuery.isLoading ? (
          <div className="mt-6 h-24 skeleton rounded-xl" />
        ) : contributionsQuery.isError ? (
          <div className="mt-6 alert alert-error">
            <span>
              {contributionsQuery.error instanceof Error
                ? contributionsQuery.error.message
                : "Failed to load contributions"}
            </span>
          </div>
        ) : contributions.length === 0 ? (
          <p className="mt-6 text-sm text-base-content/60">
            No account-linked contributions yet. Device-only sync pushes without a signed-in session
            will not appear here.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-base-content/10">
            {contributions.map((event) => (
              <li
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {event.action} · {event.tableName}
                  </p>
                  <p className="mt-0.5 text-xs text-base-content/60">
                    {formatDate(event.createdAt)} · row {event.rowId.slice(0, 8)}…
                  </p>
                </div>
                {event.verified ? (
                  <span className="text-xs font-medium text-flag-green">
                    Merged into shared data
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn text-flag-red btn-ghost btn-xs"
                    disabled={withdrawMutation.isPending}
                    onClick={() => {
                      if (window.confirm("Withdraw this pending contribution?")) {
                        withdrawMutation.mutate(event.id);
                      }
                    }}
                  >
                    Withdraw
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
        <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">
          Data & privacy
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">How deletion works</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-base-content/70">
          <li>
            On-device app data is cleared by uninstalling GeoKenya or clearing app storage on your
            phone.
          </li>
          <li>Waitlist email can be removed above when it matches this account.</li>
          <li>
            Pending contributions can be withdrawn above. Verified contributions stay in the shared
            geographic dataset.
          </li>
          <li>
            To delete this web account entirely, email{" "}
            <a href={AppConfig.links.mail} className="text-flag-green hover:underline">
              denniskinuthiawaweru@gmail.com
            </a>{" "}
            from the same address.
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/privacy" className="btn btn-ghost btn-sm">
            Privacy
          </Link>
          <Link to="/terms" className="btn btn-ghost btn-sm">
            Terms
          </Link>
        </div>
      </div>
    </section>
  );
}
