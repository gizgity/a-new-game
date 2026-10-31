import { CombatWorld, type CombatInput } from './combat.js';
import { ARENA } from './movement.js';

/** A separate practice session: real combat, no RunDirector/rewards/drafts. */
export class Tutorial {
  stepIndex = 0;
  complete = false;
  private distance = 0;
  constructor(readonly world: CombatWorld) { this.resetStage(); }

  private resetStage(): void {
    this.world.reset();
    this.world.practice = false;
    this.world.enemies = [];
    if (this.stepIndex > 0) this.target();
  }
  private target(): void {
    this.world.spawnEnemy('grunt');
    const enemy = this.world.enemies[this.world.enemies.length - 1];
    enemy.x = Math.min(ARENA.width - 90, this.world.player.x + 80);
    enemy.y = this.world.player.y;
  }
  step(input: CombatInput, dt: number): void {
    if (this.complete) return;
    const { x, y } = this.world.player;
    const detonations = this.world.detonations, heavy = this.world.heavyCharges, dashes = this.world.stats.dashes;
    this.world.step(input, dt);
    // Let the final dash visibly finish before showing its completion screen.
    if (this.stepIndex === 5) {
      this.complete = this.world.dashTime <= 0;
      return;
    }
    this.distance += Math.hypot(this.world.player.x - x, this.world.player.y - y);
    const correct = [
      this.distance >= 65 && !!(input.dx || input.dy),
      this.world.enemies.some(enemy => enemy.rupture > 0),
      this.world.detonations > detonations && this.world.audioEvents.some(event => event.cue === 'shotHit'),
      this.world.heavyCharges < heavy,
      this.world.stats.dashes > dashes,
    ][this.stepIndex];
    if (correct) {
      this.stepIndex++;
      // Keep the melee mark so the next step can detonate it with a real shot.
      if (this.stepIndex < 5 && this.stepIndex !== 2) this.resetStage();
      this.world.clearInput();
    } else if (this.world.hp <= 0) this.resetStage();
    else if (this.stepIndex > 0 && !this.world.enemies.length) this.target();
  }
}
