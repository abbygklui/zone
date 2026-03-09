import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Minus, Plus } from 'phosphor-react-native';
import { useTimerStore } from '../store/useTimerStore';
import { useHaptics } from '../hooks/useHaptics';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing, radius } from '../constants/layout';

const DurationPicker: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step = 5, onChange }) => {
  const haptics = useHaptics();
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.pickerRow}>
        <TouchableOpacity
          onPress={() => {
            haptics.chipTap();
            onChange(Math.max(min, value - step));
          }}
          style={styles.pickerButton}
        >
          <Minus size={16} color={colors.textSecondary} weight="thin" />
        </TouchableOpacity>
        <Text style={styles.pickerValue}>{value} min</Text>
        <TouchableOpacity
          onPress={() => {
            haptics.chipTap();
            onChange(Math.min(max, value + step));
          }}
          style={styles.pickerButton}
        >
          <Plus size={16} color={colors.textSecondary} weight="thin" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    focusDuration,
    breakDuration,
    endChime,
    autoPauseOnBreak,
    setFocusDuration,
    setBreakDuration,
    setEndChime,
    setAutoPauseOnBreak,
  } = useTimerStore();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Settings</Text>

      {/* Pomodoro section */}
      <Text style={styles.sectionHeader}>Pomodoro</Text>
      <View style={styles.section}>
        <DurationPicker
          label="Focus duration"
          value={focusDuration}
          min={5}
          max={90}
          onChange={setFocusDuration}
        />
        <View style={styles.separator} />
        <DurationPicker
          label="Break duration"
          value={breakDuration}
          min={1}
          max={30}
          step={1}
          onChange={setBreakDuration}
        />
        <View style={styles.separator} />
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>End chime</Text>
          <Switch
            value={endChime}
            onValueChange={setEndChime}
            trackColor={{
              false: colors.surfaceHigh,
              true: colors.accentDefault,
            }}
            thumbColor={colors.textPrimary}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto-pause on break</Text>
          <Switch
            value={autoPauseOnBreak}
            onValueChange={setAutoPauseOnBreak}
            trackColor={{
              false: colors.surfaceHigh,
              true: colors.accentDefault,
            }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>

      {/* About section */}
      <Text style={styles.sectionHeader}>About</Text>
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>0.1.0</Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => {
            Linking.openURL(
              'https://apps.apple.com/app/zone/id0000000000'
            ).catch(() => {});
          }}
        >
          <Text style={styles.settingLabel}>Rate Zone</Text>
          <Text style={styles.linkText}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  title: {
    fontFamily: fonts.fraunces.regular,
    fontSize: 36,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 13,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.base,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingLabel: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 17,
    color: colors.textPrimary,
  },
  settingValue: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 17,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pickerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerValue: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 15,
    color: colors.textPrimary,
    minWidth: 60,
    textAlign: 'center',
  },
  linkText: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 17,
    color: colors.textSecondary,
  },
});
