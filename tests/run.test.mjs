import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { MUTATIONS, CURSES } from '../.test-build/builds.js';
import { buildDraft, DraftRandom } from '../.test-build/Draft.js';
import { draftSignals } from '../.test-build/DraftSignals.js';
const offer=(pool,owned=[])=>buildDraft({kind:pool===CURSES?'curse':'mutation',owned,curses:[],pool,signals:{...draftSignals(),rangedDamage:400,rangedHits:20},maxHp:100,previousOffers:[],choices:[]},new DraftRandom(1)).options;
import { DRAFT_MILESTONES, ENCOUNTERS } from '../.test-build/config/balance.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
function finishWarning(world,run){for(let i=0;i<120;i++){world.enemies.forEach(e=>e.stagger=999);run.step(idle,1/60);}}
function setup() { const world=new CombatWorld({x:800,y:500,angle:0});const run=new RunDirector(world);run.start();return {world,run}; }

test('draft choices are unique, adaptive and never offer an owned Mutation',()=>{
 const choices=offer(MUTATIONS,['phantomEdge']);
 assert.ok(choices.every(o=>o.role==='wildcard'||o.reason));
 assert.equal(new Set(choices.map(c=>c.id)).size,3);assert.ok(!choices.some(c=>c.id==='phantomEdge'));
 assert.equal(offer(CURSES).length,3);
});
test('six kill drafts pause the timer, heal once, respect max HP, and cannot be double-picked',()=>{
 const {world,run}=setup();
 for(const {kills,kind,minSeconds} of DRAFT_MILESTONES) {
  run.ticks=minSeconds*60-1;world.hp=75;world.enemies.forEach(e=>e.stagger=999);world.kills=kills;const tick=run.ticks;
  run.step(idle,1/60);assert.equal(run.draftKind,kind);assert.equal(run.draft.length,kills===25?4:Math.min(3,kind==='mutation'?MUTATIONS.length-world.mutations.length:3));
  const snapshot=JSON.stringify(world);run.step(idle,1/60);assert.equal(run.ticks,tick+1);assert.equal(JSON.stringify(world),snapshot);
  assert.equal(run.choose(-1),false);assert.equal(run.choose(0),true);assert.equal(run.choose(0),false);
  assert.equal(world.hp,Math.min(world.maxHp,world.curses[0]==='parasiticMark'?80:85));
 }
 assert.equal(world.mutations.length,4);assert.ok(world.curses[0]);assert.equal(new Set(world.mutations).size,4);
});
test('waves start with Grunt/Archer, are bounded and include Volatile later; timer ends at five minutes',()=>{
 const {world,run}=setup();assert.ok(world.enemies.every(e=>e.kind==='grunt'||e.kind==='archer'));
 let sawVolatile=false;
 for(let i=0;i<18000;i++) {
  world.hp=world.maxHp;world.enemies.forEach(e=>e.stagger=999);
  if(i===3300)world.enemies=[];
  run.step(idle,1/60);if(run.draft.length)run.choose(0);
  if(world.enemies.some(e=>e.kind==='volatile'))sawVolatile=true;
  assert.ok(world.enemies.length <= (run.bossDue ? 7 : 210));
 }
 assert.ok(sawVolatile);finishWarning(world,run);assert.equal(run.bossDue,true);assert.equal(run.expired,true);
 const tick=run.ticks;run.step(idle,1/60);assert.equal(run.ticks,tick);
});
test('Curse benefits have real costs and build effects reset per run',()=>{
 const {world,run}=setup();world.setCurses(['ghostStep']);world.hp=100;assert.equal(world.maxHp,100);assert.equal(world.rechargeDuration,2.8);
 world.setCurses(['bloodPact']);world.step({...idle,melee:true},1/60);assert.equal(world.hp,100);assert.equal(world.attack.damage,18);
 world.mutations.push('phantomEdge');run.start();assert.equal(world.curses[0],undefined);assert.equal(world.mutations.length,0);assert.equal(world.maxHp,100);assert.equal(run.ticks,0);
});

