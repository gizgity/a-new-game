// Read-only renderer captures; explicit visual fixture. No production/gameplay edits or save writes.
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const [width,height,touch]of[[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5173/a-new-game/?playtest=anomaly-fracturedStorm');await p.locator('#primary').click();
 await p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');game.loop.stop();arena.run.prepareBossPlaytest(0,134);for(let i=0;i<65&&arena.phase==='playing';i++)arena.update(0,1000/60);});
 await p.waitForTimeout(1100);if(touch)await p.locator('[data-choice="0"]').tap();else{await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}
 const metadata=await p.evaluate(async()=>{
  const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat;game.loop.stop();w.enemies=[];
  for(let i=0;i<24;i++){w.spawnEnemy(i%6===0?'archer':'grunt',1000,i*.61);const e=w.enemies.at(-1);Object.assign(e,{x:w.player.x+Math.cos(i*.61)*(85+i%4*32),y:w.player.y+Math.sin(i*.61)*(85+i%4*32),rupture:i%4,stagger:99});}
  for(const i of[1,4]){const e=w.enemies[i];e.stagger=0;e.windup=e.windupDuration=.42;e.angle=Math.atan2(w.player.y-e.y,w.player.x-e.x);e.attackAction=0;}
  w.anomaly.clock=0;w.anomaly.step(.01);w.anomaly.zones[0].time=.85;arena.update(0,0);game.step(performance.now(),0);game.step(performance.now(),0);
  return {phase:arena.phase,anomaly:w.anomaly.active,zones:structuredClone(w.anomaly.zones),enemyCount:w.enemies.length,player:{...w.player},zoom:arena.cameras.main.zoom,fixture:true};
 });
 await p.screenshot({path:`docs/q9c/vfx-art-v1/baseline/current-${width}.png`});
 await p.addStyleTag({content:'#app { filter: grayscale(1); }'});await p.screenshot({path:`docs/q9c/vfx-art-v1/baseline/current-${width}-gray.png`});
 if(width===390){await p.addStyleTag({content:'#app { filter: none; }'});for(const [name,x,y]of[['nw',80,80],['ne',1520,80],['sw',80,920],['se',1520,920]]){
  await p.evaluate(async([x,y])=>{const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat;const dx=x-w.player.x,dy=y-w.player.y;w.player.x=x;w.player.y=y;for(const z of w.anomaly.zones){z.x+=dx;z.y+=dy;}for(const e of w.enemies){e.x=Math.max(48,Math.min(1552,e.x+dx));e.y=Math.max(48,Math.min(952,e.y+dy));}arena.cameras.main.centerOn(x,y);arena.update(0,0);game.step(performance.now(),0);game.step(performance.now(),0);},[x,y]);await p.screenshot({path:`docs/q9c/vfx-art-v1/baseline/corner-${name}-390.png`});
 }}
 reports.push({width,height,touch,...metadata,errors});await p.close();console.log('captured',width);
}
await browser.close();fs.writeFileSync('docs/q9c/vfx-art-v1/baseline/captures.json',JSON.stringify({code:'a489279',handoff:'e1b237e',method:'Current Q9C actual renderer; visual fixture24enemies,2Grunt windups,Storm radius64,time0.85/1.3s. Simulation frozen for capture. CSS grayscale of exact same scene; corner captures relocate fixture without editing production. Not natural encounter/deviceFPS.',captures:reports},null,2));
