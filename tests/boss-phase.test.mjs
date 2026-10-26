import test from 'node:test';
import assert from 'node:assert/strict';
import {CombatWorld} from '../.test-build/combat.js';
import {RunDirector} from '../.test-build/run.js';
import {BOSS_ATTACK,BOSS_PHASE} from '../.test-build/config/balance.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false},dt=1/60;
function setup(){const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];w.spawnEnemy('boss');const b=w.enemies[0];Object.assign(b,{x:980,y:500,cooldown:0});return {w,b};}
const step=(w,n)=>{for(let i=0;i<n;i++)w.step(idle,dt);};
test('warning lasts 120 simulation steps, keeps movement, suspends regular spawn, freezes and resets',()=>{
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.start();r.draftIndex=6;r.ticks=13199;w.kills=1200;w.enemies=[];r.step(idle,dt);assert.equal(r.bossWarning,2);assert.equal(r.bossDue,false);
 const x=w.player.x;for(let i=0;i<60;i++)r.step({...idle,dx:1},dt);assert.ok(w.player.x>x);assert.equal(w.enemies.length,0);
 const warning=r.bossWarning;w.hitstop=.2;r.step(idle,dt);assert.equal(r.bossWarning,warning);w.hitstop=0;
 for(let i=0;i<59;i++)r.step(idle,dt);assert.equal(r.bossDue,false);r.step(idle,dt);assert.equal(r.bossDue,true);assert.equal(w.enemies.filter(e=>e.kind==='boss').length,1);
 r.start();assert.equal(r.bossWarning,0);assert.equal(r.bossDue,false);
});
test('threshold exactly 50%, one1.4s transformation, cancels attack, no heal, freezes world/timer/input',()=>{
 const {w,b}=setup();const r=new RunDirector(w);r.bossDue=true;r.ticks=15000;r.draftIndex=6;
 b.hp=751;w.step(idle,dt);assert.equal(b.enraged,false);b.hp=750;
 w.spawnEnemy('grunt');const grunt=w.enemies.at(-1);Object.assign(grunt,{x:1000,y:600,windup:.1,slow:2});
 w.projectiles.push({x:800,y:500,vx:300,vy:0,hostile:true,damage:10,life:3});
 w.heavyCharges=1;w.heavyRecharge=2;w.surge=100;
 const snapshot=()=>JSON.stringify({player:w.player,grunt,shots:w.projectiles,hp:w.hp,bhp:b.hp,barrier:w.barrier,heavy:w.heavyCharges,recharge:w.heavyRecharge,stats:w.stats});
 const before=snapshot(),tick=r.ticks;
 for(let i=0;i<84;i++){r.step({...idle,dx:1,melee:true,shoot:true,dash:true,heavy:true,ultimate:true},dt);assert.equal(snapshot(),before);assert.equal(r.ticks,tick);}
 assert.equal(b.transform,0);assert.equal(b.enraged,true);assert.equal(b.windup,0);assert.equal(b.maxHp,1500);
 w.projectiles=[];r.step({...idle,dx:1,heavy:true,dash:true,ultimate:false},dt);assert.equal(r.ticks,tick+1);assert.ok(w.player.x>800);assert.equal(w.stats.dashes,0);assert.equal(w.heavyCharges,1);assert.equal(w.surge,100);
 b.hp=749;step(w,2);assert.equal(b.transform,0);
});
test('phase2 slam follows with locked sweep; full telegraph and punish recovery, no extra projectiles',()=>{
 const {w,b}=setup();Object.assign(b,{enraged:true,hp:700,action:2});w.step(idle,dt);w.player.y=250;step(w,38);assert.equal(b.followup,true);
 for(let i=0;i<20&&b.attackAction!==0;i++)w.step(idle,dt);assert.equal(b.attackAction,0);assert.ok(b.windup>.5);const angle=b.angle;w.player.x-=100;step(w,10);assert.equal(b.angle,angle);step(w,30);assert.ok(b.recovery>.6);assert.equal(w.projectiles.length,0);
 const pos=[b.x,b.y];step(w,20);assert.deepEqual([b.x,b.y],pos);
});
test('followup sector geometry agrees with Perfect Dodge and outside arc is safe',()=>{
 for(const outside of [false,true]){const {w,b}=setup();Object.assign(b,{enraged:true,hp:700,attackAction:0,angle:Math.PI,windup:.1,windupDuration:.62,comboFinish:true});w.player.y=outside?800:500;
 assert.equal(w.isImminentEnemyThreat(b),!outside);w.step({...idle,dash:!outside,dy:1},dt);step(w,8);assert.equal(w.hp,100);assert.equal(w.perfectDodges,outside?0:1);}
 assert.equal(BOSS_ATTACK.windup,BOSS_ATTACK.enragedWindup);assert.equal(BOSS_ATTACK.recovery,BOSS_ATTACK.enragedRecovery);assert.equal(BOSS_PHASE.speedMultiplier,1.15);
});

test('warning reset mid-arrival, deadline and defeat cancel cue without spawning Boss',()=>{
 for(const mode of ['reset','deadline','death']){
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.start();r.draftIndex=6;r.ticks=13199;w.kills=1200;w.enemies=[];r.step(idle,dt);assert.equal(r.bossWarning,2);
 if(mode==='reset')r.start();else {if(mode==='deadline')r.ticks=17999;else w.hp=0;r.step(idle,dt);assert.equal(r.result,'defeat');}
 assert.equal(r.bossWarning,0);assert.equal(w.enemies.some(e=>e.kind==='boss'),false);
 }
});
test('Enraged changes chase speed and cooldown only, hit flash fades during transform',()=>{
 const distances=[];
 for(const enraged of [false,true]){const {w,b}=setup();b.cooldown=1;b.enraged=enraged;const x=b.x;w.step(idle,dt);distances.push(x-b.x);}
 assert.ok(Math.abs(distances[1]/distances[0]-1.15)<1e-8);
 const {w,b}=setup();b.hp=750;b.flash=.08;step(w,8);assert.ok(b.transform>0);assert.equal(b.flash,0);
});

test('Boss shortcut starts at1150 kills/3:40, skips drafts, preserves threshold/warning and normal reset',()=>{
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.start();r.prepareBossPlaytest(1150,220);
 assert.equal(w.kills,1150);assert.equal(r.elapsed,220);assert.equal(r.nextDraft,null);assert.equal(r.bossDue,false);assert.equal(r.bossWarning,0);
 assert.equal(w.enemies.length,7);assert.ok(w.enemies.every(e=>e.kind==='grunt'||e.kind==='archer'));
 r.step(idle,dt);assert.equal(r.draft.length,0);assert.equal(r.bossWarning,0);
 w.kills+=50;r.step(idle,dt);assert.equal(r.bossWarning,2);
 r.start();assert.equal(w.kills,0);assert.equal(r.elapsed,0);assert.ok(r.nextDraft);assert.equal(r.bossWarning,0);
});

test('death at threshold resolves instead of freezing run indefinitely; reset clears transform',()=>{
 const {w,b}=setup();const r=new RunDirector(w);b.hp=750;w.hp=0;r.step(idle,dt);assert.equal(r.result,'defeat');r.start();assert.equal(w.bossTransforming,false);
});
