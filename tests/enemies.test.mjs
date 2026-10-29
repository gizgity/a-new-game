import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { ENEMY_ATTACK, BOSS_ATTACK, ARCHER } from '../.test-build/config/balance.js';
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

test('Boss keeps locked active pattern and target through stationary recovery; phase one recovery stays locked', () => {
  for (const action of [0, 1, 2]) {
    const { w, e } = setup('boss', 180); e.action = action;
    w.step(idle, dt); const { x, y, targetX, targetY, angle } = e;
    w.player.y += 180;
    assert.equal(e.windupDuration, BOSS_ATTACK.windup);
    step(w, BOSS_ATTACK.windup + dt);
    assert.equal(e.attackAction, action); assert.equal(e.action, (action + 1) % 3);
    assert.ok(e.active > 0); assert.ok(e.recovery > 0);
    step(w, 0.1);
    assert.deepEqual([e.x, e.y, e.angle, e.targetX, e.targetY], [action === 2 ? targetX : x, action === 2 ? targetY : y, angle, targetX, targetY]);
    step(w, BOSS_ATTACK.enragedCooldown); assert.equal(e.windupDuration, BOSS_ATTACK.enragedWindup);
  }
});

test('Volatile fuse stays at its locked location; fleeing the marked circle avoids damage', () => {
  const { w, e } = setup('volatile', 65);
  w.step(idle, dt); const x = e.x;
  w.player.y += 150; step(w, 0.72);
  assert.equal(e.x, x); assert.equal(w.hp, 100); assert.equal(w.enemies.length, 0);
});

test('Archer tracks early windup including stagger, then projectile keeps release heading',()=>{
 const {w,e}=setup('archer',300);w.step(idle,dt);const {x,y}=e;
 w.player.y+=120;w.step(idle,dt);assert.equal(e.angle,Math.atan2(w.player.y-e.y,w.player.x-e.x));
 e.stagger=.1;w.player.y-=250;w.step(idle,dt);assert.equal(e.angle,Math.atan2(w.player.y-e.y,w.player.x-e.x));
 e.stagger=0;e.windup=dt/2;w.step(idle,dt);const shot=w.projectiles[0];assert.ok(shot);
 assert.ok(Math.abs(Math.atan2(shot.vy,shot.vx)-e.angle)<1e-9);const heading=[shot.vx,shot.vy];
 w.player.y+=300;w.step(idle,dt);assert.deepEqual([shot.vx,shot.vy],heading);assert.deepEqual([e.x,e.y],[x,y]);
});

test('Archer commits its visible aim for the final window, including stagger, and fires that heading',()=>{
 const {w,e}=setup('archer',300);w.step(idle,dt);
 w.player.y+=100;w.step(idle,dt);const committed=e.angle;
 e.windup=ARCHER.aimLock;e.stagger=.1;w.player.y-=240;
 w.step(idle,dt);assert.equal(e.angle,committed,'stagger cannot reopen committed aim');
 e.stagger=0;step(w,ARCHER.aimLock+dt);
 const shot=w.projectiles.find(p=>p.hostile);assert.ok(shot);
 assert.ok(Math.abs(Math.atan2(shot.vy,shot.vx)-committed)<1e-9);
 assert.ok(Math.abs(Math.hypot(shot.vx,shot.vy)-ARCHER.projectileSpeed)<1e-9);
});

test('ordinary perpendicular walking can evade a committed Archer shot without spending dash',()=>{
 const {w,e}=setup('archer',300);w.step(idle,dt);
 e.windup=ARCHER.aimLock;
 for(let i=0;i<100;i++)w.step({...idle,dy:1},dt);
 assert.equal(w.hp,100);assert.equal(w.stats.dashes,0);
});

test('Boss cadence is faster in both phases while retaining a readable windup and recovery',()=>{
 assert.ok(BOSS_ATTACK.windup+BOSS_ATTACK.cooldown < .95+1.15);
 assert.ok(BOSS_ATTACK.enragedWindup+BOSS_ATTACK.enragedCooldown < .75+.8);
 for(const enraged of [false,true]) {
  const {w,e}=setup('boss',180);if(enraged){e.hp=e.maxHp*.4;e.enraged=true;}
  w.step(idle,dt);assert.equal(e.windupDuration,enraged?BOSS_ATTACK.enragedWindup:BOSS_ATTACK.windup);
  assert.ok(e.windupDuration>.16);w.player.y+=300;
  step(w,e.windupDuration+dt);assert.ok(e.recovery>0);assert.equal(e.action,1);
 }
});

