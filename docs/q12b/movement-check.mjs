import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const [width,height,touch] of [[390,844,true],[1440,1000,false]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:5173/a-new-game/?playtest=chain&draftSeed=808');await p.locator('#primary:enabled').click();
 await p.evaluate(async()=>{const {game}=await import('/a-new-game/src/main.ts');game.loop.stop();});
 const cdp=touch?await p.context().newCDPSession(p):null;const cases=[];
 for(const baseline of [true,false]){
  await p.evaluate(async baseline=>{const {arena:a,game}=await import('/a-new-game/src/main.ts');a.setPhase('playing');a.combat.reset();a.combat.enemies=[];a.run.ticks=0;a.run.spawnTicks=0;a.accumulator=0;a.feedbackBaseline=baseline;a.impactTier='heavy';a.impactAge=0;a.cameras.main.stopFollow();a.cameras.main.centerOn(800,500);a.cameras.main.preRender();game.events.emit('postrender');},baseline);
  if(touch){
   const move=await p.locator('#move-stick').boundingBox(),shoot=await p.locator('[data-action="shoot"]').boundingBox();
   const m={x:move.x+move.width/2,y:move.y+move.height/2,id:11},s={x:shoot.x+shoot.width/2,y:shoot.y+shoot.height/2,id:12};
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[m,s]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...m,x:m.x+30},{...s,x:s.x+20,y:s.y-20}]});
  }else{
   const canvas=await p.locator('canvas').boundingBox();await p.mouse.move(canvas.x+canvas.width*.7,canvas.y+canvas.height*.3);await p.keyboard.down('d');await p.keyboard.down('w');await p.mouse.down({button:'right'});
  }
  const movement=await p.evaluate(async touch=>{
   const {arena:a,game}=await import('/a-new-game/src/main.ts');const sample=a.touch.sample();
   for(let i=0;i<3;i++){a.update(0,1000/60);a.cameras.main.preRender();game.events.emit('postrender');}
   const point=a.cameras.main.getWorldPoint(a.input.activePointer.x,a.input.activePointer.y);
   const expected=touch?sample.manualAimAngle:Math.atan2(point.y-a.player.y,point.x-a.player.x);
   if(expected===null||Math.abs(a.player.angle-expected)>.03)throw Error('manual aim drift');
   if(a.player.x<=800||(!touch&&a.player.y>=500))throw Error('movement lost');
   return {x:a.player.x,y:a.player.y,angle:a.player.angle,expected,projectiles:a.combat.projectiles.length,manual:sample.manualAimAngle};
  },touch);assert.ok(movement.projectiles>0);
  cases.push(movement);
  if(touch)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else{await p.mouse.up({button:'right'});await p.keyboard.up('d');await p.keyboard.up('w');}
 }
 assert.deepEqual(cases[1],cases[0]);
 await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');a.impactTier='heavy';a.impactAge=0;});
 await p.setViewportSize({width:touch?844:1100,height:touch?390:760});
 await p.waitForTimeout(250);
 const resized=await p.evaluate(async()=>{const {arena:a,game}=await import('/a-new-game/src/main.ts');const c=a.cameras.main;a.resize(a.scale.gameSize);c.preRender();game.events.emit('postrender');const before=c.getWorldPoint(100,100);c.preRender();game.events.emit('postrender');const after=c.getWorldPoint(100,100);if(a.impactTier!==null||Math.hypot(after.x-before.x,after.y-before.y)>1e-4)throw Error('resize impulse tail');const sample=a.touch.sample();if(sample.dx||sample.dy||sample.manualAimAngle!==null)throw Error('resize stuck touch');return {zoom:c.zoom,tailCleared:true,aimStable:true};});
 assert.deepEqual(errors,[]);reports.push({width,height,touch,baseline:cases[0],q12b:cases[1],identical:true,resized,errors});await p.close();
}
await b.close();fs.writeFileSync('docs/q12b/evidence/movement.json',JSON.stringify(reports,null,2));console.log('PASS movement/manual aim A/B and resize');
