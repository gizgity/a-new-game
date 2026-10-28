/** Q9D V1.1 approved presentation only; gameplay values remain in ascension.ts. */
export const ASCENSION_VFX = {
  texture: 'ascension-vfx', poolCap: 48,
  groundDepth: 0.97, contactDepth: 1.16, statusDepth: 1.52, procDepth: 1.56, penaltyDepth: 2.1,
  prepare: 0xff6f87, imminent: 0xffe599, active: 0xffedce, edge: 0x090d19,
  proc: 0xc399ff, source: 0xedf7f5,
  stroke: 3, underStroke: 5.5, segments: 16, imminentFraction: 0.35,
  scarWidth: 10, scarHeight: 20, scarGap: 8,
  hunterWidth: 22, hunterHeight: 24, hunterOffset: 52,
  trailWidth: 8, trailHeight: 4, trailSpacing: 7,
  penaltyOffsetX: 16, penaltyOffsetY: 15, penaltyWidth: 7, penaltyHeight: 14,
  crownSize: 23, procSize: 25, procOffset: 12,
  impactDuration: 0.32, hunterEndDuration: 0.22, procDuration: 0.26,
} as const;
export const ASCENSION_FRAMES = ['scar', 'ripple', 'hunterEye', 'chainRim', 'crown', 'fractureFork', 'penaltyTick', 'chainSnap', 'pulseBurst'] as const;
export type AscensionFrame = typeof ASCENSION_FRAMES[number];
