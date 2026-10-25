export const MUTATIONS = ['phantomEdge', 'catalyst', 'berserker', 'detonationSpecialist', 'staticRiposte', 'guardBreaker', 'aegisCore'] as const;
export const CURSES = ['volatileSoul', 'ghostStep', 'bloodPact', 'deathEcho', 'ironOath'] as const;
export type MutationId = typeof MUTATIONS[number];
export type CurseId = typeof CURSES[number];
export type BuildId = MutationId | CurseId;
export interface DraftOption { id: BuildId; role: 'adaptive' | 'synergy' | 'wildcard' | 'curseChoice' }
export interface CombatStats { melee: number; shots: number; dashes: number }

export function mutationDraft(
  owned: readonly MutationId[], stats: CombatStats, detonations: number,
  pool: readonly MutationId[] = MUTATIONS, random: () => number = Math.random,
): DraftOption[] {
  const available = pool.filter((id) => !owned.includes(id));
  const preferred: MutationId = stats.shots > stats.melee ? 'catalyst' : stats.dashes > stats.melee ? 'staticRiposte' : 'phantomEdge';
  const synergy: MutationId = detonations > 2 || owned.includes('catalyst') ? 'detonationSpecialist' : owned.includes('phantomEdge') ? 'catalyst' : 'guardBreaker';
  const pick = (desired: MutationId): MutationId => {
    const index = available.includes(desired) ? available.indexOf(desired) : Math.floor(random() * available.length);
    return available.splice(index, 1)[0];
  };
  const choices: DraftOption[] = [];
  if (available.length) choices.push({ id: pick(preferred), role: 'adaptive' });
  if (available.length) choices.push({ id: pick(synergy), role: 'synergy' });
  if (available.length) choices.push({ id: pick(available[Math.floor(random() * available.length)]), role: 'wildcard' });
  return choices;
}

export function curseDraft(pool: readonly CurseId[] = CURSES, random: () => number = Math.random): DraftOption[] {
  return [...pool].map((id) => ({ id, weight: random() }))
    .sort((a, b) => a.weight - b.weight).slice(0, 3).map(({ id }) => ({ id, role: 'curseChoice' }));
}
