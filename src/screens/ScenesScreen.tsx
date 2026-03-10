import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SceneList } from '../components/ambient/SceneList';
import { useSceneStore } from '../store/useSceneStore';
import { useAudioStore } from '../store/useAudioStore';
import { useHaptics } from '../hooks/useHaptics';
import { getDominantNoiseType } from '../utils/audio';
import { Scene } from '../constants/presets';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing } from '../constants/layout';

export const ScenesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const {
    presets,
    custom,
    activeSceneId,
    setActiveScene,
    deleteCustomScene,
    loadCustomScenes,
  } = useSceneStore();
  const { setVolumes, setNoiseType, setAmbientLayer, setPreset } =
    useAudioStore();

  useEffect(() => {
    loadCustomScenes();
  }, [loadCustomScenes]);

  const handleSelectScene = (scene: Scene) => {
    haptics.sceneSelect();
    setActiveScene(scene.id);
    setPreset(scene.id);
    setVolumes(scene.volumes);
    setNoiseType(getDominantNoiseType(scene.volumes));
    setAmbientLayer(scene.ambientLayer);
  };

  const handleDeleteScene = (id: string) => {
    deleteCustomScene(id);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Scenes</Text>
      <SceneList
        title="Built-in"
        scenes={presets}
        activeSceneId={activeSceneId}
        onSelect={handleSelectScene}
      />
      {custom.length > 0 && (
        <SceneList
          title="My Scenes"
          scenes={custom}
          activeSceneId={activeSceneId}
          onSelect={handleSelectScene}
          onDelete={handleDeleteScene}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  title: {
    fontFamily: fonts.fraunces.semiBold,
    fontSize: 36,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
});
