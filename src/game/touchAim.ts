interface Position { x: number; y: number }
/** Mobile assistance only. A deliberate drag wins; no target keeps the last direction. */
export function touchAim(player: Position, enemies: readonly (Position & { hp: number })[], manual: number | null, fallback: number): number {
  if (manual !== null) return manual;
  let nearest: Position | undefined;
  let distance = Infinity;
  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue;
    const d = (enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2;
    if (d > 0 && d < distance) { distance = d; nearest = enemy; }
  }
  return nearest ? Math.atan2(nearest.y - player.y, nearest.x - player.x) : fallback;
}
