import fs from 'node:fs';
import {CombatWorld} from '../../.test-build/combat.js';
import {RunDirector} from '../../.test-build/run.js';
import {defaultProfile,Progression,mutationPool,cursePool} from '../../.test-build/progression.js';
import {routeIntent,chooseRoute} from '../early-run-balance/remaining-routes.mjs';
const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w),p=defaultProfile(),progression=new Progression(p);
r.seedOverride=808;r.mutationPool=mutationPool(p);r.cursePool=cursePool(p);r.start();progression.beginRun();
let intent,boss=null;const drafts=[];
for(let tick=0;tick<22000&&!r.result;tick++){
 if(!intent||tick%18===0)intent=routeIntent(w,'counter','observed',tick);
 w.player.angle=intent.angle;r.step(intent,1/60);progression.observe(w,r.result);r.mutationPool=mutationPool(p);r.cursePool=cursePool(p);
 if(!boss&&r.bossDue)boss={time:r.elapsed,kills:w.kills};
 if(r.draft.length){const i=chooseRoute(r.draft,'counter');drafts.push({time:r.elapsed,id:r.draft[i].id});progression.offerDraft(r.draft.map(o=>o.id));r.choose(i);}
}
const report={method:'Simulation only, seed808, production first-run pools refreshed through real progression, policy observed every300ms; no HP/resources/build/clock/offer grants. Not browser/human play.',result:r.result,time:r.elapsed,hp:w.hp,kills:w.kills,boss,drafts};
fs.writeFileSync('docs/q13/evidence/full-simulation.json',JSON.stringify(report,null,2));console.log(report);
