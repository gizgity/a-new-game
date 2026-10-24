import Phaser from 'phaser';
import { type Attack, type CombatWorld } from './combat';

const TEXTURE = 'fractured-vessel';
const MINT = 0x8affe0;
const AMBER = 0xffcc80;
const GHOST_LIFE = 0.22;
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1);

/** Presentation only: authored sprite parts + poses driven by the existing simulation. */
export class PlayerVisual {
  readonly body: Phaser.GameObjects.Container;
  private readonly torso: Phaser.GameObjects.Image;
  private readonly head: Phaser.GameObjects.Image;
  private readonly leftArm: Phaser.GameObjects.Image;
  private readonly rightArm: Phaser.GameObjects.Image;
  private readonly leftFoot: Phaser.GameObjects.Image;
  private readonly rightFoot: Phaser.GameObjects.Image;
  private readonly core: Phaser.GameObjects.Image;
  private readonly blade: Phaser.GameObjects.Image;
  private readonly gun: Phaser.GameObjects.Image;
  private readonly parts: Phaser.GameObjects.Image[];
  private readonly slash: Phaser.GameObjects.Graphics;
  private readonly muzzle: Phaser.GameObjects.Graphics;
  private readonly ghosts: { body: Phaser.GameObjects.Container; parts: Phaser.GameObjects.Image[]; life: number }[];
  private clock = 0;
  private stride = 0;
  private moving = false;
  private moveX = 0;
  private moveY = 0;
  private lastX = 0;
  private lastY = 0;
  private shots = 0;
  private recoil = 0;
  private charged = false;
  private shotAngle = 0;
  private ghostClock = 0;
  private nextGhost = 0;

  static preload(scene: Phaser.Scene): void {
    scene.load.svg(TEXTURE, `${import.meta.env.BASE_URL}assets/fractured-vessel.svg`);
  }

  constructor(scene: Phaser.Scene, world: CombatWorld) {
    const texture = scene.textures.get(TEXTURE);
    for (let frame = 0; frame < 8; frame++) {
      if (!texture.has(String(frame))) texture.add(frame, 0, frame * 32, 0, 32, 32);
    }
    this.body = scene.add.container(world.player.x, world.player.y).setDepth(2);
    const shadow = scene.add.graphics().fillStyle(0x000000, 0.4).fillEllipse(0, 12, 29, 11);
    this.body.add(shadow);
    const part = (frame: number) => {
      const sprite = scene.add.image(0, 0, TEXTURE, frame);
      this.body.add(sprite);
      return sprite;
    };
    this.leftFoot = part(4);
    this.rightFoot = part(4);
    this.torso = part(0);
    this.leftArm = part(2);
    this.rightArm = part(3);
    this.core = part(5);
    this.head = part(1);
    this.blade = part(6).setOrigin(4 / 32, 0.5);
    this.gun = part(7).setOrigin(8 / 32, 0.5);
    this.parts = [this.leftFoot, this.rightFoot, this.torso, this.leftArm, this.rightArm, this.core, this.head, this.blade, this.gun];
    // Fixed, small pool. Each echo preserves the actual pose/position, then separates into shards.
    this.ghosts = Array.from({ length: 6 }, () => {
      const parts = this.parts.map((source) => scene.add.image(0, 0, TEXTURE, source.frame.name).setTintFill(MINT));
      return { body: scene.add.container(0, 0, parts).setDepth(1.4).setVisible(false), parts, life: 0 };
    });
    this.slash = scene.add.graphics().setDepth(1.8);
    this.muzzle = scene.add.graphics().setDepth(2.2);
    this.reset(world);
  }

  reset(world: CombatWorld): void {
    this.clock = this.stride = this.recoil = this.ghostClock = this.nextGhost = 0;
    this.moving = false;
    this.moveX = this.moveY = 0;
    this.lastX = world.player.x;
    this.lastY = world.player.y;
    this.shots = world.stats.shots;
    for (const ghost of this.ghosts) { ghost.life = 0; ghost.body.setVisible(false); }
    this.render(world, 'mint');
  }

