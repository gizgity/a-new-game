import { drawLegacy } from './LegacyVisual';
import Phaser from 'phaser';
import { BossArrival } from './BossArrival';
import { ProceduralAudio } from './audio';
import { RunResultVisual } from './RunResultVisual';
import { RunDirector } from './run';
import { CombatWorld, type CombatAction, type CombatInput } from './combat';
import { drawBuildCues, drawBuildImpact } from './BuildVisual';
import { drawBarrier } from './BarrierVisual';
import { drawEnemyStatus, drawEnemyTelegraph } from './EnemyVisual';
import { EnemySprites } from './EnemySprites';
import { PlayerVisual } from './PlayerVisual';
import { drawChargedImpact, drawChargedProjectile } from './chargedVfx';
import type { TouchControls } from '../ui/TouchControls';
import { ARENA, FIXED_STEP, type PlayerState } from './movement';
import { autoAimTarget, type AutoAimPriority } from './autoAim';
import { touchAim } from './touchAim';

export type Phase = 'ready' | 'anomaly' | 'legacy' | 'playing' | 'paused' | 'draft' | 'victory' | 'defeat';

export class ArenaScene extends Phaser.Scene {
  readonly player: PlayerState = { x: ARENA.width / 2, y: ARENA.height / 2, angle: 0 };
  phase: Phase = 'ready';
  readonly combat = new CombatWorld(this.player);
  readonly run = new RunDirector(this.combat);
  private groundGraphics!: Phaser.GameObjects.Graphics;
  private enemySprites!: EnemySprites;
  private combatGraphics!: Phaser.GameObjects.Graphics;
  private audio!: ProceduralAudio;
  private arrival!: BossArrival;
  private resultVisual!: RunResultVisual;
  victoryRevealing = false;
  cosmetic: 'mint' | 'prism' = 'mint';
  desktopAutoAim = false;
  autoAimPriority: AutoAimPriority = 'nearest';
  private meleeHeld = false;
  private shootHeld = false;
  private vessel!: PlayerVisual;
  private reticle!: Phaser.GameObjects.Graphics;
  private keys!: Record<'W' | 'A' | 'S' | 'D' | 'SHIFT' | 'SPACE' | 'E' | 'Q', Phaser.Input.Keyboard.Key>;
  private accumulator = 0;
  private pressed = new Set<CombatAction>();
  private armedSpecials = new Set<'heavy' | 'charged'>();
  private releaseAim: NonNullable<CombatInput['specialAim']> = {};
  private aim = new Phaser.Math.Vector2();

  constructor(
    private readonly onPhaseChange: (phase: Phase) => void,
    private readonly onReady: () => void,
    private readonly onCombatChange: (combat: CombatWorld) => void,
    private readonly touch: TouchControls,
  ) {
    super('arena');
  }

  preload(): void {
    PlayerVisual.preload(this);
    BossArrival.preload(this);
    this.load.image('arena-floor', `${import.meta.env.BASE_URL}assets/arena/broken-seal-v2.webp`);
  }

