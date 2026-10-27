/** Q9C provisional tuning — damage/radius/frequency/cooldown await playtest, not approved balance. */
export const ANOMALY = {
  offerSeconds: 135, repeatWeight: 0.65,
  storm: { interval: 5, telegraph: 1.3, radius: 64, enemyDamage: 38, playerDamage: 12 },
  blood: { cooldown: 2.5, charge: 1, pursuit: 1.18 },
  ground: { interval: 6, telegraph: 1.4, radius: 70, damage: 14, detonateRadius: 1.3 },
  static: { cooldown: 2, damage: 20, radius: 175, targets: 4, volleyCooldown: 2, spread: 0.2 },
  seal: { stagger: 0.25, force: 20, resistance: 0.65 },
  echo: { range: 180, extraTargets: 1, cooldown: 0.5, telegraph: 1.2, radius: 50, damage: 10 },
  zoneCap: 2,
} as const;
