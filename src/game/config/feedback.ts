/** Q12B: seconds and screen pixels. No gameplay tuning. */
export const FEEDBACK = {
  light: { flash: 0.045, pixels: 0 },
  medium: { flash: 0.070, pixels: 0 },
  heavy: { flash: 0.090, pixels: 6 },
  flashTint: 0xe5fff7,
  decay: 0.100, cooldown: 0.450, mobileScale: 0.4, cycles: 1,
  perfectDuration: 0.100, perfectRadius: 26, perfectExpansion: 45, perfectColor: 0x9dffe2,
} as const;
export type ImpactTier = 'light' | 'medium' | 'heavy';
export function impactTier(cue: string): ImpactTier {
  return cue === 'heavy' || cue === 'blast' ? 'heavy'
    : cue === 'light3' || cue === 'chargedHit' ? 'medium' : 'light';
}
