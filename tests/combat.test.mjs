import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld, COMBAT, segmentHitsCircle } from '../.test-build/combat.js';
import { FIXED_STEP, ARENA, PLAYER_RADIUS } from '../.test-build/movement.js';

const idle = { dx: 0, dy: 0, melee: false, shoot: false, heavy: false, dash: false };
function world() {
  const result = new CombatWorld({ x: 0, y: 0, angle: 0 });
  for (const enemy of result.enemies) enemy.stagger = 100;
  return result;
}
function advance(state, seconds, input = idle) {
  for (let i = 0; i < Math.round(seconds / FIXED_STEP); i++) state.step(input, FIXED_STEP);
}
function target(state, x = state.player.x + 65, y = state.player.y) {
  const enemy = state.enemies[0];
  Object.assign(enemy, { x, y, hp: 500, maxHp: 500 });
  return enemy;
}
function hostileAtNextDashPosition(state) {
  state.projectiles.push({ x: state.player.x + COMBAT.dashSpeed * FIXED_STEP,
    y: state.player.y, vx: 0, vy: 0, hostile: true, life: 1 });
}

test('light combo advances L1/L2/L3 and Heavy rewards the finisher window', () => {
  const state = world();
  for (const combo of [1, 2, 3]) {
    state.step({ ...idle, melee: true }, FIXED_STEP);
    assert.equal(state.attack.combo, combo);
    assert.equal(state.combo, combo);
    advance(state, 0.5);
  }
  state.step({ ...idle, heavy: true }, FIXED_STEP);
  assert.equal(state.attack.damage, 72);
  assert.equal(state.combo, 0);
  advance(state, 0.7);
  state.step({ ...idle, heavy: true }, FIXED_STEP);
  assert.equal(state.attack.damage, 48);
});

test('melee hits once per attack, excludes targets behind, and applies knockback/stagger', () => {
  const state = world();
  const front = target(state);
  const behind = state.enemies[1];
  Object.assign(behind, { x: state.player.x - 50, y: state.player.y, hp: 100 });
  state.step({ ...idle, melee: true }, FIXED_STEP);
  advance(state, 0.2);
  assert.equal(front.hp, 482);
  assert.equal(behind.hp, 100);
  assert.ok(front.x > state.player.x + 65);
  assert.ok(front.stagger > 0);
});

test('combo resets after idle and Heavy respects windup', () => {
  const state = world();
  state.step({ ...idle, melee: true }, FIXED_STEP);
  advance(state, 1.3);
  assert.equal(state.combo, 0);
  const enemy = target(state, state.player.x + 90);
  state.step({ ...idle, heavy: true }, FIXED_STEP);
  advance(state, 0.15);
  assert.equal(enemy.hp, 500);
  advance(state, 0.12);
  assert.equal(enemy.hp, 452);
});

test('Basic Shot is rate limited, has no ammo depletion, and projectiles are bounded', () => {
  const state = world();
  state.step({ ...idle, shoot: true }, FIXED_STEP);
  assert.equal(state.projectiles.length, 1);
  advance(state, 0.1, { ...idle, shoot: true });
  assert.equal(state.projectiles.length, 1);
  advance(state, 0.1, { ...idle, shoot: true });
  assert.equal(state.projectiles.length, 2);
  advance(state, 8, { ...idle, shoot: true });
  assert.ok(state.projectiles.length > 0);
  assert.ok(state.projectiles.length <= COMBAT.projectileLimit);
});

test('swept shot collision prevents tunneling and only damages one target', () => {
  assert.equal(segmentHitsCircle(0, 0, 100, 0, 50, 0, 4), true);
  assert.equal(segmentHitsCircle(0, 0, 100, 0, 50, 20, 4), false);
  const state = world();
  const first = target(state, 850);
  const second = state.enemies[1];
  Object.assign(second, { x: 850, y: 500, hp: 100 });
  state.projectiles.push({ x: 800, y: 500, vx: 6000, vy: 0, hostile: false, life: 1 });
  state.step(idle, FIXED_STEP);
  assert.equal(first.hp, 486);
  assert.equal(second.hp, 100);
  assert.equal(state.projectiles.length, 0);
});

