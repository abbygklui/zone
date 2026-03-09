import * as Haptics from 'expo-haptics';

export const useHaptics = () => {
  const playPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const chipTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const sceneSelect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const saveScene = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const timerStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const timerPhaseEnd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const sliderMove = () => {
    Haptics.selectionAsync();
  };

  return {
    playPause,
    chipTap,
    sceneSelect,
    saveScene,
    timerStart,
    timerPhaseEnd,
    sliderMove,
  };
};
