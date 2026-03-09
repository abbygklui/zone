export const colors = {
  background: '#0D0D0F',
  surface: '#161618',
  surfaceHigh: '#1F1F22',
  border: '#2A2A2E',
  textPrimary: '#F2F2F5',
  textSecondary: '#8E8E99',
  textTertiary: '#52525C',
  accentDefault: '#7A7AE8',
  accentSuccess: '#5ABFA0',
  accentWarning: '#E8B95A',
  noise: {
    white: {
      primary: '#A8C8F8',
      secondary: '#D0DCF0',
      accent: '#EEF2FA',
      glow: 'rgba(168,200,248,0.3)',
    },
    pink: {
      primary: '#E882A8',
      secondary: '#C07098',
      accent: '#F2BFDA',
      glow: 'rgba(232,130,168,0.3)',
    },
    brown: {
      primary: '#E8924A',
      secondary: '#C0622A',
      accent: '#F2C48A',
      glow: 'rgba(232,146,74,0.3)',
    },
  },
} as const;

export type NoiseType = 'white' | 'pink' | 'brown';

export const getNoiseColors = (type: NoiseType) => colors.noise[type];
