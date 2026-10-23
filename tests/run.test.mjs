import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { mutationDraft, curseDraft, MUTATIONS } from '../.test-build/builds.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
function setup() { const world=new CombatWorld({x:800,y:500,angle:0});const run=new RunDirector(world);run.start();return {world,run}; }

test('draft choices are unique, adaptive and never offer an owned Mutation',()=>{
 const choices=mutationDraft(['phantomEdge'],{melee:0,shots:20,dashes:0},5,MUTATIONS,()=>0);
 assert.equal(choices[0].id,'catalyst');assert.equal(choices[1].id,'detonationSpecialist');
 assert.equal(new Set(choices.map(c=>c.id)).size,3);assert.ok(!choices.some(c=>c.id==='phantomEdge'));
 assert.equal(curseDraft().length,3);
});
test('1/2/3 minute drafts pause the timer, heal once, respect max HP, and cannot be double-picked',()=>{
 const {world,run}=setup();
 for(const [tick,kind] of [[3599,'mutation'],[7199,'curse'],[10799,'mutation']]) {
  world.hp=75;world.enemies.forEach(e=>e.stagger=999);run.ticks=tick;
  run.step(idle,1/60);assert.equal(run.draftKind,kind);assert.equal(run.draft.length,3);
  const snapshot=JSON.stringify(world);run.step(idle,1/60);assert.equal(run.ticks,tick+1);assert.equal(JSON.stringify(world),snapshot);
  assert.equal(run.choose(-1),false);assert.equal(run.choose(0),true);assert.equal(run.choose(0),false);
  assert.equal(world.hp,Math.min(world.maxHp,85));
 }
 assert.equal(world.mutations.length,2);assert.ok(world.curse);assert.equal(new Set(world.mutations).size,2);
});
test('waves start with Grunt/Archer, are bounded and include Volatile later; timer ends at five minutes',()=>{
 const {world,run}=setup();assert.ok(world.enemies.every(e=>e.kind==='grunt'||e.kind==='archer'));
 let sawVolatile=false;
 for(let i=0;i<18000;i++) {
  world.hp=world.maxHp;world.enemies.forEach(e=>e.stagger=999);
  if(i===3300)world.enemies=[];
  run.step(idle,1/60);if(run.draft.length)run.choose(0);
  if(world.enemies.some(e=>e.kind==='volatile'))sawVolatile=true;
  assert.ok(world.enemies.length<=18);
 }
 assert.ok(sawVolatile);assert.equal(run.bossDue,true);assert.equal(run.expired,true);
 const tick=run.ticks;run.step(idle,1/60);assert.equal(run.ticks,tick);
});
test('Curse benefits have real costs and build effects reset per run',()=>{
 const {world,run}=setup();world.curse='ghostStep';world.hp=100;assert.equal(world.maxHp,80);assert.equal(world.rechargeDuration,2.1);
 world.curse='bloodPact';world.step({...idle,melee:true},1/60);assert.equal(world.hp,99);assert.equal(world.attack.damage,18*1.3);
 world.mutations.push('phantomEdge');run.start();assert.equal(world.curse,null);assert.equal(world.mutations.length,0);assert.equal(world.maxHp,100);assert.equal(run.ticks,0);
});

test('Elite and Boss spawn once; boss arrival clears excess common enemies and hostile shots',()=>{
 const {world,run}=setup();
 run.ticks=8999;run.draftIndex=2;world.enemies.forEach(e=>e.stagger=999);
 run.step(idle,1/60);assert.equal(world.enemies.filter(e=>e.kind==='bulwark').length,1);
 run.draftIndex=3;run.ticks=14399;
 world.projectiles.push({x:100,y:100,vx:0,vy:0,hostile:true,life:2});
 run.step(idle,1/60);assert.equal(world.enemies.filter(e=>e.kind==='boss').length,1);assert.equal(world.projectiles.length,0);
 run.step(idle,1/60);assert.equal(world.enemies.filter(e=>e.kind==='boss').length,1);
});
test('mutual kill in the same tick is Victory before deadline; at deadline it is Defeat',()=>{
 for(const [tick,result] of [[15000,'victory'],[17999,'defeat']]) {
  const {world,run}=setup();world.enemies=[];world.spawnEnemy('boss');
  const boss=world.enemies[0];Object.assign(boss,{x:890,y:500,hp:14,cooldown:999});
  world.hp=10;world.projectiles=[{x:800,y:500,vx:0,vy:0,hostile:true,life:1},{x:875,y:500,vx:850,vy:0,hostile:false,life:1}];
  run.ticks=tick;run.draftIndex=3;run.step(idle,1/60);
  assert.equal(world.hp,0);assert.equal(world.bossSlain,true);assert.equal(run.result,result);
  const stopped=run.ticks;run.step(idle,1/60);assert.equal(run.ticks,stopped);
 }
});
test('player death and deadline show distinct defeat reasons; start fully resets a completed run',()=>{
 const {world,run}=setup();world.hp=0;run.step(idle,1/60);assert.equal(run.result,'defeat');assert.equal(run.reason,'slain');
 run.start();run.ticks=17999;run.draftIndex=3;run.step(idle,1/60);assert.equal(run.reason,'deadline');
 run.start();assert.equal(run.result,null);assert.equal(run.reason,null);assert.equal(run.bossDue,false);assert.equal(world.hp,100);assert.equal(world.bossSlain,false);
});
