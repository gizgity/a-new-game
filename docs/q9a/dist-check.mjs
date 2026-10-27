const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
import assert from 'node:assert/strict';import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const touch of [true,false]){
 const p=await browser.newPage({viewport:{width:touch?390:1440,height:touch?844:1000},hasTouch:touch}),errors=[],failed=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 // Owned-ID fixture in this fresh browser context only; does not alter production grants/economy.
 await p.addInitScript(()=>{if(!localStorage.getItem('cursebreak.save.v1'))localStorage.setItem('cursebreak.save.v1',JSON.stringify({version:1,settings:{locale:'vi',muted:true,volume:0,cosmetic:'mint'},totals:{kills:0,detonations:0,perfectDodges:0,victories:0,runs:1},unlocks:[],drafts:{previous:[],current:[],active:false},legacy:{unlocks:['fire','wildfire','water','flowState','ice','crystalEcho'],previous:[],ticket:null}}));});
 await p.goto('http://127.0.0.1:5175/a-new-game/');await p.locator('#primary').click();await p.waitForTimeout(1150);assert.equal(await p.locator('[data-choice]').count(),2);
 const before=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));
 assert.notDeepEqual(before.legacy.ticket.offers[0],before.legacy.ticket.offers[1]);
 if(touch)await p.locator('[data-choice="1"]').tap();else await p.locator('[data-choice="1"]').click();
 await p.waitForTimeout(150);const selected=await p.locator('#legacy-indicator').textContent();assert.ok(selected.length>0);
 await p.reload();await p.locator('#primary').click();await p.waitForTimeout(150);
 assert.equal(await p.locator('#overlay').isVisible(),false);assert.equal(await p.locator('#legacy-indicator').textContent(),selected);
 const after=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));
 assert.equal(after.totals.runs,before.totals.runs);assert.equal(after.legacy.ticket.seed,before.legacy.ticket.seed);assert.deepEqual(after.legacy.ticket.offers,before.legacy.ticket.offers);
 assert.deepEqual(after.legacy.unlocks,before.legacy.unlocks);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 reports.push({touch,twoDistinctOffers:true,refreshKeepsSeedOffersChoiceAndRunNumber:true,noUnlockGrants:true,errors,failed});await p.close();
}
await browser.close();fs.writeFileSync('docs/q9a/evidence/dist.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));
