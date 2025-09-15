import { ComponentProps } from "react";
import { useTheme } from "react-native-paper";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export function AppLogoSvg(props:ComponentProps<typeof Svg>) {
  const {colors} = useTheme()
  return (
    <Svg
      viewBox="0 0 512 512"
      // xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={colors.primary}
      strokeWidth={2}
      width={100}
      height={100}
      {...props}>
      <Defs>
        <ClipPath id="a">
          <Path d="M410.7 119.7v182.1l27.4 25.9-105.9 154.6-73.9-41.8-5.4-39.7L74.66 296.4l36.64-29L62.47 253l50.33-78.4-.8-61.8-47.25-60.96 38.15-19.05 99-3.05S307.1 83.8 310.1 83.09c3.1-.81 91.5-36.58 91.5-36.58l47.9 23.61z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)" stroke={colors.primary} strokeWidth={1} opacity={0.6}>
        <Path d="M0 0v512M20 0v512M40 0v512M60 0v512M80 0v512M100 0v512M120 0v512M140 0v512M160 0v512M180 0v512M200 0v512M220 0v512M240 0v512M260 0v512M280 0v512M300 0v512M320 0v512M340 0v512M360 0v512M380 0v512M400 0v512M420 0v512M440 0v512M460 0v512M480 0v512M500 0v512M0 0h512M0 20h512M0 40h512M0 60h512M0 80h512M0 100h512M0 120h512M0 140h512M0 160h512M0 180h512M0 200h512M0 220h512M0 240h512M0 260h512M0 280h512M0 300h512M0 320h512M0 340h512M0 360h512M0 380h512M0 400h512M0 420h512M0 440h512M0 460h512M0 480h512M0 500h512" />
      </G>
      <Path d="M410.7 119.7v182.1l27.4 25.9-105.9 154.6-73.9-41.8-5.4-39.7L74.66 296.4l36.64-29L62.47 253l50.33-78.4-.8-61.8-47.25-60.96 38.15-19.05 99-3.05S307.1 83.8 310.1 83.09c3.1-.81 91.5-36.58 91.5-36.58l47.9 23.61z" />
    </Svg>
  );
}