test('Elite and Boss spawn once; boss arrival clears excess common enemies and hostile shots',()=>{
 const {world,run}=setup();
 run.ticks=8999;run.draftIndex=DRAFT_MILESTONES.length;world.enemies.forEach(e=>e.stagger=999);
 run.step(idle,1/60);assert.equal(world.enemies.filter(e=>e.kind==='bulwark').length,1);
 run.draftIndex=DRAFT_MILESTONES.length;run.ticks=14399;
 world.projectiles.push({x:100,y:100,vx:0,vy:0,hostile:true,life:2});
 run.step(idle,1/60);assert.equal(run.bossWarning,2);
 for(let i=0;i<120;i++){world.enemies.forEach(e=>e.stagger=999);run.step(idle,1/60);}
 assert.equal(world.enemies.filter(e=>e.kind==='boss').length,1);assert.equal(world.projectiles.length,0);
 run.step(idle,1/60);assert.equal(world.enemies.filter(e=>e.kind==='boss').length,1);
});
test('mutual kill in the same tick is Victory before deadline; at deadline it is Defeat',()=>{
 for(const [tick,result] of [[15000,'victory'],[17999,'defeat']]) {
  const {world,run}=setup();world.enemies=[];world.spawnEnemy('boss');
  const boss=world.enemies[0];Object.assign(boss,{x:890,y:500,hp:14,enraged:true,cooldown:999});
  world.hp=10;world.projectiles=[{x:800,y:500,vx:0,vy:0,hostile:true,life:1},{x:875,y:500,vx:850,vy:0,hostile:false,life:1}];
  run.ticks=tick;run.draftIndex=DRAFT_MILESTONES.length;run.step(idle,1/60);
  assert.equal(world.hp,0);assert.equal(world.bossSlain,true);assert.equal(run.result,result);
  const stopped=run.ticks;run.step(idle,1/60);assert.equal(run.ticks,stopped);
 }
});
test('player death and deadline show distinct defeat reasons; start fully resets a completed run',()=>{
 const {world,run}=setup();world.hp=0;run.step(idle,1/60);assert.equal(run.result,'defeat');assert.equal(run.reason,'slain');
 run.start();run.ticks=17999;run.draftIndex=DRAFT_MILESTONES.length;run.step(idle,1/60);assert.equal(run.reason,'deadline');
 run.start();assert.equal(run.result,null);assert.equal(run.reason,null);assert.equal(run.bossDue,false);assert.equal(world.hp,100);assert.equal(world.bossSlain,false);
});


