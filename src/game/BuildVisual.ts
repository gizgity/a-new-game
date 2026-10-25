import type Phaser from 'phaser';
import type { CombatWorld, Impact } from './combat';
import { BUILD } from './config/balance';
type Graphics = Phaser.GameObjects.Graphics;

export function drawBuildCues(g: Graphics, world: CombatWorld): void {
  for (const hazard of world.build.hazards) {
    const progress = 1 - hazard.time / BUILD.hazardDelay;
    g.lineStyle(2, 0xff9b63, 0.9).strokeCircle(hazard.x, hazard.y, BUILD.hazardRadius);
    g.lineStyle(2, 0xff9b63, 0.5).strokeCircle(hazard.x, hazard.y, BUILD.hazardRadius * progress);
    for (let i = -2; i <= 2; i++) g.lineBetween(hazard.x - 18 + i * 8, hazard.y + 9, hazard.x - 4 + i * 8, hazard.y - 9);
  }
  for (const enemy of world.enemies) {
    if (enemy.fracture > 0) g.lineStyle(2, 0xffcc80, 0.9).strokePoints([
      { x: enemy.x + 22, y: enemy.y - 16 }, { x: enemy.x + 16, y: enemy.y - 7 },
      { x: enemy.x + 24, y: enemy.y - 4 }, { x: enemy.x + 19, y: enemy.y + 5 },
    ], false);
    if (enemy.echoHaste > 0) for (let i = 0; i < 2; i++) g.lineStyle(2, 0xff6f87, 0.6).strokePoints([
      { x: enemy.x - 9 - i * 6, y: enemy.y + 23 }, { x: enemy.x - 3 - i * 6, y: enemy.y + 19 }, { x: enemy.x - 9 - i * 6, y: enemy.y + 15 },
    ], false);
  }
  const { x, y } = world.player;
  if (world.build.frenzy > 0) g.lineStyle(2, 0xffcc80, 0.65).strokePoints([{ x: x - 18, y: y - 18 }, { x, y: y - 25 }, { x: x + 18, y: y - 18 }], false);
  if (world.build.staticCharge > 0) g.lineStyle(2, 0xc399ff, 0.9).strokePoints([{ x: x + 23, y: y - 14 }, { x: x + 17, y: y - 3 }, { x: x + 25, y: y - 4 }, { x: x + 19, y: y + 7 }], false);
  if (world.build.phantom > 0) g.lineStyle(1.5, 0x9dffe2, 0.65).lineBetween(x - 23, y - 10, x - 14, y + 12);
  if (world.build.healFlash > 0) {
    const fade = world.build.healFlash / 0.5;
    g.lineStyle(2, 0xff879a, fade).lineBetween(x - 7, y - 32 - (1 - fade) * 12, x + 7, y - 32 - (1 - fade) * 12);
    g.lineBetween(x, y - 39 - (1 - fade) * 12, x, y - 25 - (1 - fade) * 12);
  }
  for (const shot of world.projectiles) if (shot.staticBonus) g.lineStyle(1.5, 0xc399ff, 0.9).strokePoints([
    { x: shot.x - 8, y: shot.y - 7 }, { x: shot.x + 2, y: shot.y + 1 }, { x: shot.x - 2, y: shot.y + 6 },
  ], false);
}

export function drawBuildImpact(g: Graphics, impact: Impact): boolean {
  const fade = impact.life / (impact.duration ?? 0.18);
  if (impact.kind === 'seed') {
    g.lineStyle(1, 0x6bf3d0, fade * 0.7).lineBetween(impact.sourceX ?? impact.x, impact.sourceY ?? impact.y, impact.x, impact.y);
    g.lineStyle(2, 0x6bf3d0, fade).strokePoints([{ x: impact.x, y: impact.y - 7 }, { x: impact.x + 7, y: impact.y }, { x: impact.x, y: impact.y + 7 }, { x: impact.x - 7, y: impact.y }], true);
  } else if (impact.kind === 'echo') {
    g.lineStyle(1.5, 0xc399ff, fade).strokeCircle(impact.x, impact.y, (impact.radius ?? 80) * (1 - fade));
  } else if (impact.kind === 'phantom') {
    const angle = impact.angle ?? 0, radius = (impact.radius ?? 100) * (0.85 + 0.15 * (1 - fade));
    g.lineStyle(3, 0x9dffe2, fade * 0.7).beginPath().arc(impact.x, impact.y, radius, angle - (impact.arc ?? 1.7) / 2, angle + (impact.arc ?? 1.7) / 2).strokePath();
  } else return false;
  return true;
}
