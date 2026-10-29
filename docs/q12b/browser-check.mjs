import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
for(const [width,height,touch] of [[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:5173/a-new-game/?playtest=chain');await p.locator('#primary:enabled').click();
 const storage=await p.evaluate(()=>JSON.stringify(localStorage));
 const result=await p.evaluate(async()=>{
  const {arena:a,game}=await import('/a-new-game/src/main.ts');game.loop.stop();a.setPhase('playing');
  const w=a.combat,c=a.cameras.main;w.enemies=[];w.projectiles=[];w.explosions=[];w.hitstop=0;
  const before=JSON.stringify(w);a.drawCombat();a.enemySprites.stepFeedback(.016);a.drawCombat();if(JSON.stringify(w)!==before)throw Error('render mutated world');
  for(let i=0;i<24;i++){w.spawnEnemy(i===0?'boss':i===1?'bulwark':i%3===0?'archer':'grunt');const e=w.enemies.at(-1);e.x=710+(i%6)*34;e.y=410+Math.floor(i/6)*46;e.hp=e.maxHp=10000;e.windup=.4;e.windupDuration=.7;e.attackAction=0;e.angle=.7;}
  // Confirmed damage, retain actual warning states (Boss immune to interruption).
  for(const e of w.enemies)w.hitEnemy(e,1,0,0,0,true,'light3');
  a.drawCombat();const boss=w.enemies[0],body=a.enemySprites.bodies.get(boss.id);
  if(body.image.tintFill)throw Error('warning obscured');
  const snapshot=JSON.stringify(w);a.impactTier='heavy';a.impactAge=0;c.preRender();game.events.emit('postrender');
  c.stopFollow();const point=c.getWorldPoint(100,100);const logical={x:c.scrollX,y:c.scrollY};
  c.preRender();const shifted=c.getWorldPoint(100,100);const offset=point.x-shifted.x;
  if(Math.abs(offset*c.zoom)>(a.touch.enabled?.9001:3.0001))throw Error(JSON.stringify({offset,zoom:c.zoom,point,shifted,scrollX:c.scrollX,logical,touch:a.touch.enabled}));
  game.events.emit('postrender');const restored=c.getWorldPoint(100,100);
  if(Math.abs(restored.x-point.x)>1e-4||c.scrollX!==logical.x||c.scrollY!==logical.y)throw Error('aim/logical camera drift');
  if(JSON.stringify(w)!==snapshot)throw Error('camera mutated world');
  for(const enemy of w.enemies.slice(0,2)) {
   const saved={windup:enemy.windup,active:enemy.active,transform:enemy.transform};
   for(const phase of ['windup','active',...(enemy.kind==='boss'?['transform']:[])]) {
    enemy.windup=enemy.active=enemy.transform=0;enemy[phase]=.2;a.drawCombat();
    if(a.enemySprites.bodies.get(enemy.id).image.tintFill)throw Error('warning tint '+phase);
   }
   Object.assign(enemy,saved);
  }
  const flashed=w.enemies[2],fb=a.enemySprites.bodies.get(flashed.id);
  for(const [cue,seconds] of [['light',.045],['light3',.07],['heavy',.09]]) {
   w.hitEnemy(flashed,1,0,0,0,true,cue);a.drawCombat();
   if(fb.flash!==seconds)throw Error('flash duration');
   a.enemySprites.stepFeedback(seconds+.001);a.drawCombat();if(fb.flash!==0)throw Error('flash prolonged by simulation hitstop');
  }
  a.setPhase('paused');if(a.impactTier!==null)throw Error('pause tail');a.setPhase('playing');if(a.impactTier!==null)throw Error('resume replay');
  a.impactTier='heavy';a.impactAge=.1;if((await import('/a-new-game/src/game/impactMotion.ts')).impactOffset(a.impactTier,a.impactAge,a.touch.enabled)!==0)throw Error('decay');
  c.centerOn(w.player.x,w.player.y);a.drawCombat();a.vessel.render(w,a.cosmetic);
  return {worldPure:true,warningVisible:true,flashDurations:true,screenPixels:Math.abs(offset*c.zoom),aimRestored:true,lifecycle:true,crowd:w.enemies.length};
 });
 for(const baseline of [true,false]){
  await p.evaluate(async baseline=>{const {arena:a,game}=await import('/a-new-game/src/main.ts');a.feedbackBaseline=baseline;a.drawCombat();a.vessel.render(a.combat,a.cosmetic);game.renderer.preRender();a.cameras.main.preRender();game.renderer.render(a,a.children.list,a.cameras.main);game.renderer.postRender();game.events.emit('postrender');},baseline);
  await p.screenshot({path:`docs/q12b/evidence/${baseline?'baseline':'q12b'}-${width}.png`});
 }
 assert.equal(await p.evaluate(()=>JSON.stringify(localStorage)),storage);assert.deepEqual(errors,[]);results.push({width,height,touch,...result,errors});await p.close();
}
await browser.close();fs.writeFileSync('docs/q12b/evidence/browser.json',JSON.stringify(results,null,2));console.log('PASS four viewports');
