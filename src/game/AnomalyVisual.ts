import type Phaser from 'phaser';
import type { CombatWorld, Impact } from './combat';
import { ANOMALY_VFX as V, ANOMALY_FRAMES as F } from './config/anomalyVfx';

type Graphics = Phaser.GameObjects.Graphics;
type Frame = typeof F[keyof typeof F];
const secondary = new Set<Impact['kind']>(['anomalyStrike', 'anomalyCounter', 'anomalyFinisher', 'anomalySeal', 'anomalyRelay']);

/** Generated production motifs + exact dynamic geometry. Rendering never writes combat state. */
export class AnomalyVisual {
  private readonly images: Phaser.GameObjects.Image[] = [];
  private used = 0;
  private readonly movement = new Map<number, { x: number; y: number; angle: number; moving: boolean }>();

  static preload(scene: Phaser.Scene): void {
    scene.load.image('anomaly-ground-cracks', `${import.meta.env.BASE_URL}assets/vfx/anomaly-ground-cracks.png`);
    scene.load.atlas(V.texture, `${import.meta.env.BASE_URL}assets/vfx/anomaly-motifs.png`, `${import.meta.env.BASE_URL}assets/vfx/anomaly-motifs.json`);
  }
  constructor(private readonly scene: Phaser.Scene) {}
  reset(): void {
    this.images.forEach(image => image.setVisible(false)); this.used = 0; this.movement.clear();
  }
  step(world: CombatWorld): void {
    const alive = new Set(world.enemies.map(e => e.id));
    for (const id of this.movement.keys()) if (!alive.has(id)) this.movement.delete(id);
    for (const e of world.enemies) {
      const previous = this.movement.get(e.id), dx = e.x - (previous?.x ?? e.x), dy = e.y - (previous?.y ?? e.y);
      this.movement.set(e.id, { x: e.x, y: e.y, angle: Math.atan2(dy, dx), moving: Math.hypot(dx, dy) > 0.1 });
    }
  }
  private image(frame: Frame, x: number, y: number, width: number, height: number, alpha = 1, angle = 0, depth: number = V.groundDepth): void {
    if (this.used >= V.poolCap) return;
    const texture = frame === F.groundCracks ? 'anomaly-ground-cracks' : V.texture;
    const sourceFrame = frame === F.groundCracks ? undefined : frame;
    const image = this.images[this.used] ?? this.scene.add.image(0, 0, texture, sourceFrame).setVisible(false);
    this.images[this.used++] = image;
    image.setTexture(texture, sourceFrame).setOrigin(frame === F.forkShot ? 0.8 : 0.5, 0.5).setPosition(x, y).setDisplaySize(width, height).setRotation(angle)
      .setDepth(depth).setAlpha(alpha).setVisible(true).clearTint();
    if (frame === F.bracket || frame === F.resistance) image.setTintFill(V.source);
  }
  handlesImpact(impact: Impact): boolean { return secondary.has(impact.kind); }

