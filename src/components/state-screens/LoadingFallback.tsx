import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { LoadingIndicatorDots } from "./LoadingIndicatorDots";
import { AppLogoSvg } from "@/components/shared/svg/AppLogoSvg";
interface LoadingFallbackProps {
  initialScreen?: boolean;
}
export function LoadingFallback({ initialScreen }: LoadingFallbackProps) {
  const { colors } = useTheme();
  const pulseValue = useSharedValue(1);
  const fadeValue = useSharedValue(0.6);

  useEffect(() => {
    // Gentle pulse animation for the logo
    pulseValue.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 1500 }), withTiming(1, { duration: 1500 })),
      -1,
      false
    );

    // Fade animation for loading text
    fadeValue.value = withRepeat(
      withSequence(withTiming(1, { duration: 2000 }), withTiming(0.6, { duration: 2000 })),
      -1,
      false
    );
  }, [fadeValue, pulseValue]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  return (
    <Surface style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
          <AppLogoSvg />
        </Animated.View>

        <View style={styles.loadingContainer}>
          <LoadingIndicatorDots />

          {initialScreen && (
            <Animated.View style={animatedTextStyle}>
              <Text
                variant="bodyMedium"
                style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
                Getting things ready...
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // padding: 24,
  },
  content: {
    // alignItems: "center",
  },
  logoContainer: {
    marginBottom: 32,
    padding: 16,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 20,
  },
  loadingText: {
    textAlign: "center",
    fontStyle: "italic",
  },
});
