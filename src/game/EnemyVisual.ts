import type Phaser from 'phaser';
import { COMBAT, type CombatWorld, type Enemy } from './combat';
import { BOSS_ATTACK, ENEMY_ATTACK } from './config/balance';

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
  if (enemy.kind === 'grunt') { drawGruntTelegraph(g, enemy, world); return; }
  const active = enemy.active > 0;
  if (enemy.windup <= 0 && !active) return;
  const color = active ? 0xffedce : world.isImminentEnemyThreat(enemy) ? 0xffe599 : COLORS[enemy.kind];
  const progress = active ? 1 : Math.min(1, Math.max(0, 1 - enemy.windup / (enemy.windupDuration || 0.7)));
  const alpha = active ? enemy.active / 0.22 : 0.45 + progress * 0.45;
  g.lineStyle(active ? 3 : 1.5, color, alpha).fillStyle(color, active ? 0.13 : 0.04 + progress * 0.08);
  if (enemy.kind === 'archer' || enemy.kind === 'boss' && (active ? enemy.attackAction : enemy.action) === 1) {
    const rays = enemy.kind === 'archer' ? 1 : 12;
    for (let i = 0; i < rays; i++) {
      const angle = enemy.angle + i * Math.PI / 6;
      const reach = enemy.kind === 'archer' ? 600 : 190;
      g.lineBetween(enemy.x + Math.cos(angle) * 24, enemy.y + Math.sin(angle) * 24,
        enemy.x + Math.cos(angle) * reach, enemy.y + Math.sin(angle) * reach);
      // A closing pair of chevrons conveys aim lock without a screen-filling beam.
      const r = 42 + (1 - progress) * 42;
      for (const side of [-1, 1]) g.lineBetween(enemy.x + Math.cos(angle) * r, enemy.y + Math.sin(angle) * r,
        enemy.x + Math.cos(angle) * (r - 9) - Math.sin(angle) * side * 5,
        enemy.y + Math.sin(angle) * (r - 9) + Math.cos(angle) * side * 5);
    }
  } else if (enemy.kind === 'volatile' || enemy.kind === 'boss' && (active ? enemy.attackAction : enemy.action) === 2) {
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

// Original layered fractured plates, in local coordinates facing +X. No collider changes.
export function drawEnemyBody(g: Graphics, e: Enemy, time: number): void {
  const color = COLORS[e.kind];
  const size = e.kind === 'boss' ? 32 : e.kind === 'bulwark' ? 22 : 14;
  const preparing = e.windup > 0;
  const open = e.recovery > 0;
  const progress = preparing ? 1 - e.windup / (e.windupDuration || 0.7) : 0;
  const pulse = Math.sin(time * 4 + e.id * 2);
  const stride = preparing || open ? 0 : Math.sin(time * (e.kind === 'grunt' ? 14 : 8) + e.id) * 2;
  const stretch = preparing ? 1 - progress * 0.1 : e.active > 0 ? 1.12 : 1;
  const lean = preparing ? -progress * 4 : e.active > 0 ? 5 * e.active / 0.22 : 0;
  const cos = Math.cos(e.angle), sin = Math.sin(e.angle);
  const point = (x: number, y: number) => ({ x: e.x + cos * (x * stretch + lean) - sin * y, y: e.y + sin * (x * stretch + lean) + cos * y });
  const plate = (coords: number[], fill: number, edge = color, alpha = 1) => {
    const points = [];
    for (let i = 0; i < coords.length; i += 2) points.push(point(coords[i], coords[i + 1]));
    g.fillStyle(e.flash > 0 ? 0xffffff : fill, alpha).lineStyle(1, edge, alpha).fillPoints(points, true).strokePoints(points, true);
  };
  const line = (ax: number, ay: number, bx: number, by: number, width = 1, tint = color) => {
    const a = point(ax, ay), b = point(bx, by);
    g.lineStyle(width, tint, 0.9).lineBetween(a.x, a.y, b.x, b.y);
  };
  g.fillStyle(0x000000, 0.4).fillEllipse(e.x, e.y + size * 0.55, size * 2.1, size * 0.8);
  if (e.kind === 'grunt') {
    // Split hunter mask, hooked forearms and a narrow exposed spine.
    plate([-12, -6, -5, -10, 1, -7, -3, -2, -10, -2], 0x522b41);
    plate([-12, 6, -5, 10, 1, 7, -3, 2, -10, 2], 0x522b41);
    plate([-5, -4, 6, -8, 15, 0, 5, -1, 1, 3], 0x8e3d55);
    plate([-5, 5, 3, 3, 12, 2, 6, 9], 0x35243d);
    for (const side of [-1, 1]) {
      plate([-5, side * 10, 5 + stride * side, side * 15, 14, side * 11, 9, side * 18, -7, side * 14], 0x39233a);
      line(-10, side * 5, -15 - stride * side, side * 10);
    }
    line(6, -3, 11, -1, 2, 0xffd2d8);
  } else if (e.kind === 'archer') {
    // Hood and forked floating cloak; a drawn crescent bow faces the locked ray.
    plate([-19, -9, -3, -12, 5, -6, -7, -2, -13, -4, -22, -1], 0x37254d);
    plate([-19, 9, -3, 12, 5, 6, -7, 2, -13, 4, -22, 1], 0x49305f);
    plate([-7, -5, 4, -7, 10, 0, 4, 7, -7, 5, -2, 0], 0x73508c);
    const pull = preparing ? progress * 5 : 0;
    line(12, -16, 18, -7, 2); line(18, -7, 14, 0, 2);
    line(14, 0, 18, 7, 2); line(18, 7, 12, 16, 2);
    line(12, -16, 6 - pull, 0); line(6 - pull, 0, 12, 16);
    line(3 - pull, 0, 21, 0, 2, 0xf3dbff);
  } else if (e.kind === 'volatile') {
    // Suspended cracked furnace; plates spread away from the warning core.
    const spread = 1 + (preparing ? progress * 5 : pulse);
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      const x = Math.cos(a) * spread, y = Math.sin(a) * spread;
      plate([x + Math.cos(a - 0.5) * 10, y + Math.sin(a - 0.5) * 10,
        x + Math.cos(a) * 18, y + Math.sin(a) * 18,
        x + Math.cos(a + 0.5) * 10, y + Math.sin(a + 0.5) * 10], 0x713f36);
    }
    plate([-7, 0, 0, -8, 8, 0, 0, 8], preparing ? 0xffdda1 : 0xbf7145);
    line(-4, -3, 2, 0, 2, 0xffe9b6); line(2, 0, -2, 5, 2, 0xffe9b6);
  } else if (e.kind === 'bulwark') {
    // Broad slab shoulders; open armor reveals the vulnerable core during recovery.
    const spread = open ? 8 : preparing ? -2 : 0;
    plate([-18, -12, -3, -17, 9, -9, 9, 9, -3, 17, -18, 12], 0x283b60);
    for (const side of [-1, 1]) {
      plate([-14, side * (13 + spread), -4, side * (24 + spread), 14, side * (20 + spread), 19, side * (6 + spread), 5, side * (8 + spread)], 0x415d88);
      line(-10, side * (17 + spread), 6, side * (18 + spread), 2);
    }
    plate([-6, 0, 3, -8, 12, 0, 3, 8], open ? 0xe7f5ff : 0x789cc9);
    plate([17, -9, 24, -12, 29, -5, 28, 13, 18, 9], 0x334864);
  } else {
    // Crown, hollow torso and three chained shards: visibly different from the Elite.
    plate([-22, -12, -10, -22, 14, -17, 24, 0, 14, 17, -10, 22, -22, 12, -12, 0], 0x483341);
    for (const side of [-1, 1]) {
      plate([-18, side * 16, -10, side * 33, 6, side * 27, 13, side * 17], 0x71503e);
      plate([3, side * 18, 17, side * 28, 24, side * 12, 13, side * 8], 0x463444);
    }
    plate([8, -11, 19, -19, 19, -9, 31, -9, 25, 0, 31, 9, 19, 9, 19, 19, 8, 11, 14, 0], 0x96714b);
    plate([-10, 0, 0, -11, 10, 0, 0, 11], open ? 0xffeed0 : 0xb98648);
    for (let i = 0; i < 3; i++) {
      const a = time * 0.5 + i * Math.PI * 2 / 3;
      const r = open ? 38 : preparing ? 42 - progress * 8 : 40;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      line(x * 0.55, y * 0.55, x, y, 1);
      plate([x - 5, y, x, y - 7, x + 5, y, x, y + 7], 0x694a40);
    }
    if (e.hp < e.maxHp / 2) line(-14, -8, -5, 7, 2, 0xff6f87);
  }
  // Small detached recovery marks communicate the opening without more HUD text.
  if (open && (e.kind === 'bulwark' || e.kind === 'boss')) {
    for (const side of [-1, 1]) line(-4, side * (size + 10), 5, side * (size + 10), 2, 0xe4efff);
  }
  for (let i = 0; i < e.rupture; i++) g.fillStyle(0x6bf3d0).fillCircle(e.x - 8 + i * 8, e.y - size - 12, 2);
  g.fillStyle(0x18202c).fillRect(e.x - 16, e.y - size - 7, 32, 3);
  g.fillStyle(color).fillRect(e.x - 16, e.y - size - 7, 32 * e.hp / e.maxHp, 3);
}
