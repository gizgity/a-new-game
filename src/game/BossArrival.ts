import type Phaser from 'phaser';
import { ARENA } from './movement';
import { arrivalPulse } from './arrival';

/** Four pooled asset strips; ground layer keeps actors and actual telegraphs above the rim. */
export class BossArrival {
  private readonly edges: Phaser.GameObjects.TileSprite[];
  static preload(scene: Phaser.Scene): void {
    scene.load.image('arrival-edge', `${import.meta.env.BASE_URL}assets/arena/arrival-edge.png`);
  }
  constructor(private readonly scene: Phaser.Scene) {
    this.edges = Array.from({ length: 4 }, () => scene.add.tileSprite(0, 0, 1, 1, 'arrival-edge')
      .setOrigin(0).setDepth(0.95).setVisible(false));
  }
  render(remaining: number): void {
    const pulse = arrivalPulse(remaining);
    for (const edge of this.edges) edge.setVisible(pulse.alpha > 0);
    if (!pulse.alpha) return;
    const camera = this.scene.cameras.main, view = camera.worldView;
    const inset = 1 / camera.zoom;
    const left = Math.max(0, view.x) + inset, top = Math.max(0, view.y) + inset;
    const right = Math.min(ARENA.width, view.right) - inset, bottom = Math.min(ARENA.height, view.bottom) - inset;
    // Screen-sized halo, always inside playable view; HUD and controls remain outside.
    const thickness = (camera.width < 600 ? 10 : 14) / camera.zoom;
    const corners = [[left, top, right - left, 0], [right, top, bottom - top, Math.PI / 2],
      [right, bottom, right - left, Math.PI], [left, bottom, bottom - top, -Math.PI / 2]];
    for (let i = 0; i < 4; i++) {
      const [x, y, length, angle] = corners[i];
      this.edges[i].setPosition(x, y).setSize(Math.max(1, length), thickness).setRotation(angle)
        .setTileScale(thickness / 32).setAlpha(pulse.alpha);
    }
  }
}
