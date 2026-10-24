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
export const WAVES = { packSize: 3, archerCap: 3, packSpread: 0.16 } as const;

export const HEAVY = { charges: 2, recharge: 8, damage: 100, finisherDamage: 140,
  windup: 0.24, duration: 0.72, range: 164, arc: Math.PI * 14 / 9, force: 80, stagger: 0.6 } as const;
export const ENEMY_GROWTH = { startSeconds: 60, endSeconds: 300, health: 1.6, damage: 1.5, speed: 1.2 } as const;

export const RANGED = { basicDamage: 20, chargedDamage: 84 } as const;
export const DRAFT_KILLS = [25, 80, 160] as const;
