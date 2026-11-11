import type { CombatInput, CombatWorld } from './game/combat';
import { ARENA } from './game/movement';

/** Review script only: supplies ordinary intent; all costs/hits/cooldowns belong to CombatWorld. */
export function autoplayInput(world: CombatWorld, tick: number): CombatInput {
  const p = world.player;
  const target = world.enemies.filter(e => e.hp > 0).sort((a, b) =>
    Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y) || a.id - b.id)[0];
  const input: CombatInput = { dx: 0, dy: 0, melee: false, shoot: false, heavy: false, dash: false };
  if (!target) return input;
  const distance = Math.hypot(target.x - p.x, target.y - p.y);
  const angle = Math.atan2(target.y - p.y, target.x - p.x);
  p.angle = angle;
  const ux = Math.cos(angle), uy = Math.sin(angle);
  const threat = world.enemies.some(e => e.hp > 0 && e.windup > 0 && e.windup < 0.22
    && Math.hypot(e.x - p.x, e.y - p.y) < (e.kind === 'boss' ? 260 : 125))
    || world.projectiles.some(s => s.hostile && Math.hypot(s.x - p.x, s.y - p.y) < 85);
  // Approach, then circle. Steer toward the arena centre near an edge.
  const approach = distance > 88 ? 1 : distance < 60 ? -0.5 : 0;
  input.dx = ux * approach - uy * 0.65;
  input.dy = uy * approach + ux * 0.65;
  if (p.x < 150 || p.x > ARENA.width - 150 || p.y < 150 || p.y > ARENA.height - 150) {
    input.dx += (ARENA.width / 2 - p.x) / 350;
    input.dy += (ARENA.height / 2 - p.y) / 350;
  }
  input.dash = threat && world.dashCharges > 0 && world.dashTime <= 0;
  if (input.dash) { input.dx = -uy - ux * 0.4; input.dy = ux - uy * 0.4; }
  input.melee = distance < 125;
  // Finish light chains before spending Heavy; Basic and Charged share the real shot cooldown.
  input.heavy = distance < 155 && world.combo === 2 && !world.attack && world.heavyCharges > 0;
  input.charged = world.chargedShots > 0 && world.shotCooldown <= 0 && tick % 90 === 0;
  input.shoot = !input.charged && !input.heavy;
  input.ultimate = world.surge >= 100 && world.enemies.some(e => e.hp > 0 && Math.hypot(e.x - p.x, e.y - p.y) < 260);
  input.specialAim = { heavy: angle, charged: angle };
  input.pressed = (['heavy', 'charged', 'dash'] as const).filter(action => input[action]);
  return input;
}
