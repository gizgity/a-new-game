export const MUTATIONS = ['phantomEdge', 'catalyst', 'berserker', 'detonationSpecialist', 'staticRiposte', 'guardBreaker', 'aegisCore', 'bloodReclaimer', 'ironReversal', 'soulAnchor', 'echoChamber', 'kineticBattery'] as const;
export const CURSES = ['volatileSoul', 'ghostStep', 'bloodPact', 'deathEcho', 'ironOath', 'glassSoul', 'parasiticMark', 'huntedVessel'] as const;
export type MutationId = typeof MUTATIONS[number];
export type CurseId = typeof CURSES[number];
export type BuildId = MutationId | CurseId;
export interface DraftOption {
  id: BuildId; role: 'adaptive' | 'synergy' | 'wildcard' | 'curseChoice';
  reason?: { kind: 'behavior'; tag: import('./DraftSignals.js').BehaviorTag } | { kind: 'synergy'; id: BuildId };
}
export interface CombatStats { melee: number; shots: number; dashes: number }
