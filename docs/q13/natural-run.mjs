import fs from 'node:fs';
import {routeIntent,chooseRoute} from '../early-run-balance/remaining-routes.mjs';
import {defaultProfile,SAVE_KEY} from '../../.test-build/progression.js';
import {beginLegacy} from '../../.test-build/legacy.js';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const prefix=process.env.BALANCE_BROWSER_PREFIX||'browser';
const budget=Number(process.env.BALANCE_BROWSER_BUDGET||180000);
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 await Promise.all((process.env.BALANCE_BROWSER_ROUTES?.split(',')||['counter','ranged']).map(async route=>{
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[],samples=[],drafts=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Persist only an ordinary first-run ticket with explicit seed, no unlocks/resources.
  const profile=defaultProfile();profile.tutorialDone=true;beginLegacy(profile.legacy,0,808);
  await context.addInitScript(({key,profile})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(profile));},{key:SAVE_KEY,profile});
  await page.goto('http://127.0.0.1:5173/a-new-game/');await page.locator('#primary:enabled').waitFor();await page.locator('#primary').click();
  let held=new Set(),left=false,right=false,lastSnapshot=-1,lastSpecial=-1;const started=Date.now();
  while(Date.now()-started<budget){
   const s=await page.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');const w=arena.combat,r=arena.run,c=arena.cameras.main;
    const e=w.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-w.player.x,a.y-w.player.y)-Math.hypot(b.x-w.player.x,b.y-w.player.y))[0];
    return {seed:r.seedOverride,phase:arena.phase,time:r.elapsed,result:r.result,hp:w.hp,kills:w.kills,damage:w.draftSignals.enemyHpDamage,healed:w.draftSignals.healed,dashes:w.stats.dashes,perfects:w.perfectDodges,shots:w.stats.shots,
     charged:w.chargedShots,heavy:w.heavyCharges,surge:w.surge,player:{x:w.player.x,y:w.player.y,angle:w.player.angle},enemies:w.enemies.map(e=>({hp:e.hp,x:e.x,y:e.y})),threat:w.imminentThreat(),
     aim:e?{x:(e.x-c.worldView.x)*c.zoom,y:(e.y-c.worldView.y)*c.zoom}:null,draft:r.draft.map(o=>o.id),mutations:w.mutations,curses:w.curses};});
   if(s.seed!==808)throw Error('Production ticket seed did not persist');
   if(s.result){samples.push(s);break;}
   if(Math.floor(s.time/10)>lastSnapshot){samples.push(s);lastSnapshot=Math.floor(s.time/10);console.log(route,s.time.toFixed(1),s.hp,s.phase);}
   if(s.phase==='draft'){
    if(left){await page.mouse.up({button:'left'});left=false;}if(right){await page.mouse.up({button:'right'});right=false;}
    for(const key of held)await page.keyboard.up(key);held.clear();
    const i=chooseRoute(s.draft.map(id=>({id})),route);await page.waitForTimeout(700);await page.locator(`[data-choice="${i}"]`).click();drafts.push({time:s.time,id:s.draft[i],hp:s.hp,damage:s.damage,perfects:s.perfects});continue;
   }
   if(s.phase==='playing'){
    const input=routeIntent({...s,chargedShots:s.charged,imminentThreat:()=>s.threat},route,'observed',Math.round(s.time*60));
    const keys=new Set([...(input.dx>.2?['d']:input.dx<-.2?['a']:[]),...(input.dy>.2?['s']:input.dy<-.2?['w']:[])]);
    for(const key of held)if(!keys.has(key))await page.keyboard.up(key);for(const key of keys)if(!held.has(key))await page.keyboard.down(key);held=keys;
    if(s.aim){const rect=await page.locator('canvas').boundingBox();await page.mouse.move(Math.max(rect.x+2,Math.min(rect.x+rect.width-2,rect.x+s.aim.x)),Math.max(rect.y+2,Math.min(rect.y+rect.height-2,rect.y+s.aim.y)));}
    if(input.melee!==left){await page.mouse[input.melee?'down':'up']({button:'left'});left=input.melee;}
    if(!right){await page.mouse.down({button:'right'});right=true;}
    if(input.dash){await page.keyboard.down('Space');await page.waitForTimeout(80);await page.keyboard.up('Space');}
    if(Math.floor(s.time)>lastSpecial){
     const key=s.charged>0?'e':s.surge>=100&&input.d<260?'q':s.heavy>0&&input.d<155?'r':null;
     if(key){await page.keyboard.down(key);await page.waitForTimeout(100);await page.keyboard.up(key);}lastSpecial=Math.floor(s.time);
    }
   }
   await page.waitForTimeout(300);
  }
  // Record final state even when wall-clock budget ends between sampling points.
  const final=await page.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');const w=arena.combat,r=arena.run;return {seed:r.seedOverride,time:r.elapsed,result:r.result,hp:w.hp,kills:w.kills,dashes:w.stats.dashes,perfects:w.perfectDodges,mutations:w.mutations,curses:w.curses};});
  await page.screenshot({path:`docs/q13/evidence/${prefix}-${route}.png`});
  fs.writeFileSync(`docs/q13/evidence/${prefix}-${route}.json`,JSON.stringify({method:'Baseline production browser, fresh first-run ticket seed808, true RAF and keyboard/mouse; Counter melee vs Ranged distance190–260/melee only near; sampled imminent-threat dash. Concurrent Chromium contexts, no manual steps/grants/offer injection. SoftwareWebGL, not human/mobile/deviceFPS or full-run balance acceptance.',route,wallSeconds:(Date.now()-started)/1000,drafts,samples,final,errors},null,2));
  await context.close();
 }));
}finally{await browser.close();}
