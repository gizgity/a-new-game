import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=user-gesture-required']});
const reports=[];const evidence=process.env.AUDIO_EVIDENCE_PATH || 'docs/q12c/evidence';
for(const [width,height,touch] of [[390,844,true],[1440,1000,false],[320,740,true],[844,390,true]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:5173/a-new-game/audition.html');await p.locator('button').first().waitFor();
 await p.locator('button').first().click();await p.waitForTimeout(100);
 const report=await p.evaluate(async()=>{
  const {audition:a,game}=await import('/a-new-game/src/audioAudition.ts');game.loop.stop();a.track=0;
  const audio=a.audio,context=a.sound.context,bufferCount=a.cache.audio.getKeys().length;
  await context.resume();a.sound.locked=false;audio.transition();audio.beginFrame();
  const plays=[];for(const [cue,sound] of audio.sounds){const play=sound.play.bind(sound);sound.play=(config)=>{plays.push({cue,volume:config?.volume});return play(config);};}
  // Fill8 voices across frames, then test replacement and protected Arrival.
  for(const cue of ['gun','swing','swing2','swing3','shotHit','stack1','charge','dash']){audio.beginFrame();audio.play([cue]);}
  const filled=a.sound.getAllPlaying().length;audio.beginFrame();audio.arrival(1.9);const warning=audio.sounds.get('arrival');
  const warningPlaying=warning.isPlaying;
  audio.play(['detonate','chargedBlast','heavy','gun','shotHit','stack2','stack3']);
  const cap=a.sound.getAllPlaying().length,protectedWarning=warning.isPlaying;
  const counts=plays.length;audio.play(Array(50).fill('gun'));const bounded=plays.length-counts;
  audio.transition();audio.beginFrame();audio.play([{cue:'detonate',root:701,hop:0}]);audio.beginFrame();audio.play([{cue:'detonate',root:701,hop:1}]);
  // Pause does not forget an explosion root; delayed relay remains secondary.
  audio.transition();audio.beginFrame();audio.play([{cue:'detonate',root:701,hop:2}]);
  const rootPlays=plays.filter(x=>x.cue==='chain').slice(-2);
  audio.transition();audio.beginFrame();audio.charge(true);const charge=audio.sounds.get('charge').isPlaying;audio.charge(false);const cancel=!audio.sounds.get('charge').isPlaying;
  audio.transition();a.sound.mute=true;audio.beginFrame();const beforeMute=plays.length;audio.play(['gun','hurt']);const mute=plays.length===beforeMute;a.sound.mute=false;audio.beginFrame();const noReplay=a.sound.getAllPlaying().length===0;
  a.sound.locked=true;audio.play(['gun']);const locked=plays.length===beforeMute;a.sound.locked=false;
  await context.suspend();audio.play(['hurt']);const suspended=plays.length===beforeMute;await context.resume();
  const buffers={};for(const cue of ['swing','swing2','swing3','heavy','gun','chargedGun','perfect','stack1','stack2','stack3','hurt','arrival']){const b=a.cache.audio.get('sfx-'+cue),v=b.getChannelData(0);buffers[cue]={duration:b.duration,peak:Math.max(...v.map(Math.abs)),rms:Math.sqrt(v.reduce((s,x)=>s+x*x,0)/v.length)};}
  const identities=[];
  const {ELEMENTAL_TONES}=await import('/a-new-game/src/game/config/elementalAudio.ts');
  for(const cue of Object.keys(ELEMENTAL_TONES)){
   audio.transition();audio.beginFrame();audio.elementalAdmission.reset();const n=plays.length;audio.elemental([{cue,root:900}]);
   const b=a.cache.audio.get('sfx-'+cue);identities.push({cue,played:plays.length>n,duration:b.duration,peak:Math.max(...b.getChannelData(0).map(Math.abs))});
  }
  audio.transition();audio.beginFrame();audio.elementalAdmission.reset();const n=plays.length;
  audio.elemental(Array.from({length:24},()=>({cue:'furnace',root:999})));const flood=plays.length-n;
  audio.beginFrame();audio.arrival(1.4);const arrivalWithProc=warning.isPlaying;
  audio.transition();audio.beginFrame();const pending=plays.length;await context.suspend();audio.elemental([{cue:'ignite',root:2000}]);await context.resume();audio.elemental([{cue:'ignite',root:2000}]);const noElementReplay=plays.length===pending;
  const peakBound=7*.22*.4+buffers.arrival.peak;audio.transition();audio.beginFrame();audio.play(['gun']);audio.destroy();
  return {identities,flood,arrivalWithProc,noElementReplay,filled,warningPlaying,cap,protectedWarning,bounded,charge,cancel,mute,noReplay,locked,suspended,rootPlays,buffers,peakBound,bufferCount,afterBuffers:a.cache.audio.getKeys().length,cleanup:a.sound.getAllPlaying().length,owned:audio.sounds.size,context:context.state};
 });
 assert.ok(report.identities.every(x=>x.played && x.peak<=.22001));assert.equal(report.flood,1);assert.equal(report.arrivalWithProc,true);assert.equal(report.noElementReplay,true);
 assert.equal(report.filled,8);assert.equal(report.warningPlaying,true);assert.equal(report.protectedWarning,true);assert.ok(report.cap<=8);assert.ok(report.bounded<=3);
 for(const key of ['charge','cancel','mute','noReplay','locked','suspended'])assert.equal(report[key],true,key);
 assert.equal(report.rootPlays.length,2);assert.ok(report.rootPlays[1].volume<report.rootPlays[0].volume);assert.equal(report.cleanup,0);assert.equal(report.owned,0);assert.equal(report.bufferCount,report.afterBuffers);assert.ok(report.peakBound<1);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
 // Fresh page for real simulation crowd + gesture/track/pause/mute controls.
 await p.reload();await p.locator('button').nth(3).click();await p.waitForTimeout(700);await p.locator('button').nth(4).click();const pause=await p.evaluate(async()=>{const {audition:a}=await import('/a-new-game/src/audioAudition.ts');return {paused:a.paused,voices:a.sound.getAllPlaying().length,enemies:a.world.enemies.length};});assert.equal(pause.paused,true);assert.equal(pause.voices,0);assert.equal(pause.enemies,24);
 await p.screenshot({path:`${evidence}/audition-${width}.png`});
 const saved=await p.evaluate(()=>Object.keys(localStorage));assert.deepEqual(saved,[]);
 reports.push({width,height,touch,errors,pause,saved,report});await p.close();
}
// Unsupported WebAudio must still boot audition, with silent gameplay.
const p=await browser.newPage();await p.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;});await p.goto('http://localhost:5173/a-new-game/audition.html');await p.locator('button').first().click();await p.waitForTimeout(100);const unsupported=await p.evaluate(async()=>{const {audition:a}=await import('/a-new-game/src/audioAudition.ts');return {available:a.audio.available,track:a.track};});assert.equal(unsupported.available,false);assert.equal(unsupported.track,1);await p.close();
fs.writeFileSync(`${evidence}/browser.json`,JSON.stringify({reports,unsupported,limits:'Chromium software WebGL, technical WebAudio scheduling only; no real speaker/headphone listening or iOS/Safari acceptance.'},null,2));await browser.close();console.log('PASS audio browser4sizes');
