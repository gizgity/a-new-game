import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
const world=()=>{const w=new CombatWorld({x:800,y:500,angle:0});for(const e of w.enemies)Object.assign(e,{x:1200,y:800,stagger:100});return w;};
function steps(w,n,input=idle){const events=[];for(let i=0;i<n;i++){w.step(input,1/60);events.push(...w.audioEvents);}return events;}
test('audio: swing/fire on accepted action, hit only on contact; rejected Charged is silent',()=>{
 const w=world();let events=steps(w,30,{...idle,melee:true});assert.ok(events.some(e=>e.cue==='swing'));assert.ok(!events.some(e=>e.cue==='light'));
 events=steps(w,30,{...idle,shoot:true});assert.ok(events.some(e=>e.cue==='gun'));assert.ok(!events.some(e=>e.cue==='shotHit'));
 events=steps(w,30,{...idle,charged:true});assert.ok(!events.some(e=>e.cue==='chargedGun'));
});
test('audio: actual stack growth accents cap at3; Heavy cancel never hits',()=>{
 const w=world(),e=w.enemies[0];Object.assign(e,{x:855,y:500,hp:5000,maxHp:5000});
 const events=[];for(let i=0;i<3;i++){Object.assign(e,{x:855,y:500});events.push(...steps(w,30,{...idle,melee:true}));steps(w,1);}
 for(const cue of ['stack1','stack2','stack3'])assert.ok(events.some(e=>e.cue===cue),cue);
 const v=world();v.step({...idle,heavy:true},1/60);assert.ok(v.soundEvents.includes('heavySwing'));v.step({...idle,dash:true},1/60);assert.ok(!steps(v,30).some(e=>e.cue==='heavy'));
});
test('audio: Dash differs from confirmed Perfect; explosion metadata keeps delayed root identity',()=>{
 const w=world();assert.ok(steps(w,1,{...idle,dash:true}).some(e=>e.cue==='dash'));assert.ok(!w.soundEvents.includes('perfect'));
 const v=world();v.projectiles.push({x:800+920/60,y:500,vx:0,vy:0,hostile:true,life:1});assert.ok(steps(v,1,{...idle,dash:true}).some(e=>e.cue==='perfect'));
 const u=world();for(let i=0;i<3;i++)Object.assign(u.enemies[i],{x:855+i*15,y:500,hp:5000,rupture:3});
 const events=steps(u,60,{...idle,shoot:true}).filter(e=>e.root!==undefined);assert.ok(events.length>=2);assert.ok(events.some(e=>e.hop>0));assert.ok(events.every(e=>Number.isInteger(e.root)));
});
