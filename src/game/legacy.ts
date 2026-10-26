import { SIGILS, BRANCHES, legacyUnlocks, validLegacy, sameLegacy, type LegacyId, type LegacyOffer, type SigilId, type BranchId } from './config/legacy.js';
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
export interface LegacyTicket { seed: number; offers: LegacyOffer[]; selected: LegacyOffer | null; firstRun: boolean }
export interface LegacyProgress { unlocks: LegacyId[]; previous: SigilId[]; ticket: LegacyTicket | null }
export const emptyLegacy = (): LegacyProgress => ({ unlocks: [], previous: [], ticket: null });
export function validateLegacy(value: unknown): LegacyProgress {
  const result = emptyLegacy();
  if (!value || typeof value !== 'object') return result;
  const raw = value as LegacyProgress;
  result.unlocks = legacyUnlocks(raw.unlocks);
  result.previous = SIGILS.filter(id => Array.isArray(raw.previous) && raw.previous.includes(id));
  const ticket = raw.ticket;
  if (ticket && Number.isInteger(ticket.seed) && ticket.seed > 0 && ticket.seed <= 0xffffffff && typeof ticket.firstRun === 'boolean' && Array.isArray(ticket.offers)) {
    const offers = ticket.offers.filter(o => validLegacy(o, result.unlocks)).filter((o, i, all) => all.findIndex(other => sameLegacy(o, other)) === i).slice(0, 2).map(({ sigil, branch }) => ({ sigil, branch }));
    result.ticket = { seed: ticket.seed, firstRun: ticket.firstRun, offers: ticket.firstRun ? [] : offers,
      selected: !ticket.firstRun && validLegacy(ticket.selected, result.unlocks) && offers.some(o => sameLegacy(o, ticket.selected!)) ? { sigil: ticket.selected.sigil, branch: ticket.selected.branch } : null };
  }
  return result;
}
export function beginLegacy(state: LegacyProgress, completedOrStartedRuns: number, seed = newDraftSeed()): LegacyTicket {
  if (state.ticket) return state.ticket;
  const firstRun = completedOrStartedRuns === 0;
  state.ticket = { seed, firstRun, offers: firstRun ? [] : rollLegacy(state.unlocks, seed, state.previous), selected: null };
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
  state.ticket = null;
}
