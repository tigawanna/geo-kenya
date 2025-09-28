import { render } from "../__test-utils_/root_provider";
import { screen } from "@testing-library/react-native";
import HomeScreen from "@/app/(tabs)/index";
import { QueryClientWrapper } from "../__test-utils_/QueryClientWrapper";
import * as Location from "expo-location";
import { knownLocations } from "../__test-utils_/mock_locations";


describe("<HomeScreen />", () => {
  test("homescreen in naorobi ward", () => {
    const ward = knownLocations.find((l) => l.name === "Nairobi CBD")!;
    render(
      <QueryClientWrapper qcFn={(qc)=>{
        qc.setQueryData<Location.LocationObject>(["device-location"],(old)=>{
          return {
            mocked: true,
            timestamp: 123,
            coords: {
              latitude:ward.coordinates[0],
              longitude: ward.coordinates[1],
              accuracy: 5,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              speed: 0,
            },
          }
        })
      }}>
        <HomeScreen />
      </QueryClientWrapper>
    );
    expect(screen.getByTestId("current-location-card")).toBeTruthy();
    expect(screen.getByText("Nairobi")).toBeTruthy();
  });
});
