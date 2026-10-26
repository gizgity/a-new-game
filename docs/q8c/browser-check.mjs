import {chromium} from '/tmp/q8c-tools/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const [width,height] of [[1440,1000],[390,844],[844,390],[320,740]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:width!==1440});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5173/a-new-game/');await p.locator('#primary').click();await p.evaluate(async()=>{window.s=(await import('/a-new-game/src/main.ts')).game.scene.scenes[0];});
 // Real keyboard movement desktop, touch control press on mobile; boundary fixtures below are grants.
 const x=await p.evaluate(()=>s.player.x);
 if(width===1440){await p.keyboard.down('d');await p.waitForTimeout(150);await p.keyboard.up('d');assert.ok(await p.evaluate(()=>s.player.x)>x);}
 else {const btn=p.locator('[data-action="dash"]');if(await btn.count())await btn.tap();}
 await p.evaluate(()=>{s.combat.enemies=[];s.combat.projectiles=[];s.run.draftIndex=6;s.combat.kills=1200;s.run.ticks=13199;});
 await p.waitForFunction(()=>s.run.bossWarning>1.7);await p.locator('#pause').click();const clock=await p.evaluate(()=>s.run.bossWarning);await p.waitForTimeout(180);assert.equal(await p.evaluate(()=>s.run.bossWarning),clock);await p.locator('#primary').click();
 await p.waitForTimeout(120);await p.screenshot({path:`docs/q8c/evidence/warning-${width}.png`});
 await p.waitForFunction(()=>s.run.bossDue);assert.ok(await p.evaluate(()=>s.run.elapsed)>=222);
 // Freeze simulation for paired renderer captures; preserve actual drawCombat, not a mockup.
 await p.evaluate(()=>{window.originalUpdate=s.sys.sceneUpdate;s.sys.sceneUpdate=()=>{};const b=s.combat.enemies.find(e=>e.kind==='boss');s.combat.enemies=[b];b.x=s.player.x+100;b.y=s.player.y;b.angle=Math.PI;b.cooldown=99;s.drawCombat();s.onCombatChange(s.combat);});
 await p.waitForTimeout(100);await p.screenshot({path:`docs/q8c/evidence/phase1-${width}.png`});
 await p.evaluate(()=>{const b=s.combat.enemies[0];b.hp=750;s.combat.step({dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false},1/60);s.drawCombat();s.onCombatChange(s.combat);});
 await p.waitForTimeout(100);await p.screenshot({path:`docs/q8c/evidence/transform-${width}.png`});
 assert.ok(await p.evaluate(()=>s.combat.enemies[0].transform)>0);
 await p.evaluate(()=>{const b=s.combat.enemies[0];b.transform=0;b.followup=false;b.comboFinish=true;b.attackAction=0;b.windup=.14;b.windupDuration=.62;b.angle=Math.PI;s.drawCombat();s.onCombatChange(s.combat);});
 await p.waitForTimeout(100);await p.screenshot({path:`docs/q8c/evidence/followup-${width}.png`});
 const perf=await p.evaluate(()=>{const samples=[];for(let i=0;i<100;i++){const t=performance.now();s.drawCombat();s.onCombatChange(s.combat);samples.push(performance.now()-t);}samples.sort((a,b)=>a-b);return {medianDrawMs:samples[50],p95DrawMs:samples[95],displayList:s.children.length};});
 await p.selectOption('#locale','en');await p.selectOption('#locale','vi');
 // Warning replay reset; resume original Scene update by deleting override.
 await p.evaluate(()=>{s.sys.sceneUpdate=window.originalUpdate;s.setPhase('ready');s.setPhase('playing');});
 assert.equal(await p.evaluate(()=>s.run.bossWarning),0);assert.equal(await p.evaluate(()=>s.run.bossDue),false);
 const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);assert.deepEqual(errors,[]);
 reports.push({width,height,pauseWarningFreeze:true,arrivalAfter222:true,transformAsset:true,followupRender:true,replayReset:true,overflow,errors,perf,fixture:'Clock/kills/Boss HP and positions granted; renderer freezes for captures; software WebGL, not natural run or device acceptance.'});await p.close();
}
await browser.close();fs.writeFileSync('docs/q8c/evidence/browser.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));
