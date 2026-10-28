import type Phaser from 'phaser';
import type { CombatWorld } from './combat';
import type { SigilId } from './config/legacy';

/** One pooled production Image. Presentation only; no world writes, combat clocks or RNG. */
export class TrailVisual {
  private readonly image: Phaser.GameObjects.Image;
  private lastX = 0;
  private lastY = 0;
  private life = 0;
  private selected: SigilId | null = null;
  static preload(scene: Phaser.Scene): void {
    scene.load.atlas('elemental-trails', `${import.meta.env.BASE_URL}assets/vfx/elemental-trails.png`, `${import.meta.env.BASE_URL}assets/vfx/elemental-trails.json`);
  }
  constructor(scene: Phaser.Scene) {
    this.image = scene.add.image(0, 0, 'elemental-trails', 'fire').setDepth(0.8).setVisible(false);
  }
  reset(world: CombatWorld): void {
    this.lastX = world.player.x; this.lastY = world.player.y;
    this.life = 0; this.image.setVisible(false);
  }
  step(world: CombatWorld, dt: number, selected: SigilId | null): void {
    if (selected !== this.selected) { this.selected = selected; this.reset(world); }
    const dx = world.player.x - this.lastX, dy = world.player.y - this.lastY;
    const distance = Math.hypot(dx, dy);
    this.lastX = world.player.x; this.lastY = world.player.y;
    this.life = Math.max(0, this.life - dt);
    if (!selected || world.hp <= 0) { this.life = 0; this.image.setVisible(false); return; }
    if (distance > 80) { this.reset(world); return; }
    if (distance > 0.1) {
      this.life = 0.3;
      const angle = Math.atan2(dy, dx);
      this.image.setFrame(selected).setPosition(world.player.x - Math.cos(angle) * 32, world.player.y + 10 - Math.sin(angle) * 32)
        .setDisplaySize(52, 22).setRotation(angle);
    }
    this.image.setVisible(this.life > 0).setAlpha(0.58 * this.life / 0.3);
  }
  finish(): void { this.life = 0; this.image.setVisible(false); }
}
