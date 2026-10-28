import assert from 'node:assert/strict';import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const [width,height,touch]of [[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:5173/a-new-game/?playtest=seal-4');await p.locator('#primary').click();
 await p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');game.loop.stop();arena.setPhase('playing');});
 for(const state of ['pulse-warning','pulse-imminent','pulse-active','hunter-warning','hunter-active','fracture-proc','echo-warning','echo-impact','stack']){
  const meta=await p.evaluate(async state=>{const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat,a=w.ascension;game.loop.stop();w.enemies=[];w.projectiles=[];w.impacts=[];w.anomaly.reset();a.reset();a.seal=4;w.player.x=800;w.player.y=500;w.hp=100;w.hitstop=0;w.invulnerable=0;
   for(let i=0;i<24;i++){w.spawnEnemy(i%6===0?'archer':'grunt',1000,i*.61);const e=w.enemies.at(-1);Object.assign(e,{x:800+Math.cos(i*.61)*(105+i%4*32),y:500+Math.sin(i*.61)*(105+i%4*32),rupture:i%4,stagger:99,cooldown:99,leapCooldown:99});}
   for(const i of[1,4]){const e=w.enemies[i];e.stagger=0;e.windup=e.windupDuration=.42;e.angle=Math.atan2(500-e.y,800-e.x);}
   const hunter=w.enemies[2];
   if(state.startsWith('pulse')||state==='stack')a.zones=[{kind:'pulse',x:892,y:500,time:state==='pulse-imminent'?.2:state==='pulse-active'?0:1.1,active:state==='pulse-active'?.3:0,hit:state==='pulse-active'}];
   if(state.startsWith('hunter')||state==='stack'){a.hunterId=hunter.id;a.hunterWarning=state==='hunter-active'?0:.5;a.hunterTime=3;arena.ascensionVisual.step(w);hunter.x+=1;hunter.stagger=0;arena.ascensionVisual.step(w);}
   if(state==='fracture-proc'){
    Object.assign(w.enemies[0],{x:850,y:500,rupture:0});w.mutations=['staticRiposte'];a.fractured='staticRiposte';a.penalty=18;w.build.staticCharge=2;w.fire(800,500,0,false,true);w.stepProjectiles(.05);
   }
   if(state.startsWith('echo')){w.spawnEnemy('boss');const boss=w.enemies.at(-1);Object.assign(boss,{x:1100,y:470,enraged:true,windup:0,active:0,followup:false,comboFinish:false});a.echo();if(state==='echo-impact'){w.player.x=730;a.step(1.31);}else a.step(.4);}
   if(state==='stack'){a.penalty=18;a.zones.push({kind:'echo',x:720,y:410,time:.3,active:0,hit:false});}
   arena.cameras.main.centerOn(800,500);const before=JSON.stringify(w);arena.drawCombat();arena.vessel.render(w,arena.cosmetic);const pureRenderer=JSON.stringify(w)===before;game.step(performance.now(),0);game.step(performance.now(),0);
   return {state,pureRenderer,pool:arena.ascensionVisual.images.length,visible:arena.ascensionVisual.images.filter(i=>i.visible).map(i=>({frame:i.frame.name,x:i.x,y:i.y,width:i.displayWidth,height:i.displayHeight,depth:i.depth})),zoneCount:a.zones.length,hp:w.hp,proc:w.impacts.some(i=>i.kind==='sealFracture'),echo:w.impacts.some(i=>i.kind==='sealEcho'),textureReady:arena.textures.exists('ascension-vfx')};
  },state);
  assert.equal(meta.pureRenderer,true);assert.ok(meta.pool<=48);assert.ok(meta.visible.length>0);assert.equal(meta.textureReady,true);
  if(state==='fracture-proc'){assert.equal(meta.proc,true);assert.ok(meta.visible.some(i=>i.frame==='fractureFork'));}
  if(state==='echo-impact'){assert.equal(meta.echo,true);assert.equal(meta.hp,100);assert.ok(meta.visible.some(i=>i.frame==='chainSnap'));assert.ok(!meta.visible.some(i=>i.frame==='chainRim'));}
  if(state==='pulse-active')assert.ok(meta.visible.some(i=>i.frame==='pulseBurst'));
  if(state==='pulse-warning')assert.ok(meta.visible.some(i=>i.frame==='ripple'));
  if(state==='hunter-warning')assert.ok(meta.visible.some(i=>i.frame==='hunterEye'));
  await p.screenshot({path:`docs/q9d/vfx-production/evidence/${state}-${width}.png`});reports.push({width,height,touch,...meta});
 }
 await p.addStyleTag({content:'#app{filter:grayscale(1)}'});await p.screenshot({path:`docs/q9d/vfx-production/evidence/stack-gray-${width}.png`});await p.addStyleTag({content:'#app{filter:none}'});
 const checks=await p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat;const before=JSON.stringify(w.ascension);arena.setPhase('paused');for(let i=0;i<60;i++)arena.update(0,1000/60);const paused=JSON.stringify(w.ascension)===before;
  arena.setPhase('playing');w.hitstop=1;const v=JSON.stringify(w.ascension);w.step({dx:0,dy:0},.1);const hitstop=JSON.stringify(w.ascension)===v;w.hitstop=0;
  w.spawnEnemy('boss');w.enemies.at(-1).hp=700;const t=JSON.stringify(w.ascension);w.step({dx:0,dy:0},.1);const transform=JSON.stringify(w.ascension)===t;
  for(let i=0;i<100;i++)arena.drawCombat();const pool=arena.ascensionVisual.images.length;
  arena.run.start();arena.ascensionVisual.reset();arena.drawCombat();game.step(performance.now(),0);const reset=arena.ascensionVisual.images.every(i=>!i.visible);
  const canvas=document.querySelector('canvas').getBoundingClientRect(),hud=document.querySelector('#combat-hud').getBoundingClientRect();return {paused,hitstop,transform,pool,reset,lane:canvas.top>=hud.bottom-1||canvas.bottom<=hud.top+1,overflow:document.documentElement.scrollWidth>innerWidth,isolatedSave:localStorage.getItem('cursebreak.save.v1')===null};});
 for(const name of ['paused','hitstop','transform','reset','lane','isolatedSave'])assert.equal(checks[name],true,name);assert.ok(checks.pool<=48);assert.equal(checks.overflow,false);assert.deepEqual(errors,[]);
 if(width===390||width===1440){for(const[name,x,y]of[['nw',80,80],['ne',1520,80],['sw',80,920],['se',1520,920]]){await p.evaluate(async([x,y])=>{const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat;w.player.x=x;w.player.y=y;w.ascension.seal=4;w.ascension.penalty=18;w.ascension.zones=[{kind:'pulse',x:x+(x>800?-92:92),y,time:1,active:0,hit:false}];w.enemies=[];w.spawnEnemy('grunt');Object.assign(w.enemies.at(-1),{x,y:y+40});w.ascension.hunterId=w.enemies.at(-1).id;w.ascension.hunterWarning=.5;w.ascension.hunterTime=4;arena.cameras.main.centerOn(x,y);arena.drawCombat();arena.vessel.render(w,arena.cosmetic);game.step(performance.now(),0);game.step(performance.now(),0);},[x,y]);await p.screenshot({path:`docs/q9d/vfx-production/evidence/corner-${name}-${width}.png`});}}
 reports.push({width,checks,errors});await p.close();console.log('PASS renderer',width);
}
await b.close();fs.writeFileSync('docs/q9d/vfx-production/evidence/browser.json',JSON.stringify({method:'Actual dev renderer with registered production atlas. Explicit visual fixtures at frozen simulation ticks,24enemies+2windups, actual proc/echo events when stated. Not natural runs, mobile hardwareFPS/iOS/Safari or user acceptance.',reports},null,2));
