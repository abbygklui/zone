import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Timer } from 'phosphor-react-native';
import { GradientBackground } from '../components/ambient/GradientBackground';
import { NoisePlayer } from '../components/noise/NoisePlayer';
import { NoiseCard } from '../components/noise/NoiseCard';
import { Slider } from '../components/ui/Slider';
import { BottomSheet } from '../components/ui/BottomSheet';
import { PomodoroTimer } from '../components/timer/PomodoroTimer';
import { CountdownTimer } from '../components/timer/CountdownTimer';
import { Tag } from '../components/ui/Tag';
import { useAudioStore } from '../store/useAudioStore';
import { useTimerStore } from '../store/useTimerStore';
import { useSceneStore } from '../store/useSceneStore';
import { useGradientAnimation } from '../hooks/useGradientAnimation';
import { useHaptics } from '../hooks/useHaptics';
import { colors, NoiseType, getNoiseColors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing } from '../constants/layout';
import { formatTime } from '../utils/time';
import { getDominantNoiseType } from '../utils/audio';
import { NOISE_PRESETS } from '../constants/presets';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const [timerSheetVisible, setTimerSheetVisible] = useState(false);

  const {
    isPlaying,
    volumes,
    masterVolume,
    activeNoiseType,
    setPlaying,
    setVolumes,
    setMasterVolume,
    setNoiseType,
    setPreset,
    setAmbientLayer,
  } = useAudioStore();

  const { mode, remaining, isRunning, setMode } = useTimerStore();
  const { activeSceneId, presets, custom } = useSceneStore();

  const noiseColors = getNoiseColors(activeNoiseType);
  const { pulseProgress, bloomScale, bloomOpacity, gradientColors } =
    useGradientAnimation(activeNoiseType, isPlaying);

  const activeScene = [...presets, ...custom].find(
    (s) => s.id === activeSceneId
  );

  const handlePlayToggle = () => {
    haptics.playPause();
    setPlaying(!isPlaying);
  };

  const handleNoiseChip = (type: NoiseType) => {
    haptics.chipTap();
    setNoiseType(type);
    const preset = NOISE_PRESETS.find((p) => p.noiseType === type && !p.ambientLayer);
    if (preset) {
      setPreset(preset.id);
      setVolumes(preset.volumes);
      setAmbientLayer(preset.ambientLayer);
    }
  };

  const handleTimerModeSelect = (m: 'pomodoro' | 'countdown') => {
    haptics.chipTap();
    setMode(m);
  };

  return (
    <View style={styles.container}>
      <GradientBackground
        gradientColors={gradientColors}
        pulseProgress={pulseProgress}
        bloomScale={bloomScale}
        bloomOpacity={bloomOpacity}
      />

      <View style={[styles.content, { paddingTop: insets.top + spacing.base }]}>
        {/* Wordmark */}
        <Text style={styles.wordmark}>Zone</Text>

        {/* Timer pill - top right */}
        {mode !== 'off' && (
          <TouchableOpacity
            style={[styles.timerPill, { top: insets.top + spacing.base }]}
            onPress={() => setTimerSheetVisible(true)}
          >
            <Timer size={16} color={noiseColors.primary} weight="thin" />
            <Text style={[styles.timerPillText, { color: noiseColors.primary }]}>
              {formatTime(remaining)}
            </Text>
          </TouchableOpacity>
        )}

        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={styles.sceneName}>
            {activeScene?.name ?? 'Pure White'}
          </Text>

          <View style={styles.playerSection}>
            <NoisePlayer
              isPlaying={isPlaying}
              noiseType={activeNoiseType}
              onToggle={handlePlayToggle}
            />
          </View>

          {/* Noise chips */}
          <View style={styles.chipRow}>
            {(['white', 'pink', 'brown'] as NoiseType[]).map((type) => (
              <NoiseCard
                key={type}
                type={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                active={activeNoiseType === type}
                onPress={() => handleNoiseChip(type)}
              />
            ))}
          </View>

          {/* Master volume */}
          <View style={styles.sliderContainer}>
            <Slider
              value={masterVolume}
              onValueChange={setMasterVolume}
              accentColor={noiseColors.primary}
              onSlideStart={haptics.sliderMove}
            />
          </View>

          {/* Change scene link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Scenes')}
            activeOpacity={0.7}
          >
            <Text style={styles.changeScene}>Change scene →</Text>
          </TouchableOpacity>
        </View>

        {/* Timer icon */}
        {mode === 'off' && (
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => {
              setMode('pomodoro');
              setTimerSheetVisible(true);
            }}
          >
            <Timer size={24} color={colors.textSecondary} weight="thin" />
          </TouchableOpacity>
        )}
      </View>

      {/* Timer Bottom Sheet */}
      <BottomSheet
        visible={timerSheetVisible}
        onClose={() => setTimerSheetVisible(false)}
        snapPoint={0.85}
      >
        <View style={styles.timerSheetContent}>
          <View style={styles.timerModeTabs}>
            <Tag
              label="Pomodoro"
              active={mode === 'pomodoro'}
              accentColor={noiseColors.primary}
              onPress={() => handleTimerModeSelect('pomodoro')}
            />
            <Tag
              label="Countdown"
              active={mode === 'countdown'}
              accentColor={noiseColors.primary}
              onPress={() => handleTimerModeSelect('countdown')}
            />
          </View>
          {mode === 'pomodoro' ? <PomodoroTimer /> : <CountdownTimer />}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: fonts.fraunces.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  timerPill: {
    position: 'absolute',
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 9999,
  },
  timerPillText: {
    fontFamily: fonts.fraunces.regular,
    fontSize: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  sceneName: {
    fontFamily: fonts.fraunces.regular,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: spacing['2xl'],
  },
  playerSection: {
    marginBottom: spacing['2xl'],
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  sliderContainer: {
    width: '80%',
    marginBottom: spacing.xl,
  },
  changeScene: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  timerButton: {
    position: 'absolute',
    bottom: spacing['3xl'],
    right: spacing.xl,
  },
  timerSheetContent: {
    flex: 1,
  },
  timerModeTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
});
