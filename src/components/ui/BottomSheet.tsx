import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/layout';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  snapPoint?: number;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  snapPoint = 0.85,
  children,
}) => {
  const sheetHeight = SCREEN_HEIGHT * snapPoint;
  const translateY = useSharedValue(sheetHeight);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 150,
      });
      overlayOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(sheetHeight, {
        damping: 20,
        stiffness: 150,
      });
      overlayOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, sheetHeight, translateY, overlayOpacity]);

  const close = useCallback(() => {
    translateY.value = withTiming(sheetHeight, { duration: 300 });
    overlayOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(onClose, 300);
  }, [onClose, sheetHeight, translateY, overlayOpacity]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > sheetHeight * 0.3) {
        runOnJS(close)();
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 150,
        });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View style={[styles.backdrop, overlayStyle]} />
        </TouchableWithoutFeedback>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.sheet, { height: sheetHeight }, sheetStyle]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.xl,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
});
