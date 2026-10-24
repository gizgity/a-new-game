import type { MutationId, CurseId, CombatStats } from './builds.js';
import { ARENA, movePlayer, PLAYER_RADIUS, type PlayerState } from './movement.js';

export const COMBAT = {
  maxHp: 100, dashCharges: 2, dashRecharge: 2.8, dashDuration: 0.18,
  dashSpeed: 920, perfectWindow: 0.08, shotInterval: 0.18,
  enemyCount: 6, projectileLimit: 80, chainLimit: 12, inputBuffer: 0.12,
} as const;

export type SoundCue = 'light' | 'heavy' | 'gun' | 'dash' | 'perfect' | 'detonate' | 'hurt' | 'swing' | 'heavySwing' | 'shotHit' | 'chargedHit';

export type CombatAction = 'melee' | 'shoot' | 'heavy' | 'charged' | 'ultimate' | 'dash';
type BufferedAction = 'melee' | 'shoot' | 'heavy' | 'charged';

export interface CombatInput {
  dx: number; dy: number; melee: boolean; shoot: boolean; heavy: boolean; dash: boolean; charged?: boolean; ultimate?: boolean;
  pressed?: readonly CombatAction[];
}
export interface Enemy {
  id: number; kind: 'grunt' | 'archer' | 'volatile' | 'bulwark' | 'boss'; x: number; y: number;
  hp: number; maxHp: number; cooldown: number; windup: number;
  angle: number; stagger: number; flash: number; rupture: number; action: number; targetX: number; targetY: number;
}
export interface Projectile {
  x: number; y: number; vx: number; vy: number; hostile: boolean; life: number; charged?: boolean;
}
export interface Attack {
  heavy: boolean; combo: number; angle: number; age: number;
  windup: number; duration: number; range: number; arc: number; damage: number; resolved: boolean;
}
export interface Impact { x: number; y: number; life: number; color: number; radius?: number; kind?: 'light' | 'heavy' | 'shotHit' | 'chargedHit'; angle?: number }
interface Explosion { x: number; y: number; damage: number; radius: number; hostile: boolean }

function clampPosition(body: { x: number; y: number }, radius = PLAYER_RADIUS): void {
  const edge = ARENA.inset + radius;
  body.x = Math.max(edge, Math.min(ARENA.width - edge, body.x));
  body.y = Math.max(edge, Math.min(ARENA.height - edge, body.y));
}
function angleDifference(a: number, b: number): number {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}
export function segmentHitsCircle(
  ax: number, ay: number, bx: number, by: number, x: number, y: number, radius: number,
): boolean {
  const dx = bx - ax, dy = by - ay;
  const length = dx * dx + dy * dy;
  const t = length === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length));
  return (ax + t * dx - x) ** 2 + (ay + t * dy - y) ** 2 <= radius ** 2;
}

export class CombatWorld {
  soundEvents: SoundCue[] = [];
  hp: number = COMBAT.maxHp;
  mutations: MutationId[] = [];
  curse: CurseId | null = null;
  stats: CombatStats = { melee: 0, shots: 0, dashes: 0 };
  practice = true;
  get maxHp(): number { return this.curse === 'ghostStep' ? 80 : this.curse === 'deathEcho' ? 85 : COMBAT.maxHp; }
  get rechargeDuration(): number { return this.curse === 'ghostStep' ? 2.1 : COMBAT.dashRecharge; }
  dashCharges: number = COMBAT.dashCharges;
  dashRecharge = 0;
  dashTime = 0;
  dashAngle = 0;
  invulnerable = 0;
  hurtFlash = 0;
  perfectFlash = 0;
  kills = 0;
  chargePoints = 0;
  chargedShots = 0;
  surge = 0;
  surgeFlash = 0;
  detonations = 0;
  perfectDodges = 0;
  bossSlain = false;
  lastChain = 0;
  private explosions: Explosion[] = [];
  private chainSeen = new Set<number>();
  combo = 0;
  comboWindow = 0;
  shotCooldown = 0;
  hitstop = 0;
  attack: Attack | null = null;
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  impacts: Impact[] = [];
  private nextId = 0;
  private replacement = 1.5;
  private perfectAvailable = false;
  private dashProtected = false;
  private previousInput: Partial<Record<CombatAction, boolean>> = {};
  private buffered: { action: BufferedAction; life: number } | null = null;
  private bufferedDash = 0;
  private bufferedUltimate = 0;
  lastShot = { angle: 0, charged: false };

