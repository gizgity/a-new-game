export const ARENA = { width: 1600, height: 1000, inset: 64 } as const;
export const PLAYER_RADIUS = 16;
export const PLAYER_SPEED = 260;
export const FIXED_STEP = 1 / 60;

export interface PlayerState {
  x: number;
  y: number;
  angle: number;
}

export function movePlayer(player: PlayerState, dx: number, dy: number, dt: number): void {
  const length = Math.hypot(dx, dy);
  if (length === 0) return;
  const distance = PLAYER_SPEED * dt / length;
  const edge = ARENA.inset + PLAYER_RADIUS;
  player.x = Math.max(edge, Math.min(ARENA.width - edge, player.x + dx * distance));
  player.y = Math.max(edge, Math.min(ARENA.height - edge, player.y + dy * distance));
}
