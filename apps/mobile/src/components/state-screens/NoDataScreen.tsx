import { RestingIcon } from "@/components/shared/svg/Resting";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

interface NoDataScreenProps {
  listName?: string;
  message?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function NoDataScreen({ 
  listName = "data", 
  message = "No data available at the moment",
  hint = "Try refreshing or check back later",
  icon = <RestingIcon />
}: NoDataScreenProps) {
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
  }, [fadeValue, scaleValue]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  return (
    <View style={[styles.container]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          {icon}
        </Animated.View>
        
        <View style={styles.textContainer}>
          <Text 
            variant="headlineSmall" 
            style={[styles.titleText, { color: colors.onSurface }]}
          >
            No {listName} found
          </Text>
          
          <Animated.View style={animatedTextStyle}>
            <Text 
              variant="bodyLarge" 
              style={[styles.subtitleText, { color: colors.onSurfaceVariant }]}
            >
              {message}
            </Text>
          </Animated.View>
          
          <Text 
            variant="bodyMedium" 
            style={[styles.hintText, { color: colors.outline }]}
          >
            {hint}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    gap: 2,
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
