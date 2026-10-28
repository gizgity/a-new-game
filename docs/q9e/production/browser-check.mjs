import assert from 'node:assert/strict';import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
const ids=['fire','water','lightning','ice','shadow','wind'];
for(const [width,height,touch]of [[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:touch}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:5173/a-new-game/?playtest=trail-fire');await p.locator('#primary:enabled').waitFor();
 assert.equal(await p.locator('#elemental-trail option').count(),7);assert.equal(await p.locator('#elemental-trail option:disabled').count(),0);
 await p.selectOption('#elemental-trail','water');await p.selectOption('#locale','en');assert.match(await p.locator('#elemental-trail').textContent(),/Tidal Echo/);await p.selectOption('#locale','vi');
 await p.locator('#primary').click();
 await p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');game.loop.stop();arena.setPhase('playing');const w=arena.combat;w.enemies=[];w.projectiles=[];w.impacts=[];w.anomaly.reset();w.ascension.reset();w.ascension.seal=4;w.hp=100;w.hitstop=0;w.invulnerable=0;w.player.x=800;w.player.y=500;
 for(let i=0;i<24;i++){w.spawnEnemy(i%6===0?'archer':'grunt',1000,i*.61);Object.assign(w.enemies.at(-1),{x:800+Math.cos(i*.61)*(105+i%4*32),y:500+Math.sin(i*.61)*(105+i%4*32),rupture:i%4,stagger:99,cooldown:99});}
 for(const i of[1,4])Object.assign(w.enemies[i],{stagger:0,windup:.42,windupDuration:.42,angle:Math.atan2(500-w.enemies[i].y,800-w.enemies[i].x)});
 const a=w.ascension;a.hunterId=w.enemies[2].id;a.hunterWarning=.5;a.hunterTime=4;a.penalty=18;a.zones=[{kind:'pulse',x:892,y:500,time:1,active:0,hit:false},{kind:'echo',x:720,y:410,time:.8,active:0,hit:false}];
 arena.cameras.main.centerOn(800,500);});
 for(const id of ids){
  const result=await p.evaluate(async id=>{const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat,v=arena.trailVisual;
   w.player.x=798;v.step(w,1/60,id);v.reset(w);w.player.x=800;const before=JSON.stringify(w);v.step(w,1/60,id);const pure=JSON.stringify(w)===before;
   arena.drawCombat();arena.vessel.render(w,arena.cosmetic);game.step(performance.now(),0);game.step(performance.now(),0);
   return {pure,visible:v.image.visible,frame:v.image.frame.name,depth:v.image.depth,width:v.image.displayWidth,height:v.image.displayHeight,alpha:v.image.alpha,objects:arena.children.length};},id);
  assert.equal(result.pure,true);assert.equal(result.visible,true);assert.equal(result.frame,id);assert.ok(Math.abs(result.width-52)<1e-8);assert.ok(Math.abs(result.height-22)<1e-8);assert.equal(result.depth,.8);
  await p.screenshot({path:`docs/q9e/production/evidence/${id}-${width}.png`});await p.addStyleTag({content:'#app{filter:grayscale(1)}'});await p.screenshot({path:`docs/q9e/production/evidence/${id}-${width}-gray.png`});await p.addStyleTag({content:'#app{filter:none}'});reports.push({width,height,touch,id,...result});
 }
 const checks=await p.evaluate(async()=>{const {arena}=await import('/a-new-game/src/main.ts');const w=arena.combat,v=arena.trailVisual,im=v.image;
 const snap=()=>JSON.stringify({x:im.x,y:im.y,alpha:im.alpha,life:v.life,visible:im.visible});
 const tick=()=>arena.update(0,1000/60);
 arena.run.draft=[];arena.setPhase('paused');const a=snap();for(let i=0;i<120;i++)tick();const paused=snap()===a;
 arena.setPhase('playing');w.hitstop=1;const c=snap();tick();const hitstop=snap()===c;w.hitstop=0;
 w.spawnEnemy('boss');const boss=w.enemies.at(-1);boss.hp=boss.maxHp/2;const d=snap();tick();const transform=snap()===d;w.enemies=w.enemies.filter(e=>e!==boss);
 const before=JSON.stringify(w),objects=arena.children.length;const start=performance.now();for(let i=0;i<6000;i++)v.step(w,1/60,'fire');const stepMs=performance.now()-start;
 const pure=before===JSON.stringify(w);
 const motionStart=performance.now();for(let i=0;i<6000;i++){w.player.x+=i%2?1:-1;v.step(w,1/60,'fire');}const motionStepMs=performance.now()-motionStart;
 const bounded=objects===arena.children.length;for(let i=0;i<20;i++)v.step(w,1/60,'fire');
 const stopped=!im.visible;v.step(w,1/60,null);const none=!im.visible;
 w.player.x-=2;v.step(w,1/60,'fire');w.player.x+=2;v.step(w,1/60,'fire');w.hp=0;v.step(w,1/60,'fire');const death=!im.visible;w.hp=100;
 v.reset(w);const reset=!im.visible;
 v.step(w,1/60,'fire');w.player.x+=2;v.step(w,1/60,'fire');w.player.x+=100;v.step(w,1/60,'fire');const teleport=!im.visible;
 const canvas=document.querySelector('canvas').getBoundingClientRect(),hud=document.querySelector('#combat-hud').getBoundingClientRect();
 return{paused,hitstop,transform,pure,bounded,stopped,none,death,reset,teleport,stepMs,motionStepMs,steps:6000,objects,lane:canvas.top>=hud.bottom-1||canvas.bottom<=hud.top+1,overflow:document.documentElement.scrollWidth>innerWidth,isolated:localStorage.getItem('cursebreak.save.v1')===null};});
 for(const key of['paused','hitstop','transform','pure','bounded','stopped','none','death','reset','teleport','lane','isolated'])assert.equal(checks[key],true,key);assert.equal(checks.overflow,false);
 if(width===390||width===1440)for(const [corner,x,y]of[['nw',80,80],['ne',1520,80],['sw',80,920],['se',1520,920]]){
  await p.evaluate(async([x,y])=>{const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat;w.player.x=x-2;w.player.y=y;arena.trailVisual.reset(w);arena.trailVisual.step(w,1/60,'fire');w.player.x=x;arena.trailVisual.step(w,1/60,'fire');w.enemies=[];w.spawnEnemy('grunt');Object.assign(w.enemies.at(-1),{x:x+(x>800?-60:60),y});w.ascension.zones=[{kind:'pulse',x:x+(x>800?-92:92),y,time:1,active:0,hit:false}];arena.cameras.main.centerOn(x,y);arena.drawCombat();arena.vessel.render(w,arena.cosmetic);game.step(performance.now(),0);game.step(performance.now(),0);},[x,y]);await p.screenshot({path:`docs/q9e/production/evidence/corner-${corner}-${width}.png`});
 }
 assert.deepEqual(errors,[]);reports.push({width,checks,errors});await p.close();console.log('PASS trails',width);
}
await b.close();fs.writeFileSync('docs/q9e/production/evidence/browser.json',JSON.stringify({method:'Actual production Image renderer, explicit24enemy/2windup/Q9D cue fixture. Full JSONworld equality around visual stepping, one Image stable. Timing CPU/softwareWebGL, not deviceFPS/human feel. Corners390/1440 use Ember; all6 share footprint.',reports},null,2));
