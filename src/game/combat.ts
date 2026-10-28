import { ASCENSION_VFX } from './config/ascensionVfx.js';
import { AscensionEffects } from './AscensionEffects.js';
import { ASCENSION } from './config/ascension.js';
import { ANOMALY_VFX } from './config/anomalyVfx.js';
import type { AnomalyId } from './config/legacy.js';
import { AnomalyEffects } from './AnomalyEffects.js';
import { ANOMALY } from './config/anomalies.js';
import { LegacyEffects, type PrimaryHit } from './LegacyEffects.js';
import { LEGACY } from './config/legacy.js';
import { ENEMY_HP, LIGHT_COMBO, HEAVY, ENEMY_GROWTH, RANGED, ENEMY_ATTACK, BOSS_ATTACK, BOSS_PHASE, CHAIN, BARRIER, GRUNT_LEAP, BUILD } from './config/balance.js';
import { BuildEffects, chainRoot, type ChainRoot, type ProcContext, admitProc, legacyRoot } from './BuildEffects.js';
import { draftSignals } from './DraftSignals.js';
import { Barrier } from './barrier.js';
import { CURSES, type MutationId, type CurseId, type CombatStats } from './builds.js';
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
  fracture: number; echoHaste: number; slow: number;
  leapCooldown: number; leapFromX: number; leapFromY: number;
  enraged: boolean; transform: number; followup: boolean; comboFinish: boolean;
  recovery: number; active: number; windupDuration: number; attackAction: number;
  angle: number; stagger: number; flash: number; rupture: number; action: number; targetX: number; targetY: number;
}
export interface Projectile {
  x: number; y: number; vx: number; vy: number; hostile: boolean; life: number; charged?: boolean; anomaly?: boolean; damage?: number; staticBonus?: number; glassBoost?: boolean; root?: ChainRoot;
}
export interface Attack {
  heavy: boolean; combo: number; angle: number; age: number;
  windup: number; duration: number; range: number; arc: number; damage: number; resolved: boolean; root: ChainRoot; bloodPact: boolean;
}
export interface Impact {
  x: number; y: number; life: number; color: number; radius?: number; duration?: number; arc?: number;
  anomaly?: AnomalyId;
  kind?: 'sealPulse' | 'sealEcho' | 'sealFracture' | 'sealHunterEnd' | 'anomalyFinisher' | 'anomalyCounter' | 'anomalySeal' | 'anomalyRelay' | 'anomalyStrike' | 'light' | 'light2' | 'light3' | 'heavy' | 'shotHit' | 'chargedHit' | 'chargedBlast' | 'chainBlast' | 'guardBreak' | 'phantom' | 'seed' | 'echo' | 'slow' | 'heal'; angle?: number; sourceX?: number; sourceY?: number;
}
interface Explosion { context?: ProcContext; root?: ChainRoot; echo?: boolean; volatileBoost?: boolean; x: number; y: number; damage: number; radius: number; hostile: boolean; charged?: boolean; playerDamage?: number; delay?: number; enemyId?: number; sourceX?: number; sourceY?: number }

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
  readonly build = new BuildEffects();
  readonly legacy = new LegacyEffects(this, (enemy, damage, context, bypass) =>
    this.hitEnemy(enemy, damage, 0, 0, 0, bypass, 'legacy', context.root, true, 0, context));
  readonly anomaly = new AnomalyEffects(this, (enemy, damage, context) => {
    this.hitEnemy(enemy, damage, 0, 0, 0, false, 'anomaly', context.root, true, 0, context);
    if (this.anomaly.active === 'staticField') {
      this.impact(enemy.x, enemy.y, 0xc399ff, 24, 'anomalyCounter');
      const cue = this.impacts[this.impacts.length - 1]; cue.sourceX = this.player.x; cue.sourceY = this.player.y;
    }
  },
    (damage, x, y) => this.hurt(damage, Math.atan2(this.player.y - y, this.player.x - x), false), points => this.gainCharge(points),
    zone => {
      this.impact(zone.x, zone.y, zone.storm ? 0xffe599 : 0xff6f87, zone.radius, 'anomalyStrike');
      this.impacts[this.impacts.length - 1].anomaly = zone.storm ? 'fracturedStorm' : zone.source !== undefined ? 'echoChamber' : 'volatileGround';
    });
  readonly ascension = new AscensionEffects(this, (enemy, damage, root) => this.hitEnemy(enemy, damage, 0, 0, 0, false, 'anomaly', root, true, 0, { root, depth: 1, origin: 'anomalySecondary' }),
    (damage, enemy) => this.hurt(damage, 0, enemy, false),
    (kind, x, y, radius) => this.impact(x, y, ASCENSION_VFX.active, radius, kind));
  private recordedDeaths = new Set<number>();
  private activeCurses: readonly CurseId[] = Object.freeze([]);
  get curses(): readonly CurseId[] { return this.activeCurses; }
  hasCurse(id: CurseId): boolean { return this.activeCurses.includes(id); }
  setCurses(values: readonly CurseId[]): void {
    const next = [...new Set(values)].filter(id => CURSES.includes(id)).slice(0, 2);
    const removed = this.curses.filter(id => !next.includes(id));
    this.activeCurses = Object.freeze(next);
    for (const id of removed) {
      if (id === 'bloodPact' && this.attack?.bloodPact) this.attack.bloodPact = false;
      if (id === 'glassSoul') for (const shot of this.projectiles ?? []) if (shot.glassBoost) {
        shot.damage = (shot.damage ?? 0) / BUILD.glassMultiplier; shot.glassBoost = false;
      }
      if (id === 'volatileSoul') {
        this.build.hazards = [];
        for (const explosion of this.explosions ?? []) if (explosion.volatileBoost) {
          explosion.damage /= BUILD.volatileMultiplier; explosion.volatileBoost = false;
        }
      }
      if (id === 'deathEcho') {
        for (const enemy of this.enemies ?? []) enemy.echoHaste = 0;
        this.explosions = (this.explosions ?? []).filter(explosion => !explosion.echo);
      }
      // Clocks and the shared heal budget survive removals/re-additions; reset owns clearing them.
    }
    this.hp = Math.min(this.hp, this.maxHp);
  }
  addCurse(id: CurseId, replaceSlot?: number): boolean {
    if (!CURSES.includes(id) || this.hasCurse(id)) return false;
    if (this.curses.length < 2) this.setCurses([...this.curses, id]);
    else {
      if (replaceSlot !== 0 && replaceSlot !== 1) return false;
      const next = [...this.curses]; next[replaceSlot] = id; this.setCurses(next);
    }
    return true;
  }
  draftSignals = draftSignals();
  stats: CombatStats = { melee: 0, shots: 0, dashes: 0 };
  practice = true;
  get maxHp(): number { return this.hasCurse('glassSoul') ? BUILD.glassMaxHp : COMBAT.maxHp; }
  get rechargeDuration(): number { return COMBAT.dashRecharge * (this.hasCurse('ironOath') ? BARRIER.oathDashMultiplier : 1); }
  get outgoingDamageMultiplier(): number {
    return (this.mutations.includes('aegisCore') ? BARRIER.aegisDamageMultiplier : 1) *
      (this.hasCurse('ironOath') ? BARRIER.oathDamageMultiplier : 1) *
      (this.hasCurse('bloodPact') ? BUILD.bloodDamageMultiplier : 1);
  }
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
  movementIntent = { x: 0, y: 0 };
  private gruntLeapGap = 0;
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
    this.setCurses([]);
    this.draftSignals = draftSignals();
    this.stats = { melee: 0, shots: 0, dashes: 0 };
    this.hp = COMBAT.maxHp;
    this.barrier.reset();
    this.build.reset();
    this.legacy.reset(); this.anomaly.reset(); this.ascension.reset(); this.recordedDeaths.clear();
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
    this.gruntLeapGap = 0;
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
      fracture: 0, echoHaste: 0, slow: 0, leapCooldown: GRUNT_LEAP.initialDelay + id % 5 * GRUNT_LEAP.initialSpread, leapFromX: 0, leapFromY: 0,
      cooldown: 0.8 + (id % 4) * 0.2, windup: 0, recovery: 0, active: 0, windupDuration: 0, attackAction: 0, enraged: false, transform: 0, followup: false, comboFinish: false, angle: 0, stagger: 0, flash: 0, rupture: 0, action: 0, targetX: 0, targetY: 0,
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

  get bossTransforming(): boolean {
    return this.enemies.some(enemy => enemy.kind === 'boss' && enemy.hp > 0
      && (enemy.transform > 0 || !enemy.enraged && enemy.hp <= enemy.maxHp / 2));
  }

  step(input: CombatInput, dt: number): void {
    this.soundEvents = [];
    if (this.hp <= 0) { this.clearInput(); return; }
    if (this.bossTransforming) {
      const boss = this.enemies.find(enemy => enemy.kind === 'boss' && enemy.hp > 0)!;
      if (!boss.enraged) {
        boss.enraged = true;
        boss.transform = BOSS_PHASE.transform;
        boss.windup = boss.active = boss.recovery = 0;
        boss.followup = boss.comboFinish = false;
        boss.cooldown = BOSS_ATTACK.enragedCooldown;
      }
      boss.transform = Math.max(0, boss.transform - dt);
      if (boss.transform < 1e-9) boss.transform = 0;
      boss.flash = Math.max(0, boss.flash - dt);
      this.clearInput();
      // Consume edges without banking actions or turning a held special into a new press.
      for (const action of ['shoot', 'melee', 'charged', 'heavy', 'ultimate', 'dash'] as const) this.previousInput[action] = !!input[action];
      return; // Only transformation presentation advances; the entire combat world is frozen.
    }
    this.captureInput(input, dt);
    if (this.hitstop > 0) { this.hitstop = Math.max(0, this.hitstop - dt); return; }
    this.dashProtected = false;
    const inputLength = Math.hypot(input.dx, input.dy);
    this.movementIntent = { x: inputLength ? input.dx / inputLength : 0, y: inputLength ? input.dy / inputLength : 0 };
    this.barrier.step(dt);
    this.build.step(dt);
    this.legacy.step(dt);
    for (const enemy of this.enemies) {
      enemy.slow = Math.max(0, (enemy.slow ?? 0) - dt);
      enemy.fracture = Math.max(0, (enemy.fracture ?? 0) - dt);
      enemy.echoHaste = Math.max(0, (enemy.echoHaste ?? 0) - dt);
    }
    this.resolveBuildEffects();
    this.gruntLeapGap = Math.max(0, this.gruntLeapGap - dt);
    this.chainSeen.clear();
    this.lastChain = 0;
    for (const explosion of this.explosions) explosion.delay = Math.max(0, (explosion.delay ?? 0) - dt);
    this.surgeFlash = Math.max(0, this.surgeFlash - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.hurtFlash = Math.max(0, this.hurtFlash - dt);
    this.perfectFlash = Math.max(0, this.perfectFlash - dt);
    this.shotCooldown = Math.max(0, this.shotCooldown - dt);
    this.comboWindow = Math.max(0, this.comboWindow - dt);
    if (this.comboWindow === 0 && !this.attack) { this.combo = 0; this.build.comboStage = 0; }
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
      this.stats.dashes++; this.draftSignals.dashes++;
      this.dashTime = COMBAT.dashDuration;
      this.dashAngle = input.dx || input.dy ? Math.atan2(input.dy, input.dx) : this.player.angle;
      this.perfectAvailable = true;
      if (this.imminentThreat()) this.rewardPerfectDodge();
      if (this.attack?.heavy && !this.attack.resolved && this.attack.bloodPact) this.payBloodMiss();
      this.attack = null;
    }
    const movementStart = { x: this.player.x, y: this.player.y };
    if (this.dashTime > 0) {
      this.dashProtected = true;
      const duration = Math.min(dt, this.dashTime);
      this.player.x += Math.cos(this.dashAngle) * COMBAT.dashSpeed * duration;
      this.player.y += Math.sin(this.dashAngle) * COMBAT.dashSpeed * duration;
      clampPosition(this.player);
      this.dashTime = Math.max(0, this.dashTime - dt);
    } else {
      movePlayer(this.player, input.dx, input.dy, dt * (this.attack?.heavy ? 0.45 : 1) * this.legacy.movementSpeed);
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
        this.shotCooldown = Math.max(LEGACY.minShotInterval, COMBAT.shotInterval / this.legacy.attackSpeed);
      }
    }
    const walkDistance = Math.hypot(this.player.x - movementStart.x, this.player.y - movementStart.y);
    if (this.mutations.includes('kineticBattery') && this.enemies.some(e => e.hp > 0 && Math.hypot(e.x - movementStart.x, e.y - movementStart.y) <= BUILD.kineticRange)) {
      if (this.build.kinetic < BUILD.kineticCap && this.build.kineticRate <= 1e-9) {
        this.build.kineticDistance += Math.hypot(this.player.x - movementStart.x, this.player.y - movementStart.y);
        if (this.build.kineticDistance >= BUILD.kineticDistance) {
          this.build.kinetic++; this.build.kineticDistance = 0; this.build.kineticRate = BUILD.kineticRate;
        }
      } else this.build.kineticDistance = 0;
    }
    if (this.attack) {
      const attack = this.attack;
      if (!attack.resolved && !attack.heavy) attack.angle = this.player.angle;
      attack.age += dt;
      if (!attack.resolved && attack.age + 1e-9 >= attack.windup) {
        attack.resolved = true;
        if (!attack.heavy) this.legacy.light(attack.root, attack.angle);
        let hits = 0, effectiveHeavy = false;
        let finisherPoint: { x: number; y: number } | null = null;
        let guardPoint: { x: number; y: number } | null = null;
        this.legacy.prepareAttack(attack);
        for (const enemy of this.enemies) {
          const dx = enemy.x - this.player.x, dy = enemy.y - this.player.y;
          if (enemy.hp > 0 && Math.hypot(dx, dy) <= attack.range + (enemy.kind === 'boss' ? 30 : 14) &&
              Math.abs(angleDifference(Math.atan2(dy, dx), attack.angle)) <= attack.arc / 2) {
            hits++;
            finisherPoint ??= { x: enemy.x, y: enemy.y };
            if (attack.heavy && enemy.kind !== 'boss' && (enemy.windup > 0 || enemy.kind === 'bulwark' && enemy.recovery <= 0)) effectiveHeavy = true;
            if (attack.heavy && this.mutations.includes('guardBreaker') && enemy.kind !== 'boss' &&
                (enemy.windup > 0 || enemy.kind === 'bulwark' && enemy.recovery <= 0)) guardPoint ??= { x: enemy.x, y: enemy.y };
            if (attack.heavy) this.detonate(enemy, 1.4, false, undefined, attack.root);
            else {
              enemy.rupture = Math.min(3, enemy.rupture + 1);
              this.gainCharge(this.mutations.includes('catalyst') ? 2 : 1);
            }
            this.hitEnemy(enemy, attack.damage, attack.angle, attack.heavy ? HEAVY.force : LIGHT_COMBO[attack.combo - 1].force, attack.heavy ? HEAVY.stagger : LIGHT_COMBO[attack.combo - 1].stagger, attack.heavy && this.mutations.includes('guardBreaker'), attack.heavy ? 'heavy' : attack.combo === 3 ? 'light3' : attack.combo === 2 ? 'light2' : 'light', attack.root);
          }
        }
        if (hits > 0 && attack.combo === 3) {
          const before = this.chargedShots * 3 + this.chargePoints;
          this.anomaly.finisher();
          if (this.chargedShots * 3 + this.chargePoints > before && finisherPoint) {
            this.impact(finisherPoint.x, finisherPoint.y, 0xff6f87, 32, 'anomalyFinisher', attack.angle);
            const cue = this.impacts[this.impacts.length - 1]; cue.sourceX = this.player.x; cue.sourceY = this.player.y;
          }
        }
        if (effectiveHeavy) this.draftSignals.heavySuccess++;
        if (attack.heavy && hits === 0 && attack.bloodPact) this.payBloodMiss();
        if (!attack.heavy) {
          if (this.mutations.includes('berserker')) this.build.light(attack.combo, hits > 0);
          if (hits > 0 && this.build.phantom > 0 && this.mutations.includes('phantomEdge')) {
            this.build.phantom = 0;
            this.build.phantoms.push({ x: this.player.x, y: this.player.y, angle: attack.angle, range: attack.range, arc: attack.arc, delay: BUILD.phantomDelay, root: attack.root });
          }
        }
        if (guardPoint && this.barrier.guardBreak(this.hasCurse('ironOath'))) {
          this.impact(guardPoint.x, guardPoint.y, 0x63d9f5, 22, 'guardBreak');
          const cue = this.impacts[this.impacts.length - 1];
          cue.sourceX = this.player.x; cue.sourceY = this.player.y;
        }
      }
      if (attack.age >= attack.duration) this.attack = null;
    }
    this.anomaly.step(dt); // Resolve warned zones after this tick's walk/Dash input.
    for (const enemy of this.enemies) this.stepEnemy(enemy, dt);
    this.ascension.step(dt);
    if (!this.dashProtected) this.separateBodies();
    const actualDx = this.player.x - movementStart.x, actualDy = this.player.y - movementStart.y;
    const forward = actualDx * this.movementIntent.x + actualDy * this.movementIntent.y > 0;
    this.legacy.move(!this.dashProtected && inputLength > 0 && forward && this.hurtFlash <= 0 ? Math.min(walkDistance, Math.hypot(actualDx, actualDy)) : 0, dt);
    this.stepProjectiles(dt);
    this.legacy.resolve();
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
      this.draftSignals.heavies++;
      this.heavyCharges--;
      if (this.hasCurse('ironOath') && this.barrier.value > 0) this.barrier.gain(BARRIER.oathHeavyGain, false);
    }
    const finisher = heavy && this.combo === 3 && this.comboWindow > 0;
    if (!heavy) this.combo = this.combo % 3 + 1;
    const light = LIGHT_COMBO[Math.max(0, this.combo - 1)];
    this.cue(heavy ? 'heavySwing' : this.combo === 3 ? 'swing3' : this.combo === 2 ? 'swing2' : 'swing');
    this.attack = {
      heavy, combo: this.combo, angle, age: 0,
      windup: heavy ? HEAVY.windup : light.windup,
      duration: heavy ? HEAVY.duration : this.legacy.attackSpeed === 1 ? light.duration : light.windup + [0.065, 0.085, 0.14][this.combo - 1] + Math.max(LEGACY.minLightRecovery, (light.duration - light.windup - [0.065, 0.085, 0.14][this.combo - 1]) / this.legacy.attackSpeed),
      range: (heavy ? HEAVY.range : light.range) + (this.mutations.includes('phantomEdge') ? 20 : 0),
      arc: heavy ? HEAVY.arc : light.arc,
      damage: heavy ? (finisher ? HEAVY.finisherDamage : HEAVY.damage) : light.damage, resolved: false, root: chainRoot(), bloodPact: this.hasCurse('bloodPact'),
    };
    this.attack.damage *= (this.build.frenzy > 0 && this.mutations.includes('berserker') ? BUILD.frenzyMultiplier : 1) * (heavy && this.mutations.includes('guardBreaker') ? 1.3 : 1);
    if (heavy) this.combo = 0;
    if (heavy && this.mutations.includes('ironReversal') && this.build.reversal > 0) { this.attack.damage *= BUILD.reversalMultiplier; this.build.reversal = 0; }
    this.comboWindow = 1.1;
  }

  private hitEnemy(enemy: Enemy, damage: number, angle: number, force: number, stagger: number, bypassArmor = false, sound: 'light' | 'light2' | 'light3' | 'heavy' | 'shotHit' | 'chargedHit' | 'blast' | 'phantom' | 'legacy' | 'anomaly' = 'blast', root: ChainRoot = chainRoot(), playerSource = true, procBonus = 0, context?: ProcContext): void {
    if (enemy.hp <= 0) return;
    const primaryKind: PrimaryHit | null = sound === 'heavy' ? 'heavy' : sound === 'chargedHit' ? 'charged' : sound === 'shotHit' ? 'basic' : ['light', 'light2', 'light3'].includes(sound) ? 'light' : null;
    if (primaryKind && this.legacy.selection) legacyRoot(root);
    const eventContext: ProcContext = context ?? { root, depth: 0, origin: primaryKind ? 'primary' : playerSource ? 'mutationSecondary' : 'hostile' };
    const legacySnapshot = { x: enemy.x, y: enemy.y, windup: enemy.windup };
    const directBase = Math.max(0, damage - procBonus);
    if ((sound === 'heavy' || sound === 'chargedHit') && enemy.fracture > 0) { damage += BUILD.fractureDamage; enemy.fracture = 0; }
    const directShare = damage > 0 ? directBase / damage : 0;
    if (playerSource) damage *= this.outgoingDamageMultiplier;
    if (enemy.kind === 'bulwark' && enemy.recovery <= 0 && !bypassArmor && !(primaryKind && this.legacy.armorBroken(enemy))) damage *= 0.55;
    const marked = enemy.rupture > 0 || root.marked.has(enemy.id);
    const contactX = enemy.x, contactY = enemy.y;
    const actualDamage = Math.min(enemy.hp, damage);
    enemy.hp = Math.max(0, enemy.hp - damage);
    if (playerSource && actualDamage > 0) {
      if (['light', 'light2', 'light3', 'heavy'].includes(sound)) { this.draftSignals.meleeDamage += actualDamage * directShare; this.draftSignals.meleeHits++; }
      else if (sound === 'shotHit' || sound === 'chargedHit') { this.draftSignals.rangedDamage += actualDamage * directShare; this.draftSignals.rangedHits++; }
    }
    if (this.mutations.includes('aegisCore') && ['light', 'light2', 'light3', 'heavy'].includes(sound)) {
      this.barrier.meleeDamage(actualDamage, this.hasCurse('ironOath'));
    }
    if (this.hasCurse('bloodPact') && this.barrier.value <= 0 && ['light', 'light2', 'light3', 'heavy'].includes(sound)) this.healPlayer();
    this.surge = Math.min(100, this.surge + 2);
    const resisted = this.anomaly.resists(enemy);
    let sealCue = false;
    if (sound === 'heavy' && this.anomaly.heavy(enemy)) {
      sealCue = true;
      force += ANOMALY.seal.force; stagger += ANOMALY.seal.stagger;
      this.anomaly.resistance.set(enemy.id, stagger + ANOMALY.seal.resistance);
    }
    if (enemy.kind === 'boss') force *= 0.1;
    else if (enemy.kind === 'bulwark') force *= 0.4;
    enemy.x += Math.cos(angle) * force;
    enemy.y += Math.sin(angle) * force;
    clampPosition(enemy);
    if (!resisted && sound !== 'phantom' && sound !== 'legacy' && sound !== 'anomaly') enemy.stagger = enemy.kind === 'boss' ? 0 : stagger;
    const interrupts = sound === 'heavy' || sound === 'chargedHit' || sound === 'blast';
    if (!resisted && enemy.kind !== 'boss' && interrupts) {
      enemy.windup = 0;
      enemy.cooldown = Math.max(enemy.cooldown, 0.45);
    }
    enemy.flash = 0.12;
    if (sound !== 'legacy' && sound !== 'anomaly') this.cue(sound === 'blast' || sound === 'phantom' ? 'light' : sound);
    this.impact(contactX, contactY, sound === 'heavy' || sound === 'chargedHit' ? 0xffcc80 : sound === 'light2' ? 0x80e8ff : 0xe5fff7,
      22, sound === 'blast' || sound === 'phantom' || sound === 'legacy' || sound === 'anomaly' ? undefined : sound, angle);
    if (sealCue) this.impact(contactX, contactY, 0xffedce, 30, 'anomalySeal', angle);
    const stop = sound === 'blast' ? (damage >= 48 ? 0.05 : 0.025) : sound === 'heavy' ? 0.085 : sound === 'light3' ? 0.065 : sound === 'light2' ? 0.045 : sound === 'chargedHit' ? 0.04 : sound === 'shotHit' ? 0.012 : 0.033;
    if (sound !== 'phantom' && sound !== 'legacy' && sound !== 'anomaly') this.hitstop = Math.max(this.hitstop, stop);
    if (enemy.hp === 0 && !this.recordedDeaths.has(enemy.id)) {
      this.recordedDeaths.add(enemy.id);
      this.kills++;
      if (marked && this.mutations.includes('bloodReclaimer')) {
        const healed = this.healPlayer('reclaimerCooldown', BUILD.reclaimerHeal, BUILD.reclaimerCooldown);
        if (healed) { this.impact(contactX, contactY, 0xff879a, 16, 'heal'); const cue = this.impacts[this.impacts.length - 1]; cue.sourceX = this.player.x; cue.sourceY = this.player.y; }
      }
      if (this.hasCurse('huntedVessel') && this.build.huntedCooldown <= 1e-9) {
        this.build.huntedCooldown = BUILD.huntedCooldown;
        this.barrier.gain(BUILD.huntedBarrier, false); this.surge = Math.min(100, this.surge + BUILD.huntedSurge);
      }
      if (enemy.kind === 'boss') { this.bossSlain = true; this.bossDeathPosition = { x: contactX, y: contactY }; }
      this.surge = Math.min(100, this.surge + 8);
      if (this.hasCurse('deathEcho') && root.echoes < BUILD.echoCap && admitProc(root, eventContext.depth + 1)) {
        root.echoes++;
        this.explosions.push({ x: enemy.x, y: enemy.y, damage: BUILD.echoDamage, radius: BUILD.echoRadius, hostile: false, root, echo: true, context: { root, depth: eventContext.depth + 1, origin: 'curseSecondary' } });
      }
      if (enemy.kind === 'volatile') this.explosions.push({ x: enemy.x, y: enemy.y, damage: 38, radius: 110, hostile: true, playerDamage: Math.round(16 * enemy.damageScale), root, context: { root, depth: eventContext.depth + 1, origin: 'hostile' } });
      if (playerSource) this.legacy.killed(enemy, eventContext);
    }
    if (primaryKind && playerSource && actualDamage > 0) this.legacy.primary(enemy, primaryKind, root, legacySnapshot);
    if (enemy.hp <= 0 && this.legacy.mark?.id === enemy.id) this.legacy.mark = null;
  }

  private rewardPerfectDodge(): void {
    if (!this.perfectAvailable) return;
    this.perfectAvailable = false;
    this.perfectFlash = 0.65;
    this.cue('perfect');
    this.legacy.perfect();
    this.anomaly.perfect();
    this.perfectDodges++; this.draftSignals.perfects++;
    this.gainCharge(3);
    this.build.perfect(this.mutations.includes('phantomEdge'), this.mutations.includes('staticRiposte'));
    if (this.hasCurse('ghostStep') && this.dashCharges < COMBAT.dashCharges) {
      this.dashRecharge += BUILD.ghostRefund;
      if (this.dashRecharge + 1e-9 >= this.rechargeDuration) {
        this.dashCharges++; this.dashRecharge = this.dashCharges === COMBAT.dashCharges ? 0 : this.dashRecharge - this.rechargeDuration;
      }
    }
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
    if (enemy.kind === 'grunt' && enemy.attackAction === 3) return Math.hypot(x - enemy.targetX, y - enemy.targetY) < GRUNT_LEAP.radius;
    if (enemy.kind === 'volatile') return distance < ENEMY_ATTACK.volatile.range;
    if (enemy.kind === 'archer' || enemy.kind === 'boss' && enemy.attackAction === 1) return false;
    if (enemy.kind === 'boss' && enemy.attackAction === 2) return Math.hypot(x - enemy.targetX, y - enemy.targetY) < BOSS_ATTACK.slamRadius;
    return distance < (enemy.kind === 'boss' ? BOSS_ATTACK.range : ENEMY_ATTACK[enemy.kind].range) &&
      Math.abs(angleDifference(Math.atan2(y - enemy.y, x - enemy.x), enemy.angle)) < 0.85;
  }

  private separateBodies(): void {
    // Two bounded passes allow sliding around a crowd; dash deliberately phases through bodies.
    for (let pass = 0; pass < 2; pass++) {
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0 || enemy.windup > 0 && (enemy.kind === 'grunt' && enemy.attackAction === 3 && enemy.windup <= GRUNT_LEAP.flight || enemy.kind === 'boss' && enemy.attackAction === 2 && enemy.windup <= BOSS_ATTACK.leapFlight)) continue;
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

  private healPlayer(source: 'bloodCooldown' | 'reclaimerCooldown' | 'parasiticCooldown' = 'bloodCooldown', requested: number = BUILD.bloodHeal, cooldown: number = BUILD.bloodCooldown): number {
    const healed = this.build.heal(this.hp, this.maxHp, source, requested, cooldown);
    this.hp += healed; this.draftSignals.healed += healed;
    return healed;
  }

  private payBloodMiss(): void {
    const lost = Math.min(BUILD.bloodMissCost, Math.max(0, this.hp - 1));
    this.hp -= lost;
    if (lost > 0) { this.build.loseHp(); this.build.costFlash = 0.5; }
  }

  private resolveBuildEffects(): void {
    const ready = this.build.phantoms.filter(slash => slash.delay <= 1e-9);
    this.build.phantoms = this.build.phantoms.filter(slash => slash.delay > 1e-9);
    for (const slash of ready) {
      this.impact(slash.x, slash.y, 0x9dffe2, slash.range, 'phantom', slash.angle);
      this.impacts[this.impacts.length - 1].arc = slash.arc;
      for (const enemy of this.enemies) {
        const dx = enemy.x - slash.x, dy = enemy.y - slash.y;
        if (enemy.hp <= 0 || Math.hypot(dx, dy) > slash.range + (enemy.kind === 'boss' ? 30 : 14) || Math.abs(angleDifference(Math.atan2(dy, dx), slash.angle)) > slash.arc / 2) continue;
        enemy.rupture = Math.min(3, enemy.rupture + 1);
        this.hitEnemy(enemy, BUILD.phantomDamage, slash.angle, 0, 0, false, 'phantom', slash.root);
      }
    }
    const hazards = this.build.hazards.filter(hazard => hazard.time <= 1e-9);
    this.build.hazards = this.build.hazards.filter(hazard => hazard.time > 1e-9);
    for (const hazard of hazards) {
      this.impact(hazard.x, hazard.y, 0xffb36b, BUILD.hazardRadius);
      if (Math.hypot(this.player.x - hazard.x, this.player.y - hazard.y) <= BUILD.hazardRadius) {
        this.hurt(BUILD.hazardDamage, Math.atan2(this.player.y - hazard.y, this.player.x - hazard.x), false);
      }
    }
  }

  private hurt(damage: number, angle: number, enemySource = true, knockback = true): void {
    if (this.dashProtected || this.dashTime > 0) {
      if (enemySource && this.perfectAvailable && this.dashTime >= COMBAT.dashDuration - COMBAT.perfectWindow) {
        this.rewardPerfectDodge();
      }
      return;
    }
    if (this.invulnerable > 0 || this.hp <= 0) return;
    if (enemySource && this.ascension.penalty > 0) damage *= ASCENSION.fracture.penalty;
    if (enemySource && this.hasCurse('ghostStep') && this.dashCharges === 0) damage *= BUILD.ghostRisk;
    if (enemySource && this.mutations.includes('kineticBattery') && this.build.kinetic > 0 && this.build.kineticCooldown <= 1e-9) {
      this.barrier.gain(this.build.kinetic * BUILD.kineticBarrier, this.hasCurse('ironOath'));
      this.build.kinetic = this.build.kineticDistance = 0; this.build.kineticCooldown = BUILD.kineticCooldown;
    }
    const hpDamage = this.barrier.absorb(damage);
    if (enemySource) {
      this.draftSignals.absorbed += damage - hpDamage;
      this.draftSignals.enemyHpDamage += Math.min(this.hp, hpDamage);
    }
    this.hp = Math.max(0, this.hp - hpDamage);
    if (hpDamage > 0) this.build.loseHp();
    if (enemySource && this.hp > 0) {
      if (hpDamage > 0 && this.mutations.includes('ironReversal') && this.build.reversalCooldown <= 1e-9) {
        this.build.reversal = BUILD.reversalDuration; this.build.reversalCooldown = BUILD.reversalCooldown;
      }
      if (this.mutations.includes('soulAnchor') && !this.build.anchorUsed && this.hp <= this.maxHp * BUILD.anchorThreshold) {
        this.build.anchorUsed = true; this.build.anchorFlash = 0.6; this.barrier.gain(BUILD.anchorBarrier, this.hasCurse('ironOath'));
        for (const enemy of this.enemies) {
          const dx = enemy.x - this.player.x, dy = enemy.y - this.player.y, distance = Math.hypot(dx, dy);
          if (enemy.hp <= 0 || enemy.kind === 'boss' || distance > BUILD.anchorRadius) continue;
          const force = BUILD.anchorForce * (enemy.kind === 'bulwark' ? 0.4 : 1), direction = distance ? Math.atan2(dy, dx) : angle;
          enemy.x += Math.cos(direction) * force; enemy.y += Math.sin(direction) * force; clampPosition(enemy);
        }
      }
    }
    this.invulnerable = 0.65;
    this.cue('hurt');
    this.hurtFlash = 0.18;
    if (knockback) {
      this.player.x += Math.cos(angle) * 20;
      this.player.y += Math.sin(angle) * 20;
    }
    clampPosition(this.player);
    if (knockback) this.hitstop = Math.max(this.hitstop, 0.04);
    this.impact(this.player.x, this.player.y, 0xff6f87);
  }

  private stepEnemy(enemy: Enemy, dt: number): void {
    if (enemy.hp <= 0) return;
    if (enemy.kind === 'boss') { this.stepBoss(enemy, dt); return; }
    enemy.flash = Math.max(0, enemy.flash - dt);
    enemy.active = Math.max(0, enemy.active - dt);
    enemy.leapCooldown = Math.max(0, enemy.leapCooldown - dt);
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
      if (enemy.kind === 'grunt' && enemy.attackAction === 3) this.moveLeap(enemy, GRUNT_LEAP.flight);
      if (enemy.windup === 0) {
        if (enemy.kind === 'grunt' && enemy.attackAction === 3) {
          if (Math.hypot(this.player.x - enemy.targetX, this.player.y - enemy.targetY) < GRUNT_LEAP.radius) this.hurt(Math.round(GRUNT_LEAP.damage * enemy.damageScale), enemy.angle);
        } else if (enemy.kind === 'volatile') {
          enemy.hp = 0;
          this.explosions.push({ x: enemy.x, y: enemy.y, damage: 38, radius: 110, hostile: true, playerDamage: Math.round(16 * enemy.damageScale) });
        } else if (enemy.kind === 'archer') {
          this.fire(enemy.x, enemy.y, enemy.angle, true, false, Math.round(10 * enemy.damageScale));
          if (this.anomaly.extraVolley()) for (const offset of [-ANOMALY.static.spread, ANOMALY.static.spread])
            this.fire(enemy.x, enemy.y, enemy.angle + offset, true, false, Math.round(10 * enemy.damageScale), undefined, true);
        }
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
    if (enemy.kind === 'grunt' && enemy.leapCooldown === 0 && this.gruntLeapGap <= 1e-9 && distance >= GRUNT_LEAP.minRange && distance <= GRUNT_LEAP.maxRange &&
        this.enemies.filter(e => e.kind === 'grunt' && e.attackAction === 3 && e.windup > 0).length < GRUNT_LEAP.maxConcurrent) {
      enemy.attackAction = 3;
      this.lockLeap(enemy, GRUNT_LEAP.lead, GRUNT_LEAP.distance);
      enemy.windup = enemy.windupDuration = GRUNT_LEAP.windup;
      enemy.leapCooldown = GRUNT_LEAP.cooldown + enemy.id % 3 * 0.7;
      const gruntCount = this.enemies.filter(e => e.kind === 'grunt' && e.hp > 0).length;
      this.gruntLeapGap = gruntCount >= GRUNT_LEAP.crowdThreshold ? GRUNT_LEAP.crowdGap : GRUNT_LEAP.sparseGap;
      return;
    }
    if (enemy.cooldown === 0 && distance < (enemy.kind === 'archer' ? 550 : enemy.kind === 'volatile' ? 80 : enemy.kind === 'bulwark' ? 90 : 60)) {
      enemy.attackAction = 0;
      enemy.windup = enemy.windupDuration = spec.windup;
      return;
    }
    const direction = enemy.kind !== 'archer' ? (distance > 40 ? 1 : 0) : (distance > 340 ? 1 : distance < 230 ? -1 : 0);
    if (distance > 0) {
      const pursuit = direction > 0 ? this.anomaly.pursuit : 1;
      const speed = enemy.kind === 'grunt' ? 106 : enemy.kind === 'bulwark' ? 66 : 75;
      const predicted = this.ascension.pursuit(enemy);
      const px = predicted.x - enemy.x, py = predicted.y - enemy.y, pd = Math.hypot(px, py) || 1;
      enemy.x += px / pd * direction * speed * pursuit * enemy.speedScale * (enemy.echoHaste > 0 || this.hasCurse('huntedVessel') && direction > 0 ? BUILD.hasteMultiplier : 1) * Math.min(enemy.slow > 0 ? BUILD.slowMultiplier : 1, this.legacy.slowMultiplier(enemy)) * dt;
      enemy.y += py / pd * direction * speed * pursuit * enemy.speedScale * (enemy.echoHaste > 0 || this.hasCurse('huntedVessel') && direction > 0 ? BUILD.hasteMultiplier : 1) * Math.min(enemy.slow > 0 ? BUILD.slowMultiplier : 1, this.legacy.slowMultiplier(enemy)) * dt;
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

  private lockLeap(enemy: Enemy, lead: number, maxDistance = Infinity): void {
    const target = { x: this.player.x + this.movementIntent.x * lead, y: this.player.y + this.movementIntent.y * lead };
    clampPosition(target, enemy.kind === 'boss' ? 32 : 14);
    const dx = target.x - enemy.x, dy = target.y - enemy.y, distance = Math.hypot(dx, dy);
    const ratio = distance ? Math.min(1, maxDistance / distance) : 0;
    enemy.targetX = enemy.x + dx * ratio; enemy.targetY = enemy.y + dy * ratio;
    enemy.leapFromX = enemy.x; enemy.leapFromY = enemy.y;
  }

  private moveLeap(enemy: Enemy, flight: number): void {
    if (enemy.windup > flight) return;
    const progress = Math.min(1, 1 - enemy.windup / flight);
    enemy.x = enemy.leapFromX + (enemy.targetX - enemy.leapFromX) * progress;
    enemy.y = enemy.leapFromY + (enemy.targetY - enemy.leapFromY) * progress;
  }

  private stepBoss(boss: Enemy, dt: number): void {
    boss.flash = Math.max(0, boss.flash - dt);
    // Damage may cross the threshold earlier in this tick; never release an attack after it.
    if (!boss.enraged && boss.hp <= boss.maxHp / 2) return;
    boss.active = Math.max(0, boss.active - dt);
    if (boss.recovery > 0) {
      boss.recovery = Math.max(0, boss.recovery - dt);
      boss.cooldown = Math.max(0, boss.cooldown - dt);
      return;
    }
    if (boss.followup && boss.recovery === 0) {
      boss.followup = false;
      boss.comboFinish = true;
      boss.active = 0;
      boss.attackAction = 0;
      boss.angle = Math.atan2(this.player.y - boss.y, this.player.x - boss.x);
      boss.windup = boss.windupDuration = BOSS_PHASE.followupWindup;
    }
    if (boss.windup > 0) {
      boss.windup = Math.max(0, boss.windup - dt);
      if (boss.attackAction === 2) this.moveLeap(boss, BOSS_ATTACK.leapFlight);
      if (boss.windup === 0) {
        if (boss.attackAction === 0) {
          const dx = this.player.x - boss.x, dy = this.player.y - boss.y;
          if (Math.hypot(dx, dy) < BOSS_ATTACK.range && Math.abs(angleDifference(Math.atan2(dy, dx), boss.angle)) < 0.85) this.hurt(26, boss.angle);
        } else if (boss.attackAction === 1) {
          for (let i = 0; i < 12; i++) this.fire(boss.x, boss.y, i * Math.PI / 6 + boss.angle, true, false, 10, BOSS_ATTACK.projectileSpeed);
          for (const offset of [-0.16, 0, 0.16]) this.fire(boss.x, boss.y, boss.angle + offset, true, false, 10, BOSS_ATTACK.projectileSpeed);
        } else {
          this.impact(boss.targetX, boss.targetY, 0xffcc80, 110);
          if (Math.hypot(this.player.x - boss.targetX, this.player.y - boss.targetY) < BOSS_ATTACK.slamRadius) {
            this.hurt(28, Math.atan2(this.player.y - boss.y, this.player.x - boss.x));
          }
        }
        boss.action = (boss.action + 1) % 3;
        boss.cooldown = boss.enraged ? BOSS_ATTACK.enragedCooldown : BOSS_ATTACK.cooldown;
        boss.recovery = boss.enraged ? BOSS_ATTACK.enragedRecovery : BOSS_ATTACK.recovery;
        if (boss.enraged && boss.attackAction === 2) {
          boss.followup = true;
          boss.recovery = BOSS_PHASE.followupGap;
        } else if (boss.comboFinish) {
          boss.comboFinish = false;
          this.ascension.echo();
          boss.cooldown = boss.recovery = BOSS_PHASE.comboRecovery;
        }
        boss.active = 0.22;
      }
      return;
    }
    boss.cooldown = Math.max(0, boss.cooldown - dt);
    const dx = this.player.x - boss.x, dy = this.player.y - boss.y;
    boss.angle = Math.atan2(dy, dx);
    if (boss.cooldown === 0) {
      boss.windup = boss.windupDuration = boss.enraged ? BOSS_ATTACK.enragedWindup : BOSS_ATTACK.windup;
      boss.attackAction = boss.action === 0 && Math.hypot(dx, dy) > BOSS_ATTACK.range ? 2 : boss.action;
      this.lockLeap(boss, 80, BOSS_ATTACK.maxLeap);
    } else if (Math.hypot(dx, dy) > 155) {
      boss.x += Math.cos(boss.angle) * BOSS_ATTACK.chaseSpeed * (boss.enraged ? BOSS_PHASE.speedMultiplier : 1) * dt;
      boss.y += Math.sin(boss.angle) * BOSS_ATTACK.chaseSpeed * (boss.enraged ? BOSS_PHASE.speedMultiplier : 1) * dt;
      clampPosition(boss, 32);
    }
  }

  private fire(x: number, y: number, angle: number, hostile: boolean, charged = false, damage = 10, speedOverride?: number, anomaly = false): void {
    if (this.projectiles.length >= COMBAT.projectileLimit) return;
    if (!hostile) { this.stats.shots++; this.lastShot = { angle, charged }; this.cue(charged ? 'chargedGun' : 'gun'); }
    const speed = speedOverride ?? (hostile ? 310 : 850);
    const staticBonus = !hostile && charged && this.build.staticCharge > 0 && this.mutations.includes('staticRiposte') ? BUILD.staticDamage : 0;
    if (staticBonus) this.build.staticCharge = 0;
    const glassBoost = !hostile && this.hasCurse('glassSoul');
    if (!hostile) damage = (charged ? RANGED.chargedDamage : RANGED.basicDamage) * (glassBoost ? BUILD.glassMultiplier : 1);
    this.projectiles.push({ anomaly, glassBoost, root: hostile ? undefined : chainRoot(), staticBonus, x: x + Math.cos(angle) * 24, y: y + Math.sin(angle) * 24,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, hostile, charged, damage, life: hostile ? 3 : 1.3 });
  }

  private stepProjectiles(dt: number): void {
    if (this.anomaly.unsafe) this.projectiles = this.projectiles.filter(shot => !shot.anomaly);
    for (const shot of this.projectiles) {
      const x = shot.x, y = shot.y;
      shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt;
      if (shot.hostile) {
        if (segmentHitsCircle(x, y, shot.x, shot.y, this.player.x, this.player.y, PLAYER_RADIUS + 4)) {
          this.hurt(shot.damage ?? 10, Math.atan2(shot.vy, shot.vx)); shot.life = 0;
        }
      } else {
        // Lấy mục tiêu gần đầu segment nhất nếu nhiều collider chồng nhau.
        shot.root ??= chainRoot();
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
          this.detonate(target, shot.charged ? 2 : 1, !!shot.charged, undefined, shot.root);
          this.hitEnemy(target, (shot.damage ?? (shot.charged ? RANGED.chargedDamage : RANGED.basicDamage)) + (shot.staticBonus ?? 0), Math.atan2(shot.vy, shot.vx), 8, 0.08, !!shot.charged, shot.charged ? 'chargedHit' : 'shotHit', shot.root, true, shot.staticBonus ?? 0);
          if (shot.staticBonus && shot.root) {
            const bonus = shot.staticBonus * this.ascension.fractureBonus('staticRiposte', shot.root);
            if (bonus > 0) {
              const before = target.hp;
              this.hitEnemy(target, bonus, 0, 0, 0, true, 'legacy', shot.root, true, 0, { root: shot.root, depth: 1, origin: 'mutationSecondary' });
              if (target.hp < before) this.impact(target.x, target.y, ASCENSION_VFX.proc, ASCENSION_VFX.procSize, 'sealFracture', Math.atan2(shot.vy, shot.vx));
            }
          }
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

  private detonate(enemy: Enemy, multiplier: number, charged = false, source?: Explosion, root = source?.root ?? chainRoot()): boolean {
    if (enemy.rupture === 0 || root.seeded.has(enemy.id) || this.chainSeen.has(enemy.id) || this.pendingDetonations.has(enemy.id)) return false;
    if (source?.context && !admitProc(root, source.context.depth + 1)) return false;
    this.chainSeen.add(enemy.id);
    if (!source) {
      root.triggers++; this.draftSignals.markedTriggers++;
      if (root.hasRelay) this.draftSignals.relayTriggers++;
    }
    root.marked.add(enemy.id);
    const stacks = enemy.rupture;
    enemy.rupture = 0;
    this.pendingDetonations.add(enemy.id);
    const specialist = charged && this.mutations.includes('detonationSpecialist');
    this.explosions.push({ x: enemy.x, y: enemy.y, damage: stacks * CHAIN.damagePerStack * multiplier * (this.hasCurse('volatileSoul') ? BUILD.volatileMultiplier : 1) * (specialist ? BUILD.specialistMultiplier : 1), radius: (specialist ? CHAIN.specialistRadius : CHAIN.radius) * this.anomaly.radiusMultiplier, hostile: false, charged, root, volatileBoost: this.hasCurse('volatileSoul'),
      context: source?.context ? { root, depth: source.context.depth + 1, origin: 'ruptureDetonation' } : undefined, enemyId: enemy.id, delay: source ? CHAIN.relayDelay : 0, sourceX: source?.x, sourceY: source?.y });
    return true;
  }

  private resolveExplosions(): void {
    while (this.explosions.length > 0 && this.lastChain < COMBAT.chainLimit) {
      const ready = this.explosions.findIndex(item => (item.delay ?? 0) <= 1e-9);
      if (ready < 0) break;
      const [explosion] = this.explosions.splice(ready, 1);
      const root = explosion.root ??= chainRoot();
      if (root.legacy && !explosion.context) explosion.context = { root, depth: 1, origin: explosion.enemyId !== undefined ? 'ruptureDetonation' : explosion.hostile ? 'hostile' : 'curseSecondary' };
      const ruptureBlast = explosion.enemyId !== undefined;
      if (ruptureBlast) {
        this.pendingDetonations.delete(explosion.enemyId!);
        this.chainSeen.add(explosion.enemyId!);
        this.detonations++; root.detonations++;
        if (explosion.sourceX !== undefined && !root.hasRelay) {
          root.hasRelay = true; this.draftSignals.relayTriggers += root.triggers;
        }
        this.gainCharge(1);
        if (this.hasCurse('volatileSoul') && !root.hazard && this.build.hazardCooldown <= 1e-9 && this.build.hazards.length < BUILD.hazardCap) {
          root.hazard = true; this.build.hazardCooldown = BUILD.hazardCooldown;
          this.build.hazards.push({ x: explosion.x, y: explosion.y, time: BUILD.hazardDelay });
        }
      }
      this.cue(explosion.charged ? 'chargedBlast' : 'detonate');
      this.lastChain++;
      this.impact(explosion.x, explosion.y, explosion.echo ? 0xc399ff : explosion.hostile ? 0xffb36b : 0x6bf3d0, explosion.radius, explosion.charged ? 'chargedBlast' : explosion.echo ? 'echo' : explosion.sourceX !== undefined ? 'chainBlast' : undefined);
      const blast = this.impacts[this.impacts.length - 1];
      blast.sourceX = explosion.sourceX; blast.sourceY = explosion.sourceY;
      if (ruptureBlast && this.anomaly.active === 'volatileGround') blast.anomaly = 'volatileGround';
      const targets = this.enemies.filter(enemy => enemy.hp > 0).map(enemy => ({ enemy, distance: Math.hypot(enemy.x - explosion.x, enemy.y - explosion.y) })).filter(item => item.distance <= explosion.radius);
      if (ruptureBlast && root.detonations === BUILD.chamberCount && !root.pulsed && this.mutations.includes('echoChamber') && this.build.chamberCooldown <= 1e-9) {
        root.pulsed = true; this.build.chamberCooldown = BUILD.chamberCooldown;
        this.impact(explosion.x, explosion.y, 0xc399ff, BUILD.chamberRadius, 'slow');
        for (const enemy of this.enemies) if (enemy.hp > 0 && enemy.kind !== 'boss' && Math.hypot(enemy.x - explosion.x, enemy.y - explosion.y) <= BUILD.chamberRadius) enemy.slow = BUILD.chamberDuration;
      }
      if (ruptureBlast) for (const enemy of this.anomaly.relay(root, explosion.x, explosion.y, explosion.radius)) {
        if (this.detonate(enemy, 1, false, explosion)) {
          this.anomaly.retaliate(enemy);
          this.impact(enemy.x, enemy.y, 0xc399ff, 24, 'anomalyRelay');
          const cue = this.impacts[this.impacts.length - 1]; cue.sourceX = explosion.x; cue.sourceY = explosion.y;
        }
      }
      let actualBlastDamage = 0;
      for (const { enemy } of targets) {
        this.detonate(enemy, 1, false, explosion);
        const hpBefore = enemy.hp;
        this.hitEnemy(enemy, explosion.damage, Math.atan2(enemy.y - explosion.y, enemy.x - explosion.x), 12, 0.2, true, 'blast', root, !explosion.hostile, 0, explosion.context);
        actualBlastDamage += hpBefore - enemy.hp;
        if (ruptureBlast && hpBefore > enemy.hp) this.draftSignals.chainTargets++;
        if (enemy.hp > 0 && explosion.charged && this.mutations.includes('detonationSpecialist')) enemy.fracture = BUILD.fractureDuration;
        if (enemy.hp > 0 && explosion.echo && enemy.kind !== 'boss') enemy.echoHaste = BUILD.hasteDuration;
      }
      if (ruptureBlast && actualBlastDamage > 0 && !root.healed && this.hasCurse('parasiticMark')) {
        root.healed = true;
        const healed = this.healPlayer('parasiticCooldown', BUILD.parasiticHeal, BUILD.parasiticCooldown);
        if (healed) { this.impact(explosion.x, explosion.y, 0x6bf3d0, 16, 'heal'); const cue = this.impacts[this.impacts.length - 1]; cue.sourceX = this.player.x; cue.sourceY = this.player.y; }
      }
      if (ruptureBlast && this.mutations.includes('catalyst')) {
        for (const { enemy } of targets.sort((a, b) => a.distance - b.distance || a.enemy.id - b.enemy.id)) {
          if (root.seeded.size >= BUILD.catalystSeeds) break;
          // A pending marked relay has already consumed its mark; it is not a new target.
          if (enemy.hp <= 0 || enemy.rupture > 0 || this.pendingDetonations.has(enemy.id) || this.chainSeen.has(enemy.id) || root.seeded.has(enemy.id)) continue;
          enemy.rupture = 1; root.seeded.add(enemy.id);
          this.impact(enemy.x, enemy.y, 0x6bf3d0, 12, 'seed');
          const seed = this.impacts[this.impacts.length - 1]; seed.sourceX = explosion.x; seed.sourceY = explosion.y;
        }
      }
      if (explosion.hostile && Math.hypot(this.player.x - explosion.x, this.player.y - explosion.y) <= explosion.radius) {
        this.hurt(explosion.playerDamage ?? 16, Math.atan2(this.player.y - explosion.y, this.player.x - explosion.x));
      }
    }
  }

  private impact(x: number, y: number, color: number, radius = 22, kind?: Impact['kind'], angle = 0): void {
    // Keep the primary Charged blast readable when a chain fills the existing VFX budget.
    if (this.impacts.length >= 24) this.impacts.splice(Math.max(0, this.impacts.findIndex(item => item.kind !== 'chargedBlast')), 1);
    const duration = kind === 'sealHunterEnd' ? ASCENSION_VFX.hunterEndDuration : kind === 'sealFracture' ? ASCENSION_VFX.procDuration : kind === 'sealPulse' || kind === 'sealEcho' ? ASCENSION_VFX.impactDuration : kind === 'anomalyFinisher' || kind === 'anomalyCounter' || kind === 'anomalyRelay' ? ANOMALY_VFX.feedbackDuration : kind === 'anomalySeal' ? ANOMALY_VFX.sealDuration : kind === 'guardBreak' ? 0.35 : kind === 'chainBlast' ? 0.24 : kind === 'chargedBlast' ? 0.36 : kind === 'chargedHit' ? 0.24 : kind === 'heavy' ? 0.26 : 0.18;
    this.impacts.push({ x, y, color, radius, kind, angle, duration, life: duration });
  }
}
