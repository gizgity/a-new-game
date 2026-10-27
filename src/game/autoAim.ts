export type AutoAimPriority = 'nearest' | 'archer' | 'elite';
interface Position { x: number; y: number }
interface AimTarget extends Position { hp: number; rupture: number; kind: string }
/** Desktop: Rupture, preferred group, then nearest; stable nearest ties within each tier. */
export function autoAimTarget<T extends AimTarget>(player: Position, enemies: readonly T[], priority: AutoAimPriority): T | undefined {
  let target: T | undefined;
  let bestTier = Infinity, bestDistance = Infinity;
  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue;
    const distance = (enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2;
    if (distance === 0) continue;
    const preferred = priority === 'archer' ? enemy.kind === 'archer'
      : priority === 'elite' ? enemy.kind === 'bulwark' || enemy.kind === 'boss' : true;
    const tier = enemy.rupture > 0 ? 0 : preferred ? 1 : 2;
    if (tier < bestTier || tier === bestTier && distance < bestDistance) {
      target = enemy; bestTier = tier; bestDistance = distance;
    }
  }
  return target;
}
