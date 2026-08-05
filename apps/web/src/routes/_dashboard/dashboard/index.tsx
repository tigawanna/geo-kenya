import { FlagMark } from "@/components/ui/flag-accents";
import { useViewer } from "@/data-access-layer/auth/viewer";
import { waitListQueryOptions } from "@/data-access-layer/dashboard/waitlist";
import { AppConfig } from "@/utils/system";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { viewer } = useViewer();
  const { data: waitlist } = useSuspenseQuery(waitListQueryOptions);
  const user = viewer.user;
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] tracking-[0.14em] text-flag-green uppercase">Signed in</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Welcome, {firstName}</h1>
        <p className="mt-2 max-w-2xl text-base-content/70">
          {user?.email
            ? `Manage your ${AppConfig.name} account, waitlist, and contributions from here.`
            : `Manage your ${AppConfig.name} account from here.`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <WaitlistCard result={waitlist} />
        <HubCard
          eyebrow="Account"
          title="Profile & data"
          description="Review your email, waitlist status, and synced contributions."
          to="/account"
          cta="Open account"
        />
        <HubCard
          eyebrow="Sync"
          title="Sync status"
          description="Check how contribution sync is running for your account."
          to="/sync"
          cta="View sync"
        />
      </div>
    </section>
  );
}

type WaitlistEntry = {
  id: string;
  email: string;
  createdAt: string;
  userAgent: string | null;
  source: string;
};

type WaitlistResult =
  | { data: WaitlistEntry | undefined; error: null }
  | { data: null; error: { message: string } };

function WaitlistCard({ result }: { result: WaitlistResult }) {
  if (result.error) {
    return (
      <div className="rounded-2xl border border-flag-red/30 bg-base-100/70 p-6 md:col-span-2">
        <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">Waitlist</p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">Couldn’t load waitlist</h2>
        <p className="mt-2 text-sm text-base-content/70">{result.error.message}</p>
        <div className="mt-4">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            <span>Try in Account</span>
            <FlagMark className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const entry = result.data;

  if (!entry) {
    return (
      <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6 md:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">
              Waitlist
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">Not on the waitlist</h2>
            <p className="mt-2 max-w-xl text-sm text-base-content/70">
              Join from the landing page to get Android testing invites for {AppConfig.name}.
            </p>
          </div>
          <span className="rounded-md bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/60">
            Not joined
          </span>
        </div>
        <div className="mt-4">
          <a
            href="/#waitlist"
            className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            <span>Join waitlist</span>
            <FlagMark className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6 md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">Waitlist</p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">You’re on the list</h2>
          <p className="mt-2 max-w-xl text-sm text-base-content/70">
            We’ll use this email for Android testing invites. Manage it anytime from Account.
          </p>
        </div>
        <span className="rounded-md bg-flag-green-soft px-2.5 py-1 text-xs font-medium text-flag-green">
          Joined
        </span>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-base-content/60">Email</dt>
          <dd className="mt-1 truncate text-sm font-medium">{entry.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-base-content/60">Joined</dt>
          <dd className="mt-1 text-sm font-medium">{formatDate(entry.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-xs text-base-content/60">Source</dt>
          <dd className="mt-1 text-sm font-medium capitalize">{entry.source}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90 active:scale-[0.97]"
        >
          <span>Manage waitlist</span>
          <FlagMark className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function HubCard({
  eyebrow,
  title,
  description,
  to,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  to: "/account" | "/sync" | "/admin/events";
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
      <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">{eyebrow}</p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-base-content/70">{description}</p>
      <div className="mt-4">
        <Link
          to={to}
          className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90 active:scale-[0.97]"
        >
          <span>{cta}</span>
          <FlagMark className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function formatDate(value: string | Date | number | null | undefined): string {
  if (value == null) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