  create(): void {
    this.audio = new ProceduralAudio(this);
    this.drawArena();
    this.arrival = new BossArrival(this);
    this.groundGraphics = this.add.graphics().setDepth(1);
    this.combatGraphics = this.add.graphics().setDepth(1.5);
    this.enemySprites = new EnemySprites(this);
    this.vessel = new PlayerVisual(this, this.combat);
    this.resultVisual = new RunResultVisual(this);
    this.reticle = this.add.graphics().setDepth(3).setVisible(false);
    this.reticle.lineStyle(1, 0x91ffe0, 0.8).strokeCircle(0, 0, 7);
    for (const sign of [-1, 1]) {
      this.reticle.lineBetween(sign * 10, 0, sign * 15, 0);
      this.reticle.lineBetween(0, sign * 10, 0, sign * 15);
    }

    this.touch.onCancel = () => this.combat.clearInput();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,SHIFT,SPACE,E,Q') as typeof this.keys;
    this.input.keyboard!.on('keydown-ESC', (event: KeyboardEvent) => {
      if (!event.repeat && (this.phase === 'playing' || this.phase === 'paused')) {
        this.setPhase(this.phase === 'playing' ? 'paused' : 'playing');
      }
    });
    this.input.keyboard!.addCapture(['SPACE', 'SHIFT']);
    for (const [key, action] of [['SPACE', 'dash'], ['SHIFT', 'heavy'], ['E', 'charged'], ['Q', 'ultimate']] as const) {
      this.input.keyboard!.on(`keydown-${key}`, (event: KeyboardEvent) => {
        if (event.repeat || this.phase !== 'playing') return;
        if (action === 'heavy' || action === 'charged') this.armedSpecials.add(action);
        else this.pressed.add(action);
      });
    }
    for (const [key, action] of [['SHIFT', 'heavy'], ['E', 'charged']] as const) {
      this.input.keyboard!.on(`keyup-${key}`, () => {
        if (!this.armedSpecials.delete(action) || this.phase !== 'playing') return;
        const pointer = this.input.activePointer;
        const point = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const target = !this.touch.enabled && this.desktopAutoAim
          ? autoAimTarget(this.player, this.combat.enemies, this.autoAimPriority) : undefined;
        this.releaseAim[action] = Math.atan2((target ?? point).y - this.player.y, (target ?? point).x - this.player.x);
        this.pressed.add(action);
      });
    }
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.phase !== 'playing' || pointer.wasTouch) return;
      if (pointer.button === 0) this.pressed.add('melee');
      if (pointer.button === 2) this.pressed.add('shoot');
      this.meleeHeld = pointer.leftButtonDown();
      this.shootHeld = pointer.rightButtonDown();
    });
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer.wasTouch) return;
      this.meleeHeld = pointer.leftButtonDown();
      this.shootHeld = pointer.rightButtonDown();
    });
    this.input.on('gameout', () => {
      this.meleeHeld = this.shootHeld = false;
      if (!this.touch.enabled) { this.pressed.clear(); this.armedSpecials.clear(); this.releaseAim = {}; this.combat.clearInput(); }
    });
    this.input.mouse!.disableContextMenu();
    this.cameras.main.setBounds(0, 0, ARENA.width, ARENA.height);
    this.cameras.main.startFollow(this.vessel.body, true, 0.12, 0.12);
    this.resize(this.scale.gameSize);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this);
    this.game.events.on(Phaser.Core.Events.BLUR, this.handleBlur, this);
    this.game.events.on(Phaser.Core.Events.HIDDEN, this.handleBlur, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.resize, this);
      this.game.events.off(Phaser.Core.Events.BLUR, this.handleBlur, this);
      this.game.events.off(Phaser.Core.Events.HIDDEN, this.handleBlur, this);
    });
    this.drawCombat();
    this.onCombatChange(this.combat);
    this.onReady();
  }

  setPhase(phase: Phase): void {
    if ((phase === 'playing' || phase === 'legacy') && (this.phase === 'ready' || this.phase === 'victory' || this.phase === 'defeat')) {
      this.victoryRevealing = false;
      this.resultVisual.reset();
      this.run.start();
      this.vessel.reset(this.combat);
      this.enemySprites.reset();
      this.cameras.main.centerOn(this.player.x, this.player.y);
    }
    if (this.run.bossWarning === 0) this.audio.arrival(0);
    const previous = this.phase;
    this.audio.transition(phase === 'victory' || phase === 'defeat' ? phase
      : phase === 'draft' ? 'draft'
      : phase === 'playing' && previous === 'draft' ? 'choice'
      : phase === 'playing' && previous !== 'paused' ? 'start' : undefined);
    this.meleeHeld = this.shootHeld = false;
    this.touch.reset();
    this.phase = phase;
    if (phase === 'victory') {
      this.victoryRevealing = true;
      this.resultVisual.victory(this.combat.bossDeathPosition ?? this.player, () => {
        this.victoryRevealing = false;
        if (this.phase === 'victory') this.onPhaseChange('victory');
      });
    }
    this.accumulator = 0;
    this.pressed.clear();
    this.armedSpecials.clear();
    this.releaseAim = {};
    this.combat.clearInput();
    this.input.keyboard?.resetKeys();
    this.drawCombat();
    this.vessel.render(this.combat, this.cosmetic);
    if (phase === 'victory' || phase === 'defeat') this.vessel.finish();
    this.onPhaseChange(phase);
    this.onCombatChange(this.combat);
  }

  chooseDraft(index: number): void {
    if (this.phase === 'draft' && this.run.choose(index)) this.setPhase('playing');
  }

  private handleBlur(): void {
    if (this.phase === 'playing') this.setPhase('paused');
  }

  private resize(size: Phaser.Structs.Size): void {
    const compact = this.touch.enabled || size.width < 700;
    const zoom = compact
      ? Phaser.Math.Clamp(Math.min(size.width / 480, size.height / 400), 0.75, 1.3)
      : Math.min(size.width / 1120, size.height / 700);
    // Reserved HUD/control lanes can make the canvas wide and short.
    this.cameras.main.setZoom(Math.max(zoom, size.width / ARENA.width, size.height / ARENA.height));
    this.pressed.clear();
    this.armedSpecials.clear();
    this.releaseAim = {};
    this.combat.clearInput();
    this.meleeHeld = this.shootHeld = false;
    this.input.keyboard?.resetKeys();
    this.touch.reset();
  }

  update(_time: number, delta: number): void {
    this.reticle.setVisible(this.phase === 'playing' && (this.touch.enabled || this.input.isOver));
    if (this.phase !== 'playing') {
      if (this.phase === 'victory' || this.phase === 'defeat') this.enemySprites.stepDeaths(Math.min(delta / 1000, 0.1));
      return;
    }

    const touch = this.touch.sample();
    if (this.touch.enabled && !this.combat.bossTransforming) {
      this.player.angle = touchAim(this.player, this.combat.enemies, touch.manualAimAngle, touch.aimAngle ?? this.player.angle);
      this.reticle.setPosition(this.player.x + Math.cos(this.player.angle) * 100,
        this.player.y + Math.sin(this.player.angle) * 100);
    } else if (!this.combat.bossTransforming && this.input.isOver && !this.input.activePointer.wasTouch) {
      this.updateDesktopAim();
    }
    // Giới hạn catch-up; mọi cooldown và AI dùng cùng simulation 60Hz.
    this.accumulator += Math.min(delta / 1000, 0.1);
    while (this.accumulator >= FIXED_STEP) {
      // Capture once per tick, including hitstop; CombatWorld buffers intent for 120ms.
      const touch = this.touch.sample();
      if (this.touch.enabled && !this.combat.bossTransforming) this.player.angle = touchAim(this.player, this.combat.enemies, touch.manualAimAngle, touch.aimAngle ?? this.player.angle);
      else if (!this.touch.enabled && !this.combat.bossTransforming && this.input.isOver && !this.input.activePointer.wasTouch) this.updateDesktopAim();
      const input = {
        dx: touch.dx || Number(this.keys.D.isDown) - Number(this.keys.A.isDown),
        dy: touch.dy || Number(this.keys.S.isDown) - Number(this.keys.W.isDown),
        melee: touch.melee || this.pressed.has('melee') || this.meleeHeld && this.input.isOver,
        shoot: touch.shoot || this.pressed.has('shoot') || this.shootHeld && this.input.isOver,
        heavy: touch.heavy || this.pressed.has('heavy'),
        charged: touch.charged || this.pressed.has('charged'),
        ultimate: touch.ultimate || this.pressed.has('ultimate') || this.keys.Q.isDown,
        dash: this.pressed.has('dash') || touch.dash,
        pressed: [...this.pressed, ...touch.pressed ?? []],
        specialAim: { ...this.releaseAim, ...touch.specialAim },
      };
      const frozen = this.combat.hitstop > 0 || this.combat.bossTransforming;
      const bossBefore = this.run.bossDue;
      const eliteBefore = this.combat.enemies.some(enemy => enemy.kind === 'bulwark');
      this.run.step(input, FIXED_STEP);
      if (!frozen) {
        this.vessel.step(this.combat, FIXED_STEP);
        this.enemySprites.step(FIXED_STEP);
      }
      if (!bossBefore && this.run.bossDue) this.audio.transition('boss');
      else if (!eliteBefore && this.combat.enemies.some(enemy => enemy.kind === 'bulwark')) this.audio.transition('elite');
      else this.audio.play(this.combat.soundEvents);
      this.audio.arrival(this.run.bossWarning);
      this.pressed.clear();
      this.releaseAim = {};
      this.touch.consume();
      this.accumulator -= FIXED_STEP;
      if (this.run.result) { this.setPhase(this.run.result); break; }
      if (this.run.anomalyPending) { this.setPhase('anomaly'); break; }
      if (this.run.draft.length) { this.setPhase('draft'); break; }
    }
    this.drawCombat();
    this.onCombatChange(this.combat);
    this.vessel.render(this.combat, this.cosmetic);
    if (this.run.result) this.vessel.finish();
  }

  private updateDesktopAim(): void {
    const pointer = this.input.activePointer;
    this.cameras.main.getWorldPoint(pointer.x, pointer.y, this.aim);
    const target = this.desktopAutoAim ? autoAimTarget(this.player, this.combat.enemies, this.autoAimPriority) : undefined;
    const point = target ?? this.aim;
    this.player.angle = Math.atan2(point.y - this.player.y, point.x - this.player.x);
    this.reticle.setPosition(point.x, point.y);
  }

  private drawCombat(): void {
    const g = this.combatGraphics.clear();
    const world = this.combat;
    const ground = this.groundGraphics.clear();
    this.arrival.render(this.run.bossWarning);
    for (const zone of world.anomaly.zones) {
      const imminent = zone.time < zone.duration * 0.35;
      ground.lineStyle(imminent ? 3 : 2, imminent ? 0xffe599 : 0xff6f87, 0.9);
      // Thin local outline below existing telegraphs and actors, no screen fill.
      ground.strokeCircle(zone.x, zone.y, zone.radius);
      const r = zone.radius * (1 - zone.time / zone.duration);
      ground.lineStyle(1, 0xffcc80, 0.65).strokeCircle(zone.x, zone.y, r);
      ground.lineBetween(zone.x - 6, zone.y, zone.x + 6, zone.y);
      ground.lineBetween(zone.x, zone.y - 6, zone.x, zone.y + 6);
    }
    for (const enemy of world.enemies) drawEnemyTelegraph(ground, enemy, world);
    drawBuildCues(ground, world);
    drawLegacy(ground, world);
    this.enemySprites.render(world);
    for (const enemy of world.enemies) {
      drawEnemyStatus(g, enemy);
      if (world.anomaly.resists(enemy) && enemy.stagger <= 0) {
        ground.lineStyle(2, 0x63d9f5, 0.85).strokeRect(enemy.x - 18, enemy.y - 18, 36, 36);
      }
    }
    for (const shot of world.projectiles) {
      if (!shot.hostile && shot.charged) { drawChargedProjectile(g, shot); continue; }
      const color = shot.hostile ? 0xc399ff : shot.charged ? 0xffcc80 : 0x9dffe2;
      g.lineStyle(shot.hostile ? 3 : 2, color, 0.65);
      const speed = Math.hypot(shot.vx, shot.vy) || 1;
      g.lineBetween(shot.x, shot.y, shot.x - shot.vx / speed * 16, shot.y - shot.vy / speed * 16);
      g.fillStyle(color).fillCircle(shot.x, shot.y, shot.hostile || shot.charged ? 5 : 3);
    }
    if (world.perfectFlash > 0) {
      const radius = 28 + (0.65 - world.perfectFlash) * 45;
      g.lineStyle(2, 0x9dffe2, world.perfectFlash / 0.65);
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2;
        const point = (angle: number, r: number) => ({ x: this.player.x + Math.cos(angle) * r, y: this.player.y + Math.sin(angle) * r });
        g.strokePoints([point(a - 0.35, radius * 0.8), point(a, radius), point(a + 0.35, radius * 0.8)], false);
      }
    }
    if (world.surgeFlash > 0) g.lineStyle(4, 0x9dffe2, world.surgeFlash / 0.6).strokeCircle(this.player.x, this.player.y, 280 * (1 - world.surgeFlash / 0.6));
    if (world.hurtFlash > 0) g.lineStyle(3, 0xff6f87).strokeCircle(this.player.x, this.player.y, 23);
    drawBarrier(g, world);
    for (const impact of world.impacts) {
      if (drawBuildImpact(g, impact)) continue;
      if (impact.kind === 'chargedBlast' || impact.kind === 'chargedHit') { drawChargedImpact(g, impact); continue; }
      const fade = impact.life / (impact.duration ?? 0.18);
      if (impact.kind === 'anomalyStrike') {
        g.lineStyle(2, impact.color, fade).strokeCircle(impact.x, impact.y, (impact.radius ?? 60) * (1 - fade * 0.15));
        if (impact.color === 0xffe599) g.strokePoints([{ x: impact.x + 8, y: impact.y - 25 }, { x: impact.x - 5, y: impact.y - 3 }, { x: impact.x + 5, y: impact.y + 3 }, { x: impact.x - 8, y: impact.y + 25 }], false);
        continue;
      }
      if (impact.kind === 'guardBreak') {
        const x = impact.x + ((impact.sourceX ?? impact.x) - impact.x) * (1 - fade);
        const y = impact.y + ((impact.sourceY ?? impact.y) - impact.y) * (1 - fade);
        g.lineStyle(2, impact.color, fade).strokePoints([{ x: x - 5, y }, { x, y: y + 7 }, { x: x + 5, y }], false);
        continue;
      }
      if (impact.kind === 'chainBlast') {
        g.lineStyle(2, impact.color, fade).strokeCircle(impact.x, impact.y, (impact.radius ?? 105) * (1 - fade));
        if (impact.sourceX !== undefined && impact.sourceY !== undefined) {
          g.lineStyle(2, 0xe5fff7, fade).lineBetween(impact.sourceX, impact.sourceY, impact.x, impact.y);
        }
        continue;
      }
      if (impact.kind) {
        const heavy = impact.kind === 'heavy' || impact.kind === 'light3';
        const spread = (impact.kind === 'heavy' ? 44 : heavy ? 32 : impact.kind === 'light2' ? 26 : 20) * (1 - fade);
        const angle = impact.angle ?? 0;
        // Contact sparks travel along the blow, with a sharp cross-cut on impact.
        g.lineStyle(heavy ? 3 : 2, impact.color, fade);
        for (let i = -2; i <= 2; i++) {
          const a = angle + i * 0.65;
          const start = 3 + spread;
          const end = start + (impact.kind === 'heavy' ? 20 : heavy ? 14 : 8) * fade;
          g.lineBetween(impact.x + Math.cos(a) * start, impact.y + Math.sin(a) * start,
            impact.x + Math.cos(a) * end, impact.y + Math.sin(a) * end);
        }
        const cut = (impact.kind === 'heavy' ? 24 : heavy ? 16 : 9) * fade;
        g.lineStyle(2, 0xffffff, fade).lineBetween(impact.x - Math.sin(angle) * cut, impact.y + Math.cos(angle) * cut,
          impact.x + Math.sin(angle) * cut, impact.y - Math.cos(angle) * cut);
      } else g.lineStyle(2, impact.color, fade).strokeCircle(impact.x, impact.y, 4 + (1 - fade) * (impact.radius ?? 22));
    }
  }

  private drawArena(): void {
    // Authored static floor only; world bounds, camera and combat layers stay unchanged.
    this.add.image(0, 0, 'arena-floor').setOrigin(0)
      .setDisplaySize(ARENA.width, ARENA.height).setTint(0x7a8791).setDepth(0);
  }
}
