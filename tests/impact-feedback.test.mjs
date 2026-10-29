import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { FEEDBACK } from '../.test-build/config/feedback.js';
import { impactOffset, canStartImpact } from '../.test-build/impactMotion.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
const world=()=>{const w=new CombatWorld({x:800,y:500,angle:0});w.enemies=[];return w;};
test('confirmed hits classify Light/Medium/Heavy; zero damage and dead target emit no feedback',()=>{
 for(const [cue,tier] of [['light','light'],['light2','light'],['shotHit','light'],['light3','medium'],['chargedHit','medium'],['heavy','heavy'],['blast','heavy']]){
  const w=world();w.spawnEnemy('grunt',850,500);const e=w.enemies[0];
  w.hitEnemy(e,1,0,0,0,true,cue);
  assert.equal(w.feedback,null);assert.equal(e.feedbackFlash,FEEDBACK[tier].flash);
 }
 const w=world();w.spawnEnemy('grunt',850,500);w.hitEnemy(w.enemies[0],0,0,0,0,true,'heavy');
 assert.equal(w.feedback,null);assert.equal(w.impacts.length,0);
 w.enemies[0].hp=0;w.hitEnemy(w.enemies[0],10,0,0,0,true,'heavy');assert.equal(w.feedback,null);
});
test('crowd coalesces max tier and envelopes never accumulate displacement',()=>{
 const w=world();w.spawnEnemy('bulwark');const e=w.enemies[0];e.hp=10000;
 for(let i=0;i<100;i++)w.hitEnemy(e,1,0,0,0,true,i===1?'heavy':'light');
 assert.equal(w.feedback,'heavy');assert.ok(w.impacts.length<=24);
 // User chose the legacy simulation exception: max, never additive.
 assert.equal(w.hitstop,0.085);
 for(const mobile of [false,true])for(const tier of ['light','medium','heavy']){
  for(let i=0;i<1000;i++)assert.ok(Math.abs(impactOffset(tier,i/1000,mobile))<=FEEDBACK[tier].pixels*(mobile?FEEDBACK.mobileScale:1));
  assert.equal(impactOffset(tier,0.1,mobile),0);
 }
 w.step(idle,1/60);assert.equal(w.feedback,null);w.reset();assert.equal(w.feedback,null);
});
test('miss/cancel/rejected Charged never produce impact; Perfect adds no hitstop',()=>{
 const w=world();for(let i=0;i<30;i++){w.step({...idle,melee:true},1/60);assert.equal(w.feedback,null);}
 const v=world();v.step({...idle,heavy:true},1/60);v.step({...idle,dash:true},1/60);
 for(let i=0;i<30;i++){v.step(idle,1/60);assert.equal(v.feedback,null);}
 const u=world();u.step({...idle,charged:true},1/60);assert.equal(u.feedback,null);
 u.projectiles.push({x:800+920/60,y:500,vx:0,vy:0,hostile:true,life:1});u.step({...idle,dash:true},1/60);
 assert.equal(u.perfectDodges,1);assert.equal(u.hitstop,0);
});

test('camera: only player Heavy/Detonate on Elite/Boss, with a quiet interval under continuous hits',()=>{
 for(const kind of ['grunt','archer','volatile','bulwark','boss'])for(const cue of ['light','light2','light3','shotHit','chargedHit','heavy','blast'])for(const source of [true,false]){
  const w=world();w.spawnEnemy(kind);w.hitEnemy(w.enemies[0],1,0,0,0,true,cue,undefined,source);
  assert.equal(w.feedback,source&&['bulwark','boss'].includes(kind)&&['heavy','blast'].includes(cue)?'heavy':null,`${kind}/${cue}/${source}`);
 }
 let age=FEEDBACK.cooldown,bursts=0,active=0;
 for(let i=0;i<120;i++){
  if(canStartImpact('heavy',age)){age=0;bursts++;}
  if(age<FEEDBACK.decay)active++;
  age+=1/60;
 }
 assert.ok(bursts<=5);assert.ok(active<=35); // At least 70% of a spammed timeline remains still.
 assert.equal(canStartImpact('heavy',.1),false);assert.equal(canStartImpact(null,1),false);
});
