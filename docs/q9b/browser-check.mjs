const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
browser.on("disconnected",()=>{});
for(const [width,height,touch] of [[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]]){
 console.log('viewport',width);const p=await browser.newPage({viewport:{width,height},hasTouch:touch});p.setDefaultTimeout(10000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5173/a-new-game/');await p.locator('#primary').click();await p.waitForTimeout(150);
 const first=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));assert.equal(first.legacy.ticket.firstRun,true);
 await p.reload();await p.locator('#primary').click();await p.waitForTimeout(150);
 assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')).legacy.ticket),first.legacy.ticket);
 // Drive the actual RunController victory predicate through a browser fixture, no production cheat URL.
 await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');arena.run.draft=[];arena.combat.bossSlain=true;arena.setPhase('playing');});
 await p.waitForFunction(()=>document.querySelector('#overlay').dataset.result==='victory');await p.waitForTimeout(1600);
 assert.equal(await p.locator('#reward-reveal .collection-item').count(),2);
 const victory=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));assert.equal(victory.legacy.victories,1);assert.equal(victory.legacy.ticket,null);
 await p.locator('#reward-reveal').screenshot({path:`docs/q9b/evidence/rewards-${width}.png`});
 await p.reload();await p.waitForTimeout(200);assert.equal(await p.locator('#reward-reveal .collection-item').count(),2);
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')).legacy.victories),1);
 await p.selectOption('#locale','en');await p.locator('#collection summary').click();assert.match(await p.locator('#collection-list').textContent(),/Sigils 2\/6/);
 assert.equal(await p.locator('#collection-list .collection-item').count(),24);
 await p.locator('#collection').screenshot({path:`docs/q9b/evidence/collection-${width}.png`});await p.locator('#collection summary').click();
 console.log('new run',width);await p.locator('#primary').click();console.log('clicked',width);await p.waitForTimeout(1200);assert.equal(await p.locator('[data-choice]').count(),2);
 const next=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));assert.notEqual(next.legacy.ticket.seed,first.legacy.ticket.seed);assert.notEqual(next.legacy.ticket.runId,first.legacy.ticket.runId);
 await p.screenshot({path:`docs/q9b/evidence/offers-${width}.png`});
 if(touch) await p.locator('[data-choice="0"]').tap();else {await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}
 await p.waitForTimeout(100);const selected=await p.locator('#legacy-indicator').textContent();assert.ok(selected.length);
 await p.reload();await p.locator('#primary').click();await p.waitForTimeout(100);assert.equal(await p.locator('#legacy-indicator').textContent(),selected);
 await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');arena.run.draft=[];arena.combat.hp=0;arena.setPhase('playing');});await p.waitForTimeout(200);
 await p.waitForFunction(()=>document.querySelector('#overlay').dataset.result==='defeat');
 const defeat=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));assert.deepEqual(defeat.legacy.unlocks,victory.legacy.unlocks);assert.equal(defeat.legacy.ticket,null);
 await p.reload();await p.waitForTimeout(100);assert.equal(await p.locator('#overlay').getAttribute('data-result'),'defeat');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 reports.push({width,height,touch,firstVictoryTwoSigils:true,refreshReceiptIdempotent:true,newRunTwoOffers:true,refreshChoice:true,collectionViEn:true,errors});await p.close();
}
// Failure injection: journal survives a main-save quota error, result blocks new run until retry.
{
 const p=await browser.newPage();p.setDefaultTimeout(10000);
 await p.goto('http://127.0.0.1:5173/a-new-game/');await p.locator('#primary').click();await p.waitForTimeout(100);
 await p.evaluate(async()=>{
  const original=Storage.prototype.setItem;
  window.restoreSave=()=>Storage.prototype.setItem=original;
  Storage.prototype.setItem=function(k,v){if(k==='cursebreak.save.v1')throw Error('quota fixture');return original.call(this,k,v);};
  const {arena}=await import('/a-new-game/src/main.ts');arena.run.draft=[];arena.combat.bossSlain=true;arena.setPhase('playing');
 });
 await p.waitForFunction(()=>document.querySelector('#overlay').dataset.result==='victory');await p.waitForTimeout(1600);
 assert.ok((await p.locator('#progression-save').textContent()).length);await p.locator('#primary').click();assert.equal(await p.locator('#overlay').getAttribute('data-result'),'victory');
 await p.reload();await p.waitForTimeout(150);assert.equal(await p.locator('#reward-reveal .collection-item').count(),2);
 await p.locator('#primary').click();await p.waitForTimeout(1200);await p.locator('[data-choice="0"]').click();
 await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');arena.run.draft=[];arena.combat.bossSlain=true;arena.setPhase('playing');});
 await p.waitForFunction(()=>document.querySelector('#overlay').dataset.result==='victory');await p.waitForTimeout(1600);
 assert.equal(await p.locator('#reward-reveal .collection-item').count(),1);
 const second=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));assert.equal(second.legacy.victories,2);
 reports.push({mainWriteFailureBlocksNewRun:true,journalRefreshRecoversReward:true,secondVictoryOneUnlock:true});await p.close();
}
for(const query of ['playtest=boss','playtest=legacy-fire-core','draftSeed=55','draftDebug=1']){
 const p=await browser.newPage();await p.goto('http://127.0.0.1:5173/a-new-game/?'+query);await p.locator('#primary').click();await p.waitForTimeout(100);
 assert.equal(await p.evaluate(()=>localStorage.getItem('cursebreak.save.v1')),null);await p.close();
}
await browser.close();fs.writeFileSync('docs/q9b/evidence/browser.json',JSON.stringify(reports,null,2));console.log(reports);
