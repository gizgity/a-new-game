// Early-run tuning is separate from player damage and Elite/Boss encounters.
export const ENEMY_HP = { grunt: 66, archer: 48, volatile: 48, bulwark: 220, boss: 1500 } as const;
export const OPENING = {
  durationTicks: 3600,
  rampEndTicks: 7200,
  initialCount: 7,
  spawnIntervalTicks: 90,
  enemyCap: 18,
  hp: { grunt: 36, archer: 28, volatile: 36 },
} as const;

export const LIGHT_COMBO = [
  { windup: 4 / 60, duration: 0.24, range: 100, arc: Math.PI * 5 / 6, damage: 18, force: 18, stagger: 0.08 },
  { windup: 6 / 60, duration: 0.30, range: 112, arc: Math.PI * 10 / 9, damage: 22, force: 24, stagger: 0.10 },
  { windup: 10 / 60, duration: 0.44, range: 128, arc: Math.PI * 13 / 9, damage: 30, force: 38, stagger: 0.14 },
] as const;
export const WAVES = { packSize: 3, archerCap: 3, packSpread: 0.16, pressureInterval: 4, pressureArcherCap: 8 } as const;

export const HEAVY = { charges: 2, recharge: 8, damage: 100, finisherDamage: 140,
  windup: 0.24, duration: 0.72, range: 164, arc: Math.PI * 14 / 9, force: 80, stagger: 0.6 } as const;
export const ENEMY_GROWTH = { startSeconds: 60, endSeconds: 300, health: 1.6, damage: 1.5, speed: 1.2 } as const;

export const RANGED = { basicDamage: 20, chargedDamage: 84 } as const;
export const DRAFT_MILESTONES = [
  { kills: 25, seconds: 30, kind: 'mutation' },
  { kills: 80, seconds: 60, kind: 'curse' },
  { kills: 160, seconds: 100, kind: 'mutation' },
  { kills: 220, seconds: 140, kind: 'mutation' },
  { kills: 300, seconds: 180, kind: 'curse' },
  { kills: 380, seconds: 220, kind: 'mutation' },
] as const;
export const ENCOUNTERS = {
  elite: { kills: 200, seconds: 150 },
  boss: { kills: 450, seconds: 240 },
} as const;

// Windup locks aim; recovery is stationary and part of the existing cooldown.
export const ENEMY_ATTACK = {
  grunt: { windup: 0.42, recovery: 0.22, cooldown: 0.85, range: 70, arc: 1.7 },
  archer: { windup: 0.7, recovery: 0.4, cooldown: 1.5, range: 550, arc: 0 },
  volatile: { windup: 0.7, recovery: 0, cooldown: 1.5, range: 110, arc: Math.PI * 2 },
  bulwark: { windup: 0.65, recovery: 0.75, cooldown: 1.5, range: 100, arc: 1.7 },
} as const;
export const BOSS_ATTACK = { windup: 0.62, enragedWindup: 0.46, recovery: 0.32,
  enragedRecovery: 0.24, cooldown: 0.55, enragedCooldown: 0.38, range: 230, arc: 1.7, slamRadius: 110, leapFlight: 0.28, chaseSpeed: 300, maxLeap: 560, projectileSpeed: 430 } as const;

// Relay delay uses simulation time; damage/radii retain the M3 tuning.
export const CHAIN = { relayDelay: 4 / 60, damagePerStack: 12, radius: 105, specialistRadius: 142 } as const;

// Q5A defaults; baseline combat and the remaining Q5 checkpoints are unchanged.
export const BARRIER = { cap: 30, guardGain: 10, guardCooldown: 2,
  aegisDamage: 40, aegisGain: 4, aegisRate: 8, aegisWindow: 1,
  oathMultiplier: 1.25, oathHeavyGain: 4, oathDashMultiplier: 1.3 } as const;

export const GRUNT_LEAP = { minRange: 150, maxRange: 380, distance: 560, windup: 0.68, flight: 0.24, radius: 48, cooldown: 7, damage: 6, initialDelay: 4, initialSpread: 0.65, sparseGap: 1.6, crowdGap: 0.7, crowdThreshold: 18, maxConcurrent: 3, lead: 160 } as const;

export const BUILD = {
  phantomDuration: 3, phantomCooldown: 4, phantomDelay: 0.12, phantomDamage: 18,
  catalystSeeds: 2, frenzyDuration: 4, frenzyMultiplier: 1.25,
  specialistMultiplier: 1.25, fractureDuration: 3, fractureDamage: 20,
  staticDuration: 4, staticCooldown: 4, staticDamage: 40,
  volatileMultiplier: 1.4, hazardDelay: 0.8, hazardDamage: 8, hazardRadius: 70, hazardCooldown: 2, hazardCap: 2,
  ghostRefund: 1, ghostRisk: 1.2, bloodMultiplier: 1.3, bloodHeal: 2, bloodCooldown: 2, bloodBudget: 6, bloodMissCost: 4,
  healBudget: 8, healWindow: 10, echoDamage: 20, echoRadius: 80, echoCap: 6, hasteDuration: 3, hasteMultiplier: 1.15,
} as const;
