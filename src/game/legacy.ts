import { ANOMALY } from './config/anomalies.js';
import { SIGILS, BRANCHES, ANOMALIES, STARTER_ANOMALIES, LEGACY_IDS, type AnomalyId, legacyUnlocks, validLegacy, sameLegacy, type LegacyId, type LegacyOffer, type SigilId, type BranchId } from './config/legacy.js';
import { DraftRandom, newDraftSeed, weightedIndex } from './Draft.js';

/** Roll element first, then one of its owned branches. Never pad with locked or duplicate offers. */
export function rollLegacy(unlocks: readonly LegacyId[], seed: number, previous: readonly SigilId[] = []): LegacyOffer[] {
  const owned = legacyUnlocks(unlocks), random = new DraftRandom(seed), offers: LegacyOffer[] = [];
  const branches = (sigil: SigilId): (BranchId | null)[] => {
    const ids = (Object.keys(BRANCHES) as BranchId[]).filter(id => BRANCHES[id] === sigil && owned.includes(id));
    return ids.length ? ids : [null];
  };
  for (let slot = 0; slot < 2; slot++) {
    const candidates = SIGILS.filter(sigil => owned.includes(sigil) && branches(sigil).some(branch => !offers.some(o => sameLegacy(o, { sigil, branch }))));
    if (!candidates.length) break;
    const sigil = candidates[weightedIndex(candidates.map(id => previous.includes(id) ? 0.65 : 1), random.next)];
    const available = branches(sigil).filter(branch => !offers.some(o => sameLegacy(o, { sigil, branch })));
    offers.push({ sigil, branch: available[Math.floor(random.next() * available.length)] });
  }
  return offers;
}
export interface LegacyTicket { anomalyOffers: AnomalyId[]; anomalySelected: AnomalyId | null; runId: number; seed: number; offers: LegacyOffer[]; selected: LegacyOffer | null; firstRun: boolean; started: boolean }
export interface LegacyReceipt { runId: number; result: 'victory' | 'defeat'; rewards: LegacyId[] }
export interface LegacyProgress { version: 2; nextRunId: number; victories: number; pity: number; receipt: LegacyReceipt | null; unlocks: LegacyId[]; previous: SigilId[]; previousAnomalies: AnomalyId[]; ticket: LegacyTicket | null }
export const emptyLegacy = (): LegacyProgress => ({ version: 2, nextRunId: 1, victories: 0, pity: 0, receipt: null, unlocks: [...STARTER_ANOMALIES], previous: [], previousAnomalies: [], ticket: null });
export function validateLegacy(value: unknown): LegacyProgress {
  const result = emptyLegacy();
  if (!value || typeof value !== 'object') return result;
  const raw = value as LegacyProgress;
  result.unlocks = legacyUnlocks([...legacyUnlocks(raw.unlocks), ...STARTER_ANOMALIES]);
  const count = (n: unknown, max: number) => typeof n === 'number' && Number.isInteger(n) && n >= 0 ? Math.min(n, max) : 0;
  result.nextRunId = Math.max(1, count(raw.nextRunId, 1_000_001));
  result.victories = count(raw.victories, 1_000_000);
  result.pity = count(raw.pity, 3);
  if (raw.receipt && Number.isInteger(raw.receipt.runId) && raw.receipt.runId > 0 && raw.receipt.runId < result.nextRunId && ['victory', 'defeat'].includes(raw.receipt.result)) {
    const receipt = raw.receipt;
    const rewards = receipt.result === 'victory' && Array.isArray(receipt.rewards)
      ? [...new Set(receipt.rewards)].filter(id => LEGACY_IDS.includes(id) && result.unlocks.includes(id)).slice(0, 2) : [];
    result.receipt = { runId: receipt.runId, result: receipt.result, rewards };
  }
  result.previous = SIGILS.filter(id => Array.isArray(raw.previous) && raw.previous.includes(id));
  result.previousAnomalies = ANOMALIES.filter(id => Array.isArray(raw.previousAnomalies) && raw.previousAnomalies.includes(id));
  const ticket = raw.ticket;
  if (ticket && Number.isInteger(ticket.seed) && ticket.seed > 0 && ticket.seed <= 0xffffffff && typeof ticket.firstRun === 'boolean' && Array.isArray(ticket.offers)) {
    const offers = ticket.offers.filter(o => validLegacy(o, result.unlocks)).filter((o, i, all) => all.findIndex(other => sameLegacy(o, other)) === i).slice(0, 2).map(({ sigil, branch }) => ({ sigil, branch }));
    const runId = raw.version === 2 ? ticket.runId : result.nextRunId++;
    if (!Number.isInteger(runId) || runId <= 0 || runId >= result.nextRunId || result.receipt) return result;
    const anomalyOffers = ticket.firstRun ? [] : rollAnomalies(result.unlocks, ticket.seed, result.previousAnomalies);
    result.ticket = { anomalyOffers, anomalySelected: anomalyOffers.includes(ticket.anomalySelected!) ? ticket.anomalySelected : null, runId, seed: ticket.seed, started: ticket.started === true, firstRun: ticket.firstRun, offers: ticket.firstRun ? [] : offers,
      selected: !ticket.firstRun && validLegacy(ticket.selected, result.unlocks) && offers.some(o => sameLegacy(o, ticket.selected!)) ? { sigil: ticket.selected.sigil, branch: ticket.selected.branch } : null };
  }
  return result;
}
export function beginLegacy(state: LegacyProgress, completedOrStartedRuns: number, seed = newDraftSeed()): LegacyTicket {
  if (state.ticket) return state.ticket;
  if (state.receipt) throw new Error('Unacknowledged result');
  if (state.nextRunId > 1_000_000) throw new Error('Run cap reached');
  const firstRun = completedOrStartedRuns === 0;
  state.ticket = { anomalyOffers: firstRun ? [] : rollAnomalies(state.unlocks, seed, state.previousAnomalies), anomalySelected: null, runId: state.nextRunId++, seed, started: false, firstRun, offers: firstRun ? [] : rollLegacy(state.unlocks, seed, state.previous), selected: null };
  return state.ticket;
}
export function chooseLegacy(state: LegacyProgress, index: number): boolean {
  const ticket = state.ticket;
  if (!ticket || ticket.selected || !Number.isInteger(index)) return false;
  const offer = ticket.offers[index];
  if (!validLegacy(offer, state.unlocks)) return false;
  ticket.selected = { ...offer }; return true;
}
export function closeLegacy(state: LegacyProgress): void {
  if (state.ticket) state.previous = [...new Set(state.ticket.offers.map(o => o.sigil))];
  if (state.ticket) state.previousAnomalies = [...state.ticket.anomalyOffers];
  state.ticket = null;
}

