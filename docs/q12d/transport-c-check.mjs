import assert from 'node:assert/strict';import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
try{
 const p=await browser.newPage();await p.goto('http://localhost:5173/a-new-game/?playtest=music');await p.waitForFunction(()=>window.musicFixture?.arena.musicStats());
 const report=await p.evaluate(async()=>{
  const {AdaptiveMusic,MUSIC}=await import('/a-new-game/src/game/AdaptiveMusic.ts');
  const {game}=await import('/a-new-game/src/main.ts');game.loop.stop();window.musicFixture.arena.music.destroy();
  const c=new AudioContext({sampleRate:48000});await c.resume();const starts=[],gains=[];
  const make=c.createBufferSource.bind(c);c.createBufferSource=()=>{const s=make(),start=s.start.bind(s);s.start=(...args)=>{starts.push({when:args[0],offset:args[1],loopEnd:s.loopEnd});start(...args);};return s;};
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const m=new AdaptiveMusic(c,c.destination,'/a-new-game/assets/music/');
  async function play(state){m.update(state,false);for(let i=0;i<100 && (m.loading || !m.group);i++)await wait(30);m.update(state,false);await wait(10);}
  await play('early');m.update('anomaly',false);
  const first=starts.slice();const position=m.stats().position;
  // Real 2 core cycles, native BufferSource looping with no JS beat scheduler.
  await wait(50000);const loops=m.stats();
  for(let i=0;i<12;i++){m.update('anomaly',true);const before=m.stats().position;await wait(10);m.update('anomaly',false);if(Math.abs(m.stats().position-before)>.01)throw Error('pause drift');}
  m.update('anomaly',true);const pause=m.stats();await c.suspend();await wait(30);await c.resume();m.update('anomaly',false);
  Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));const hidden=m.stats();await wait(100);
  Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));m.update('anomaly',false);
  await play('boss');await wait(350);await play('enraged');const boss=m.stats();
  m.duck();const duck=m.duckBus.gain.value;await wait(20);gains.push(m.duckBus.gain.value);await wait(500);gains.push(m.duckBus.gain.value);
  await play('victory');const count=starts.length;await wait(100);m.update('victory',false);const oneShot=starts.length===count;
  m.destroy();const cleanup=m.stats();
  // Real WAV fallback via decode rejection for the FLAC attempt, without changing file bytes.
  let attempts=0;const decode=c.decodeAudioData.bind(c);c.decodeAudioData=bytes=>{attempts++;if(new Uint8Array(bytes)[0]===102)return Promise.reject(Error('injected FLAC unsupported'));return decode(bytes);};
  const fallback=new AdaptiveMusic(c,c.destination,'/a-new-game/assets/music/');await (async()=>{fallback.update('early',false);for(let i=0;i<100&&fallback.loading;i++)await wait(30);fallback.update('early',false);})();const fallbackStats=fallback.stats();fallback.destroy();
  await c.close();return {rate:48000,first,position,loops,pause,hidden,boss,duck,gains,oneShot,cleanup,attempts,fallbackStats,bar:MUSIC.bar};
 });
 assert.equal(report.first.length,3);assert.ok(report.first.every(x=>x.when===report.first[0].when));assert.equal(report.first[0].loopEnd,2*report.first[1].loopEnd);
 assert.equal(report.loops.sources,3);assert.ok(report.loops.position>49);assert.equal(report.hidden.sources,0);assert.equal(report.boss.sources,2);assert.ok(report.gains[0]<.5);assert.ok(report.gains[1]>.99);assert.ok(report.oneShot);assert.equal(report.cleanup.sources,0);assert.equal(report.attempts,6);assert.equal(report.fallbackStats.sources,3);
 fs.writeFileSync('docs/q12d/transport-c.json',JSON.stringify(report,null,2));console.log('PASS real 48kHz/2coreloops/pause12/hidden/suspend/boss/duck/sting/WAV fallback');
}finally{await browser.close();}
