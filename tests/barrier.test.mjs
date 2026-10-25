import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld, COMBAT } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { Barrier } from '../.test-build/barrier.js';
import { BARRIER } from '../.test-build/config/balance.js';
import { mutationPool, cursePool, defaultProfile } from '../.test-build/progression.js';
const idle = {dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
function world() { const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];return w; }
function target(w,kind='grunt',hp=1000) {
 w.spawnEnemy(kind,hp);const e=w.enemies.at(-1);
 Object.assign(e,{x:w.player.x+80,y:w.player.y,windup:0,cooldown:999,stagger:999});return e;
}
function heavy(w) {
 w.clearInput();w.attack=null;w.hitstop=0;w.heavyCharges=2;
 w.step({...idle,heavy:true},1/60);
 for(let i=0;i<14;i++)w.step(idle,1/60);
}

test('Barrier absorbs after curse damage, preserves hurt immunity/knockback and breaks without healing',()=>{
 const w=world();w.barrier.gain(12,false);w.hurt(20,0);
 assert.equal(w.hp,92);assert.equal(w.barrier.value,0);assert.equal(w.barrier.broken,true);
 assert.equal(w.invulnerable,.65);assert.equal(w.player.x,820);
 w.hurt(20,0);assert.equal(w.hp,92);
 w.invulnerable=0;w.barrier.gain(30,false);w.curse='ghostStep';w.dashCharges=0;w.hurt(20,0);
 assert.equal(w.barrier.value,6);assert.equal(w.hp,92);
 w.invulnerable=0;w.dashTime=.1;w.hurt(20,0);assert.equal(w.barrier.value,6);
});

test('Aegis uses actual direct melee damage, excludes overkill, shots, blasts and armor loss',()=>{
 const w=world();w.mutations=['aegisCore'];const e=target(w,'bulwark');
 w.hitEnemy(e,40,0,0,0,false,'light');assert.equal(w.barrier.aegisDamage,22);assert.equal(w.barrier.value,0);
 w.hitEnemy(e,40,0,0,0,false,'shotHit');w.hitEnemy(e,40,0,0,0,true,'blast');
 assert.equal(w.barrier.aegisDamage,22);
 e.hp=5;w.hitEnemy(e,100,0,0,0,true,'heavy');assert.equal(w.barrier.aegisDamage,27);
 e.hp=100;w.hitEnemy(e,13,0,0,0,true,'light2');assert.equal(w.barrier.value,4);assert.equal(w.barrier.aegisDamage,0);
});

test('Aegis caps bursts, drops overflow and never banks progress at full Barrier',()=>{
 const b=new Barrier();b.meleeDamage(1000,false);assert.equal(b.value,8);assert.equal(b.aegisDamage,0);
 b.meleeDamage(40,false);assert.equal(b.value,8);b.step(1);assert.equal(b.value,8);
 b.meleeDamage(40,true);assert.equal(b.value,13);
 b.gain(99,false);b.meleeDamage(39,false);assert.equal(b.aegisDamage,0);
 b.absorb(10);b.step(2);assert.equal(b.value,20);b.meleeDamage(1,false);assert.equal(b.value,20);
 b.gain(99,true);assert.equal(b.value,30);assert.equal(b.aegisDamage,0);
});

test('Guard Breaker rewards one interrupt per Heavy, cooldown freezes during hitstop',()=>{
 const w=world();w.mutations=['guardBreaker'];const a=target(w),b=target(w);
 a.windup=b.windup=.4;heavy(w);
 assert.equal(w.barrier.value,10);assert.equal(a.windup,0);assert.equal(b.windup,0);
 assert.equal(w.impacts.filter(i=>i.kind==='guardBreak').length,1);
 const cooldown=w.barrier.guardCooldown;w.step(idle,1/60);assert.equal(w.barrier.guardCooldown,cooldown);
 a.windup=.4;a.x=w.player.x+80;heavy(w);assert.equal(w.barrier.value,10);
});

