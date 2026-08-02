import { HomeTourTooltip } from "@/components/onboarding/HomeTourTooltip";
import { createTour } from "@edwardloopez/react-native-coachmark";

export const HOME_TOUR_KEY = "home-tour";
export const HOME_TOUR_STORAGE_KEY = `coachmark:${HOME_TOUR_KEY}`;

export const HOME_TOUR_ANCHORS = {
  coords: "home-coords",
  map: "home-map",
  basemap: "home-basemap",
  explore: "home-explore-tab",
} as const;

export function createHomeTour(options?: { showOnce?: boolean; delay?: number }) {
  return createTour(
    HOME_TOUR_KEY,
    [
      {
        id: HOME_TOUR_ANCHORS.coords,
        title: "Find a place",
        description:
          "Paste or type latitude and longitude here to look up any location in Kenya.",
        placement: "bottom",
        shape: "rect",
        radius: 12,
        padding: 8,
      },
      {
        id: HOME_TOUR_ANCHORS.map,
        title: "Your ward on the map",
        description:
          "Tap the map to explore nearby wards. Your current area is highlighted automatically.",
        placement: "top",
        shape: "rect",
        radius: 8,
        padding: 4,
      },
      {
        id: HOME_TOUR_ANCHORS.basemap,
        title: "Map style",
        description: "Switch between map styles when you want more detail or a clearer view.",
        placement: "left",
        shape: "circle",
        padding: 10,
      },
      {
        id: HOME_TOUR_ANCHORS.explore,
        title: "Browse all wards",
        description: "Search Kenya’s wards by name, county, or constituency.",
        placement: "top",
        shape: "circle",
        padding: 12,
      },
    ],
    {
      showOnce: options?.showOnce ?? true,
      delay: options?.delay ?? 800,
      renderTooltip: (props) => <HomeTourTooltip {...props} />,
    }
  );
}
