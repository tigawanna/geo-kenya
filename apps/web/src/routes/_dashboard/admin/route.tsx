import { isAdminUser } from "@/data-access-layer/auth/viewer";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/admin/route")({
  beforeLoad: ({ context }) => {
    if (!isAdminUser(context.viewer?.user)) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
