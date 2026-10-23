import { CombatWorld, type CombatInput } from './combat.js';
import { CURSES, MUTATIONS, curseDraft, mutationDraft, type CurseId, type DraftOption, type MutationId } from './builds.js';

export class RunDirector {
  ticks = 0;
  draft: DraftOption[] = [];
  draftKind: 'mutation' | 'curse' = 'mutation';
  expired = false;
  result: 'victory' | 'defeat' | null = null;
  reason: 'slain' | 'deadline' | null = null;
  private eliteSpawned = false;
  bossDue = false;
  private draftIndex = 0;
  private spawnTicks = 0;
  mutationPool: readonly MutationId[] = MUTATIONS;
  cursePool: readonly CurseId[] = CURSES;

  constructor(readonly world: CombatWorld) {}
  get elapsed(): number { return this.ticks / 60; }

  start(): void {
    this.world.reset();
    this.world.practice = false;
    this.world.enemies = [];
    for (let i = 0; i < 6; i++) this.world.spawnEnemy(i % 3 === 2 ? 'archer' : 'grunt');
    this.ticks = this.draftIndex = this.spawnTicks = 0;
    this.expired = this.bossDue = this.eliteSpawned = false;
    this.result = this.reason = null;
    this.draft = [];
  }

  step(input: CombatInput, dt: number): void {
    if (this.draft.length || this.result || this.expired) return;
    this.world.step(input, dt);
    this.ticks++;
    // Đánh giá sau toàn bộ simulation tick: mutual kill vẫn thắng trước deadline.
    if (this.world.bossSlain && this.ticks < 18000) this.result = 'victory';
    else if (this.world.hp <= 0 || this.ticks >= 18000) {
      this.result = 'defeat';
      this.reason = this.ticks >= 18000 ? 'deadline' : 'slain';
    }
    if (this.result) { this.expired = this.ticks >= 18000; return; }
    if (this.draftIndex < 3 && this.ticks >= [3600, 7200, 10800][this.draftIndex]) {
      this.draftKind = this.draftIndex === 1 ? 'curse' : 'mutation';
      this.draft = this.draftKind === 'curse' ? curseDraft(this.cursePool) :
        mutationDraft(this.world.mutations, this.world.stats, this.world.detonations, this.mutationPool);
      this.draftIndex++;
    }
    if (!this.eliteSpawned && this.ticks >= 9000) {
      this.world.enemies = this.world.enemies.slice(0, 17);
      this.world.spawnEnemy('bulwark'); this.eliteSpawned = true;
    }
    if (!this.bossDue && this.ticks >= 14400) {
      this.world.enemies = this.world.enemies.filter((enemy) => enemy.kind === 'bulwark');
      this.world.projectiles = [];
      this.world.spawnEnemy('boss');
      this.bossDue = true;
    }
    this.expired = this.ticks >= 18000;
    this.spawnTicks++;
    const interval = Math.max(35, 95 - Math.floor(this.elapsed / 4));
    if (this.spawnTicks >= interval && this.world.enemies.length < (this.bossDue ? 7 : 18)) {
      this.spawnTicks = 0;
      const index = Math.floor(this.elapsed) % 6;
      this.world.spawnEnemy(this.elapsed > 45 && index === 5 ? 'volatile' : index % 3 === 2 ? 'archer' : 'grunt');
    }
  }

  choose(index: number): boolean {
    const option = this.draft[index];
    if (!option || !Number.isInteger(index)) return false;
    if (this.draftKind === 'mutation') this.world.mutations.push(option.id as MutationId);
    else this.world.curse = option.id as CurseId;
    this.world.hp = Math.min(this.world.maxHp, this.world.hp + 10);
    this.draft = [];
    return true;
  }
}
