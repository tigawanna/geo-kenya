import { FlagMark } from "@/components/ui/flag-accents";
import { isAdminUser, useViewer } from "@/data-access-layer/auth/viewer";
import { AppConfig } from "@/utils/system";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { viewer } = useViewer();
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <HubCard
          eyebrow="Account"
          title="Profile & data"
          description="See your profile, remove your waitlist email, and withdraw pending contributions."
          to="/account"
          cta="Open account"
        />
        <HubCard
          eyebrow="Sync"
          title="Sync status"
          description="Check verified events flowing through the sync API from mobile devices."
          to="/sync"
          cta="Open sync"
        />
        {isAdminUser(user) ? (
          <HubCard
            eyebrow="Admin"
            title="Review events"
            description="Verify pending community submissions before they reach other devices."
            to="/admin/events"
            cta="Review events"
          />
        ) : (
          <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
            <p className="font-mono text-xs text-base-content/60">Privacy</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">Policies</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Read how GeoKenya handles waitlist data, sync, and on-device storage.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/privacy"
                className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
              >
                <span>Privacy</span>
                <FlagMark className="h-4 w-4" />
              </Link>
              <Link
                to="/terms"
                className="rounded-md border border-flag-red/45 px-4 py-2 text-sm text-base-content transition-colors hover:bg-flag-red-soft"
              >
                Terms
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
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
      <p className="font-mono text-xs text-base-content/60">{eyebrow}</p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-base-content/70">{description}</p>
      <div className="mt-4">
        <Link
          to={to}
          className="inline-flex items-center gap-2 rounded-md bg-flag-green-solid px-4 py-2 text-sm font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90"
        >
          <span>{cta}</span>
          <FlagMark className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
