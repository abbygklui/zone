import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Scene, NOISE_PRESETS } from '../constants/presets';

const CUSTOM_SCENES_KEY = '@zone_custom_scenes';
const ACTIVE_SCENE_KEY = '@zone_active_scene';

interface SceneState {
  presets: Scene[];
  custom: Scene[];
  activeSceneId: string | null;
  setActiveScene: (id: string) => void;
  saveCustomScene: (scene: Scene) => void;
  deleteCustomScene: (id: string) => void;
  loadCustomScenes: () => Promise<void>;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  presets: NOISE_PRESETS,
  custom: [],
  activeSceneId: 'white-pure',

  setActiveScene: (id) => {
    set({ activeSceneId: id });
    AsyncStorage.setItem(ACTIVE_SCENE_KEY, id).catch(() => {});
  },

  saveCustomScene: (scene) => {
    const customScene = { ...scene, isCustom: true };
    set((state) => {
      const updated = [...state.custom, customScene];
      AsyncStorage.setItem(CUSTOM_SCENES_KEY, JSON.stringify(updated)).catch(
        () => {}
      );
      return { custom: updated };
    });
  },

  deleteCustomScene: (id) => {
    set((state) => {
      const updated = state.custom.filter((s) => s.id !== id);
      AsyncStorage.setItem(CUSTOM_SCENES_KEY, JSON.stringify(updated)).catch(
        () => {}
      );
      const activeId =
        state.activeSceneId === id ? 'white-pure' : state.activeSceneId;
      return { custom: updated, activeSceneId: activeId };
    });
  },

  loadCustomScenes: async () => {
    try {
      const stored = await AsyncStorage.getItem(CUSTOM_SCENES_KEY);
      if (stored) {
        set({ custom: JSON.parse(stored) });
      }
      const activeId = await AsyncStorage.getItem(ACTIVE_SCENE_KEY);
      if (activeId) {
        set({ activeSceneId: activeId });
      }
    } catch {
      // Ignore storage errors
    }
  },
}));
