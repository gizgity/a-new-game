// Fixture/input verification only; natural-run balance evidence lives in four-routes.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];const evidencePrefix=process.env.BALANCE_BROWSER_PREFIX||'half';
try{for(const [width,height,touch]of [[390,844,true],[1440,1000,false],[320,740,true],[844,390,true]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:touch}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5173/a-new-game/');await p.locator('#primary:enabled').click();
 await p.evaluate(async()=>{const {arena:a,game}=await import('/a-new-game/src/main.ts');game.loop.stop();a.run.draft=[{id:'detonationSpecialist',role:'adaptive'}];a.setPhase('draft');});
 assert.match(await p.locator('#draft-panel').textContent(),/18 Barrier/);
 await p.selectOption('#locale','en');assert.match(await p.locator('#draft-panel').textContent(),/18 Barrier/);
 await p.selectOption('#locale','vi');
 const aim=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');a.run.draft=[];a.setPhase('playing');const w=a.combat;w.enemies=[];w.projectiles=[];w.mutations=['detonationSpecialist'];w.setCurses([]);w.chargedShots=2;w.hitstop=0;w.player.angle=0;w.spawnEnemy('grunt',1000);Object.assign(w.enemies[0],{x:w.player.x+70,y:w.player.y,stagger:999,cooldown:999});const c=a.cameras.main;return {x:(w.enemies[0].x-c.worldView.x)*c.zoom,y:(w.enemies[0].y-c.worldView.y)*c.zoom};});
 const cdp=touch?await p.context().newCDPSession(p):null;
 const rect=await p.locator(touch?'[data-action="charged"]':'canvas').boundingBox();
 if(!touch)await p.mouse.move(rect.x+aim.x,rect.y+aim.y);
 const down=async()=>touch?cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width/2,y:rect.y+rect.height/2,id:31}]}):p.keyboard.down('e');
 const up=async()=>touch?cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}):p.keyboard.up('e');
 await down();const held=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');a.update(0,17);return a.combat.chargedShots;});assert.equal(held,2);
 await up();const fired=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');for(let i=0;i<18;i++)a.update(0,17);return {ammo:a.combat.chargedShots,barrier:a.combat.barrier.value,hp:a.combat.hp,cooldown:a.combat.barrier.specialistCooldown};});assert.equal(fired.ammo,1);assert.equal(fired.barrier,18);assert.equal(fired.hp,100);
 const frozen=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');a.setPhase('paused');const before=a.combat.barrier.specialistCooldown;for(let i=0;i<60;i++)a.update(0,17);const after=a.combat.barrier.specialistCooldown;a.setPhase('playing');return before===after;});assert.equal(frozen,true);
 const mechanics=await p.evaluate(async()=>{
  const {arena:a}=await import('/a-new-game/src/main.ts');const w=a.combat;const idle={dx:1,dy:0,melee:false,shoot:false,heavy:false,dash:false};
  w.enemies=[];w.projectiles=[];w.attack=null;w.hitstop=0;w.dashTime=0;w.player.x=800;w.player.y=500;w.mutations=[];
  w.step(idle,1/60);const base=w.player.x-800;
  w.player.x=800;w.mutations=['detonationSpecialist'];w.step(idle,1/60);const ratio=(w.player.x-800)/base,dash=w.rechargeDuration;
  w.enemies=[];w.projectiles=[];w.mutations=[];w.spawnEnemy('boss');const boss=w.enemies[0];boss.hp=boss.maxHp*.75;a.update(0,0);
  const bar=document.querySelector('#boss-health');return {ratio,dash,max:bar.max,value:bar.value,actualMax:boss.maxHp};
 });
 assert.ok(Math.abs(mechanics.ratio-1.2)<1e-9);assert.ok(Math.abs(mechanics.dash-1.76)<1e-9);
 assert.equal(mechanics.max,2400);assert.equal(mechanics.value,1800);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await p.screenshot({path:`docs/early-run-balance/evidence/${evidencePrefix}-${width}.png`});
 assert.deepEqual(errors,[]);reports.push({width,height,touch,viEnDescription:true,holdRelease:true,mechanics,fired,pauseFreeze:frozen,overflow:false,errors});await p.close();
}}finally{await browser.close();}
fs.writeFileSync(`docs/early-run-balance/evidence/${evidencePrefix}-browser.json`,JSON.stringify({method:'Explicit Specialist/ammo/enemy fixture; real touch or keyboard hold/release with controlled scene updates, not natural runs. Chromium softwareWebGL, no real-device/FPS claim.',reports},null,2));console.log('PASS four viewports: vi/en, Charged hold/release, actual Barrier/HUD, pause freeze');
