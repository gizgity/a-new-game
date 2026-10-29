// Diagnostic only: fresh profile, real RunDirector, earned and naturally sampled drafts.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const root=process.env.BALANCE_MODULE_ROOT || `${process.cwd()}/.test-build`;
const {CombatWorld}=await import(pathToFileURL(`${root}/combat.js`));
const {RunDirector}=await import(pathToFileURL(`${root}/run.js`));
const {defaultProfile,mutationPool,cursePool}=await import(pathToFileURL(`${root}/progression.js`));
export const routes={tank:['aegisCore','ironOath','kineticBattery','ironReversal','soulAnchor'],sustain:['bloodReclaimer','parasiticMark','catalyst','echoChamber','kineticBattery'],counter:['phantomEdge','ghostStep','ironReversal','kineticBattery'],ranged:['detonationSpecialist','glassSoul','catalyst','echoChamber']};
export function decision(w,t,policy){
 const e=w.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-w.player.x,a.y-w.player.y)-Math.hypot(b.x-w.player.x,b.y-w.player.y))[0];
 let dx=0,dy=0,angle=w.player.angle;
 if(e){const x=e.x-w.player.x,y=e.y-w.player.y,d=Math.hypot(x,y)||1;angle=Math.atan2(y,x);
  if(policy==='orbit'){const radial=d<190?-1:d>260?1:0;dx=x/d*radial-y/d*.65;dy=y/d*radial+x/d*.65;}
  else if(policy!=='stationary'&&d>65){dx=x/d;dy=y/d;}
 }
 return {angle,dx,dy,melee:true,shoot:true,heavy:t%180<18,charged:false,ultimate:t%180<18,dash:policy==='slowDash'?t%180<18:policy==='reflex'?w.imminentThreat():false};
}
export function choose(r,route){const order=routes[route];return r.draft.map((o,i)=>({i,rank:order.includes(o.id)?order.indexOf(o.id):100+i})).sort((a,b)=>a.rank-b.rank)[0].i;}
const reports=[];
for(const policy of ['stationary','approach','orbit','slowDash','reflex'])for(const route of Object.keys(routes))for(const seed of [17,808,2026]){
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w),profile=defaultProfile();
 r.seedOverride=seed;r.mutationPool=mutationPool(profile);r.cursePool=cursePool(profile);r.start();
 const drafts=[],windows={},snapshots=[];let totals={damage:0,absorbed:0,healed:0,barrierGained:0,hits:0},input;
 const window=()=>w.mutations.length===1&&w.curses.length===1?'onePlusOne':r.elapsed<60?'opening':'later';
 const bucket=()=>windows[window()]??=( {...Object.fromEntries(Object.keys(totals).map(k=>[k,0])),ticks:0});
 const hurt=w.hurt.bind(w);w.hurt=(...args)=>{const hp=w.hp,b=w.barrier.value;hurt(...args);if(hp>w.hp||b>w.barrier.value){const s=bucket();for(const x of [s,totals]){x.damage+=hp-w.hp;x.absorbed+=b-w.barrier.value;x.hits++;}}};
 const heal=w.healPlayer.bind(w);w.healPlayer=(...args)=>{const n=heal(...args);bucket().healed+=n;totals.healed+=n;return n;};
 const gain=w.barrier.gain.bind(w.barrier);w.barrier.gain=(...args)=>{const n=gain(...args);bucket().barrierGained+=n;totals.barrierGained+=n;return n;};
 for(let tick=0;tick<22000&&!r.result;tick++){
  if(tick%18===0||!input)input=decision(w,tick,policy);
  w.player.angle=input.angle;
  // Reflex is an explicit machine-reaction control, separate from 300ms decisions.
  r.step({...input,dash:policy==='reflex'?w.imminentThreat():input.dash},1/60);bucket().ticks++;
  if(r.ticks%1800===0)snapshots.push({time:r.elapsed,hp:w.hp,barrier:w.barrier.value,kills:w.kills,enemies:w.enemies.length});
  if(r.draft.length){const i=choose(r,route);drafts.push({time:r.elapsed,id:r.draft[i].id,hp:w.hp});if(!r.choose(i))throw Error('Invalid draft');}
 }
 reports.push({policy,route,seed,result:r.result,reason:r.reason,time:r.elapsed,hp:w.hp,kills:w.kills,dashes:w.stats.dashes,totals,windows,drafts,snapshots});
}
fs.mkdirSync('docs/early-run-balance/evidence',{recursive:true});
fs.writeFileSync(process.env.BALANCE_OUTPUT||'docs/early-run-balance/evidence/baseline.json',JSON.stringify({method:'60 deterministic runs, 300ms nearest-target decisions, fresh-profile pools fixed at start, no Legacy/Anomaly/Ascension, no resource grants or offer injection. Stationary stress, approach/orbit without dash, scheduled dash every 3s, machine reflex control. Simulation ticks include hitstop; not human playtest or population win rate.',reports},null,2));
for(const policy of [...new Set(reports.map(r=>r.policy))])for(const route of Object.keys(routes)){const a=reports.filter(r=>r.policy===policy&&r.route===route);console.log(policy,route,'wins',a.filter(r=>r.result==='victory').length,'times',a.map(r=>r.time.toFixed(1)).join('/'),'1+1',a.map(r=>r.windows.onePlusOne?`${(r.windows.onePlusOne.ticks/60).toFixed(1)}s:${r.windows.onePlusOne.damage.toFixed(1)}d/${r.windows.onePlusOne.healed.toFixed(1)}h/${r.windows.onePlusOne.barrierGained.toFixed(1)}b`:'none').join(' | '));}
