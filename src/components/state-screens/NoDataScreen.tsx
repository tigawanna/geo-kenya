import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";
import { RestingIcon } from "@/components/shared/svg/Resting";

export function NoDataScreen() {
  const { colors } = useTheme();
  const fadeValue = useSharedValue(0.7);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    // Gentle breathing animation for the icon
    scaleValue.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );

    // Subtle fade animation for text
    fadeValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0.7, { duration: 3000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  return (
    <Surface style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <RestingIcon />
        </Animated.View>
        
        <View style={styles.textContainer}>
          <Text 
            variant="headlineSmall" 
            style={[styles.titleText, { color: colors.onSurface }]}
          >
            Nothing on my end
          </Text>
          
          <Animated.View style={animatedTextStyle}>
            <Text 
              variant="bodyLarge" 
              style={[styles.subtitleText, { color: colors.onSurfaceVariant }]}
            >
              No data available at the moment
            </Text>
          </Animated.View>
          
          <Text 
            variant="bodyMedium" 
            style={[styles.hintText, { color: colors.outline }]}
          >
            Try refreshing or check back later
          </Text>
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
    padding: 24,
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  iconContainer: {
    marginBottom: 32,
    padding: 16,
  },
  textContainer: {
    alignItems: "center",
    gap: 12,
  },
  titleText: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    textAlign: "center",
    lineHeight: 24,
  },
  hintText: {
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});
