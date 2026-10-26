import { CURSES, MUTATIONS, type BuildId, type CurseId, type DraftOption, type MutationId } from './builds.js';
import { behaviorScores, type BehaviorTag, type DraftSignals } from './DraftSignals.js';
import { DRAFT_RULES, DRAFT_TAGS, OPENING_MUTATIONS, STRONG_LINKS, SUPPORT_LINKS } from './config/draft.js';

export class DraftRandom {
  readonly seed: number;
  state: number;
  constructor(seed: number) { this.seed = this.state = (seed >>> 0) || 0x9e3779b9; }
  next = (): number => {
    let x = this.state; x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 0x100000000;
  };
}
export function newDraftSeed(): number {
  return globalThis.crypto?.getRandomValues(new Uint32Array(1))[0] || (Date.now() >>> 0) || 1;
}
export interface DraftContext {
  opening?: boolean;
  kind: 'mutation' | 'curse'; owned: readonly MutationId[]; curses: readonly CurseId[];
  pool: readonly BuildId[]; signals: DraftSignals; maxHp: number; previousOffers: readonly BuildId[];
  choices: readonly BuildId[];
}
export interface DraftDebug {
  version: number; seed: number; stateBefore: number; context: DraftContext;
  slots: { role: string; candidates: { id: BuildId; weight: number }[]; chosen: BuildId }[];
  options: DraftOption[];
}
export function weightedIndex(weights: readonly number[], random: () => number): number {
  const sum = weights.reduce((a, b) => a + b, 0);
  const draw = random();
  if (!Number.isFinite(sum) || sum <= 0 || weights.some(w => !Number.isFinite(w) || w <= 0)) {
    console.warn('Invalid draft weights; using uniform sampling');
    return Math.min(weights.length - 1, Math.floor(draw * weights.length));
  }
  let remaining = draw * sum;
  for (let i = 0; i < weights.length; i++) { remaining -= weights[i]; if (remaining < 0) return i; }
  return weights.length - 1;
}
export function buildDraft(context: DraftContext, random: DraftRandom): { options: DraftOption[]; debug: DraftDebug } {
  // Clone the minimal inputs; render/debug callers cannot mutate the sampling snapshot.
  const c: DraftContext = { ...context, curses: [...context.curses], pool: [...context.pool], owned: [...context.owned], signals: { ...context.signals }, previousOffers: [...context.previousOffers], choices: [...context.choices] };
  const debug: DraftDebug = { version: DRAFT_RULES.version, seed: random.seed, stateBefore: random.state, context: c, slots: [], options: [] };
  const canonical = c.kind === 'mutation' ? MUTATIONS : CURSES;
  const available: BuildId[] = canonical.filter(id => c.pool.includes(id) && !c.owned.includes(id as MutationId) && !c.curses.includes(id as CurseId));
  if (c.kind === 'mutation' && c.opening) {
    const options: DraftOption[] = OPENING_MUTATIONS.filter(item => available.includes(item.id))
      .map(item => ({ ...item, role: 'wildcard' }));
    debug.options = options.map(option => ({ ...option }));
    return { options, debug };
  }
  const build: BuildId[] = [...c.owned, ...c.curses];
  const scores = behaviorScores(c.signals, c.maxHp);
  const dominant = (Object.keys(scores) as BehaviorTag[]).filter(t => t !== 'need' && t !== 'movement').sort((a, b) => scores[b] - scores[a])[0];
  const hasDominant = scores[dominant] > 0;
  const ownedTags = new Set(build.flatMap(id => [...DRAFT_TAGS[id]]));
  const evidence = (id: BuildId) => {
    const tags = [...DRAFT_TAGS[id]];
    if (tags.includes('defense') || tags.includes('sustain')) tags.push('need');
    const tag = tags.sort((a, b) => scores[b] - scores[a])[0];
    return { score: scores[tag], tag };
  };
  const synergy = (id: BuildId) => {
    let score = 0, source: BuildId | undefined;
    for (const owned of build) {
      const strength = STRONG_LINKS.some(group => group.includes(id) && group.includes(owned)) ? 1
        : SUPPORT_LINKS.some(group => group.includes(id) && group.includes(owned)) ? 0.5 : 0;
      if (strength > score) { score = strength; source = owned; }
    }
    return { score, source };
  };
  const novelty = (id: BuildId) => {
    if (!hasDominant && !build.length) return 1;
    const tag = DRAFT_TAGS[id][0];
    return ((hasDominant ? tag !== dominant : true) ? 0.5 : 0) + (!ownedTags.has(tag) ? 0.5 : 0);
  };
  const options: DraftOption[] = [];
  if (c.kind === 'curse' && c.curses.length) options.push({ id: c.curses[0], role: 'curseChoice', action: 'keep' });
  const slots = c.kind === 'curse' && c.curses.length ? ['combined', 'wildcard'] : ['adaptive', 'synergy', 'wildcard'];
  for (const role of slots) {
    if (!available.length) break;
    const candidates = available.map(id => {
      const b = evidence(id).score, s = synergy(id).score;
      const boost = role === 'adaptive' ? DRAFT_RULES.adaptive * b : role === 'synergy' ? DRAFT_RULES.synergy * s
        : role === 'combined' ? DRAFT_RULES.combined * (b + s) : DRAFT_RULES.novelty * novelty(id);
      return { id, weight: (1 + boost) * (c.previousOffers.includes(id) ? DRAFT_RULES.repeat : 1) };
    });
    const index = weightedIndex(candidates.map(c => c.weight), random.next);
    const [id] = available.splice(index, 1);
    const b = evidence(id), s = synergy(id);
    const option: DraftOption = { id, role: 'wildcard' };
    if ((role === 'adaptive' || role === 'combined') && b.score > 0 && (role !== 'combined' || b.score >= s.score)) {
      option.role = 'adaptive'; option.reason = { kind: 'behavior', tag: b.tag };
    } else if ((role === 'synergy' || role === 'combined') && s.source) {
      option.role = 'synergy'; option.reason = { kind: 'synergy', id: s.source };
    }
    if (c.kind === 'curse' && c.curses.length === 2) {
      options.push({ ...option, replaceSlot: 0 }, { ...option, replaceSlot: 1 });
    } else options.push(option);
    debug.slots.push({ role, candidates, chosen: id });
  }
  debug.options = options.map(o => ({ ...o, ...(o.reason ? { reason: { ...o.reason } } : {}) }));
  return { options, debug };
}
