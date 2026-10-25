import Phaser from 'phaser';

/** Short presentation after the simulation has ended; never applies damage. */
export class RunResultVisual {
  private graphics: Phaser.GameObjects.Graphics;
  private tween?: Phaser.Tweens.Tween;
  constructor(private scene: Phaser.Scene) {
    this.graphics = scene.add.graphics().setDepth(8);
  }
  reset(): void { this.tween?.stop(); this.graphics.clear(); }
  victory(point: { x: number; y: number }, complete: () => void): void {
    this.reset();
    this.tween = this.scene.tweens.addCounter({ from: 0, to: 1, duration: 1100,
      onUpdate: tween => {
        const age = tween.getValue() ?? 0, g = this.graphics.clear();
        const radius = 28 + age * 230;
        g.lineStyle(3, 0xffd58a, 1 - age).strokeCircle(point.x, point.y, radius);
        for (let i = 0; i < 12; i++) {
          const angle = i * Math.PI / 6, r = 24 + age * (i % 2 ? 150 : 110);
          const x = point.x + Math.cos(angle) * r, y = point.y + Math.sin(angle) * r;
          g.lineStyle(2, i % 2 ? 0x9dffe2 : 0xffd58a, 1 - age);
          g.strokePoints([{ x: x - 7, y }, { x, y: y - 12 }, { x: x + 7, y }, { x, y: y + 12 }], true);
        }
      },
      onComplete: () => { this.graphics.clear(); complete(); },
    });
  }
}
