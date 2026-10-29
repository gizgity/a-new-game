/** Q12B: seconds and screen pixels. No gameplay tuning. */
export const FEEDBACK = {
  light: { flash: 0.045, pixels: 0 },
  medium: { flash: 0.070, pixels: 1.5 },
  heavy: { flash: 0.090, pixels: 3 },
  flashTint: 0xe5fff7,
  decay: 0.100, mobileScale: 0.3, cycles: 2,
  perfectDuration: 0.100, perfectRadius: 26, perfectExpansion: 45, perfectColor: 0x9dffe2,
} as const;
export type ImpactTier = 'light' | 'medium' | 'heavy';
export function impactTier(cue: string): ImpactTier {
  return cue === 'heavy' || cue === 'blast' ? 'heavy'
    : cue === 'light3' || cue === 'chargedHit' ? 'medium' : 'light';
}
