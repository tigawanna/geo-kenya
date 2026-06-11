import { LandscapeSvg } from '@/components/shared/svg/LandscapeSvg';
import { Link, Stack } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';



export default function NotFoundScreen() {
  const { colors } = useTheme();
  
  // Animation values
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const bounceAnim = useSharedValue(0);
  
  useEffect(() => {
    // Fade in animation
    fadeAnim.value = withTiming(1, { duration: 800 });
    
    // Scale up animation
    scaleAnim.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    
    // Floating animation for the SVG
    bounceAnim.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000 }),
        withTiming(10, { duration: 2000 })
      ),
      -1,
      true
    );
  }, [bounceAnim, fadeAnim, scaleAnim]);
  
  // Animated styles
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));
  
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));
  
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnim.value }],
  }));

  return (
    <Surface style={[styles.surface, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      
      <Animated.View style={[styles.svgContainer, bounceStyle]}>
        <LandscapeSvg width={200} height={200} />
      </Animated.View>
      
      <Animated.View style={[styles.container, fadeStyle, scaleStyle]}>
        <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
          Screen Not Found
        </Text>
        
        <Text variant="bodyLarge" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          This screen doesn&apos;t exist.
        </Text>
        
        <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurfaceVariant }]}>
          The screen you&apos;re looking for might have been moved, deleted, or you entered the wrong URL.
        </Text>
        
        <Link href="/" asChild>
          <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon="home"
          >
            Go to Home
          </Button>
        </Link>
      </Animated.View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
  },
  svgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.8,
  },
  button: {
    marginTop: 8,
    borderRadius: 28,
  },
  buttonContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
