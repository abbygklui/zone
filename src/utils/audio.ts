import { NoiseType } from '../constants/colors';

export const getDominantNoiseType = (volumes: {
  white: number;
  pink: number;
  brown: number;
}): NoiseType => {
  const { white, pink, brown } = volumes;
  if (pink >= white && pink >= brown) return 'pink';
  if (brown >= white && brown >= pink) return 'brown';
  return 'white';
};

export const interpolateVolume = (
  from: number,
  to: number,
  progress: number
): number => {
  return from + (to - from) * progress;
};
