import type Phaser from 'phaser';
import type { CombatWorld } from './combat';

// Attached to the player like the other resource cues; no extra particle queue.
export function drawBarrier(g: Phaser.GameObjects.Graphics, world: CombatWorld): void {
  const barrier = world.barrier;
  if (barrier.value <= 0 && barrier.flash <= 0) return;
  const flash = barrier.flash / 0.35;
  const radius = barrier.broken ? 23 + (1 - flash) * 18 : 24;
  const alpha = barrier.broken ? flash : 0.22 + flash * 0.5;
  const color = world.curse === 'ironOath' ? 0xb1dce8 : 0x63d9f5;
  g.lineStyle(2, color, alpha);
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    g.lineBetween(world.player.x + Math.cos(angle - 0.22) * radius, world.player.y + Math.sin(angle - 0.22) * radius,
      world.player.x + Math.cos(angle + 0.22) * radius, world.player.y + Math.sin(angle + 0.22) * radius);
  }
}
