import type Phaser from 'phaser';
import type { CombatWorld } from './combat';
export function drawLegacy(g: Phaser.GameObjects.Graphics, w: CombatWorld): void {
  for (const e of w.enemies) {
    const state = w.legacy.targets.get(e.id);
    if (state?.ignite) g.lineStyle(1, 0xffbd62, 0.8).strokeCircle(e.x, e.y, 18);
    if ((state?.soaked ?? 0) > 0) g.lineStyle(1, 0x74e8fc, 0.7).strokeEllipse(e.x, e.y + 12, 32, 10);
    if ((state?.frost ?? 0) > 0) {
      g.fillStyle(0x91b5ff, 0.9);
      for (let i = 0; i < state!.frost; i++) g.fillRect(e.x - 7 + i * 5, e.y + 22, 3, 3);
    }
    if (w.legacy.mark?.id === e.id) g.lineStyle(1, 0xcab1fa, 0.9).strokeRect(e.x - 19, e.y - 19, 38, 38);
  }
  for (const shot of w.legacy.projectiles) {
    g.lineStyle(2, shot.kind === 'ice' ? 0x91b5ff : 0x9dffe2, 0.8);
    g.lineBetween(shot.x, shot.y, shot.x - Math.cos(shot.angle) * 13, shot.y - Math.sin(shot.angle) * 13);
  }
}
