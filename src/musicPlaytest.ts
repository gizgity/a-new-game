import type { ArenaScene } from './game/ArenaScene';
import { t } from './i18n';
/** Explicit memory-only fixture. main's buildTrial guard disables progression writes. */
export function musicPlaytest(arena: ArenaScene): void {
  const panel = document.createElement('nav');
  panel.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;padding:4px';
  const stages = ['early', 'tension', 'anomaly', 'boss', 'enraged', 'victory', 'defeat'] as const;
  const select = (stage: typeof stages[number]) => {
    if (arena.phase === 'ready' || arena.phase === 'victory' || arena.phase === 'defeat') arena.setPhase('playing');
    arena.combat.enemies = []; arena.run.draft = []; arena.run.anomalyPending = false;
    arena.run.ticks = stage === 'early' ? 0 : 60 * 60;
    arena.combat.anomaly.reset();
    // Grants only in this fixture; normal mapping reads accepted selection in world.anomaly.active.
    if (stage === 'anomaly') arena.combat.anomaly.equip('fracturedStorm');
    if (stage === 'boss' || stage === 'enraged') {
      arena.combat.spawnEnemy('boss', 2400);
      const boss = arena.combat.enemies.at(-1)!; boss.enraged = stage === 'enraged';
    }
    arena.setPhase(stage === 'victory' || stage === 'defeat' ? stage : 'playing');
  };
  for (const stage of stages) {
    const button = document.createElement('button'); button.textContent = t(`music_${stage}`);
    button.style.cssText = 'min-height:44px;min-width:44px';
    button.dataset.music = stage; button.onclick = () => select(stage); panel.append(button);
  }
  document.querySelector('#app')?.prepend(panel);
  Object.defineProperty(window, 'musicFixture', { value: { arena, select, stats: () => arena.musicStats() }, configurable: true });
}
