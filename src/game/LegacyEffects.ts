import { ARENA, PLAYER_RADIUS } from './movement.js';
import { LEGACY as L, validLegacy, type LegacyOffer } from './config/legacy.js';
import { admitProc, legacyRoot, type ChainRoot, type ProcContext } from './BuildEffects.js';
import type { Attack, CombatWorld, Enemy } from './combat.js';
import { HEAVY } from './config/balance.js';

export type PrimaryHit = 'light' | 'heavy' | 'basic' | 'charged';
interface Ignite { time: number; tick: number; root: ChainRoot; depth: number; generation: number }
interface TargetState {
  ignite?: Ignite; soaked: number; frost: number; frostTime: number; shatterCD: number;
  knockCD: number; brittle: number; interruptCD: number; cycloneCD: number;
}
interface Task { delay: number; context: ProcContext; run: (context: ProcContext) => void }
export interface LegacyProjectile { x: number; y: number; angle: number; speed: number; distance: number; life: number; range: number; damage: number; pierce: number; visited: Set<number>; context: ProcContext; kind: 'ice' | 'wind'; sourceId?: number }
type Damage = (target: Enemy, damage: number, context: ProcContext, bypass: boolean) => void;
const angleDelta = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const state = (): TargetState => ({ soaked: 0, frost: 0, frostTime: 0, shatterCD: 0, knockCD: 0, brittle: 0, interruptCD: 0, cycloneCD: 0 });

