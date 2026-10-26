import Phaser from 'phaser';
import { type Attack, type CombatWorld } from './combat';
import { ACTOR_TEXTURE, actorFrame, preloadActorArt } from './ActorArt';
import { attackArtPose } from './ActorPose';

const MINT = 0x8affe0;
const AMBER = 0xffcc80;
const GHOST_LIFE = 0.22;
const sweepDuration = (attack: Attack) => attack.heavy ? 0.16 : [0, 0.065, 0.085, 0.14][attack.combo];
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1);

/** State-driven sprite animation. The simulation and accepted slash/muzzle effects stay independent. */
export class PlayerVisual {
  readonly body: Phaser.GameObjects.Container;
  private readonly sprite: Phaser.GameObjects.Image;
  private readonly slash: Phaser.GameObjects.Graphics;
  private readonly muzzle: Phaser.GameObjects.Graphics;
  private readonly ghosts: { image: Phaser.GameObjects.Image; life: number }[];
  private clock = 0;
  private stride = 0;
  private moving = false;
  private lastX = 0;
  private lastY = 0;
  private shots = 0;
  private recoil = 0;
  private charged = false;
  private shotAngle = 0;
  private ghostClock = 0;
  private nextGhost = 0;
  private wasDashing = false;
  private dashExit = 0;

  static preload(scene: Phaser.Scene): void { preloadActorArt(scene); }

  constructor(scene: Phaser.Scene, world: CombatWorld) {
    this.body = scene.add.container(world.player.x, world.player.y).setDepth(2);
    const shadow = scene.add.graphics().fillStyle(0x000000, 0.4).fillEllipse(0, 12, 29, 11);
    this.sprite = scene.add.image(0, 0, ACTOR_TEXTURE, 'player/south/idle');
    this.body.add([shadow, this.sprite]);
    this.ghosts = Array.from({ length: 6 }, () => ({
      image: scene.add.image(0, 0, ACTOR_TEXTURE, 'player/south/idle').setTintFill(MINT).setDepth(1.7).setVisible(false), life: 0,
    }));
    this.slash = scene.add.graphics().setDepth(1.8);
    this.muzzle = scene.add.graphics().setDepth(2.2);
    this.reset(world);
  }

  reset(world: CombatWorld): void {
    this.clock = this.stride = this.recoil = this.ghostClock = this.nextGhost = 0;
    this.moving = this.wasDashing = false;
    this.dashExit = 0;
    this.lastX = world.player.x; this.lastY = world.player.y;
    this.shots = world.stats.shots;
    for (const ghost of this.ghosts) { ghost.life = 0; ghost.image.setVisible(false); }
    this.render(world, 'mint');
  }

  step(world: CombatWorld, dt: number): void {
    this.clock += dt;
    this.dashExit = Math.max(0, this.dashExit - dt);
    if (this.wasDashing && world.dashTime <= 0) this.dashExit = 0.08;
    this.wasDashing = world.dashTime > 0;
    const distance = Math.hypot(world.player.x - this.lastX, world.player.y - this.lastY);
    this.moving = distance > 0.1 && world.dashTime <= 0;
    if (this.moving) this.stride += distance * 0.085;
    this.lastX = world.player.x; this.lastY = world.player.y;
    this.recoil = Math.max(0, this.recoil - dt);
    if (world.stats.shots > this.shots) {
      this.charged = world.lastShot.charged;
      this.recoil = this.charged ? 0.22 : 0.14;
      this.shotAngle = world.lastShot.angle;
    }
    this.shots = world.stats.shots;
    for (const ghost of this.ghosts) {
      ghost.life = Math.max(0, ghost.life - dt);
      ghost.image.setVisible(ghost.life > 0).setAlpha(ghost.life / GHOST_LIFE * 0.4);
    }
    this.pose(world);
    if (world.dashTime > 0) {
      this.ghostClock -= dt;
      if (this.ghostClock <= 0) {
        this.ghostClock = 0.033;
        const ghost = this.ghosts[this.nextGhost++ % this.ghosts.length];
        ghost.life = GHOST_LIFE;
        ghost.image.setFrame(this.sprite.frame.name).setPosition(world.player.x + this.sprite.x, world.player.y + this.sprite.y)
          .setScale(this.sprite.scaleX, this.sprite.scaleY).setVisible(true).setAlpha(0.4);
      }
    } else this.ghostClock = 0;
  }

  render(world: CombatWorld, cosmetic: 'mint' | 'prism'): void {
    this.pose(world);
    if (world.hurtFlash > 0) this.sprite.setTintFill(0xffb9c4);
    else if (cosmetic === 'prism') this.sprite.setTint(0xe1ceff);
    else this.sprite.clearTint();
    this.slash.clear();
    this.muzzle.clear();
    if (world.attack) this.drawSlash(world.player.x, world.player.y, world.attack);
    const flashDuration = this.charged ? 0.1 : 0.065;
    const shotAge = (this.charged ? 0.22 : 0.14) - this.recoil;
    if (this.recoil > 0 && shotAge < flashDuration && world.dashTime <= 0) {
      const age = shotAge / flashDuration;
      const length = (this.charged ? 52 : 17) * (1 - age * 0.65);
      const width = this.charged ? 12 : 5;
      const angle = this.shotAngle;
      const x = world.player.x + Math.cos(angle) * 26;
      const y = world.player.y + Math.sin(angle) * 26;
      const point = (forward: number, side: number) => ({
        x: x + Math.cos(angle) * forward - Math.sin(angle) * side,
        y: y + Math.sin(angle) * forward + Math.cos(angle) * side,
      });
      this.muzzle.fillStyle(this.charged ? AMBER : MINT, 1 - age * 0.7)
        .fillPoints([point(-3, 0), point(3, -width), point(length, 0), point(3, width)], true);
      this.muzzle.fillStyle(0xf0fff3).fillPoints([point(0, 0), point(4, -width * 0.45), point(length * 0.8, 0), point(4, width * 0.45)], true);
      if (this.charged) {
        for (const side of [-1, 1]) {
          const spread = 12 + age * 14;
          this.muzzle.fillStyle(AMBER, (1 - age) * 0.8).fillPoints([
            point(-7, side * spread), point(8, side * (spread + 4)), point(18, side * spread),
          ], true);
          this.muzzle.lineStyle(2, 0xfff5d6, 1 - age).strokePoints([
            point(-7, side * spread), point(-12, side * (spread - 6)), point(-7, side * 4),
          ], false);
        }
      }
    }
  }