test('dash consumes two charges and recharges sequentially at 2.8 seconds each', () => {
  const state = world();
  state.step({ ...idle, dash: true }, FIXED_STEP);
  assert.equal(state.dashCharges, 1);
  advance(state, 0.2);
  state.step({ ...idle, dash: true }, FIXED_STEP);
  assert.equal(state.dashCharges, 0);
  advance(state, 0.2);
  const before = state.player.x;
  state.step({ ...idle, dash: true }, FIXED_STEP);
  assert.equal(state.player.x, before);
  advance(state, 2.3);
  assert.equal(state.dashCharges, 0);
  advance(state, 0.15);
  assert.equal(state.dashCharges, 1);
  advance(state, 2.6);
  assert.equal(state.dashCharges, 1);
  advance(state, 0.25);
  assert.equal(state.dashCharges, 2);
  assert.equal(state.dashRecharge, 0);
});

test('dash uses movement over aim, cancels attacks, and clamps arena bounds', () => {
  const state = world();
  state.step({ ...idle, heavy: true }, FIXED_STEP);
  const x = state.player.x;
  state.step({ ...idle, dash: true, dy: -1 }, FIXED_STEP);
  assert.equal(state.attack, null);
  assert.ok(state.player.y < 500);
  assert.equal(state.player.x, x);
  advance(state, 0.2);
  state.player.x = ARENA.width - ARENA.inset - PLAYER_RADIUS;
  state.step({ ...idle, dash: true }, FIXED_STEP);
  advance(state, 0.2);
  assert.equal(state.player.x, ARENA.width - ARENA.inset - PLAYER_RADIUS);
});

test('dash i-frames block damage; Perfect Dodge only rewards the early timing window', () => {
  const early = world();
  hostileAtNextDashPosition(early);
  early.step({ ...idle, dash: true }, FIXED_STEP);
  assert.equal(early.hp, 100);
  assert.ok(early.perfectFlash > 0);
  const late = world();
  late.step({ ...idle, dash: true }, FIXED_STEP);
  advance(late, 0.1);
  hostileAtNextDashPosition(late);
  late.step(idle, FIXED_STEP);
  assert.equal(late.hp, 100);
  assert.equal(late.perfectFlash, 0);
  advance(late, 0.2);
  late.projectiles.push({ x: late.player.x, y: late.player.y, vx: 0, vy: 0, hostile: true, life: 1 });
  late.step(idle, FIXED_STEP);
  assert.equal(late.hp, 90);
});

test('Grunt and Archer telegraph before damage or releasing a locked-aim shot', () => {
  const gruntWorld = world();
  const grunt = target(gruntWorld, 840);
  Object.assign(grunt, { stagger: 0, cooldown: 0 });
  gruntWorld.step(idle, FIXED_STEP);
  assert.ok(grunt.windup > 0);
  assert.equal(gruntWorld.hp, 100);
  advance(gruntWorld, 0.5);
  assert.equal(gruntWorld.hp, 88);
  const archerWorld = world();
  const archer = archerWorld.enemies.find((enemy) => enemy.kind === 'archer');
  Object.assign(archer, { x: 1100, y: 500, stagger: 0, cooldown: 0 });
  archerWorld.step(idle, FIXED_STEP);
  assert.ok(archer.windup > 0);
  assert.equal(archerWorld.projectiles.length, 0);
  archerWorld.player.y = 700;
  advance(archerWorld, 0.72);
  assert.equal(archerWorld.projectiles.length, 1);
  assert.ok(Math.abs(archerWorld.projectiles[0].vy) < 0.001);
});

test('stagger interrupts attacks; hurt grace prevents burst damage; reset restores practice state', () => {
  const state = world();
  const enemy = target(state);
  Object.assign(enemy, { stagger: 0, windup: 0.3 });
  state.step({ ...idle, melee: true }, FIXED_STEP);
  advance(state, 0.1);
  assert.equal(enemy.windup, 0);
  assert.ok(enemy.stagger > 0);
  state.hitstop = 0;
  for (let i = 0; i < 3; i++) state.projectiles.push({ x: state.player.x, y: state.player.y, vx: 0, vy: 0, hostile: true, life: 1 });
  state.step(idle, FIXED_STEP);
  assert.equal(state.hp, 90);
  state.reset();
  assert.equal(state.hp, 100);
  assert.equal(state.dashCharges, 2);
  assert.equal(state.projectiles.length, 0);
  assert.equal(state.enemies.length, 6);
  assert.equal(state.player.x, 800);
});

