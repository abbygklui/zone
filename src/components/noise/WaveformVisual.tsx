import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, NoiseType, getNoiseColors } from '../../constants/colors';

interface WaveformVisualProps {
  noiseType: NoiseType;
  volumes: { white: number; pink: number; brown: number };
  size?: number;
}

export const WaveformVisual: React.FC<WaveformVisualProps> = ({
  noiseType,
  volumes,
  size = 120,
}) => {
  const pulse = useSharedValue(0);
  const noiseColors = getNoiseColors(noiseType);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.95 + pulse.value * 0.1 }],
    opacity: 0.7 + pulse.value * 0.3,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        orbStyle,
      ]}
    >
      <LinearGradient
        colors={[noiseColors.primary, noiseColors.secondary, colors.background]}
        style={[styles.gradient, { borderRadius: size / 2 }]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});
