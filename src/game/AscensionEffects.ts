import { ARENA, PLAYER_SPEED } from './movement.js';
import { ASCENSION as A } from './config/ascension.js';
import type { CombatWorld, Enemy } from './combat.js';
import { admitProc, chainRoot, legacyRoot, type ChainRoot } from './BuildEffects.js';
export interface SealZone { kind: 'pulse' | 'echo'; x: number; y: number; time: number; active: number; hit: boolean; victims?: Set<number>; playerHit?: boolean }
/** Run-local clocks using the existing combat tick and root ledger. */
export class AscensionEffects {
  seal = 0;
  pulseClock: number = A.pulse.interval;
  echoCooldown = 0;
  zones: SealZone[] = [];
  hunterId: number | null = null;
  hunterWarning = 0;
  hunterTime = 0;
  hunterCooldown = 0;
  private group = '';
  private distances = new Map<number, number>();
  stable = 0;
  fractured: string | null = null;
  penalty = 0;
  constructor(private world: CombatWorld, private damage: (e: Enemy, amount: number, root: ChainRoot) => void,
    private hurt: (amount: number, enemy: boolean) => void) {}
  toJSON(): object {
    return { seal:this.seal, pulseClock:this.pulseClock, echoCooldown:this.echoCooldown, zones:this.zones.map(z=>({...z,victims:[...(z.victims??[])]})), hunterId:this.hunterId, hunterWarning:this.hunterWarning, hunterTime:this.hunterTime, hunterCooldown:this.hunterCooldown, stable:this.stable, group:this.group, distances:[...this.distances], fractured:this.fractured, penalty:this.penalty };
  }
  reset(): void {
    this.seal = 0; this.pulseClock = A.pulse.interval; this.echoCooldown = 0; this.zones = [];
    this.hunterId = null; this.hunterWarning = this.hunterTime = this.hunterCooldown = this.stable = this.penalty = 0;
    this.group = ''; this.distances.clear(); this.fractured = null;
  }
  fractureBonus(id: string, root: ChainRoot): number {
    if (this.fractured !== id || root.fractured) return 0;
    root.fractured = true; legacyRoot(root); return admitProc(root, 1) ? A.fracture.scale : 0;
  }
  echo(): void {
    if (this.seal < 4 || this.echoCooldown > 0 || this.world.anomaly.suspended || this.world.bossTransforming || this.zones.some(z => z.kind === 'echo')) return;
    this.zones.push({kind: 'echo', x: this.world.player.x, y: this.world.player.y, time: A.echo.warning, active: 0, hit: false});
    this.echoCooldown = A.echo.cooldown;
  }
  pursuit(e: Enemy): {x: number; y: number} {
    const lead = e.id === this.hunterId && this.hunterWarning <= 0 && this.hunterTime > 0 ? A.hunter.lead : 0;
    return {x: this.world.player.x + this.world.movementIntent.x *  PLAYER_SPEED * this.world.legacy.movementSpeed * lead,
      y: this.world.player.y + this.world.movementIntent.y * PLAYER_SPEED * this.world.legacy.movementSpeed * lead};
  }
  step(dt: number): void {
    if (this.seal === 0) return;
    this.penalty = Math.max(0, this.penalty - dt);
    this.echoCooldown = Math.max(0, this.echoCooldown - dt);
    this.hunterCooldown = Math.max(0, this.hunterCooldown - dt);
    // Boss warning/attacks cancel pending hazards; new warnings always receive their full duration.
    const echoUnsafe = this.world.anomaly.suspended || this.world.bossTransforming || this.world.enemies.some(e => e.kind === 'boss' && e.hp > 0 && e.windup > 0);
    this.zones = this.zones.filter(z => z.kind === 'pulse' ? !this.world.anomaly.unsafe : !echoUnsafe);
    {
      for (const z of this.zones) {
        if (z.time > 0) z.time = Math.max(0, z.time - dt);
        else z.active -= dt;
        if (z.time <= 1e-9 && (!z.hit || z.active > 0)) {
          const spec = z.kind === 'pulse' ? A.pulse : A.echo;
          if (!z.hit) z.active = z.kind === 'pulse' ? A.pulse.active : dt;
          z.hit = true;
          if (z.kind === 'pulse') {
            const root = chainRoot(); legacyRoot(root); z.victims ??= new Set();
            for (const e of this.world.enemies) if (e.hp > 0 && !z.victims.has(e.id) && Math.hypot(e.x-z.x,e.y-z.y) <= spec.radius) {
              z.victims.add(e.id); this.damage(e,A.pulse.enemyDamage,root);
            }
          }
          if (!z.playerHit && Math.hypot(this.world.player.x-z.x,this.world.player.y-z.y) <= spec.radius) {
            z.playerHit=true; this.hurt(z.kind === 'pulse' ? A.pulse.playerDamage : A.echo.damage,z.kind === 'echo');
          }
        }
      }
      this.zones = this.zones.filter(z => !z.hit || z.active > 0);
      if (this.world.anomaly.active && !this.world.anomaly.unsafe) {
        this.pulseClock -= dt;
        if (this.pulseClock <= 1e-9 && !this.zones.some(z => z.kind === 'pulse')) {
          this.pulseClock = A.pulse.interval;
          const p = this.world.player;
          // Offset inward at arena edges; never covers the current player position.
          const x = p.x + (p.x > ARENA.width / 2 ? -1 : 1) * A.pulse.offset;
          this.zones.push({kind:'pulse', x, y:p.y, time:A.pulse.warning, active:0, hit:false});
        }
      }
    }
    if (this.seal < 2) return;
    if (this.hunterId !== null) {
      if (this.hunterWarning > 0) this.hunterWarning = Math.max(0,this.hunterWarning-dt);
      else this.hunterTime = Math.max(0,this.hunterTime-dt);
      if (this.hunterTime === 0 || !this.world.enemies.some(e=>e.id===this.hunterId && e.hp>0)) { this.hunterId=null; this.group=''; this.stable=0; }
      return;
    }
    const moving = Math.hypot(this.world.movementIntent.x,this.world.movementIntent.y) > A.hunter.minMotion && this.world.dashTime <= 0;
    const group = this.world.enemies.filter(e=>e.kind==='grunt' && e.hp>0 && Math.hypot(e.x-this.world.player.x,e.y-this.world.player.y)<A.hunter.groupRadius);
    const key = group.map(e=>e.id).sort((a,b)=>a-b).join(',');
    if (!moving || !key || key!==this.group || group.some(e=>Math.abs(Math.hypot(e.x-this.world.player.x,e.y-this.world.player.y)-(this.distances.get(e.id) ?? Infinity))>A.hunter.tolerance)) {
      this.stable=0; this.group=key; this.distances=new Map(group.map(e=>[e.id,Math.hypot(e.x-this.world.player.x,e.y-this.world.player.y)]));
    } else this.stable+=dt;
    const candidate=group.find(e=>e.windup===0 && e.active===0 && e.stagger===0);
    if (this.stable+1e-9>=A.hunter.threshold && this.hunterCooldown===0 && candidate) {
      this.hunterId=candidate.id; this.hunterWarning=A.hunter.warning; this.hunterTime=A.hunter.duration;
      this.hunterCooldown=A.hunter.cooldown; this.stable=0;
    }
  }
}
