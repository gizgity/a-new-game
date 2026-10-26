import type { CurseId, MutationId } from '../builds';
// Explicit build fixtures for device playtest; never grant persistent unlocks/stats.
export const PLAYTEST_BUILDS = [
  { id: 'sustain', label: 'sustainTest', mutations: ['bloodReclaimer', 'catalyst'], curse: 'parasiticMark' },
  { id: 'anchor', label: 'anchorTest', mutations: ['ironReversal', 'soulAnchor'], curse: 'bloodPact' },
  { id: 'chamber', label: 'chamberTest', mutations: ['echoChamber', 'catalyst'], curse: 'deathEcho' },
  { id: 'glass', label: 'glassTest', mutations: ['kineticBattery', 'staticRiposte'], curse: 'glassSoul' },
  { id: 'hunted', label: 'huntedTest', mutations: ['kineticBattery', 'bloodReclaimer'], curse: 'huntedVessel' },
  { id: 'juggernaut', label: 'juggernautTest', mutations: ['guardBreaker', 'aegisCore'], curse: 'ironOath' },
  { id: 'counter', label: 'counterTest', mutations: ['phantomEdge', 'staticRiposte'], curse: 'ghostStep' },
  { id: 'chain', label: 'chainTest', mutations: ['catalyst', 'detonationSpecialist'], curse: 'volatileSoul' },
  { id: 'frenzy', label: 'frenzyTest', mutations: ['berserker'], curse: 'bloodPact' },
  { id: 'tank', label: 'tankTest', mutations: ['guardBreaker', 'aegisCore', 'berserker'], curse: 'bloodPact' },
  { id: 'echo', label: 'echoTest', mutations: ['catalyst'], curse: 'deathEcho' },
] as const satisfies readonly { id: string; label: string; mutations: readonly MutationId[]; curse: CurseId }[];

// Q5E: guide actual milestone choices; no resources/build are granted at run start.
export const DIVERSITY_ROUTES = [
  { id: 'route-tank', label: 'tankRoute', mutations: ['aegisCore', 'guardBreaker', 'ironReversal', 'kineticBattery'], curse: 'ironOath' },
  { id: 'route-sustain', label: 'sustainRoute', mutations: ['catalyst', 'bloodReclaimer', 'echoChamber', 'kineticBattery'], curse: 'parasiticMark' },
  { id: 'route-counter', label: 'counterRoute', mutations: ['phantomEdge', 'staticRiposte', 'ironReversal', 'kineticBattery'], curse: 'ghostStep' },
  { id: 'route-ranged', label: 'rangedRoute', mutations: ['detonationSpecialist', 'echoChamber', 'catalyst', 'kineticBattery'], curse: 'glassSoul' },
] as const satisfies readonly { id: string; label: string; mutations: readonly MutationId[]; curse: CurseId }[];

export function routeDraft(
  route: { mutations: readonly MutationId[]; curse: CurseId }, kind: 'mutation' | 'curse',
  owned: readonly MutationId[], current: CurseId | null, sampled: readonly import('../builds').DraftOption[],
): import('../builds').DraftOption[] {
  const desired = kind === 'curse' ? route.curse : route.mutations.find(id => !owned.includes(id));
  if (!desired || kind === 'mutation' && owned.length >= 4) return [...sampled];
  const choices: import('../builds').DraftOption[] = [];
  if (kind === 'curse' && current) choices.push({ id: current, role: 'curseChoice' });
  if (desired !== current) choices.push({ id: desired, role: 'wildcard' });
  for (const option of sampled) if (!choices.some(c => c.id === option.id) && !owned.includes(option.id as MutationId)) choices.push(option);
  return choices.slice(0, 3);
}
