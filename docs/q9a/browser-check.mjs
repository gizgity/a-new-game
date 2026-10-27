const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const url='http://127.0.0.1:5173/a-new-game/';
const reports=[];
for(const [width,height,touch] of [[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?playtest=legacy-shadow-nightfall');
 await page.locator('#primary').click();await page.waitForTimeout(1200);
 assert.equal(await page.locator('#draft-panel [data-choice]').count(),1);
 assert.match(await page.locator('#status').textContent(),/LEGACY/);
 await page.screenshot({path:`docs/q9a/evidence/selection-${width}.png`});
 if(touch)await page.locator('[data-choice="0"]').tap();else {await page.locator('[data-choice="0"]').focus();await page.keyboard.press('Enter');}
 await page.waitForTimeout(250);
 assert.equal(await page.locator('#overlay').isVisible(),false);
 assert.match(await page.locator('#legacy-indicator').textContent(),/Shadow.*Nightfall/);
 await page.locator('#pause').click();await page.selectOption('#locale','en');
 assert.equal(await page.locator('#status').textContent(),'PAUSED');
 await page.locator('#primary').click();await page.waitForTimeout(150);
 const state=await page.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');return {selection:arena.combat.legacy.selection,ticks:arena.run.ticks,save:localStorage.getItem('cursebreak.save.v1'),overflow:document.documentElement.scrollWidth>innerWidth};});
 assert.deepEqual(state.selection,{sigil:'shadow',branch:'nightfall'});assert.equal(state.save,null);assert.equal(state.overflow,false);
 await page.screenshot({path:`docs/q9a/evidence/combat-${width}.png`});
 assert.deepEqual(errors,[]);reports.push({width,height,touch,selectionGuard:true,chooseWith:touch?'tap':'keyboard',pauseLocaleResume:true,isolatedSave:true,overflow:false,errors});await page.close();
}
// Normal profile: empty pool, first run without Sigil, no unlock/reward bypass.
{
 const p=await browser.newPage();await p.goto(url);await p.locator('#primary').click();await p.waitForTimeout(150);
 const result=await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');const profile=JSON.parse(localStorage.getItem('cursebreak.save.v1'));return {selected:arena.combat.legacy.selection,firstRun:profile.legacy.ticket.firstRun,unlocks:profile.legacy.unlocks,runs:profile.totals.runs,seed:profile.legacy.ticket.seed};});
 assert.equal(result.selected,null);assert.equal(result.firstRun,true);assert.deepEqual(result.unlocks,[]);
 await p.reload();await p.locator('#primary').click();await p.waitForTimeout(150);
 const after=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));
 assert.equal(after.totals.runs,result.runs);assert.equal(after.legacy.ticket.seed,result.seed);assert.equal(after.legacy.ticket.firstRun,true);
 reports.push({normalFirstRun:true,emptyPoolNoUnlock:true,refreshTicketAndRunCountStable:true});await p.close();
}
await browser.close();fs.writeFileSync('docs/q9a/evidence/browser.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));
