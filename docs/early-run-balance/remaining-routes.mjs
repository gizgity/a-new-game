// Focused follow-up: route-aware play, real progression unlocks, naturally sampled drafts.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const root=process.env.BALANCE_MODULE_ROOT||`${process.cwd()}/.test-build`;
const {CombatWorld}=await import(pathToFileURL(`${root}/combat.js`));
const {RunDirector}=await import(pathToFileURL(`${root}/run.js`));
const {defaultProfile,Progression,mutationPool,cursePool}=await import(pathToFileURL(`${root}/progression.js`));
const priorities={counter:['phantomEdge','ghostStep','staticRiposte','ironReversal','kineticBattery','bloodReclaimer'],ranged:['detonationSpecialist','glassSoul','catalyst','echoChamber','kineticBattery','parasiticMark']};
export function chooseRoute(draft,route){return draft.map((o,i)=>({i,rank:priorities[route].includes(o.id)?priorities[route].indexOf(o.id):100+i})).sort((a,b)=>a.rank-b.rank)[0].i;}
export function routeIntent(w,route,mode,tick,spacing='near'){
 const e=w.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-w.player.x,a.y-w.player.y)-Math.hypot(b.x-w.player.x,b.y-w.player.y))[0];
 let dx=0,dy=0,d=999,angle=w.player.angle;
 if(e){const x=e.x-w.player.x,y=e.y-w.player.y;d=Math.hypot(x,y)||1;angle=Math.atan2(y,x);const nx=x/d,ny=y/d;
  if(route==='ranged'){const min=spacing==='far'?320:spacing==='hybrid'?80:190,max=spacing==='far'?400:spacing==='hybrid'?130:260;const radial=d<min?-1:d>max?1:0;dx=nx*radial-ny*.65;dy=ny*radial+nx*.65;}
  if(route==='ranged'&&spacing==='bossSafe'){const boss=w.enemies.find(e=>e.hp>0&&e.kind==='boss');if(boss){const bx=boss.x-w.player.x,by=boss.y-w.player.y,bd=Math.hypot(bx,by)||1;const radial=bd<330?-1:bd>420?1:0;dx=bx/bd*radial-by/bd*.65;dy=by/bd*radial+bx/bd*.65;}}
  else if(d>65){dx=nx;dy=ny;}
 }
 // Steer inward near walls; same simple boundary rule in both variants, no projectile oracle.
 if(w.player.x<140)dx=Math.max(dx,.7);if(w.player.x>1460)dx=Math.min(dx,-.7);
 if(w.player.y<140)dy=Math.max(dy,.7);if(w.player.y>860)dy=Math.min(dy,-.7);
 // Threat sampled at decision cadence except explicit frame-perfect control.
 const dash=mode==='scheduled'?tick%180<18:mode==='observed'||mode==='reflex'?w.imminentThreat():false;
 return {angle,dx,dy,d,melee:route==='counter'||d<130,shoot:true,
  heavy:d<155&&tick%180<18,charged:tick%60<18&&w.chargedShots>0,ultimate:d<260&&tick%60<18,dash};
}

export function measure(){
 const reports=[],spacing=process.env.BALANCE_SPACING||'near';
 for(const route of spacing!=='near'?['ranged']:['counter','ranged'])for(const mode of ['none','scheduled','observed','reflex'])for(const seed of [17,73,159,314,808,1337,2026,4096]){
  const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w),profile=defaultProfile(),progression=new Progression(profile);
  r.seedOverride=seed;r.mutationPool=mutationPool(profile);r.cursePool=cursePool(profile);r.start();progression.beginRun();
  const drafts=[],snapshots=[],windows={},procs={phantom:0,static:0,charged:0,ultimate:0};let intent,lastDamage=0,lastHealed=0,lastPerfect=0,elite=null,boss=null;
  const hitEnemy=w.hitEnemy.bind(w);w.hitEnemy=(...args)=>{if(args[6]==='phantom')procs.phantom++;return hitEnemy(...args);};
  const fire=w.fire.bind(w);w.fire=(...args)=>{if(!args[3]&&args[4])procs.charged++;return fire(...args);};
  const window=()=>w.mutations.length===1&&w.curses.length===1?'onePlusOne':r.elapsed<60?'opening':r.bossDue?'boss':'later';
  for(let tick=0;tick<22000&&!r.result;tick++){
   if(!intent||tick%18===0)intent=routeIntent(w,route,mode,tick,spacing);
   const stage=window(),b=windows[stage]??={ticks:0,damage:0,healed:0,perfects:0};
   w.player.angle=intent.angle;const staticCharge=w.build.staticCharge,surge=w.surge;
   r.step({...intent,dash:mode==='reflex'?w.imminentThreat():intent.dash},1/60);
   if(staticCharge>0&&w.build.staticCharge===0&&w.shotCooldown>0)procs.static++;
   if(surge>=100&&w.surge<100)procs.ultimate++;
   b.ticks++;b.damage+=w.draftSignals.enemyHpDamage-lastDamage;b.healed+=w.draftSignals.healed-lastHealed;b.perfects+=w.perfectDodges-lastPerfect;
   lastDamage=w.draftSignals.enemyHpDamage;lastHealed=w.draftSignals.healed;lastPerfect=w.perfectDodges;
   // Production refreshes pools as first-run achievements unlock, without granting builds.
   progression.observe(w,r.result);r.mutationPool=mutationPool(profile);r.cursePool=cursePool(profile);
   if(!elite&&w.enemies.some(e=>e.kind==='bulwark'))elite=r.elapsed;
   if(!boss&&r.bossDue)boss=r.elapsed;
   if(r.ticks%1800===0)snapshots.push({time:r.elapsed,hp:w.hp,kills:w.kills,enemies:w.enemies.length});
   if(r.draft.length){const i=chooseRoute(r.draft,route);drafts.push({time:r.elapsed,id:r.draft[i].id,hp:w.hp,offers:r.draft.map(o=>o.id)});progression.offerDraft(r.draft.map(o=>o.id));if(!r.choose(i))throw Error('Invalid draft');}
  }
  reports.push({route,mode,seed,result:r.result,reason:r.reason,time:r.elapsed,hp:w.hp,kills:w.kills,dashes:w.stats.dashes,perfects:w.perfectDodges,detonations:w.detonations,procs,windows,elite,boss,bossHp:w.enemies.find(e=>e.kind==='boss')?.hp??null,mutations:w.mutations,curses:w.curses,damage:w.draftSignals.enemyHpDamage,healed:w.draftSignals.healed,drafts,snapshots});
 }
 fs.writeFileSync(process.env.BALANCE_OUTPUT||'docs/early-run-balance/evidence/remaining-baseline.json',JSON.stringify({spacing,method:'Controlled full runs: route-aware policies x 4 dash modes x 8 draft seeds. Fresh profile with Progression.observe and live pool updates, earned natural drafts, no Legacy/Anomaly/Ascension or resource/offer grants. Movement/aim decisions300ms; ranged uses melee only within130px, earned Charged/Surge, wall steering; Counter approaches melee. Near spacing190–260px; far320–400px. Observed samples imminent-threat at300ms; reflex everytick is machine control. Not human/device/population win rate.',reports},null,2));
 for(const route of [...new Set(reports.map(r=>r.route))])for(const mode of ['none','scheduled','observed','reflex']){const a=reports.filter(r=>r.route===route&&r.mode===mode);console.log(route,mode,'wins',a.filter(r=>r.result==='victory').length,'times',a.map(r=>r.time.toFixed(1)).join('/'),'perfects',a.map(r=>r.perfects).join('/'));}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)measure();
