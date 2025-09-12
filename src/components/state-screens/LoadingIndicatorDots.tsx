import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface LoadingIndicatorDotsProps {
  size?: number;
  dotCount?: number;
}

export function LoadingIndicatorDots({ size = 8, dotCount = 3 }: LoadingIndicatorDotsProps) {
  const { colors } = useTheme();
  
  // Create individual shared values for each dot
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  
  // Store them in an array but only use the needed ones
  const animatedValues = [dot1, dot2, dot3].slice(0, dotCount);

  // Create animated styles for each dot
  const animatedStyle1 = useAnimatedStyle(() => {
    const scale = interpolate(dot1.value, [0, 1], [0.5, 1.2]);
    const opacity = interpolate(dot1.value, [0, 1], [0.3, 1]);
    return { transform: [{ scale }], opacity };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    const scale = interpolate(dot2.value, [0, 1], [0.5, 1.2]);
    const opacity = interpolate(dot2.value, [0, 1], [0.3, 1]);
    return { transform: [{ scale }], opacity };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    const scale = interpolate(dot3.value, [0, 1], [0.5, 1.2]);
    const opacity = interpolate(dot3.value, [0, 1], [0.3, 1]);
    return { transform: [{ scale }], opacity };
  });

  const animatedStyles = [animatedStyle1, animatedStyle2, animatedStyle3].slice(0, dotCount);

  useEffect(() => {
    animatedValues.forEach((animatedValue, index) => {
      animatedValue.value = withDelay(
        index * 200,
        withRepeat(withTiming(1, { duration: 600 }), -1, true)
      );
    });
  }, [animatedValues]);

  return (
    <View style={styles.dotsContainer}>
      {animatedValues.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.primary,
            },
            animatedStyles[index],
          ]}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    marginHorizontal: 4,
  },
});
