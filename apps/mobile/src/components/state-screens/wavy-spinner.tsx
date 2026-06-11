import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface WavySpinnerProps {
  barCount?: number;
  barWidth?: number;
  barHeight?: number;
}

function WavyBar({
  index,
  barWidth,
  barHeight,
  color,
}: {
  index: number;
  barWidth: number;
  barHeight: number;
  color: string;
}) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withDelay(
      index * 90,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 420, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, [index, phase]);

  const animatedStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(phase.value, [0, 1], [0.35, 1]);
    const opacity = interpolate(phase.value, [0, 1], [0.35, 1]);

    return {
      transform: [{ scaleY }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          width: barWidth,
          height: barHeight,
          borderRadius: barWidth / 2,
          backgroundColor: color,
          marginHorizontal: barWidth * 0.35,
        },
        animatedStyle,
      ]}
    />
  );
}

export function WavySpinner({ barCount = 5, barWidth = 4, barHeight = 22 }: WavySpinnerProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel="Loading">
      {Array.from({ length: barCount }, (_, index) => (
        <WavyBar
          key={index}
          index={index}
          barWidth={barWidth}
          barHeight={barHeight}
          color={colors.primary}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 28,
  },
  bar: {
    alignSelf: "center",
  },
});
