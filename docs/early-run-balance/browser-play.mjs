// Actual Chromium RAF + keyboard/mouse, no manual stepping or resource grants.
import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],samples=[],drafts=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173/a-new-game/');await page.locator('#primary:enabled').waitFor();
await page.locator('#primary').click();
let held=new Set(),mouseHeld=false,lastSnapshot=-1,lastSpecial=-1;
const started=Date.now();
while(Date.now()-started<210000){
 const s=await page.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');const w=arena.combat,r=arena.run,c=arena.cameras.main;
  const e=w.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-w.player.x,a.y-w.player.y)-Math.hypot(b.x-w.player.x,b.y-w.player.y))[0];
  return {seed:r.seedOverride,phase:arena.phase,time:r.elapsed,result:r.result,hp:w.hp,barrier:w.barrier.value,kills:w.kills,damage:w.draftSignals.enemyHpDamage,healed:w.draftSignals.healed,absorbed:w.draftSignals.absorbed,dashes:w.stats.dashes,
   dx:e?e.x-w.player.x:0,dy:e?e.y-w.player.y:0,d:e?Math.hypot(e.x-w.player.x,e.y-w.player.y):0,
   aim:e?{x:(e.x-c.worldView.x)*c.zoom,y:(e.y-c.worldView.y)*c.zoom}:null,draft:r.draft.map(o=>o.id),mutations:w.mutations,curses:w.curses};});
 if(s.result){samples.push(s);break;}
 if(Math.floor(s.time/10)>lastSnapshot){samples.push(s);lastSnapshot=Math.floor(s.time/10);console.log(JSON.stringify({time:s.time,hp:s.hp,phase:s.phase}));}
 if(s.phase==='draft'){
  if(mouseHeld){await page.mouse.up({button:'left'});await page.mouse.up({button:'right'});mouseHeld=false;}
  for(const key of held)await page.keyboard.up(key);held.clear();
  const order=['bloodReclaimer','parasiticMark','catalyst','echoChamber','kineticBattery'];const rank=s.draft.map((id,i)=>({i,rank:order.includes(id)?order.indexOf(id):100+i})).sort((a,b)=>a.rank-b.rank)[0];
  const card=page.locator(`[data-choice="${rank.i}"]`);await card.waitFor();await page.waitForTimeout(700);await card.click();drafts.push({time:s.time,id:s.draft[rank.i]});continue;
 }
 if(s.phase==='playing'){
  const keys=new Set(s.d>65?[...(s.dx>20?['d']:s.dx< -20?['a']:[]),...(s.dy>20?['s']:s.dy< -20?['w']:[])]:[]);
  for(const key of held)if(!keys.has(key))await page.keyboard.up(key);for(const key of keys)if(!held.has(key))await page.keyboard.down(key);held=keys;
  if(s.aim){const rect=await page.locator('canvas').boundingBox();await page.mouse.move(Math.max(rect.x+2,Math.min(rect.x+rect.width-2,rect.x+s.aim.x)),Math.max(rect.y+2,Math.min(rect.y+rect.height-2,rect.y+s.aim.y)));}
  if(!mouseHeld){await page.mouse.down({button:'left'});await page.mouse.down({button:'right'});mouseHeld=true;}
  if(Math.floor(s.time/3)>lastSpecial){await page.keyboard.press('Shift');await page.keyboard.press('q');lastSpecial=Math.floor(s.time/3);}
 }
 await page.waitForTimeout(300);
}
await page.screenshot({path:'docs/early-run-balance/evidence/browser-final.png'});
fs.writeFileSync('docs/early-run-balance/evidence/browser.json',JSON.stringify({method:'Fresh isolated desktop Chromium1440x1000, production ticket seed, real RAF, nearest-target keyboard/mouse policy sampled ~300ms; no dash; Heavy/Q every3 simulation seconds. Automated play, not human feel/device performance.',wallSeconds:(Date.now()-started)/1000,drafts,samples,errors},null,2));
await browser.close();
