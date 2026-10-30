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
 w.invulnerable=0;w.barrier.gain(30,false);w.setCurses(['ghostStep']);w.dashCharges=0;w.hurt(20,0);
 assert.equal(w.barrier.value,6);assert.equal(w.hp,92);
 w.invulnerable=0;w.dashTime=.1;w.hurt(20,0);assert.equal(w.barrier.value,6);
});

test('Aegis uses actual direct melee damage, excludes overkill, shots, blasts and armor loss',()=>{
 const w=world();w.mutations=['aegisCore'];const e=target(w,'bulwark');
 w.hitEnemy(e,40,0,0,0,false,'light');assert.equal(w.barrier.aegisDamage,16.5);assert.equal(w.barrier.value,0);
 w.hitEnemy(e,40,0,0,0,false,'shotHit');w.hitEnemy(e,40,0,0,0,true,'blast');
 assert.equal(w.barrier.aegisDamage,16.5);
 e.hp=5;w.hitEnemy(e,100,0,0,0,true,'heavy');assert.equal(w.barrier.aegisDamage,21.5);
 e.hp=100;w.hitEnemy(e,28,0,0,0,true,'light2');assert.equal(w.barrier.value,4);assert.equal(w.barrier.aegisDamage,0);
});

test('Aegis caps bursts, drops overflow and never banks progress at full Barrier',()=>{
 const b=new Barrier();b.meleeDamage(1000,false);assert.equal(b.value,4);assert.equal(b.aegisDamage,0);
 b.meleeDamage(40,false);assert.equal(b.value,4);b.step(1);assert.equal(b.value,4);
 b.meleeDamage(40,true);assert.equal(b.value,9);
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
 const w=world();w.setCurses(['ironOath']);w.beginAttack(true);assert.equal(w.barrier.value,0);assert.equal(w.heavyCharges,1);
 w.barrier.gain(4,true);assert.equal(w.barrier.value,5);w.beginAttack(true);
 assert.equal(w.barrier.value,9);assert.equal(w.heavyCharges,0);
 assert.equal(w.rechargeDuration,COMBAT.dashRecharge*BARRIER.oathDashMultiplier);
 w.mutations=['aegisCore'];const e=target(w);w.hitEnemy(e,80,0,0,0,true,'heavy');assert.equal(w.barrier.value,14);
 w.barrier.guardBreak(true);assert.equal(w.barrier.value,26.5);
 assert.equal(w.attack.damage,100,'does not change baseline damage');
});

test('Oath only grants on actual Heavy start, buffered cancellation grants nothing',()=>{
 const w=world();w.setCurses(['ironOath']);w.barrier.gain(5,false);w.beginAttack(false);
 w.step({...idle,heavy:true},1/60);assert.equal(w.barrier.value,5);
 w.clearInput();w.step({...idle,dash:true},1/60);assert.equal(w.barrier.value,5);
 assert.equal(w.heavyCharges,2);
});

test('pause/draft freezes defensive clocks; switching/keeping Curse preserves resource and timers',()=>{
 const w=world(),run=new RunDirector(w);w.setCurses(['ironOath']);w.barrier.guardBreak(true);
 w.barrier.meleeDamage(40,true);const before=JSON.stringify(w.barrier);
 run.draftKind='curse';run.draft=[{id:'ironOath',role:'curseChoice'},{id:'ghostStep',role:'curseChoice'}];
 run.step(idle,1);assert.equal(JSON.stringify(w.barrier),before);
 assert.equal(run.choose(0),true);assert.equal(JSON.stringify(w.barrier),before);
 run.draft=[{id:'ghostStep',role:'curseChoice'}];run.choose(0);
 assert.equal(w.rechargeDuration,COMBAT.dashRecharge*BARRIER.oathDashMultiplier);assert.deepEqual(w.curses,['ironOath','ghostStep']);assert.equal(JSON.stringify(w.barrier),before);
 w.barrier.step(3);w.barrier.guardBreak(false);assert.equal(w.barrier.value,27.5);
 run.start();assert.equal(w.barrier.value,0);assert.equal(w.barrier.guardCooldown,0);assert.equal(w.barrier.aegisDamage,0);
 assert.equal(w.rechargeDuration,COMBAT.dashRecharge);
});

