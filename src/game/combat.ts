import { ENEMY_HP, LIGHT_COMBO, HEAVY, ENEMY_GROWTH, RANGED, ENEMY_ATTACK, BOSS_ATTACK, CHAIN, BARRIER } from './config/balance.js';
import { Barrier } from './barrier.js';
import type { MutationId, CurseId, CombatStats } from './builds.js';
import { ARENA, movePlayer, PLAYER_RADIUS, type PlayerState } from './movement.js';

export const COMBAT = {
  maxHp: 100, dashCharges: 2, dashRecharge: 2.8, dashDuration: 0.18,
  dashSpeed: 920, perfectWindow: 0.16, shotInterval: 0.18,
  enemyCount: 6, projectileLimit: 80, chainLimit: 12, inputBuffer: 0.12,
} as const;

export type SoundCue = 'victory' | 'light' | 'light2' | 'light3' | 'heavy' | 'gun' | 'dash' | 'perfect' | 'detonate' | 'hurt' | 'swing' | 'swing2' | 'swing3' | 'heavySwing' | 'shotHit' | 'chargedHit' | 'chargedGun' | 'chargedBlast';

export type CombatAction = 'melee' | 'shoot' | 'heavy' | 'charged' | 'ultimate' | 'dash';
type BufferedAction = 'melee' | 'shoot' | 'heavy' | 'charged';

