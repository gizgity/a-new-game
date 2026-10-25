import type { CurseId, MutationId } from '../builds';
// Explicit build fixtures for device playtest; never grant persistent unlocks/stats.
export const PLAYTEST_BUILDS = [
  { id: 'juggernaut', label: 'juggernautTest', mutations: ['guardBreaker', 'aegisCore'], curse: 'ironOath' },
  { id: 'counter', label: 'counterTest', mutations: ['phantomEdge', 'staticRiposte'], curse: 'ghostStep' },
  { id: 'chain', label: 'chainTest', mutations: ['catalyst', 'detonationSpecialist'], curse: 'volatileSoul' },
  { id: 'frenzy', label: 'frenzyTest', mutations: ['berserker'], curse: 'bloodPact' },
  { id: 'tank', label: 'tankTest', mutations: ['guardBreaker', 'aegisCore', 'berserker'], curse: 'bloodPact' },
  { id: 'echo', label: 'echoTest', mutations: ['catalyst'], curse: 'deathEcho' },
] as const satisfies readonly { id: string; label: string; mutations: readonly MutationId[]; curse: CurseId }[];