test('Grunt leap locks a landing cue, travels visibly and can be evaded or interrupted',()=>{
 for(const interrupt of [false,true]){
  const {w,e}=setup('grunt',250);e.leapCooldown=0;w.step(idle,dt);
  assert.equal(e.attackAction,3);const target=[e.targetX,e.targetY];const start=e.x;
  if(interrupt){w.hitEnemy(e,1,0,0,.6,true,'heavy');assert.equal(e.windup,0);continue;}
  w.player.y+=160;step(w,.5);assert.ok(e.x!==start);assert.deepEqual([e.targetX,e.targetY],target);
  step(w,.2);assert.equal(e.x,target[0]);assert.equal(w.hp,100);assert.ok(e.recovery>0);
 }
});
test('Grunt landing has Perfect timing, one hit, concurrent limit, and no immunity to AoE',()=>{
 const {w,e}=setup('grunt',250);e.leapCooldown=0;w.step(idle,dt);e.windup=.1;
 assert.ok(w.isImminentEnemyThreat(e));w.step({...idle,dash:true,dy:1},dt);assert.equal(w.perfectDodges,1);
 const crowded=new CombatWorld({x:800,y:500,angle:0});crowded.practice=false;crowded.enemies=[];
 for(let i=0;i<8;i++){crowded.spawnEnemy('grunt',36);Object.assign(crowded.enemies.at(-1),{x:1000,y:500+i,leapCooldown:0});}
 crowded.step(idle,dt);assert.equal(crowded.enemies.filter(e=>e.attackAction===3&&e.windup>0).length,1);
 crowded.surge=100;crowded.step({...idle,ultimate:true},dt);assert.equal(crowded.kills,8);
});
test('far Boss closes distance by telegraphed slam and ring has a fast aimed fan',()=>{
 const {w,e}=setup('boss',500);w.step({...idle,dy:1},dt);assert.equal(e.attackAction,2);
 const target=[e.targetX,e.targetY];const start=e.x;w.player.y-=200;
 step(w,e.windupDuration+.01);assert.deepEqual([e.x,e.y],target);assert.notEqual(e.x,start);assert.equal(w.hp,100);
 e.recovery=e.cooldown=0;e.action=1;w.hitstop=0;w.step(idle,dt);step(w,e.windupDuration+.01);
 assert.equal(w.projectiles.length,15);assert.ok(w.projectiles.every(s=>Math.abs(Math.hypot(s.vx,s.vy)-430)<1e-6));
});
test('Grunt predicts a constant runner, while changing direction escapes the locked landing',()=>{
 for(const change of [false,true]) {
  const {w,e}=setup('grunt',250);e.leapCooldown=0;
  w.step({...idle,dy:1},dt);const target=[e.targetX,e.targetY];
  for(let i=0;i<43;i++)w.step({...idle,dy:change?-1:1},dt);
  assert.deepEqual([e.targetX,e.targetY],target);
  assert.equal(w.hp,change?100:95);
 }
});

test('new Grunts get an adaptation delay and leap damage remains a small mistake cost',()=>{
 const {w,e}=setup('grunt',250);e.cooldown=999;
 assert.ok(e.leapCooldown>=4);step(w,3.9);assert.notEqual(e.attackAction,3);
 e.x=w.player.x+250;e.y=w.player.y;e.leapCooldown=0;w.step(idle,dt);step(w,.7);assert.equal(w.hp,95);
 assert.ok(e.leapCooldown>6,'individual leap cannot immediately repeat');
});
test('sparse Grunts stagger starts, accumulated crowds pressure faster without a same-tick burst',()=>{
 const prepare=count=>{const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];
 for(let i=0;i<count;i++){w.spawnEnemy('grunt',1000);Object.assign(w.enemies.at(-1),{x:1050,y:500+i*.1,leapCooldown:0,cooldown:999});}return w;};
 const sparse=prepare(8),crowd=prepare(18);
 sparse.step(idle,dt);crowd.step(idle,dt);
 assert.equal(sparse.enemies.filter(e=>e.attackAction===3).length,1);assert.equal(crowd.enemies.filter(e=>e.attackAction===3).length,1);
 assert.equal(sparse.gruntLeapGap,1.6);assert.equal(crowd.gruntLeapGap,.7);
 // Count new starts while dodging landing hits; sparse group cannot stream all eight at once.
 for(const w of [sparse,crowd]){w.player.y=300;w.invulnerable=999;step(w,1.5);}
 assert.equal(sparse.enemies.filter(e=>e.attackAction===3).length,1);
 assert.ok(crowd.enemies.filter(e=>e.attackAction===3).length>=2);
 const clock=sparse.gruntLeapGap;sparse.hitstop=.2;sparse.step(idle,dt);assert.equal(sparse.gruntLeapGap,clock);
 sparse.reset();assert.equal(sparse.gruntLeapGap,0);
});