test('Q5C pool retains Aegis and Iron Oath, preserving unlock gates and draft ownership',()=>{
 const p=defaultProfile();assert.ok(mutationPool(p).includes('aegisCore'));assert.ok(cursePool(p).includes('ironOath'));
 assert.ok(!mutationPool(p).includes('guardBreaker'));assert.ok(!mutationPool(p).includes('staticRiposte'));
 assert.ok(!cursePool(p).includes('deathEcho'));
 assert.equal(mutationPool(p).length,10);assert.equal(cursePool(p).length,7);
 const w=world(),r=new RunDirector(w);w.mutations=['guardBreaker','aegisCore'];w.kills=25;r.step(idle,1/60);
 assert.ok(r.draft.every(o=>!w.mutations.includes(o.id)));assert.equal(BARRIER.cap,30);
});

test('Specialist defense needs actual Charged detonation damage, caps multihits, and cannot bank cooldown through freeze',()=>{
 const w=world();w.mutations=['detonationSpecialist'];
 const blast=(charged=true)=>{const e=target(w,'grunt',1000);e.rupture=1;w.chainSeen.clear();w.detonate(e,1,charged);w.resolveExplosions();};
 blast(false);assert.equal(w.barrier.value,0,'Basic detonation grants nothing');
 blast();assert.equal(w.barrier.value,18);assert.equal(w.hp,100);
 blast();assert.equal(w.barrier.value,18,'another target/cleave cannot bypass cooldown');
 const clock=w.barrier.specialistCooldown;w.hitstop=1;w.step(idle,1/60);assert.equal(w.barrier.specialistCooldown,clock);
 const r=new RunDirector(w);r.draft=[{id:'catalyst',role:'wildcard'}];r.step(idle,1);assert.equal(w.barrier.specialistCooldown,clock);
 w.barrier.step(2);w.barrier.value=29;blast();assert.equal(w.barrier.value,30);
 w.barrier.step(2);w.barrier.value=0;w.setCurses(['ironOath']);blast();assert.equal(w.barrier.value,22.5,'Oath is applied once');
 w.reset();assert.equal(w.barrier.specialistCooldown,0);assert.equal(w.barrier.value,0);
 const empty=world();empty.mutations=['detonationSpecialist'];const e=target(empty,'grunt',0);e.rupture=1;empty.detonate(e,1,true);empty.resolveExplosions();assert.equal(empty.barrier.value,0);
 const plain=world();const t=target(plain);t.rupture=1;plain.detonate(t,1,true);plain.resolveExplosions();assert.equal(plain.barrier.value,0,'requires the mutation');
});

test('Specialist improves actual walk and dash recharge without adding dash charges or invulnerability',()=>{
 const base=world(),ranged=world();ranged.mutations=['detonationSpecialist'];
 base.step({...idle,dx:1},1/60);ranged.step({...idle,dx:1},1/60);
 assert.ok(Math.abs((ranged.player.x-800)/(base.player.x-800)-1.2)<1e-9);
 assert.ok(Math.abs(ranged.rechargeDuration-1.76)<1e-9);
 ranged.setCurses(['ironOath']);assert.ok(Math.abs(ranged.rechargeDuration-1.76*1.15)<1e-9);
 ranged.setCurses([]);ranged.step({...idle,dash:true},1/60);
 assert.equal(ranged.dashCharges,1);assert.ok(ranged.dashTime<=.18);
 ranged.reset();assert.equal(ranged.rechargeDuration,2.2);assert.equal(ranged.dashCharges,2);
});

test('Specialist and Glass boost direct Charged base once while Static and blast keep separate values',()=>{
 const w=world();w.mutations=['detonationSpecialist','staticRiposte'];w.setCurses(['glassSoul']);
 const e=target(w,'grunt',1000);e.x=850;w.build.staticCharge=4;
 w.fire(800,500,0,false,true);const shot=w.projectiles[0];
 assert.ok(Math.abs(shot.damage-84*1.1*1.3)<1e-9);assert.equal(shot.staticBonus,40);
 w.stepProjectiles(1/60);w.resolveExplosions();
 assert.ok(Math.abs(e.hp-(1000-84*1.1*1.3-40-24*1.25))<1e-9);
 assert.equal(w.barrier.value,18);assert.equal(w.hp,90);
});
