import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SceneCard } from './SceneCard';
import { Scene } from '../../constants/presets';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { spacing } from '../../constants/layout';

interface SceneListProps {
  title: string;
  scenes: Scene[];
  activeSceneId: string | null;
  onSelect: (scene: Scene) => void;
  onDelete?: (id: string) => void;
}

export const SceneList: React.FC<SceneListProps> = ({
  title,
  scenes,
  activeSceneId,
  onSelect,
  onDelete,
}) => {
  const handleLongPress = (scene: Scene) => {
    if (!onDelete) return;
    Alert.alert('Delete Scene', `Delete "${scene.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(scene.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            isActive={activeSceneId === scene.id}
            onPress={() => onSelect(scene)}
            onLongPress={onDelete ? () => handleLongPress(scene) : undefined}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.fraunces.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
