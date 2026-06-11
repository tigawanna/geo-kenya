import {
  KENYA_GRID_PATH,
  KENYA_OUTLINE_LENGTH,
  KENYA_OUTLINE_PATH,
} from "@/components/shared/svg/kenya-outline-paths";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface KenyaShapeSpinnerProps {
  size?: number;
}

export function KenyaShapeSpinner({ size = 250 }: KenyaShapeSpinnerProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  const traceProps = useAnimatedProps(() => ({
    strokeDashoffset: KENYA_OUTLINE_LENGTH * (1 - progress.value),
  }));

  const trailProps = useAnimatedProps(() => ({
    strokeDashoffset: KENYA_OUTLINE_LENGTH * (1 - progress.value) + KENYA_OUTLINE_LENGTH * 0.35,
    opacity: 0.35,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg viewBox="0 0 512 512" width={size} height={size} fill="none">
        <Defs>
          <ClipPath id="kenya-spinner-clip">
            <Path d={KENYA_OUTLINE_PATH} />
          </ClipPath>
        </Defs>

        <G clipPath="url(#kenya-spinner-clip)" stroke={colors.primary} strokeWidth={1} opacity={0.35}>
          <Path d={KENYA_GRID_PATH} />
        </G>

        <Path
          d={KENYA_OUTLINE_PATH}
          stroke={colors.primary}
          strokeWidth={2}
          fill="none"
          opacity={0.2}
        />

        <AnimatedPath
          d={KENYA_OUTLINE_PATH}
          stroke={colors.primary}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${KENYA_OUTLINE_LENGTH * 0.28} ${KENYA_OUTLINE_LENGTH}`}
          animatedProps={trailProps}
        />

        <AnimatedPath
          d={KENYA_OUTLINE_PATH}
          stroke={colors.primary}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${KENYA_OUTLINE_LENGTH * 0.14} ${KENYA_OUTLINE_LENGTH}`}
          animatedProps={traceProps}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
