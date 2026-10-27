/** Q9D implementation proposal; values remain provisional until playtest. */
export const ASCENSION = {
  maxSeal: 4,
  pulse: { interval: 35, warning: 1.5, active: 0.5, radius: 48, offset: 92, playerDamage: 12, enemyDamage: 24, cap: 1 },
  hunter: { threshold: 5, warning: 0.8, duration: 4, cooldown: 12, tolerance: 36, groupRadius: 500, lead: 0.45, minMotion: 0.1 },
  fracture: { scale: 0.5, penalty: 1.1, duration: 25, eligible: ['staticRiposte'] as readonly string[] },
  echo: { warning: 1.3, cooldown: 12, radius: 52, damage: 26 * 0.5, cap: 1 },
} as const;
