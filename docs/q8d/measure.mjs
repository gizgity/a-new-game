// Q8D focused measurement, no runtime dependency. Run after npm test.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const {CombatWorld}=await import('../../.test-build/combat.js');
const {RunDirector}=await import('../../.test-build/run.js');
const {DIVERSITY_ROUTES,routeDraft}=await import('../../.test-build/config/playtests.js');
const strongCurse={'route-tank':'bloodPact','route-sustain':'ghostStep','route-counter':'parasiticMark','route-ranged':'parasiticMark'};
const reports=[];
for(const route of DIVERSITY_ROUTES) for(const build of ['normal','strong-candidate']) for(const policy of ['pursuit','role-aware']) for(const cadence of ['moderate','fast']) {
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.seedOverride=808;r.start();
 let hpDamage=0,selfDamage=0,healed=0,absorbed=0;
 const absorb=w.barrier.absorb.bind(w.barrier);w.barrier.absorb=(damage)=>{const rest=absorb(damage);absorbed+=damage-rest;return rest;};
 const hurt=w.hurt.bind(w);w.hurt=(damage,angle,enemy=true)=>{const hp=w.hp,barrier=w.barrier.value;hurt(damage,angle,enemy);const loss=Math.max(0,hp-w.hp);if(enemy)hpDamage+=loss;else selfDamage+=loss;};
 const heal=w.healPlayer.bind(w);w.healPlayer=(...args)=>{const n=heal(...args);healed+=n;return n;};
 const pay=w.payBloodMiss.bind(w);w.payBloodMiss=()=>{const hp=w.hp;pay();selfDamage+=hp-w.hp;};
 const drafts=[],bins=[],hpTimeline=[];let elite=null,boss=null,warning=null,phase2=null,combo=false;
 let total=0,count=0,empty=0,over30=0,max=0,bossSteps=0,steps=0;
 for(let i=0;i<23000&&!r.result;i++) {
  const target=w.enemies.reduce((a,b)=>!a||Math.hypot(b.x-w.player.x,b.y-w.player.y)<Math.hypot(a.x-w.player.x,a.y-w.player.y)?b:a,null);
  let dx=0,dy=0,d=0;
  const ranged=route.id==='route-ranged'&&policy==='role-aware';
  if(target){dx=target.x-w.player.x;dy=target.y-w.player.y;d=Math.hypot(dx,dy);w.player.angle=Math.atan2(dy,dx);
   if(ranged){const nx=dx/(d||1),ny=dy/(d||1),radial=d<190?-1:d>260?1:0;dx=nx*radial-ny*.65;dy=ny*radial+nx*.65;const mag=Math.hypot(dx,dy);dx/=mag||1;dy/=mag||1;}
   else if(d<65)dx=dy=0;else{dx/=d;dy/=d;}
  }
  const prior=r.ticks;const beforeKills=w.kills;
  r.step({dx,dy,melee:!ranged||d<130,shoot:true,heavy:i%(cadence==='fast'?50:90)===0,charged:i%(cadence==='fast'?20:45)===0,ultimate:i%60===0,dash:w.imminentThreat()&&i%2===0},1/60);steps++;
  if(boss)bossSteps++;
  if(!elite&&w.enemies.some(e=>e.kind==='bulwark'))elite={t:r.elapsed,kills:w.kills,hp:w.hp};
  if(!warning&&r.bossWarning>0)warning={t:r.elapsed,kills:w.kills,hp:w.hp};
  if(!boss&&r.bossDue)boss={t:r.elapsed,kills:w.kills,hp:w.hp,damage:hpDamage};
  const b=w.enemies.find(e=>e.kind==='boss');if(!phase2&&b?.enraged)phase2={t:r.elapsed,hp:w.hp,bossHp:b.hp};combo||=!!(b?.followup||b?.comboFinish);
  if(r.ticks>prior&&!r.bossDue&&!r.bossWarning){const n=w.enemies.filter(e=>e.kind!=='bulwark'&&e.kind!=='boss').length;total+=n;count++;if(!n)empty++;if(n>30)over30++;max=Math.max(n,max);const k=Math.floor(r.elapsed/30);bins[k]??={start:k*30,ticks:0,sum:0,empty:0,kills:0,max:0};let bin=bins[k];bin.ticks++;bin.sum+=n;bin.empty+=n===0?1:0;bin.kills+=w.kills-beforeKills;bin.max=Math.max(bin.max,n);}
  if(r.ticks%600===0&&r.ticks!==prior)hpTimeline.push({t:r.elapsed,hp:w.hp,enemyDamage:hpDamage,selfDamage,healed});
  if(r.draft.length){
   const second=r.draftKind==='curse'&&w.curses.length>0;
   const choiceRoute=second&&build==='strong-candidate'?{...route,curse:strongCurse[route.id]}:route;
   r.draft=routeDraft(choiceRoute,r.draftKind,w.mutations,w.curses,r.draft);
   const want=r.draftKind==='curse'?choiceRoute.curse:(drafts.length===0?{'route-tank':'aegisCore','route-sustain':'bloodReclaimer','route-counter':'phantomEdge','route-ranged':'detonationSpecialist'}[route.id]:route.mutations.find(id=>!w.mutations.includes(id)));
   const index=r.draft.findIndex(o=>o.id===want);assert.ok(index>=0,`${route.id} missing ${want}`);
   drafts.push({t:r.elapsed,kills:w.kills,hp:w.hp,choice:want,action:r.draft[index].action??'add'});assert.equal(r.choose(index),true);
  }
 }
 assert.ok(r.result,'unresolved run');
 reports.push({route:route.id,build,policy,cadence,seed:808,mutations:w.mutations,curses:w.curses,drafts,elite,warning,boss,phase2,combo,result:r.result,reason:r.reason,runSeconds:r.elapsed,fixedStepSeconds:steps/60,bossTTK:r.result==='victory'?r.elapsed-boss.t:null,bossStepSeconds:bossSteps/60,kills:w.kills,killsPerRunSecond:w.kills/r.elapsed,hp:w.hp,maxHp:w.maxHp,hpDamage,selfDamage,healed,absorbed,density:{mean:total/count,max,emptySeconds:empty/60,over30Seconds:over30/60,measuredSeconds:count/60},bins:bins.filter(Boolean).map(b=>({start:b.start,seconds:b.ticks/60,mean:b.sum/b.ticks,max:b.max,emptySeconds:b.empty/60,killsPerSecond:b.kills/(b.ticks/60)})),hpTimeline,perfects:w.perfectDodges,detonations:w.detonations});
}
fs.writeFileSync('docs/q8d/evidence/runs.json',JSON.stringify({baseline:'7625fa2',runtimeChanged:false,method:'Draft route offers controlled; build earned at six real milestones. No HP/kill/clock grants. strong-candidate adds second Curse at Draft5, not guaranteed stronger. Predicate Perfect bot, deterministic seed808; policies pursuit vs role-aware ranged orbit190–260. Density common enemies excludes warning/Boss; clocks are simulation seconds, not wall time. Damage measured around original hurt; heal around original healPlayer, draft heal separate. FixedStepSeconds includes hitstop/transform but no human draft/pause time.',runs:reports},null,2));
console.table(reports.map(x=>({route:x.route,build:x.build,policy:x.policy,cadence:x.cadence,result:x.result,t:x.runSeconds.toFixed(2),kills:x.kills,hp:x.hp.toFixed(1),damage:x.hpDamage.toFixed(1),mean:x.density.mean.toFixed(2),empty:x.density.emptySeconds.toFixed(2),boss:x.bossTTK?.toFixed(2),drafts:x.drafts.length})));
