import { MainLoader } from "@/components/wrappers/MainLoader";
import { viewerMiddleware } from "@/data-access-layer/auth/viewer";
import { RouterNotFoundComponent } from "@/lib/tanstack/router/RouterNotFoundComponent";
import { RouterPendingComponent } from "@/lib/tanstack/router/RouterPendingComponent";
import { RouterErrorComponent } from "@/lib/tanstack/router/routerErrorComponent";
import { AppConfig } from "@/utils/system";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { DashboardLayout } from "./-components/dashboard-sidebar/DashboardLayout";
import {
  dashboard_account_routes,
  dashboard_admin_routes,
  getDashboardPrimaryRoutes,
} from "./-components/dashboard-sidebar/dashboard_routes";

export const Route = createFileRoute("/_dashboard")({
  pendingComponent: () => <RouterPendingComponent />,
  notFoundComponent: () => <RouterNotFoundComponent />,
  errorComponent: ({ error }) => <RouterErrorComponent error={error} />,
  server: {
    middleware: [viewerMiddleware],
  },
  component: DashboardShell,
  beforeLoad: ({ context }) => {
    if (!context.viewer?.user) {
      throw redirect({ to: "/auth", search: { returnTo: "/dashboard" } });
    }
  },
  head: () => ({
    meta: [
      {
        title: `${AppConfig.name} | Dashboard`,
      },
    ],
  }),
});

function DashboardShell() {
  return (
    <Suspense fallback={<MainLoader />}>
      <DashboardLayout
        sidebarRoutes={getDashboardPrimaryRoutes()}
        sidebarLabel="Menu"
        accountRoutes={dashboard_account_routes}
        accountLabel="Account"
        adminRoutes={dashboard_admin_routes}
        adminLabel="Administration"
      />
    </Suspense>
  );
}
