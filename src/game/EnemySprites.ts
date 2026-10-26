import type Phaser from 'phaser';
import type { CombatWorld, Enemy } from './combat';
import { BOSS_ATTACK, BOSS_PHASE, GRUNT_LEAP } from './config/balance';
import { ACTOR_TEXTURE, actorFrame } from './ActorArt';
import { enemyArtPose } from './ActorPose';

type Body = { image: Phaser.GameObjects.Image; enemy: Enemy; x: number; y: number; stride: number; moving: boolean };

/** Body art only. Core ownership, ground cues, marks, bars and effects stay separate. */
export class EnemySprites {
  private readonly bodies = new Map<number, Body>();
  private readonly free: Phaser.GameObjects.Image[] = [];
  private readonly deaths: { image: Phaser.GameObjects.Image; life: number }[];
  private clock = 0;
  private nextDeath = 0;

  constructor(private readonly scene: Phaser.Scene) {
    this.deaths = Array.from({ length: 8 }, () => ({ image: this.image().setDepth(1.15), life: 0 }));
  }

  private image(): Phaser.GameObjects.Image {
    return this.scene.add.image(0, 0, ACTOR_TEXTURE, 'grunt/south/idle').setVisible(false);
  }

  reset(): void {
    for (const body of this.bodies.values()) this.free.push(body.image.setVisible(false));
    this.bodies.clear();
    for (const death of this.deaths) { death.life = 0; death.image.setVisible(false); }
    this.clock = this.nextDeath = 0;
  }

  /** Simulation time only: pause, draft and hitstop cannot advance animation/death. */
  step(dt: number): void {
    this.clock += dt;
    for (const body of this.bodies.values()) {
      const distance = Math.hypot(body.enemy.x - body.x, body.enemy.y - body.y);
      body.moving = distance > 0.1;
      body.stride += distance * 0.14;
      body.x = body.enemy.x; body.y = body.enemy.y;
    }
    this.stepDeaths(dt);
  }

  /** Only cosmetic remnants may finish after the run has stopped. */
  stepDeaths(dt: number): void {
    for (const death of this.deaths) {
      death.life = Math.max(0, death.life - dt);
      death.image.setVisible(death.life > 0).setAlpha(death.life / 0.28);
    }
  }

  render(world: CombatWorld): void {
    // Retain the previous core object only to distinguish actual death from Boss cleanup.
    for (const [id, body] of this.bodies) {
      if (world.enemies.includes(body.enemy)) continue;
      if (body.enemy.hp <= 0) {
        const death = this.deaths[this.nextDeath++ % this.deaths.length];
        death.life = 0.28;
        death.image.setFrame(actorFrame(body.enemy.kind, body.enemy.angle, 'death'))
          .setPosition(body.enemy.x, body.enemy.y).setScale(1).clearTint().setAlpha(1).setVisible(true);
      }
      this.free.push(body.image.setVisible(false));
      this.bodies.delete(id);
    }
    for (const enemy of world.enemies) {
      let body = this.bodies.get(enemy.id);
      if (!body) {
        body = { image: this.free.pop() ?? this.image(), enemy, x: enemy.x, y: enemy.y, stride: 0, moving: false };
        this.bodies.set(enemy.id, body);
      }
      const pose = enemyArtPose(enemy, body.moving);
      const phase = pose === 'move' && Math.sin(body.stride) < 0 ? 'idle' : pose;
      const pattern = enemy.kind === 'boss' && ['windup', 'attack', 'recovery'].includes(pose)
        ? `${['sweep', 'ring', 'slam'][enemy.attackAction] ?? 'sweep'}-${pose}` : phase;
      const progress = enemy.windup > 0 ? 1 - enemy.windup / (enemy.windupDuration || 0.7) : 0;
      const flight = enemy.kind === 'grunt' && enemy.attackAction === 3 ? GRUNT_LEAP.flight
        : enemy.kind === 'boss' && enemy.attackAction === 2 ? BOSS_ATTACK.leapFlight : 0;
      const height = flight && enemy.windup > 0 && enemy.windup < flight
        ? Math.sin(Math.PI * (1 - enemy.windup / flight)) * (enemy.kind === 'boss' ? 46 : 28) : 0;
      const moving = pose === 'move';
      const bob = moving ? -Math.abs(Math.sin(body.stride)) * 1.5
        : pose === 'idle' ? Math.sin(this.clock * 3.5 + enemy.id) * 0.45 : 0;
      const lean = pose === 'windup' ? -progress * 2 : 0;
      const transformPulse = enemy.transform > 0 ? Math.sin(Math.PI * (1 - enemy.transform / BOSS_PHASE.transform)) : 0;
      body.image.setTexture(enemy.transform > 0 ? 'enraged-transform' : ACTOR_TEXTURE,
        enemy.transform > 0 ? undefined : actorFrame(enemy.kind, enemy.angle, pattern))
        .setPosition(enemy.x + Math.cos(enemy.angle) * lean, enemy.y - height + bob + Math.sin(enemy.angle) * lean - transformPulse * 6)
        .setScale(1 + transformPulse * 0.14, pose === 'windup' ? 1 - progress * 0.035 : 1 + transformPulse * 0.08)
        .setDepth(1.2 + enemy.y / 100000).setVisible(true).setAlpha(1);
      if (enemy.flash > 0) body.image.setTintFill(0xffffff); else if (enemy.enraged) body.image.setTint(0xffbb99); else body.image.clearTint();
    }
  }
}
