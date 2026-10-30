import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
try {
 for(const [width,height,touch] of [[390,844,true],[1440,900,false]]){
  const p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://localhost:5173/a-new-game/?playtest=chain');await p.locator('#primary:enabled').click();
  await p.evaluate(async()=>{const {arena:a,game}=await import('/a-new-game/src/main.ts');game.loop.stop();await a.sound.context.resume();a.sound.locked=false;
   a.combat.enemies=[];a.combat.mutations=[];a.combat.setCurses([]);a.combat.legacy.reset();a.combat.hitstop=0;
   a.setPhase('playing');for(let i=0;i<100;i++){a.updateMusic();if(a.musicStats().sources===3)break;await new Promise(r=>setTimeout(r,25));}
   window.continuity={arena:a,voices:a.music.voices.map(v=>v.source)};
  });
  const storage=await p.evaluate(()=>JSON.stringify({...localStorage}));const dialogs=[];
  for(const [kind,id] of [['mutation','aegisCore'],['curse','ironOath']]){
   const before=await p.evaluate(({kind,id})=>{const a=window.continuity.arena;a.run.draftKind=kind;a.run.draft=[{id,role:'wildcard'}];a.setPhase('draft');return {music:a.musicStats(),ticks:a.run.ticks};},{kind,id});
   await p.locator('#draft-panel').waitFor({state:'visible'});await p.waitForFunction(before=>window.continuity.arena.musicStats().position-before>1.05,before.music.position);
   const during=await p.evaluate(()=>{const {arena:a,voices}=window.continuity;a.update(0,17);return {music:a.musicStats(),ticks:a.run.ticks,sameSources:a.music.voices.every((v,i)=>v.source===voices[i])};});
   assert.equal(during.music.sources,3);assert.ok(during.music.position-before.music.position>1);assert.equal(during.ticks,before.ticks);assert.equal(during.sameSources,true);
   await p.locator('#draft-panel [data-choice="0"]').click();
   const after=await p.evaluate(()=>{const {arena:a,voices}=window.continuity;return {phase:a.phase,sameSources:a.music.voices.every((v,i)=>v.source===voices[i]),mutations:a.combat.mutations,curses:a.combat.curses};});
   assert.equal(after.phase,'playing');assert.equal(after.sameSources,true);assert.ok((kind==='mutation'?after.mutations:after.curses).includes(id));dialogs.push({kind,before,during,after});
  }
  const combat=await p.evaluate(async()=>{
   const {arena:a,voices}=window.continuity;a.combat.mutations=[];a.combat.setCurses([]);a.combat.enemies=[];a.combat.projectiles=[];a.player.angle=0;
   a.combat.spawnEnemy('grunt',50000);const e=a.combat.enemies[0];Object.assign(e,{x:a.player.x+50,y:a.player.y,cooldown:100,stagger:100});
   const before=a.musicStats();let hitstopFrames=0;const hp=e.hp;
   for(let i=0;i<180;i++){
    a.run.step({dx:0,dy:0,melee:true,shoot:false,heavy:false,dash:false},1/60);
    a.audio.beginFrame();a.audio.play(a.combat.audioEvents);a.updateMusic();
    if(a.combat.hitstop>0)hitstopFrames++;
    if(a.music.voices.length!==3||a.music.voices.some((v,j)=>v.source!==voices[j]))throw Error('Music sources restarted by combat');
    e.x=a.player.x+50;e.y=a.player.y;await new Promise(r=>setTimeout(r,5));
   }
   return {before,after:a.musicStats(),hitstopFrames,damage:hp-e.hp,sameSources:true,duck:a.music.duckBus.gain.value};
  });
  assert.ok(combat.hitstopFrames>5);assert.ok(combat.damage>0);assert.ok(combat.after.position-combat.before.position>.5);assert.equal(combat.after.errors,0);
  const paused=await p.evaluate(()=>{const a=window.continuity.arena;a.setPhase('paused');return a.musicStats();});assert.equal(paused.sources,0);
  await p.waitForTimeout(120);assert.equal(await p.evaluate(()=>window.continuity.arena.musicStats().position),paused.position);
  assert.equal(await p.evaluate(()=>JSON.stringify({...localStorage})),storage);assert.deepEqual(errors,[]);
  reports.push({width,height,touch,dialogs,combat,paused,errors,storageUnchanged:true});await p.close();
 }
 fs.writeFileSync('docs/q12e/evidence/continuity.json',JSON.stringify({method:'Controlled memory-only fixtures; real Mutation/Curse card DOM clicks and real CombatWorld hitstop. Source identity checked, no acoustic quality assertion.',reports},null,2));
 console.log('PASS music continuity through Mutation/Curse dialogs, card selection and repeated real combat hitstop; Pause still freezes');
} finally {await browser.close();}