test('a killed enemy scores once and gets replaced without unbounded enemy growth', () => {
  const state = world();
  const enemy = target(state);
  enemy.hp = 10;
  state.step({ ...idle, melee: true }, FIXED_STEP);
  advance(state, 0.2);
  assert.equal(state.kills, 1);
  assert.equal(state.enemies.length, 5);
  advance(state, 1.6);
  assert.equal(state.enemies.length, COMBAT.enemyCount);
  assert.equal(state.kills, 1);
});

test('Rupture caps at three; melee charges convert at 3 points and ammo caps at three', () => {
  const state = world();
  const enemy = target(state);
  for (let i = 0; i < 4; i++) {
    Object.assign(enemy, { x: state.player.x + 50, y: state.player.y, stagger: 100 });
    state.step({ ...idle, melee: true }, FIXED_STEP);
    advance(state, 0.45);
  }
  assert.equal(enemy.rupture, 3);
  assert.equal(state.chargedShots, 1);
  assert.equal(state.chargePoints, 1);
  state.chargedShots = 3;
  state.chargePoints = 2;
  Object.assign(enemy, { x: state.player.x + 50, stagger: 100 });
  state.step({ ...idle, melee: true }, FIXED_STEP);
  advance(state, 0.15);
  assert.equal(state.chargedShots, 3);
  assert.equal(state.chargePoints, 2);
});

test('shots consume Rupture and charged shots have stronger damage/Detonate', () => {
  function shot(charged) {
    const state = world();
    const enemy = target(state, 850);
    enemy.rupture = 3;
    state.chargedShots = charged ? 1 : 0;
    state.step({ ...idle, shoot: !charged, charged }, FIXED_STEP);
    advance(state, 0.1);
    assert.equal(enemy.rupture, 0);
    assert.equal(state.detonations, 1);
    assert.equal(state.chargedShots, 0);
    return 500 - enemy.hp;
  }
  assert.ok(shot(true) > shot(false));
  const empty = world();
  empty.step({ ...idle, charged: true }, FIXED_STEP);
  assert.equal(empty.projectiles.length, 0);
});

test('chain reaction hits marked neighbours once and respects explosion budget', () => {
  const state = world();
  const template = state.enemies[0];
  state.enemies = Array.from({ length: 30 }, (_, id) => ({ ...template, id, x: 860, y: 500, hp: 500, rupture: 3 }));
  state.projectiles.push({ x: 820, y: 500, vx: 2000, vy: 0, hostile: false, life: 1 });
  state.step(idle, FIXED_STEP);
  assert.equal(state.lastChain, COMBAT.chainLimit);
  assert.equal(state.detonations, 30);
  assert.ok(state.enemies.every((enemy) => enemy.rupture === 0));
  assert.ok(state.surge <= 100 && state.chargedShots <= 3);
});

test('Surge requires 100, clears hostile shots, damages nearby enemies, and resets', () => {
  const state = world();
  const enemy = target(state);
  state.surge = 99;
  state.step({ ...idle, ultimate: true }, FIXED_STEP);
  assert.equal(enemy.hp, 500);
  state.surge = 100;
  state.projectiles.push({ x: 300, y: 300, vx: 0, vy: 0, hostile: true, life: 1 });
  state.step({ ...idle, ultimate: true }, FIXED_STEP);
  assert.equal(enemy.hp, 400);
  assert.equal(state.projectiles.length, 0);
  assert.ok(state.surge < 100 && state.surgeFlash > 0);
  assert.ok(state.invulnerable > 0);
  state.reset();
  assert.equal(state.surge, 0);
  assert.equal(state.detonations, 0);
});

test('Volatile telegraphs its blast and explosion chains damage nearby enemies', () => {
  const state = world();
  const volatile = state.enemies.find((enemy) => enemy.kind === 'volatile');
  Object.assign(volatile, { x: 850, y: 500, cooldown: 0, stagger: 0 });
  const neighbour = target(state, 900);
  state.step(idle, FIXED_STEP);
  assert.ok(volatile.windup > 0);
  assert.equal(state.hp, 100);
  advance(state, 0.75);
  assert.equal(volatile.hp, 0);
  assert.ok(neighbour.hp < 500);
  assert.equal(state.hp, 84);
});

