import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { WAVES } from '../.test-build/config/balance.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
function setup(){const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.start();r.mutationPool=[];r.cursePool=[];r.draftIndex=6;return {w,r};}
function tick(w,r){w.hp=w.maxHp;w.enemies.forEach(e=>e.stagger=999);r.step(idle,1/60);}

test('rapid clearing increases bounded supply and density; response decays without kills',()=>{
 const {w,r}=setup();r.ticks=30*60;
 let supplied=0;
 for(let i=0;i<10*60;i++){
  if(i%30===0){supplied+=w.enemies.length;w.kills+=w.enemies.length;w.enemies=[];}
  tick(w,r);
 }
 assert.ok(supplied>27,`rapid refill supplied ${supplied}, above fixed ~20`);
 assert.ok(r.clearRate>WAVES.clearThreshold);
 const boosted=r.clearRate;
 for(let i=0;i<20*60;i++)tick(w,r);
 assert.ok(r.clearRate<boosted/10);
 assert.ok(w.enemies.length<=WAVES.hardCap);
});

test('pressure stops exactly at hard cap, leaves room after kills, and reset clears adaptation',()=>{
 const {w,r}=setup();
 for(let i=0;i<100*60;i++){tick(w,r);assert.ok(w.enemies.length<=WAVES.hardCap);}
 assert.equal(w.enemies.length,WAVES.hardCap);
 w.enemies.splice(0,3);w.kills+=3;
 for(let i=0;i<5*60;i++)tick(w,r);
 assert.equal(w.enemies.length,WAVES.hardCap);
 r.start();assert.equal(r.clearRate,0);assert.equal(w.enemies.length,7);
});

test('draft and hitstop freeze adaptation and spawn clocks; Boss keeps one-at-a-time cap7',()=>{
 const {w,r}=setup();r.clearRate=8;r.spawnTicks=0;
 const rate=r.clearRate;
 w.hitstop=.5;for(let i=0;i<10;i++)tick(w,r);
 assert.equal(r.clearRate,rate);assert.equal(r.spawnTicks,0);
 r.draft=[{id:'aegisCore',role:'wildcard'}];const before=JSON.stringify(r);
 for(let i=0;i<60;i++)r.step(idle,1/60);
 assert.equal(JSON.stringify(r),before);r.draft=[];w.hitstop=0;
 r.ticks=14399;tick(w,r);for(let i=0;i<120;i++)tick(w,r);assert.equal(r.bossDue,true);
 for(let i=0;i<6*60;i++){tick(w,r);assert.ok(w.enemies.length<=7);}
});

test('all spawn angles at arena center, edges and corners stay in bounds and >=220px from player',()=>{
 const {w}=setup();
 for(const x of [80,800,1520])for(const y of [80,500,920])for(let i=0;i<120;i++){
  w.player.x=x;w.player.y=y;w.enemies=[];w.spawnEnemy('grunt',36,i*Math.PI/60);
  const e=w.enemies[0];assert.ok(Math.hypot(e.x-x,e.y-y)>=220);
  assert.ok(e.x>=64&&e.x<=1536&&e.y>=64&&e.y<=936);
 }
});
