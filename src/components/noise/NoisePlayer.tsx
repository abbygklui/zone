import React, { useCallback, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Play, Pause } from 'phosphor-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { colors, NoiseType } from '../../constants/colors';

const AURA_SIZE = 300;
const GLOW_SIZE = 220;
const ORB_SIZE = 170;
const ORB_R = ORB_SIZE / 2;
const GLOW_R = GLOW_SIZE / 2;
const AURA_R = AURA_SIZE / 2;

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
  const nc = colors.noise[noiseType];

  const pulseScale = useSharedValue(1.0);
  const glowOpacity = useSharedValue(isPlaying ? 0.75 : 0.32);
  const tapOrbScale = useSharedValue(1.0);
  const tapAuraScale = useSharedValue(1.0);

  useEffect(() => {
    if (isPlaying) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.88, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.50, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1.0, { duration: 500 });
      glowOpacity.value = withTiming(0.32, { duration: 500 });
    }
  }, [isPlaying, pulseScale, glowOpacity]);

  const handlePressIn = useCallback(() => {
    tapOrbScale.value = withSpring(0.91, { damping: 15, stiffness: 300 });
    tapAuraScale.value = withSpring(1.15, { damping: 10, stiffness: 150 });
  }, [tapOrbScale, tapAuraScale]);

  const handlePressOut = useCallback(() => {
    tapOrbScale.value = withSpring(1.0, { damping: 12, stiffness: 180 });
    tapAuraScale.value = withSpring(1.0, { damping: 12, stiffness: 180 });
  }, [tapOrbScale, tapAuraScale]);

  const orbBodyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value * tapOrbScale.value }],
  }));

  const auraStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: tapAuraScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Outer corona */}
      <Animated.View style={[StyleSheet.absoluteFill, auraStyle]}>
        <Svg width={AURA_SIZE} height={AURA_SIZE}>
          <Defs>
            <RadialGradient id={`aura-${noiseType}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={nc.orbOuter} stopOpacity={0.25} />
              <Stop offset="55%" stopColor={nc.orbOuter} stopOpacity={0.10} />
              <Stop offset="100%" stopColor={nc.orbOuter} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={AURA_R} cy={AURA_R} r={AURA_R} fill={`url(#aura-${noiseType})`} />
        </Svg>
      </Animated.View>

      {/* Mid glow */}
      <Animated.View style={[styles.layerCentered, { width: GLOW_SIZE, height: GLOW_SIZE }, auraStyle]}>
        <Svg width={GLOW_SIZE} height={GLOW_SIZE}>
          <Defs>
            <RadialGradient id={`glow-${noiseType}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={nc.orbOuter} stopOpacity={0.62} />
              <Stop offset="50%" stopColor={nc.orbOuter} stopOpacity={0.22} />
              <Stop offset="100%" stopColor={nc.orbOuter} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={GLOW_R} cy={GLOW_R} r={GLOW_R} fill={`url(#glow-${noiseType})`} />
        </Svg>
      </Animated.View>

      {/* Orb body */}
      <Animated.View style={[styles.layerCentered, { width: ORB_SIZE, height: ORB_SIZE }, orbBodyStyle]}>
        <Svg width={ORB_SIZE} height={ORB_SIZE}>
          <Defs>
            <RadialGradient id={`body-${noiseType}`} cx="38%" cy="30%" r="70%">
              <Stop offset="0%" stopColor={nc.orbInner} stopOpacity={1} />
              <Stop offset="48%" stopColor={nc.orbMid} stopOpacity={0.95} />
              <Stop offset="100%" stopColor={nc.orbOuter} stopOpacity={1} />
            </RadialGradient>
          </Defs>
          <Circle cx={ORB_R} cy={ORB_R} r={ORB_R} fill={`url(#body-${noiseType})`} />
        </Svg>
      </Animated.View>

      {/* Pressable tap target */}
      <Pressable
        style={styles.buttonOverlay}
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.iconContainer}>
          {isPlaying ? (
            <Pause size={34} color="rgba(255,255,255,0.92)" weight="thin" />
          ) : (
            <Play size={34} color="rgba(255,255,255,0.92)" weight="thin" />
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: AURA_SIZE,
    height: AURA_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layerCentered: {
    position: 'absolute',
    alignSelf: 'center',
  },
  buttonOverlay: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },
});
