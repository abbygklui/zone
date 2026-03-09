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

export const PomodoroTimer: React.FC = () => {
  const {
    phase,
    remaining,
    isRunning,
    sessionsCompleted,
    focusDuration,
    breakDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
  } = useTimerStore();
  const activeNoiseType = useAudioStore((s) => s.activeNoiseType);
  const haptics = useHaptics();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPhaseRef = useRef(phase);

  const noiseColors = getNoiseColors(activeNoiseType);
  const totalDuration =
    (phase === 'focus' ? focusDuration : breakDuration) * 60;

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

  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      haptics.timerPhaseEnd();
      prevPhaseRef.current = phase;
    }
  }, [phase, haptics]);

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
        accentColor={
          phase === 'focus' ? noiseColors.primary : colors.accentWarning
        }
      />
      <Text style={styles.phaseLabel}>
        {phase === 'focus' ? 'Focus' : 'Break'}
      </Text>
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
      <Text style={styles.sessionCounter}>
        Session {sessionsCompleted + 1}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  phaseLabel: {
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
  sessionCounter: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: spacing.xl,
  },
});
