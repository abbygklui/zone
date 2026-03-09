import { useEffect } from 'react';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';
import { colors, NoiseType } from '../constants/colors';

const noiseColorMap: Record<NoiseType, [string, string, string]> = {
  white: [colors.noise.white.primary, colors.noise.white.secondary, colors.noise.white.accent],
  pink: [colors.noise.pink.primary, colors.noise.pink.secondary, colors.noise.pink.accent],
  brown: [colors.noise.brown.primary, colors.noise.brown.secondary, colors.noise.brown.accent],
};

export const useGradientAnimation = (
  noiseType: NoiseType,
  isPlaying: boolean
) => {
  const pulseProgress = useSharedValue(0);
  const bloomScale = useSharedValue(isPlaying ? 1 : 0.8);
  const bloomOpacity = useSharedValue(isPlaying ? 1 : 0.4);

  useEffect(() => {
    // Slow organic pulse
    pulseProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 12000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [pulseProgress]);

  useEffect(() => {
    if (isPlaying) {
      bloomScale.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      });
      bloomOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      });
    } else {
      bloomScale.value = withTiming(0.8, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      });
      bloomOpacity.value = withTiming(0.4, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isPlaying, bloomScale, bloomOpacity]);

  const gradientColors = noiseColorMap[noiseType];

  return {
    pulseProgress,
    bloomScale,
    bloomOpacity,
    gradientColors,
  };
};
