import assert from 'node:assert/strict';import fs from 'node:fs';
const baseline=process.env.BASELINE_BUILD||'/tmp/q9d-vfx-baseline';
const base=await import(baseline+'/combat.js'),next=await import('../../../.test-build/combat.js');
const BaseRun=(await import(baseline+'/run.js')).RunDirector,NextRun=(await import('../../../.test-build/run.js')).RunDirector;
const reports=[];
function simulate(World,Run,seal,id){
 const w=new World({x:800,y:500,angle:0}),r=new Run(w);r.seedOverride=808;r.start();w.ascension.seal=seal;
 if(id)w.anomaly.equip(id);w.mutations=['staticRiposte','phantomEdge'];w.ascension.fractured=seal>=3?'staticRiposte':null;
 const snapshots=[];
 for(let i=0;i<10800 && !r.result;i++){
  const target=w.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-w.player.x,a.y-w.player.y)-Math.hypot(b.x-w.player.x,b.y-w.player.y))[0];
  if(target)w.player.angle=Math.atan2(target.y-w.player.y,target.x-w.player.x);
  r.step({dx:Math.cos(i/150),dy:Math.sin(i/150),shoot:true,melee:i%3===0,heavy:i%50===0,charged:i%20===0,dash:i%150===0},1/60);
  if(r.draft.length)r.choose(0);
  if(i%300===0 || r.result){const snapshot=JSON.parse(JSON.stringify(w));delete snapshot.impacts;snapshots.push({i,ticks:r.ticks,result:r.result,world:snapshot});}
 }
 return snapshots;
}
for(const seal of [0,1,2,3,4])for(const id of [null,'bloodMoon','fracturedStorm']){
 const before=simulate(base.CombatWorld,BaseRun,seal,id),after=simulate(next.CombatWorld,NextRun,seal,id);
 assert.deepEqual(after,before,`Seal${seal}/${id}`);reports.push({seal,anomaly:id,snapshots:after.length,identical:true});
}
fs.writeFileSync('docs/q9d/vfx-production/evidence/parity.json',JSON.stringify({baseline:'afd084a compiled snapshot before VFX changes',method:'Full serialized combat state excluding presentation-only impacts at300tick intervals, seeded Draft+combat, up to180s or natural defeat. No HP grants; not balance or human input evidence.',cases:reports},null,2));console.log('PASS combat parity',reports.length);
