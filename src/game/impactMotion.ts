import { FEEDBACK, type ImpactTier } from './config/feedback.js';
/** Absolute, bounded render offset. No random source or accumulated displacement. */
export function impactOffset(tier: ImpactTier | null, age: number, mobile: boolean): number {
  if (!tier || age < 0 || age >= FEEDBACK.decay) return 0;
  const t = age / FEEDBACK.decay;
  return FEEDBACK[tier].pixels * (mobile ? FEEDBACK.mobileScale : 1)
    * (1 - t) * Math.cos(t * Math.PI * 2 * FEEDBACK.cycles);
}
