import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { chainRoot } from '../.test-build/BuildEffects.js';
import { emptyLegacy, beginLegacy, finishLegacy, validateLegacy } from '../.test-build/legacy.js';
import { defaultProfile, saveProfile, loadProfile } from '../.test-build/progression.js';
import { SIGILS } from '../.test-build/config/legacy.js';
import { ASCENSION as A } from '../.test-build/config/ascension.js';
const idle={dx:0,dy:0};
const world=(seal=4)=>{const w=new CombatWorld({x:800,y:500,angle:0});w.enemies=[];w.ascension.seal=seal;w.practice=false;return w;};
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};};
test('Seal progression 0→4, replay lower, defeat, cap, Q9B rewards and per-run receipt idempotency',()=>{
 const s=emptyLegacy();s.unlocks.push(...SIGILS);
 for(let n=0;n<=4;n++){
  s.receipt=null;s.ascension.selected=n;const t=beginLegacy(s,1,100+n);assert.equal(t.seal,n);
  assert.equal(finishLegacy(s,'victory'),true);assert.equal(s.ascension.highest,Math.min(4,n+1));assert.ok(s.ascension.clears.includes(n));
  const snapshot=JSON.stringify(s);assert.equal(finishLegacy(s,'victory'),false);assert.equal(JSON.stringify(s),snapshot);
  assert.equal(s.receipt.sealUnlocked,n<4?n+1:undefined);assert.equal(s.receipt.sealClear,n);
 }
 s.receipt=null;s.ascension.selected=1;beginLegacy(s,1,88);finishLegacy(s,'victory');assert.equal(s.ascension.highest,4);
 s.receipt=null;beginLegacy(s,1,89);const before=structuredClone(s.ascension);finishLegacy(s,'defeat');assert.deepEqual(s.ascension,before);assert.deepEqual(s.receipt.rewards,[]);
});
test('versioned migration, allowlist, malformed save, ticket refresh/restart and selected Seal lock',()=>{
 const p=defaultProfile();p.legacy.unlocks.push(...SIGILS);Object.assign(p.legacy.ascension,{highest:2,selected:2,clears:[0,1]});
 const ticket=beginLegacy(p.legacy,1,77);p.legacy.ascension.selected=0;assert.equal(beginLegacy(p.legacy,2,99).seal,2);
 const mem=storage();assert.equal(saveProfile(p,mem),true);assert.deepEqual(loadProfile(mem).legacy.ticket,ticket);
 const bad=structuredClone(p.legacy);bad.ascension={version:1,highest:99,selected:99,clears:[3,4,'0',-1]};bad.ticket.seal=88;
 const clean=validateLegacy(bad);assert.equal(clean.ascension.highest,0);assert.equal(clean.ticket.seal,0);
 delete bad.ascension;delete bad.ticket.seal;assert.equal(validateLegacy(bad).ticket.seal,0);
 assert.deepEqual(loadProfile({getItem:()=>'{bad'}),defaultProfile());
});
test('Pulse waits for Anomaly, offset warning, active duration, cap and per-victim damage',()=>{
 const w=world(1),a=w.ascension;a.step(40);assert.equal(a.zones.length,0);w.anomaly.equip('bloodMoon');a.step(35);
 assert.equal(a.zones.length,1);const z=a.zones[0];assert.ok(Math.hypot(z.x-w.player.x,z.y-w.player.y)>A.pulse.radius);assert.equal(z.time,1.5);
 w.spawnEnemy('grunt',100);const e=w.enemies.at(-1);e.x=z.x;e.y=z.y;w.player.x=z.x;a.step(1);assert.equal(e.hp,100);assert.equal(w.hp,100);
 a.step(.5);assert.equal(e.hp,76);assert.equal(w.hp,88);a.step(.25);assert.equal(e.hp,76);assert.equal(a.zones.length,1);a.step(.26);assert.equal(a.zones.length,0);
 a.pulseClock=0;a.step(.01);a.pulseClock=0;a.step(.01);assert.equal(a.zones.length,1);
});
test('Hazards cancel on Boss windup/arrival; combat transform/hitstop and Draft freeze clocks',()=>{
 const w=world();w.anomaly.equip('bloodMoon');w.ascension.step(35);w.anomaly.suspended=true;w.ascension.step(.01);assert.equal(w.ascension.zones.length,0);
 w.anomaly.suspended=false;w.spawnEnemy('boss');const b=w.enemies.at(-1);b.enraged=true;b.windup=1;w.ascension.pulseClock=0;w.ascension.step(.01);assert.equal(w.ascension.zones.length,0);
 b.windup=0;b.enraged=false;b.hp=700;const before=w.ascension.pulseClock;w.step(idle,.1);assert.equal(w.ascension.pulseClock,before);
 b.enraged=true;b.transform=0;w.hitstop=1;w.step(idle,.1);assert.equal(w.ascension.pulseClock,before);
 const r=new RunDirector(w);r.draft=[{id:'catalyst'}];r.step(idle,.1);assert.equal(w.ascension.pulseClock,before);
});
test('Hunter requires moving with same group for 5s, warning, 4s interception, cooldown, exclusion and reset',()=>{
 const w=world(2),a=w.ascension;w.spawnEnemy('grunt');const e=w.enemies.at(-1);Object.assign(e,{x:1000,y:500,windup:0,active:0,stagger:0});
 w.spawnEnemy('bulwark');w.spawnEnemy('boss');w.movementIntent={x:1,y:0};
 for(let i=0;i<301;i++)a.step(1/60);assert.equal(a.hunterId,e.id);assert.ok(a.hunterWarning>0);
 assert.equal(a.pursuit(e).x,w.player.x);a.step(.8);assert.ok(a.pursuit(e).x>w.player.x);a.step(4);assert.equal(a.hunterId,null);assert.ok(a.hunterCooldown>0);
 w.movementIntent={x:0,y:0};for(let i=0;i<900;i++)a.step(1/60);assert.equal(a.hunterId,null);assert.equal(a.stable,0);
 a.reset();assert.equal(a.hunterCooldown,0);assert.equal(a.hunterId,null);
});
test('Fracture only second Mutation draft, safe eligibility, once/run, slots and root budget',()=>{
 const w=world(3),r=new RunDirector(w);r.seedOverride=3;r.start();w.ascension.seal=3;
 w.kills=999;r.ticks=35*60;r.step(idle,1/60);assert.ok(r.draft.every(o=>!o.fractured));assert.ok(r.choose(r.draft.findIndex(o=>o.id!=='staticRiposte')));r.mutationPool=['staticRiposte'];
 // Second Mutation milestone (Curse draft in between).
 for(let i=0;i<6 && !r.draft.some(o=>o.fractured);i++){r.ticks+=60*60;r.step(idle,1/60);if(r.draft.length && !r.draft.some(o=>o.fractured))r.choose(0);}
 const index=r.draft.findIndex(o=>o.fractured);assert.ok(index>=0);assert.equal(r.draft[index].id,'staticRiposte');assert.ok(r.choose(index));assert.equal(w.ascension.penalty,25);assert.ok(w.mutations.length<=4);assert.ok(w.curses.length<=2);
 const root=chainRoot();assert.equal(w.ascension.fractureBonus('staticRiposte',root),.5);assert.equal(w.ascension.fractureBonus('staticRiposte',root),0);assert.ok(root.legacy.remaining>=0);
});
test('Fractured proc adds half static damage once, penalty only enemy damage, expires and resets',()=>{
 const w=world(3);w.ascension.fractured='staticRiposte';w.ascension.penalty=25;
 w.hurt(10,0,true,false);assert.equal(w.hp,89);w.invulnerable=0;w.hurt(10,0,false,false);assert.equal(w.hp,79);
 w.ascension.step(25);assert.equal(w.ascension.penalty,0);w.invulnerable=0;w.hurt(10,0,true,false);assert.equal(w.hp,69);
 w.reset();assert.equal(w.ascension.fractured,null);assert.equal(w.ascension.seal,0);
});
test('Phase2 real combo schedules Echo once, full warning, dodge, no knockback, new windup/transform exclusion',()=>{
 const w=world();w.spawnEnemy('boss');const b=w.enemies.at(-1);Object.assign(b,{enraged:true,comboFinish:true,windup:.01,attackAction:0,x:1200,y:500});
 w.stepBoss(b,.02);assert.equal(w.ascension.zones.length,1);assert.equal(w.ascension.zones[0].time,1.3);w.ascension.echo();assert.equal(w.ascension.zones.length,1);
 const x=w.player.x;w.ascension.step(1.29);assert.equal(w.hp,100);w.dashTime=.1;w.ascension.step(.02);assert.equal(w.hp,100);assert.equal(w.player.x,x);
 w.dashTime=0;w.ascension.echoCooldown=0;w.ascension.zones=[];w.ascension.echo();w.ascension.step(1.31);assert.equal(w.hp,87);assert.equal(w.player.x,x);assert.equal(w.hitstop,0);
 w.ascension.echoCooldown=0;w.ascension.zones=[];w.ascension.echo();b.windup=1;w.ascension.step(.01);assert.equal(w.ascension.zones.length,0);
 b.transform=1;w.ascension.echoCooldown=0;w.ascension.echo();assert.equal(w.ascension.zones.length,0);
});
test('Seal0 has no effects; each stacked level enables only its threshold',()=>{
 for(let seal=0;seal<=4;seal++){const w=world(seal);w.anomaly.equip('bloodMoon');w.ascension.step(35);assert.equal(w.ascension.zones.length,seal>=1?1:0);w.ascension.echo();assert.equal(w.ascension.zones.filter(z=>z.kind==='echo').length,seal>=4?1:0);}
});
test('Static Riposte duplicate deals half actual proc damage and never duplicates primary/charge/death',()=>{
 const run=fractured=>{const w=world(3);w.mutations=['staticRiposte'];w.ascension.fractured=fractured?'staticRiposte':null;w.spawnEnemy('grunt',1000);const e=w.enemies.at(-1);Object.assign(e,{x:850,y:500,rupture:0});w.build.staticCharge=2;w.fire(800,500,0,false,true);w.stepProjectiles(.05);return {hp:e.hp,kills:w.kills,points:w.chargePoints,root:w.projectiles[0]?.root};};
 const base=run(false),bonus=run(true);assert.equal(base.hp-bonus.hp,20);assert.equal(base.kills,bonus.kills);assert.equal(base.points,bonus.points);
});
test('No eligible Mutation skips fracture for the run; first Draft and passive mutations stay normal',()=>{
 const w=world(3),r=new RunDirector(w);r.start();w.ascension.seal=3;r.mutationPool=['aegisCore'];w.kills=999;
 for(let i=0;i<5;i++){r.ticks=60*60*(i+1);r.step(idle,1/60);assert.ok(r.draft.every(o=>!o.fractured));if(r.draft.length)r.choose(0);}
 assert.equal(w.ascension.fractured,null);assert.ok(w.mutations.length<=4);assert.ok(w.curses.length<=2);
});
