import React from 'react';
import { colors, NoiseType, getNoiseColors } from '../../constants/colors';
import { Tag } from '../ui/Tag';

interface NoiseCardProps {
  type: NoiseType;
  label: string;
  active: boolean;
  onPress: () => void;
}

export const NoiseCard: React.FC<NoiseCardProps> = ({
  type,
  label,
  active,
  onPress,
}) => {
  const noiseColors = getNoiseColors(type);

  return (
    <Tag
      label={label}
      active={active}
      accentColor={noiseColors.primary}
      onPress={onPress}
    />
  );
};