  clearInput(): void {
    this.buffered = null;
    this.bufferedDash = this.bufferedUltimate = 0;
    this.previousInput = {};
  }

  private captureInput(input: CombatInput, dt: number): void {
    // Age only in simulation time. Hitstop preserves a deliberate tap, not a held repeat.
    if (this.hitstop <= 0) {
      if (this.buffered && (this.buffered.life -= dt) <= 0) this.buffered = null;
      this.bufferedDash = Math.max(0, this.bufferedDash - dt);
      this.bufferedUltimate = Math.max(0, this.bufferedUltimate - dt);
    }
    for (const action of ['shoot', 'melee', 'charged', 'heavy', 'ultimate', 'dash'] as const) {
      const pressed = input.pressed?.includes(action) || (input[action] && !this.previousInput[action]);
      if (pressed) {
        if (action === 'dash') {
          if (this.dashCharges > 0) this.bufferedDash = COMBAT.inputBuffer;
        } else if (action === 'ultimate') {
          if (this.surge >= 100) this.bufferedUltimate = COMBAT.inputBuffer;
        } else if (action !== 'charged' || this.chargedShots > 0) {
          // One offensive slot: latest intent wins; simultaneous presses prefer Heavy.
          this.buffered = { action, life: COMBAT.inputBuffer };
        }
      }
      this.previousInput[action] = !!input[action];
    }
  }

  constructor(readonly player: PlayerState) { this.reset(); }

  reset(): void {
    Object.assign(this.player, { x: ARENA.width / 2, y: ARENA.height / 2, angle: 0 });
    this.soundEvents = [];
    this.clearInput();
    this.lastShot = { angle: 0, charged: false };
    this.mutations = [];
    this.curse = null;
    this.stats = { melee: 0, shots: 0, dashes: 0 };
    this.hp = COMBAT.maxHp;
    this.dashCharges = COMBAT.dashCharges;
    this.dashRecharge = this.dashTime = this.invulnerable = this.hurtFlash = this.perfectFlash = 0;
    this.kills = this.combo = this.comboWindow = this.shotCooldown = this.hitstop = 0;
    this.chargePoints = this.chargedShots = this.surge = this.surgeFlash = 0;
    this.detonations = this.perfectDodges = this.lastChain = 0;
    this.bossSlain = false;
    this.explosions = [];
    this.chainSeen.clear();
    this.attack = null;
    this.projectiles = [];
    this.enemies = [];
    this.impacts = [];
    this.nextId = 0;
    this.replacement = 1.5;
    this.perfectAvailable = false;
    this.dashProtected = false;
    for (let i = 0; i < COMBAT.enemyCount; i++) this.spawnEnemy();
  }

