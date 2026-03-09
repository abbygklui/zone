import { NoiseType } from './colors';

export type AmbientLayer = 'rain' | 'cafe' | 'fireplace' | 'library';

export interface Scene {
  id: string;
  name: string;
  noiseType: NoiseType;
  volumes: { white: number; pink: number; brown: number };
  ambientLayer: AmbientLayer | null;
  isCustom?: boolean;
}

export const NOISE_PRESETS: Scene[] = [
  {
    id: 'white-pure',
    name: 'Pure White',
    noiseType: 'white',
    volumes: { white: 1.0, pink: 0.0, brown: 0.0 },
    ambientLayer: null,
  },
  {
    id: 'pink-focus',
    name: 'Pink Focus',
    noiseType: 'pink',
    volumes: { white: 0.0, pink: 1.0, brown: 0.0 },
    ambientLayer: null,
  },
  {
    id: 'brown-deep',
    name: 'Brown Deep',
    noiseType: 'brown',
    volumes: { white: 0.0, pink: 0.0, brown: 1.0 },
    ambientLayer: null,
  },
  {
    id: 'rain-study',
    name: 'Rain Study',
    noiseType: 'pink',
    volumes: { white: 0.0, pink: 0.7, brown: 0.0 },
    ambientLayer: 'rain',
  },
  {
    id: 'cafe-flow',
    name: 'Café Flow',
    noiseType: 'brown',
    volumes: { white: 0.0, pink: 0.0, brown: 0.6 },
    ambientLayer: 'cafe',
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    noiseType: 'brown',
    volumes: { white: 0.0, pink: 0.0, brown: 0.5 },
    ambientLayer: 'fireplace',
  },
  {
    id: 'library',
    name: 'Library',
    noiseType: 'white',
    volumes: { white: 0.6, pink: 0.0, brown: 0.0 },
    ambientLayer: 'library',
  },
];

export const AMBIENT_LAYERS: { id: AmbientLayer; label: string }[] = [
  { id: 'rain', label: 'Rain' },
  { id: 'cafe', label: 'Café' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'library', label: 'Library' },
];
