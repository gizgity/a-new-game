import { emptyCollection, validateCollection, recordCollection, type CollectionProgress, type RunSummary } from './collection.js';
import type { AutoAimPriority } from './autoAim.js';
import { emptyLegacy, validateLegacy, finishLegacy, type LegacyProgress } from './legacy.js';
import { MUTATIONS, CURSES, type BuildId, type MutationId, type CurseId } from './builds.js';

export const PENDING_KEY = 'cursebreak.pending.v2';
export const SAVE_KEY = 'cursebreak.save.v1';
export const UNLOCKS = ['firstBlood', 'chainApprentice', 'dodgeMaster', 'wardenBreaker'] as const;
export type UnlockId = typeof UNLOCKS[number];
export interface Profile {
  version: 3;
  collection: CollectionProgress;
  legacy: LegacyProgress;
  settings: { locale: 'vi' | 'en'; muted: boolean; volume: number; cosmetic: 'mint' | 'prism'; desktopAutoAim: boolean; autoAimPriority: AutoAimPriority };
  totals: { kills: number; detonations: number; perfectDodges: number; victories: number; runs: number };
  unlocks: UnlockId[];
  drafts: { previous: BuildId[]; current: BuildId[]; active: boolean };
}
type StorageAccess = Pick<Storage, 'getItem' | 'setItem'>;
const object = (value: unknown): Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
const counter = (value: unknown): number => typeof value === 'number' && Number.isInteger(value) && value >= 0 ? Math.min(value, 1_000_000) : 0;
export function defaultProfile(): Profile {
  return { version: 3, collection: emptyCollection(), legacy: emptyLegacy(), settings: { locale: 'vi', muted: false, volume: 0.4, cosmetic: 'mint', desktopAutoAim: false, autoAimPriority: 'nearest' },
    totals: { kills: 0, detonations: 0, perfectDodges: 0, victories: 0, runs: 0 }, unlocks: [], drafts: { previous: [], current: [], active: false } };
}
export function validateProfile(value: unknown): Profile {
  const raw = object(value), result = defaultProfile();
  if (raw.version !== 1 && raw.version !== 2 && raw.version !== 3) return result;
  result.legacy = validateLegacy(raw.legacy);
  result.collection = validateCollection(raw.collection, result.legacy.nextRunId);
  const settings = object(raw.settings), totals = object(raw.totals);
  result.settings.locale = settings.locale === 'en' ? 'en' : 'vi';
  result.settings.muted = settings.muted === true;
  result.settings.desktopAutoAim = settings.desktopAutoAim === true;
  result.settings.autoAimPriority = settings.autoAimPriority === 'archer' || settings.autoAimPriority === 'elite' ? settings.autoAimPriority : 'nearest';
  result.settings.volume = typeof settings.volume === 'number' && Number.isFinite(settings.volume) ? Math.max(0, Math.min(1, settings.volume)) : 0.4;
  for (const key of Object.keys(result.totals) as (keyof Profile['totals'])[]) result.totals[key] = counter(totals[key]);
  result.unlocks = UNLOCKS.filter((id) => Array.isArray(raw.unlocks) && raw.unlocks.includes(id));
  const drafts = object(raw.drafts), ids: readonly BuildId[] = [...MUTATIONS, ...CURSES];
  const offered = (value: unknown) => ids.filter(id => Array.isArray(value) && value.includes(id));
  result.drafts = { previous: offered(drafts.previous), current: offered(drafts.current), active: drafts.active === true };
  awardUnlocks(result);
  result.settings.cosmetic = settings.cosmetic === 'prism' && result.unlocks.includes('wardenBreaker') ? 'prism' : 'mint';
  return result;
}
export function loadProfile(storage?: StorageAccess): Profile {
  try {
    const text = (storage ?? localStorage).getItem(SAVE_KEY);
    let main = defaultProfile();
    try { if (text && text.length < 64_000) main = validateProfile(JSON.parse(text)); } catch { /* Recover result journal below. */ }
    const pendingText = (storage ?? localStorage).getItem(PENDING_KEY);
    if (pendingText && pendingText.length < 64_000) {
      try {
        const pending = validateProfile(JSON.parse(pendingText));
        if (pending.legacy.receipt && (main.legacy.ticket?.runId === pending.legacy.receipt.runId || main.legacy.nextRunId < pending.legacy.nextRunId)) return pending;
      } catch { /* A corrupt journal cannot discard a valid main save. */ }
    }
    return main;
  } catch { return defaultProfile(); }
}
export function saveProfile(profile: Profile, storage?: StorageAccess): boolean {
  try {
    const target = storage ?? localStorage;
    const snapshot = validateProfile(profile);
    let text = JSON.stringify(snapshot);
    // Write-ahead result journal. Either complete snapshot recovers the same reward.
    if (profile.legacy.receipt) { try { target.setItem(PENDING_KEY, text); } catch { /* Main write may still succeed. */ } }
    try { target.setItem(SAVE_KEY, text); } catch {
      // Optional history must never block the core progression transaction (quota).
      snapshot.collection.history = []; text = JSON.stringify(snapshot);
      if (profile.legacy.receipt) { try { target.setItem(PENDING_KEY, text); } catch { /* Main may succeed. */ } }
      target.setItem(SAVE_KEY, text);
    }
    try { target.setItem(PENDING_KEY, ''); } catch { /* Stale receipt loses to a newer ticket. */ }
    return true;
  }
  catch { return false; }
}
export function awardUnlocks(profile: Profile): boolean {
  const before = profile.unlocks.length;
  const conditions = [profile.totals.kills >= 1, profile.totals.detonations >= 5, profile.totals.perfectDodges >= 3, profile.totals.victories >= 1];
  UNLOCKS.forEach((id, index) => { if (conditions[index] && !profile.unlocks.includes(id)) profile.unlocks.push(id); });
  return before !== profile.unlocks.length;
}
export function mutationPool(profile: Profile): MutationId[] {
  return MUTATIONS.filter((id) => id === 'guardBreaker' ? profile.unlocks.includes('firstBlood') : id === 'staticRiposte' ? profile.unlocks.includes('dodgeMaster') : true);
}
export function cursePool(profile: Profile): CurseId[] {
  return CURSES.filter((id) => id !== 'deathEcho' || profile.unlocks.includes('chainApprentice'));
}

