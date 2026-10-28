import test from 'node:test';import assert from 'node:assert/strict';
import {CombatWorld} from '../.test-build/combat.js';
const idle={dx:0,dy:0};
function setup(){const w=new CombatWorld({x:800,y:500,angle:0});w.enemies=[];w.practice=false;w.ascension.seal=4;return w;}
test('Pulse/Echo VFX originate once at actual impact, even when dodged, never warning or unsafe cancellation',()=>{
 for(const kind of ['pulse','echo']){
  const w=setup(),a=w.ascension;a.zones=[{kind,x:900,y:500,time:.1,active:0,hit:false}];a.step(.05);assert.equal(w.impacts.length,0);a.step(.05);
  assert.equal(w.impacts.filter(i=>i.kind===(kind==='pulse'?'sealPulse':'sealEcho')).length,1);assert.equal(w.hp,100);
  a.step(.01);assert.equal(w.impacts.length,1);assert.equal(w.impacts[0].radius,kind==='pulse'?48:52);
  a.zones=[{kind,x:800,y:500,time:.1,active:0,hit:false}];w.anomaly.suspended=true;a.step(.2);assert.equal(w.impacts.length,1);
 }
});
test('Fracture contact VFX requires an admitted damaging Static proc, no whiff/primarykill/repeatroot',()=>{
 const run=(mode)=>{const w=setup();w.mutations=['staticRiposte'];w.ascension.fractured=mode==='normal'?null:'staticRiposte';
  if(mode!=='whiff'){w.spawnEnemy('grunt',mode==='lethal'?1:1000);Object.assign(w.enemies.at(-1),{x:850,y:500});}
  w.build.staticCharge=2;w.fire(800,500,0,false,true);w.stepProjectiles(.05);return w;};
 for(const mode of ['normal','whiff','lethal','extra']){const w=run(mode);assert.equal(w.impacts.filter(i=>i.kind==='sealFracture').length,mode==='extra'?1:0,mode);}
});
test('VFX life freezes with hitstop/transform and resets, without changing Hunter or damage clocks',()=>{
 const w=setup();w.ascension.zones=[{kind:'echo',x:900,y:500,time:.01,active:0,hit:false}];w.ascension.step(.02);const cue=w.impacts[0];
 w.hitstop=1;w.step(idle,.1);assert.equal(cue.life,cue.duration);
 w.hitstop=0;w.spawnEnemy('boss');w.enemies.at(-1).hp=700;w.step(idle,.1);assert.equal(cue.life,cue.duration);
 w.reset();assert.equal(w.impacts.length,0);assert.equal(w.ascension.zones.length,0);
});
test('Hunter end cue follows real expiry once, not a repeating arbitrary render timer',()=>{
 const w=setup();w.spawnEnemy('grunt');const e=w.enemies.at(-1);w.ascension.hunterId=e.id;w.ascension.hunterTime=.01;w.ascension.step(.02);
 const cues=w.impacts.filter(i=>i.kind==='sealHunterEnd');assert.equal(cues.length,1);assert.equal(cues[0].x,e.x);w.ascension.step(.02);assert.equal(w.impacts.filter(i=>i.kind==='sealHunterEnd').length,1);
});
