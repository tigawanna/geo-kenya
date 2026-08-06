import { AdminReleasesPanel } from "@/features/releases/components/AdminReleasesPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/admin/releases/")({
  component: AdminReleasesPanel,
});
