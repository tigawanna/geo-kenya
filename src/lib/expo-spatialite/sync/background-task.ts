import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { pushAllEvents } from "./push_events";
import { logger } from "@/utils/logger";

export const SYNC_EVENTS_BACKGROUND_TASK_IDENTIFIER = "push-events-background-task" as const;

const MINIMUM_INTERVAL = 15;

export async function initializePushEventsBackgroundTask(innerMountedpromise: Promise<void>) {
  TaskManager.defineTask(SYNC_EVENTS_BACKGROUND_TASK_IDENTIFIER, async () => {
    await innerMountedpromise;
    logger.log("background push events task started");
    await pushAllEvents();
    logger.log("background pish events task finished");
  });
  if (!(await TaskManager.isTaskDefined(SYNC_EVENTS_BACKGROUND_TASK_IDENTIFIER))) {
    await BackgroundTask.registerTaskAsync(SYNC_EVENTS_BACKGROUND_TASK_IDENTIFIER, {
      minimumInterval: MINIMUM_INTERVAL,
    });
  }
}
