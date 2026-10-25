import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { ENEMY_ATTACK, BOSS_ATTACK } from '../.test-build/config/balance.js';
const idle = { dx: 0, dy: 0, melee: false, shoot: false, heavy: false, dash: false };
const dt = 1 / 60;
function setup(kind, distance = 55) {
  const w = new CombatWorld({ x: 800, y: 500, angle: 0 });
  w.practice = false; w.enemies = []; w.spawnEnemy(kind);
  const e = w.enemies[0]; Object.assign(e, { x: 800 + distance, y: 500, cooldown: 0 });
  return { w, e };
}
function step(w, seconds) { for (let i = 0; i < Math.ceil(seconds / dt); i++) w.step(idle, dt); }

test('common locks aim and position through windup, hits once, then stands in recovery', () => {
  for (const kind of ['grunt', 'bulwark']) {
    const { w, e } = setup(kind, kind === 'archer' ? 300 : 55);
    w.step(idle, dt); const { x, y, angle } = e;
    assert.equal(e.windupDuration, ENEMY_ATTACK[kind].windup);
    w.player.y += 170; step(w, e.windupDuration + dt);
    assert.equal(e.x, x); assert.equal(e.y, y); assert.equal(e.angle, angle);
    assert.ok(e.recovery > 0); assert.equal(w.hp, 100);
    const shots = w.projectiles.length; step(w, 0.1);
    assert.equal(e.x, x); assert.equal(e.y, y); assert.ok(w.projectiles.length <= shots);
    step(w, 2); assert.ok(e.x !== x || e.y !== y);
  }
});

test('Bulwark reaches 100px, Perfect cue uses same geometry, recovery opens armor', () => {
  const { w, e } = setup('bulwark', 85);
  w.step(idle, dt); e.windup = 0.1;
  assert.ok(w.isImminentEnemyThreat(e));
  step(w, 0.11); assert.equal(w.hp, 78); assert.ok(e.recovery > 0);
  w.hitstop = 0;
  const before = e.hp;
  w.projectiles.push({ x: e.x - 20, y: e.y, vx: 850, vy: 0, hostile: false, life: 1 });
  w.step(idle, dt); assert.equal(before - e.hp, 20);
  // Closed armor returns after recovery, including under basic-shot pressure.
  step(w, 1); e.stagger = 10; e.recovery = 0;
  const hp = e.hp; w.projectiles.push({ x: e.x - 20, y: e.y, vx: 850, vy: 0, hostile: false, life: 1 });
  w.step(idle, dt); assert.ok(Math.abs(hp - e.hp - 11) < 1e-8);
});

test('Boss keeps locked active pattern and target through stationary recovery; phase accelerates next windup', () => {
  for (const action of [0, 1, 2]) {
    const { w, e } = setup('boss', 180); e.action = action;
    w.step(idle, dt); const { x, y, targetX, targetY, angle } = e;
    w.player.y += 180; e.hp = e.maxHp / 2 - 1;
    assert.equal(e.windupDuration, BOSS_ATTACK.windup);
    step(w, BOSS_ATTACK.windup + dt);
    assert.equal(e.attackAction, action); assert.equal(e.action, (action + 1) % 3);
    assert.ok(e.active > 0); assert.ok(e.recovery > 0);
    step(w, 0.1);
    assert.deepEqual([e.x, e.y, e.angle, e.targetX, e.targetY], [x, y, angle, targetX, targetY]);
    step(w, BOSS_ATTACK.enragedCooldown); assert.equal(e.windupDuration, BOSS_ATTACK.enragedWindup);
  }
});

test('Volatile fuse stays at its locked location; fleeing the marked circle avoids damage', () => {
  const { w, e } = setup('volatile', 65);
  w.step(idle, dt); const x = e.x;
  w.player.y += 150; step(w, 0.72);
  assert.equal(e.x, x); assert.equal(w.hp, 100); assert.equal(w.enemies.length, 0);
});

test('Archer tracks player throughout windup including stagger, then projectile keeps release heading',()=>{
 const {w,e}=setup('archer',300);w.step(idle,dt);const {x,y}=e;
 w.player.y+=120;w.step(idle,dt);assert.equal(e.angle,Math.atan2(w.player.y-e.y,w.player.x-e.x));
 e.stagger=.1;w.player.y-=250;w.step(idle,dt);assert.equal(e.angle,Math.atan2(w.player.y-e.y,w.player.x-e.x));
 e.stagger=0;e.windup=dt/2;w.step(idle,dt);const shot=w.projectiles[0];assert.ok(shot);
 assert.ok(Math.abs(Math.atan2(shot.vy,shot.vx)-e.angle)<1e-9);const heading=[shot.vx,shot.vy];
 w.player.y+=300;w.step(idle,dt);assert.deepEqual([shot.vx,shot.vy],heading);assert.deepEqual([e.x,e.y],[x,y]);
});

test('Boss cadence is faster in both phases while retaining a readable windup and recovery',()=>{
 assert.ok(BOSS_ATTACK.windup+BOSS_ATTACK.cooldown < .95+1.15);
 assert.ok(BOSS_ATTACK.enragedWindup+BOSS_ATTACK.enragedCooldown < .75+.8);
 for(const enraged of [false,true]) {
  const {w,e}=setup('boss',180);if(enraged)e.hp=e.maxHp*.4;
  w.step(idle,dt);assert.equal(e.windupDuration,enraged?BOSS_ATTACK.enragedWindup:BOSS_ATTACK.windup);
  assert.ok(e.windupDuration>.16);w.player.y+=300;
  step(w,e.windupDuration+dt);assert.ok(e.recovery>0);assert.equal(e.action,1);
 }
});
