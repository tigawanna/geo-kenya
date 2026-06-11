import { AdminEventReviewPanel } from "@/features/sync/components/AdminEventReviewPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/admin/events/")({
  component: AdminEventReviewPanel,
});