test('unbuffed opening Grunt dies to two Light hits or Light + Basic detonation',()=>{
 for (const followup of ['melee','shoot']) {
  const {world}=setup();const enemy=world.enemies.find(e=>e.kind==='grunt');
  world.enemies=[enemy];Object.assign(enemy,{x:world.player.x+45,y:world.player.y,stagger:999});
  assert.equal(world.mutations.length,0);assert.equal(world.curses[0],undefined);
  world.step({...idle,melee:true},1/60);
  for(let i=0;i<25;i++)world.step(idle,1/60);
  assert.ok(enemy.hp>0);assert.equal(enemy.rupture,1);assert.equal(world.kills,0);
  world.step({...idle,[followup]:true},1/60);
  for(let i=0;i<25;i++)world.step(idle,1/60);
  assert.equal(world.kills,1);assert.equal(world.enemies.length,0);
  if(followup==='shoot')assert.equal(world.detonations,1);
 }
});
test('opening spawns bounded Grunt packs, preserves HP ramp and resets cleanly',()=>{
 const {world,run}=setup();run.draftIndex=DRAFT_MILESTONES.length;assert.equal(world.enemies.length,7);
 assert.equal(world.enemies.filter(e=>e.kind==='grunt').length,6);
 assert.equal(world.enemies.filter(e=>e.kind==='archer').length,1);
 assert.ok(Math.hypot(world.enemies[0].x-world.enemies[1].x,world.enemies[0].y-world.enemies[1].y)<65);
 const step=()=>{world.enemies.forEach(e=>e.stagger=999);run.step(idle,1/60);};
 for(let i=0;i<89;i++)step();assert.equal(world.enemies.length,7);
 step();assert.equal(world.enemies.length,10);
 for(let i=90;i<3599;i++)step();assert.ok(world.enemies.length>18);
 assert.ok(world.enemies.filter(e=>e.kind==='archer').length<=8);assert.equal(run.draft.length,0);
 const survivor=world.enemies[0];survivor.hp=9;world.enemies=[survivor];run.spawnTicks=150;
 step();assert.equal(run.draft.length,0);assert.equal(run.elapsed,60);
 assert.equal(survivor.hp,9);assert.equal(world.enemies[1].maxHp,36);
 run.choose(0);run.ticks=5399;run.spawnTicks=150;world.enemies=[survivor];
 step();assert.equal(world.enemies[1].maxHp,55);assert.equal(survivor.hp,9);
 run.ticks=7199;run.spawnTicks=150;world.enemies=[survivor];
 step();assert.equal(world.enemies[1].maxHp,76);assert.equal(run.draft.length,0);
 assert.equal(survivor.hp,9);
 run.start();assert.equal(world.enemies.length,7);assert.equal(world.enemies[0].maxHp,36);
 assert.equal(world.mutations.length,0);assert.equal(run.elapsed,0);
});
test('standard enemy HP follows kind, independent of spawn order; Elite/Boss health unchanged',()=>{
 const {world}=setup();world.enemies=[];
 for(const [kind,hp] of [['archer',48],['grunt',66],['grunt',66],['volatile',48],['bulwark',220],['boss',1500]]) {
  world.spawnEnemy(kind);assert.equal(world.enemies.at(-1).hp,hp);assert.equal(world.enemies.at(-1).maxHp,hp);
 }
});

test('new common enemies grow in health, damage and speed over time; survivors and Boss stay stable',()=>{
 const {world,run}=setup();const old=world.enemies[0];old.hp=9;
 const samples=[];
 for(const seconds of [60,120,180,240,299]){
  world.enemies=[old];old.stagger=999;run.waveIndex=0;run.draftIndex=DRAFT_MILESTONES.length;run.ticks=seconds*60-1;run.spawnTicks=200;
  run.spawnCommon('grunt',0);const enemy=world.enemies.find(e=>e!==old&&e.kind==='grunt');
  assert.ok(enemy);samples.push(enemy);assert.equal(old.hp,9);assert.equal(old.damageScale,1);assert.equal(old.speedScale,1);
 }
 for(let i=1;i<samples.length;i++){
  assert.ok(samples[i].maxHp>samples[i-1].maxHp);assert.ok(samples[i].damageScale>samples[i-1].damageScale);
  assert.ok(samples[i].speedScale>samples[i-1].speedScale);
 }
 assert.equal(samples[0].maxHp,36);assert.ok(samples.at(-1).maxHp<=106);
 run.start();run.draftIndex=DRAFT_MILESTONES.length;run.ticks=14399;world.enemies.forEach(e=>e.stagger=999);run.step(idle,1/60);
 finishWarning(world,run);const boss=world.enemies.find(e=>e.kind==='boss');assert.equal(boss.maxHp,1500);assert.equal(boss.damageScale,1);
});

