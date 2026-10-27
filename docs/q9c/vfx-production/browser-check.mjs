const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
import assert from 'node:assert/strict';import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=process.env.ONLY_ID?JSON.parse(fs.readFileSync('docs/q9c/vfx-production/evidence/browser.json')).filter(r=>r.id!==process.env.ONLY_ID):[],sizes=process.env.PREVIEW_ONLY?[[390,844,true]]:[[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]];
for(const [width,height,touch]of sizes){
 const ids=(process.env.PREVIEW_ONLY||width===320||width===844?['fracturedStorm']:['fracturedStorm','bloodMoon','volatileGround','staticField','brokenSeal','echoChamber']).filter(id=>!process.env.ONLY_ID||id===process.env.ONLY_ID);
 for(const id of ids){
  console.log('render',width,id);const p=await browser.newPage({viewport:{width,height},hasTouch:touch}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:5174/a-new-game/?playtest=anomaly-'+id);await p.locator('#primary').click();
  await p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');window.fixture=arena;game.loop.stop();arena.run.prepareBossPlaytest(0,134);for(let i=0;i<65&&arena.phase==='playing';i++)arena.update(0,1000/60);});
  await p.waitForTimeout(1100);if(touch)await p.locator('[data-choice="0"]').tap();else{await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}
  const metadata=await p.evaluate(async id=>{
   const {game}=await import('/a-new-game/src/main.ts');const a=fixture,w=a.combat;game.loop.stop();w.enemies=[];w.impacts=[];w.projectiles=[];
   for(let i=0;i<24;i++){w.spawnEnemy(i%6===0?'archer':'grunt',1000,i*.61);Object.assign(w.enemies.at(-1),{x:w.player.x+Math.cos(i*.61)*(85+i%4*32),y:w.player.y+Math.sin(i*.61)*(85+i%4*32),stagger:99,rupture:0,cooldown:99});}
   for(const i of[1,4]){const e=w.enemies[i];e.stagger=0;e.windup=e.windupDuration=.42;e.angle=Math.atan2(w.player.y-e.y,w.player.x-e.x);}
   if(id==='fracturedStorm'||id==='volatileGround'){w.anomaly.clock=0;w.anomaly.step(.01);w.anomaly.zones[0].time=w.anomaly.zones[0].duration*.65;}
   if(id==='bloodMoon'){
    w.combo=2;w.comboWindow=1;w.chargedShots=w.chargePoints=0;
    const walker=w.enemies[2];Object.assign(walker,{x:w.player.x+175,y:w.player.y+80,stagger:0,windup:0,leapCooldown:99});
    for(let n=0;n<20;n++){w.hitstop=0;a.anomalyVisual.step(w);w.step({dx:0,dy:0,melee:true,shoot:false,heavy:false,dash:false},1/60);a.anomalyVisual.step(w);}
   }
   if(id==='staticField'){
    w.perfectAvailable=true;w.rewardPerfectDodge();const archer=w.enemies.find(e=>e.kind==='archer');Object.assign(archer,{x:w.player.x+210,y:w.player.y-90,stagger:0,windup:.001,windupDuration:.7});w.stepEnemy(archer,1/60);
    for(let n=0;n<8;n++){w.hitstop=0;w.step({dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false},1/60);}
   }
   if(id==='brokenSeal'){
    const e=w.enemies[2];w.hitEnemy(e,1,0,0,.6,true,'heavy');
    const old=w.enemies[3];w.anomaly.resistance.set(old.id,.6);old.stagger=0;old.cooldown=99;
   }
   if(id==='echoChamber'){
    const a=w.enemies[2],b=w.enemies[3];Object.assign(a,{x:w.player.x+40,y:w.player.y+20,rupture:1});Object.assign(b,{x:w.player.x+220,y:w.player.y+20,rupture:2});w.detonate(a,1);w.resolveExplosions();
   }
   const before=JSON.stringify(w);a.drawCombat();const pure=before===JSON.stringify(w);game.step(performance.now(),0);game.step(performance.now(),0);
   const visible=a.anomalyVisual.images.filter(i=>i.visible).map(i=>({frame:i.frame.name,texture:i.texture.key,x:i.x,y:i.y,w:i.displayWidth,h:i.displayHeight,depth:i.depth,originX:i.originX}));
   return {id,pure,active:w.anomaly.active,visible,pool:a.anomalyVisual.images.length,zones:structuredClone(w.anomaly.zones),enemyCount:w.enemies.length,impacts:w.impacts.map(i=>i.kind),save:localStorage.getItem('cursebreak.save.v1')};
  },id);
  assert.equal(metadata.pure,true);assert.equal(metadata.active,id);assert.ok(metadata.pool<=96);assert.equal(metadata.save,null);assert.equal(metadata.enemyCount,24);
  if(id==='fracturedStorm')assert.equal(metadata.visible.filter(i=>i.frame==='bracket').length,4);
  if(id==='bloodMoon'){assert.ok(metadata.impacts.includes('anomalyFinisher'));assert.ok(metadata.visible.some(i=>i.frame==='bloodCrescent'));}
  if(id==='staticField'){assert.ok(metadata.impacts.includes('anomalyCounter'));assert.equal(metadata.visible.filter(i=>i.frame==='forkShot').length,2);assert.ok(metadata.visible.filter(i=>i.frame==='forkShot').every(i=>i.originX===.8));}
  if(id==='brokenSeal'){assert.ok(metadata.visible.some(i=>i.frame==='resistance'));assert.ok(metadata.impacts.includes('anomalySeal'));}
  if(id==='echoChamber'){assert.ok(metadata.impacts.includes('anomalyRelay'));assert.equal(metadata.zones.length,1);}
  await p.screenshot({path:`docs/q9c/vfx-production/evidence/${id}-${width}.png`});
  if(id==='fracturedStorm'||id==='volatileGround'||id==='echoChamber'){
   await p.evaluate(async()=>{const {game}=await import('/a-new-game/src/main.ts');for(const z of fixture.combat.anomaly.zones)z.time=z.duration*.12;fixture.drawCombat();game.step(performance.now(),0);game.step(performance.now(),0);});
   await p.screenshot({path:`docs/q9c/vfx-production/evidence/${id}-imminent-${width}.png`});
   await p.evaluate(async()=>{const {game}=await import('/a-new-game/src/main.ts');fixture.combat.anomaly.step(2);fixture.drawCombat();game.step(performance.now(),0);game.step(performance.now(),0);});
   await p.screenshot({path:`docs/q9c/vfx-production/evidence/${id}-impact-${width}.png`});
  }
  if(id==='fracturedStorm'){
   await p.evaluate(async()=>{const {game}=await import('/a-new-game/src/main.ts');const w=fixture.combat;w.anomaly.zones=[];w.anomaly.clock=0;w.anomaly.step(.01);w.impacts=[];fixture.drawCombat();game.step(performance.now(),0);game.step(performance.now(),0);});
   await p.addStyleTag({content:'#app { filter: grayscale(1); }'});await p.screenshot({path:`docs/q9c/vfx-production/evidence/storm-gray-${width}.png`});await p.addStyleTag({content:'#app { filter: none; }'});
   const corners=[];
   for(const [name,x,y]of[['nw',80,80],['ne',1520,80],['sw',80,920],['se',1520,920]]){
    const lane=await p.evaluate(async([x,y])=>{const {game}=await import('/a-new-game/src/main.ts');const a=fixture,w=a.combat,dx=x-w.player.x,dy=y-w.player.y;w.player.x=x;w.player.y=y;for(const z of w.anomaly.zones){z.x+=dx;z.y+=dy;}for(const e of w.enemies){e.x=Math.max(48,Math.min(1552,e.x+dx));e.y=Math.max(48,Math.min(952,e.y+dy));}a.cameras.main.stopFollow();a.cameras.main.centerOn(x,y);a.drawCombat();game.step(performance.now(),0);game.step(performance.now(),0);const c=document.querySelector('canvas').getBoundingClientRect(),h=document.querySelector('#combat-hud').getBoundingClientRect();return c.top>=h.bottom-1||c.bottom<=h.top+1;},[x,y]);assert.equal(lane,true);corners.push({name,lane});
    if(width===390||width===1440)await p.screenshot({path:`docs/q9c/vfx-production/evidence/corner-${name}-${width}.png`});
   }
   metadata.corners=corners;
  }
  const lifecycle=await p.evaluate(async()=>{
   const {game}=await import('/a-new-game/src/main.ts');const a=fixture,w=a.combat;const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
   const before=JSON.stringify(w);a.setPhase('paused');const frozen=JSON.stringify(w);for(let n=0;n<4;n++)a.update(0,1000/60);const pause=frozen===JSON.stringify(w);a.setPhase('playing');
   w.hitstop=1;const clocks=JSON.stringify({zones:w.anomaly.zones,impacts:w.impacts});w.step(idle,1/60);const hitstop=clocks===JSON.stringify({zones:w.anomaly.zones,impacts:w.impacts});
   w.hitstop=0;w.spawnEnemy('boss',1500);const boss=w.enemies.at(-1);Object.assign(boss,{x:1200,y:500,windup:.7,windupDuration:.7});w.step(idle,1/60);a.drawCombat();const noDanger=w.anomaly.zones.length===0&&!w.projectiles.some(s=>s.anomaly);
   boss.hp=700;const effects=JSON.stringify({zones:w.anomaly.zones,impacts:w.impacts});w.step(idle,1/60);const transform=effects===JSON.stringify({zones:w.anomaly.zones,impacts:w.impacts});
   w.reset();a.anomalyVisual.reset();a.drawCombat();const reset=a.anomalyVisual.images.every(i=>!i.visible)&&w.anomaly.active===null;game.step(performance.now(),0);
   return {pause,hitstop,noDanger,transform,reset,initialSnapshot:before.length};
  });
  for(const key of ['pause','hitstop','noDanger','transform','reset'])assert.equal(lifecycle[key],true,key);
  assert.deepEqual(errors,[]);reports.push({width,height,touch,...metadata,lifecycle,errors});await p.close();
 }
}
await browser.close();fs.writeFileSync('docs/q9c/vfx-production/evidence/browser.json',JSON.stringify(reports,null,2));console.log('PASS renderer scenarios',reports.length);
