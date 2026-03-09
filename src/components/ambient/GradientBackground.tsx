import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GradientBackgroundProps {
  gradientColors: [string, string, string];
  pulseProgress: SharedValue<number>;
  bloomScale: SharedValue<number>;
  bloomOpacity: SharedValue<number>;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  gradientColors,
  pulseProgress,
  bloomScale,
  bloomOpacity,
}) => {
  const blob1Style = useAnimatedStyle(() => {
    const translateX = interpolate(pulseProgress.value, [0, 1], [-30, 30]);
    const translateY = interpolate(pulseProgress.value, [0, 1], [-20, 20]);
    return {
      transform: [
        { scale: bloomScale.value },
        { translateX },
        { translateY },
      ],
      opacity: bloomOpacity.value * 0.6,
    };
  });

  const blob2Style = useAnimatedStyle(() => {
    const translateX = interpolate(pulseProgress.value, [0, 1], [20, -20]);
    const translateY = interpolate(pulseProgress.value, [0, 1], [15, -25]);
    return {
      transform: [
        { scale: bloomScale.value },
        { translateX },
        { translateY },
      ],
      opacity: bloomOpacity.value * 0.4,
    };
  });

  const blob3Style = useAnimatedStyle(() => {
    const translateX = interpolate(pulseProgress.value, [0, 1], [-15, 25]);
    const translateY = interpolate(pulseProgress.value, [0, 1], [25, -15]);
    return {
      transform: [
        { scale: bloomScale.value * 0.9 },
        { translateX },
        { translateY },
      ],
      opacity: bloomOpacity.value * 0.3,
    };
  });

  return (
    <Animated.View style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.blob, styles.blob1, blob1Style]}>
        <LinearGradient
          colors={[gradientColors[0], 'transparent']}
          style={styles.blobGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[styles.blob, styles.blob2, blob2Style]}>
        <LinearGradient
          colors={[gradientColors[1], 'transparent']}
          style={styles.blobGradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>
      <Animated.View style={[styles.blob, styles.blob3, blob3Style]}>
        <LinearGradient
          colors={[gradientColors[2], 'transparent']}
          style={styles.blobGradient}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>
    </Animated.View>
  );
};

const BLOB_SIZE = SCREEN_WIDTH * 1.2;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: BLOB_SIZE,
    height: BLOB_SIZE,
    borderRadius: BLOB_SIZE / 2,
    overflow: 'hidden',
  },
  blobGradient: {
    width: '100%',
    height: '100%',
  },
  blob1: {
    top: -BLOB_SIZE * 0.3,
    left: -BLOB_SIZE * 0.2,
  },
  blob2: {
    top: SCREEN_HEIGHT * 0.2,
    right: -BLOB_SIZE * 0.4,
  },
  blob3: {
    bottom: -BLOB_SIZE * 0.2,
    left: -BLOB_SIZE * 0.1,
  },
});
