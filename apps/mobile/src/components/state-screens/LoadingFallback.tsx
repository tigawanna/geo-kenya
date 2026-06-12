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
import { KenyaShapeSpinner } from "./kenya-shape-spinner";

interface LoadingFallbackProps {
  action?: React.ReactNode;
  initialScreen?: boolean;
  logoSize?: number;
}

export function LoadingFallback({ initialScreen, logoSize = 250, action }: LoadingFallbackProps) {
  const { colors } = useTheme();
  const fadeValue = useSharedValue(0.6);

  useEffect(() => {
    fadeValue.value = withRepeat(
      withSequence(withTiming(1, { duration: 2000 }), withTiming(0.6, { duration: 2000 })),
      -1,
      false,
    );
  }, [fadeValue]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  return (
    <Surface style={[styles.container, { backgroundColor: colors.surface }]} testID="loading-fallback">
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <KenyaShapeSpinner size={logoSize} />
        </View>

        <View style={styles.loadingContainer}>
          {initialScreen ? (
            <Animated.View style={animatedTextStyle}>
              <Text
                variant="bodyMedium"
                style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
                Getting things ready...
              </Text>
            </Animated.View>
          ) : null}
        </View>

        {action ? <View style={styles.actionsContainer}>{action}</View> : null}
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
  content: {},
  logoContainer: {
    marginBottom: 32,
    padding: 16,
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    gap: 20,
  },
  loadingText: {
    textAlign: "center",
    fontStyle: "italic",
  },
  actionsContainer: {
    marginTop: 32,
    alignItems: "center",
  },
});
