import assert from 'node:assert/strict';import fs from 'node:fs';
const baseline=process.env.BASELINE_BUILD||'/tmp/q12e-baseline';
const base=await import(baseline+'/combat.js'),next=await import('../../.test-build/combat.js');
const BaseRun=(await import(baseline+'/run.js')).RunDirector,NextRun=(await import('../../.test-build/run.js')).RunDirector;
const reports=[];
function simulate(World,Run,seal,id,loadout){
 const w=new World({x:800,y:500,angle:0}),r=new Run(w);r.seedOverride=808;r.start();w.ascension.seal=seal;if(loadout)w.legacy.equip(loadout);
 if(id)w.anomaly.equip(id);w.mutations=['staticRiposte','phantomEdge','bloodReclaimer','catalyst'];w.setCurses(['deathEcho','huntedVessel']);w.ascension.fractured=seal>=3?'staticRiposte':null;
 const snapshots=[];
 for(let i=0;i<10800 && !r.result;i++){
  const target=w.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-w.player.x,a.y-w.player.y)-Math.hypot(b.x-w.player.x,b.y-w.player.y))[0];
  if(target)w.player.angle=Math.atan2(target.y-w.player.y,target.x-w.player.x);
  r.step({dx:Math.cos(i/150),dy:Math.sin(i/150),shoot:true,melee:i%3===0,heavy:i%50===0,charged:i%20===0,dash:i%150===0},1/60);
  if(r.draft.length)r.choose(0);
  if(i%300===0 || r.result){const snapshot=JSON.parse(JSON.stringify(w));snapshots.push({i,ticks:r.ticks,result:r.result,world:snapshot});}
 }
 return snapshots;
}
const {SIGILS,BRANCHES,ANOMALIES}=await import('../../.test-build/config/legacy.js');
const loadouts=[...SIGILS.map(sigil=>({sigil,branch:null})),...Object.entries(BRANCHES).map(([branch,sigil])=>({sigil,branch}))];
for(const [index,loadout] of loadouts.entries())for(const id of [null,...ANOMALIES]){
 const seal=index%5;
 const before=simulate(base.CombatWorld,BaseRun,seal,id,loadout),after=simulate(next.CombatWorld,NextRun,seal,id,loadout);
 assert.deepEqual(after,before,`${seal}/${id}/${JSON.stringify(loadout)}`);reports.push({seal,anomaly:id,loadout,snapshots:after.length,identical:true});
}
fs.writeFileSync('docs/q12e/evidence/parity.json',JSON.stringify({baseline:'04640b4 / Q12D7ead766 + latest balance651e3bf',method:'Full serialized combat world including Q12A audio + Q12B feedback. Include every serialized world field. Same seed808/input at300tick snapshots up to10800ticks or natural defeat. 18loadouts x7Anomaly variants, distributed Seal0–4, four Mutations + two Curses. No HP grants; not balance/feel evidence.',cases:reports},null,2));console.log('PASS full-world parity',reports.length);
