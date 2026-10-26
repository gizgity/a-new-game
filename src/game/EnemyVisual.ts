import type Phaser from 'phaser';
import { COMBAT, type CombatWorld, type Enemy } from './combat';
import { BOSS_ATTACK, ENEMY_ATTACK, GRUNT_LEAP } from './config/balance';

type Graphics = Phaser.GameObjects.Graphics;
const COLORS = { grunt: 0xff6f87, archer: 0xc399ff, volatile: 0xffb36b, bulwark: 0x91b5ff, boss: 0xffcc80 };

function sector(g: Graphics, x: number, y: number, radius: number, angle: number, arc: number): void {
  g.beginPath().moveTo(x, y).arc(x, y, radius, angle - arc / 2, angle + arc / 2).closePath().fillPath().strokePath();
}

// Grunt uses shape as well as color: dashed preparation, solid imminent cue,
// then a brief strike flash. A fading slash never leaves a filled warning in recovery.
function drawGruntTelegraph(g: Graphics, e: Enemy, world: CombatWorld): void {
  const { range, arc } = ENEMY_ATTACK.grunt;
  const start = e.angle - arc / 2;
  if (e.windup > 0) {
    const imminent = e.windup + e.stagger <= COMBAT.perfectWindow;
    const eligible = world.isImminentEnemyThreat(e);
    const color = eligible ? 0xffe599 : COLORS.grunt;
    const progress = Math.max(0, Math.min(1, 1 - e.windup / (e.windupDuration || ENEMY_ATTACK.grunt.windup)));
    g.fillStyle(color, 0).lineStyle(imminent ? 3 : 1.5, color, imminent ? 1 : 0.5);
    if (imminent) {
      // Solid boundary and inward chevrons mark the last 160ms, not a hit.
      sector(g, e.x, e.y, range, e.angle, arc);
      for (const offset of [-0.48, 0, 0.48]) {
        const a = e.angle + offset;
        const x = e.x + Math.cos(a) * (range - 5), y = e.y + Math.sin(a) * (range - 5);
        for (const side of [-1, 1]) g.lineBetween(x, y,
          x - Math.cos(a) * 9 - Math.sin(a) * side * 5,
          y - Math.sin(a) * 9 + Math.cos(a) * side * 5);
      }
    } else {
      // Broken outline stays hollow so it cannot resemble the damaging flash.
      for (let i = 0; i < 7; i++) {
        const a = start + arc * i / 7;
        g.beginPath().arc(e.x, e.y, range, a, a + arc * 0.6 / 7).strokePath();
      }
      for (const a of [start, start + arc]) g.lineBetween(
        e.x + Math.cos(a) * 20, e.y + Math.sin(a) * 20,
        e.x + Math.cos(a) * range, e.y + Math.sin(a) * range);
    }
    // A fixed-radius progress arc closes toward the strike direction.
    g.lineStyle(2, color, imminent ? 1 : 0.75).beginPath()
      .arc(e.x, e.y, range - 10, start, start + arc * progress).strokePath();
    return;
  }
  if (e.active <= 0) return;
  const age = 0.18 - e.active;
  if (age < 2 / 60) {
    // Hit resolves once when windup reaches zero; fill exists for only two frames.
    g.lineStyle(3, 0xffffff, 1).fillStyle(0xffedce, 0.3);
    sector(g, e.x, e.y, range, e.angle, arc);
  }
  // Only a thin fractured slash remains, without the warning's radial edges/fill.
  g.lineStyle(2, 0xffedce, Math.max(0, e.active / 0.18));
  g.beginPath();
  for (let i = 0; i <= 8; i++) {
    const a = start + arc * i / 8, r = range - (i % 2) * 5;
    const x = e.x + Math.cos(a) * r, y = e.y + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.strokePath();
}

// Draw all ground cues before bodies so another enemy never paints over a silhouette.
export function drawEnemyTelegraph(g: Graphics, enemy: Enemy, world: CombatWorld): void {
  if (enemy.kind === 'grunt' && enemy.attackAction === 3 && (enemy.windup > 0 || enemy.active > 0)) {
    const progress = enemy.windup > 0 ? 1 - enemy.windup / enemy.windupDuration : 1;
    const color = world.isImminentEnemyThreat(enemy) ? 0xffe599 : COLORS.grunt;
    g.lineStyle(2, color, 0.8).strokeCircle(enemy.targetX, enemy.targetY, GRUNT_LEAP.radius);
    g.lineStyle(1, color, 0.4).lineBetween(enemy.leapFromX, enemy.leapFromY, enemy.targetX, enemy.targetY);
    g.lineStyle(2, color, 0.8).strokeCircle(enemy.targetX, enemy.targetY, GRUNT_LEAP.radius * progress);
    return;
  }
  if (enemy.kind === 'grunt') { drawGruntTelegraph(g, enemy, world); return; }
  const active = enemy.active > 0;
  if (enemy.windup <= 0 && !active) return;
  const color = active ? 0xffedce : world.isImminentEnemyThreat(enemy) ? 0xffe599 : COLORS[enemy.kind];
  const progress = active ? 1 : Math.min(1, Math.max(0, 1 - enemy.windup / (enemy.windupDuration || 0.7)));
  const alpha = active ? enemy.active / 0.22 : 0.45 + progress * 0.45;
  g.lineStyle(active ? 3 : 1.5, color, alpha).fillStyle(color, active ? 0.13 : 0.04 + progress * 0.08);
  if (enemy.kind === 'archer' || enemy.kind === 'boss' && enemy.attackAction === 1) {
    const rays = enemy.kind === 'archer' ? [enemy.angle] : [...Array.from({ length: 12 }, (_, i) => enemy.angle + i * Math.PI / 6), ...[-0.16, 0, 0.16].map(offset => enemy.angle + offset)];
    for (let i = 0; i < rays.length; i++) {
      const angle = rays[i];
      const reach = enemy.kind === 'archer' ? 600 : 190;
      g.lineBetween(enemy.x + Math.cos(angle) * 24, enemy.y + Math.sin(angle) * 24,
        enemy.x + Math.cos(angle) * reach, enemy.y + Math.sin(angle) * reach);
      // A closing pair of chevrons conveys aim lock without a screen-filling beam.
      const r = 42 + (1 - progress) * 42;
      for (const side of [-1, 1]) g.lineBetween(enemy.x + Math.cos(angle) * r, enemy.y + Math.sin(angle) * r,
        enemy.x + Math.cos(angle) * (r - 9) - Math.sin(angle) * side * 5,
        enemy.y + Math.sin(angle) * (r - 9) + Math.cos(angle) * side * 5);
    }
  } else if (enemy.kind === 'volatile' || enemy.kind === 'boss' && enemy.attackAction === 2) {
    const slam = enemy.kind === 'boss';
    const x = slam ? enemy.targetX : enemy.x, y = slam ? enemy.targetY : enemy.y;
    const r = slam ? BOSS_ATTACK.slamRadius : ENEMY_ATTACK.volatile.range;
    g.fillCircle(x, y, r).strokeCircle(x, y, r);
    g.lineStyle(2, color, alpha).strokeCircle(x, y, r * progress);
    if (slam) for (const sign of [-1, 1]) {
      g.lineBetween(x - 10, y + sign * 10, x + 10, y - sign * 10);
    }
  } else {
    const spec = enemy.kind === 'boss' ? BOSS_ATTACK : ENEMY_ATTACK[enemy.kind];
    sector(g, enemy.x, enemy.y, spec.range, enemy.angle, spec.arc);
    g.lineStyle(2, color, alpha).fillStyle(color, 0);
    sector(g, enemy.x, enemy.y, spec.range * progress, enemy.angle, spec.arc);
  }
}

// Dynamic status overlays retain their accepted shapes and offsets; body art is asset-based.
export function drawEnemyStatus(g: Graphics, e: Enemy): void {
  const color = COLORS[e.kind];
  const size = e.kind === 'boss' ? 32 : e.kind === 'bulwark' ? 22 : 14;
  const open = e.recovery > 0;
  const cos = Math.cos(e.angle), sin = Math.sin(e.angle);
  const progress = e.windup > 0 ? 1 - e.windup / (e.windupDuration || 0.7) : 0;
  const stretch = e.windup > 0 ? 1 - progress * 0.1 : e.active > 0 ? 1.12 : 1;
  const lean = e.windup > 0 ? -progress * 4 : e.active > 0 ? 5 * e.active / 0.22 : 0;
  const line = (ax: number, ay: number, bx: number, by: number, width = 1, tint = color) => {
    g.lineStyle(width, tint, 0.9).lineBetween(e.x + cos * (ax * stretch + lean) - sin * ay, e.y + sin * (ax * stretch + lean) + cos * ay,
      e.x + cos * (bx * stretch + lean) - sin * by, e.y + sin * (bx * stretch + lean) + cos * by);
  };
  // Small detached recovery marks communicate the opening without more HUD text.
  if (open && (e.kind === 'bulwark' || e.kind === 'boss')) {
    for (const side of [-1, 1]) line(-4, side * (size + 10), 5, side * (size + 10), 2, 0xe4efff);
  }
  // Three fixed slots distinguish setup strength even on the phone camera.
  if (e.rupture > 0) for (let i = 0; i < 3; i++) {
    const x = e.x - 10 + i * 10, y = e.y - size - 16;
    const points = [{ x, y: y - 4 }, { x: x + 4, y }, { x, y: y + 4 }, { x: x - 4, y }];
    g.lineStyle(1, 0x6bf3d0, i < e.rupture ? 1 : 0.3).strokePoints(points, true);
    if (i < e.rupture) g.fillStyle(e.rupture === 3 ? 0xe5fff7 : 0x6bf3d0).fillPoints(points, true);
  }
  g.fillStyle(0x18202c).fillRect(e.x - 16, e.y - size - 7, 32, 3);
  g.fillStyle(color).fillRect(e.x - 16, e.y - size - 7, 32 * e.hp / e.maxHp, 3);
}
