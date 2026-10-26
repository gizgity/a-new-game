import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false},dt=1/60;
function setup(mutations=[],curse=null){const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];w.mutations=mutations;w.setCurses([curse].filter(Boolean));w.spawnEnemy('grunt',50000);const e=w.enemies[0];Object.assign(e,{x:860,y:500,stagger:999,cooldown:999});return {w,e};}
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);

test('defensive choices each have a real damage cost and stack multiplicatively',()=>{
 for(const [mutations,curse,mult]of [[[],null,1],[['aegisCore'],null,.8],[[],'ironOath',.75],[[],'bloodPact',.8],[['aegisCore'],'ironOath',.6],[['aegisCore'],'bloodPact',.64]]){
  const {w,e}=setup(mutations,curse);near(w.outgoingDamageMultiplier,mult);w.hitEnemy(e,100,0,0,0,true,'shotHit');near(50000-e.hp,100*mult);
 }
});
test('stacked tank damage tax covers Heavy, Charged flat bonuses, Phantom and explosions without double-taxing relays',()=>{
 for(const sound of ['light','heavy','chargedHit','phantom','blast']){
  const {w,e}=setup(['aegisCore'],'ironOath');e.fracture=sound==='heavy'||sound==='chargedHit'?3:0;
  w.hitEnemy(e,100,0,0,0,true,sound);near(50000-e.hp,(e.fracture===0&&['heavy','chargedHit'].includes(sound)?120:100)*.6);
 }
 const {w,e}=setup(['aegisCore'],'ironOath');e.rupture=2;w.detonate(e,1);w.resolveExplosions();near(50000-e.hp,24*.6);
 const env=setup(['aegisCore'],'ironOath');env.w.explosions.push({x:860,y:500,damage:38,radius:110,hostile:true});env.w.resolveExplosions();near(50000-env.e.hp,38);
});
test('Frenzy remains useful but sustain gives up Blood Pact damage bonus; combined tank cannot heal through Barrier',()=>{
 const {w,e}=setup(['aegisCore','berserker'],'bloodPact');w.hp=50;w.barrier.gain(10,false);w.build.frenzy=4;w.beginAttack(false);
 near(w.attack.damage,18*1.25);w.hitEnemy(e,w.attack.damage,0,0,0,true,'light');near(50000-e.hp,18*1.25*.64);assert.equal(w.hp,50);assert.equal(w.build.healed,0);assert.equal(w.build.bloodCooldown,0);
 w.barrier.value=0;w.hitEnemy(e,1,0,0,0,true,'light');assert.equal(w.hp,52);
 const crossing=setup(['aegisCore'],'bloodPact');crossing.w.hp=50;crossing.w.barrier.aegisDamage=39;crossing.w.hitEnemy(crossing.e,10,0,0,0,true,'light');assert.equal(crossing.w.barrier.value,4);assert.equal(crossing.w.hp,50,'the hit which creates Barrier cannot also heal HP');
});
test('Aegis has a bounded4/s rate (5 with Oath) even on dense cleaves',()=>{
 const {w,e}=setup(['aegisCore'],'ironOath');for(let i=0;i<24;i++)w.hitEnemy(e,100,0,0,0,true,'heavy');assert.equal(w.barrier.value,5);
 w.barrier.step(1);w.hitEnemy(e,100,0,0,0,true,'heavy');assert.equal(w.barrier.value,10);
});
test('stationary tank survives longer than baseline under repeated real damage, but cannot sustain indefinitely',()=>{
 const lifetime=(mutations,curse)=>{const {w,e}=setup(mutations,curse);let seconds=0;
  for(let frame=0;frame<60*40&&w.hp>0;frame++){
   e.x=860;e.y=500;e.stagger=999;w.step({...idle,melee:true},dt);
   // Controlled external enemy hits every second through the actual hurt/Barrier pipeline.
   if(frame%60===59)w.hurt(12,0);
   seconds=(frame+1)/60;
  }return seconds;};
 const plain=lifetime([],null),tank=lifetime(['aegisCore','berserker','guardBreaker'],'bloodPact');
 assert.ok(tank>plain);assert.ok(tank<40,`tank stayed alive ${tank}s`);
});
