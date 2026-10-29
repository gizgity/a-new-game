import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const [width,height,touch] of [[390,844,true],[844,390,true],[1440,1000,false]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:5173/a-new-game/audition.html');await p.locator('button').first().click();
 const result=await p.evaluate(async()=>{
  const {audition:a,game}=await import('/a-new-game/src/audioAudition.ts');const {SIGILS,BRANCHES}=await import('/a-new-game/src/game/config/legacy.ts');game.loop.stop();await a.sound.context.resume();a.sound.locked=false;
  const results=[];
  for(const loadout of [...SIGILS.map(sigil=>({sigil,branch:null})),...Object.entries(BRANCHES).map(([branch,sigil])=>({sigil,branch}))]){
   a.loadout=loadout;a.startTrack(4);a.world.anomaly.equip('fracturedStorm');const cues=new Set();let maxVoices=0,arrival=false;
   for(let i=0;i<240;i++){a.update(i*17,17);for(const e of a.world.elementalEvents)cues.add(e.cue);maxVoices=Math.max(maxVoices,a.sound.getAllPlaying().length);arrival ||= a.audio.sounds.get('arrival').isPlaying;}
   results.push({loadout,enemies:a.world.enemies.length,cues:[...cues],maxVoices,arrival});
  }
  a.paused=true;a.audio.transition();const stopped=a.sound.getAllPlaying().length===0;a.update(10000,17);return {results,stopped,storage:Object.keys(localStorage)};
 });
 assert.ok(result.results.every(x=>x.maxVoices<=8 && x.arrival && x.enemies>=20));assert.equal(result.stopped,true);assert.deepEqual(result.storage,[]);assert.deepEqual(errors,[]);reports.push({width,height,touch,result,errors});await p.screenshot({path:`docs/q12c/evidence/crowd-${width}.png`});await p.close();
}
fs.writeFileSync('docs/q12c/evidence/crowd.json',JSON.stringify({reports,limits:'Accelerated software Chromium simulation, 18 loadouts + Fractured Storm + Arrival; synthetic audition resources. Scheduling/cap only, not human listening or device performance.'},null,2));await b.close();console.log('PASS crowd18loadouts/3viewports');
