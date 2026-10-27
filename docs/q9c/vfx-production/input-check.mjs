const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
import assert from 'node:assert/strict';import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
for(const touch of [true,false]){
 const p=await browser.newPage({viewport:{width:touch?390:1440,height:touch?844:1000},hasTouch:touch}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5174/a-new-game/?playtest=anomaly-staticField');await p.locator('#primary').click();
 await p.waitForFunction(()=>document.querySelector('#status').textContent==='Dị biến'.toUpperCase()||document.querySelector('#draft-panel h2')?.textContent==='Chọn một Anomaly');await p.waitForTimeout(1100);
 if(touch)await p.locator('[data-choice="0"]').tap();else{await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}
 await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');window.fixture=arena;arena.combat.enemies=[];arena.combat.practice=false;});
 const cdp=await p.context().newCDPSession(p);
 const read=()=>p.evaluate(()=>({heavy:fixture.combat.heavyCharges,shots:fixture.combat.stats.shots,x:fixture.player.x,charged:fixture.combat.chargedShots,phase:fixture.phase,active:fixture.combat.anomaly.active}));
 const point=async selector=>{const r=await p.locator(selector).boundingBox();return {x:r.x+r.width/2,y:r.y+r.height/2};};
 const before=await read();assert.equal(before.active,'staticField');
 if(touch){const h=await point('[data-action=heavy]');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...h,id:1}]});await p.waitForTimeout(150);assert.equal((await read()).heavy,before.heavy);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 else{await p.keyboard.down('Shift');await p.waitForTimeout(150);assert.equal((await read()).heavy,before.heavy);await p.keyboard.up('Shift');}
 await p.waitForFunction(n=>fixture.combat.heavyCharges===n,before.heavy-1);await p.waitForFunction(()=>!fixture.combat.attack);
 const start=await read();
 if(touch){const s=await point('[data-action=shoot]'),pad=await point('#move-stick');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...s,id:2},{...pad,id:3}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...s,id:2},{x:pad.x+35,y:pad.y,id:3}]});await p.waitForFunction(({x,shots})=>fixture.player.x>x&&fixture.combat.stats.shots>shots,start);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 else{const r=await p.locator('canvas').boundingBox();await p.mouse.move(r.x+r.width*.8,r.y+r.height*.5);await p.keyboard.down('d');await p.mouse.down({button:'right'});await p.waitForFunction(({x,shots})=>fixture.player.x>x&&fixture.combat.stats.shots>shots,start);await p.mouse.up({button:'right'});await p.keyboard.up('d');}
 await p.waitForFunction(()=>!fixture.combat.attack);await p.evaluate(()=>{fixture.combat.chargedShots=2;fixture.combat.shotCooldown=0;fixture.combat.enemies=[];});
 if(touch){const c=await point('[data-action=charged]');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...c,id:5}]});await p.waitForTimeout(100);assert.equal((await read()).charged,2);await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});}
 else{await p.keyboard.down('e');await p.locator('#pause').click();await p.keyboard.up('e');await p.locator('#primary').click();}
 assert.equal((await read()).charged,2);
 if(touch){const c=await point('[data-action=charged]');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...c,id:6}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 else await p.keyboard.press('e');
 await p.waitForFunction(()=>fixture.combat.chargedShots===1);await p.locator('#pause').click();const frozen=await read();await p.waitForTimeout(200);assert.equal((await read()).x,frozen.x);await p.selectOption('#locale','en');await p.locator('#primary').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('cursebreak.save.v1')),null);assert.deepEqual(errors,[]);reports.push({touch,active:'staticField',heavyHoldRelease:true,movePlusBasic:true,chargedCancelFreshRelease:true,pauseLocaleResume:true,errors});await p.close();
}
await browser.close();fs.writeFileSync('docs/q9c/vfx-production/evidence/input.json',JSON.stringify(reports,null,2));console.log('PASS',reports);