test('Bulwark armor mitigates basic shots; Guard Breaker Heavy bypasses it', () => {
  const state=world();state.enemies=[];state.spawnEnemy('bulwark');const enemy=state.enemies[0];
  Object.assign(enemy,{x:850,y:500,hp:1000,stagger:100});
  state.projectiles.push({x:820,y:500,vx:2000,vy:0,hostile:false,life:1});
  state.step(idle,FIXED_STEP);assert.ok(Math.abs(enemy.hp-(1000-14*.55))<1e-8);
  advance(state,.15);Object.assign(enemy,{x:850,y:500,stagger:100});state.mutations.push('guardBreaker');
  const hp=enemy.hp;state.step({...idle,heavy:true},FIXED_STEP);advance(state,.3);
  assert.ok(Math.abs(hp-enemy.hp-48*1.3)<1e-8);
});
test('Boss has three telegraphed attacks, locks slam target and cannot be stun-locked by light hits', () => {
  for(const action of [0,1,2]) {
    const state=world();state.enemies=[];state.spawnEnemy('boss');const boss=state.enemies[0];
    Object.assign(boss,{x:900,y:500,action,cooldown:0});state.step(idle,FIXED_STEP);assert.ok(boss.windup>0);
    const targetY=boss.targetY;
    if(action===2)state.player.y+=160;
    if(action===0){state.step({...idle,melee:true},FIXED_STEP);advance(state,.1);assert.ok(boss.windup>0);}
    advance(state,1.05);
    assert.equal(boss.action,(action+1)%3);
    if(action===1)assert.ok(state.projectiles.some(shot=>shot.hostile));
    if(action===2){assert.equal(boss.targetY,targetY);assert.equal(state.hp,100);}
  }
});

test('continuous Basic Shots do not lock the Boss recovery cooldown forever',()=>{
 const state=world();state.enemies=[];state.practice=false;state.spawnEnemy('boss');
 const boss=state.enemies[0];Object.assign(boss,{x:900,y:500,cooldown:0,hp:10000,maxHp:10000});
 const seen=new Set();
 for(let i=0;i<600;i++){state.hp=100;state.step({...idle,shoot:true},FIXED_STEP);seen.add(boss.action);}
 assert.equal(seen.size,3);
});

test('Berserker, Detonation Specialist and Static Riposte apply their documented effects',()=>{
 const berserker=world();berserker.hp=40;berserker.mutations.push('berserker');const targetA=target(berserker,850);
 berserker.projectiles.push({x:820,y:500,vx:2000,vy:0,hostile:false,life:1});berserker.step(idle,FIXED_STEP);
 assert.equal(targetA.hp,482.5);
 const specialist=world();specialist.mutations.push('detonationSpecialist');const trigger=target(specialist,850);trigger.rupture=1;
 const neighbour=specialist.enemies[1];Object.assign(neighbour,{x:975,y:500,hp:500,stagger:100});
 specialist.projectiles.push({x:820,y:500,vx:2000,vy:0,hostile:false,life:1});specialist.step(idle,FIXED_STEP);
 assert.equal(trigger.hp,471);assert.equal(neighbour.hp,485);
 const riposte=world();riposte.mutations.push('staticRiposte');const targetB=target(riposte,850);
 hostileAtNextDashPosition(riposte);riposte.step({...idle,dash:true},FIXED_STEP);
 assert.equal(targetB.hp,460);assert.equal(riposte.perfectDodges,1);
 const soul=world();soul.curse='volatileSoul';soul.projectiles.push({x:800,y:500,vx:0,vy:0,hostile:true,life:1});soul.step(idle,FIXED_STEP);
 assert.equal(soul.hp,87.5);
});

// Q2: taps are buffered briefly; holds still repeat at the existing action cadence.
function emptyWorld() {
  const state = world();
  state.practice = false;
  state.enemies = [];
  return state;
}

test('late melee tap chains once; early recovery tap expires instead of becoming a delayed attack', () => {
  for (const [delay, expected] of [[0.15, 2], [0.02, 1]]) {
    const state = emptyWorld();
    state.step({ ...idle, melee: true }, FIXED_STEP);
    advance(state, delay);
    state.step({ ...idle, melee: true }, FIXED_STEP);
    advance(state, 0.6);
    assert.equal(state.stats.melee, expected);
  }
});

