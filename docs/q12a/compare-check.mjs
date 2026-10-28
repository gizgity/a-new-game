import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const page=await browser.newPage();
await page.goto('http://localhost:5173/a-new-game/audition.html');await page.locator('button').first().click();
const comparison=await page.evaluate(async()=>{
 const {audition:a,game}=await import('/a-new-game/src/audioAudition.ts');const {ProceduralAudio:Baseline}=await import('/a-new-game/src/game/audioBaseline.ts');const {ProceduralAudio:Next}=await import('/a-new-game/src/game/audio.ts');game.loop.stop();a.audio.destroy();
 const measure=()=>Object.fromEntries(a.cache.audio.getKeys().map(key=>{const b=a.cache.audio.get(key),v=b.getChannelData(0);let peak=0,energy=0,difference=0;for(let i=0;i<v.length;i++){peak=Math.max(peak,Math.abs(v[i]));energy+=v[i]*v[i];if(i)difference+=(v[i]-v[i-1])**2;}return [key,{duration:b.duration,peak,rms:Math.sqrt(energy/v.length),differenceEnergy:difference/v.length}];}));
 const random=Math.random;function seed(){let state=12;Math.random=()=>((state=(state*1664525+1013904223)>>>0)/4294967296);}
 for(const key of a.cache.audio.getKeys())a.cache.audio.remove(key);seed();new Baseline(a);const baseline=measure();const arrival=Array.from(a.cache.audio.get('sfx-arrival').getChannelData(0));
 for(const key of a.cache.audio.getKeys())a.cache.audio.remove(key);seed();const next=new Next(a);const revised=measure();const arrivalExact=arrival.every((v,i)=>v===a.cache.audio.get('sfx-arrival').getChannelData(0)[i]);next.destroy();Math.random=random;
 return {baseline,revised,arrivalExact};
});assert.equal(comparison.arrivalExact,true);assert.ok(comparison.revised['sfx-swing'].differenceEnergy<comparison.baseline['sfx-swing'].differenceEnergy);
fs.writeFileSync('docs/q12a/evidence/comparison.json',JSON.stringify({baseline:'6ed8a96',method:'Cached mono PCM, seeded presentation noise only for repeatable comparison; no human listening claim. Arrival samples byte-equivalent with identical noise stream.',...comparison},null,2));
await browser.close();console.log('PASS PCM baseline comparison');