  /** Called only for an unfrozen simulation tick: pause, drafts and hitstop freeze the pose. */
  step(world: CombatWorld, dt: number): void {
    this.clock += dt;
    const dx = world.player.x - this.lastX, dy = world.player.y - this.lastY;
    const distance = Math.hypot(dx, dy);
    this.moving = distance > 0.1 && world.dashTime <= 0;
    this.moveX = distance > 0 ? dx / distance : 0;
    this.moveY = distance > 0 ? dy / distance : 0;
    if (this.moving) this.stride += distance * 0.085;
    this.lastX = world.player.x;
    this.lastY = world.player.y;
    this.recoil = Math.max(0, this.recoil - dt);
    if (world.stats.shots > this.shots) {
      this.recoil = 0.14;
      this.charged = world.shotCooldown > 0.2;
      this.shotAngle = world.player.angle;
    }
    this.shots = world.stats.shots;
    for (const ghost of this.ghosts) {
      ghost.life = Math.max(0, ghost.life - dt);
      ghost.body.setVisible(ghost.life > 0).setAlpha(ghost.life / GHOST_LIFE * 0.4);
      ghost.parts.forEach((part, index) => {
        part.x += (index % 2 ? 1 : -1) * dt * 16;
        part.y += (index < 2 ? 1 : -1) * dt * 10;
      });
    }
    this.pose(world);
    if (world.dashTime > 0) {
      this.ghostClock -= dt;
      if (this.ghostClock <= 0) {
        this.ghostClock = 0.033;
        const ghost = this.ghosts[this.nextGhost++ % this.ghosts.length];
        ghost.life = GHOST_LIFE;
        ghost.body.setPosition(world.player.x, world.player.y).setVisible(true).setAlpha(0.4);
        this.parts.forEach((source, index) => {
          ghost.parts[index].setPosition(source.x, source.y).setRotation(source.rotation)
            .setScale(source.scaleX, source.scaleY).setOrigin(source.originX, source.originY)
            .setAlpha(index === 5 ? 1 : 0.65).setVisible(source.visible);
        });
      }
    } else this.ghostClock = 0;
  }

  render(world: CombatWorld, cosmetic: 'mint' | 'prism'): void {
    this.pose(world);
    this.core.setTint(cosmetic === 'prism' ? 0xc9b2ff : 0xffffff);
    this.slash.clear();
    this.muzzle.clear();
    if (world.attack) this.drawSlash(world.player.x, world.player.y, world.attack);
    if (this.recoil > 0.075 && world.dashTime <= 0) {
      const age = (0.14 - this.recoil) / 0.065;
      const length = (this.charged ? 27 : 17) * (1 - age * 0.65);
      const angle = this.shotAngle;
      const x = world.player.x + Math.cos(angle) * 26;
      const y = world.player.y + Math.sin(angle) * 26;
      const point = (forward: number, side: number) => ({
        x: x + Math.cos(angle) * forward - Math.sin(angle) * side,
        y: y + Math.sin(angle) * forward + Math.cos(angle) * side,
      });
      this.muzzle.fillStyle(this.charged ? AMBER : MINT, 1 - age * 0.7)
        .fillPoints([point(-3, 0), point(3, -5), point(length, 0), point(3, 5)], true);
      this.muzzle.fillStyle(0xf0fff3).fillPoints([point(0, 0), point(4, -2), point(length * 0.7, 0), point(4, 2)], true);
    }
  }

