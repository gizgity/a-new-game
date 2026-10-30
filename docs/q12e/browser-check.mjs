import assert from 'node:assert/strict';import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
try{for(const [width,height,touch] of [[320,740,true],[390,844,true],[844,390,true],[1440,900,false]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto('http://localhost:5173/a-new-game/');await p.locator('#primary:enabled').waitFor();
 await p.locator('#settings summary').click();
 // Real touch pointer (CDP touch through Playwright tap), desktop native keyboard range control.
 const slider=p.locator('#music-volume');await slider.scrollIntoViewIfNeeded();
 if(touch){const b=await slider.boundingBox();await p.touchscreen.tap(b.x+b.width*.35,b.y+b.height/2);}else{await slider.focus();await p.keyboard.press('Home');await p.keyboard.press('ArrowRight');}
 const ui=await p.evaluate(()=>{const ids=['volume','music-volume','sfx-volume'];return ids.map(id=>{const el=document.getElementById(id),r=el.getBoundingClientRect();return {id,value:+el.value,height:r.height,label:el.labels[0].textContent,output:document.getElementById(id+'-value').textContent};});});
 assert.ok(ui.every(x=>x.height>=44&&x.label&&x.output.endsWith('%')));assert.notEqual(ui[1].value,1);
 await p.locator('#mute').check();await p.locator('#reduce-camera-shake').check();
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')).settings);await p.reload();await p.locator('#primary:enabled').waitFor();
 assert.equal(await p.locator('#mute').isChecked(),true);assert.equal(await p.locator('#reduce-camera-shake').isChecked(),true);assert.equal(+await p.locator('#music-volume').inputValue(),saved.musicVolume);
 // Same existing Settings panel in Pause, entered from a running game.
 await p.locator('#primary').click();await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');a.setPhase('playing');await a.sound.context.resume();a.sound.locked=false;});
 await p.locator('#pause').click();await p.locator('#settings summary').click();await p.locator('#mute').uncheck();await p.locator('#locale').selectOption('en');
 assert.match(await p.locator('label:has(#music-volume)').textContent(),/Music volume/);await p.locator('#reduce-camera-shake').scrollIntoViewIfNeeded();await p.screenshot({path:`docs/q12e/evidence/settings-${width}.png`});
 const gains=await p.evaluate(async()=>{
  const {arena:a,game}=await import('/a-new-game/src/main.ts');game.loop.stop();a.setPhase('playing');a.combat.enemies=[];a.combat.hitstop=0;
  for(let i=0;i<150;i++){a.updateMusic();if(a.musicStats().sources===3)break;await new Promise(r=>setTimeout(r,20));}
  const sources=a.music.voices.map(v=>v.source),before=a.musicStats();const cases=[];
  const set=(id,v)=>{const el=document.getElementById(id);el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));};
  for(const [master,music,sfx] of [[.4,1,1],[.5,.3,.7],[0,1,1],[1,0,1],[1,1,0],[1,1,1]]){
   set('volume',master);set('music-volume',music);set('sfx-volume',sfx);{ const start=a.sound.context.currentTime; while(a.sound.context.currentTime-start<.2) await new Promise(r=>setTimeout(r,20)); }
   const mg=a.music.bus.gain.value,sg=a.audio.bus.gain.value,m=game.sound.masterVolumeNode.gain.value;
   cases.push({master,music,sfx,musicGain:m*mg,sfxGain:m*sg,sameSources:a.music.voices.every((v,i)=>v.source===sources[i])});
  }
  a.audio.beginFrame();a.audio.play(['hurt']);const duck=a.music.duckBus.gain.value;await new Promise(r=>setTimeout(r,30));const ducked=a.music.duckBus.gain.value;
  const mute=document.getElementById('mute');mute.click();await new Promise(r=>setTimeout(r,50));const mutedSources=a.musicStats().sources,playingMuted=[...a.audio.sounds.values()].filter(s=>s.isPlaying).length;mute.click();
  const same=a.music.voices.every((v,i)=>v.source===sources[i]);const noReplay=[...a.audio.sounds.values()].every(s=>!s.isPlaying);
  const hitstop= a.combat.hitstop=0.085;a.reduceCameraShake=true;a.impactTier='heavy';a.impactAge=0;a.cameras.main.preRender();const simulationUnchanged=a.combat.hitstop===hitstop;
  const after=a.musicStats();a.music.reset();const reset=a.musicStats();game.scene.stop(a.scene.key);const shutdown=a.musicStats();
  return {cases,before,after,duck,ducked,mutedSources,playingMuted,same,noReplay,simulationUnchanged,reset,shutdown};
 });

 for(const c of gains.cases){assert.ok(Math.abs(c.musicGain-c.master*c.music*.7)<.0001);assert.ok(Math.abs(c.sfxGain-c.master*c.sfx)<.0001);assert.ok(c.sameSources);}
 assert.equal(gains.mutedSources,3);assert.equal(gains.playingMuted,0);assert.ok(gains.same&&gains.noReplay&&gains.simulationUnchanged);assert.ok(gains.ducked<.5);assert.equal(gains.after.networkBytes,gains.before.networkBytes);assert.equal(gains.reset.sources,0);assert.equal(gains.shutdown.cacheEntries,0);assert.deepEqual(errors,[]);
 reports.push({width,height,touch,ui,saved,gains,errors});await p.close();
}fs.writeFileSync('docs/q12e/evidence/browser.json',JSON.stringify({method:'Chromium native WebAudio, real touch tap / keyboard slider, persistence reload and existing Pause settings; controlled output-only checks. No acoustic assertion.',reports},null,2));console.log('PASS settings 4 viewports / gains / continuity / persistence / mute / duck / cleanup');}finally{await browser.close();}
