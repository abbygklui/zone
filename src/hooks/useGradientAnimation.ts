import { useEffect } from 'react';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { NoiseType } from '../constants/colors';

export const useGradientAnimation = (_noiseType: NoiseType, isPlaying: boolean) => {
  const pulseProgress = useSharedValue(0);
  const bloomScale = useSharedValue(isPlaying ? 1.0 : 0.72);
  const bloomOpacity = useSharedValue(isPlaying ? 1.0 : 0.28);
  const colorCyclePhase = useSharedValue(0);

  useEffect(() => {
    pulseProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 11000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [pulseProgress]);

  useEffect(() => {
    colorCyclePhase.value = withRepeat(
      withTiming(1, {
        duration: isPlaying ? 6000 : 22000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [isPlaying, colorCyclePhase]);

  useEffect(() => {
    if (isPlaying) {
      bloomScale.value = withTiming(1.0, { duration: 700, easing: Easing.out(Easing.ease) });
      bloomOpacity.value = withTiming(1.0, { duration: 700, easing: Easing.out(Easing.ease) });
    } else {
      bloomScale.value = withTiming(0.72, { duration: 700, easing: Easing.inOut(Easing.ease) });
      bloomOpacity.value = withTiming(0.28, { duration: 700, easing: Easing.inOut(Easing.ease) });
    }
  }, [isPlaying, bloomScale, bloomOpacity]);

  return {
    pulseProgress,
    bloomScale,
    bloomOpacity,
    colorCyclePhase,
  };
};
