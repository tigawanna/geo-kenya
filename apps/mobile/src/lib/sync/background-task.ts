import { db } from "@/lib/drizzle/client";
import { pullAndReplayEvents } from "@/lib/sync/pull-pocketbase-updates";
import { pullSyncEvents } from "@/lib/sync/pull-sync-events";
import { pushAllEvents } from "@/lib/sync/push-events";
import { getSyncApiBaseUrl } from "@/services/sync/sync.api";
import { logger } from "@/utils/logger";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

export const PUSH_EVENTS_BACKGROUND_TASK_IDENTIFIER = "push-events-background-task" as const;

const MINIMUM_INTERVAL = 15;

export async function initializePushEventsBackgroundTask(innerMountedpromise: Promise<void>) {
  TaskManager.defineTask(PUSH_EVENTS_BACKGROUND_TASK_IDENTIFIER, async () => {
    await innerMountedpromise;
    logger.log("background push events task started");
    await pushAllEvents();
    logger.log("background push events task finished");
  });
  const istaskRegired = await TaskManager.isTaskRegisteredAsync(
    PUSH_EVENTS_BACKGROUND_TASK_IDENTIFIER,
  );
  if (!istaskRegired) {
    await BackgroundTask.registerTaskAsync(PUSH_EVENTS_BACKGROUND_TASK_IDENTIFIER, {
      minimumInterval: MINIMUM_INTERVAL,
    });
  }
}

export const PULL_EVENTS_BACKGROUND_TASK_IDENTIFIER = "pull-events-background-task" as const;

async function pullRemoteUpdates() {
  if (getSyncApiBaseUrl()) {
    await pullSyncEvents(db);
    return;
  }
  if (process.env.EXPO_PUBLIC_SYNC_URL) {
    await pullAndReplayEvents();
  }
}

export async function initializePullEventsBackgroundTask(innerMountedpromise: Promise<void>) {
  TaskManager.defineTask(PULL_EVENTS_BACKGROUND_TASK_IDENTIFIER, async () => {
    await innerMountedpromise;
    logger.log("background pull events task started");
    await pullRemoteUpdates();
    logger.log("background pull events task finished");
  });
  const istaskRegired = await TaskManager.isTaskRegisteredAsync(
    PULL_EVENTS_BACKGROUND_TASK_IDENTIFIER,
  );
  if (!istaskRegired) {
    await BackgroundTask.registerTaskAsync(PULL_EVENTS_BACKGROUND_TASK_IDENTIFIER, {
      minimumInterval: MINIMUM_INTERVAL,
    });
  }
}
