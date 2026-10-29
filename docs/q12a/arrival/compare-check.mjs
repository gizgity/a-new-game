import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage();
await p.goto('http://localhost:5173/a-new-game/audition.html');await p.locator('button').first().click();
const report=await p.evaluate(async()=>{
 const {audition:a,game}=await import('/a-new-game/src/audioAudition.ts');const {ProceduralAudio:Before}=await import('/a-new-game/src/game/audioBaseline.ts');const {ProceduralAudio:After}=await import('/a-new-game/src/game/audio.ts');game.loop.stop();a.audio.destroy();
 const originalRandom=Math.random;const seed=()=>{let n=12;Math.random=()=>((n=(n*1664525+1013904223)>>>0)/4294967296);};
 async function measure(){
  const data={};
  for(const cue of ['arrival','light','light2','light3','heavy','gun','shotHit','chargedGun','chargedBlast','detonate','perfect','stack1','stack2','stack3','chain']){
   const buf=a.cache.audio.get('sfx-'+cue),samples=buf.getChannelData(0);let peak=0;for(const v of samples)peak=Math.max(peak,Math.abs(v));
   async function energy(low,high){const ctx=new OfflineAudioContext(1,buf.length,buf.sampleRate),source=ctx.createBufferSource();source.buffer=buf;let tail=source;
    for(const [type,freq] of [['highpass',low],['lowpass',high]])if(freq){const f=ctx.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=Math.SQRT1_2;tail.connect(f);tail=f;}
    tail.connect(ctx.destination);source.start();const pcm=(await ctx.startRendering()).getChannelData(0);return pcm.reduce((s,x)=>s+x*x,0)/pcm.length;}
   data[cue]={peak,low:await energy(60,300),treble:await energy(2000,null)};
  }return data;
 }
 for(const key of a.cache.audio.getKeys())a.cache.audio.remove(key);seed();const beforeAudio=new Before(a);const before=await measure();const arrival=Array.from(a.cache.audio.get('sfx-arrival').getChannelData(0));beforeAudio.destroy();
 for(const key of a.cache.audio.getKeys())a.cache.audio.remove(key);seed();const afterAudio=new After(a);const after=await measure();const arrivalExact=arrival.every((v,i)=>v===a.cache.audio.get('sfx-arrival').getChannelData(0)[i]);afterAudio.destroy();Math.random=originalRandom;
 const changes=Object.fromEntries(Object.keys(after).map(cue=>[cue,{trebleDb:10*Math.log10(after[cue].treble/before[cue].treble),lowDb:10*Math.log10(after[cue].low/before[cue].low)}]));return {before,after,changes,arrivalExact};
 });assert.equal(report.arrivalExact,false);
assert.ok(report.changes.arrival.trebleDb < -15);
assert.ok(Math.abs(report.changes.arrival.lowDb) < 3);
for(const cue of Object.keys(report.changes))if(cue!=='arrival')assert.deepEqual(report.after[cue],report.before[cue],cue);
const cadence=await p.evaluate(async()=>{
 const {audition:a}=await import('/a-new-game/src/audioAudition.ts');const {ProceduralAudio}=await import('/a-new-game/src/game/audio.ts');const audio=new ProceduralAudio(a);a.sound.locked=false;await a.sound.context.resume();const plays=[];
 audio.sounds.get('arrival').play=config=>{plays.push({tick,volume:config.volume});return true;};let tick=0;
 for(tick=0;tick<=120;tick++){audio.beginFrame();audio.arrival((120-tick)/60);}
 audio.destroy();return plays;
});assert.deepEqual(cadence.map(x=>x.tick),[6,36,66,96]);assert.deepEqual(cadence.map(x=>x.volume),[.32,.46,.66,.9]);
fs.writeFileSync('docs/q12a/arrival/evidence/comparison.json',JSON.stringify({baseline:'591fa0e',method:'Seeded cached PCM; offline highpass2kHz/band60–300Hz energy. Arrival timbre intentionally revised by user feedback; other measured cues unchanged. Not human listening evidence.',cadence,...report},null,2));console.log('PASS Arrival softer',JSON.stringify({changes:report.changes.arrival,cadence}));await b.close();
