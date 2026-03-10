import { NoiseType } from '../constants/colors';

// Subtle ambient tint applied to secondary text — makes the whole UI feel
// bathed in the noise type's light (about 15% color shift from neutral grey)
const TINTED_SECONDARY: Record<NoiseType, string> = {
  white: 'rgba(180,210,255,0.85)',
  pink:  'rgba(255,180,200,0.85)',
  brown: 'rgba(255,210,170,0.85)',
};

export const useAmbientColor = (noiseType: NoiseType) => ({
  tintedSecondary: TINTED_SECONDARY[noiseType],
});
