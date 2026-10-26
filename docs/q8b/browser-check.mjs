import {chromium} from '/tmp/q8b-tools/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
for(const width of [1440,390]){
 const p=await b.newPage({viewport:{width,height:width===390?844:1000},hasTouch:width===390}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5173/a-new-game/');await p.locator('#primary').click();
 await p.evaluate(async()=>{const {game}=await import('/a-new-game/src/main.ts');window.s=game.scene.scenes[0];});
 await p.locator('#pause').click();const clock=await p.evaluate(()=>s.run.ticks);await p.waitForTimeout(160);assert.equal(await p.evaluate(()=>s.run.ticks),clock);await p.locator('#primary').click();
 const milestones=[];
 for(let i=0;i<6;i++){
  // Boundary fixture only: grant banked kills and position clock at each floor, no natural-run claim.
  await p.evaluate(i=>{s.combat.enemies=[];s.combat.projectiles=[];s.combat.kills=9999;s.run.ticks=[20,50,85,120,155,190][i]*60-1;},i);
  await p.waitForFunction(()=>s.phase==='draft');const t=await p.evaluate(()=>s.run.ticks);await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>s.run.ticks),t);
  await p.waitForFunction(()=>!document.querySelector('[data-choice="0"]').disabled);await p.locator('[data-choice="0"]').click();await p.waitForFunction(()=>s.phase==='playing');milestones.push(t/60);
 }
 await p.evaluate(()=>{s.run.ticks=13199;s.combat.enemies=[];});await p.waitForFunction(()=>s.run.bossDue);const arrival=await p.evaluate(()=>s.run.elapsed);assert.ok(arrival>=220&&arrival<221);
 await p.evaluate(()=>{s.combat.bossSlain=true;});await p.waitForFunction(()=>s.phase==='victory');await p.waitForSelector('#primary');await p.locator('#primary').click();await p.waitForFunction(()=>s.phase==='playing');assert.equal(await p.evaluate(()=>s.combat.kills),0);assert.equal(await p.evaluate(()=>s.run.bossDue),false);
 await p.evaluate(()=>{s.run.ticks=17999;s.combat.enemies=[];});await p.waitForFunction(()=>s.phase==='defeat');assert.equal(await p.evaluate(()=>s.run.reason),'deadline');await p.locator('#primary').click();await p.waitForFunction(()=>s.phase==='playing');
 reports.push({width,milestones,arrival,pauseFreeze:true,draftFreeze:true,victoryReplay:true,deadlineReplay:true,errors,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),fixture:'Banked kills/clock/Boss slain granted for lifecycle boundaries; Chromium software WebGL, not natural input run/device acceptance.'});assert.deepEqual(errors,[]);await p.close();
}
await b.close();fs.writeFileSync('docs/q8b/browser.json',JSON.stringify(reports,null,2));console.log(reports);
