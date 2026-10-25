import { ENEMY_HP, OPENING, WAVES, ENEMY_GROWTH, DRAFT_MILESTONES, ENCOUNTERS } from './config/balance.js';
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
  private waveIndex = 0;
  private pressureTime = 0;
  private previousKills = 0;
  mutationPool: readonly MutationId[] = MUTATIONS;
  cursePool: readonly CurseId[] = CURSES;

  constructor(readonly world: CombatWorld) {}
  get elapsed(): number { return this.ticks / 60; }
  get nextDraft() { return DRAFT_MILESTONES[this.draftIndex] ?? null; }
  get nextDraftKills(): number | null { return this.nextDraft?.kills ?? null; }
  private reached(milestone: { kills: number; seconds: number }): boolean {
    return this.world.kills >= milestone.kills || this.ticks >= milestone.seconds * 60;
  }

  start(): void {
    this.world.reset();
    this.world.practice = false;
    this.world.enemies = [];
    this.pressureTime = this.previousKills = 0;
    this.ticks = this.draftIndex = this.spawnTicks = this.waveIndex = 0;
    for (let i = 0; i < OPENING.initialCount; i++) {
      this.spawnCommon(i === OPENING.initialCount - 1 ? 'archer' : 'grunt',
        Math.floor(i / WAVES.packSize) * 2.39996 + (i % WAVES.packSize - 1) * WAVES.packSpread);
    }
    this.expired = this.bossDue = this.eliteSpawned = false;
    this.result = this.reason = null;
    this.draft = [];
  }

  step(input: CombatInput, dt: number): void {
    if (this.draft.length || this.result || this.expired) return;
    const frozen = this.world.hitstop > 0;
    this.world.step(input, dt);
    if (this.world.kills !== this.previousKills) this.pressureTime = 0;
    else if (!frozen && !this.bossDue) this.pressureTime += dt;
    this.previousKills = this.world.kills;
    this.ticks++;
    // Đánh giá sau toàn bộ simulation tick: mutual kill vẫn thắng trước deadline.
    if (this.world.bossSlain && this.ticks < 18000) this.result = 'victory';
    else if (this.world.hp <= 0 || this.ticks >= 18000) {
      this.result = 'defeat';
      this.reason = this.ticks >= 18000 ? 'deadline' : 'slain';
    }
    if (this.result) { this.expired = this.ticks >= 18000; return; }
    // Resolve earned choices before an encounter, even when one chain crosses several milestones.
    while (this.nextDraft && this.reached(this.nextDraft)) {
      this.draftKind = this.nextDraft.kind;
      this.draft = this.draftKind === 'curse' ? curseDraft(this.cursePool) :
        mutationDraft(this.world.mutations, this.world.stats, this.world.detonations, this.mutationPool);
      // Always offer keeping the current Curse; alternatives replace it, never stack.
      if (this.draftKind === 'curse' && this.world.curse && !this.draft.some(option => option.id === this.world.curse)) {
        this.draft = [{ id: this.world.curse, role: 'curseChoice' }, ...this.draft.slice(0, 2)];
      }
      this.draftIndex++;
      if (this.draft.length) return;
    }
    if (!this.bossDue && this.reached(ENCOUNTERS.boss)) {
      this.world.enemies = this.world.enemies.filter((enemy) => enemy.kind === 'bulwark');
      this.world.projectiles = [];
      this.world.spawnEnemy('boss');
      this.bossDue = true;
      this.eliteSpawned = true; // No late Elite joining an early Boss encounter.
    } else if (!this.bossDue && !this.eliteSpawned && this.reached(ENCOUNTERS.elite)) {
      this.world.spawnEnemy('bulwark', undefined, undefined, this.enemyGrowth); this.eliteSpawned = true;
    }
    this.expired = this.ticks >= 18000;
    this.spawnTicks++;
    const blend = this.openingBlend;
    const standardInterval = Math.max(35, 95 - Math.floor(this.elapsed / 4));
    const interval = Math.round(OPENING.spawnIntervalTicks + (standardInterval - OPENING.spawnIntervalTicks) * blend);
    const cap = this.bossDue ? 7 : Math.floor(OPENING.enemyCap + (18 - OPENING.enemyCap) * blend);
    const pressureWave = !this.bossDue && this.world.enemies.length >= cap && this.pressureTime + 1e-9 >= WAVES.pressureInterval;
    if (this.spawnTicks >= interval && (this.world.enemies.length < cap || pressureWave)) {
      if (pressureWave) this.pressureTime = 0;
      this.spawnTicks = 0;
      const index = this.waveIndex++;
      const count = pressureWave ? WAVES.packSize : Math.min(this.bossDue ? 1 : WAVES.packSize, cap - this.world.enemies.length);
      for (let i = 0; i < count; i++) {
        const special = i === count - 1;
        const archerRoom = this.world.enemies.filter(enemy => enemy.kind === 'archer').length < WAVES.archerCap;
        const archerCount = this.world.enemies.filter(enemy => enemy.kind === 'archer').length;
        const pressureArcher = pressureWave && i < 2 && archerCount < WAVES.pressureArcherCap;
        const bossArcher = this.bossDue && archerCount < 2;
        const kind = pressureArcher || bossArcher ? 'archer' : special && this.elapsed > 45 && index % 6 === 5 ? 'volatile'
          : special && index % 4 === 3 && archerRoom ? 'archer' : 'grunt';
        this.spawnCommon(kind, index * 2.39996 + (i - (count - 1) / 2) * WAVES.packSpread);
      }
    }
  }

  private get openingBlend(): number {
    return Math.max(0, Math.min(1, (this.ticks - OPENING.durationTicks) / (OPENING.rampEndTicks - OPENING.durationTicks)));
  }

  private get enemyGrowth(): number {
    return Math.max(0, Math.min(1, (this.elapsed - ENEMY_GROWTH.startSeconds) / (ENEMY_GROWTH.endSeconds - ENEMY_GROWTH.startSeconds)));
  }

  private spawnCommon(kind: 'grunt' | 'archer' | 'volatile', angle: number): void {
    const baseHp = OPENING.hp[kind] + (ENEMY_HP[kind] - OPENING.hp[kind]) * this.openingBlend;
    const hp = Math.round(baseHp * (1 + this.enemyGrowth * (ENEMY_GROWTH.health - 1)));
    this.world.spawnEnemy(kind, hp, angle, this.enemyGrowth);
  }

  choose(index: number): boolean {
    const option = this.draft[index];
    if (!option || !Number.isInteger(index)) return false;
    if (this.draftKind === 'mutation') this.world.mutations.push(option.id as MutationId);
    else this.world.curse = option.id as CurseId;
    this.world.hp = Math.min(this.world.maxHp, this.world.hp + (this.world.curse === 'parasiticMark' ? 5 : 10));
    this.draft = [];
    return true;
  }
}