test('each milestone triggers on kills after its floor or fallback time, once, including simultaneous thresholds',()=>{
 for(const mode of ['kills','time','both']) {
  const {world,run}=setup();world.enemies=[];
  for(const target of DRAFT_MILESTONES) {
   world.enemies=[];world.projectiles=[];
   world.kills=mode==='time'?0:target.kills-1;
   run.ticks=mode==='kills'?target.minSeconds*60-2:target.seconds*60-2;
   run.step(idle,1/60);assert.equal(run.draft.length,0);
   if(mode!=='time')world.kills++;
   run.step(idle,1/60);assert.ok(run.draft.length);assert.equal(run.draftKind,target.kind);
   assert.ok(run.choose(0));assert.equal(run.choose(0),false);
  }
  run.step(idle,1/60);assert.equal(run.draft.length,0);assert.equal(run.nextDraftKills,null);
 }
});
test('crossing all thresholds resolves six choices before Boss; reset restores milestones',()=>{
 const {world,run}=setup();world.enemies=[];world.kills=2000;
 for(const {kind,minSeconds} of DRAFT_MILESTONES){
  run.ticks=minSeconds*60-1;
  run.step(idle,1/60);assert.equal(run.draftKind,kind);assert.ok(run.draft.length);
  assert.equal(run.bossDue,false);assert.equal(run.choose(0),true);
 }
 run.ticks=ENCOUNTERS.boss.minSeconds*60-1;run.step(idle,1/60);assert.equal(run.draft.length,0);assert.equal(run.nextDraftKills,null);finishWarning(world,run);assert.equal(run.bossDue,true);
 run.start();assert.equal(world.kills,0);assert.equal(run.nextDraftKills,25);assert.equal(run.bossDue,false);
});
test('small and exhausted Mutation pools never produce invalid options or block the run',()=>{
 for(let count=0;count<=3;count++) {
  const choices=offer(MUTATIONS.slice(0,count));
  assert.equal(choices.length,count);assert.equal(new Set(choices.map(o=>o.id)).size,count);
  assert.ok(choices.every(o=>MUTATIONS.includes(o.id)));
 }
 const {world,run}=setup();run.mutationPool=[];run.cursePool=[];world.kills=2000;world.enemies=[];
 run.ticks=ENCOUNTERS.boss.seconds*60-1;run.step(idle,1/60);assert.equal(run.draft.length,0);assert.equal(run.nextDraft,null);finishWarning(world,run);assert.equal(run.bossDue,true);
});
test('second Curse allows Keep or adding slot2; both effects remain and HP is clamped',()=>{
 const {world,run}=setup();world.enemies=[];world.setCurses(['bloodPact']);run.draftIndex=4;run.ticks=DRAFT_MILESTONES[4].minSeconds*60-1;world.kills=300;
 run.step(idle,1/60);assert.ok(run.draft.some(o=>o.id==='bloodPact'));
 run.choose(run.draft.findIndex(o=>o.id==='bloodPact'));assert.equal(world.curses[0],'bloodPact');
 run.draftIndex=4;run.cursePool=['ghostStep'];world.hp=100;
 run.step(idle,1/60);run.choose(run.draft.findIndex(o=>o.id==='ghostStep'));
 assert.deepEqual(world.curses,['bloodPact','ghostStep']);assert.equal(world.maxHp,100);assert.equal(world.hp,100);
});
test('Elite and Boss use gated kills OR fallback time, once; no late Elite after an early Boss',()=>{
 for(const mode of ['kills','time','both']) {
  const {world,run}=setup();run.draftIndex=DRAFT_MILESTONES.length;
  for(const [kind,target] of [['bulwark',ENCOUNTERS.elite],['boss',ENCOUNTERS.boss]]) {
   world.enemies=[];world.projectiles=[];
   world.kills=mode==='time'?0:target.kills-1;run.ticks=mode==='kills'?target.minSeconds*60-2:target.seconds*60-2;
   run.step(idle,1/60);assert.equal(world.enemies.filter(e=>e.kind===kind).length,0);
   if(mode!=='time')world.kills++;
   run.step(idle,1/60);if(kind==='boss')finishWarning(world,run);assert.equal(world.enemies.filter(e=>e.kind===kind).length,1);
   run.step(idle,1/60);if(kind==='boss')finishWarning(world,run);assert.equal(world.enemies.filter(e=>e.kind===kind).length,1);
  }
 }
 const {world,run}=setup();run.draftIndex=DRAFT_MILESTONES.length;world.enemies=[];world.kills=ENCOUNTERS.boss.kills;run.ticks=ENCOUNTERS.boss.minSeconds*60-1;
 run.step(idle,1/60);finishWarning(world,run);assert.equal(run.bossDue,true);assert.equal(world.enemies.some(e=>e.kind==='bulwark'),false);
 run.ticks=13201;world.enemies.forEach(e=>e.stagger=999);run.step(idle,1/60);
 assert.equal(world.enemies.some(e=>e.kind==='bulwark'),false);
 assert.equal(world.enemies.find(e=>e.kind==='boss').maxHp,1500);
});

