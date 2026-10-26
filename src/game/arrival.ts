import { BOSS_PHASE } from './config/balance.js';

const BEATS = [0.32, 0.46, 0.66, 0.9] as const;
/** Same simulation clock for the four visual peaks and audio onsets. */
export function arrivalPulse(remaining: number): { beat: number; gain: number; alpha: number } {
  if (remaining <= 0) return { beat: -1, gain: 0, alpha: 0 };
  const age = Math.max(0, BOSS_PHASE.arrival - remaining);
  const beat = Math.min(3, Math.floor((age - 0.1 + 1e-9) / 0.5));
  const gain = BEATS[Math.max(0, beat)];
  const since = age - (0.1 + beat * 0.5);
  const pulse = beat < 0 ? 0 : Math.exp(-since * 9);
  return { beat, gain, alpha: 0.18 + gain * 0.82 * pulse };
}

