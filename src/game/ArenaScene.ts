import Phaser from 'phaser';
import { ARENA, FIXED_STEP, movePlayer, type PlayerState } from './movement';

export type Phase = 'ready' | 'playing' | 'paused';

export class ArenaScene extends Phaser.Scene {
  readonly player: PlayerState = { x: ARENA.width / 2, y: ARENA.height / 2, angle: 0 };
  phase: Phase = 'ready';
  private body!: Phaser.GameObjects.Container;
  private reticle!: Phaser.GameObjects.Graphics;
  private keys!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private accumulator = 0;
  private aim = new Phaser.Math.Vector2();

  constructor(
    private readonly onPhaseChange: (phase: Phase) => void,
    private readonly onReady: () => void,
  ) {
    super('arena');
  }

  create(): void {
    this.drawArena();
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

    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as typeof this.keys;
    this.input.keyboard!.on('keydown-ESC', (event: KeyboardEvent) => {
      if (!event.repeat && this.phase !== 'ready') {
        this.setPhase(this.phase === 'playing' ? 'paused' : 'playing');
      }
    });
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
    this.onReady();
  }

  setPhase(phase: Phase): void {
    this.phase = phase;
    this.accumulator = 0;
    this.input.keyboard?.resetKeys();
    this.onPhaseChange(phase);
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

    // Giới hạn catch-up để tránh bước nhảy lớn sau frame bị treo.
    this.accumulator += Math.min(delta / 1000, 0.1);
    const dx = Number(this.keys.D.isDown) - Number(this.keys.A.isDown);
    const dy = Number(this.keys.S.isDown) - Number(this.keys.W.isDown);
    while (this.accumulator >= FIXED_STEP) {
      movePlayer(this.player, dx, dy, FIXED_STEP);
      this.accumulator -= FIXED_STEP;
    }

    const pointer = this.input.activePointer;
    if (this.input.isOver) {
      this.cameras.main.getWorldPoint(pointer.x, pointer.y, this.aim);
      this.player.angle = Math.atan2(this.aim.y - this.player.y, this.aim.x - this.player.x);
      this.reticle.setPosition(this.aim.x, this.aim.y);
    }
    this.body.setPosition(this.player.x, this.player.y);
    this.body.rotation = this.player.angle;
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
