import { CurrentLocation } from "@/components/locations/CurrentLocation";
import { initializePushEventsBackgroundTask } from "@/lib/expo-spatialite/sync/background-task";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as TaskManager from "expo-task-manager";
import { useEffect } from "react";
let resolver: (() => void) | null;
let initilializerPromise = new Promise<void>((resolve) => {
  resolver = resolve;
});
initializePushEventsBackgroundTask(initilializerPromise);
export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
    useEffect(() => {
      resolver?.();
      TaskManager.getRegisteredTasksAsync().then((tasks) => {
        console.log("tasks", tasks);
      });

    }, []);
  return (
    <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: top }}>
      <CurrentLocation />
    </Surface>
  );
}
