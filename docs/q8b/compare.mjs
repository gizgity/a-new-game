// Focused deterministic pacing simulation; route offers, real combat/HP/resources, no clock/kill grants.
import fs from 'node:fs';
const reports=[];
for(const version of ['baseline','q8b']) {
 const dir=version==='baseline'?'/tmp/q8b-baseline':process.cwd()+'/.test-build';
 const {CombatWorld}=await import(dir+'/combat.js'),{RunDirector}=await import(dir+'/run.js');
 const {DIVERSITY_ROUTES,routeDraft}=await import(dir+'/config/playtests.js');
 for(const route of DIVERSITY_ROUTES) for(const style of ['normal','fast']) {
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.seedOverride=808;r.start();
 const drafts=[];let boss=null,elite=null;
 for(let i=0;i<22000&&!r.result;i++) {
 const target=w.enemies.reduce((a,b)=>!a||Math.hypot(b.x-w.player.x,b.y-w.player.y)<Math.hypot(a.x-w.player.x,a.y-w.player.y)?b:a,null);
 let dx=0,dy=0;
 if(target){dx=target.x-w.player.x;dy=target.y-w.player.y;w.player.angle=Math.atan2(dy,dx);const d=Math.hypot(dx,dy);if(d<65){dx=dy=0;}else{dx/=d;dy/=d;}}
 const threat=w.imminentThreat();
 r.step({dx,dy,melee:true,shoot:true,heavy:i%(style==='fast'?50:130)===0,charged:i%(style==='fast'?20:90)===0,ultimate:i%60===0,dash:threat&&i%2===0},1/60);
 if(!elite&&w.enemies.some(e=>e.kind==='bulwark'))elite={t:r.elapsed,kills:w.kills};
 if(!boss&&r.bossDue)boss={t:r.elapsed,kills:w.kills};
 if(r.draft.length){drafts.push({t:r.elapsed,kills:w.kills});r.draft=routeDraft(route,r.draftKind,w.mutations,w.curses,r.draft);const want=r.draftKind==='curse'?route.curse:(drafts.length===1?{'route-tank':'aegisCore','route-sustain':'bloodReclaimer','route-counter':'phantomEdge','route-ranged':'detonationSpecialist'}[route.id]:route.mutations.find(id=>!w.mutations.includes(id)));r.choose(Math.max(0,r.draft.findIndex(o=>o.id===want)));}
 }
 reports.push({version,route:route.id,style,drafts,elite,boss,end:r.elapsed,result:r.result,reason:r.reason,kills:w.kills,hp:w.hp});
 }
}
fs.writeFileSync('docs/q8b/comparison.json',JSON.stringify(reports,null,2));console.table(reports.map(({drafts,...r})=>({...r,drafts:drafts.map(d=>d.t.toFixed(1)).join('/'),elite:r.elite?.t,boss:r.boss?.t})));
