import { create } from 'zustand';
import { NoiseType } from '../constants/colors';

interface AudioState {
  isPlaying: boolean;
  activePresetId: string | null;
  volumes: { white: number; pink: number; brown: number };
  masterVolume: number;
  activeAmbientLayer: string | null;
  activeNoiseType: NoiseType;
  setPlaying: (v: boolean) => void;
  setPreset: (id: string) => void;
  setVolumes: (v: Partial<{ white: number; pink: number; brown: number }>) => void;
  setMasterVolume: (v: number) => void;
  setAmbientLayer: (layer: string | null) => void;
  setNoiseType: (type: NoiseType) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  activePresetId: 'white-pure',
  volumes: { white: 1.0, pink: 0.0, brown: 0.0 },
  masterVolume: 0.8,
  activeAmbientLayer: null,
  activeNoiseType: 'white',
  setPlaying: (v) => set({ isPlaying: v }),
  setPreset: (id) => set({ activePresetId: id }),
  setVolumes: (v) =>
    set((state) => ({ volumes: { ...state.volumes, ...v } })),
  setMasterVolume: (v) => set({ masterVolume: v }),
  setAmbientLayer: (layer) => set({ activeAmbientLayer: layer }),
  setNoiseType: (type) => set({ activeNoiseType: type }),
}));
