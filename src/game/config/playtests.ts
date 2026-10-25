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