test('Guard rewards closed Bulwark armor but not idle, recovery, miss or Boss windup',()=>{
 for(const [kind,windup,recovery,expected] of [['grunt',0,0,0],['grunt',0,.2,0],['bulwark',0,0,10],['bulwark',0,.75,0],['boss',.9,0,0]]) {
  const w=world();w.mutations=['guardBreaker'];const e=target(w,kind);e.windup=windup;e.recovery=recovery;
  heavy(w);assert.equal(w.barrier.value,expected,kind+' recovery '+recovery);
  if(kind==='boss')assert.ok(e.windup>0,'Boss telegraph survives');
 }
 const w=world();w.mutations=['guardBreaker'];heavy(w);assert.equal(w.barrier.value,0);
});

test('Iron Oath multiplies grants once, Heavy requires existing Barrier and spends its charge',()=>{
 const w=world();w.curse='ironOath';w.beginAttack(true);assert.equal(w.barrier.value,0);assert.equal(w.heavyCharges,1);
 w.barrier.gain(4,true);assert.equal(w.barrier.value,5);w.beginAttack(true);
 assert.equal(w.barrier.value,9);assert.equal(w.heavyCharges,0);
 assert.equal(w.rechargeDuration,COMBAT.dashRecharge*1.3);
 w.mutations=['aegisCore'];const e=target(w);w.hitEnemy(e,80,0,0,0,true,'heavy');assert.equal(w.barrier.value,19);
 w.barrier.guardBreak(true);assert.equal(w.barrier.value,30);
 assert.equal(w.attack.damage,100,'does not change baseline damage');
});

test('Oath only grants on actual Heavy start, buffered cancellation grants nothing',()=>{
 const w=world();w.curse='ironOath';w.barrier.gain(5,false);w.beginAttack(false);
 w.step({...idle,heavy:true},1/60);assert.equal(w.barrier.value,5);
 w.clearInput();w.step({...idle,dash:true},1/60);assert.equal(w.barrier.value,5);
 assert.equal(w.heavyCharges,2);
});

test('pause/draft freezes defensive clocks; switching/keeping Curse preserves resource and timers',()=>{
 const w=world(),run=new RunDirector(w);w.curse='ironOath';w.barrier.guardBreak(true);
 w.barrier.meleeDamage(40,true);const before=JSON.stringify(w.barrier);
 run.draftKind='curse';run.draft=[{id:'ironOath',role:'curseChoice'},{id:'ghostStep',role:'curseChoice'}];
 run.step(idle,1);assert.equal(JSON.stringify(w.barrier),before);
 assert.equal(run.choose(0),true);assert.equal(JSON.stringify(w.barrier),before);
 run.draft=[{id:'ghostStep',role:'curseChoice'}];run.choose(0);
 assert.equal(w.rechargeDuration,2.8);assert.equal(JSON.stringify(w.barrier),before);
 w.barrier.step(3);w.barrier.guardBreak(false);assert.equal(w.barrier.value,27.5);
 run.start();assert.equal(w.barrier.value,0);assert.equal(w.barrier.guardCooldown,0);assert.equal(w.barrier.aegisDamage,0);
 assert.equal(w.rechargeDuration,COMBAT.dashRecharge);
});

test('Q5A pool adds only Aegis and Iron Oath, preserving unlock gates and draft ownership',()=>{
 const p=defaultProfile();assert.ok(mutationPool(p).includes('aegisCore'));assert.ok(cursePool(p).includes('ironOath'));
 assert.ok(!mutationPool(p).includes('guardBreaker'));assert.ok(!mutationPool(p).includes('staticRiposte'));
 assert.ok(!cursePool(p).includes('deathEcho'));
 assert.equal(mutationPool(p).length,5);assert.equal(cursePool(p).length,4);
 const w=world(),r=new RunDirector(w);w.mutations=['guardBreaker','aegisCore'];w.kills=25;r.step(idle,1/60);
 assert.ok(r.draft.every(o=>!w.mutations.includes(o.id)));assert.equal(BARRIER.cap,30);
});
