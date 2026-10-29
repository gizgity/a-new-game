import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const [width,height,touch] of [[390,844,true],[1440,1000,false]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:5173/a-new-game/?playtest=chain');await p.locator('#primary:enabled').click();
 const initial=await p.evaluate(async()=>{const {arena:a,game}=await import('/a-new-game/src/main.ts');game.loop.stop();a.setPhase('playing');await a.sound.context.resume();a.sound.locked=false;a.combat.chargedShots=2;a.combat.enemies=[];a.combat.projectiles=[];a.combat.hitstop=0;return {phase:a.phase,charged:a.combat.chargedShots,context:a.sound.context.state};});
 const cdp=touch?await p.context().newCDPSession(p):null;const rect=touch?await p.locator('[data-action="charged"]').boundingBox():null;
 const down=async()=>{if(!touch)await p.keyboard.down('e');else await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width/2,y:rect.y+rect.height/2,id:31}]});};
 const up=async(cancel=false)=>{if(!touch)await p.keyboard.up('e');else await cdp.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});};
 await down();
 const hold=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');a.update(0,17);return {charge:a.audio.sounds.get('charge').isPlaying,resource:a.combat.chargedShots};});assert.equal(hold.charge,true);assert.equal(hold.resource,2);
 // Phase cancellation consumes no resource; resume requires fresh press.
 const cancelled=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');a.setPhase('paused');const voices=a.sound.getAllPlaying().length;a.setPhase('playing');a.update(0,17);return {voices,resource:a.combat.chargedShots,replayed:a.audio.sounds.get('charge').isPlaying};});assert.equal(cancelled.voices,0);assert.equal(cancelled.resource,2);assert.equal(cancelled.replayed,false);
 await up(true);await down();await up();
 const release=await p.evaluate(async()=>{const {arena:a}=await import('/a-new-game/src/main.ts');a.update(0,17);return {resource:a.combat.chargedShots,release:a.combat.audioEvents.some(e=>e.cue==='chargedGun'),hit:a.combat.audioEvents.some(e=>e.cue==='chargedHit')};});assert.equal(release.resource,1);assert.equal(release.release,true);assert.equal(release.hit,false);
 await p.screenshot({path:`docs/q12b/evidence/game-${width}.png`});assert.deepEqual(errors,[]);reports.push({width,touch,initial,hold,cancelled,release,errors});await p.close();
}
fs.writeFileSync('docs/q12b/evidence/input.json',JSON.stringify(reports,null,2));await b.close();console.log('PASS game input2platform');
