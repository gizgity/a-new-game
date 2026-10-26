/** DD-0001 catalog. IDs only are saved; combat derives tuning from this catalog. */
export const SIGILS = ['fire', 'water', 'lightning', 'ice', 'shadow', 'wind'] as const;
export type SigilId = typeof SIGILS[number];
export const BRANCHES = {
  wildfire: 'fire', furnace: 'fire', undertow: 'water', flowState: 'water',
  arcRelay: 'lightning', overclock: 'lightning', brittle: 'ice', crystalEcho: 'ice',
  nightfall: 'shadow', veilstep: 'shadow', tailwind: 'wind', cyclone: 'wind',
} as const satisfies Record<string, SigilId>;
export type BranchId = keyof typeof BRANCHES;
export type LegacyId = SigilId | BranchId;
export interface LegacyOffer { sigil: SigilId; branch: BranchId | null }
export const LEGACY_IDS: readonly LegacyId[] = [...SIGILS, ...Object.keys(BRANCHES) as BranchId[]];
export function legacyUnlocks(value: unknown): LegacyId[] {
  const ids = LEGACY_IDS.filter(id => Array.isArray(value) && value.includes(id));
  return ids.filter(id => SIGILS.includes(id as SigilId) || ids.includes(BRANCHES[id as BranchId]));
}
export function validLegacy(value: unknown, unlocks: readonly LegacyId[] = LEGACY_IDS): value is LegacyOffer {
  if (!value || typeof value !== 'object') return false;
  const { sigil, branch } = value as LegacyOffer;
  return SIGILS.includes(sigil) && unlocks.includes(sigil) &&
    (branch === null || Object.hasOwn(BRANCHES, branch) && BRANCHES[branch] === sigil && unlocks.includes(branch));
}
export function sameLegacy(a: LegacyOffer, b: LegacyOffer): boolean { return a.sigil === b.sigil && a.branch === b.branch; }
