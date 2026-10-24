// Early-run tuning is separate from player damage and Elite/Boss encounters.
export const ENEMY_HP = { grunt: 66, archer: 48, volatile: 48, bulwark: 220, boss: 1500 } as const;
export const OPENING = {
  durationTicks: 3600,
  rampEndTicks: 7200,
  initialCount: 3,
  spawnIntervalTicks: 150,
  enemyCap: 8,
  hp: { grunt: 36, archer: 28, volatile: 36 },
} as const;