  private pose(world: CombatWorld): void {
    const { player, attack } = world;
    let pose = this.moving && Math.sin(this.stride) >= 0 ? 'move' : 'idle';
    let angle = player.angle;
    let bob = this.moving ? -Math.abs(Math.sin(this.stride)) * 1.2 : Math.sin(this.clock * 3.5) * 0.45;
    let drive = 0;
    if (attack) {
      angle = attack.angle;
      const phase = attackArtPose(attack);
      pose = phase;
      if (phase === 'attack') pose = attack.heavy ? 'heavy' : `light${attack.combo}`;
      const progress = clamp(attack.age / attack.windup);
      drive = phase === 'windup' ? -progress * 2 : phase === 'attack' ? (attack.heavy ? 3 : 1.5) : 0;
      bob = 0;
    } else if (this.recoil > 0) {
      pose = this.charged ? 'charged' : 'shoot';
      angle = this.shotAngle;
      drive = -this.recoil / (this.charged ? 0.22 : 0.14) * (this.charged ? 2.4 : 1);
    }
    if (world.dashTime > 0) { pose = 'dash'; angle = world.dashAngle; bob = 0; drive = 0; }
    else if (this.dashExit > 0 && !attack && this.recoil <= 0) pose = 'dash-exit';
    else if (world.hurtFlash > 0 && !attack && this.recoil <= 0) pose = 'hit';
    if (world.hp <= 0) { pose = 'death'; bob = drive = 0; }
    this.body.setPosition(player.x, player.y).setAlpha(world.invulnerable > 0 ? 0.7 + 0.3 * Math.cos(this.clock * 35) : 1);
    this.sprite.setFrame(actorFrame('player', angle, pose))
      .setPosition(Math.cos(angle) * drive, bob + Math.sin(angle) * drive).setScale(1);
  }

  private drawSlash(x: number, y: number, attack: Attack): void {
    const sweepTime = sweepDuration(attack);
    const age = attack.age - (attack.windup - sweepTime / 2);
    if (age < 0) return;
    const finisher = attack.heavy || attack.combo === 3;
    const fade = 1 - clamp((age - sweepTime) / (attack.heavy ? 0.18 : finisher ? 0.15 : 0.09));
    if (fade <= 0) return;
    const progress = clamp(age / sweepTime);
    const direction = attack.combo === 2 ? -1 : 1;
    const start = attack.angle - direction * attack.arc / 2;
    const polar = (fraction: number, radius: number) => ({
      x: x + Math.cos(start + direction * attack.arc * fraction) * radius,
      y: y + Math.sin(start + direction * attack.arc * fraction) * radius,
    });
    const color = attack.heavy ? AMBER : attack.combo === 2 ? 0x80e8ff : finisher ? 0xe5fff4 : MINT;
    const width = attack.heavy ? 44 : [0, 14, 22, 34][attack.combo];
    // A moving, tapered cut at real reach; its leading edge follows the blade.
    const head = Math.max(0.12, progress);
    const tail = Math.max(0, head - (finisher ? 0.85 : 0.65));
    const segments = finisher ? 10 : 6;
    const outside = Array.from({ length: segments }, (_, i) => polar(tail + (head - tail) * i / (segments - 1), attack.range));
    const inside = Array.from({ length: segments }, (_, i) => {
      const t = i / (segments - 1);
      return polar(head - (head - tail) * t, attack.range - Math.sin(t * Math.PI) * width);
    });
    this.slash.fillStyle(color, (finisher ? 0.7 : 0.5) * fade).fillPoints([...outside, ...inside], true);
    this.slash.lineStyle(finisher ? 4 : attack.combo === 2 ? 3 : 2, 0xe5fff4, fade).strokePoints(outside, false);
    if (finisher) {
      // A second broken edge marks the broad finisher, entirely inside its damage envelope.
      for (let i = 0; i < 4; i++) {
        const f = head - i * 0.18;
        if (f < 0.08) continue;
        this.slash.lineStyle(attack.heavy ? 4 : 3, attack.heavy ? 0xffedbf : MINT, fade * 0.8).strokePoints([
          polar(f, attack.range - 28), polar(f - 0.06, attack.range - 36), polar(f - 0.12, attack.range - 30),
        ], false);
      }
    }
    // Detached slivers echo the fractured blade, remaining inside the attack envelope.
    for (let i = 0; i < (finisher ? 5 : 3); i++) {
      const f = head - 0.12 - i * 0.16;
      if (f < 0) continue;
      this.slash.fillStyle(color, (0.65 - i * 0.12) * fade)
        .fillPoints([polar(f, attack.range - 10), polar(f - 0.06, attack.range - 17), polar(f - 0.13, attack.range - 15)], true);
    }
  }
}
