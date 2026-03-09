import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, getNoiseColors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { radius, spacing } from '../../constants/layout';
import { Scene } from '../../constants/presets';

interface SceneCardProps {
  scene: Scene;
  isActive: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  isActive,
  onPress,
  onLongPress,
}) => {
  const noiseColors = getNoiseColors(scene.noiseType);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        isActive && {
          borderColor: noiseColors.primary,
          shadowColor: noiseColors.glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 16,
        },
      ]}
    >
      <LinearGradient
        colors={[noiseColors.primary, noiseColors.secondary, colors.surface]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{scene.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    height: 120,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  gradient: {
    flex: 1,
    opacity: 0.6,
  },
  nameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: 'rgba(13,13,15,0.7)',
  },
  name: {
    fontFamily: fonts.fraunces.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
