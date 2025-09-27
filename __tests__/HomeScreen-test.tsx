import { render } from "../__test-utils_/root_provider";
import { screen } from "@testing-library/react-native";
import HomeScreen from "@/app/(tabs)/index";

describe("<HomeScreen />", () => {
  test("Text renders correctly on HomeScreen", () => {
    render(<HomeScreen />);
    expect(screen.getByTestId("current-location-card")).toBeTruthy();
  });
});
