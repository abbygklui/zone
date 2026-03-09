import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, ArrowCounterClockwise } from 'phosphor-react-native';
import { TimerRing } from './TimerRing';
import { useTimerStore } from '../../store/useTimerStore';
import { useAudioStore } from '../../store/useAudioStore';
import { useHaptics } from '../../hooks/useHaptics';
import { colors, getNoiseColors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { spacing } from '../../constants/layout';

export const CountdownTimer: React.FC = () => {
  const {
    remaining,
    isRunning,
    focusDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
  } = useTimerStore();
  const activeNoiseType = useAudioStore((s) => s.activeNoiseType);
  const haptics = useHaptics();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const noiseColors = getNoiseColors(activeNoiseType);
  const totalDuration = focusDuration * 60;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tickTimer]);

  const handleToggle = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      haptics.timerStart();
      startTimer();
    }
  };

  return (
    <View style={styles.container}>
      <TimerRing
        remaining={remaining}
        total={totalDuration}
        accentColor={noiseColors.primary}
      />
      <Text style={styles.label}>Countdown</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={resetTimer} style={styles.ghostButton}>
          <ArrowCounterClockwise
            size={24}
            color={colors.textSecondary}
            weight="thin"
          />
          <Text style={styles.ghostLabel}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggle}
          style={[
            styles.mainButton,
            { backgroundColor: noiseColors.primary },
          ]}
        >
          {isRunning ? (
            <Pause size={24} color={colors.background} weight="fill" />
          ) : (
            <Play size={24} color={colors.background} weight="fill" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  label: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.base,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2xl'],
    marginTop: spacing.xl,
  },
  ghostButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  ghostLabel: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
