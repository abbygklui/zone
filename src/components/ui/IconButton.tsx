import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../../constants/colors';

interface IconButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  size?: number;
  variant?: 'filled' | 'ghost';
  style?: StyleProp<ViewStyle>;
  glowColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  children,
  size = 48,
  variant = 'filled',
  style,
  glowColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor:
            variant === 'filled' ? colors.surface : 'transparent',
          borderWidth: variant === 'filled' ? 2 : 0,
          borderColor: colors.border,
        },
        glowColor && {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 20,
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
