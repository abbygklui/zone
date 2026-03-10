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

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const {
    duration,
    playIndefinitely,
    endChime,
    setDuration,
    setPlayIndefinitely,
    setEndChime,
  } = useTimerStore();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Settings</Text>

      {/* Timer section */}
      <Text style={styles.sectionHeader}>Timer</Text>
      <View style={styles.section}>
        {/* Play indefinitely toggle */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Play indefinitely</Text>
          <Switch
            value={playIndefinitely}
            onValueChange={(v) => {
              haptics.chipTap();
              setPlayIndefinitely(v);
            }}
            trackColor={{ false: colors.surfaceHigh, true: colors.accentDefault }}
            thumbColor={colors.textPrimary}
          />
        </View>

        <View style={styles.separator} />

        {/* Duration picker — greyed out when playing indefinitely */}
        <View style={[styles.settingRow, playIndefinitely && styles.rowDisabled]}>
          <Text style={[styles.settingLabel, playIndefinitely && styles.labelDisabled]}>
            Duration
          </Text>
          <View style={styles.pickerRow}>
            <TouchableOpacity
              onPress={() => {
                if (playIndefinitely) return;
                haptics.chipTap();
                setDuration(Math.max(5, duration - 5));
              }}
              style={[styles.pickerButton, playIndefinitely && styles.buttonDisabled]}
              disabled={playIndefinitely}
            >
              <Minus size={16} color={playIndefinitely ? colors.textTertiary : colors.textSecondary} weight="thin" />
            </TouchableOpacity>
            <Text style={[styles.pickerValue, playIndefinitely && styles.labelDisabled]}>
              {duration} min
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (playIndefinitely) return;
                haptics.chipTap();
                setDuration(Math.min(180, duration + 5));
              }}
              style={[styles.pickerButton, playIndefinitely && styles.buttonDisabled]}
              disabled={playIndefinitely}
            >
              <Plus size={16} color={playIndefinitely ? colors.textTertiary : colors.textSecondary} weight="thin" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />

        {/* End chime */}
        <View style={[styles.settingRow, playIndefinitely && styles.rowDisabled]}>
          <Text style={[styles.settingLabel, playIndefinitely && styles.labelDisabled]}>
            End chime
          </Text>
          <Switch
            value={endChime}
            onValueChange={(v) => {
              if (playIndefinitely) return;
              setEndChime(v);
            }}
            disabled={playIndefinitely}
            trackColor={{ false: colors.surfaceHigh, true: colors.accentDefault }}
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
            Linking.openURL('https://apps.apple.com/app/zone/id0000000000').catch(() => {});
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
    fontFamily: fonts.fraunces.semiBold,
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
  rowDisabled: {
    opacity: 0.38,
  },
  settingLabel: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 17,
    color: colors.textPrimary,
  },
  labelDisabled: {
    color: colors.textTertiary,
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
  buttonDisabled: {
    backgroundColor: colors.surface,
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
