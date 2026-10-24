import type Phaser from 'phaser';
import type { Impact, Projectile } from './combat';

const AMBER = 0xffbd62;
const WHITE = 0xfff5db;

/** Small presentation helpers; geometry never changes collision or damage radius. */
export function drawChargedProjectile(g: Phaser.GameObjects.Graphics, shot: Projectile): void {
  const angle = Math.atan2(shot.vy, shot.vx);
  const point = (forward: number, side: number) => ({
    x: shot.x + Math.cos(angle) * forward - Math.sin(angle) * side,
    y: shot.y + Math.sin(angle) * forward + Math.cos(angle) * side,
  });
  g.fillStyle(AMBER, 0.25).fillPoints([point(10, 0), point(-14, -8), point(-60, 0), point(-14, 8)], true);
  g.lineStyle(3, AMBER, 0.85).strokePoints([point(-48, 0), point(-22, 0)], false);
  g.fillStyle(AMBER).fillPoints([point(12, 0), point(-2, -6), point(-18, 0), point(-2, 6)], true);
  g.fillStyle(WHITE).fillPoints([point(10, 0), point(-3, -2), point(-24, 0), point(-3, 2)], true);
  for (const side of [-1, 1]) {
    g.fillStyle(AMBER, 0.65).fillPoints([point(-22, side * 6), point(-32, side * 9), point(-42, side * 6)], true);
  }
}

export function drawChargedImpact(g: Phaser.GameObjects.Graphics, impact: Impact): void {
  const blast = impact.kind === 'chargedBlast';
  const age = 1 - impact.life / (impact.duration ?? 0.24);
  const fade = Math.max(0, 1 - age);
  // Contact-only bloom stays small; only a real Detonate displays the full AoE.
  const radius = blast ? impact.radius ?? 105 : 30;
  const expansion = 1 - (1 - Math.min(1, age / 0.42)) ** 3;
  const front = radius * (0.2 + expansion * 0.8);
  const angle = impact.angle ?? 0;
  const polar = (a: number, r: number) => ({ x: impact.x + Math.cos(a) * r, y: impact.y + Math.sin(a) * r });
  const ring = (r: number) => Array.from({ length: 12 }, (_, i) => polar(angle + i * Math.PI / 6, r * (i % 2 ? 0.94 : 1)));
  // Local flash, then an open, fractured pressure front. Interior stays transparent.
  if (age < 0.32) g.fillStyle(AMBER, (1 - age / 0.32) * 0.18).fillPoints(ring(front), true);
  g.lineStyle(blast ? 5 : 3, AMBER, fade * 0.9);
  for (let i = 0; i < 4; i++) {
    const start = angle + i * Math.PI / 2;
    g.strokePoints([polar(start + 0.1, front), polar(start + 0.45, front * 0.94),
      polar(start + 0.8, front), polar(start + 1.15, front * 0.94)], false);
  }
  g.lineStyle(1.5, WHITE, fade * fade).strokePoints(ring(front * 0.82), true);
  const core = (blast ? 42 : 16) * Math.max(0, 1 - age / 0.45);
  if (core > 0) {
    g.fillStyle(WHITE, Math.min(1, fade * 1.3)).fillPoints([
      polar(angle, core), polar(angle + Math.PI / 2, core * 0.55),
      polar(angle + Math.PI, core), polar(angle - Math.PI / 2, core * 0.55),
    ], true);
  }
  if (blast && age < 0.4) {
    g.lineStyle(2.5, WHITE, 1 - age / 0.4);
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 + 0.2;
      g.strokePoints([polar(a, core), polar(a + 0.09, radius * 0.4), polar(a, radius * 0.68)], false);
    }
  }
  // Eight short, tapered fracture shards stay inside the real radius.
  for (let i = 0; i < 8; i++) {
    const a = angle + i * Math.PI / 4 + 0.16;
    const tip = radius * (0.3 + 0.7 * Math.min(1, age / 0.7));
    const tail = Math.max(0, tip - (blast ? 26 : 12) * fade);
    g.fillStyle(i % 2 ? AMBER : WHITE, fade * 0.85).fillPoints([
      polar(a, tip), polar(a - 0.035, tail), polar(a + 0.035, tail),
    ], true);
  }
}
