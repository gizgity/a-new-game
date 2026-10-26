import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out=process.cwd()+'/docs/q8a/evidence';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const reports=[];
for(const size of [{width:1440,height:1000},{width:390,height:844}]){
 const page=await browser.newPage({viewport:size,hasTouch:size.width===390});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173/a-new-game/');await page.locator('#primary').click();
 await page.evaluate(async()=>{const {game}=await import('/a-new-game/src/main.ts');window.scene=game.scene.scenes[0];});
 // Real desktop keyboard + mouse input, no grants; short input smoke, not full run.
 if(size.width===1440){const box=await page.locator('canvas').boundingBox();await page.mouse.move(box.x+box.width*.6,box.y+box.height*.5);await page.mouse.down();await page.keyboard.down('d');await page.waitForTimeout(1500);await page.keyboard.up('d');await page.mouse.up();}
 const input=await page.evaluate(()=>({elapsed:scene.run.elapsed,hp:scene.combat.hp,x:scene.player.x,enemies:scene.combat.enemies.length}));
 await page.locator('#pause').click();const frozen=await page.evaluate(()=>({ticks:scene.run.ticks,rate:scene.run.clearRate,spawn:scene.run.spawnTicks}));await page.waitForTimeout(150);const freeze=await page.evaluate(a=>JSON.stringify(a)===JSON.stringify({ticks:scene.run.ticks,rate:scene.run.clearRate,spawn:scene.run.spawnTicks}),frozen);await page.locator('#primary').click();
 const crowd=await page.evaluate(()=>{
  // Explicit renderer fixture: cap-sized crowd, stagger only to inspect readability/performance.
  scene.run.draftIndex=6;scene.combat.enemies=[];
  for(let i=0;i<48;i++) {scene.combat.spawnEnemy(i%6===0?'archer':'grunt',36,i*2.39996);const e=scene.combat.enemies.at(-1);e.stagger=999;}
  const minSpawnDistance=Math.min(...scene.combat.enemies.map(e=>Math.hypot(e.x-scene.player.x,e.y-scene.player.y)));
  scene.combat.enemies.forEach((e,i)=>{const a=i*2.39996,d=90+(i%3)*35;e.x=scene.player.x+Math.cos(a)*d;e.y=scene.player.y+Math.sin(a)*d;});
  return {count:scene.combat.enemies.length,minSpawnDistance,placement:'After spawning, moved to radius90–160 for visible crowd fixture only.'};
 });
 await page.waitForTimeout(300);await page.screenshot({path:out+`/crowd-${size.width}.png`});
 const raf=await page.evaluate(()=>new Promise(resolve=>{const times=[];let last=performance.now();function frame(now){times.push(now-last);last=now;if(times.length===90){times.sort((a,b)=>a-b);resolve({medianMs:times[45],p95Ms:times[85]});}else requestAnimationFrame(frame);}requestAnimationFrame(frame);}));
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 reports.push({size,input,pauseFreeze:freeze,crowd,raf,overflow,errors,fixture:'48 enemies granted/staggered for renderer; software WebGL, not real device FPS. Desktop input smoke has no grants; mobile touch Start/Pause/Resume only.'});await page.close();
}
fs.writeFileSync(out+'/browser.json',JSON.stringify(reports,null,2));console.log(reports);await browser.close();
