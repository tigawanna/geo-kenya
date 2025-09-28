import { render } from "../__test-utils_/root_provider";
import { screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native";
import HomeScreen from "@/app/(tabs)/index";
import { QueryClientWrapper } from "../__test-utils_/QueryClientWrapper";
import * as Location from "expo-location";
import { knownLocations } from "../__test-utils_/mock_locations";
import { KenyaWardsSelect } from "@/lib/drizzle/schema";

describe("<HomeScreen />", () => {
  test("homescreen in naorobi ward", async () => {
    const ward = knownLocations.find((l) => l.name === "Nairobi CBD")!;
    const [lat,lng] = ward.coordinates
    render(
      <QueryClientWrapper
        qcFn={(qc) => {
          qc.setQueryData<Location.LocationObject>(["device-location"], (old) => {
            return {
              mocked: true,
              timestamp: 123,
              coords: {
                latitude: lat,
                longitude: lng,
                accuracy: 5,
                altitude: 0,
                altitudeAccuracy: 0,
                heading: 0,
                speed: 0,
              },
            };
          });          
          qc.setQueryData<KenyaWardsSelect>(["current-ward",lat,lng], (old) => {
            return {
              result:{...ward.expected },
              error: null,
            } as any
          });
        }}>
        <HomeScreen />
      </QueryClientWrapper>
    );
  //  await waitForElementToBeRemoved(() => screen.getByTestId("current-location-loading"));
    await waitFor(() => {
      expect(screen.getByTestId("single-ward-card")).toBeTruthy();
    });
    expect(screen.getByTestId("single-ward-card-ward-name")).toBeTruthy();
    // expect(screen.getByText("Nairobi")).toBeTruthy();
    
  });
});
