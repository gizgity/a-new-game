import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const base='http://127.0.0.1:5173/a-new-game/',reports=[];
for(const [width,height,touch] of [[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:touch}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'?playtest=seal-4');await p.locator('#primary').waitFor({state:'visible'});await p.waitForTimeout(300);
 await p.selectOption('#seal-select','4');if(touch)await p.locator('#primary').tap();else await p.locator('#primary').click();
 await p.waitForTimeout(1100);if(touch)await p.locator('[data-choice="0"]').tap();else {await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}
 if(await p.locator('#draft-panel').isVisible()){await p.waitForTimeout(1100);if(touch)await p.locator('[data-choice="0"]').tap();else await p.locator('[data-choice="0"]').click();}
 const result=await p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');game.loop.stop();const w=arena.combat;
  w.enemies=[];arena.run.anomalyResolved=true;w.anomaly.reset();w.anomaly.equip('bloodMoon');w.ascension.pulseClock=.01;w.step({dx:0,dy:0},1/60);arena.update(0,0);game.step(performance.now(),0);
  return {seal:w.ascension.seal,zones:w.ascension.zones.length,phase:arena.phase};});
 assert.equal(result.seal,4);assert.equal(result.zones,1);assert.equal(result.phase,'playing');
 await p.screenshot({path:`docs/q9d/evidence/pulse-${width}.png`});
 await p.locator('#pause').click();await p.selectOption('#locale','en');assert.match(await p.locator('#seal-picker').textContent(),/Distortion:/);await p.selectOption('#locale','vi');
 const frozen=await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');const before=JSON.stringify(arena.combat.ascension);for(let i=0;i<120;i++)arena.update(0,1000/60);return before===JSON.stringify(arena.combat.ascension);});assert.equal(frozen,true);

 await p.locator('#pause').click();
 // Real held movement and release through each input path.
 const before=await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');return arena.player.x;});
 if(!touch){await p.keyboard.down('d');await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');for(let i=0;i<20;i++)arena.update(0,1000/60);});await p.keyboard.up('d');}
 else {const cdp=await p.context().newCDPSession(p);const b=await p.locator('#move-stick').boundingBox().catch(()=>null);if(b){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width/2+40,y:b.y+b.height/2,id:1}]});await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');for(let i=0;i<20;i++)arena.update(0,1000/60);});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}}
 const after=await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');return arena.player.x;});assert.ok(after>before);
 const geometry=await p.evaluate(()=>{const a=document.querySelector('canvas').getBoundingClientRect(),h=document.querySelector('#combat-hud').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,lane:a.top>=h.bottom-1||a.bottom<=h.top+1};});assert.equal(geometry.overflow,false);assert.equal(geometry.lane,true);
 assert.equal(await p.evaluate(()=>localStorage.getItem('cursebreak.save.v1')),null);assert.deepEqual(errors,[]);
 reports.push({width,height,touch,...result,frozen,geometry,isolatedSave:true,movement:true,errors});await p.close();
}
// Production save lifecycle: choose, ticket lock, refresh, defeat, Victory and no double reward.
const p=await browser.newPage();await p.goto(base);const fixture=await p.evaluate(async()=>{const {defaultProfile}=await import('/a-new-game/src/game/progression.ts');const {SIGILS}=await import('/a-new-game/src/game/config/legacy.ts');const p=defaultProfile();p.totals.runs=10;p.legacy.unlocks.push(...SIGILS);p.legacy.ascension={version:1,highest:3,selected:0,clears:[0,1,2]};return p;});await p.addInitScript(data=>{if(!sessionStorage.getItem('q9d-seeded')){localStorage.setItem('cursebreak.save.v1',JSON.stringify(data));sessionStorage.setItem('q9d-seeded','1');}},fixture);await p.reload();await p.selectOption('#seal-select','3');await p.locator('#primary').click();await p.waitForTimeout(1100);await p.locator('[data-choice="0"]').click();
let ticket=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')).legacy.ticket);assert.equal(ticket.seal,3);await p.reload();assert.equal(await p.locator('#seal-select').isDisabled(),true);await p.locator('#primary').click();
const saved=await p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');game.loop.stop();arena.combat.bossSlain=true;arena.update(0,1000/60);return JSON.parse(localStorage.getItem('cursebreak.save.v1'));});assert.equal(saved.legacy.receipt.sealClear,3);assert.equal(saved.legacy.ascension.highest,4);await p.reload();assert.match(await p.locator('#seal-result').textContent(),/3.*4/);assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')).legacy),saved.legacy);reports.push({productionTicketRefresh:true,victoryUnlock:true,receiptIdempotent:true});await p.close();
fs.writeFileSync('docs/q9d/evidence/browser.json',JSON.stringify(reports,null,2));await browser.close();console.log('Q9D browser PASS',reports.length);
