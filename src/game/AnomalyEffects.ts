import { ANOMALY } from './config/anomalies.js';
import type { AnomalyId } from './config/legacy.js';
import type { CombatWorld, Enemy } from './combat.js';
import { chainRoot, legacyRoot, type ChainRoot, type ProcContext } from './BuildEffects.js';

export interface AnomalyZone { x: number; y: number; time: number; duration: number; radius: number; storm: boolean; source?: number }
/** Small run-local clocks. All damage uses CombatWorld's death/proc ledger. */
export class AnomalyEffects {
  active: AnomalyId | null = null;
  suspended = false;
  zones: AnomalyZone[] = [];
  clock = 0;
  finisherCooldown = 0;
  counterCooldown = 0;
  volleyCooldown = 0;
  relayCooldown = 0;
  readonly resistance = new Map<number, number>();
  constructor(private world: CombatWorld, private damage: (enemy: Enemy, damage: number, context: ProcContext) => void,
    private hurt: (damage: number, x: number, y: number) => void, private charge: (points: number) => void, private flash: (zone: AnomalyZone) => void) {}
  toJSON(): object {
    return { active: this.active, suspended: this.suspended, zones: this.zones, clock: this.clock,
      finisherCooldown: this.finisherCooldown, counterCooldown: this.counterCooldown, volleyCooldown: this.volleyCooldown,
      relayCooldown: this.relayCooldown, resistance: [...this.resistance] };
  }
  reset(): void {
    this.active = null; this.suspended = false; this.zones = []; this.clock = 0;
    this.finisherCooldown = this.counterCooldown = this.volleyCooldown = this.relayCooldown = 0; this.resistance.clear();
  }
  equip(id: AnomalyId): boolean {
    if (this.active) return false;
    this.active = id;
    this.clock = id === 'fracturedStorm' ? ANOMALY.storm.interval : ANOMALY.ground.interval;
    return true;
  }
  get unsafe(): boolean {
    return this.suspended || this.world.bossTransforming || this.world.enemies.some(e => e.hp > 0 && e.kind === 'boss' &&
      (e.windup > 0 || e.active > 0 || e.followup || e.comboFinish));
  }
  step(dt: number): void {
    if (!this.active) return;
    for (const key of ['finisherCooldown', 'counterCooldown', 'volleyCooldown', 'relayCooldown'] as const) this[key] = Math.max(0, this[key] - dt);
    for (const [id, time] of this.resistance) {
      if (time <= dt || !this.world.enemies.some(e => e.id === id && e.hp > 0)) this.resistance.delete(id);
      else this.resistance.set(id, time - dt);
    }
    // Cancel instead of banking danger during Boss combos/arrival. A fresh zone always gets full warning.
    if (this.unsafe) { this.zones = []; this.clock = Math.max(this.clock, 1); return; }
    const due = this.zones.filter(z => (z.time -= dt) <= 1e-9);
    this.zones = this.zones.filter(z => z.time > 1e-9);
    for (const zone of due) {
      if (zone.source !== undefined && !this.world.enemies.some(e => e.id === zone.source && e.hp > 0)) continue;
      this.flash(zone);
      if (zone.storm) {
        const root = chainRoot(); legacyRoot(root);
        for (const enemy of this.world.enemies) if (enemy.hp > 0 && Math.hypot(enemy.x - zone.x, enemy.y - zone.y) <= zone.radius)
          this.damage(enemy, ANOMALY.storm.enemyDamage, { root, depth: 1, origin: 'anomalySecondary' });
      }
      if (Math.hypot(this.world.player.x - zone.x, this.world.player.y - zone.y) <= zone.radius)
        this.hurt(zone.storm ? ANOMALY.storm.playerDamage : zone.source !== undefined ? ANOMALY.echo.damage : ANOMALY.ground.damage, zone.x, zone.y);
    }
    if (this.active !== 'fracturedStorm' && this.active !== 'volatileGround') return;
    this.clock -= dt;
    if (this.clock > 1e-9) return;
    const storm = this.active === 'fracturedStorm', spec = storm ? ANOMALY.storm : ANOMALY.ground;
    this.clock = spec.interval;
    // Locked on player; lure enemies into storm, then walk/dash out. Never tracks after warning.
    this.addZone(this.world.player.x, this.world.player.y, spec.telegraph, spec.radius, storm);
  }
  private addZone(x: number, y: number, duration: number, radius: number, storm: boolean, source?: number): void {
    if (this.unsafe || this.zones.length >= ANOMALY.zoneCap) return;
    this.zones.push({ x, y, duration, time: duration, radius, storm, source });
  }
  finisher(): void {
    if (this.active !== 'bloodMoon' || this.finisherCooldown > 1e-9) return;
    this.finisherCooldown = ANOMALY.blood.cooldown; this.charge(ANOMALY.blood.charge);
  }
  perfect(): void {
    if (this.active !== 'staticField' || this.counterCooldown > 1e-9) return;
    this.counterCooldown = ANOMALY.static.cooldown;
    const root = chainRoot(); legacyRoot(root);
    const targets = this.world.enemies.filter(e => e.hp > 0 && Math.hypot(e.x - this.world.player.x, e.y - this.world.player.y) <= ANOMALY.static.radius)
      .sort((a, b) => Math.hypot(a.x - this.world.player.x, a.y - this.world.player.y) - Math.hypot(b.x - this.world.player.x, b.y - this.world.player.y) || a.id - b.id).slice(0, ANOMALY.static.targets);
    for (const enemy of targets) this.damage(enemy, ANOMALY.static.damage, { root, depth: 1, origin: 'anomalySecondary' });
  }
  extraVolley(): boolean {
    if (this.active !== 'staticField' || this.unsafe || this.volleyCooldown > 1e-9) return false;
    this.volleyCooldown = ANOMALY.static.volleyCooldown; return true;
  }
  get pursuit(): number { return this.active === 'bloodMoon' ? ANOMALY.blood.pursuit : 1; }
  get radiusMultiplier(): number { return this.active === 'volatileGround' ? ANOMALY.ground.detonateRadius : 1; }
  resists(enemy: Enemy): boolean { return this.active === 'brokenSeal' && this.resistance.has(enemy.id); }
  heavy(enemy: Enemy): boolean {
    if (this.active !== 'brokenSeal' || enemy.kind === 'boss' || enemy.kind === 'bulwark' || this.resists(enemy)) return false;
    this.resistance.set(enemy.id, Math.max(enemy.stagger, 0) + ANOMALY.seal.stagger + ANOMALY.seal.resistance);
    return true;
  }
  relay(root: ChainRoot, x: number, y: number, radius: number): Enemy[] {
    if (this.active !== 'echoChamber' || root.anomalyRelay || this.relayCooldown > 1e-9) return [];
    const targets = this.world.enemies.filter(e => e.hp > 0 && e.rupture > 0 && !root.marked.has(e.id) && !root.seeded.has(e.id) &&
      Math.hypot(e.x - x, e.y - y) > radius && Math.hypot(e.x - x, e.y - y) <= radius + ANOMALY.echo.range)
      .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y) || a.id - b.id).slice(0, ANOMALY.echo.extraTargets);
    if (targets.length) { root.anomalyRelay = true; this.relayCooldown = ANOMALY.echo.cooldown; }
    return targets;
  }
  retaliate(enemy: Enemy): void {
    if (enemy.hp <= 0 || enemy.kind === 'boss') return;
    this.addZone(this.world.player.x, this.world.player.y, ANOMALY.echo.telegraph, ANOMALY.echo.radius, false, enemy.id);
  }
}
