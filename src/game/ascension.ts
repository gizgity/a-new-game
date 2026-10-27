import { SIGILS, type LegacyId } from './config/legacy.js';
export interface AscensionProgress { version: 1; highest: number; selected: number; clears: number[] }
export const emptyAscension = (): AscensionProgress => ({ version: 1, highest: 0, selected: 0, clears: [] });
export const sealLevel = (v: unknown): number => Number.isInteger(v) && Number(v) >= 0 && Number(v) <= 4 ? Number(v) : 0;
export const ascensionAvailable = (ids: readonly LegacyId[]): boolean => SIGILS.every(id => ids.includes(id));
export function validateAscension(value: unknown, ids: readonly LegacyId[]): AscensionProgress {
  const out = emptyAscension();
  if (!value || typeof value !== 'object' || !ascensionAvailable(ids)) return out;
  const raw = value as AscensionProgress;
  if (raw.version !== 1) return out;
  out.clears = [0,1,2,3,4].filter(n => Array.isArray(raw.clears) && raw.clears.includes(n));
  // Unlocks must be backed by a contiguous chain; malformed saves cannot skip a Seal.
  while (out.highest < 4 && out.clears.includes(out.highest)) out.highest++;
  out.selected = Math.min(sealLevel(raw.selected), out.highest);
  return out;
}
