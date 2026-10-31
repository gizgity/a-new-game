const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
import assert from 'node:assert/strict';import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=process.env.FIXTURES_ONLY?JSON.parse(fs.readFileSync('docs/q9c/evidence/browser.json')).filter(x=>!x.id):[],base='http://127.0.0.1:5173/a-new-game/';
const read=p=>p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');game.loop.stop();return {phase:arena.phase,ticks:arena.run.ticks,hp:arena.combat.hp,active:arena.combat.anomaly.active,heavy:arena.combat.heavyCharges,attack:!!arena.combat.attack,profile:JSON.parse(localStorage.getItem('cursebreak.save.v1'))};});
const reach=p=>p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');game.loop.stop();arena.run.prepareBossPlaytest(0,134);arena.combat.hitstop=0;for(let i=0;i<65&&arena.phase==='playing';i++)arena.update(0,1000/60);});
for(const [width,height,touch]of(process.env.FIXTURES_ONLY?[]:[[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]])){
 console.log('normal',width);const p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(10000);
 await p.goto(base);await p.locator('#primary').click();await read(p);await reach(p);assert.equal((await read(p)).phase,'playing');assert.equal((await read(p)).active,null);
 await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');arena.combat.hp=0;arena.update(0,1000/60);});assert.equal((await read(p)).phase,'defeat');
 await p.locator('#primary').click();await read(p);const before=await read(p);assert.equal(before.profile.legacy.ticket.firstRun,false);
 // Hold before transition: entering choice cancels armed release and requires a fresh selection.
 const cdp=await p.context().newCDPSession(p);
 if(touch){const box=await p.locator('[data-action=heavy]').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2,id:1}]});}else await p.keyboard.down('r');
 await reach(p);assert.equal((await read(p)).phase,'anomaly');assert.equal(await p.locator('[data-choice]').count(),2);assert.equal(await p.locator('#pause').isDisabled(),true);
 if(touch)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await p.keyboard.up('r');
 const paused=await read(p);await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');for(let i=0;i<60;i++)arena.update(0,1000/60);});assert.equal((await read(p)).ticks,paused.ticks);assert.equal((await read(p)).hp,paused.hp);
 await p.keyboard.press('Escape');assert.equal((await read(p)).phase,'anomaly');
 await p.selectOption('#locale','en');assert.match(await p.locator('#draft-panel').textContent(),/Benefit:/);await p.selectOption('#locale','vi');
 await p.waitForTimeout(1100);await p.screenshot({path:`docs/q9c/evidence/offers-${width}.png`});
 const ticket=paused.profile.legacy.ticket;assert.equal(new Set(ticket.anomalyOffers).size,2);
 // Refresh before choosing keeps the ticket and both offers.
 await p.reload();await p.locator('#primary').click();await read(p);await reach(p);assert.deepEqual((await read(p)).profile.legacy.ticket,ticket);
 await p.waitForTimeout(1100);
 if(width===390){await p.evaluate(()=>{const original=Storage.prototype.setItem;window.restoreSave=()=>Storage.prototype.setItem=original;Storage.prototype.setItem=function(k,v){if(k==='cursebreak.save.v1')throw Error('fixture quota');return original.call(this,k,v);};});await p.locator('[data-choice="0"]').tap();assert.equal((await read(p)).phase,'anomaly');assert.equal(await p.locator('[data-choice="1"]').isDisabled(),true);await p.evaluate(()=>window.restoreSave());}
 if(touch)await p.locator('[data-choice="0"]').tap();else{await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}
 const selected=await read(p);assert.equal(selected.phase,'playing');assert.equal(selected.active,ticket.anomalyOffers[0]);assert.equal(selected.attack,false);assert.equal(selected.heavy,2);
 assert.match(await p.locator('#legacy-indicator').textContent(),new RegExp(selected.active==='fracturedStorm'?'Fractured Storm':'Blood Moon'));
 await p.locator('#pause').click();await p.locator('#menu-build').click();assert.ok((await p.locator('#anomaly-details').textContent()).length>40);await p.locator('#build-resume').click();
 await p.reload();await p.locator('#primary').click();await read(p);assert.equal((await read(p)).active,null);await reach(p);const restored=await read(p);assert.equal(restored.active,selected.active);assert.equal(restored.phase,'playing');assert.deepEqual(restored.profile.legacy.ticket,selected.profile.legacy.ticket);assert.equal(restored.profile.totals.runs,2);
 const geom=await p.evaluate(()=>{const a=document.querySelector('canvas').getBoundingClientRect(),h=document.querySelector('#combat-hud').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,lane:a.top>=h.bottom-1||a.bottom<=h.top+1};});assert.equal(geom.overflow,false);assert.equal(geom.lane,true);assert.deepEqual(errors,[]);
 reports.push({width,height,touch,firstRunExcluded:true,at135:true,twoOffers:true,simulationFrozen:true,noPauseOverlap:true,viEn:true,heldHeavyCanceled:true,refreshBeforeAndAfterChoice:true,saveRetry:width===390,geometry:geom,errors});await p.close();
}
for(const touch of [true,false])for(const id of ['fracturedStorm','bloodMoon','volatileGround','staticField','brokenSeal','echoChamber']){
 console.log('fixture',touch,id);const width=touch?390:1440,height=touch?844:1000,p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'?playtest=anomaly-'+id);await p.locator('#primary').click();await read(p);await reach(p);assert.equal((await read(p)).phase,'anomaly');await p.waitForTimeout(1100);
 if(touch)await p.locator('[data-choice="0"]').tap();else{await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}assert.equal((await read(p)).active,id);
 // Explicit crowd/readability fixture with real combat telegraphs and the accepted actors.
 await p.evaluate(async id=>{const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat;w.enemies=[];for(let i=0;i<24;i++){w.spawnEnemy(i%6===0?'archer':'grunt',1000,i*.61);Object.assign(w.enemies.at(-1),{x:w.player.x+Math.cos(i*.61)*(85+i%4*32),y:w.player.y+Math.sin(i*.61)*(85+i%4*32)});}for(const e of w.enemies){e.rupture=e.id%4;e.stagger=99;}const e=w.enemies[0];e.stagger=0;e.windup=e.windupDuration=.7;e.angle=Math.atan2(w.player.y-e.y,w.player.x-e.x);w.anomaly.clock=0;w.anomaly.step(.01);if(id==='echoChamber')w.anomaly.retaliate(e);if(id==='brokenSeal'){e.stagger=0;w.anomaly.resistance.set(e.id,.6);}arena.update(0,0);game.step(performance.now(),0);return {zones:w.anomaly.zones.length,active:w.anomaly.active};},id);
 await p.evaluate(async()=>{const {game}=await import('/a-new-game/src/main.ts');game.step(performance.now(),0);});
 await p.screenshot({path:`docs/q9c/evidence/${id}-${width}.png`});
 const corners=[];for(const [x,y]of[[80,80],[1520,80],[80,920],[1520,920]]){
  const value=await p.evaluate(async([x,y])=>{const {arena,game}=await import('/a-new-game/src/main.ts');arena.player.x=x;arena.player.y=y;arena.cameras.main.centerOn(x,y);game.step(performance.now(),0);const a=document.querySelector('canvas').getBoundingClientRect(),h=document.querySelector('#combat-hud').getBoundingClientRect();return a.top>=h.bottom-1||a.bottom<=h.top+1;},[x,y]);assert.equal(value,true);corners.push({x,y,lane:true});
 }
 assert.equal(await p.evaluate(()=>localStorage.getItem('cursebreak.save.v1')),null);assert.deepEqual(errors,[]);reports.push({id,touch,width,selection:true,crowd24:true,corners,isolatedSave:true,errors});await p.close();
}
await browser.close();fs.writeFileSync('docs/q9c/evidence/browser.json',JSON.stringify(reports,null,2));console.log('PASS',reports.length);
