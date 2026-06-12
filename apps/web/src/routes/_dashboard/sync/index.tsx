import { SyncStatusPanel } from "@/features/sync/components/SyncStatusPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/sync/")({
  component: SyncStatusPanel,
});
