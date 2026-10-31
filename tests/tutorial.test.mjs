import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Tutorial} from '../.test-build/Tutorial.js';
import {CombatWorld} from '../.test-build/combat.js';
import {defaultProfile,validateProfile,saveProfile,loadProfile} from '../.test-build/progression.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
test('tutorial uses real movement, melee mark, shot detonation, Heavy and Dash in order',()=>{
 const w=new CombatWorld({x:800,y:500,angle:0}),t=new Tutorial(w);
 const ticks=(input,n)=>{for(let i=0;i<n;i++)t.step({...idle,...input},1/60);};
 ticks({shoot:true},1);assert.equal(t.stepIndex,0);
 ticks({dx:1},20);assert.equal(t.stepIndex,1);
 ticks({melee:true},15);assert.equal(t.stepIndex,2);
 ticks({},30);ticks({shoot:true},40);assert.equal(t.stepIndex,3);
 ticks({heavy:true},1);assert.equal(t.stepIndex,4);
 const beforeDash={x:w.player.x,y:w.player.y};
 ticks({dash:true},1);assert.equal(t.complete,false);assert.equal(t.stepIndex,5);assert.ok(w.dashTime>0);
 ticks({},20);assert.ok(t.complete);assert.equal(w.dashTime,0);
 assert.ok(Math.hypot(w.player.x-beforeDash.x,w.player.y-beforeDash.y)>80);
 const done=JSON.stringify(w);ticks({melee:true,shoot:true},60);assert.equal(JSON.stringify(w),done);
 assert.equal(w.practice,false);
});
test('death restarts current practice step without advancing',()=>{
 const w=new CombatWorld({x:800,y:500,angle:0}),t=new Tutorial(w);
 for(let i=0;i<16;i++)t.step({...idle,dx:1},1/60);
 w.hp=0;t.step(idle,1/60);assert.equal(t.stepIndex,1);assert.equal(w.hp,w.maxHp);assert.equal(w.enemies.length,1);
});
test('new, returning, completed and skipped tutorial save migration',()=>{
 assert.equal(defaultProfile().tutorialDone,false);
 const old=defaultProfile();delete old.tutorialDone;old.totals.runs=2;assert.equal(validateProfile(old).tutorialDone,true);
 const fresh=defaultProfile();assert.equal(validateProfile(fresh).tutorialDone,false);
 fresh.tutorialDone=true;let data=new Map();const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.ok(saveProfile(fresh,storage));assert.equal(loadProfile(storage).tutorialDone,true);
 assert.deepEqual(loadProfile(storage).totals,defaultProfile().totals);
});