/** Run-local elemental rules. Combat owns damage/deaths; this class owns no progression. */
export class LegacyEffects {
  selection: Readonly<LegacyOffer> | null = null;
  readonly targets = new Map<number, TargetState>();
  projectiles: LegacyProjectile[] = [];
  private tasks: Task[] = [];
  private work: number = L.eventsPerTick;
  furnaceTarget: number | null = null;
  private soakTargets: Set<number> | null = null;
  private clocks = new Map<string, number>();
  charge = 0;
  mark: { id: number; time: number } | null = null;
  momentum = 0;
  private idle = 0;
  haste = 0;
  reposition = 0;
  ambushes = 0;
  nightfalls = 0;
  constructor(private readonly world: CombatWorld, private readonly damage: Damage) {}
  toJSON(): object {
    return { selection: this.selection, targets: [...this.targets], projectiles: this.projectiles,
      tasks: this.tasks.map(t => ({ delay: t.delay, root: t.context.root.id, depth: t.context.depth })), clocks: [...this.clocks],
      charge: this.charge, mark: this.mark, momentum: this.momentum, idle: this.idle, haste: this.haste, reposition: this.reposition };
  }
  reset(): void {
    this.work = L.eventsPerTick; this.selection = null; this.targets.clear(); this.tasks = []; this.furnaceTarget = null; this.soakTargets = null; this.projectiles = []; this.clocks.clear();
    this.charge = this.momentum = this.idle = this.haste = this.reposition = this.ambushes = this.nightfalls = 0; this.mark = null;
  }
  equip(offer: LegacyOffer | null): boolean {
    if (this.selection || !validLegacy(offer)) return false;
    this.selection = Object.freeze({ sigil: offer.sigil, branch: offer.branch }); return true;
  }
  private get branch() { return this.selection?.branch; }
  private ready(id: string) { return (this.clocks.get(id) ?? 0) <= 1e-9; }
  private cd(id: string, duration: number) { this.clocks.set(id, duration); }
  private target(e: Enemy): TargetState {
    let value = this.targets.get(e.id); if (!value) { value = state(); this.targets.set(e.id, value); } return value;
  }
  private near(x: number, y: number, range: number, exclude = new Set<number>()): Enemy[] {
    return this.world.enemies.filter(e => e.hp > 0 && !exclude.has(e.id) && Math.hypot(e.x - x, e.y - y) <= range)
      .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y) || a.id - b.id);
  }
  private enqueue(root: ChainRoot, depth: number, delay: number, run: Task['run']): boolean {
    legacyRoot(root);
    if (this.tasks.length >= L.queueCap || !admitProc(root, depth + 1)) return false;
    this.tasks.push({ delay, context: { root, depth: depth + 1, origin: 'legacySecondary' }, run }); return true;
  }
  private hit(e: Enemy, damage: number, context: ProcContext, bypass = false): void {
    if (e.hp > 0 && this.work > 0 && admitProc(context.root, context.depth)) {
      this.work--; this.damage(e, damage, context, bypass);
    }
  }
  get attackSpeed(): number {
    const bonus = this.haste > 0 ? this.selection?.sigil === 'wind' ? L.wind.haste : L.lightning.haste : 0;
    return 1 + Math.min(L.attackSpeedCap, bonus);
  }
  get movementSpeed(): number { return this.reposition > 0 ? Math.min(L.speedCap, L.shadow.speed) : 1; }
  armorBroken(e: Enemy): boolean { return e.kind !== 'boss' && (this.targets.get(e.id)?.brittle ?? 0) > 0; }
  slowMultiplier(e: Enemy): number { return e.kind !== 'boss' && (this.targets.get(e.id)?.soaked ?? 0) > 0 ? L.water.slow : 1; }

  step(dt: number): void {
    if (!this.selection) return;
    this.work = L.eventsPerTick;
    for (const [id, time] of this.clocks) this.clocks.set(id, Math.max(0, time - dt));
    this.charge = Math.max(0, this.charge - dt); this.haste = Math.max(0, this.haste - dt); this.reposition = Math.max(0, this.reposition - dt);
    if (this.mark && (this.mark.time -= dt) <= 0) this.mark = null;
    for (const [id, t] of this.targets) {
      const e = this.world.enemies.find(e => e.id === id && e.hp > 0);
      if (!e) { this.targets.delete(id); continue; }
      for (const key of ['soaked', 'frostTime', 'shatterCD', 'knockCD', 'brittle', 'interruptCD', 'cycloneCD'] as const) t[key] = Math.max(0, t[key] - dt);
      if (t.frostTime <= 1e-9) t.frost = 0;
      const ignite = t.ignite;
      if (ignite && ignite.time <= 1e-9) { t.ignite = undefined; continue; }
      if (ignite) {
        ignite.tick -= dt; ignite.time -= dt;
        if (ignite.tick <= 1e-9) {
          ignite.tick += L.fire.interval;
          const damage = ignite.generation ? L.fire.spreadDamage : L.fire.damage;
          this.enqueue(ignite.root, ignite.depth, 0, context => this.hit(e, damage, context));
        }
      }
    }
    for (const task of this.tasks) task.delay -= dt;
    this.stepProjectiles(dt);
  }
  resolve(): void {
    if (this.world.hp <= 0 || this.world.bossTransforming) return;
    const due = this.tasks.filter(t => t.delay <= 1e-9);
    this.tasks = this.tasks.filter(t => t.delay > 1e-9);
    for (const task of due.slice(0, L.eventsPerTick)) {
      if (this.world.bossTransforming) { this.tasks.push(task); continue; }
      task.run(task.context);
    }
  }
  move(distance: number, dt: number): void {
    if (this.selection?.sigil !== 'wind') return;
    if (distance > 1e-6 && this.near(this.world.player.x, this.world.player.y, L.wind.proximity).length) {
      this.momentum = Math.min(L.wind.cap, this.momentum + distance / L.wind.distance); this.idle = 0;
    } else {
      this.idle += dt;
      if (this.idle > L.wind.grace) this.momentum = Math.max(0, this.momentum - L.wind.decay * dt);
    }
  }
  prepareAttack(attack: Attack): void {
    this.furnaceTarget = null;
    this.soakTargets = null;
    if (!attack.heavy || !this.selection) return;
    const p = this.world.player;
    const targets = this.near(p.x, p.y, attack.range + 30).filter(e => Math.hypot(e.x - p.x, e.y - p.y) <= attack.range + (e.kind === 'boss' ? 30 : 14) &&
      Math.abs(angleDelta(Math.atan2(e.y - p.y, e.x - p.x), attack.angle)) <= attack.arc / 2);
    if (this.selection?.sigil === 'water') this.soakTargets = new Set(targets.slice(0, L.targetCap).map(e => e.id));
    if (this.branch === 'furnace') this.furnaceTarget = targets.find(e => this.targets.get(e.id)?.ignite)?.id ?? null;
  }
  light(root: ChainRoot, angle: number): void {
    if (this.selection?.sigil !== 'wind' || this.momentum < L.wind.threshold || !this.ready('slash')) return;
    this.momentum = 0; this.cd('slash', L.wind.cooldown);
    if (this.branch === 'tailwind') this.haste = L.wind.hasteDuration;
    this.projectile('wind', this.world.player.x, this.world.player.y, angle, root, 0);
  }
  perfect(): void {
    const sigil = this.selection?.sigil;
    if (sigil === 'water' && this.branch === 'flowState' && this.ready('flow') && this.world.heavyCharges < HEAVY.charges) {
      this.cd('flow', L.water.flowCooldown);
      this.world.heavyRecharge += L.water.refund;
      if (this.world.heavyRecharge >= HEAVY.recharge) { this.world.heavyCharges++; this.world.heavyRecharge = 0; }
    }
    if (sigil === 'lightning' && this.ready('charge')) { this.charge = L.lightning.chargeDuration; this.cd('charge', L.lightning.grantCooldown); }
    if (sigil === 'shadow') {
      if (this.ready('mark')) {
        const p = this.world.player;
        const enemy = this.near(p.x, p.y, L.shadow.range).find(e => Math.abs(angleDelta(Math.atan2(e.y - p.y, e.x - p.x), p.angle)) <= L.shadow.cone / 2);
        if (enemy) { this.mark = { id: enemy.id, time: L.shadow.markDuration }; this.cd('mark', L.shadow.grantCooldown); }
      }
      if (this.branch === 'veilstep' && this.ready('veil')) { this.reposition = L.shadow.speedDuration; this.cd('veil', L.shadow.speedCooldown); }
    }
  }
  /** Called after primary accounting, using elemental state that has not yet been mutated by this hit. */
  primary(e: Enemy, kind: PrimaryHit, root: ChainRoot, snapshot = { x: e.x, y: e.y, windup: e.windup }): void {
    const sigil = this.selection?.sigil; if (!sigil) return;
    if (root.primaryHits?.has(e.id)) return;
    root.primaryHits ??= new Set(); root.primaryHits.add(e.id);
    const t = this.target(e); legacyRoot(root);
    if (sigil === 'fire') {
      if (kind === 'heavy' && (this.furnaceTarget === null || this.furnaceTarget === e.id) && t.ignite && this.branch === 'furnace' && !root.furnace && this.ready('furnace')) {
        const { x, y } = snapshot;
        if (this.enqueue(root, 0, 0, ctx => { for (const target of this.near(x, y, L.fire.furnaceRadius).slice(0, L.targetCap)) this.hit(target, L.fire.furnaceDamage, ctx); })) {
          t.ignite = undefined; root.furnace = true; this.cd('furnace', L.fire.furnaceCooldown);
        }
      }
      if (kind === 'charged' && e.hp > 0) this.ignite(e, root, 0, 0);
    }
    if (sigil === 'water') {
      if (t.soaked > 0 && this.branch === 'undertow' && t.knockCD <= 1e-9) { t.knockCD = L.water.knockCooldown; this.push(e, L.water.force); }
      if (kind === 'heavy' && e.hp > 0 && (!this.soakTargets || this.soakTargets.has(e.id))) t.soaked = L.water.duration;
    }
    if (sigil === 'lightning' && kind === 'basic' && this.charge > 0 && this.ready('discharge')) {
      this.charge = 0; this.cd('discharge', L.lightning.dischargeCooldown);
      if (this.branch === 'overclock') this.haste = L.lightning.hasteDuration;
      const visited = new Set<number>([e.id]);
      const relay = (x: number, y: number, jumps: number, depth: number) => {
        if (!jumps) return;
        const next = this.near(x, y, L.lightning.range, visited)[0]; if (!next) return;
        visited.add(next.id);
        this.enqueue(root, depth, L.lightning.delay, ctx => { this.hit(next, L.lightning.damage, ctx); relay(next.x, next.y, jumps - 1, ctx.depth); });
      };
      this.enqueue(root, 0, 0, ctx => { this.hit(e, L.lightning.damage, ctx); relay(e.x, e.y, L.lightning.jumps + (this.branch === 'arcRelay' ? 1 : 0), ctx.depth); });
    }
    if (sigil === 'ice') {
      if ((kind === 'heavy' || kind === 'charged') && t.frost >= L.ice.threshold && t.frostTime > 0 && t.shatterCD <= 1e-9) {
        t.frost = t.frostTime = 0; t.shatterCD = L.ice.shatterCooldown;
        this.enqueue(root, 0, 0, ctx => this.hit(e, L.ice.damage, ctx, this.branch === 'brittle' && e.kind !== 'boss'));
        if (e.hp > 0 && this.branch === 'brittle' && e.kind !== 'boss') {
          t.brittle = L.ice.breakDuration;
          if (t.interruptCD <= 1e-9 && snapshot.windup > 0) { e.windup = 0; e.cooldown = Math.max(e.cooldown, 0.45); t.interruptCD = Math.max(L.ice.interruptCooldown, e.kind === 'bulwark' ? L.eliteImmunity : 0); }
        }
        if (this.branch === 'crystalEcho' && this.ready('crystal')) {
          if (this.enqueue(root, 0, L.ice.echoDelay, ctx => {
            const next = this.near(snapshot.x, snapshot.y, L.ice.echoRange, new Set([e.id]))[0];
            if (next) this.projectile('ice', snapshot.x, snapshot.y, Math.atan2(next.y - snapshot.y, next.x - snapshot.x), root, ctx.depth, e.id);
          })) this.cd('crystal', L.ice.echoCooldown);
        }
      } else if (e.hp > 0) { t.frost = Math.min(L.ice.threshold, t.frost + 1); t.frostTime = L.ice.window; }
    }
    if (sigil === 'shadow' && (kind === 'light' || kind === 'heavy') && this.mark?.id === e.id && this.ready('ambush')) {
      this.mark = null; this.ambushes++; this.cd('ambush', L.shadow.ambushCooldown);
      this.enqueue(root, 0, 0, ctx => this.hit(e, L.shadow.damage, ctx));
      if (this.branch === 'nightfall' && this.ready('nightfall')) {
        if (this.enqueue(root, 0, L.shadow.nightDelay, ctx => {
          if (e.hp > 0 && Math.hypot(e.x - this.world.player.x, e.y - this.world.player.y) <= L.shadow.nightRange) this.hit(e, L.shadow.nightDamage, ctx);
        })) { this.nightfalls++; this.cd('nightfall', L.shadow.nightCooldown); }
      }
    }
  }
  private ignite(e: Enemy, root: ChainRoot, depth: number, generation: number): void {
    const t = this.target(e), tick = t.ignite?.tick ?? L.fire.interval;
    t.ignite = { time: generation ? L.fire.spreadDuration : L.fire.duration, tick, root, depth, generation };
  }
  killed(e: Enemy, context: ProcContext): void {
    if (this.branch !== 'wildfire' || !this.ready('wildfire') || this.targets.get(e.id)?.ignite?.generation !== 0) return;
    const targets = this.near(e.x, e.y, L.fire.spreadRadius).slice(0, L.fire.spreadTargets);
    if (targets.length && this.enqueue(context.root, context.depth, 0, ctx => {
      for (const next of targets) if (next.hp > 0) this.ignite(next, ctx.root, ctx.depth, 1);
    })) this.cd('wildfire', L.fire.spreadCooldown);
  }
  private push(e: Enemy, force: number): void {
    if (e.hp <= 0 || e.kind === 'boss') return;
    const angle = Math.atan2(e.y - this.world.player.y, e.x - this.world.player.x), scale = e.kind === 'bulwark' ? 0.4 : 1;
    const edge = ARENA.inset + PLAYER_RADIUS;
    e.x = Math.max(edge, Math.min(ARENA.width - edge, e.x + Math.cos(angle) * force * scale));
    e.y = Math.max(edge, Math.min(ARENA.height - edge, e.y + Math.sin(angle) * force * scale));
  }
  private projectile(kind: 'ice' | 'wind', x: number, y: number, angle: number, root: ChainRoot, depth: number, sourceId?: number): void {
    legacyRoot(root);
    if (this.projectiles.length >= L.projectileCap || !admitProc(root, depth + 1)) return;
    this.projectiles.push({ sourceId, kind, x, y, angle, speed: kind === 'ice' ? L.ice.echoSpeed : L.wind.speed, distance: 0,
      life: kind === 'ice' ? L.ice.echoLifetime : L.wind.lifetime, range: kind === 'ice' ? L.ice.echoRange : L.wind.range,
      damage: kind === 'ice' ? L.ice.echoDamage : L.wind.damage, pierce: kind === 'ice' ? 1 : L.wind.pierce,
      visited: new Set(), context: { root, depth: depth + 1, origin: 'legacySecondary' } });
  }
  private stepProjectiles(dt: number): void {
    for (const shot of this.projectiles) {
      const ax = shot.x, ay = shot.y, travel = Math.min(shot.speed * dt, shot.range - shot.distance);
      shot.x += Math.cos(shot.angle) * travel; shot.y += Math.sin(shot.angle) * travel; shot.distance += travel; shot.life -= dt;
      const dx = shot.x - ax, dy = shot.y - ay, length = dx * dx + dy * dy;
      const targets = this.world.enemies.filter(e => e.hp > 0 && e.id !== shot.sourceId && !shot.visited.has(e.id)).map(e => {
        const t = length ? Math.max(0, Math.min(1, ((e.x - ax) * dx + (e.y - ay) * dy) / length)) : 0;
        return { e, t, distance: Math.hypot(ax + dx * t - e.x, ay + dy * t - e.y) };
      }).filter(({ e, distance }) => distance <= (e.kind === 'boss' ? 34 : e.kind === 'bulwark' ? 24 : 18)).sort((a, b) => a.t - b.t || a.e.id - b.e.id);
      for (const { e } of targets) {
        if (shot.visited.size >= shot.pierce) break;
        shot.visited.add(e.id); const hpBefore = e.hp; this.hit(e, shot.damage, shot.context);
        if (e.hp > 0 && e.hp < hpBefore && shot.kind === 'wind' && this.branch === 'cyclone') {
          const t = this.target(e); if (t.cycloneCD <= 1e-9) { this.push(e, L.wind.force); t.cycloneCD = L.wind.knockCooldown; }
        }
      }
    }
    this.projectiles = this.projectiles.filter(s => s.life > 0 && s.distance < s.range && s.visited.size < s.pierce);
  }
}
