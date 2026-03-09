import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Play, Pause } from 'phosphor-react-native';
import { IconButton } from '../ui/IconButton';
import { colors, getNoiseColors, NoiseType } from '../../constants/colors';

interface NoisePlayerProps {
  isPlaying: boolean;
  noiseType: NoiseType;
  onToggle: () => void;
}

export const NoisePlayer: React.FC<NoisePlayerProps> = ({
  isPlaying,
  noiseType,
  onToggle,
}) => {
  const noiseColors = getNoiseColors(noiseType);

  return (
    <View style={styles.container}>
      <IconButton
        onPress={onToggle}
        size={80}
        variant="filled"
        glowColor={isPlaying ? noiseColors.glow : undefined}
      >
        {isPlaying ? (
          <Pause size={32} color={colors.textPrimary} weight="thin" />
        ) : (
          <Play size={32} color={colors.textPrimary} weight="thin" />
        )}
      </IconButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
