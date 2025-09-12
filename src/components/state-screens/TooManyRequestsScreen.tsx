import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Chill } from "@/components/shared/svg/Chill";

export function TooManyRequestsScreen() {
  const { colors } = useTheme();
  const rotateValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    // Gentle rotation animation for the icon
    rotateValue.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false
    );

    // Breathing scale animation
    scaleValue.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 10 })
      ),
      -1,
      false
    );

    // Pulse animation for emphasis
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateValue.value}deg` },
      { scale: scaleValue.value }
    ],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const handleRetry = () => {
    // This could trigger a refresh or retry action
    console.log('Retry requested');
  };

  return (
    <Surface style={[styles.container, { backgroundColor: colors.surface }]}>
      <Animated.View style={[styles.content, animatedContainerStyle]}>
        <View style={styles.iconWrapper}>
          <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
            <Chill />
          </Animated.View>
        </View>
        
        <View style={styles.textContainer}>
          <Text 
            variant="headlineSmall" 
            style={[styles.titleText, { color: colors.onSurface }]}
          >
            Whoa, slow down! 🚦
          </Text>
          
          <Text 
            variant="bodyLarge" 
            style={[styles.subtitleText, { color: colors.onSurfaceVariant }]}
          >
            Too many requests
          </Text>
          
          <Text 
            variant="bodyMedium" 
            style={[styles.descriptionText, { color: colors.outline }]}
          >
            Let&apos;s take a breath and try again in a moment. 
            The servers need a quick break too! 
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <Button 
            mode="outlined" 
            onPress={handleRetry}
            style={[styles.retryButton, { borderColor: colors.outline }]}
            labelStyle={{ color: colors.primary }}
          >
            Try Again Later
          </Button>
        </View>
      </Animated.View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconWrapper: {
    marginBottom: 32,
  },
  iconContainer: {
    padding: 20,
    borderRadius: 50,
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  titleText: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  descriptionText: {
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
});
