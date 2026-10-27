import test from 'node:test';import assert from 'node:assert/strict';
import {CombatWorld} from '../.test-build/combat.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
function setup(id){const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];w.anomaly.equip(id);return w;}
function enemy(w,x=850){w.spawnEnemy('grunt',1000);const e=w.enemies.at(-1);Object.assign(e,{x,y:500,stagger:99,cooldown:99});return e;}
function tick(w,n,input=idle){for(let i=0;i<n;i++){w.hitstop=0;w.step(input,1/60);}}
test('Blood VFX only accompanies real finisher energy gain; no cue at cap, during cooldown or on whiff',()=>{
 for(const mode of ['gain','cap','cooldown','whiff']){
  const w=setup('bloodMoon');if(mode!=='whiff')enemy(w);w.combo=2;w.comboWindow=1;
  if(mode==='cap'){w.chargedShots=3;w.chargePoints=2;}if(mode==='cooldown')w.anomaly.finisherCooldown=2;
  tick(w,11,{...idle,melee:true});const cues=w.impacts.filter(x=>x.kind==='anomalyFinisher');assert.equal(cues.length,mode==='gain'?1:0,mode);
  assert.equal(w.hp,100);assert.equal(w.detonations,0);
 }
});
test('Static/Seal/Echo visual provenance follows actual bounded combat triggers',()=>{
 const w=setup('staticField');enemy(w);w.perfectAvailable=true;w.rewardPerfectDodge();const arcs=w.impacts.filter(i=>i.kind==='anomalyCounter');assert.equal(arcs.length,1);assert.equal(arcs[0].sourceX,w.player.x);assert.equal(arcs[0].sourceY,w.player.y);
 const s=setup('brokenSeal'),e=enemy(s);e.stagger=0;s.hitEnemy(e,1,0,1,.6,true,'heavy');assert.equal(s.impacts.filter(i=>i.kind==='anomalySeal').length,1);s.hitEnemy(e,1,0,1,.6,true,'heavy');assert.equal(s.impacts.filter(i=>i.kind==='anomalySeal').length,1);
 const c=setup('echoChamber'),a=enemy(c,850),b=enemy(c,1030);a.rupture=b.rupture=1;c.detonate(a,1);c.resolveExplosions();const relays=c.impacts.filter(i=>i.kind==='anomalyRelay');assert.equal(relays.length,1);assert.equal(relays[0].x,b.x);assert.equal(relays[0].sourceX,850);assert.equal(b.rupture,0);assert.equal(c.detonations,1);
});
test('Hazard impact tags preserve Storm/Ground/Echo identity; visual clocks freeze/reset with combat',()=>{
 for(const id of ['fracturedStorm','volatileGround','echoChamber']){
  const w=setup(id);if(id==='echoChamber')w.anomaly.retaliate(enemy(w));else{w.anomaly.clock=0;w.anomaly.step(.01);}
  w.anomaly.step(2);const cue=w.impacts.find(i=>i.kind==='anomalyStrike');assert.equal(cue.anomaly,id);
  const life=cue.life;w.hitstop=1;w.step(idle,1/60);assert.equal(cue.life,life);w.reset();assert.equal(w.impacts.length,0);assert.equal(w.anomaly.active,null);
 }
});