test('no-kill pressure continues past the old cap, resets on kills and freezes in draft/hitstop',()=>{
 const {world,run}=setup();run.draftIndex=DRAFT_MILESTONES.length;
 const tick=()=>{world.hp=100;world.enemies.forEach(e=>e.stagger=999);run.step(idle,1/60);};
 for(let i=0;i<30*60;i++)tick();const count=world.enemies.length;assert.ok(count>18);
 for(let i=0;i<12*60;i++)tick();assert.equal(world.enemies.length,count+9);
 world.kills++;tick();const atKill=world.enemies.length;
 for(let i=0;i<3*60;i++)tick();assert.equal(world.enemies.length,atKill);
 const clock=run.pressureTime;world.hitstop=.2;tick();assert.equal(run.pressureTime,clock);world.hitstop=0;
 run.draft=[{id:'aegisCore',role:'wildcard'}];for(let i=0;i<60;i++)tick();assert.equal(run.pressureTime,clock);run.draft=[];
 for(let i=0;i<61;i++)tick();assert.equal(world.enemies.length,atKill+3);
 run.ticks=8999;const preElite=world.enemies.length;tick();assert.ok(world.enemies.length>=preElite,'Elite does not delete pressure enemies');
 run.start();assert.equal(run.pressureTime,0);assert.equal(world.enemies.length,7);
});

test('pressure packs prioritize two Archers until eight, then keep adding cleavable Grunts',()=>{
 const {world,run}=setup();run.draftIndex=DRAFT_MILESTONES.length;
 world.enemies=[];for(let i=0;i<18;i++)world.spawnEnemy('grunt');
 for(let wave=0;wave<6;wave++){
  world.enemies.forEach(e=>e.stagger=999);run.pressureTime=4;run.spawnTicks=999;
  const before=world.enemies.length;run.step(idle,1/60);assert.equal(world.enemies.length,before+3);
  assert.equal(world.enemies.filter(e=>e.kind==='archer').length,Math.min(8,(wave+1)*2));
 }
 assert.ok(world.enemies.filter(e=>e.kind==='grunt').length>=28);
});

test('Q8B banked kills cannot bypass any floor, chain choices stay spaced, and replay resets',()=>{
 const {world,run}=setup();world.enemies=[];world.kills=9999;
 for(const target of DRAFT_MILESTONES){
  run.ticks=target.minSeconds*60-2;run.step(idle,1/60);assert.equal(run.draft.length,0);
  run.step(idle,1/60);assert.ok(run.draft.length);const clock=run.ticks;
  for(let i=0;i<120;i++)run.step(idle,1/60);
  assert.equal(run.ticks,clock);assert.equal(run.choose(0),true);
 }
 run.ticks=ENCOUNTERS.boss.minSeconds*60-2;run.step(idle,1/60);assert.equal(run.bossDue,false);
 run.step(idle,1/60);finishWarning(world,run);assert.equal(run.bossDue,true);
 run.start();assert.equal(run.ticks,0);assert.equal(run.bossDue,false);assert.equal(run.nextDraft,DRAFT_MILESTONES[0]);
 run.step(idle,1/60);assert.equal(run.draft.length,0);
});
