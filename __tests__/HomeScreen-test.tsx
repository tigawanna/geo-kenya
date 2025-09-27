import { render } from "../__test-utils_/root_provider";

import HomeScreen from "@/app/(tabs)/index";

describe("<HomeScreen />", () => {
  test("Text renders correctly on HomeScreen", () => {
    const { getByText } = render(<HomeScreen />);

    getByText("Welcome!");
  });
});
