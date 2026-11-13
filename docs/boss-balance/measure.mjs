// Controlled boss-only fixtures, not player win rates or full-run balance acceptance.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const [root, output] = process.argv.slice(2);
const load = file => import(pathToFileURL(`${root}/${file}.js`));
const { CombatWorld } = await load('game/combat');
const { RunDirector } = await load('game/run');
const { defaultProfile, mutationPool, cursePool } = await load('game/progression');
const { autoplayInput } = await load('harnessAutoplay');
const { BOSS_PLAYTEST } = await load('game/config/playtests');
const { BOSS_ATTACK, BOSS_PHASE, BOSS_DAMAGE } = await load('game/config/balance');
const builds = {
  counter: { mutations: BOSS_PLAYTEST.mutations, curses: BOSS_PLAYTEST.curses },
  sustain: { mutations: ['bloodReclaimer', 'catalyst', 'echoChamber', 'kineticBattery'], curses: ['parasiticMark'] },
  tank: { mutations: ['aegisCore', 'guardBreaker', 'ironReversal', 'kineticBattery'], curses: ['ironOath'] },
  ranged: { mutations: ['detonationSpecialist', 'echoChamber', 'catalyst', 'kineticBattery'], curses: ['glassSoul'] },
};
const reports = [];
for (const [build, config] of Object.entries(builds))
for (const phase of [1, 2]) for (const startingHp of [60, 100])
for (const policy of ['autoplay', 'delayed', 'stationary']) for (const layout of [0, 1, 2]) {
  const w = new CombatWorld({ x: [800, 180, 1420][layout], y: 500, angle: 0 });
  w.practice = false; w.enemies = []; w.mutations = [...config.mutations]; w.setCurses(config.curses);
  w.hp = Math.min(startingHp, w.maxHp);
  w.spawnEnemy('boss', undefined, layout * 2.1);
  const b = w.enemies[0];
  if (phase === 2) { b.hp = b.maxHp / 2; b.enraged = true; }
  let input, ticks = 0, phase2At = phase === 2 ? 0 : null, hits = 0, damage = 0;
  const hurt = w.hurt.bind(w);
  w.hurt = (...args) => {
    const hp = w.hp, barrier = w.barrier.value;
    hurt(...args);
    const loss = hp - w.hp + barrier - w.barrier.value;
    if (loss > 0) { hits++; damage += loss; }
  };
  // Boss arrives around 222–242s; give 60s simulation time, excluding hitstop/transform.
  let simulationSeconds = 0;
  for (; ticks < 7200 && simulationSeconds < 60 && w.hp > 0 && !w.bossSlain; ticks++) {
    if (!input || policy !== 'delayed' || ticks % 18 === 0) input = autoplayInput(w, ticks);
    if (policy === 'stationary') input = { ...input, dx: 0, dy: 0, dash: false };
    if (policy === 'delayed') input = { ...input, specialAim: { ...input.specialAim } };
    if (w.hitstop <= 0 && !w.bossTransforming) simulationSeconds += 1 / 60;
    w.step(input, 1 / 60);
    if (phase2At === null && b.enraged) phase2At = simulationSeconds;
  }
  reports.push({ build, phase, startingHp, policy, layout, result: w.bossSlain ? 'victory' : w.hp <= 0 ? 'slain' : 'timeout',
    seconds: +simulationSeconds.toFixed(3), phase2At, hp: w.hp, bossHp: Math.max(0, b.hp), hits, damage });
}
// No-build stationary combo probe: force slam release, then followup through real stepBoss/hurt.
const w = new CombatWorld({ x: 800, y: 500, angle: 0 });
w.practice = false; w.enemies = []; w.spawnEnemy('boss');
const b = w.enemies[0];
Object.assign(b, { x: 800, y: 500, hp: 1200, enraged: true, windup: 1 / 120, attackAction: 2,
  targetX: 800, targetY: 500, leapFromX: 800, leapFromY: 500 });
const idle = { dx: 0, dy: 0, melee: false, shoot: false, heavy: false, dash: false };
let afterSlam, afterFollowup;
for (let tick = 0; tick < 180; tick++) {
  // Reposition only this geometry probe to ensure both attacks connect despite knockback.
  w.player.x = b.x; w.player.y = b.y;
  w.step(idle, 1 / 60);
  if (tick === 0) afterSlam = w.hp;
  if (b.comboFinish === false && b.action === 2) { afterFollowup = w.hp; break; }
}
const summary = {};
for (const policy of ['autoplay', 'delayed', 'stationary']) for (const phase of [1, 2]) {
  const rows = reports.filter(r => r.policy === policy && r.phase === phase);
  summary[`${policy}-phase${phase}`] = { runs: rows.length, wins: rows.filter(r => r.result === 'victory').length,
    timeouts: rows.filter(r => r.result === 'timeout').length };
}
const fullRuns = [];
for (const seed of [17, 808, 2026]) {
  const w = new CombatWorld({ x: 800, y: 500, angle: 0 }), r = new RunDirector(w);
  const profile = defaultProfile();
  r.seedOverride = seed; r.mutationPool = mutationPool(profile); r.cursePool = cursePool(profile); r.start();
  let phase2At = null, bossAt = null;
  const drafts = [];
  for (let tick = 0; tick < 36000 && !r.result; tick++) {
    r.step(autoplayInput(w, tick), 1 / 60);
    if (r.bossDue && bossAt === null) bossAt = r.elapsed;
    if (w.enemies.some(e => e.kind === 'boss' && e.enraged) && phase2At === null) phase2At = r.elapsed;
    if (r.draft.length) { drafts.push(r.draft[0].id); if (!r.choose(0)) throw Error('Draft failed'); }
  }
  fullRuns.push({ seed, result: r.result, reason: r.reason, time: r.elapsed, bossAt, phase2At, hp: w.hp, drafts,
    bossHp: w.enemies.find(e => e.kind === 'boss')?.hp ?? (w.bossSlain ? 0 : null) });
}
fs.writeFileSync(output, JSON.stringify({ method: '144 paired boss-only fixtures: 4 granted builds × 2 phases × 2 HP × 3 policies × 3 layouts. Phase2 starts at half boss HP with fresh cooldowns; no mobs, progression, Legacy, Anomaly or Ascension. Autoplay is a machine control; delayed samples input and aim every 300ms. Stationary is stress. Not full runs, human reaction or population win rates.',
  fullRunMethod: '3 seeds, real RunDirector + unchanged autoplay, naturally sampled drafts choosing offer0, fresh-profile pools fixed at start. No Progression.observe pool updates, no Legacy/Anomaly/Ascension; not end-to-end browser runs.',
  fullRuns, config: { BOSS_ATTACK, BOSS_PHASE, BOSS_DAMAGE }, comboProbe: { afterSlam, afterFollowup }, summary, reports }, null, 2) + '\n');
console.log(output.split('/').at(-1), JSON.stringify(summary), 'combo', afterSlam, afterFollowup,
  'full', fullRuns.map(r => `${r.seed}:${r.result}@${r.time.toFixed(2)}:${r.bossHp}`).join(' '));
