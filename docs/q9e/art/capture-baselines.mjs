// Read-only browser visual fixture. No production edits or persistence.
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const captures=[];
for(const [width,height,touch]of [[320,740,true],[390,844,true],[844,390,true],[1440,1000,false]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:touch});await p.goto('http://127.0.0.1:5173/a-new-game/?playtest=seal-4');await p.locator('#primary').click();
 const meta=await p.evaluate(async()=>{const {arena,game}=await import('/a-new-game/src/main.ts');game.loop.stop();arena.setPhase('playing');const w=arena.combat;w.enemies=[];w.anomaly.reset();w.ascension.reset();w.ascension.seal=4;
  w.player.x=800;w.player.y=500;
  for(let i=0;i<24;i++){w.spawnEnemy(i%6===0?'archer':'grunt',1000,i*.61);const e=w.enemies.at(-1);Object.assign(e,{x:800+Math.cos(i*.61)*(105+i%4*32),y:500+Math.sin(i*.61)*(105+i%4*32),rupture:i%4,stagger:99});}
  for(const i of[1,4]){const e=w.enemies[i];e.stagger=0;e.windup=e.windupDuration=.42;e.angle=Math.atan2(500-e.y,800-e.x);e.attackAction=0;}
  const hunter=w.enemies[2];w.ascension.hunterId=hunter.id;w.ascension.hunterWarning=.5;w.ascension.hunterTime=4;
  w.ascension.zones=[{kind:'pulse',x:892,y:500,time:1,active:0,hit:false},{kind:'echo',x:720,y:410,time:.8,active:0,hit:false}];
  w.ascension.fractured='staticRiposte';w.ascension.penalty=18;
  arena.cameras.main.centerOn(800,500);arena.update(0,0);game.step(performance.now(),0);game.step(performance.now(),0);
  const c=arena.cameras.main;return {zoom:c.zoom,scrollX:c.scrollX,scrollY:c.scrollY,player:{...w.player},zones:structuredClone(w.ascension.zones),hunter:{x:hunter.x,y:hunter.y},fixture:true,enemyCount:24,phase:arena.phase};});
 await p.screenshot({path:`docs/q9e/art/baseline/current-${width}.png`});await p.addStyleTag({content:'#app {filter:grayscale(1)}'});await p.screenshot({path:`docs/q9e/art/baseline/current-${width}-gray.png`});
 if(width===390){await p.addStyleTag({content:'#app {filter:none}'});for(const [name,x,y]of[['nw',80,80],['ne',1520,80],['sw',80,920],['se',1520,920]]){await p.evaluate(async([x,y])=>{const {arena,game}=await import('/a-new-game/src/main.ts');const w=arena.combat,dx=x-w.player.x,dy=y-w.player.y;w.player.x=x;w.player.y=y;for(const z of w.ascension.zones){z.x+=dx;z.y+=dy;}for(const e of w.enemies){e.x=Math.max(48,Math.min(1552,e.x+dx));e.y=Math.max(48,Math.min(952,e.y+dy));}arena.cameras.main.centerOn(x,y);arena.update(0,0);game.step(performance.now(),0);game.step(performance.now(),0);},[x,y]);await p.screenshot({path:`docs/q9e/art/baseline/corner-${name}-390.png`});}}
 captures.push({width,height,touch,...meta});await p.close();console.log(width);
}await b.close();fs.writeFileSync('docs/q9e/art/baseline/captures.json',JSON.stringify({code:'a4ea34b + Q9E Phase A',handoff:'a4ea34b',description:'Actual current Q9D renderer visual fixture:24enemies,2windup,simultaneousPulse+Echo+Hunter for visual stress only. This co-occurrence is deliberately injected and not claimed to be reachable combat, progression proof or natural play. State clocks frozen for screenshot; CSSgrayscale same scene. No production edits/save writes.',captures},null,2));
