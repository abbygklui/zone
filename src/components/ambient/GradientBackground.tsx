import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { colors, NoiseType } from '../../constants/colors';

const { width: W, height: H } = Dimensions.get('window');

interface BlobDef {
  color: string;
  opacity: number;
  diameter: number;
  cx: number;   // screen X of gradient center
  cy: number;   // screen Y of gradient center
  driftDuration: number;
  driftX: number;
  driftY: number;
}

// Blob configs per noise type — positions tuned to look great on iPhone
const BLOB_CONFIGS: Record<NoiseType, BlobDef[]> = {
  white: [
    {
      color: '#8CC8FF', opacity: 0.38, diameter: 1400,
      cx: W * 0.1, cy: H * 0.08,
      driftDuration: 14000, driftX: 50, driftY: 40,
    },
    {
      color: '#C8A0FF', opacity: 0.30, diameter: 1000,
      cx: W * 0.88, cy: H * 0.15,
      driftDuration: 19000, driftX: -40, driftY: 30,
    },
    {
      color: '#B4FFD8', opacity: 0.25, diameter: 1200,
      cx: W * 0.5, cy: H * 0.88,
      driftDuration: 22000, driftX: 30, driftY: -35,
    },
  ],
  pink: [
    {
      color: '#FF3C82', opacity: 0.45, diameter: 1300,
      cx: W * 0.5, cy: H * 0.08,
      driftDuration: 16000, driftX: 40, driftY: 50,
    },
    {
      color: '#B41464', opacity: 0.38, diameter: 1000,
      cx: W * 0.1, cy: H * 0.82,
      driftDuration: 21000, driftX: -35, driftY: -30,
    },
    {
      color: '#FF78B4', opacity: 0.28, diameter: 800,
      cx: W * 0.9, cy: H * 0.5,
      driftDuration: 17000, driftX: -45, driftY: 35,
    },
  ],
  brown: [
    {
      color: '#FF6414', opacity: 0.50, diameter: 1400,
      cx: W * 0.1, cy: H * 0.82,
      driftDuration: 15000, driftX: 55, driftY: -40,
    },
    {
      color: '#C83C00', opacity: 0.38, diameter: 1100,
      cx: W * 0.88, cy: H * 0.15,
      driftDuration: 20000, driftX: -45, driftY: 50,
    },
    {
      color: '#FFB432', opacity: 0.28, diameter: 800,
      cx: W * 0.5, cy: H * 0.9,
      driftDuration: 24000, driftX: 35, driftY: -30,
    },
  ],
};

interface GradientBlobProps {
  blobId: string;
  config: BlobDef;
  isActive: boolean;
  bloomOpacity: SharedValue<number>;
}

const GradientBlob: React.FC<GradientBlobProps> = ({
  blobId,
  config,
  isActive,
  bloomOpacity,
}) => {
  const { color, opacity, diameter, cx, cy, driftDuration, driftX, driftY } = config;
  const r = diameter / 2;

  const noiseOpacity = useSharedValue(isActive ? 1 : 0);
  const driftXVal = useSharedValue(0);
  const driftYVal = useSharedValue(0);

  useEffect(() => {
    noiseOpacity.value = withTiming(isActive ? 1 : 0, { duration: 650 });

    if (isActive) {
      driftXVal.value = withRepeat(
        withSequence(
          withTiming(driftX, { duration: driftDuration, easing: Easing.inOut(Easing.ease) }),
          withTiming(-driftX, { duration: driftDuration, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false
      );
      driftYVal.value = withRepeat(
        withSequence(
          withTiming(driftY, { duration: Math.round(driftDuration * 0.83), easing: Easing.inOut(Easing.ease) }),
          withTiming(-driftY, { duration: Math.round(driftDuration * 0.83), easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(driftXVal);
      cancelAnimation(driftYVal);
      driftXVal.value = withTiming(0, { duration: 800 });
      driftYVal.value = withTiming(0, { duration: 800 });
    }
  }, [isActive, noiseOpacity, driftXVal, driftYVal, driftDuration, driftX, driftY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: noiseOpacity.value * bloomOpacity.value,
    transform: [
      { translateX: driftXVal.value },
      { translateY: driftYVal.value },
    ],
  }));

  const gradId = `grad-${blobId}`;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.blob,
        {
          width: diameter,
          height: diameter,
          left: cx - r,
          top: cy - r,
        },
        animStyle,
      ]}
    >
      <Svg width={diameter} height={diameter}>
        <Defs>
          <RadialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="55%" stopColor={color} stopOpacity={opacity * 0.42} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${gradId})`} />
      </Svg>
    </Animated.View>
  );
};

interface GradientBackgroundProps {
  noiseType: NoiseType;
  bloomOpacity: SharedValue<number>;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  noiseType,
  bloomOpacity,
}) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {(Object.keys(BLOB_CONFIGS) as NoiseType[]).map((type) =>
        BLOB_CONFIGS[type].map((config, i) => (
          <GradientBlob
            key={`${type}-${i}`}
            blobId={`${type}-${i}`}
            config={config}
            isActive={type === noiseType}
            bloomOpacity={bloomOpacity}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
  },
});