  render(g: Graphics, world: CombatWorld): void {
    this.images.forEach(image => image.setVisible(false)); this.used = 0;
    if (!world.anomaly.active) return;
    for (const zone of world.anomaly.zones) {
      const progress = Math.max(0, Math.min(1, 1 - zone.time / zone.duration));
      const imminent = zone.time <= zone.duration * V.imminentFraction;
      const color = imminent ? V.imminent : V.prepare;
      // Stroke center is always the real damage radius; source brackets are outside, not a new hit shape.
      for (const [stroke, tint] of [[V.underStroke, V.edge], [V.stroke, color]]) {
        g.lineStyle(stroke, tint, 0.95);
        if (imminent) g.strokeCircle(zone.x, zone.y, zone.radius);
        else for (let i = 0; i < V.segments; i++) {
          const start = i * Math.PI * 2 / V.segments;
          g.beginPath().arc(zone.x, zone.y, zone.radius, start, start + Math.PI * 2 / V.segments * 0.70).strokePath();
        }
      }
      g.lineStyle(1.3, V.imminent, 0.7).beginPath().arc(zone.x, zone.y, zone.radius - 6, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2).strokePath();
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + i * Math.PI / 2, r = zone.radius + V.bracketGap;
        this.image(F.bracket, zone.x + Math.cos(a) * r, zone.y + Math.sin(a) * r, V.bracketSize, V.bracketSize, 0.95, a + Math.PI / 4);
      }
      const glyph = zone.storm ? F.stormRune : zone.source !== undefined ? F.echoRune : F.groundCracks;
      this.image(glyph, zone.x, zone.y - zone.radius - 12, V.glyphSize, V.glyphSize, 0.95);
      if (!zone.storm) {
        const echo = zone.source !== undefined;
        this.image(echo ? F.echoArcs : F.groundCracks, zone.x, zone.y, zone.radius * (echo ? 1.05 : 2), zone.radius * (echo ? 1.05 : 2), echo ? 0.5 + progress * 0.2 : 0.62 + progress * 0.28);
        if (echo) {
          const source = world.enemies.find(e => e.id === zone.source && e.hp > 0);
          if (source) {
            g.lineStyle(1, V.relay, 0.28);
            for (let i = 0; i < 8; i += 2) g.lineBetween(source.x + (zone.x - source.x) * i / 8, source.y + (zone.y - source.y) * i / 8,
              source.x + (zone.x - source.x) * (i + 1) / 8, source.y + (zone.y - source.y) * (i + 1) / 8);
          }
        }
      }
    }
    for (const impact of world.impacts) this.impact(g, impact, world);
    for (const e of world.enemies) if (e.hp > 0 && world.anomaly.resists(e) && e.stagger <= 0)
      this.image(F.resistance, e.x, e.y + 16, 34, 16, 0.95, 0, V.feedbackDepth);
    for (const shot of world.projectiles) if (shot.anomaly && shot.life > 0)
      this.image(F.forkShot, shot.x, shot.y, 25, 9, 1, Math.atan2(shot.vy, shot.vx), V.projectileDepth);
    // Lowest visual priority: trail chips only after real pursuit movement, never windup/knockback/idle.
    if (world.anomaly.active === 'bloodMoon') for (const e of world.enemies) {
      const m = this.movement.get(e.id), d = Math.hypot(e.x - world.player.x, e.y - world.player.y);
      if (!m?.moving || e.hp <= 0 || e.kind === 'boss' || e.stagger > 0 || e.windup > 0 || e.recovery > 0 || e.active > 0 || d <= (e.kind === 'archer' ? 340 : 40)) continue;
      this.image(F.pursuit, e.x - Math.cos(m.angle) * 23, e.y - Math.sin(m.angle) * 23 + 8, 18, 10, 0.6, m.angle);
    }
  }

  private impact(g: Graphics, impact: Impact, world: CombatWorld): void {
    const fade = Math.max(0, Math.min(1, impact.life / (impact.duration ?? 0.18))), progress = 1 - fade;
    const { x, y } = impact;
    if (impact.kind === 'anomalyStrike') {
      const storm = impact.anomaly === 'fracturedStorm';
      this.image(storm ? F.stormBolt : impact.anomaly === 'echoChamber' ? F.echoArcs : F.groundBurst, x, storm ? y - 10 : y,
        storm ? 30 : (impact.radius ?? 60) * 1.6, storm ? 58 : (impact.radius ?? 60) * 1.6, fade, 0, V.feedbackDepth);
      // No persistent danger rim after one-shot impact.
      this.image(F.sparks, x, y + 5, 34 + progress * 16, 20 + progress * 10, fade * 0.7, 0, V.feedbackDepth);
    } else if (impact.kind === 'anomalyCounter' || impact.kind === 'anomalyRelay') {
      const sx = impact.sourceX ?? world.player.x, sy = impact.sourceY ?? world.player.y;
      const dx = x - sx, dy = y - sy, distance = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
      if (impact.kind === 'anomalyCounter') {
        // Begin outside Player silhouette; stop at actual target. This is feedback, never new damage geometry.
        const inset = Math.min(23, distance / 2), length = Math.max(1, distance - inset);
        this.image(F.staticArc, sx + Math.cos(angle) * (inset + length / 2), sy + Math.sin(angle) * (inset + length / 2), length, 9, fade, angle, V.feedbackDepth);
      } else {
        g.lineStyle(1.5, V.relay, fade * 0.75);
        for (let i = 0; i < 10; i += 2) g.lineBetween(sx + dx * i / 10, sy + dy * i / 10 + 3, sx + dx * (i + 1) / 10, sy + dy * (i + 1) / 10 + 3);
        this.image(F.relay, x, y + 15, 29, 14, fade, 0, V.feedbackDepth);
      }
    } else if (impact.kind === 'anomalyFinisher') {
      const angle = impact.angle ?? 0;
      this.image(F.bloodCrescent, x + Math.cos(angle) * progress * 7, y + Math.sin(angle) * progress * 7, 30, 38, Math.min(1, fade * 1.5), angle, V.feedbackDepth);
      const weaponX = (impact.sourceX ?? world.player.x) + Math.cos(angle) * 12;
      const weaponY = (impact.sourceY ?? world.player.y) + Math.sin(angle) * 12 - 5;
      this.image(F.energy, x + (weaponX - x) * progress, y + (weaponY - y) * progress, 18, 8,
        Math.min(1, fade * 1.8), Math.atan2(weaponY - y, weaponX - x), V.feedbackDepth);
    } else if (impact.kind === 'anomalySeal') {
      this.image(F.sealBreak, x, y, 36 + progress * 12, 24 + progress * 8, fade, impact.angle ?? 0, V.feedbackDepth);
    }
    if (impact.anomaly === 'volatileGround' && impact.kind !== 'anomalyStrike') {
      this.image(F.groundBurst, x, y, Math.min(impact.radius ?? 100, 120) * (1 + progress * 0.3), Math.min(impact.radius ?? 100, 120), fade * 0.55, 0, V.feedbackDepth);
    }
  }
}
