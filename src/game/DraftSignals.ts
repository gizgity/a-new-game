/** Run-local counters; draft windows take differences, so queued effects keep their provenance. */
export const draftSignals = () => ({
  meleeDamage: 0, rangedDamage: 0, meleeHits: 0, rangedHits: 0,
  dashes: 0, perfects: 0, markedTriggers: 0, relayTriggers: 0, chainTargets: 0,
  heavies: 0, heavySuccess: 0, absorbed: 0, enemyHpDamage: 0, healed: 0,
});
export type DraftSignals = ReturnType<typeof draftSignals>;
export type BehaviorTag = 'melee' | 'ranged' | 'perfect' | 'chain' | 'heavy' | 'defense' | 'sustain' | 'movement' | 'need';
export function signalWindow(current: DraftSignals, previous: DraftSignals): DraftSignals {
  const result = draftSignals();
  for (const key of Object.keys(result) as (keyof DraftSignals)[]) result[key] = Math.max(0, current[key] - previous[key]);
  return result;
}
export function behaviorScores(s: DraftSignals, maxHp: number): Record<BehaviorTag, number> {
  const ratio = (a: number, b: number) => b > 0 ? Math.max(0, Math.min(1, a / b)) : 0;
  const damage = s.meleeDamage + s.rangedDamage;
  const perfect = s.dashes >= 3 ? ratio(s.perfects, s.dashes) * Math.min(1, s.dashes / 6) : 0;
  return {
    melee: s.meleeHits >= 3 ? ratio(s.meleeDamage, damage) * Math.min(1, s.meleeHits / 6) : 0,
    ranged: s.rangedHits >= 3 ? ratio(s.rangedDamage, damage) * Math.min(1, s.rangedHits / 6) : 0,
    perfect, movement: perfect,
    chain: s.markedTriggers >= 3 && s.chainTargets > 0 ? ratio(s.relayTriggers, s.markedTriggers) * Math.min(1, s.markedTriggers / 6) : 0,
    heavy: s.heavies >= 2 ? ratio(s.heavySuccess, s.heavies) * Math.min(1, s.heavies / 4) : 0,
    defense: ratio(s.absorbed, s.absorbed + s.enemyHpDamage),
    sustain: ratio(s.healed, s.healed + s.enemyHpDamage),
    need: 0.25 * ratio(s.enemyHpDamage, maxHp),
  };
}
