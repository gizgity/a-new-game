import Phaser from 'phaser';
import { ProceduralAudio } from './audio';
import { RunDirector } from './run';
import { CombatWorld, type CombatAction } from './combat';
import { PlayerVisual } from './PlayerVisual';
import { drawChargedImpact, drawChargedProjectile } from './chargedVfx';
import type { TouchControls } from '../ui/TouchControls';
import { ARENA, FIXED_STEP, type PlayerState } from './movement';

export type Phase = 'ready' | 'playing' | 'paused' | 'draft' | 'victory' | 'defeat';

export class ArenaScene extends Phaser.Scene {
  readonly player: PlayerState = { x: ARENA.width / 2, y: ARENA.height / 2, angle: 0 };
  phase: Phase = 'ready';
  readonly combat = new CombatWorld(this.player);
  readonly run = new RunDirector(this.combat);
  private combatGraphics!: Phaser.GameObjects.Graphics;
  private audio!: ProceduralAudio;
  cosmetic: 'mint' | 'prism' = 'mint';
  private meleeHeld = false;
  private shootHeld = false;
  private vessel!: PlayerVisual;
  private reticle!: Phaser.GameObjects.Graphics;
  private keys!: Record<'W' | 'A' | 'S' | 'D' | 'SHIFT' | 'SPACE' | 'E' | 'Q', Phaser.Input.Keyboard.Key>;
  private accumulator = 0;
  private pressed = new Set<CombatAction>();
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
  }

  create(): void {
    this.audio = new ProceduralAudio(this);
    this.drawArena();
    this.combatGraphics = this.add.graphics().setDepth(1);
    this.vessel = new PlayerVisual(this, this.combat);
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
        if (!event.repeat && this.phase === 'playing') this.pressed.add(action);
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
      if (!this.touch.enabled) { this.pressed.clear(); this.combat.clearInput(); }
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
    if (phase === 'playing' && (this.phase === 'ready' || this.phase === 'victory' || this.phase === 'defeat')) {
      this.run.start();
      this.vessel.reset(this.combat);
      this.cameras.main.centerOn(this.player.x, this.player.y);
    }
    this.meleeHeld = this.shootHeld = false;
    this.touch.reset();
    this.phase = phase;
    this.accumulator = 0;
    this.pressed.clear();
    this.combat.clearInput();
    this.input.keyboard?.resetKeys();
    this.onPhaseChange(phase);
  }

  chooseDraft(index: number): void {
    if (this.phase === 'draft' && this.run.choose(index)) this.setPhase('playing');
  }

  private handleBlur(): void {
    if (this.phase === 'playing') this.setPhase('paused');
  }

  private resize(size: Phaser.Structs.Size): void {
    const compact = this.touch.enabled || size.width < 700;
    this.cameras.main.setZoom(compact
      ? Phaser.Math.Clamp(Math.min(size.width / 480, size.height / 400), 0.75, 1.3)
      : Math.min(size.width / 1120, size.height / 700));
    this.pressed.clear();
    this.combat.clearInput();
    this.meleeHeld = this.shootHeld = false;
    this.input.keyboard?.resetKeys();
    this.touch.reset();
  }

  update(_time: number, delta: number): void {
    this.reticle.setVisible(this.phase === 'playing' && (this.touch.enabled || this.input.isOver));
    if (this.phase !== 'playing') return;

    const pointer = this.input.activePointer;
    const touch = this.touch.sample();
    if (this.touch.enabled) {
      if (touch.aimAngle !== null) this.player.angle = touch.aimAngle;
      this.reticle.setPosition(this.player.x + Math.cos(this.player.angle) * 100,
        this.player.y + Math.sin(this.player.angle) * 100);
    } else if (this.input.isOver && !pointer.wasTouch) {
      this.cameras.main.getWorldPoint(pointer.x, pointer.y, this.aim);
      this.player.angle = Math.atan2(this.aim.y - this.player.y, this.aim.x - this.player.x);
      this.reticle.setPosition(this.aim.x, this.aim.y);
    }
    // Giới hạn catch-up; mọi cooldown và AI dùng cùng simulation 60Hz.
    this.accumulator += Math.min(delta / 1000, 0.1);
    while (this.accumulator >= FIXED_STEP) {
      // Capture once per tick, including hitstop; CombatWorld buffers intent for 120ms.
      const touch = this.touch.sample();
      const input = {
        dx: touch.dx || Number(this.keys.D.isDown) - Number(this.keys.A.isDown),
        dy: touch.dy || Number(this.keys.S.isDown) - Number(this.keys.W.isDown),
        melee: touch.melee || this.pressed.has('melee') || this.meleeHeld && this.input.isOver,
        shoot: touch.shoot || this.pressed.has('shoot') || this.shootHeld && this.input.isOver,
        heavy: touch.heavy || this.pressed.has('heavy') || this.keys.SHIFT.isDown,
        charged: touch.charged || this.pressed.has('charged') || this.keys.E.isDown,
        ultimate: touch.ultimate || this.pressed.has('ultimate') || this.keys.Q.isDown,
        dash: this.pressed.has('dash') || touch.dash,
        pressed: [...this.pressed, ...touch.pressed ?? []],
      };
      const frozen = this.combat.hitstop > 0;
      this.run.step(input, FIXED_STEP);
      if (!frozen) this.vessel.step(this.combat, FIXED_STEP);
      this.audio.play(this.combat.soundEvents);
      this.pressed.clear();
      this.touch.consume();
      this.accumulator -= FIXED_STEP;
      if (this.run.result) { this.setPhase(this.run.result); break; }
      if (this.run.draft.length) { this.setPhase('draft'); break; }
    }
    this.drawCombat();
    this.onCombatChange(this.combat);
    this.vessel.render(this.combat, this.cosmetic);
  }

  private drawCombat(): void {
    const g = this.combatGraphics.clear();
    const world = this.combat;
    for (const enemy of world.enemies) {
      const color = enemy.kind === 'boss' ? 0xffcc80 : enemy.kind === 'bulwark' ? 0x91b5ff : enemy.kind === 'volatile' ? 0xffb36b : enemy.kind === 'grunt' ? 0xff6f87 : 0xc399ff;
      if (enemy.windup > 0) {
        const progress = Math.max(0, 1 - enemy.windup / (enemy.kind === 'boss' ? 0.95 : enemy.kind === 'grunt' ? 0.42 : 0.7));
        g.lineStyle(2, color, 0.3 + progress * 0.7);
        if (enemy.kind === 'boss') {
          g.fillStyle(color, 0.16);
          if (enemy.action === 0) this.drawSector(g, enemy.x, enemy.y, 230, enemy.angle, 1.7);
          else if (enemy.action === 1) g.strokeCircle(enemy.x, enemy.y, 100);
          else g.fillCircle(enemy.targetX, enemy.targetY, 110).strokeCircle(enemy.targetX, enemy.targetY, 110);
        } else if (enemy.kind === 'volatile') {
          g.fillStyle(color, 0.12 + progress * 0.15).fillCircle(enemy.x, enemy.y, 110);
        } else if (enemy.kind === 'archer') {
          g.lineBetween(enemy.x, enemy.y, enemy.x + Math.cos(enemy.angle) * 600, enemy.y + Math.sin(enemy.angle) * 600);
        } else {
          g.fillStyle(color, 0.12 + progress * 0.18);
          this.drawSector(g, enemy.x, enemy.y, 70, enemy.angle, 1.7);
        }
        g.strokeCircle(enemy.x, enemy.y, 20 + progress * 5);
      }
      g.fillStyle(0x000000, 0.35).fillEllipse(enemy.x, enemy.y + 10, 30, 12);
      g.fillStyle(enemy.flash > 0 ? 0xffffff : enemy.kind === 'grunt' ? 0x612c44 : 0x3f315e);
      g.lineStyle(2, enemy.flash > 0 ? 0xffffff : color);
      if (enemy.kind === 'boss' || enemy.kind === 'bulwark') {
        const radius = enemy.kind === 'boss' ? 32 : 22;
        const points = Array.from({ length: 6 }, (_, i) => ({ x: enemy.x + Math.cos(i * Math.PI / 3) * radius,
          y: enemy.y + Math.sin(i * Math.PI / 3) * radius }));
        g.fillPoints(points, true).strokePoints(points, true);
        g.lineStyle(1, color).strokeCircle(enemy.x, enemy.y, radius * 0.65);
      } else if (enemy.kind === 'volatile') {
        g.fillCircle(enemy.x, enemy.y, 13).strokeCircle(enemy.x, enemy.y, 13);
      } else if (enemy.kind === 'grunt') {
        g.fillRect(enemy.x - 12, enemy.y - 12, 24, 24).strokeRect(enemy.x - 12, enemy.y - 12, 24, 24);
      } else {
        const points = [{ x: enemy.x, y: enemy.y - 16 }, { x: enemy.x + 14, y: enemy.y },
          { x: enemy.x, y: enemy.y + 16 }, { x: enemy.x - 14, y: enemy.y }];
        g.fillPoints(points, true).strokePoints(points, true);
      }
      g.fillStyle(color).fillCircle(enemy.x + Math.cos(enemy.angle) * 6, enemy.y + Math.sin(enemy.angle) * 6, 3);
      for (let i = 0; i < enemy.rupture; i++) g.fillStyle(0x6bf3d0).fillCircle(enemy.x - 8 + i * 8, enemy.y - 31, 2);
      g.fillStyle(0x18202c).fillRect(enemy.x - 16, enemy.y - 24, 32, 3);
      g.fillStyle(color).fillRect(enemy.x - 16, enemy.y - 24, 32 * enemy.hp / enemy.maxHp, 3);
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
    for (const impact of world.impacts) {
      if (impact.kind === 'chargedBlast' || impact.kind === 'chargedHit') { drawChargedImpact(g, impact); continue; }
      const fade = impact.life / 0.18;
      if (impact.kind) {
        const heavy = impact.kind === 'heavy';
        const spread = (heavy ? 32 : 20) * (1 - fade);
        const angle = impact.angle ?? 0;
        // Contact sparks travel along the blow, with a sharp cross-cut on impact.
        g.lineStyle(heavy ? 3 : 2, impact.color, fade);
        for (let i = -2; i <= 2; i++) {
          const a = angle + i * 0.65;
          const start = 3 + spread;
          const end = start + (heavy ? 14 : 8) * fade;
          g.lineBetween(impact.x + Math.cos(a) * start, impact.y + Math.sin(a) * start,
            impact.x + Math.cos(a) * end, impact.y + Math.sin(a) * end);
        }
        const cut = (heavy ? 16 : 9) * fade;
        g.lineStyle(2, 0xffffff, fade).lineBetween(impact.x - Math.sin(angle) * cut, impact.y + Math.cos(angle) * cut,
          impact.x + Math.sin(angle) * cut, impact.y - Math.cos(angle) * cut);
      } else g.lineStyle(2, impact.color, fade).strokeCircle(impact.x, impact.y, 4 + (1 - fade) * (impact.radius ?? 22));
    }
  }

  private drawSector(g: Phaser.GameObjects.Graphics, x: number, y: number, radius: number, angle: number, arc: number): void {
    g.beginPath().moveTo(x, y).arc(x, y, radius, angle - arc / 2, angle + arc / 2).closePath().fillPath().strokePath();
  }

  private drawArena(): void {
    const floor = this.add.graphics();
    floor.fillStyle(0x090d19).fillRect(0, 0, ARENA.width, ARENA.height);
    floor.fillStyle(0x0d1421).fillRoundedRect(64, 64, 1472, 872, 32);
    floor.lineStyle(1, 0x263646, 0.3);
    for (let x = 96; x < ARENA.width - 64; x += 48) floor.lineBetween(x, 80, x, 920);
    for (let y = 96; y < ARENA.height - 64; y += 48) floor.lineBetween(80, y, 1520, y);
    floor.lineStyle(2, 0x548b85, 0.45).strokeRoundedRect(64, 64, 1472, 872, 32);
    floor.lineStyle(1, 0x293d50).strokeRoundedRect(76, 76, 1448, 848, 24);

    const cx = ARENA.width / 2;
    const cy = ARENA.height / 2;
    for (const radius of [110, 118, 252, 260]) {
      floor.lineStyle(1, 0x4a776e, radius < 120 ? 0.3 : 0.22).strokeCircle(cx, cy, radius);
    }
    floor.lineStyle(1, 0x668b85, 0.25);
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      floor.lineBetween(cx + Math.cos(angle) * 120, cy + Math.sin(angle) * 120,
        cx + Math.cos(angle) * 244, cy + Math.sin(angle) * 244);
      const x = cx + Math.cos(angle) * 260;
      const y = cy + Math.sin(angle) * 260;
      floor.fillStyle(0x4c8c80, 0.7).fillCircle(x, y, 3);
    }
    floor.lineStyle(1, 0x5d798f, 0.22).strokePoints([
      { x: cx, y: cy - 180 }, { x: cx + 180, y: cy },
      { x: cx, y: cy + 180 }, { x: cx - 180, y: cy },
    ], true);
    for (const x of [100, ARENA.width - 100]) {
      for (const y of [100, ARENA.height - 100]) {
        floor.fillStyle(0x6bf3d0, 0.07).fillCircle(x, y, 30);
        floor.lineStyle(2, 0x6bf3d0, 0.65).strokeRect(x - 6, y - 6, 12, 12);
      }
    }
  }
}
