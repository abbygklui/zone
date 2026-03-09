import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { radius, spacing } from '../../constants/layout';

interface TagProps {
  label: string;
  active?: boolean;
  accentColor?: string;
  onPress?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  label,
  active = false,
  accentColor = colors.accentDefault,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.tag,
        active && {
          borderColor: accentColor,
          backgroundColor: colors.surfaceHigh,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          active && { color: colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  label: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