  private pose(world: CombatWorld): void {
    const { player, attack } = world;
    const dash = world.dashTime > 0;
    const breath = Math.sin(this.clock * 3.5);
    const gait = this.moving ? Math.sin(this.stride) : 0;
    const bob = this.moving ? -Math.abs(gait) * 1.2 + this.moveY * 0.6 : breath * 0.55;
    const recoil = this.recoil / 0.14;
    const facing = Math.cos(player.angle) >= 0 ? 1 : -1;
    const lean = this.moving ? this.moveX * 1.3 : 0;
    const tuckX = dash ? -Math.cos(world.dashAngle) * 4 : 0;
    const tuckY = dash ? -Math.sin(world.dashAngle) * 4 : 0;
    this.body.setPosition(player.x, player.y).setAlpha(world.invulnerable > 0 ? 0.7 + 0.3 * Math.cos(this.clock * 35) : 1);
    this.torso.setPosition(lean + tuckX * 0.3, bob).setRotation(dash ? Math.cos(world.dashAngle) * 0.16 : lean * 0.035);
    this.head.setPosition(lean + facing + tuckX * 0.2, -10 + bob - recoil).setScale(facing, 1).setRotation(Math.sin(player.angle) * 0.08);
    this.leftArm.setPosition(-10 - breath * 0.5 + tuckX, -3 + bob + gait + tuckY).setRotation(dash ? -0.35 : -0.12 - gait * 0.04);
    this.rightArm.setPosition(10 + breath * 0.5 + tuckX, -3 + bob - gait + tuckY).setRotation(dash ? 0.35 : 0.12 + gait * 0.04);
    this.leftFoot.setPosition(-5 + tuckX, 10 + gait * 2.2 + tuckY).setRotation(-0.08 - gait * 0.1);
    this.rightFoot.setPosition(5 + tuckX, 10 - gait * 2.2 + tuckY).setRotation(0.08 + gait * 0.1);
    this.core.setPosition(lean, -1 + bob - recoil * 1.5).setScale(0.72 + breath * 0.035 + recoil * 0.13, 0.8 + breath * 0.04);
    this.core.setAlpha(0.85 + (breath + 1) * 0.075);
    this.gun.setPosition(Math.cos(player.angle) * (8 - recoil * 4), Math.sin(player.angle) * (8 - recoil * 4) + 3)
      .setRotation(player.angle - facing * recoil * 0.12).setScale(1, facing).setAlpha(dash ? 0.6 : 1);
    this.blade.setScale(1).setAlpha(1);
    if (attack) {
      const direction = attack.combo === 2 ? -1 : 1;
      const prepare = clamp(attack.age / attack.windup);
      const release = clamp((attack.age - attack.windup) / (attack.heavy ? 0.1 : 0.065));
      const recovery = clamp((attack.age - attack.windup - 0.1) / Math.max(0.01, attack.duration - attack.windup - 0.1));
      const angle = attack.angle + direction * (attack.age < attack.windup
        ? -attack.arc / 2 - prepare * 0.25
        : -attack.arc / 2 + release * attack.arc);
      const reach = attack.age < attack.windup ? 8 : 12 + Math.sin(release * Math.PI) * 6;
      this.blade.setPosition(Math.cos(angle) * reach, Math.sin(angle) * reach)
        .setRotation(angle).setScale(1 + (attack.heavy ? 0.65 : 0.3) * (1 - recovery), 1);
      this.rightArm.x += Math.cos(angle) * 3;
      this.rightArm.y += Math.sin(angle) * 3;
      this.torso.rotation += direction * (release - 0.5) * 0.22 * (1 - recovery);
      if (attack.age < attack.windup) this.core.setScale(0.72 + prepare * 0.18, 0.8 + prepare * 0.18);
    } else {
      this.blade.setPosition(-facing * 10 + tuckX, 5 + bob + tuckY)
        .setRotation(dash ? world.dashAngle + Math.PI : Math.PI / 2 + facing * 0.28).setScale(0.85, 1);
    }
    for (const part of this.parts) {
      if (world.hurtFlash > 0) part.setTintFill(0xffb9c4);
      else part.clearTint();
    }
  }

  private drawSlash(x: number, y: number, attack: Attack): void {
    if (attack.age < attack.windup) return; // Anticipation is in the blade/core pose.
    const age = attack.age - attack.windup;
    const sweepTime = attack.heavy ? 0.1 : 0.065;
    const fade = 1 - clamp((age - sweepTime) / 0.09);
    if (fade <= 0) return;
    const progress = clamp(age / sweepTime);
    const direction = attack.combo === 2 ? -1 : 1;
    const start = attack.angle - direction * attack.arc / 2;
    const polar = (fraction: number, radius: number) => ({
      x: x + Math.cos(start + direction * attack.arc * fraction) * radius,
      y: y + Math.sin(start + direction * attack.arc * fraction) * radius,
    });
    const color = attack.heavy ? AMBER : MINT;
    // Faceted sweep at the real reach. A thin full cut flashes on the damage tick;
    // the tapered moving ribbon describes direction, then vanishes before recovery ends.
    if (age < 0.035) {
      const cut = Array.from({ length: 7 }, (_, i) => polar(i / 6, attack.range));
      this.slash.lineStyle(1.5, 0xe9fff0, 0.8).strokePoints(cut, false);
    }
    const head = Math.max(0.12, progress);
    const tail = Math.max(0, head - 0.65);
    const outside = Array.from({ length: 6 }, (_, i) => polar(tail + (head - tail) * i / 5, attack.range));
    const inside = Array.from({ length: 6 }, (_, i) => {
      const t = i / 5;
      return polar(head - (head - tail) * t, attack.range - Math.sin(t * Math.PI) * (attack.heavy ? 20 : 13));
    });
    this.slash.fillStyle(color, 0.45 * fade).fillPoints([...outside, ...inside], true);
    this.slash.lineStyle(2, 0xe5fff4, fade).strokePoints(outside, false);
    // Detached slivers echo the fractured blade, remaining inside the attack envelope.
    for (let i = 0; i < 3; i++) {
      const f = head - 0.12 - i * 0.16;
      if (f < 0) continue;
      this.slash.fillStyle(color, (0.65 - i * 0.12) * fade)
        .fillPoints([polar(f, attack.range - 10), polar(f - 0.06, attack.range - 17), polar(f - 0.13, attack.range - 15)], true);
    }
  }
}
