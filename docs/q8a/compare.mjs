import fs from 'node:fs';
const root=process.cwd();
const out=[];
for(const version of ['baseline','dynamic']){
 const dir=version==='baseline'?(process.env.Q8_BASELINE_DIR || '/tmp/q8a-baseline'):root+'/.test-build';
 const {CombatWorld}=await import(dir+'/combat.js');const {RunDirector}=await import(dir+'/run.js');
 for(const build of ['normal','fast-chain']){
 const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.start();r.mutationPool=[];r.cursePool=[];r.draftIndex=6;
 if(build==='fast-chain'){w.mutations=['detonationSpecialist','catalyst','echoChamber','kineticBattery'];w.setCurses(['glassSoul','volatileSoul']);}
 const counts=[],cost=[];let empty=0,sparse=0,minDistance=Infinity,spawned=7;let lastId=Math.max(...w.enemies.map(e=>e.id));
 for(let i=0;i<60*60&&!r.result;i++){
 // Density-isolation fixture: same immortal pursuit bot, real damage/resources/AI. Not run balance validation.
 w.hp=w.maxHp;
 const target=w.enemies.reduce((a,b)=>!a||Math.hypot(b.x-w.player.x,b.y-w.player.y)<Math.hypot(a.x-w.player.x,a.y-w.player.y)?b:a,null);
 let dx=0,dy=0;
 if(target){dx=target.x-w.player.x;dy=target.y-w.player.y;w.player.angle=Math.atan2(dy,dx);const d=Math.hypot(dx,dy);if(d<65){dx=dy=0;}else {dx/=d;dy/=d;}}
 const t=performance.now();r.step({dx,dy,melee:true,shoot:true,heavy:i%100===0,charged:i%30===0,ultimate:i%60===0,dash:false},1/60);cost.push(performance.now()-t);
 const born=w.enemies.filter(e=>e.id>lastId);spawned+=born.length;for(const e of born)minDistance=Math.min(minDistance,Math.hypot(e.x-w.player.x,e.y-w.player.y));if(born.length)lastId=Math.max(...born.map(e=>e.id));
 if(i>=15*60){counts.push(w.enemies.length);if(!w.enemies.length)empty++;if(w.enemies.length<=2)sparse++;}
 }
 cost.sort((a,b)=>a-b);out.push({version,build,seconds:r.elapsed,kills:w.kills,spawned,meanEnemies:counts.reduce((a,b)=>a+b,0)/counts.length,emptySeconds:empty/60,sparseSeconds:sparse/60,maxEnemies:Math.max(...counts),minSpawnDistance:minDistance,stepP95ms:cost[Math.floor(cost.length*.95)],fixture:'Full builds granted at start, HP restored each tick, drafts bypassed; density only, not natural run or Q8D.'});
 }
}
fs.mkdirSync(root+'/docs/q8a/evidence',{recursive:true});fs.writeFileSync(root+'/docs/q8a/evidence/density-comparison.json',JSON.stringify(out,null,2));console.log(out);
