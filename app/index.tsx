import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.95);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate title
    titleOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) });
    titleScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });

    // Animate subtitle after 500ms delay
    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 800 });
    }, 500);

    // Navigate to login after 3.5s
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, animatedTitleStyle]}>
        QuizMaster
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, animatedSubtitleStyle]}>
        Personalised Quizzes & Guidance – Classes 6 to 10
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});