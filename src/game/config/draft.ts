import type { BuildId } from '../builds.js';
import type { BehaviorTag } from '../DraftSignals.js';
// First tag is the primary style used by Wildcard novelty.
export const DRAFT_TAGS: Record<BuildId, readonly BehaviorTag[]> = {
  phantomEdge: ['perfect', 'melee'], catalyst: ['chain', 'ranged'], berserker: ['melee'],
  detonationSpecialist: ['ranged', 'chain'], staticRiposte: ['perfect', 'ranged'],
  guardBreaker: ['heavy', 'defense'], aegisCore: ['defense', 'melee'],
  bloodReclaimer: ['sustain', 'chain'], ironReversal: ['heavy', 'defense'], soulAnchor: ['defense'],
  echoChamber: ['chain'], kineticBattery: ['movement', 'defense'],
  volatileSoul: ['chain'], ghostStep: ['perfect', 'movement'], bloodPact: ['melee', 'sustain'],
  deathEcho: ['chain'], ironOath: ['defense', 'heavy'], glassSoul: ['ranged'],
  parasiticMark: ['sustain', 'chain'], huntedVessel: ['movement'],
};
export const STRONG_LINKS: readonly (readonly BuildId[])[] = [
  ['guardBreaker', 'aegisCore', 'ironOath'], ['phantomEdge', 'staticRiposte', 'ghostStep'],
  ['catalyst', 'detonationSpecialist', 'echoChamber', 'deathEcho'], ['bloodReclaimer', 'parasiticMark'],
  ['berserker', 'bloodPact', 'aegisCore'], ['glassSoul', 'staticRiposte', 'detonationSpecialist'],
  ['kineticBattery', 'ghostStep', 'huntedVessel'],
  ['ironReversal', 'guardBreaker', 'bloodPact'], ['soulAnchor', 'kineticBattery', 'bloodReclaimer'],
];
export const SUPPORT_LINKS: readonly (readonly BuildId[])[] = [
  ['bloodReclaimer', 'catalyst', 'phantomEdge'], ['parasiticMark', 'catalyst', 'detonationSpecialist'],
  ['volatileSoul', 'catalyst', 'echoChamber'], ['ironReversal', 'aegisCore'],
  ['huntedVessel', 'bloodReclaimer', 'echoChamber'],
];
export const DRAFT_RULES = { version: 1, adaptive: 3, synergy: 3, combined: 1.5, novelty: 2, repeat: 0.4 } as const;