export class Progression {
  private previous = { kills: 0, detonations: 0, perfectDodges: 0 };
  private recorded = false;
  constructor(readonly profile: Profile) {}
  beginRun(countRun = true): void {
    if (this.profile.drafts.active) this.profile.drafts.previous = [...this.profile.drafts.current];
    this.profile.drafts.current = []; this.profile.drafts.active = true;
    this.previous = { kills: 0, detonations: 0, perfectDodges: 0 };
    this.recorded = false;
    if (countRun) this.profile.totals.runs = counter(this.profile.totals.runs + 1);
  }
  offerDraft(ids: readonly BuildId[]): void {
    const offered = new Set([...this.profile.drafts.current, ...ids]);
    this.profile.drafts.current = [...MUTATIONS, ...CURSES].filter(id => offered.has(id));
  }
  observe(world: { kills: number; detonations: number; perfectDodges: number }, result: 'victory' | 'defeat' | null, summary?: Omit<RunSummary,'runId'|'result'|'seal'|'legacy'|'anomaly'|'rewards'>): boolean {
    for (const key of ['kills', 'detonations', 'perfectDodges'] as const) {
      this.profile.totals[key] = counter(this.profile.totals[key] + Math.max(0, world[key] - this.previous[key]));
      this.previous[key] = world[key];
    }
    if (result && !this.recorded) {
      this.recorded = true;
      const ticket = this.profile.legacy.ticket;
      if (finishLegacy(this.profile.legacy, result) && ticket && summary) recordCollection(this.profile.collection, this.profile.legacy, ticket, summary);
      if (result === 'victory') this.profile.totals.victories = counter(this.profile.totals.victories + 1);
    }
    return awardUnlocks(this.profile);
  }
}
