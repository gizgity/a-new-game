import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
try{for(const touch of [true,false]){
 const p=await browser.newPage({viewport:touch?{width:390,height:844}:{width:1440,height:900},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.stack));await p.goto('http://localhost:5173/a-new-game/');await p.locator('#primary:enabled').waitFor();await p.locator('#primary').click();
 const step=()=>p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');return a.tutorial?.stepIndex??5;});
 const until=async n=>{for(let i=0;i<100;i++){if(await step()>=n)return;await p.waitForTimeout(100);}console.log(await p.evaluate(async()=>{const {arena:a,game}=await import('/a-new-game/src/main.ts');return {phase:a.phase,player:a.player,delta:game.loop.delta,sample:a.touch.sample(),contacts:a.touch.contacts.size};}));throw Error(`Native tutorial stuck at ${await step()}, expected ${n}`);};
 const cdp=await p.context().newCDPSession(p);
 const contact=async(selector,type='touchStart')=>{const b=await p.locator(selector).boundingBox();await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2}]});return b;};
 const end=()=>cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 if(touch){const b=await contact('#move-stick');await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width/2+40,y:b.y+b.height/2}]});await until(1);await end();}
 else{await p.keyboard.down('d');await until(1);await p.keyboard.up('d');}
 if(!touch){const aim=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');const e=a.combat.enemies[0],c=a.cameras.main;return {x:(e.x-c.worldView.x)*c.zoom,y:(e.y-c.worldView.y)*c.zoom};});const b=await p.locator('canvas').boundingBox();await p.mouse.move(b.x+aim.x,b.y+aim.y);await p.mouse.down({button:'left'});await until(2);await p.mouse.up({button:'left'});await p.mouse.down({button:'right'});await until(3);await p.mouse.up({button:'right'});}
 else{await contact('[data-action=melee]');await until(2);await end();await contact('[data-action=shoot]');await until(3);await end();}
 if(touch){await contact('[data-action=heavy]');await p.waitForTimeout(250);assert.equal(await step(),3);await end();await until(4);await p.locator('[data-action=dash]').tap();}
 else{await p.keyboard.press('Shift');assert.equal(await step(),3);await p.keyboard.down('r');await p.waitForTimeout(250);assert.equal(await step(),3);await p.keyboard.up('r');await until(4);await p.keyboard.press('Space');}
 await until(5);await p.locator('#tutorial-complete').waitFor({state:'visible'});
 assert.equal(await p.locator('#menu-panel').isVisible(),false);
 const completion=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');return {phase:a.phase,dashTime:a.combat.dashTime,complete:a.tutorial?.complete};});
 assert.deepEqual(completion,{phase:'paused',dashTime:0,complete:true});
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')).tutorialDone),true);
 await p.waitForTimeout(500);assert.equal(await p.locator('#tutorial-complete').isVisible(),true);
 await p.locator('#tutorial-finish').click();const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('cursebreak.save.v1')));assert.equal(saved.tutorialDone,true);assert.equal(saved.totals.runs,0);assert.equal(saved.totals.kills,0);assert.deepEqual(errors,[]);reports.push({touch,completed:true,errors,totals:saved.totals});await p.close();
}fs.writeFileSync('docs/q13/evidence/native-tutorial.json',JSON.stringify(reports,null,2));console.log('PASS native touch joystick/combat + desktop WASD/mouse/R/Space tutorial');}finally{await browser.close();}