test('Heavy replaces buffered Light, and a tap survives hitstop without repeating', () => {
  const state = emptyWorld();
  state.step({ ...idle, melee: true }, FIXED_STEP);
  advance(state, 0.13);
  state.step({ ...idle, melee: true }, FIXED_STEP);
  state.hitstop = 0.05;
  state.step({ ...idle, heavy: true }, FIXED_STEP);
  advance(state, 0.18);
  assert.equal(state.attack.heavy, true);
  advance(state, 0.7);
  assert.equal(state.stats.melee, 2);
});

test('short shot tap near cooldown end fires once with latest aim; Charged waits for Heavy recovery', () => {
  const state = emptyWorld();
  state.step({ ...idle, shoot: true }, FIXED_STEP);
  advance(state, 0.08);
  state.step({ ...idle, shoot: true }, FIXED_STEP);
  state.player.angle = Math.PI / 2;
  advance(state, 0.4);
  assert.equal(state.stats.shots, 2);
  assert.equal(state.lastShot.angle, Math.PI / 2);
  state.step({ ...idle, heavy: true }, FIXED_STEP);
  advance(state, 0.48);
  state.chargedShots = 1;
  state.step({ ...idle, charged: true }, FIXED_STEP);
  assert.equal(state.chargedShots, 1);
  advance(state, 0.25);
  assert.equal(state.chargedShots, 0);
  assert.equal(state.stats.shots, 3);
  assert.equal(state.lastShot.charged, true);
});

test('dash cancels windup and queued offense; late dash-end tap resumes attacking once', () => {
  const state = emptyWorld();
  state.step({ ...idle, heavy: true }, FIXED_STEP);
  state.step({ ...idle, melee: true }, FIXED_STEP);
  state.step({ ...idle, dash: true }, FIXED_STEP);
  assert.equal(state.attack, null);
  advance(state, 0.4);
  assert.equal(state.stats.melee, 1);
  state.step({ ...idle, dash: true }, FIXED_STEP);
  advance(state, 0.08);
  state.step({ ...idle, melee: true }, FIXED_STEP);
  advance(state, 0.4);
  assert.equal(state.stats.melee, 2);
});

test('hitstop dash is consumed once; cancel/reset clear queued actions and unavailable dash never fires later', () => {
  for (const cancel of [false, true]) {
    const state = emptyWorld();
    state.hitstop = 0.05;
    state.step({ ...idle, dash: true }, FIXED_STEP);
    if (cancel) state.clearInput();
    advance(state, 0.5);
    assert.equal(state.stats.dashes, cancel ? 0 : 1);
  }
  const state = emptyWorld();
  state.dashCharges = 0;
  state.dashRecharge = COMBAT.dashRecharge - 0.05;
  state.step({ ...idle, dash: true }, FIXED_STEP);
  advance(state, 0.2);
  assert.equal(state.dashCharges, 1);
  assert.equal(state.stats.dashes, 0);
  state.hitstop = 0.05;
  state.step({ ...idle, melee: true }, FIXED_STEP);
  state.reset();
  advance(state, 0.5);
  assert.equal(state.stats.melee, 0);
});

test('explicit taps distinguish repeated contacts across adjacent ticks, without a deep queue', () => {
  const state = emptyWorld();
  state.shotCooldown = 0.1;
  for (let i = 0; i < 3; i++) state.step({ ...idle, shoot: true, pressed: ['shoot'] }, FIXED_STEP);
  advance(state, 0.4);
  assert.equal(state.stats.shots, 1);
});

test('aim tracks windup, locks on hit, and Light/Heavy have separate hit and recovery windows', () => {
  for (const heavy of [false, true]) {
    const state = world();
    const enemy = target(state, state.player.x, state.player.y + 65);
    state.step({ ...idle, melee: !heavy, heavy }, FIXED_STEP);
    assert.equal(enemy.hp, 500);
    state.player.angle = Math.PI / 2;
    while (!state.attack.resolved) state.step(idle, FIXED_STEP);
    assert.equal(enemy.hp, heavy ? 452 : 482);
    assert.equal(state.attack.angle, Math.PI / 2);
    state.player.angle = Math.PI;
    advance(state, 0.08);
    assert.equal(state.attack.angle, Math.PI / 2);
    assert.equal(enemy.hp, heavy ? 452 : 482);
    assert.ok(state.attack.age < state.attack.duration);
  }
});

