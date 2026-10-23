import Phaser from 'phaser';
import { ProceduralAudio } from './audio';
import { RunDirector } from './run';
import { CombatWorld } from './combat';
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
  private body!: Phaser.GameObjects.Container;
  private reticle!: Phaser.GameObjects.Graphics;
  private keys!: Record<'W' | 'A' | 'S' | 'D' | 'SHIFT' | 'SPACE' | 'E' | 'Q', Phaser.Input.Keyboard.Key>;
  private accumulator = 0;
  private pendingDash = false;
  private aim = new Phaser.Math.Vector2();

  constructor(
    private readonly onPhaseChange: (phase: Phase) => void,
    private readonly onReady: () => void,
    private readonly onCombatChange: (combat: CombatWorld) => void,
  ) {
    super('arena');
  }

  create(): void {
    this.audio = new ProceduralAudio(this);
    this.drawArena();
    this.combatGraphics = this.add.graphics().setDepth(1);
    const shadow = this.add.graphics().fillStyle(0x000000, 0.4).fillEllipse(0, 9, 36, 16);
    const shape = this.add.graphics();
    shape.lineStyle(1, 0x6bf3d0, 0.18).strokeCircle(0, 0, 25);
    shape.fillStyle(0x173e40).fillPoints([
      { x: 0, y: -16 }, { x: 16, y: 0 }, { x: 0, y: 16 }, { x: -16, y: 0 },
    ], true);
    shape.lineStyle(2, 0x6bf3d0).strokePoints([
      { x: 0, y: -16 }, { x: 16, y: 0 }, { x: 0, y: 16 }, { x: -16, y: 0 },
    ], true);
    shape.fillStyle(0xe5fff7).fillRect(-5, -5, 10, 10);
    shape.fillStyle(0x6bf3d0).fillTriangle(25, -5, 33, 0, 25, 5);
    this.body = this.add.container(this.player.x, this.player.y, [shadow, shape]).setDepth(2);
    this.reticle = this.add.graphics().setDepth(3).setVisible(false);
    this.reticle.lineStyle(1, 0x91ffe0, 0.8).strokeCircle(0, 0, 7);
    for (const sign of [-1, 1]) {
      this.reticle.lineBetween(sign * 10, 0, sign * 15, 0);
      this.reticle.lineBetween(0, sign * 10, 0, sign * 15);
    }

    this.keys = this.input.keyboard!.addKeys('W,A,S,D,SHIFT,SPACE,E,Q') as typeof this.keys;
    this.input.keyboard!.on('keydown-ESC', (event: KeyboardEvent) => {
      if (!event.repeat && (this.phase === 'playing' || this.phase === 'paused')) {
        this.setPhase(this.phase === 'playing' ? 'paused' : 'playing');
      }
    });
    this.input.keyboard!.addCapture(['SPACE', 'SHIFT']);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.phase !== 'playing') return;
      this.meleeHeld = pointer.leftButtonDown();
      this.shootHeld = pointer.rightButtonDown();
    });
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.meleeHeld = pointer.leftButtonDown();
      this.shootHeld = pointer.rightButtonDown();
    });
    this.input.on('gameout', () => { this.meleeHeld = this.shootHeld = false; });
    this.input.mouse!.disableContextMenu();
    this.cameras.main.setBounds(0, 0, ARENA.width, ARENA.height);
    this.cameras.main.startFollow(this.body, true, 0.12, 0.12);
    this.resize(this.scale.gameSize);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this);
    this.game.events.on(Phaser.Core.Events.BLUR, this.handleBlur, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.resize, this);
      this.game.events.off(Phaser.Core.Events.BLUR, this.handleBlur, this);
    });
    this.drawCombat();
    this.onCombatChange(this.combat);
    this.onReady();
  }

  setPhase(phase: Phase): void {
    if (phase === 'playing' && (this.phase === 'ready' || this.phase === 'victory' || this.phase === 'defeat')) {
      this.run.start();
      this.body.setPosition(this.player.x, this.player.y);
      this.cameras.main.centerOn(this.player.x, this.player.y);
    }
    this.meleeHeld = this.shootHeld = false;
    this.phase = phase;
    this.accumulator = 0;
    this.pendingDash = false;
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
    this.cameras.main.setZoom(Math.min(size.width / 1120, size.height / 700));
  }

  update(_time: number, delta: number): void {
    this.reticle.setVisible(this.phase === 'playing' && this.input.isOver);
    if (this.phase !== 'playing') return;

    const pointer = this.input.activePointer;
    if (this.input.isOver) {
      this.cameras.main.getWorldPoint(pointer.x, pointer.y, this.aim);
      this.player.angle = Math.atan2(this.aim.y - this.player.y, this.aim.x - this.player.x);
      this.reticle.setPosition(this.aim.x, this.aim.y);
    }
    // Giới hạn catch-up; mọi cooldown và AI dùng cùng simulation 60Hz.
    this.accumulator += Math.min(delta / 1000, 0.1);
    const input = {
      dx: Number(this.keys.D.isDown) - Number(this.keys.A.isDown),
      dy: Number(this.keys.S.isDown) - Number(this.keys.W.isDown),
      melee: this.meleeHeld && this.input.isOver,
      shoot: this.shootHeld && this.input.isOver,
      heavy: this.keys.SHIFT.isDown,
      charged: this.keys.E.isDown,
      ultimate: this.keys.Q.isDown,
      dash: Phaser.Input.Keyboard.JustDown(this.keys.SPACE),
    };
    // Không mất Space ở frame chưa đủ một simulation tick.
    this.pendingDash ||= input.dash;
    while (this.accumulator >= FIXED_STEP) {
      input.dash = this.pendingDash;
      const frozen = this.combat.hitstop > 0;
      this.run.step(input, FIXED_STEP);
      this.audio.play(this.combat.soundEvents);
      if (!frozen) this.pendingDash = false;
      this.accumulator -= FIXED_STEP;
      if (this.run.result) { this.setPhase(this.run.result); break; }
      if (this.run.draft.length) { this.setPhase('draft'); break; }
    }
    this.drawCombat();
    this.onCombatChange(this.combat);
    this.body.alpha = this.combat.invulnerable > 0 ? 0.6 + 0.4 * Math.cos(_time * 0.04) : 1;
    this.body.setPosition(this.player.x, this.player.y);
    this.body.rotation = this.player.angle;
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
      const color = shot.hostile ? 0xc399ff : shot.charged ? 0xffcc80 : 0x9dffe2;
      g.lineStyle(shot.hostile ? 3 : 2, color, 0.65);
      const speed = Math.hypot(shot.vx, shot.vy) || 1;
      g.lineBetween(shot.x, shot.y, shot.x - shot.vx / speed * 16, shot.y - shot.vy / speed * 16);
      g.fillStyle(color).fillCircle(shot.x, shot.y, shot.hostile || shot.charged ? 5 : 3);
    }
    if (this.cosmetic === 'prism') g.lineStyle(1, 0xc399ff, 0.8).strokeRect(this.player.x - 22, this.player.y - 22, 44, 44);
    const attack = world.attack;
    if (attack) {
      const active = attack.age >= attack.windup;
      const color = attack.heavy ? 0xffcc80 : 0x9dffe2;
      g.fillStyle(color, active ? 0.22 : 0.07);
      g.lineStyle(active ? 3 : 1, color, active ? 0.9 : 0.35);
      this.drawSector(g, this.player.x, this.player.y, attack.range, attack.angle, attack.arc);
    }
    if (world.dashTime > 0) {
      for (let i = 1; i <= 3; i++) {
        g.lineStyle(2, 0x6bf3d0, 0.5 / i).strokeCircle(this.player.x - Math.cos(world.dashAngle) * i * 18,
          this.player.y - Math.sin(world.dashAngle) * i * 18, 16);
      }
    }
    if (world.perfectFlash > 0) {
      g.lineStyle(2, 0x9dffe2, world.perfectFlash / 0.65).strokeCircle(this.player.x, this.player.y,
        28 + (0.65 - world.perfectFlash) * 45);
    }
    if (world.surgeFlash > 0) g.lineStyle(4, 0x9dffe2, world.surgeFlash / 0.6).strokeCircle(this.player.x, this.player.y, 280 * (1 - world.surgeFlash / 0.6));
    if (world.hurtFlash > 0) g.lineStyle(3, 0xff6f87).strokeCircle(this.player.x, this.player.y, 23);
    for (const impact of world.impacts) {
      g.lineStyle(2, impact.color, impact.life / 0.18).strokeCircle(impact.x, impact.y, 4 + (1 - impact.life / 0.18) * (impact.radius ?? 22));
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
