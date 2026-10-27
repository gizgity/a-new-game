/** DD-0001 catalog. IDs only are saved; combat derives tuning from this catalog. */
export const SIGILS = ['fire', 'water', 'lightning', 'ice', 'shadow', 'wind'] as const;
export type SigilId = typeof SIGILS[number];
export const BRANCHES = {
  wildfire: 'fire', furnace: 'fire', undertow: 'water', flowState: 'water',
  arcRelay: 'lightning', overclock: 'lightning', brittle: 'ice', crystalEcho: 'ice',
  nightfall: 'shadow', veilstep: 'shadow', tailwind: 'wind', cyclone: 'wind',
} as const satisfies Record<string, SigilId>;
export type BranchId = keyof typeof BRANCHES;
export const ANOMALIES = ['fracturedStorm', 'bloodMoon', 'volatileGround', 'staticField', 'brokenSeal', 'echoChamber'] as const;
export type AnomalyId = typeof ANOMALIES[number];
export const STARTER_ANOMALIES: readonly AnomalyId[] = ['fracturedStorm', 'bloodMoon'];
export type LegacyId = SigilId | BranchId | AnomalyId;
export interface LegacyOffer { sigil: SigilId; branch: BranchId | null }
export const LEGACY_IDS: readonly LegacyId[] = [...SIGILS, ...Object.keys(BRANCHES) as BranchId[], ...ANOMALIES];
export function legacyUnlocks(value: unknown): LegacyId[] {
  const ids = LEGACY_IDS.filter(id => Array.isArray(value) && value.includes(id));
  return ids.filter(id => SIGILS.includes(id as SigilId) || ANOMALIES.includes(id as AnomalyId) || ids.includes(BRANCHES[id as BranchId]));
}
export function validLegacy(value: unknown, unlocks: readonly LegacyId[] = LEGACY_IDS): value is LegacyOffer {
  if (!value || typeof value !== 'object') return false;
  const { sigil, branch } = value as LegacyOffer;
  return SIGILS.includes(sigil) && unlocks.includes(sigil) &&
    (branch === null || Object.hasOwn(BRANCHES, branch) && BRANCHES[branch] === sigil && unlocks.includes(branch));
}
export function sameLegacy(a: LegacyOffer, b: LegacyOffer): boolean { return a.sigil === b.sigil && a.branch === b.branch; }

/** Q9A initial tuning, not approved balance. All clocks are simulation seconds. */
export const LEGACY = {
  rootBudget: 96, depthCap: 12, eventsPerTick: 16, queueCap: 96, projectileCap: 12, targetCap: 12,
  attackSpeedCap: 0.35, minLightRecovery: 0.08, minShotInterval: 0.12, speedCap: 1.35, eliteImmunity: 2,
  fire: { damage: 5, interval: 0.5, duration: 3, spreadDamage: 4, spreadDuration: 2, spreadRadius: 150, spreadTargets: 3, spreadCooldown: 1, furnaceDamage: 32, furnaceRadius: 120, furnaceCooldown: 1.5 },
  water: { duration: 3, slow: 0.75, force: 36, knockCooldown: 0.8, refund: 2, flowCooldown: 2 },
  lightning: { chargeDuration: 5, grantCooldown: 1, dischargeCooldown: 0.8, damage: 18, jumps: 2, range: 180, delay: 0.07, haste: 0.2, hasteDuration: 2 },
  ice: { threshold: 3, window: 2.5, damage: 30, shatterCooldown: 0.6, breakDuration: 2, interruptCooldown: 1.5, echoDamage: 18, echoDelay: 0.08, echoSpeed: 650, echoRange: 420, echoLifetime: 0.8, echoCooldown: 1 },
  shadow: { range: 400, cone: Math.PI * 0.75, markDuration: 4, grantCooldown: 1, damage: 26, ambushCooldown: 0.8, nightDamage: 20, nightDelay: 0.15, nightRange: 450, nightCooldown: 1, speed: 1.25, speedDuration: 2, speedCooldown: 1 },
  wind: { distance: 2, cap: 100, threshold: 60, proximity: 450, grace: 0.8, decay: 30, damage: 24, speed: 700, range: 380, lifetime: 0.7, pierce: 3, cooldown: 0.8, haste: 0.2, hasteDuration: 2, force: 42, knockCooldown: 1 },
} as const;
