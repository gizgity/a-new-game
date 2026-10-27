// Focused integration smoke reuses Q8D's accepted bot policy; never a balance or human-playtest verdict.
import fs from 'node:fs';import assert from 'node:assert/strict';
import {CombatWorld} from '../../.test-build/combat.js';import {RunDirector} from '../../.test-build/run.js';
import {DIVERSITY_ROUTES,routeDraft} from '../../.test-build/config/playtests.js';
import {ANOMALIES,LEGACY_IDS} from '../../.test-build/config/legacy.js';
import {emptyLegacy,beginLegacy,chooseAnomaly} from '../../.test-build/legacy.js';
const reports=[];
for(const route of DIVERSITY_ROUTES)for(const anomaly of [null,...ANOMALIES]){
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.seedOverride=808;r.start();
 const s=emptyLegacy();s.unlocks=[...LEGACY_IDS];if(anomaly){r.anomalyTicket=beginLegacy(s,1,808);s.ticket.anomalyOffers=[anomaly,ANOMALIES.find(id=>id!==anomaly)];}
 const loadout=({'route-tank':{sigil:'water',branch:'undertow'},'route-sustain':{sigil:'fire',branch:'wildfire'},'route-counter':{sigil:'lightning',branch:'arcRelay'},'route-ranged':{sigil:'ice',branch:'crystalEcho'}})[route.id];w.legacy.equip(loadout);
 const drafts=[];let offer=null,elite=null,boss=null,phase2=false,combo=false,maxEnemies=0;
 for(let i=0;i<23000&&!r.result;i++){
  const target=w.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-w.player.x,a.y-w.player.y)-Math.hypot(b.x-w.player.x,b.y-w.player.y))[0];
  let dx=0,dy=0,d=0;const ranged=route.id==='route-ranged';
  if(target){dx=target.x-w.player.x;dy=target.y-w.player.y;d=Math.hypot(dx,dy);w.player.angle=Math.atan2(dy,dx);if(ranged){const nx=dx/(d||1),ny=dy/(d||1),radial=d<190?-1:d>260?1:0;dx=nx*radial-ny*.65;dy=ny*radial+nx*.65;const mag=Math.hypot(dx,dy);dx/=mag||1;dy/=mag||1;}else if(d<65)dx=dy=0;else{dx/=d;dy/=d;}}
  r.step({dx,dy,melee:!ranged||d<130,shoot:true,heavy:i%50===0,charged:i%20===0,ultimate:i%60===0,dash:w.imminentThreat()&&i%2===0},1/60);
  maxEnemies=Math.max(maxEnemies,w.enemies.length);if(!elite&&w.enemies.some(e=>e.kind==='bulwark'))elite=r.elapsed;if(!boss&&r.bossDue)boss=r.elapsed;
  const b=w.enemies.find(e=>e.kind==='boss');phase2||=!!b?.enraged;combo||=!!(b?.followup||b?.comboFinish);
  if(r.anomalyPending){assert.equal(offer,null);offer=r.elapsed;assert.ok(offer>=135);assert.equal(chooseAnomaly(s,0),true);assert.equal(r.resolveAnomaly(),true);}
  if(r.draft.length){const want=r.draftKind==='curse'?route.curse:(drafts.length===0?{'route-tank':'aegisCore','route-sustain':'bloodReclaimer','route-counter':'phantomEdge','route-ranged':'detonationSpecialist'}[route.id]:route.mutations.find(id=>!w.mutations.includes(id)));r.draft=routeDraft(route,r.draftKind,w.mutations,w.curses,r.draft);const choice=r.draft.findIndex(o=>o.id===want);assert.ok(choice>=0);drafts.push({time:r.elapsed,id:want});assert.equal(r.choose(choice),true);}
  assert.ok(w.anomaly.zones.length<=2);assert.ok(w.projectiles.length<=80);assert.ok(w.enemies.every(e=>Number.isFinite(e.hp)&&e.rupture<=3));
 }
 assert.ok(r.result);assert.ok(r.elapsed<=300);if(anomaly&&r.elapsed>=135)assert.ok(offer!==null);
 reports.push({route:route.id,anomaly,loadout,offer,result:r.result,reason:r.reason,time:r.elapsed,kills:w.kills,hp:w.hp,perfects:w.perfectDodges,detonations:w.detonations,elite,boss,phase2,combo,maxEnemies,drafts});
}
fs.writeFileSync('docs/q9c/evidence/combat-smoke.json',JSON.stringify({method:'Q8D fast role-aware bot, seed808, 4 routes x (none + 6 anomalies). Legacy unlocked fixture at start; drafts earned via real milestones; no HP/kill/clock grants. Bot does not deliberately avoid anomaly zones. Not balance approval or human/device input evidence.',runs:reports},null,2));
console.table(reports.map(({route,anomaly,result,time,offer,kills,hp})=>({route,anomaly,result,time,offer,kills,hp})));
