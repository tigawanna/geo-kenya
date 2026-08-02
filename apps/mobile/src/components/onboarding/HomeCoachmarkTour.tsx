import { createHomeTour } from "@/lib/coachmark/home-tour";
import { useSettingsStore } from "@/store/settings-store";
import { useCoachmark } from "@edwardloopez/react-native-coachmark";
import { useEffect, useRef } from "react";

/**
 * Starts the home coachmark tour once on first launch, or when Settings requests a replay.
 */
export function HomeCoachmarkTour() {
  const { start, isActive } = useCoachmark();
  const homeTourReplayRequested = useSettingsStore((s) => s.homeTourReplayRequested);
  const clearHomeTourReplay = useSettingsStore((s) => s.clearHomeTourReplay);
  const startedRef = useRef(false);

  useEffect(() => {
    if (isActive) return;

    if (homeTourReplayRequested) {
      clearHomeTourReplay();
      start(createHomeTour({ showOnce: false, delay: 450 }));
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;
    start(createHomeTour({ showOnce: true, delay: 900 }));
  }, [clearHomeTourReplay, homeTourReplayRequested, isActive, start]);

  return null;
}
