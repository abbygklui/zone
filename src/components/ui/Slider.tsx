import React, { useCallback } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  accentColor?: string;
  width?: number | string;
  onSlideStart?: () => void;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  accentColor = colors.accentDefault,
  width = '100%',
  onSlideStart,
}) => {
  const trackWidth = useSharedValue(300);
  const translateX = useSharedValue(value * 300);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      trackWidth.value = w;
      translateX.value = value * w;
    },
    [value, trackWidth, translateX]
  );

  const updateValue = useCallback(
    (v: number) => {
      onValueChange(Math.max(0, Math.min(1, v)));
    },
    [onValueChange]
  );

  const triggerSlideStart = useCallback(() => {
    onSlideStart?.();
  }, [onSlideStart]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (onSlideStart) {
        runOnJS(triggerSlideStart)();
      }
    })
    .onUpdate((e) => {
      const newX = Math.max(0, Math.min(trackWidth.value, e.x));
      translateX.value = newX;
      const newValue = newX / trackWidth.value;
      runOnJS(updateValue)(newValue);
    })
    .hitSlop({ top: 20, bottom: 20 });

  const tapGesture = Gesture.Tap().onEnd((e) => {
    const newX = Math.max(0, Math.min(trackWidth.value, e.x));
    translateX.value = newX;
    const newValue = newX / trackWidth.value;
    runOnJS(updateValue)(newValue);
  });

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - 10 }],
  }));

  return (
    <GestureDetector gesture={Gesture.Simultaneous(panGesture, tapGesture)}>
      <View style={[styles.container, { width: width as any }]} onLayout={onLayout}>
        <View style={styles.track}>
          <Animated.View
            style={[styles.fill, { backgroundColor: accentColor }, fillStyle]}
          />
        </View>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textPrimary,
    top: 10,
  },
});
