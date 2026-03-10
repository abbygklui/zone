import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Timer, CaretLeft, CaretRight } from 'phosphor-react-native';
import { GradientBackground } from '../components/ambient/GradientBackground';
import { NoisePlayer } from '../components/noise/NoisePlayer';
import { BottomSheet } from '../components/ui/BottomSheet';
import { CountdownTimer } from '../components/timer/CountdownTimer';
import { useAudioStore } from '../store/useAudioStore';
import { useTimerStore } from '../store/useTimerStore';
import { useGradientAnimation } from '../hooks/useGradientAnimation';
import { useAmbientColor } from '../hooks/useAmbientColor';
import { useHaptics } from '../hooks/useHaptics';
import { colors, NoiseType, getNoiseColors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing } from '../constants/layout';
import { formatTime } from '../utils/time';
import { NOISE_PRESETS } from '../constants/presets';

const NOISE_TYPES: NoiseType[] = ['white', 'pink', 'brown'];

const NOISE_META: Record<NoiseType, { label: string; subtitle: string }> = {
  white: { label: 'White Noise', subtitle: 'Full spectrum · Broad' },
  pink: { label: 'Pink Noise', subtitle: 'Natural · Relaxing' },
  brown: { label: 'Brown Noise', subtitle: 'Deep · Immersive' },
};

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const [timerSheetVisible, setTimerSheetVisible] = useState(false);

  const {
    isPlaying,
    activeNoiseType,
    setPlaying,
    setVolumes,
    setNoiseType,
    setPreset,
    setAmbientLayer,
  } = useAudioStore();

  const { mode, remaining, setMode } = useTimerStore();

  const safeNoiseType: NoiseType = activeNoiseType;
  const currentIndex = NOISE_TYPES.indexOf(safeNoiseType);
  const noiseColors = getNoiseColors(safeNoiseType);

  const { bloomOpacity } =
    useGradientAnimation(safeNoiseType, isPlaying);

  const { tintedSecondary } = useAmbientColor(safeNoiseType);

  // Label fade-slide on noise change
  const labelOpacity = useSharedValue(1);
  const labelOffset = useSharedValue(0);
  const prevNoiseRef = useRef(safeNoiseType);

  if (prevNoiseRef.current !== safeNoiseType) {
    prevNoiseRef.current = safeNoiseType;
    labelOpacity.value = withSequence(
      withTiming(0, { duration: 110 }),
      withTiming(1, { duration: 200 })
    );
    labelOffset.value = withSequence(
      withTiming(10, { duration: 110 }),
      withTiming(0, { duration: 200 })
    );
  }

  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ translateY: labelOffset.value }],
  }));

  const handlePlayToggle = () => {
    haptics.playPause();
    setPlaying(!isPlaying);
  };

  const handleNoiseChange = (type: NoiseType) => {
    haptics.chipTap();
    setNoiseType(type);
    const preset = NOISE_PRESETS.find((p) => p.noiseType === type && !p.ambientLayer);
    if (preset) {
      setPreset(preset.id);
      setVolumes(preset.volumes);
      setAmbientLayer(preset.ambientLayer);
    }
  };

  const navigateNoise = (delta: number) => {
    const newIndex = (currentIndex + delta + NOISE_TYPES.length) % NOISE_TYPES.length;
    handleNoiseChange(NOISE_TYPES[newIndex]);
  };

  const panGesture = Gesture.Pan()
    .minDistance(30)
    .onEnd((e) => {
      'worklet';
      const isHoriz = Math.abs(e.translationX) > Math.abs(e.translationY) * 1.3;
      if (!isHoriz) return;
      if (e.translationX < -30) runOnJS(navigateNoise)(1);
      else if (e.translationX > 30) runOnJS(navigateNoise)(-1);
    });


  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <GradientBackground
          noiseType={safeNoiseType}
          bloomOpacity={bloomOpacity}
        />

        <View style={[styles.content, { paddingTop: insets.top + spacing.xs }]}>

          {/* Top bar */}
          <View style={styles.topBar}>
            <Text style={styles.wordmark}>Zone</Text>
            {mode !== 'off' ? (
              <TouchableOpacity
                style={[styles.timerPill, { borderColor: noiseColors.primary + '44' }]}
                onPress={() => setTimerSheetVisible(true)}
              >
                <Timer size={13} color={noiseColors.primary} weight="thin" />
                <Text style={[styles.timerPillText, { color: noiseColors.primary }]}>
                  {formatTime(remaining)}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => { setMode('countdown'); setTimerSheetVisible(true); }}
                style={styles.timerIconButton}
              >
                <Timer size={22} color={colors.textTertiary} weight="thin" />
              </TouchableOpacity>
            )}
          </View>

          {/* Orb hero */}
          <View style={styles.orbHero}>
            {/* Center orb */}
            <NoisePlayer
              isPlaying={isPlaying}
              noiseType={safeNoiseType}
              onToggle={handlePlayToggle}
            />

            {/* Left arrow */}
            <TouchableOpacity
              onPress={() => navigateNoise(-1)}
              style={[styles.arrowButton, styles.arrowLeft]}
              activeOpacity={0.7}
            >
              <CaretLeft size={18} color="rgba(255,255,255,0.7)" weight="bold" />
            </TouchableOpacity>

            {/* Right arrow */}
            <TouchableOpacity
              onPress={() => navigateNoise(1)}
              style={[styles.arrowButton, styles.arrowRight]}
              activeOpacity={0.7}
            >
              <CaretRight size={18} color="rgba(255,255,255,0.7)" weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Noise label */}
          <Animated.View style={[styles.labelBlock, labelAnimStyle]}>
            <Text style={styles.noiseLabel}>{NOISE_META[safeNoiseType].label}</Text>
            <Text style={[styles.noiseSubtitle, { color: tintedSecondary }]}>{NOISE_META[safeNoiseType].subtitle}</Text>
          </Animated.View>

          {/* Page dots */}
          <View style={styles.dots}>
            {NOISE_TYPES.map((t, i) => (
              <TouchableOpacity
                key={t}
                onPress={() => handleNoiseChange(t)}
                hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
              >
                <View
                  style={[
                    styles.dot,
                    i === currentIndex
                      ? { width: 20, backgroundColor: noiseColors.primary }
                      : { width: 6, backgroundColor: colors.textTertiary, opacity: 0.45 },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom spacer for tab bar */}
          <View style={{ paddingBottom: insets.bottom + spacing.xl }} />
        </View>

        <BottomSheet
          visible={timerSheetVisible}
          onClose={() => setTimerSheetVisible(false)}
          snapPoint={0.85}
        >
          <View style={styles.timerSheetContent}>
            <CountdownTimer />
          </View>
        </BottomSheet>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  wordmark: {
    fontFamily: fonts.fraunces.semiBold,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 9999,
    borderWidth: 1,
  },
  timerPillText: {
    fontFamily: fonts.fraunces.regular,
    fontSize: 14,
  },
  timerIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbHero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arrowButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  arrowLeft: {
    left: spacing.lg,
  },
  arrowRight: {
    right: spacing.lg,
  },
  labelBlock: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  noiseLabel: {
    fontFamily: fonts.fraunces.regular,
    fontSize: 34,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    fontStyle: 'italic',
  },
  noiseSubtitle: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 12,
    color: colors.textTertiary,
    letterSpacing: 0.3,
    marginTop: 4,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.xl,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  timerSheetContent: {
    flex: 1,
  },
});