/** Each eligible ID carries its own DD-0001 weight (not a weight per category). */
export function rollVictory(state: LegacyProgress, seed: number): LegacyId[] {
  const random = new DraftRandom(seed ^ 0x51f15e);
  const missingSigils = SIGILS.filter(id => !state.unlocks.includes(id));
  if (state.victories === 0) {
    const pool = [...missingSigils], rewards: LegacyId[] = [];
    while (pool.length && rewards.length < 2) rewards.push(pool.splice(Math.floor(random.next() * pool.length), 1)[0]);
    return rewards;
  }
  const pool = state.pity >= 3 && missingSigils.length ? missingSigils : LEGACY_IDS.filter(id =>
    !state.unlocks.includes(id) && (!Object.hasOwn(BRANCHES, id) || state.unlocks.includes(BRANCHES[id as BranchId])));
  if (!pool.length) return [];
  return [pool[weightedIndex(pool.map(id => SIGILS.includes(id as SigilId) ? 5 : ANOMALIES.includes(id as AnomalyId) ? 2 : 3), random.next)]];
}
export function finishLegacy(state: LegacyProgress, result: 'victory' | 'defeat'): boolean {
  const ticket = state.ticket;
  if (!ticket || state.receipt) return false;
  const rewards = result === 'victory' ? rollVictory(state, ticket.seed) : [];
  state.unlocks = legacyUnlocks([...state.unlocks, ...rewards]);
  if (result === 'victory') {
    state.victories = Math.min(1_000_000, state.victories + 1);
    state.pity = rewards.some(id => SIGILS.includes(id as SigilId)) ? 0 : Math.min(3, state.pity + 1);
  }
  state.receipt = { runId: ticket.runId, result, rewards };
  closeLegacy(state);
  return true;
}

/** Domain-separated ticket RNG; selecting does not consume or reroll the run/draft stream. */
export function rollAnomalies(unlocks: readonly LegacyId[], seed: number, previous: readonly AnomalyId[] = []): AnomalyId[] {
  const pool = ANOMALIES.filter(id => unlocks.includes(id)), random = new DraftRandom(seed ^ 0xa90c135);
  const offers: AnomalyId[] = [];
  while (pool.length && offers.length < 2) offers.push(pool.splice(weightedIndex(pool.map(id => previous.includes(id) ? ANOMALY.repeatWeight : 1), random.next), 1)[0]);
  return offers;
}
export function chooseAnomaly(state: LegacyProgress, index: number): boolean {
  const ticket = state.ticket;
  if (!ticket || ticket.firstRun || ticket.anomalySelected || !Number.isInteger(index)) return false;
  const id = ticket.anomalyOffers[index];
  if (!id || !state.unlocks.includes(id)) return false;
  ticket.anomalySelected = id; return true;
}
