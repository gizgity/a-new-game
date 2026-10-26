import { ENEMY_HP, OPENING, WAVES, ENEMY_GROWTH, DRAFT_MILESTONES, ENCOUNTERS, BOSS_PHASE } from './config/balance.js';
import { CombatWorld, type CombatInput } from './combat.js';
import { CURSES, MUTATIONS, type BuildId, type CurseId, type DraftOption, type MutationId } from './builds.js';

import { buildDraft, DraftRandom, newDraftSeed, type DraftDebug } from './Draft.js';
import { draftSignals, signalWindow } from './DraftSignals.js';

export class RunDirector {
  seedOverride: number | undefined;
  previousOffers: readonly BuildId[] = [];
  draftDebug: DraftDebug | null = null;
  private draftRandom = new DraftRandom(1);
  private lastSignals = draftSignals();
  private choices: BuildId[] = [];
  ticks = 0;
  draft: DraftOption[] = [];
  draftKind: 'mutation' | 'curse' = 'mutation';
  expired = false;
  result: 'victory' | 'defeat' | null = null;
  reason: 'slain' | 'deadline' | null = null;
  private eliteSpawned = false;
  bossDue = false;
  bossWarning = 0;
  private draftIndex = 0;
  private spawnTicks = 0;
  private waveIndex = 0;
  private pressureTime = 0;
  private previousKills = 0;
  private clearRate = 0;
  mutationPool: readonly MutationId[] = MUTATIONS;
  cursePool: readonly CurseId[] = CURSES;

  constructor(readonly world: CombatWorld) {}
  get elapsed(): number { return this.ticks / 60; }
  get nextDraft() { return DRAFT_MILESTONES[this.draftIndex] ?? null; }
  get nextDraftKills(): number | null { return this.nextDraft?.kills ?? null; }
  private reached(milestone: { kills: number; minSeconds: number; seconds: number }): boolean {
    return this.ticks >= milestone.minSeconds * 60
      && (this.world.kills >= milestone.kills || this.ticks >= milestone.seconds * 60);
  }

  start(): void {
    this.world.reset();
    this.draftRandom = new DraftRandom(this.seedOverride ?? newDraftSeed());
    this.lastSignals = draftSignals(); this.choices = []; this.draftDebug = null;
    this.world.practice = false;
    this.world.enemies = [];
    this.pressureTime = this.previousKills = this.clearRate = 0;
    this.ticks = this.draftIndex = this.spawnTicks = this.waveIndex = 0;
    for (let i = 0; i < OPENING.initialCount; i++) {
      this.spawnCommon(i === OPENING.initialCount - 1 ? 'archer' : 'grunt',
        Math.floor(i / WAVES.packSize) * 2.39996 + (i % WAVES.packSize - 1) * WAVES.packSpread);
    }
    this.bossWarning = 0;
    this.expired = this.bossDue = this.eliteSpawned = false;
    this.result = this.reason = null;
    this.draft = [];
  }

  step(input: CombatInput, dt: number): void {
    if (this.draft.length || this.result || this.expired) return;
    const frozen = this.world.hitstop > 0;
    this.world.step(input, dt);
    if (!frozen && !this.bossDue) {
      // Exponential decay avoids oscillation after a single chain or banking spawn debt.
      const decay = Math.exp(-dt / WAVES.clearWindow);
      this.clearRate = this.clearRate * decay + Math.max(0, this.world.kills - this.previousKills) / dt * (1 - decay);
    }
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
    if (this.result) { this.bossWarning = 0; this.expired = this.ticks >= 18000; return; }
    // Resolve earned choices before an encounter, even when one chain crosses several milestones.
    while (this.nextDraft && this.reached(this.nextDraft)) {
      this.draftKind = this.nextDraft.kind;
      const result = buildDraft({ opening: this.draftIndex === 0, kind: this.draftKind, owned: this.world.mutations, curses: this.world.curses,
        pool: this.draftKind === 'curse' ? this.cursePool : this.world.mutations.length < 4 ? this.mutationPool : [],
        signals: signalWindow(this.world.draftSignals, this.lastSignals), maxHp: this.world.maxHp,
        previousOffers: this.previousOffers, choices: this.choices }, this.draftRandom);
      this.draft = result.options; this.draftDebug = result.debug;
      this.draftIndex++;
      if (this.draft.length) { this.lastSignals = { ...this.world.draftSignals }; return; }
    }
    if (this.bossWarning > 0) {
      if (!frozen) this.bossWarning = Math.max(0, this.bossWarning - dt);
      if (this.bossWarning < 1e-9) {
        this.bossWarning = 0;
        this.world.enemies = this.world.enemies.filter(enemy => enemy.kind === 'bulwark');
        this.world.projectiles = [];
        this.world.spawnEnemy('boss');
        this.bossDue = true;
      }
      return; // No spawn debt or catch-up pack after arrival.
    }
    if (!this.bossDue && this.reached(ENCOUNTERS.boss)) {
      this.bossWarning = BOSS_PHASE.arrival;
      this.spawnTicks = 0;
      this.eliteSpawned = true;
      return;
    } else if (!this.bossDue && !this.eliteSpawned && this.reached(ENCOUNTERS.elite)) {
      this.world.spawnEnemy('bulwark', undefined, undefined, this.enemyGrowth); this.eliteSpawned = true;
    }
    this.expired = this.ticks >= 18000;
    if (frozen) return;
    this.spawnTicks++;
    const blend = this.openingBlend;
    const standardInterval = Math.max(35, 95 - Math.floor(this.elapsed / 4));
    const baseInterval = Math.round(OPENING.spawnIntervalTicks + (standardInterval - OPENING.spawnIntervalTicks) * blend);
    const clearBonus = !this.bossDue && this.elapsed >= WAVES.graceSeconds ? Math.max(0, this.clearRate - WAVES.clearThreshold) : 0;
    const interval = this.bossDue ? baseInterval : Math.max(WAVES.minIntervalTicks, Math.round(baseInterval / (1 + clearBonus)));
    const cap = this.bossDue ? 7 : OPENING.enemyCap + Math.min(WAVES.maxDensityBonus, Math.floor(clearBonus * WAVES.densityLead));
    const pressureWave = !this.bossDue && this.world.enemies.length >= cap && this.world.enemies.length < WAVES.hardCap && this.pressureTime + 1e-9 >= WAVES.pressureInterval;
    if (this.spawnTicks >= interval && (this.world.enemies.length < cap || pressureWave)) {
      if (pressureWave) this.pressureTime = 0;
      this.spawnTicks = 0;
      const index = this.waveIndex++;
      const count = pressureWave ? Math.min(WAVES.packSize, WAVES.hardCap - this.world.enemies.length) : Math.min(this.bossDue ? 1 : WAVES.packSize, cap - this.world.enemies.length);
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
    if (this.draftKind === 'mutation') {
      if (this.world.mutations.length >= 4 || this.world.mutations.includes(option.id as MutationId) || !this.mutationPool.includes(option.id as MutationId)) return false;
      this.world.mutations.push(option.id as MutationId);
    } else if (option.action !== 'keep' && !this.world.hasCurse(option.id as CurseId)) {
      if (!this.cursePool.includes(option.id as CurseId) || !this.world.addCurse(option.id as CurseId, option.replaceSlot)) return false;
    }
    this.choices.push(option.id);
    this.world.hp = Math.min(this.world.maxHp, this.world.hp + (this.world.hasCurse('parasiticMark') ? 5 : 10));
    this.draft = [];
    return true;
  }
}
