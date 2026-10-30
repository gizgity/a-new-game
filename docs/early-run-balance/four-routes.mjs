// Same action cadence for all four routes, natural offers and live first-run progression.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {routeIntent} from './remaining-routes.mjs';
const root=process.env.BALANCE_MODULE_ROOT||`${process.cwd()}/.test-build`;
const {CombatWorld}=await import(pathToFileURL(`${root}/combat.js`));
const {RunDirector}=await import(pathToFileURL(`${root}/run.js`));
const {defaultProfile,Progression,mutationPool,cursePool}=await import(pathToFileURL(`${root}/progression.js`));
const routes={
 tank:['aegisCore','ironOath','guardBreaker','ironReversal','kineticBattery','soulAnchor'],
 sustain:['bloodReclaimer','parasiticMark','catalyst','echoChamber','kineticBattery','soulAnchor'],
 counter:['phantomEdge','ghostStep','staticRiposte','ironReversal','kineticBattery','bloodReclaimer'],
 ranged:['detonationSpecialist','glassSoul','catalyst','echoChamber','kineticBattery','parasiticMark'],
};
const validationSeeds=[2003,2011,2027,2039,2053,2069,2081,2089,2099,2111,2129,2137,2143,2153,2161,2179];
const confirmSeeds=[3001,3011,3023,3037,3049,3061,3079,3089,3109,3121,3137,3163,3181,3203,3221,3251];
const auditSeeds=[4001,4003,4007,4013,4019,4021,4027,4049,4051,4057,4073,4079,4091,4093,4099,4111,4127,4129,4133,4139,4153,4157,4159,4177,4201,4211,4217,4219,4229,4231,4241,4243];
const modes=process.env.BALANCE_MODES?.split(',')||['none','observed','reflex'];
const seeds=process.env.BALANCE_SET==='audit50'?auditSeeds:process.env.BALANCE_SET==='combined50'?[...validationSeeds,...confirmSeeds]:process.env.BALANCE_SET==='confirm50'?confirmSeeds:process.env.BALANCE_SET==='validation50'?validationSeeds:process.env.BALANCE_SET==='holdout'
 ?[101,211,337,449,557,661,773,887,991,1103,1217,1321,1429,1543,1657,1777]
 :[17,73,159,314,808,1337,2026,4096];
const reports=[];
for(const route of Object.keys(routes))for(const mode of modes)for(const seed of seeds){
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w),p=defaultProfile(),progression=new Progression(p);
 r.seedOverride=seed;r.mutationPool=mutationPool(p);r.cursePool=cursePool(p);r.start();progression.beginRun();
 let intent,oneStart=null,oneEnd=null,hp100=null,boss=null,shots=0,charged=0,phantom=0;
 const drafts=[];const fire=w.fire.bind(w);w.fire=(...args)=>{const before=w.projectiles.length;const v=fire(...args);if(!args[3]&&w.projectiles.length>before){shots++;if(args[4])charged++;}return v;};
 const hit=w.hitEnemy.bind(w);w.hitEnemy=(...args)=>{if(args[6]==='phantom')phantom++;return hit(...args);};
 const snapshot=()=>({time:r.elapsed,hp:w.hp,damage:w.draftSignals.enemyHpDamage,healed:w.draftSignals.healed,absorbed:w.draftSignals.absorbed});
 for(let tick=0;tick<22000&&!r.result;tick++){
  if(!intent||tick%18===0)intent=routeIntent(w,route,mode,tick,process.env.BALANCE_POLICY==='bossSafe'?'bossSafe':'near');
  w.player.angle=intent.angle;r.step({...intent,dash:mode==='reflex'?w.imminentThreat():intent.dash},1/60);
  progression.observe(w,r.result);r.mutationPool=mutationPool(p);r.cursePool=cursePool(p);
  if(w.mutations.length===1&&w.curses.length===1){oneStart??=snapshot();oneEnd=snapshot();}
  if(hp100===null&&r.elapsed>=100)hp100=w.hp;
  if(boss===null&&r.bossDue)boss=r.elapsed;
  if(r.draft.length){const order=routes[route],i=r.draft.map((o,i)=>({i,rank:order.includes(o.id)?order.indexOf(o.id):100+i})).sort((a,b)=>a.rank-b.rank)[0].i;
   drafts.push({time:r.elapsed,id:r.draft[i].id,hp:w.hp});progression.offerDraft(r.draft.map(o=>o.id));if(!r.choose(i))throw Error('Invalid natural draft');}
 }
 if(!r.result||!Number.isFinite(w.hp)||r.elapsed>300)throw Error('Invalid completed run');
 reports.push({route,mode,seed,result:r.result,reason:r.reason,time:r.elapsed,hp:w.hp,hp100,boss,kills:w.kills,shots,charged,phantom,dashes:w.stats.dashes,perfects:w.perfectDodges,mutations:w.mutations,curses:w.curses,damage:w.draftSignals.enemyHpDamage,healed:w.draftSignals.healed,absorbed:w.draftSignals.absorbed,oneStart,oneEnd,drafts});
}
const summary=[];
for(const mode of modes)for(const route of Object.keys(routes)){
 const a=reports.filter(r=>r.route===route&&r.mode===mode),wins=a.filter(r=>r.result==='victory').length;
 const times=a.map(r=>r.time).sort((a,b)=>a-b);summary.push({mode,route,wins,total:a.length,rate:wins/a.length,alive100:a.filter(r=>r.hp100>0).length,medianEnd:times[Math.floor(times.length/2)],boss:a.filter(r=>r.boss!==null).length});
}
const data={method:'Four natural first-run routes, identical300ms aim/action cadence, same seeds and mode, live achievement pool updates, earned resources; no grants/offer replacement/Legacy/Anomaly/Ascension. Ranged190–260px vs melee routes approach65px, same wall steering/Charged/Surge. bossSafe additionally keeps330–420px from a visible Boss without changing aim or reaction cadence. Reflex is machine control. Explicit seeds and modes are recorded. Reused groups are calibration/regression, not an independent human sample. Not human win rate.',seeds,modes,policy:process.env.BALANCE_POLICY||'near',set:process.env.BALANCE_SET||'development',summary,reports};
fs.writeFileSync(process.env.BALANCE_OUTPUT||'docs/early-run-balance/evidence/four-final-development.json',JSON.stringify(data,null,2));console.table(summary);