test('miss has swing but no impact/hitstop; melee and ranged contact feedback differ', () => {
  const miss = emptyWorld();
  miss.step({ ...idle, melee: true }, FIXED_STEP);
  assert.ok(miss.soundEvents.includes('swing'));
  advance(miss, 0.15);
  assert.equal(miss.hitstop, 0);
  assert.equal(miss.impacts.length, 0);
  const stops = {};
  for (const kind of ['light', 'heavy', 'shotHit', 'chargedHit']) {
    const state = world();
    const enemy = target(state, state.player.x + 50);
    const x = enemy.x;
    if (kind === 'light' || kind === 'heavy') {
      state.step({ ...idle, melee: kind === 'light', heavy: kind === 'heavy' }, FIXED_STEP);
      while (!state.attack.resolved) state.step(idle, FIXED_STEP);
    } else {
      state.chargedShots = 1;
      state.step({ ...idle, shoot: kind === 'shotHit', charged: kind === 'chargedHit' }, FIXED_STEP);
    }
    assert.ok(state.soundEvents.includes(kind));
    assert.equal(state.impacts[0].kind, kind);
    assert.equal(state.impacts[0].x, x);
    stops[kind] = state.hitstop;
  }
  assert.ok(stops.heavy > stops.light && stops.light > stops.shotHit && stops.chargedHit > stops.shotHit);
});

test('dash protects its final movement tick and becomes vulnerable on the following tick', () => {
  const state = emptyWorld();
  state.step({ ...idle, dash: true }, FIXED_STEP);
  while (state.dashTime > FIXED_STEP) state.step(idle, FIXED_STEP);
  state.projectiles.push({ x: state.player.x + state.dashTime * COMBAT.dashSpeed,
    y: state.player.y, vx: 0, vy: 0, hostile: true, life: 1 });
  state.step(idle, FIXED_STEP);
  assert.equal(state.dashTime, 0);
  assert.equal(state.hp, 100);
  assert.equal(state.perfectDodges, 0);
  state.projectiles.push({ x: state.player.x, y: state.player.y, vx: 0, vy: 0, hostile: true, life: 1 });
  state.step(idle, FIXED_STEP);
  assert.equal(state.hp, 90);
});

test('Surge tap survives hitstop once, and cancellation discards it', () => {
  for (const cancel of [false, true]) {
    const state = emptyWorld();
    state.surge = 100;
    state.hitstop = 0.05;
    state.step({ ...idle, ultimate: true }, FIXED_STEP);
    if (cancel) state.clearInput();
    advance(state, 0.15);
    assert.equal(state.surge, cancel ? 100 : 0);
    assert.equal(state.surgeFlash > 0, !cancel);
  }
});

test('Light combo contact occurs on windup frames 4/6/10, with no early hit', () => {
  const state = emptyWorld();
  for (const frames of [4, 6, 10]) {
    state.step({ ...idle, melee: true }, FIXED_STEP);
    for (let i = 1; i < frames - 1; i++) state.step(idle, FIXED_STEP);
    assert.equal(state.attack.resolved, false);
    state.step(idle, FIXED_STEP);
    assert.equal(state.attack.resolved, true);
    advance(state, 0.4);
  }
});

test('Charged fire has its own cue, keeps ammo/cadence, and an unmarked hit does not create AoE', () => {
  const state = world();
  const direct = target(state, 850);
  const neighbour = state.enemies[1];
  Object.assign(neighbour, { x: 920, y: 500, hp: 500, stagger: 100 });
  state.chargedShots = 1;
  state.step({ ...idle, charged: true }, FIXED_STEP);
  assert.ok(state.soundEvents.includes('chargedGun') && !state.soundEvents.includes('gun'));
  assert.equal(state.chargedShots, 0);
  assert.equal(state.shotCooldown, 0.35);
  assert.equal(direct.hp, 458);
  assert.equal(neighbour.hp, 500);
  assert.equal(state.detonations, 0);
  assert.equal(state.impacts.some(i => i.kind === 'chargedBlast'), false);
});

