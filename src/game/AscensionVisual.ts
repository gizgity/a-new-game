import type Phaser from 'phaser';
import type { CombatWorld, Impact } from './combat';
import { ASCENSION } from './config/ascension';
import { ASCENSION_VFX as V, type AscensionFrame } from './config/ascensionVfx';

/** Read-only renderer: registered production artwork and exact dynamic telegraph geometry. */
export class AscensionVisual {
  private readonly images: Phaser.GameObjects.Image[] = [];
  private used = 0;
  private motion: { id: number; x: number; y: number; angle: number; moving: boolean } | null = null;
  static preload(scene: Phaser.Scene): void {
    scene.load.atlas(V.texture, `${import.meta.env.BASE_URL}assets/vfx/ascension-motifs.png`, `${import.meta.env.BASE_URL}assets/vfx/ascension-motifs.json`);
  }
  constructor(private readonly scene: Phaser.Scene) {}
  reset(): void { this.images.forEach(image => image.setVisible(false)); this.used = 0; this.motion = null; }
  step(world: CombatWorld): void {
    const e = world.enemies.find(e => e.id === world.ascension.hunterId && e.hp > 0);
    if (!e) { this.motion = null; return; }
    const previous = this.motion?.id === e.id ? this.motion : null;
    const dx = e.x - (previous?.x ?? e.x), dy = e.y - (previous?.y ?? e.y);
    this.motion = { id: e.id, x: e.x, y: e.y, angle: Math.atan2(dy, dx), moving: Math.hypot(dx, dy) > 0.1 };
  }
  private image(frame: AscensionFrame, x: number, y: number, width: number, height: number, tint = V.source as number,
    alpha = 1, rotation = 0, depth: number = V.groundDepth): void {
    if (this.used >= V.poolCap) return;
    const image = this.images[this.used] ?? this.scene.add.image(0, 0, V.texture, frame).setVisible(false);
    this.images[this.used++] = image;
    image.setTexture(V.texture, frame).setPosition(x, y).setOrigin(0.5).setDisplaySize(width, height).setRotation(rotation)
      .setDepth(depth).setAlpha(alpha).setVisible(true).clearTint();
    if (frame !== 'fractureFork') image.setTint(tint);
  }
  handlesImpact(impact: Impact): boolean { return impact.kind?.startsWith('seal') ?? false; }
  render(g: Phaser.GameObjects.Graphics, world: CombatWorld): void {
    this.images.forEach(image => image.setVisible(false)); this.used = 0;
    const a = world.ascension;
    if (!a.seal) return;
    for (const z of a.zones) {
      if (world.bossTransforming || world.anomaly.suspended || z.kind === 'echo' && z.hit) continue;
      const spec = z.kind === 'pulse' ? ASCENSION.pulse : ASCENSION.echo;
      const progress = Math.max(0, Math.min(1, 1 - z.time / spec.warning));
      const imminent = z.time <= spec.warning * V.imminentFraction;
      const color = z.hit ? V.active : imminent ? V.imminent : V.prepare;
      // Every stroke center stays at the actual damage radius. Internal art never expands the hitbox.
      for (const [width, tint] of [[V.underStroke, V.edge], [V.stroke, color]]) {
        g.lineStyle(width, tint, 0.95);
        if (imminent || z.hit) g.strokeCircle(z.x, z.y, spec.radius);
        else for (let i = 0; i < V.segments; i++) {
          const start = i * Math.PI * 2 / V.segments;
          g.beginPath().arc(z.x, z.y, spec.radius, start, start + Math.PI * 2 / V.segments * 0.66).strokePath();
        }
      }
      for (const sign of [-1, 1]) this.image('scar', z.x, z.y + sign * (spec.radius + V.scarGap), V.scarWidth, V.scarHeight);
      if (z.kind === 'pulse') {
        const phase = z.hit ? 1 - z.active / ASCENSION.pulse.active : progress;
        this.image(z.hit ? 'pulseBurst' : 'ripple', z.x, z.y, spec.radius * (1.25 + phase * 0.45), spec.radius * (1.25 + phase * 0.45), color, z.hit ? 0.9 : 0.75);
      } else {
        this.image('chainRim', z.x, z.y, spec.radius * 2, spec.radius * 2, color, imminent ? 1 : 0.7);
        this.image('crown', z.x, z.y, V.crownSize, V.crownSize, color, 0.9);
      }
      if (!z.hit) g.lineStyle(1.5, V.imminent, 0.7).beginPath().arc(z.x, z.y, spec.radius - 4, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2).strokePath();
    }
    const hunter = world.enemies.find(e => e.id === a.hunterId && e.hp > 0);
    if (hunter) {
      const warning = a.hunterWarning > 0;
      const alpha = warning ? 0.7 + 0.3 * Math.abs(Math.sin(a.hunterWarning / ASCENSION.hunter.warning * Math.PI * 2)) : 1;
      this.image('hunterEye', hunter.x, hunter.y - V.hunterOffset, V.hunterWidth, V.hunterHeight, warning ? V.imminent : V.source, alpha, 0, V.statusDepth);
      const m = this.motion;
      if (!warning && m?.moving && m.id === hunter.id && hunter.stagger <= 0 && hunter.windup <= 0 && hunter.recovery <= 0 && hunter.active <= 0) {
        for (let i = 0; i < 2; i++) {
          const distance = 22 + i * V.trailSpacing;
          this.image('scar', hunter.x - Math.cos(m.angle) * distance, hunter.y - Math.sin(m.angle) * distance + 7, V.trailWidth, V.trailHeight, V.imminent, 0.7 - i * 0.2, m.angle);
        }
      }
    }
    if (a.penalty > 0) for (const sign of [-1, 1])
      this.image('penaltyTick', world.player.x + sign * V.penaltyOffsetX, world.player.y + V.penaltyOffsetY, V.penaltyWidth, V.penaltyHeight, V.prepare, 0.9, sign < 0 ? Math.PI : 0, V.penaltyDepth);
    for (const impact of world.impacts) {
      if (!this.handlesImpact(impact)) continue;
      const fade = Math.max(0, Math.min(1, impact.life / (impact.duration ?? V.impactDuration))), p = 1 - fade;
      if (impact.kind === 'sealHunterEnd') {
        for (const sign of [-1, 1]) this.image('scar', impact.x + sign * (5 + p * 10), impact.y - V.hunterOffset, 6, 10, V.source, fade, sign * p, V.statusDepth);
      } else if (impact.kind === 'sealFracture') {
        const angle = impact.angle ?? 0;
        this.image('fractureFork', impact.x - Math.sin(angle) * V.procOffset, impact.y + Math.cos(angle) * V.procOffset, V.procSize, V.procSize, V.proc, fade, angle, V.procDepth);
      } else if (!world.bossTransforming && !world.anomaly.suspended) {
        const echo = impact.kind === 'sealEcho', size = (impact.radius ?? 48) * (1.35 + p * 0.35);
        this.image(echo ? 'chainSnap' : 'pulseBurst', impact.x, impact.y, size, size, V.active, fade, 0, V.contactDepth);
      }
    }
  }
}
