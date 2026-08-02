import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CoachmarkOverlay,
  CoachmarkProvider as BaseCoachmarkProvider,
  asyncStorage,
  type Plugin,
} from "@edwardloopez/react-native-coachmark";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useTheme } from "react-native-paper";
import { HOME_TOUR_STORAGE_KEY } from "./home-tour";

const storage = asyncStorage(AsyncStorage);

const markTourSeenPlugin: Plugin = {
  onFinish: (tour) => {
    // Library only persists on "completed"; also mark on skip so tips do not reappear.
    void storage.set(`coachmark:${tour.key}`, "true");
  },
};

export async function clearHomeTourSeen() {
  await AsyncStorage.removeItem(HOME_TOUR_STORAGE_KEY);
}

export function AppCoachmarkProvider({ children }: PropsWithChildren) {
  const theme = useTheme();

  const coachmarkTheme = useMemo(
    () => ({
      backdropColor: "#000000",
      backdropOpacity: 0.72,
      holeShadowOpacity: 0.35,
      tooltip: {
        maxWidth: 300,
        radius: 14,
        bg: theme.colors.elevation.level3,
        fg: theme.colors.onSurface,
        arrowSize: 10,
        padding: 14,
        buttonPrimaryBg: theme.colors.primary,
        buttonSecondaryBg: theme.colors.surfaceVariant,
      },
    }),
    [theme.colors]
  );

  return (
    <BaseCoachmarkProvider
      storage={storage}
      theme={coachmarkTheme}
      plugins={[markTourSeenPlugin]}>
      {children}
      <CoachmarkOverlay />
    </BaseCoachmarkProvider>
  );
}
