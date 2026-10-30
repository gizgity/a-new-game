import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=user-gesture-required']});
const reports=[];
try {
 for(const [width,height,touch] of [[320,740,true],[390,844,true],[844,390,true],[1440,900,false]]){
  const p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://localhost:5173/a-new-game/?playtest=music');
  await p.waitForFunction(()=>window.musicFixture?.arena.musicStats());
  const storage=await p.evaluate(()=>JSON.stringify({...localStorage}));
  await p.locator('[data-music=early]').click();
  await p.evaluate(async()=>{const a=window.musicFixture.arena;await a.sound.context.resume();a.sound.locked=false;});
  await p.waitForFunction(()=>window.musicFixture.stats().sources===3);
  const stages=[];
  for(const stage of ['early','tension','anomaly','boss','enraged']){
   await p.locator(`[data-music=${stage}]`).click();
   await p.waitForFunction(s=>window.musicFixture.stats().applied===s,stage);
   await p.waitForTimeout(350);
   const stats=await p.evaluate(()=>window.musicFixture.stats());stages.push(stats);assert.ok(stats.sources<=3);assert.ok(stats.cacheEntries<=3);
  }
  // Preserve actual musical position, no hidden advancement through draft/selection/pause.
  const freezes=[];
  for(const phase of ['draft','anomaly','legacy','paused']){
   const before=await p.evaluate(phase=>{const a=window.musicFixture.arena;a.phase=phase;a.updateMusic();return a.musicStats();},phase);
   await p.waitForTimeout(120);
   const after=await p.evaluate(()=>window.musicFixture.stats());
   assert.equal(after.sources,0);assert.equal(after.position,before.position);freezes.push({phase,position:after.position});
   await p.evaluate(()=>window.musicFixture.arena.setPhase('playing'));
  }
  await p.evaluate(()=>{const input=document.querySelector('#mute');input.checked=true;input.dispatchEvent(new Event('change'));});
  await p.waitForTimeout(100);
  const muted=await p.evaluate(()=>window.musicFixture.arena.sound.masterMuteNode.gain.value);assert.equal(muted,0);
  await p.evaluate(()=>{const input=document.querySelector('#mute');input.checked=false;input.dispatchEvent(new Event('change'));});
  await p.waitForTimeout(100);
  // Real accepted SFX while Boss music is active, with 24-enemy fixture grants.
  const sfx=await p.evaluate(()=>{
   const a=window.musicFixture.arena;for(let i=0;i<24;i++)a.combat.spawnEnemy('grunt',1000);
   const out=[];for(const cue of ['arrival','perfect','heavy','detonate']){a.audio.beginFrame();a.audio.play([cue]);out.push({cue,playing:a.audio.sounds.get(cue).isPlaying});}
   return {out,music:a.musicStats(),sfxVoices:a.sound.getAllPlaying().length};
  });assert.ok(sfx.out.every(x=>x.playing),JSON.stringify(sfx));assert.ok(sfx.sfxVoices<=8);
  // Input through browser while music runs.
  if(touch){const r=await p.locator('[data-action=shoot]').boundingBox();if(r){await p.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);}}else{await p.keyboard.down('d');await p.waitForTimeout(150);await p.keyboard.up('d');await p.mouse.click(width/2,height/2);}
  const result=[];
  for(const stage of ['victory','defeat']){
   await p.locator(`[data-music=${stage}]`).click();await p.waitForFunction(()=>window.musicFixture.stats().resultDone);
   const before=await p.evaluate(()=>window.musicFixture.stats());await p.waitForTimeout(150);
   const after=await p.evaluate(()=>window.musicFixture.stats());assert.ok(after.sources<=2);result.push({stage,before,after});
  }
  const cleanup=await p.evaluate(()=>{const a=window.musicFixture.arena;a.music.destroy();return a.musicStats();});assert.equal(cleanup.sources,0);assert.equal(cleanup.cacheEntries,0);
  assert.equal(await p.evaluate(()=>JSON.stringify({...localStorage})),storage);assert.deepEqual(errors,[]);
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
  reports.push({width,height,touch,stages,freezes,muted,sfx,result,cleanup,errors,storageUnchanged:true,overflow});
  await p.screenshot({path:`docs/q12d/c-${width}.png`});await p.close();
 }
 fs.writeFileSync('docs/q12d/browser-c.json',JSON.stringify({coverage:'Chromium emulation; controlled fixture grants, not listening/device approval',reports},null,2));
 console.log('PASS four viewports/state/freeze/SFX/mute/input/cleanup');
}finally{await browser.close();}
