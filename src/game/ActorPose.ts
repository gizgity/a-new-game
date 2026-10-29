import type { Attack, Enemy } from './combat.js';

export type ArtDirection = 'south' | 'east' | 'north' | 'west';
export type ArtPose = 'idle' | 'move' | 'windup' | 'attack' | 'recovery' | 'hit' | 'death';

/** Facing in the ground plane; never rotate a standing 3/4 sprite flat around Z. */
export function artDirection(angle: number): ArtDirection {
  const x = Math.cos(angle), y = Math.sin(angle);
  return Math.abs(x) >= Math.abs(y) ? (x >= 0 ? 'east' : 'west') : (y >= 0 ? 'south' : 'north');
}

export function enemyArtPose(enemy: Enemy, moving: boolean, flash = enemy.flash): ArtPose {
  if (enemy.hp <= 0) return 'death';
  // A hit flash must not hide preparation or an active attack (especially Boss).
  if (enemy.windup > 0) return 'windup';
  if (enemy.active > 0) return 'attack';
  if (enemy.recovery > 0) return 'recovery';
  if (flash > 0) return 'hit';
  return moving ? 'move' : 'idle';
}

export function attackArtPose(attack: Attack): ArtPose {
  if (attack.age < attack.windup) return 'windup';
  // The release starts on the simulation's damage tick, even during hitstop.
  return attack.age < attack.windup + (attack.heavy ? 0.16 : [0, 0.065, 0.085, 0.14][attack.combo])
    ? 'attack' : 'recovery';
}
