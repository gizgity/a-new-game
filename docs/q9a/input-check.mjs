const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
import assert from 'node:assert/strict';import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
for(const touch of [true,false]){
 const p=await browser.newPage({viewport:{width:touch?390:1440,height:touch?844:1000},hasTouch:touch}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5173/a-new-game/?playtest=legacy-water-flowState');await p.locator('#primary').click();await p.waitForTimeout(1150);await p.locator('[data-choice="0"]').click();
 // Explicit fixture: prevent incoming attacks while measuring real input/resource lifecycle.
 await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');window.__q9Arena=arena;arena.combat.enemies.forEach(e=>{e.stagger=999;});});
 const read=()=>p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');return {heavy:arena.combat.heavyCharges,shots:arena.combat.stats.shots,x:arena.player.x,y:arena.player.y,angle:arena.player.angle,phase:arena.phase,selection:arena.combat.legacy.selection};});
 const cdp=await p.context().newCDPSession(p);
 async function point(selector){const r=await p.locator(selector).boundingBox();return {x:r.x+r.width/2,y:r.y+r.height/2};}
 const before=await read();
 if(touch){const h=await point('[data-action=heavy]');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...h,id:1}]});await p.waitForTimeout(150);assert.equal((await read()).heavy,before.heavy);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 else {await p.keyboard.down('Shift');await p.waitForTimeout(150);assert.equal((await read()).heavy,before.heavy);await p.keyboard.up('Shift');}
 await p.waitForTimeout(400);assert.equal((await read()).heavy,before.heavy-1);
 // Wait until Heavy recovery has ended, then exercise simultaneous movement and Basic fire.
 await p.waitForFunction(()=>!window.__q9Arena.combat.attack);const start=await read();
 if(touch){const s=await point('[data-action=shoot]'),pad=await point('#move-stick');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...s,id:2}]});
  await p.waitForTimeout(50);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...s,id:2},{...pad,id:3}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...s,id:2},{x:pad.x+35,y:pad.y,id:3}]});await p.waitForFunction(({shots,x})=>window.__q9Arena.combat.stats.shots>shots&&window.__q9Arena.player.x>x,start,{timeout:15000});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 }else {const r=await p.locator('canvas').boundingBox();await p.mouse.move(r.x+r.width*.8,r.y+r.height*.5);await p.keyboard.down('d');await p.mouse.down({button:'right'});await p.waitForFunction(({shots,x})=>window.__q9Arena.combat.stats.shots>shots&&window.__q9Arena.player.x>x,start,{timeout:15000});await p.mouse.up({button:'right'});await p.keyboard.up('d');}
 const after=await read();assert.ok(after.shots>start.shots,JSON.stringify({touch,start,after}));assert.ok(after.x>start.x);
 // Pointer-to-world on desktop, manual override on touch use the existing contract.
 if(!touch)assert.ok(Math.abs(after.angle)<.3,after.angle);
 const corners=[];
 for(const [x,y] of [[80,80],[1520,80],[80,920],[1520,920]]){
  await p.evaluate(async([x,y])=>{const {arena}=await import('/a-new-game/src/main.ts');arena.player.x=x;arena.player.y=y;},[x,y]);await p.waitForTimeout(180);
  const lane=await p.evaluate(()=>{const a=document.querySelector('canvas').getBoundingClientRect(),b=document.querySelector('#combat-hud').getBoundingClientRect();return a.bottom<=b.top+1||a.top>=b.bottom-1||a.right<=b.left||a.left>=b.right;});assert.equal(lane,true);corners.push({x,y,hudOutsideCanvas:true});
 }
 await p.locator('#pause').click();const held=await read();
 if(!touch){await p.keyboard.down('Shift');await p.keyboard.up('Shift');}
 await p.locator('#primary').click();await p.waitForTimeout(200);assert.equal((await read()).heavy,held.heavy);
 assert.deepEqual(errors,[]);reports.push({touch,heavyHoldRelease:true,moveAndBasicFire:true,manualAim:!touch,pauseReleaseNoExtraHeavy:true,corners,errors});await p.close();
}
await browser.close();fs.writeFileSync('docs/q9a/evidence/input.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));
