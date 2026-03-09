import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, FloppyDisk } from 'phosphor-react-native';
import { NoiseMixer } from '../components/noise/NoiseMixer';
import { WaveformVisual } from '../components/noise/WaveformVisual';
import { Tag } from '../components/ui/Tag';
import { BottomSheet } from '../components/ui/BottomSheet';
import { IconButton } from '../components/ui/IconButton';
import { useAudioStore } from '../store/useAudioStore';
import { useSceneStore } from '../store/useSceneStore';
import { useHaptics } from '../hooks/useHaptics';
import { getDominantNoiseType } from '../utils/audio';
import { colors, getNoiseColors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { spacing, radius } from '../constants/layout';
import { AMBIENT_LAYERS, AmbientLayer } from '../constants/presets';

export const CustomizeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const [saveSheetVisible, setSaveSheetVisible] = useState(false);
  const [sceneName, setSceneName] = useState('');

  const {
    volumes,
    activeAmbientLayer,
    isPlaying,
    setVolumes,
    setAmbientLayer,
    setPlaying,
    setNoiseType,
  } = useAudioStore();
  const { saveCustomScene } = useSceneStore();

  const dominantType = getDominantNoiseType(volumes);
  const noiseColors = getNoiseColors(dominantType);

  const handleVolumeChange = (
    type: 'white' | 'pink' | 'brown',
    value: number
  ) => {
    setVolumes({ [type]: value });
    const newVolumes = { ...volumes, [type]: value };
    setNoiseType(getDominantNoiseType(newVolumes));
  };

  const handleAmbientSelect = (layer: AmbientLayer | null) => {
    haptics.chipTap();
    setAmbientLayer(layer);
  };

  const handlePreview = () => {
    haptics.playPause();
    setPlaying(!isPlaying);
  };

  const handleSave = () => {
    if (!sceneName.trim()) return;
    haptics.saveScene();
    saveCustomScene({
      id: `custom-${Date.now()}`,
      name: sceneName.trim(),
      noiseType: dominantType,
      volumes: { ...volumes },
      ambientLayer: activeAmbientLayer as AmbientLayer | null,
      isCustom: true,
    });
    setSceneName('');
    setSaveSheetVisible(false);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Customize</Text>

      {/* Live preview orb */}
      <View style={styles.orbContainer}>
        <WaveformVisual
          noiseType={dominantType}
          volumes={volumes}
          size={120}
        />
      </View>

      {/* Noise sliders */}
      <NoiseMixer
        volumes={volumes}
        onVolumeChange={handleVolumeChange}
        onSlideStart={haptics.sliderMove}
      />

      {/* Ambient layer */}
      <Text style={styles.sectionLabel}>Ambient Layer</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ambientRow}
      >
        <Tag
          label="None"
          active={activeAmbientLayer === null}
          accentColor={noiseColors.primary}
          onPress={() => handleAmbientSelect(null)}
        />
        {AMBIENT_LAYERS.map((layer) => (
          <Tag
            key={layer.id}
            label={layer.label}
            active={activeAmbientLayer === layer.id}
            accentColor={noiseColors.primary}
            onPress={() => handleAmbientSelect(layer.id)}
          />
        ))}
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actions}>
        <IconButton
          onPress={handlePreview}
          size={48}
          glowColor={isPlaying ? noiseColors.glow : undefined}
        >
          <Play
            size={20}
            color={colors.textPrimary}
            weight="thin"
          />
        </IconButton>
        <TouchableOpacity
          onPress={() => setSaveSheetVisible(true)}
          style={[styles.saveButton, { backgroundColor: noiseColors.primary }]}
        >
          <FloppyDisk size={20} color={colors.background} weight="thin" />
          <Text style={styles.saveLabel}>Save Scene</Text>
        </TouchableOpacity>
      </View>

      {/* Save bottom sheet */}
      <BottomSheet
        visible={saveSheetVisible}
        onClose={() => setSaveSheetVisible(false)}
        snapPoint={0.4}
      >
        <View style={styles.saveSheet}>
          <Text style={styles.saveTitle}>Save Scene</Text>
          <TextInput
            value={sceneName}
            onChangeText={setSceneName}
            placeholder="Scene name"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            autoFocus
          />
          <TouchableOpacity
            onPress={handleSave}
            style={[
              styles.confirmButton,
              { backgroundColor: noiseColors.primary },
            ]}
          >
            <Text style={styles.confirmLabel}>Save</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
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
    fontFamily: fonts.fraunces.regular,
    fontSize: 36,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  orbContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  sectionLabel: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  ambientRow: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginTop: spacing['2xl'],
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  saveLabel: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 15,
    color: colors.background,
  },
  saveSheet: {
    paddingTop: spacing.base,
  },
  saveTitle: {
    fontFamily: fonts.fraunces.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  input: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 17,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  confirmLabel: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 15,
    color: colors.background,
  },
});
