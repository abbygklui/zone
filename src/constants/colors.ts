export const colors = {
  background: '#08080A',
  surface: '#0F0F12',
  surfaceHigh: '#16161A',
  border: 'rgba(255,255,255,0.07)',
  textPrimary: '#F6F5F0',
  textSecondary: '#8A8896',
  textTertiary: '#44424F',
  accentDefault: '#A08CFF',
  accentSuccess: '#5ABFA0',
  accentWarning: '#E8B95A',
  noise: {
    white: {
      primary: '#A8DFFF',
      secondary: '#C5B8FF',
      accent: '#FFE8A3',
      glow: 'rgba(140,200,255,0.6)',
      orbInner: '#FFFFFF',
      orbMid: '#D4EEFF',
      orbOuter: '#7BBFFF',
      palette: ['#FFE8A3', '#A8DFFF', '#FFB5D8', '#A3F0E8', '#C5B8FF', '#B8F0A3'],
    },
    pink: {
      primary: '#FF4D8F',
      secondary: '#E8336D',
      accent: '#FF9CC2',
      glow: 'rgba(255,80,140,0.65)',
      orbInner: '#FFE0EE',
      orbMid: '#FF80B0',
      orbOuter: '#D42070',
      palette: ['#FF4D8F', '#FF80B0', '#E8336D', '#FF9CC2', '#CC2266', '#FF6BA8'],
    },
    brown: {
      primary: '#FF9A3C',
      secondary: '#E8480A',
      accent: '#FFB347',
      glow: 'rgba(255,110,30,0.65)',
      orbInner: '#FFF0D0',
      orbMid: '#FF9A40',
      orbOuter: '#CC3300',
      palette: ['#FF6B2B', '#E8480A', '#FF9A3C', '#CC3300', '#FFB347', '#D45500'],
    },
  },
} as const;

export type NoiseType = 'white' | 'pink' | 'brown';
export const getNoiseColors = (type: NoiseType) => colors.noise[type];
