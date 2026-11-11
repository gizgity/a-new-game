import type { CombatInput } from './game/combat';
import { autoplayInput } from './harnessAutoplay';

// This separate entry enforces memory-only mode BEFORE importing the production bootstrap.
const query = new URLSearchParams(location.search);
query.set('playtest', query.get('playtest') === 'boss' ? 'boss' : 'harness');
query.set('draftSeed', '808');
history.replaceState(null, '', `${location.pathname}?${query}`);
const { arena, game } = await import('./main');
const ready = () => new Promise<void>(resolve => {
  const check = () => arena.sys.isActive() && !document.querySelector<HTMLButtonElement>('#primary')?.disabled
    ? resolve() : requestAnimationFrame(check);
  check();
});
await ready();
game.loop.stop();
// Focus in the sibling/toolbar must not pause this preview or restart Phaser's native loop.
for (const event of ['blur', 'focus', 'hidden', 'visible']) game.events.removeAllListeners(event);
let autoplay = true, paused = false, speed = 1, ticks = 0, elapsed = 0, debt = 0;
let previous = performance.now();
let decisionTicks = 0, intentTicks = 0;
const startRun = arena.run.start.bind(arena.run);
arena.run.start = () => { intentTicks = 0; arena.run.seedOverride = 808; startRun(); };
const stepRun = arena.run.step.bind(arena.run);
arena.run.step = (input: CombatInput, dt: number) => stepRun(autoplay ? autoplayInput(arena.combat, intentTicks++) : input, dt);
// Phaser Tweens use wall time by default. Keep their clock on the same fixed delta too.
arena.tweens.getDelta = () => 1000 / 60;
// Playback is visual review; mute native audio, whose transport is not time-stretched.
game.sound.mute = true;
function tick(): void {
  ticks++;
  elapsed += 1000 / 60;
  if (autoplay && ['draft', 'legacy', 'anomaly'].includes(arena.phase)) {
    if (++decisionTicks >= 45) {
      if (arena.phase === 'draft') { arena.chooseDraft(0); decisionTicks = 0; }
      else document.querySelector<HTMLButtonElement>('#draft-panel [data-choice]:not(:disabled)')?.click();
    }
  } else decisionTicks = 0;
  game.loop.delta = 1000 / 60;
  game.step(elapsed, 1000 / 60);
}
export const playback = {
  setSpeed(value: number) { if ([0.25, 0.5, 1].includes(value)) { speed = value; paused = false; debt = 0; previous = performance.now(); } },
  pause() { paused = true; debt = 0; },
  step() { paused = true; debt = 0; tick(); },
  setAutoplay(value: boolean) { autoplay = value; if (arena.phase === 'playing' || arena.phase === 'paused') arena.setPhase(arena.phase); arena.combat.clearInput(); decisionTicks = 0; },
  state: () => ({ autoplay, paused, speed, ticks, phase: arena.phase, runTicks: arena.run.ticks }),
};
Object.assign(window, { harnessPlayback: playback });
function frame(now: number): void {
  const delta = Math.min(100, now - previous); previous = now;
  if (!paused && !document.hidden) {
    debt += delta * speed;
    while (debt >= 1000 / 60) { debt -= 1000 / 60; tick(); }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
