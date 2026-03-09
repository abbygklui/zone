import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider } from '../ui/Slider';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { spacing } from '../../constants/layout';

interface NoiseMixerProps {
  volumes: { white: number; pink: number; brown: number };
  onVolumeChange: (type: 'white' | 'pink' | 'brown', value: number) => void;
  onSlideStart?: () => void;
}

export const NoiseMixer: React.FC<NoiseMixerProps> = ({
  volumes,
  onVolumeChange,
  onSlideStart,
}) => {
  const channels: { key: 'white' | 'pink' | 'brown'; label: string; color: string }[] = [
    { key: 'white', label: 'White', color: colors.noise.white.primary },
    { key: 'pink', label: 'Pink', color: colors.noise.pink.primary },
    { key: 'brown', label: 'Brown', color: colors.noise.brown.primary },
  ];

  return (
    <View style={styles.container}>
      {channels.map(({ key, label, color }) => (
        <View key={key} style={styles.channel}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, { color }]}>
              {Math.round(volumes[key] * 100)}%
            </Text>
          </View>
          <Slider
            value={volumes[key]}
            onValueChange={(v) => onVolumeChange(key, v)}
            accentColor={color}
            onSlideStart={onSlideStart}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  channel: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  value: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