export interface CombatInput {
  dx: number; dy: number; melee: boolean; shoot: boolean; heavy: boolean; dash: boolean; charged?: boolean; ultimate?: boolean;
  pressed?: readonly CombatAction[];
  specialAim?: Partial<Record<'heavy' | 'charged', number>>;
}
export interface Enemy {
  id: number; kind: 'grunt' | 'archer' | 'volatile' | 'bulwark' | 'boss'; x: number; y: number;
  hp: number; maxHp: number; damageScale: number; speedScale: number; cooldown: number; windup: number;
  recovery: number; active: number; windupDuration: number; attackAction: number;
  angle: number; stagger: number; flash: number; rupture: number; action: number; targetX: number; targetY: number;
}
export interface Projectile {
  x: number; y: number; vx: number; vy: number; hostile: boolean; life: number; charged?: boolean; damage?: number;
}
export interface Attack {
  heavy: boolean; combo: number; angle: number; age: number;
  windup: number; duration: number; range: number; arc: number; damage: number; resolved: boolean;
}
export interface Impact {
  x: number; y: number; life: number; color: number; radius?: number; duration?: number;
  kind?: 'light' | 'light2' | 'light3' | 'heavy' | 'shotHit' | 'chargedHit' | 'chargedBlast' | 'chainBlast' | 'guardBreak'; angle?: number; sourceX?: number; sourceY?: number;
}
interface Explosion { x: number; y: number; damage: number; radius: number; hostile: boolean; charged?: boolean; playerDamage?: number; delay?: number; enemyId?: number; sourceX?: number; sourceY?: number }

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
  readonly barrier = new Barrier();
  mutations: MutationId[] = [];
  curse: CurseId | null = null;
  stats: CombatStats = { melee: 0, shots: 0, dashes: 0 };
  practice = true;
  get maxHp(): number { return this.curse === 'ghostStep' ? 80 : this.curse === 'deathEcho' ? 85 : COMBAT.maxHp; }
  get rechargeDuration(): number { return this.curse === 'ghostStep' ? 2.1 : COMBAT.dashRecharge * (this.curse === 'ironOath' ? BARRIER.oathDashMultiplier : 1); }
  heavyCharges: number = HEAVY.charges;
  heavyRecharge = 0;
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
  bossDeathPosition: { x: number; y: number } | null = null;
  lastChain = 0;
  private explosions: Explosion[] = [];
  private chainSeen = new Set<number>();
  private pendingDetonations = new Set<number>();
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
  private buffered: { action: BufferedAction; life: number; angle?: number } | null = null;
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
        } else if ((action !== 'charged' || this.chargedShots > 0) && (action !== 'heavy' || this.heavyCharges > 0)) {
          // One offensive slot: latest intent wins; simultaneous presses prefer Heavy.
          this.buffered = { action, life: COMBAT.inputBuffer, angle: action === 'heavy' || action === 'charged' ? input.specialAim?.[action] ?? this.player.angle : undefined };
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
    this.barrier.reset();
    this.heavyCharges = HEAVY.charges;
    this.heavyRecharge = 0;
    this.dashCharges = COMBAT.dashCharges;
    this.dashRecharge = this.dashTime = this.invulnerable = this.hurtFlash = this.perfectFlash = 0;
    this.kills = this.combo = this.comboWindow = this.shotCooldown = this.hitstop = 0;
    this.chargePoints = this.chargedShots = this.surge = this.surgeFlash = 0;
    this.detonations = this.perfectDodges = this.lastChain = 0;
    this.bossSlain = false;
    this.bossDeathPosition = null;
    this.explosions = [];
    this.pendingDetonations.clear();
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

  spawnEnemy(kind?: Enemy['kind'], maxHp?: number, spawnAngle?: number, growth = 0): void {
    const id = this.nextId++;
    const angle = spawnAngle ?? id * 2.39996;
    kind ??= id % 6 === 5 ? 'volatile' : id % 3 === 2 ? 'archer' : 'grunt';
    const enemy: Enemy = {
      id, kind,
      x: this.player.x + Math.cos(angle) * 360, y: this.player.y + Math.sin(angle) * 360,
      hp: 0, maxHp: maxHp ?? Math.round(ENEMY_HP[kind] * (1 + growth * (ENEMY_GROWTH.health - 1))),
      damageScale: 1 + growth * (ENEMY_GROWTH.damage - 1), speedScale: 1 + growth * (ENEMY_GROWTH.speed - 1),
      cooldown: 0.8 + (id % 4) * 0.2, windup: 0, recovery: 0, active: 0, windupDuration: 0, attackAction: 0, angle: 0, stagger: 0, flash: 0, rupture: 0, action: 0, targetX: 0, targetY: 0,
    };
    clampPosition(enemy);
    // Nếu player sát góc, chọn điểm phía đối diện để tránh spawn trên người.
    if (Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y) < 220) {
      enemy.x = ARENA.width - this.player.x;
      enemy.y = ARENA.height - this.player.y;
      clampPosition(enemy);
    }
    enemy.hp = enemy.maxHp;
    this.enemies.push(enemy);
  }

  step(input: CombatInput, dt: number): void {
    this.soundEvents = [];
    if (this.hp <= 0) { this.clearInput(); return; }
    this.captureInput(input, dt);
    if (this.hitstop > 0) { this.hitstop = Math.max(0, this.hitstop - dt); return; }
    this.dashProtected = false;
    this.barrier.step(dt);
    this.chainSeen.clear();
    this.lastChain = 0;
    for (const explosion of this.explosions) explosion.delay = Math.max(0, (explosion.delay ?? 0) - dt);
    this.surgeFlash = Math.max(0, this.surgeFlash - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.hurtFlash = Math.max(0, this.hurtFlash - dt);
    this.perfectFlash = Math.max(0, this.perfectFlash - dt);
    this.shotCooldown = Math.max(0, this.shotCooldown - dt);
    this.comboWindow = Math.max(0, this.comboWindow - dt);
    if (this.comboWindow === 0 && !this.attack) this.combo = 0;
    if (this.heavyCharges < HEAVY.charges) {
      this.heavyRecharge += dt;
      if (this.heavyRecharge + 1e-9 >= HEAVY.recharge) {
        this.heavyCharges++;
        this.heavyRecharge = this.heavyCharges === HEAVY.charges ? 0 : Math.max(0, this.heavyRecharge - HEAVY.recharge);
      }
    }
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
      if (this.imminentThreat()) this.rewardPerfectDodge();
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
      if (!this.attack && (pending === 'heavy' && this.heavyCharges > 0 || pending === 'melee' || input.melee)) {
        const heavy = pending === 'heavy' && this.heavyCharges > 0;
        this.beginAttack(heavy, heavy ? this.buffered?.angle : undefined);
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
      if (this.buffered?.action === 'charged' && this.chargedShots > 0 && this.shotCooldown <= 0 && !this.attack?.heavy) {
        const angle = this.buffered.angle ?? this.player.angle;
        this.buffered = null;
        this.chargedShots--;
        this.fire(this.player.x, this.player.y, angle, false, true);
        this.shotCooldown = 0.35;
      } else if ((this.buffered?.action === 'shoot' || input.shoot) && this.shotCooldown <= 0 && !this.attack?.heavy) {
        this.fire(this.player.x, this.player.y, this.player.angle, false);
        if (this.buffered?.action === 'shoot') this.buffered = null;
        this.shotCooldown = COMBAT.shotInterval;
      }
    }
    if (this.attack) {
      const attack = this.attack;
      if (!attack.resolved && !attack.heavy) attack.angle = this.player.angle;
      attack.age += dt;
      if (!attack.resolved && attack.age + 1e-9 >= attack.windup) {
        attack.resolved = true;
        let guardPoint: { x: number; y: number } | null = null;
        for (const enemy of this.enemies) {
          const dx = enemy.x - this.player.x, dy = enemy.y - this.player.y;
          if (enemy.hp > 0 && Math.hypot(dx, dy) <= attack.range + (enemy.kind === 'boss' ? 30 : 14) &&
              Math.abs(angleDifference(Math.atan2(dy, dx), attack.angle)) <= attack.arc / 2) {
            if (attack.heavy && this.mutations.includes('guardBreaker') && enemy.kind !== 'boss' &&
                (enemy.windup > 0 || enemy.kind === 'bulwark' && enemy.recovery <= 0)) guardPoint ??= { x: enemy.x, y: enemy.y };
            if (attack.heavy) this.detonate(enemy, 1.4);
            else {
              enemy.rupture = Math.min(3, enemy.rupture + 1);
              this.gainCharge(this.mutations.includes('catalyst') ? 2 : 1);
            }
            this.hitEnemy(enemy, attack.damage, attack.angle, attack.heavy ? HEAVY.force : LIGHT_COMBO[attack.combo - 1].force, attack.heavy ? HEAVY.stagger : LIGHT_COMBO[attack.combo - 1].stagger, attack.heavy && this.mutations.includes('guardBreaker'), attack.heavy ? 'heavy' : attack.combo === 3 ? 'light3' : attack.combo === 2 ? 'light2' : 'light');
          }
        }
        if (guardPoint && this.barrier.guardBreak(this.curse === 'ironOath')) {
          this.impact(guardPoint.x, guardPoint.y, 0x63d9f5, 22, 'guardBreak');
          const cue = this.impacts[this.impacts.length - 1];
          cue.sourceX = this.player.x; cue.sourceY = this.player.y;
        }
      }
      if (attack.age >= attack.duration) this.attack = null;
    }
    for (const enemy of this.enemies) this.stepEnemy(enemy, dt);
    if (!this.dashProtected) this.separateBodies();
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

  private beginAttack(heavy: boolean, angle = this.player.angle): void {
    this.stats.melee++;
    if (heavy) {
      this.heavyCharges--;
      if (this.curse === 'ironOath' && this.barrier.value > 0) this.barrier.gain(BARRIER.oathHeavyGain, false);
    }
    if (this.curse === 'bloodPact' && !heavy) this.hp = Math.max(1, this.hp - 1);
    const finisher = heavy && this.combo === 3 && this.comboWindow > 0;
    if (!heavy) this.combo = this.combo % 3 + 1;
    const light = LIGHT_COMBO[Math.max(0, this.combo - 1)];
    this.cue(heavy ? 'heavySwing' : this.combo === 3 ? 'swing3' : this.combo === 2 ? 'swing2' : 'swing');
    this.attack = {
      heavy, combo: this.combo, angle, age: 0,
      windup: heavy ? HEAVY.windup : light.windup,
      duration: heavy ? HEAVY.duration : light.duration,
      range: (heavy ? HEAVY.range : light.range) + (this.mutations.includes('phantomEdge') ? 20 : 0),
      arc: heavy ? HEAVY.arc : light.arc,
      damage: heavy ? (finisher ? HEAVY.finisherDamage : HEAVY.damage) : light.damage, resolved: false,
    };
    this.attack.damage *= (this.curse === 'bloodPact' ? 1.3 : 1) * (heavy && this.mutations.includes('guardBreaker') ? 1.3 : 1);
    if (heavy) this.combo = 0;
    this.comboWindow = 1.1;
  }

  private hitEnemy(enemy: Enemy, damage: number, angle: number, force: number, stagger: number, bypassArmor = false, sound: 'light' | 'light2' | 'light3' | 'heavy' | 'shotHit' | 'chargedHit' | 'blast' = 'blast'): void {
    if (enemy.hp <= 0) return;
    if (this.hp < this.maxHp / 2 && this.mutations.includes('berserker')) damage *= 1.25;
    if (enemy.kind === 'bulwark' && enemy.recovery <= 0 && !bypassArmor) damage *= 0.55;
    const contactX = enemy.x, contactY = enemy.y;
    const actualDamage = Math.min(enemy.hp, damage);
    enemy.hp = Math.max(0, enemy.hp - damage);
    if (this.mutations.includes('aegisCore') && ['light', 'light2', 'light3', 'heavy'].includes(sound)) {
      this.barrier.meleeDamage(actualDamage, this.curse === 'ironOath');
    }
    this.surge = Math.min(100, this.surge + 2);
    if (enemy.kind === 'boss') force *= 0.1;
    else if (enemy.kind === 'bulwark') force *= 0.4;
    enemy.x += Math.cos(angle) * force;
    enemy.y += Math.sin(angle) * force;
    clampPosition(enemy);
    enemy.stagger = enemy.kind === 'boss' ? 0 : stagger;
    const interrupts = sound === 'heavy' || sound === 'chargedHit' || sound === 'blast';
    if (enemy.kind !== 'boss' && interrupts) {
      enemy.windup = 0;
      enemy.cooldown = Math.max(enemy.cooldown, 0.45);
    }
    enemy.flash = 0.12;
    this.cue(sound === 'blast' ? 'light' : sound);
    this.impact(contactX, contactY, sound === 'heavy' || sound === 'chargedHit' ? 0xffcc80 : sound === 'light2' ? 0x80e8ff : 0xe5fff7,
      22, sound === 'blast' ? undefined : sound, angle);
    const stop = sound === 'blast' ? (damage >= 48 ? 0.05 : 0.025) : sound === 'heavy' ? 0.085 : sound === 'light3' ? 0.065 : sound === 'light2' ? 0.045 : sound === 'chargedHit' ? 0.04 : sound === 'shotHit' ? 0.012 : 0.033;
    this.hitstop = Math.max(this.hitstop, stop);
    if (enemy.hp === 0) {
      this.kills++;
      if (enemy.kind === 'boss') { this.bossSlain = true; this.bossDeathPosition = { x: contactX, y: contactY }; }
      this.surge = Math.min(100, this.surge + 8);
      if (this.curse === 'deathEcho') this.explosions.push({ x: enemy.x, y: enemy.y, damage: 20, radius: 80, hostile: false });
      if (enemy.kind === 'volatile') this.explosions.push({ x: enemy.x, y: enemy.y, damage: 38, radius: 110, hostile: true, playerDamage: Math.round(16 * enemy.damageScale) });
    }
  }

  private rewardPerfectDodge(): void {
    if (!this.perfectAvailable) return;
    this.perfectAvailable = false;
    this.perfectFlash = 0.65;
    this.cue('perfect');
    this.perfectDodges++;
    this.gainCharge(3);
    if (this.mutations.includes('staticRiposte')) this.explosions.push({ x: this.player.x, y: this.player.y, damage: 40, radius: 140, hostile: false });
    this.surge = Math.min(100, this.surge + 15);
    this.impact(this.player.x, this.player.y, 0x8affef);
  }

  private imminentThreat(): boolean {
    const { x, y } = this.player;
    if (this.projectiles.some(shot => shot.hostile && shot.life > 0 && segmentHitsCircle(shot.x, shot.y,
      shot.x + shot.vx * Math.min(shot.life, COMBAT.perfectWindow), shot.y + shot.vy * Math.min(shot.life, COMBAT.perfectWindow), x, y, PLAYER_RADIUS + 4))) return true;
    return this.enemies.some(enemy => this.isImminentEnemyThreat(enemy));
  }

  isImminentEnemyThreat(enemy: Enemy): boolean {
    const { x, y } = this.player;
    if (enemy.hp <= 0 || enemy.windup <= 0 || enemy.windup + enemy.stagger > COMBAT.perfectWindow) return false;
    const distance = Math.hypot(x - enemy.x, y - enemy.y);
    if (enemy.kind === 'volatile') return distance < ENEMY_ATTACK.volatile.range;
    if (enemy.kind === 'archer' || enemy.kind === 'boss' && enemy.action === 1) return false;
    if (enemy.kind === 'boss' && enemy.action === 2) return Math.hypot(x - enemy.targetX, y - enemy.targetY) < BOSS_ATTACK.slamRadius;
    return distance < (enemy.kind === 'boss' ? BOSS_ATTACK.range : ENEMY_ATTACK[enemy.kind].range) &&
      Math.abs(angleDifference(Math.atan2(y - enemy.y, x - enemy.x), enemy.angle)) < 0.85;
  }

  private separateBodies(): void {
    // Two bounded passes allow sliding around a crowd; dash deliberately phases through bodies.
    for (let pass = 0; pass < 2; pass++) {
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0) continue;
        const radius = PLAYER_RADIUS + (enemy.kind === 'boss' ? 32 : enemy.kind === 'bulwark' ? 22 : 14);
        const dx = this.player.x - enemy.x, dy = this.player.y - enemy.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= radius) continue;
        const nx = distance > 0.001 ? dx / distance : -Math.cos(this.player.angle);
        const ny = distance > 0.001 ? dy / distance : -Math.sin(this.player.angle);
        this.player.x += nx * (radius - distance);
        this.player.y += ny * (radius - distance);
        clampPosition(this.player);
      }
    }
  }

  private hurt(damage: number, angle: number): void {
    if (this.dashProtected || this.dashTime > 0) {
      if (this.perfectAvailable && this.dashTime >= COMBAT.dashDuration - COMBAT.perfectWindow) {
        this.rewardPerfectDodge();
      }
      return;
    }
    if (this.invulnerable > 0 || this.hp <= 0) return;
    if (this.curse === 'volatileSoul') damage *= 1.25;
    this.hp = Math.max(0, this.hp - this.barrier.absorb(damage));
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
    enemy.active = Math.max(0, enemy.active - dt);
    enemy.stagger = Math.max(0, enemy.stagger - dt);
    if (enemy.kind === 'archer' && enemy.windup > 0) enemy.angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
    if (enemy.stagger > 0) return;
    const spec = ENEMY_ATTACK[enemy.kind];
    if (enemy.recovery > 0) {
      enemy.recovery = Math.max(0, enemy.recovery - dt);
      enemy.cooldown = Math.max(0, enemy.cooldown - dt);
      return;
    }
    const dx = this.player.x - enemy.x, dy = this.player.y - enemy.y;
    const distance = Math.hypot(dx, dy);
    if (enemy.windup > 0) {
      enemy.windup = Math.max(0, enemy.windup - dt);
      if (enemy.windup === 0) {
        if (enemy.kind === 'volatile') {
          enemy.hp = 0;
          this.explosions.push({ x: enemy.x, y: enemy.y, damage: 38, radius: 110, hostile: true, playerDamage: Math.round(16 * enemy.damageScale) });
        } else if (enemy.kind === 'archer') this.fire(enemy.x, enemy.y, enemy.angle, true, false, Math.round(10 * enemy.damageScale));
        else if (distance < spec.range && Math.abs(angleDifference(Math.atan2(dy, dx), enemy.angle)) < 0.85) {
          this.hurt(Math.round((enemy.kind === 'bulwark' ? 22 : 12) * enemy.damageScale), enemy.angle);
        }
        enemy.cooldown = spec.cooldown;
        enemy.recovery = spec.recovery;
        enemy.active = 0.18;
      }
      return;
    }
    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    enemy.angle = Math.atan2(dy, dx);
    if (enemy.cooldown === 0 && distance < (enemy.kind === 'archer' ? 550 : enemy.kind === 'volatile' ? 80 : enemy.kind === 'bulwark' ? 90 : 60)) {
      enemy.windup = enemy.windupDuration = spec.windup;
      return;
    }
    const direction = enemy.kind !== 'archer' ? (distance > 40 ? 1 : 0) : (distance > 340 ? 1 : distance < 230 ? -1 : 0);
    if (distance > 0) {
      const speed = enemy.kind === 'grunt' ? 106 : enemy.kind === 'bulwark' ? 66 : 75;
      enemy.x += dx / distance * direction * speed * enemy.speedScale * dt;
      enemy.y += dy / distance * direction * speed * enemy.speedScale * dt;
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
    boss.active = Math.max(0, boss.active - dt);
    if (boss.recovery > 0) {
      boss.recovery = Math.max(0, boss.recovery - dt);
      boss.cooldown = Math.max(0, boss.cooldown - dt);
      return;
    }
    if (boss.windup > 0) {
      boss.windup = Math.max(0, boss.windup - dt);
      if (boss.windup === 0) {
        if (boss.action === 0) {
          const dx = this.player.x - boss.x, dy = this.player.y - boss.y;
          if (Math.hypot(dx, dy) < BOSS_ATTACK.range && Math.abs(angleDifference(Math.atan2(dy, dx), boss.angle)) < 0.85) this.hurt(26, boss.angle);
        } else if (boss.action === 1) {
          for (let i = 0; i < 12; i++) this.fire(boss.x, boss.y, i * Math.PI / 6 + boss.angle, true);
        } else {
          this.impact(boss.targetX, boss.targetY, 0xffcc80, 110);
          if (Math.hypot(this.player.x - boss.targetX, this.player.y - boss.targetY) < BOSS_ATTACK.slamRadius) {
            this.hurt(28, Math.atan2(this.player.y - boss.y, this.player.x - boss.x));
          }
        }
        boss.action = (boss.action + 1) % 3;
        boss.cooldown = boss.hp < boss.maxHp / 2 ? BOSS_ATTACK.enragedCooldown : BOSS_ATTACK.cooldown;
        boss.recovery = boss.hp < boss.maxHp / 2 ? BOSS_ATTACK.enragedRecovery : BOSS_ATTACK.recovery;
        boss.active = 0.22;
      }
      return;
    }
    boss.cooldown = Math.max(0, boss.cooldown - dt);
    const dx = this.player.x - boss.x, dy = this.player.y - boss.y;
    boss.angle = Math.atan2(dy, dx);
    if (boss.cooldown === 0) {
      boss.windup = boss.windupDuration = boss.hp < boss.maxHp / 2 ? BOSS_ATTACK.enragedWindup : BOSS_ATTACK.windup;
      boss.attackAction = boss.action;
      boss.targetX = this.player.x; boss.targetY = this.player.y;
    } else if (Math.hypot(dx, dy) > 155) {
      boss.x += Math.cos(boss.angle) * 80 * dt;
      boss.y += Math.sin(boss.angle) * 80 * dt;
      clampPosition(boss, 32);
    }
  }

  private fire(x: number, y: number, angle: number, hostile: boolean, charged = false, damage = 10): void {
    if (this.projectiles.length >= COMBAT.projectileLimit) return;
    if (!hostile) { this.stats.shots++; this.lastShot = { angle, charged }; this.cue(charged ? 'chargedGun' : 'gun'); }
    const speed = hostile ? 310 : 850;
    this.projectiles.push({ x: x + Math.cos(angle) * 24, y: y + Math.sin(angle) * 24,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, hostile, charged, damage, life: hostile ? 3 : 1.3 });
  }

  private stepProjectiles(dt: number): void {
    for (const shot of this.projectiles) {
      const x = shot.x, y = shot.y;
      shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt;
      if (shot.hostile) {
        if (segmentHitsCircle(x, y, shot.x, shot.y, this.player.x, this.player.y, PLAYER_RADIUS + 4)) {
          this.hurt(shot.damage ?? 10, Math.atan2(shot.vy, shot.vx)); shot.life = 0;
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
          if (shot.charged) target.rupture = Math.min(3, target.rupture + 1);
          else this.gainCharge(this.mutations.includes('catalyst') ? 2 : 1);
          this.detonate(target, shot.charged ? 2 : 1, !!shot.charged);
          this.hitEnemy(target, shot.charged ? RANGED.chargedDamage : RANGED.basicDamage, Math.atan2(shot.vy, shot.vx), 8, 0.08, !!shot.charged, shot.charged ? 'chargedHit' : 'shotHit');
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

  private detonate(enemy: Enemy, multiplier: number, charged = false, source?: Explosion): void {
    if (enemy.rupture === 0 || this.chainSeen.has(enemy.id) || this.pendingDetonations.has(enemy.id)) return;
    this.chainSeen.add(enemy.id);
    const stacks = enemy.rupture;
    enemy.rupture = 0;
    this.pendingDetonations.add(enemy.id);
    this.explosions.push({ x: enemy.x, y: enemy.y, damage: stacks * CHAIN.damagePerStack * multiplier * (this.curse === 'volatileSoul' ? 1.4 : 1) * (this.mutations.includes('detonationSpecialist') ? 1.25 : 1), radius: this.mutations.includes('detonationSpecialist') ? CHAIN.specialistRadius : CHAIN.radius, hostile: false, charged,
      enemyId: enemy.id, delay: source ? CHAIN.relayDelay : 0, sourceX: source?.x, sourceY: source?.y });
  }

  private resolveExplosions(): void {
    // Retain overflow; relay snapshots survive the marked target dying or moving.
    while (this.explosions.length > 0 && this.lastChain < COMBAT.chainLimit) {
      const ready = this.explosions.findIndex(item => (item.delay ?? 0) <= 1e-9);
      if (ready < 0) break;
      const [explosion] = this.explosions.splice(ready, 1);
      if (explosion.enemyId !== undefined) {
        this.pendingDetonations.delete(explosion.enemyId);
        this.chainSeen.add(explosion.enemyId);
        this.detonations++;
        this.gainCharge(1);
      }
      this.cue(explosion.charged ? 'chargedBlast' : 'detonate');
      this.lastChain++;
      this.impact(explosion.x, explosion.y, explosion.hostile ? 0xffb36b : 0x6bf3d0, explosion.radius, explosion.charged ? 'chargedBlast' : explosion.sourceX !== undefined ? 'chainBlast' : undefined);
      const blast = this.impacts[this.impacts.length - 1];
      blast.sourceX = explosion.sourceX; blast.sourceY = explosion.sourceY;
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0 || Math.hypot(enemy.x - explosion.x, enemy.y - explosion.y) > explosion.radius) continue;
        this.detonate(enemy, 1, false, explosion);
        this.hitEnemy(enemy, explosion.damage, Math.atan2(enemy.y - explosion.y, enemy.x - explosion.x), 12, 0.2, true);
      }
      if (explosion.hostile && Math.hypot(this.player.x - explosion.x, this.player.y - explosion.y) <= explosion.radius) {
        this.hurt(explosion.playerDamage ?? 16, Math.atan2(this.player.y - explosion.y, this.player.x - explosion.x));
      }
    }
  }

  private impact(x: number, y: number, color: number, radius = 22, kind?: Impact['kind'], angle = 0): void {
    // Keep the primary Charged blast readable when a chain fills the existing VFX budget.
    if (this.impacts.length >= 24) this.impacts.splice(Math.max(0, this.impacts.findIndex(item => item.kind !== 'chargedBlast')), 1);
    const duration = kind === 'guardBreak' ? 0.35 : kind === 'chainBlast' ? 0.24 : kind === 'chargedBlast' ? 0.36 : kind === 'chargedHit' ? 0.24 : kind === 'heavy' ? 0.26 : 0.18;
    this.impacts.push({ x, y, color, radius, kind, angle, duration, life: duration });
  }
}
