import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
const read=page=>page.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');return {phase:a.phase,step:a.tutorial?.stepIndex,charges:a.combat.heavyCharges,runs:a.run.elapsed,profile:JSON.parse(localStorage.getItem('cursebreak.save.v1'))};});
try { for(const [width,height,touch] of [[320,740,true],[390,844,true],[844,390,true],[1440,900,false]]) {
 const p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.goto('http://localhost:5173/a-new-game/');await p.locator('#primary:enabled').waitFor();
 await p.locator('#primary').click();assert.equal((await read(p)).step,0);
 const before=(await read(p)).profile;
 // UI and layout in both languages at each step; controlled real CombatWorld inputs.
 for(let step=0;step<5;step++){
  for(const locale of ['vi','en']){await p.selectOption('#locale',locale);const box=await p.locator('#tutorial').boundingBox(),canvas=await p.locator('canvas').boundingBox();assert.ok(box.y+box.height<=canvas.y+1);assert.ok(box.x>=0&&box.x+box.width<=width);assert.ok((await p.locator('#tutorial-text').textContent()).startsWith(`${step+1}/5`));await p.screenshot({path:`docs/q13/evidence/${width}-${step}-${locale}.png`});}
  await p.evaluate(async(step)=>{const {arena:a,game}=await import('/a-new-game/src/main.ts');game.loop.sleep();const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};const field=['dx','melee','shoot','heavy','dash'][step];for(let i=0;i<180&&a.tutorial?.stepIndex===step;i++){const e=a.combat.enemies[0];if(e)a.player.angle=Math.atan2(e.y-a.player.y,e.x-a.player.x);a.tutorial?.step({...idle,[field]:field==='dx'?1:true},1/60);}a.update(0,1000/60);game.loop.wake();},step);
  if(step<4)assert.equal((await read(p)).step,step+1);
 }
 const finished=await read(p);assert.equal(finished.step,undefined);assert.equal(finished.profile.tutorialDone,true);for(const key of ['totals','legacy','drafts','collection','unlocks'])assert.deepEqual(finished.profile[key],before[key]);
 await p.reload();await p.locator('#primary:enabled').waitFor();await p.locator('#tutorial-replay').click();await p.locator('#tutorial-skip').click();assert.equal((await read(p)).profile.totals.runs,0);
 await p.locator('#primary').click();assert.equal((await read(p)).step,undefined);assert.equal((await read(p)).profile.totals.runs,1);
 await p.locator('#pause').click();await p.selectOption('#locale','vi');await p.locator('#primary').click();
 // R release/cancel + Shift negative tested through actual browser keyboard on desktop.
 if(!touch){
  await p.keyboard.press('Shift');assert.equal((await read(p)).charges,2);
  await p.keyboard.down('r');await p.waitForTimeout(250);assert.equal((await read(p)).charges,2);
  await p.keyboard.up('r');await p.waitForTimeout(400);assert.equal((await read(p)).charges,1);
  await p.keyboard.down('r');await p.locator('#pause').click();await p.keyboard.up('r');await p.locator('#primary').click();await p.waitForTimeout(200);assert.equal((await read(p)).charges,1);
 } else {
  const heavy=p.locator('[data-action=heavy]'),b=await heavy.boundingBox();const cdp=await p.context().newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2}]});await p.waitForTimeout(150);assert.equal((await read(p)).charges,2);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(350);assert.equal((await read(p)).charges,1);
 }
 assert.deepEqual(errors,[]);reports.push({width,height,touch,errors,profileUnchanged:true,completed:finished.profile.tutorialDone});await p.close();
} fs.writeFileSync('docs/q13/evidence/browser.json',JSON.stringify(reports,null,2));console.log('PASS 4 viewport / vi-en / tutorial 5 real combat steps / isolation / skip replay reload / Heavy input');
}finally{await browser.close();}