  spawnEnemy(kind?: Enemy['kind']): void {
    const id = this.nextId++;
    const angle = id * 2.39996;
    const enemy: Enemy = {
      id, kind: kind ?? (id % 6 === 5 ? 'volatile' : id % 3 === 2 ? 'archer' : 'grunt'),
      x: this.player.x + Math.cos(angle) * 360, y: this.player.y + Math.sin(angle) * 360,
      hp: 0, maxHp: id % 3 === 2 ? 48 : 66,
      cooldown: 0.8 + (id % 4) * 0.2, windup: 0, angle: 0, stagger: 0, flash: 0, rupture: 0, action: 0, targetX: 0, targetY: 0,
    };
    clampPosition(enemy);
    // Nếu player sát góc, chọn điểm phía đối diện để tránh spawn trên người.
    if (Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y) < 220) {
      enemy.x = ARENA.width - this.player.x;
      enemy.y = ARENA.height - this.player.y;
      clampPosition(enemy);
    }
    if (enemy.kind === 'bulwark') enemy.maxHp = 220;
    if (enemy.kind === 'boss') enemy.maxHp = 1500;
    enemy.hp = enemy.maxHp;
    this.enemies.push(enemy);
  }

  step(input: CombatInput, dt: number): void {
    this.soundEvents = [];
    if (this.hp <= 0) { this.clearInput(); return; }
    this.captureInput(input, dt);
    if (this.hitstop > 0) { this.hitstop = Math.max(0, this.hitstop - dt); return; }
    this.dashProtected = false;
    this.chainSeen.clear();
    this.lastChain = 0;
    this.surgeFlash = Math.max(0, this.surgeFlash - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.hurtFlash = Math.max(0, this.hurtFlash - dt);
    this.perfectFlash = Math.max(0, this.perfectFlash - dt);
    this.shotCooldown = Math.max(0, this.shotCooldown - dt);
    this.comboWindow = Math.max(0, this.comboWindow - dt);
    if (this.comboWindow === 0 && !this.attack) this.combo = 0;
    if (this.dashCharges < COMBAT.dashCharges) {
      this.dashRecharge += dt;
      if (this.dashRecharge >= this.rechargeDuration) {
        this.dashCharges++;
        this.dashRecharge -= this.rechargeDuration;
        if (this.dashCharges === COMBAT.dashCharges) this.dashRecharge = 0;
      }
    }
    if (this.bufferedDash > 0 && this.dashCharges > 0 && this.dashTime <= 0) {
      this.bufferedDash = this.bufferedUltimate = 0;
      this.buffered = null;
      this.cue('dash');
      this.dashCharges--;
      this.stats.dashes++;
      this.dashTime = COMBAT.dashDuration;
      this.dashAngle = input.dx || input.dy ? Math.atan2(input.dy, input.dx) : this.player.angle;
      this.perfectAvailable = true;
      this.attack = null;
    }
    if (this.dashTime > 0) {
      this.dashProtected = true;
      const duration = Math.min(dt, this.dashTime);
      this.player.x += Math.cos(this.dashAngle) * COMBAT.dashSpeed * duration;
      this.player.y += Math.sin(this.dashAngle) * COMBAT.dashSpeed * duration;
      clampPosition(this.player);
      this.dashTime = Math.max(0, this.dashTime - dt);
    } else {
      movePlayer(this.player, input.dx, input.dy, dt * (this.attack?.heavy ? 0.45 : 1));
      const pending = this.buffered?.action;
      if (!this.attack && (pending === 'heavy' || pending === 'melee' || input.heavy || input.melee)) {
        const heavy = pending === 'heavy' || (pending !== 'melee' && input.heavy);
        this.beginAttack(heavy);
        if (pending === (heavy ? 'heavy' : 'melee')) this.buffered = null;
      }
      if ((input.ultimate || this.bufferedUltimate > 0) && this.surge >= 100) {
        this.bufferedUltimate = 0;
        this.surge = 0;
        this.surgeFlash = 0.6;
        this.invulnerable = Math.max(this.invulnerable, 0.5);
        this.projectiles = this.projectiles.filter((shot) => !shot.hostile);
        this.explosions.push({ x: this.player.x, y: this.player.y, damage: 100, radius: 280, hostile: false });
      }
      if ((this.buffered?.action === 'charged' || input.charged) && this.chargedShots > 0 && this.shotCooldown <= 0 && !this.attack?.heavy) {
        if (this.buffered?.action === 'charged') this.buffered = null;
        this.chargedShots--;
        this.fire(this.player.x, this.player.y, this.player.angle, false, true);
        this.shotCooldown = 0.35;
      } else if ((this.buffered?.action === 'shoot' || input.shoot) && this.shotCooldown <= 0 && !this.attack?.heavy) {
        this.fire(this.player.x, this.player.y, this.player.angle, false);
        if (this.buffered?.action === 'shoot') this.buffered = null;
        this.shotCooldown = COMBAT.shotInterval;
      }
    }
    if (this.attack) {
      const attack = this.attack;
      if (!attack.resolved) attack.angle = this.player.angle;
      attack.age += dt;
      if (!attack.resolved && attack.age + 1e-9 >= attack.windup) {
        attack.resolved = true;
        for (const enemy of this.enemies) {
          const dx = enemy.x - this.player.x, dy = enemy.y - this.player.y;
          if (enemy.hp > 0 && Math.hypot(dx, dy) <= attack.range + (enemy.kind === 'boss' ? 30 : 14) &&
              Math.abs(angleDifference(Math.atan2(dy, dx), attack.angle)) <= attack.arc / 2) {
            if (attack.heavy) this.detonate(enemy, 1.4);
            else {
              enemy.rupture = Math.min(3, enemy.rupture + 1);
              this.gainCharge(this.mutations.includes('catalyst') ? 2 : 1);
            }
            this.hitEnemy(enemy, attack.damage, attack.angle, attack.heavy ? 54 : 22, attack.heavy ? 0.45 : 0.16, attack.heavy && this.mutations.includes('guardBreaker'), attack.heavy ? 'heavy' : 'light');
          }
        }
      }
      if (attack.age >= attack.duration) this.attack = null;
    }
    for (const enemy of this.enemies) this.stepEnemy(enemy, dt);
    this.stepProjectiles(dt);
    this.resolveExplosions();
    this.enemies = this.enemies.filter((enemy) => enemy.hp > 0);
    this.impacts = this.impacts.filter((impact) => (impact.life -= dt) > 0);
    // Bổ sung quái cố định cho lượt luyện tập M2; waves thuộc M4.
    if (this.practice && this.enemies.length < COMBAT.enemyCount) {
      this.replacement -= dt;
      if (this.replacement <= 0) { this.spawnEnemy(); this.replacement = 1.5; }
    }
  }

  private beginAttack(heavy: boolean): void {
    this.stats.melee++;
    this.cue(heavy ? 'heavySwing' : 'swing');
    if (this.curse === 'bloodPact' && !heavy) this.hp = Math.max(1, this.hp - 1);
    const finisher = heavy && this.combo === 3 && this.comboWindow > 0;
    if (!heavy) this.combo = this.combo % 3 + 1;
    this.attack = {
      heavy, combo: this.combo, angle: this.player.angle, age: 0,
      windup: heavy ? 0.24 : [0, 4 / 60, 5 / 60, 6 / 60][this.combo],
      duration: heavy ? 0.58 : [0, 0.24, 0.28, 0.36][this.combo],
      range: (heavy ? 108 : 84) + (this.mutations.includes('phantomEdge') ? 20 : 0),
      arc: heavy ? Math.PI * 0.95 : Math.PI * 0.8,
      damage: heavy ? (finisher ? 72 : 48) : [0, 18, 22, 30][this.combo], resolved: false,
    };
    this.attack.damage *= (this.curse === 'bloodPact' ? 1.3 : 1) * (heavy && this.mutations.includes('guardBreaker') ? 1.3 : 1);
    if (heavy) this.combo = 0;
    this.comboWindow = 1.1;
  }

  private hitEnemy(enemy: Enemy, damage: number, angle: number, force: number, stagger: number, bypassArmor = false, sound: 'light' | 'heavy' | 'shotHit' | 'chargedHit' | 'blast' = 'blast'): void {
    if (enemy.hp <= 0) return;
    if (this.hp < this.maxHp / 2 && this.mutations.includes('berserker')) damage *= 1.25;
    if (enemy.kind === 'bulwark' && !bypassArmor) damage *= 0.55;
    const contactX = enemy.x, contactY = enemy.y;
    enemy.hp = Math.max(0, enemy.hp - damage);
    this.surge = Math.min(100, this.surge + 2);
    if (enemy.kind === 'boss') force *= 0.1;
    else if (enemy.kind === 'bulwark') force *= 0.4;
    enemy.x += Math.cos(angle) * force;
    enemy.y += Math.sin(angle) * force;
    clampPosition(enemy);
    enemy.stagger = enemy.kind === 'boss' ? 0 : stagger;
    if (enemy.kind !== 'boss') enemy.windup = 0;
    if (enemy.kind !== 'boss') enemy.cooldown = Math.max(enemy.cooldown, 0.45);
    enemy.flash = 0.12;
    this.cue(sound === 'blast' ? 'light' : sound);
    this.impact(contactX, contactY, sound === 'heavy' || sound === 'chargedHit' ? 0xffcc80 : 0xe5fff7);
    if (sound !== 'blast') Object.assign(this.impacts[this.impacts.length - 1], { kind: sound, angle });
    const stop = sound === 'blast' ? (damage >= 48 ? 0.05 : 0.025) : sound === 'heavy' ? 0.065 : sound === 'chargedHit' ? 0.04 : sound === 'shotHit' ? 0.012 : 0.033;
    this.hitstop = Math.max(this.hitstop, stop);
    if (enemy.hp === 0) {
      this.kills++;
      if (enemy.kind === 'boss') this.bossSlain = true;
      this.surge = Math.min(100, this.surge + 8);
      if (this.curse === 'deathEcho') this.explosions.push({ x: enemy.x, y: enemy.y, damage: 20, radius: 80, hostile: false });
      if (enemy.kind === 'volatile') this.explosions.push({ x: enemy.x, y: enemy.y, damage: 38, radius: 110, hostile: true });
    }
  }

  private hurt(damage: number, angle: number): void {
    if (this.dashProtected || this.dashTime > 0) {
      if (this.perfectAvailable && this.dashTime >= COMBAT.dashDuration - COMBAT.perfectWindow) {
        this.perfectAvailable = false;
        this.perfectFlash = 0.65;
        this.cue('perfect');
        this.perfectDodges++;
        this.gainCharge(3);
        if (this.mutations.includes('staticRiposte')) this.explosions.push({ x: this.player.x, y: this.player.y, damage: 40, radius: 140, hostile: false });
        this.surge = Math.min(100, this.surge + 15);
        this.impact(this.player.x, this.player.y, 0x8affef);
      }
      return;
    }
    if (this.invulnerable > 0 || this.hp <= 0) return;
    if (this.curse === 'volatileSoul') damage *= 1.25;
    this.hp = Math.max(0, this.hp - damage);
    this.invulnerable = 0.65;
    this.cue('hurt');
    this.hurtFlash = 0.18;
    this.player.x += Math.cos(angle) * 20;
    this.player.y += Math.sin(angle) * 20;
    clampPosition(this.player);
    this.hitstop = Math.max(this.hitstop, 0.04);
    this.impact(this.player.x, this.player.y, 0xff6f87);
  }

  private stepEnemy(enemy: Enemy, dt: number): void {
    if (enemy.hp <= 0) return;
    if (enemy.kind === 'boss') { this.stepBoss(enemy, dt); return; }
    enemy.flash = Math.max(0, enemy.flash - dt);
    enemy.stagger = Math.max(0, enemy.stagger - dt);
    if (enemy.stagger > 0) return;
    const dx = this.player.x - enemy.x, dy = this.player.y - enemy.y;
    const distance = Math.hypot(dx, dy);
    if (enemy.windup > 0) {
      enemy.windup = Math.max(0, enemy.windup - dt);
      if (enemy.windup === 0) {
        if (enemy.kind === 'volatile') {
          enemy.hp = 0;
          this.explosions.push({ x: enemy.x, y: enemy.y, damage: 38, radius: 110, hostile: true });
        } else if (enemy.kind === 'archer') this.fire(enemy.x, enemy.y, enemy.angle, true);
        else if (distance < 70 && Math.abs(angleDifference(Math.atan2(dy, dx), enemy.angle)) < 0.85) {
          this.hurt(enemy.kind === 'bulwark' ? 22 : 12, enemy.angle);
        }
        enemy.cooldown = enemy.kind === 'grunt' ? 0.85 : 1.5;
      }
      return;
    }
    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    enemy.angle = Math.atan2(dy, dx);
    if (enemy.cooldown === 0 && distance < (enemy.kind === 'archer' ? 550 : enemy.kind === 'volatile' ? 80 : 60)) {
      enemy.windup = enemy.kind === 'grunt' ? 0.42 : enemy.kind === 'bulwark' ? 0.65 : 0.7;
      return;
    }
    const direction = enemy.kind !== 'archer' ? (distance > 40 ? 1 : 0) : (distance > 340 ? 1 : distance < 230 ? -1 : 0);
    if (distance > 0) {
      const speed = enemy.kind === 'grunt' ? 106 : enemy.kind === 'bulwark' ? 66 : 75;
      enemy.x += dx / distance * direction * speed * dt;
      enemy.y += dy / distance * direction * speed * dt;
    }
    for (const other of this.enemies) {
      if (other === enemy || other.hp <= 0) continue;
      const sx = enemy.x - other.x, sy = enemy.y - other.y;
      const separation = Math.hypot(sx, sy);
      if (separation > 0 && separation < 32) {
        enemy.x += sx / separation * 45 * dt;
        enemy.y += sy / separation * 45 * dt;
      }
    }
    clampPosition(enemy);
  }

  private stepBoss(boss: Enemy, dt: number): void {
    boss.flash = Math.max(0, boss.flash - dt);
    if (boss.windup > 0) {
      boss.windup = Math.max(0, boss.windup - dt);
      if (boss.windup === 0) {
        if (boss.action === 0) {
          const dx = this.player.x - boss.x, dy = this.player.y - boss.y;
          if (Math.hypot(dx, dy) < 230 && Math.abs(angleDifference(Math.atan2(dy, dx), boss.angle)) < 0.85) this.hurt(26, boss.angle);
        } else if (boss.action === 1) {
          for (let i = 0; i < 12; i++) this.fire(boss.x, boss.y, i * Math.PI / 6 + boss.angle, true);
        } else {
          this.impact(boss.targetX, boss.targetY, 0xffcc80, 110);
          if (Math.hypot(this.player.x - boss.targetX, this.player.y - boss.targetY) < 110) {
            this.hurt(28, Math.atan2(this.player.y - boss.y, this.player.x - boss.x));
          }
        }
        boss.action = (boss.action + 1) % 3;
        boss.cooldown = boss.hp < boss.maxHp / 2 ? 0.8 : 1.15;
      }
      return;
    }
    boss.cooldown = Math.max(0, boss.cooldown - dt);
    const dx = this.player.x - boss.x, dy = this.player.y - boss.y;
    boss.angle = Math.atan2(dy, dx);
    if (boss.cooldown === 0) {
      boss.windup = boss.hp < boss.maxHp / 2 ? 0.75 : 0.95;
      boss.targetX = this.player.x; boss.targetY = this.player.y;
    } else if (Math.hypot(dx, dy) > 155) {
      boss.x += Math.cos(boss.angle) * 80 * dt;
      boss.y += Math.sin(boss.angle) * 80 * dt;
      clampPosition(boss, 32);
    }
  }

  private fire(x: number, y: number, angle: number, hostile: boolean, charged = false): void {
    if (this.projectiles.length >= COMBAT.projectileLimit) return;
    if (!hostile) { this.stats.shots++; this.lastShot = { angle, charged }; this.cue('gun'); }
    const speed = hostile ? 310 : 850;
    this.projectiles.push({ x: x + Math.cos(angle) * 24, y: y + Math.sin(angle) * 24,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, hostile, charged, life: hostile ? 3 : 1.3 });
  }

  private stepProjectiles(dt: number): void {
    for (const shot of this.projectiles) {
      const x = shot.x, y = shot.y;
      shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt;
      if (shot.hostile) {
        if (segmentHitsCircle(x, y, shot.x, shot.y, this.player.x, this.player.y, PLAYER_RADIUS + 4)) {
          this.hurt(10, Math.atan2(shot.vy, shot.vx)); shot.life = 0;
        }
      } else {
        // Lấy mục tiêu gần đầu segment nhất nếu nhiều collider chồng nhau.
        let target: Enemy | undefined;
        let nearest = Infinity;
        for (const enemy of this.enemies) {
          if (enemy.hp <= 0 || !segmentHitsCircle(x, y, shot.x, shot.y, enemy.x, enemy.y, enemy.kind === 'boss' ? 34 : enemy.kind === 'bulwark' ? 24 : 18)) continue;
          const distance = (enemy.x - x) ** 2 + (enemy.y - y) ** 2;
          if (distance < nearest) { target = enemy; nearest = distance; }
        }
        if (target) {
          this.detonate(target, shot.charged ? 2 : 1);
          this.hitEnemy(target, shot.charged ? 42 : 14, Math.atan2(shot.vy, shot.vx), 8, 0.08, !!shot.charged, shot.charged ? 'chargedHit' : 'shotHit');
          shot.life = 0;
        }
      }
      if (shot.x < ARENA.inset || shot.x > ARENA.width - ARENA.inset ||
          shot.y < ARENA.inset || shot.y > ARENA.height - ARENA.inset) shot.life = 0;
    }
    this.projectiles = this.projectiles.filter((shot) => shot.life > 0);
  }

  private cue(cue: SoundCue): void {
    if (!this.soundEvents.includes(cue)) this.soundEvents.push(cue);
  }

  private gainCharge(points: number): void {
    this.chargePoints += points;
    while (this.chargePoints >= 3 && this.chargedShots < 3) {
      this.chargePoints -= 3;
      this.chargedShots++;
    }
    this.chargePoints = Math.min(2, this.chargePoints);
  }

  private detonate(enemy: Enemy, multiplier: number): void {
    if (enemy.rupture === 0 || this.chainSeen.has(enemy.id)) return;
    this.chainSeen.add(enemy.id);
    const stacks = enemy.rupture;
    enemy.rupture = 0;
    this.detonations++;
    this.gainCharge(1);
    this.explosions.push({ x: enemy.x, y: enemy.y, damage: stacks * 12 * multiplier * (this.curse === 'volatileSoul' ? 1.4 : 1) * (this.mutations.includes('detonationSpecialist') ? 1.25 : 1), radius: this.mutations.includes('detonationSpecialist') ? 142 : 105, hostile: false });
  }

  private resolveExplosions(): void {
    // Queue có budget và mỗi enemy chỉ kích Rupture một lần trong tick.
    while (this.explosions.length > 0 && this.lastChain < COMBAT.chainLimit) {
      const explosion = this.explosions.shift()!;
      this.cue('detonate');
      this.lastChain++;
      this.impact(explosion.x, explosion.y, explosion.hostile ? 0xffb36b : 0x6bf3d0, explosion.radius);
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0 || Math.hypot(enemy.x - explosion.x, enemy.y - explosion.y) > explosion.radius) continue;
        this.detonate(enemy, 1);
        this.hitEnemy(enemy, explosion.damage, Math.atan2(enemy.y - explosion.y, enemy.x - explosion.x), 12, 0.2, true);
      }
      if (explosion.hostile && Math.hypot(this.player.x - explosion.x, this.player.y - explosion.y) <= explosion.radius) {
        this.hurt(16, Math.atan2(this.player.y - explosion.y, this.player.x - explosion.x));
      }
    }
    this.explosions = [];
  }

  private impact(x: number, y: number, color: number, radius = 22): void {
    if (this.impacts.length >= 24) this.impacts.shift();
    this.impacts.push({ x, y, color, radius, life: 0.18 });
  }
}
