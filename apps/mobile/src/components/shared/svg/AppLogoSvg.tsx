import { KENYA_GRID_PATH, KENYA_OUTLINE_PATH } from "@/components/shared/svg/kenya-outline-paths";
import { ComponentProps } from "react";
import { useTheme } from "react-native-paper";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export function AppLogoSvg(props: ComponentProps<typeof Svg>) {
  const { colors } = useTheme();

  return (
    <Svg viewBox="0 0 512 512" fill="none" stroke={colors.primary} strokeWidth={2} width={100} height={100} {...props}>
      <Defs>
        <ClipPath id="a">
          <Path d={KENYA_OUTLINE_PATH} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)" stroke={colors.primary} strokeWidth={1} opacity={0.6}>
        <Path d={KENYA_GRID_PATH} />
      </G>
      <Path d={KENYA_OUTLINE_PATH} />
    </Svg>
  );
}