test('Charged Detonate visual uses the unchanged damage radius, including Specialist', () => {
  for (const specialist of [false, true]) {
    const state = world();
    const radius = specialist ? 142 : 105;
    if (specialist) state.mutations.push('detonationSpecialist');
    const direct = target(state, 850);
    direct.rupture = 3;
    const inside = state.enemies[1], outside = state.enemies[2];
    Object.assign(inside, { x: 850 + radius - 1, y: 500, hp: 500, stagger: 100 });
    Object.assign(outside, { x: 850 + radius + 1, y: 500, hp: 500, stagger: 100 });
    state.chargedShots = 1;
    state.step({ ...idle, charged: true }, FIXED_STEP);
    const damage = 72 * (specialist ? 1.25 : 1);
    assert.equal(direct.hp, 500 - 42 - damage);
    assert.equal(inside.hp, 500 - damage);
    assert.equal(outside.hp, 500);
    const effect = state.impacts.find(i => i.kind === 'chargedBlast');
    assert.equal(effect.radius, radius);
    assert.equal(effect.x, 850);
    assert.equal(effect.duration, 0.36);
    assert.ok(state.soundEvents.includes('chargedBlast'));
    state.hitstop = 0.05;
    const life = effect.life;
    state.step(idle, FIXED_STEP);
    assert.equal(effect.life, life);
    advance(state, 0.7);
    assert.equal(state.impacts.length, 0);
  }
});

test('dense Charged chains retain one primary blast while effects and chain work stay bounded', () => {
  const state = world();
  const template = state.enemies[0];
  state.enemies = Array.from({ length: 30 }, (_, id) => ({ ...template, id, x: 850, y: 500, hp: 500, rupture: 3 }));
  state.chargedShots = 1;
  state.step({ ...idle, charged: true }, FIXED_STEP);
  assert.equal(state.lastChain, COMBAT.chainLimit);
  assert.ok(state.impacts.length <= 24);
  assert.equal(state.impacts.filter(i => i.kind === 'chargedBlast').length, 1);
  state.reset();
  assert.equal(state.impacts.length, 0);
  assert.equal(state.soundEvents.length, 0);
});


test('L1/L2/L3 cleave widening groups once, preserve rear blind spot, and escalate contact feedback',()=>{
 const stops=[];
 for(const combo of [1,2,3]) {
  const state=emptyWorld();state.combo=combo-1;state.comboWindow=1;
  const angles=[-60,60,-95,95,-120,120,180];
  for(const degrees of angles){state.spawnEnemy('grunt');Object.assign(state.enemies.at(-1),{
   x:state.player.x+90*Math.cos(degrees*Math.PI/180),y:state.player.y+90*Math.sin(degrees*Math.PI/180),hp:500,maxHp:500,stagger:999});}
  state.spawnEnemy('grunt');Object.assign(state.enemies.at(-1),{x:state.player.x+160,y:state.player.y,hp:500,stagger:999});
  const targets=[...state.enemies];state.step({...idle,melee:true},FIXED_STEP);
  assert.ok(state.soundEvents.includes(combo===1?'swing':`swing${combo}`));
  while(!state.attack.resolved)state.step(idle,FIXED_STEP);
  assert.equal(targets.filter(e=>e.hp<500).length,combo*2);
  assert.equal(targets[6].hp,500);assert.equal(targets[7].hp,500);
  const damaged=targets.filter(e=>e.hp<500);const hp=500-[18,22,30][combo-1];
  assert.ok(damaged.every(e=>e.hp===hp&&e.rupture===1));
  const cue=combo===1?'light':`light${combo}`;
  assert.ok(state.soundEvents.includes(cue));assert.equal(state.impacts.filter(i=>i.kind===cue).length,combo*2);
  stops.push(state.hitstop);advance(state,.15);assert.ok(damaged.every(e=>e.hp===hp));
 }
 assert.ok(stops[0]<stops[1]&&stops[1]<stops[2]);
});
test('held L1 then L2 clears an unbuffed cluster, grants charge per hit, and leaves rear target alive',()=>{
 const state=emptyWorld();
 for(const degrees of [-30,0,30,180]){state.spawnEnemy('grunt',36);Object.assign(state.enemies.at(-1),{
  x:state.player.x+65*Math.cos(degrees*Math.PI/180),y:state.player.y+65*Math.sin(degrees*Math.PI/180),stagger:999});}
 advance(state,.6,{...idle,melee:true});assert.equal(state.kills,3);assert.equal(state.enemies.length,1);
 assert.equal(state.enemies[0].hp,36);assert.equal(state.chargedShots,2);
 assert.equal(state.mutations.length,0);assert.equal(state.curse,null);
});
