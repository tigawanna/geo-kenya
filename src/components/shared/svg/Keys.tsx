import * as React from "react";
import { useTheme } from "react-native-paper";
import Svg, { Path } from "react-native-svg";

export function KeysIcon(props: React.ComponentProps<typeof Svg>) {
    const {colors} = useTheme();
  return (
    <Svg
      fill={colors.primary}
      //   xmlns="http://www.w3.org/2000/svg"
    //   xmlSpace="preserve"
      width="256px"
      height="256px"
      viewBox="0 0 47 47"
      {...props}>
      <Path d="M23.5 0C10.522 0 0 10.522 0 23.5 0 36.479 10.522 47 23.5 47 36.479 47 47 36.479 47 23.5 47 10.522 36.479 0 23.5 0zm6.57 34.686c0 2.53-2.941 4.58-6.573 4.58-3.631 0-6.577-2.05-6.577-4.58 0-.494 3.648-14.979 3.648-14.979-2.024-1.06-3.418-3.161-3.418-5.609a6.354 6.354 0 016.361-6.362 6.351 6.351 0 016.35 6.362c0 2.448-1.391 4.55-3.416 5.609 0 0 3.598 14.455 3.611 14.88l.022.099h-.008z" />
    </Svg>
  );
}
