import fs from 'node:fs';
import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--autoplay-policy=user-gesture-required']});
const url=process.env.Q12D_URL||'http://localhost:5174/docs/q12d/index.html';
const combos=['arena-base + tension','arena-base + anomaly','arena-base + tension + anomaly','boss-core + enraged'];
const reports=[];
async function state(page){return page.evaluate(()=>window.q12dSnapshot());}
async function started(page,label){await page.getByRole('button',{name:label,exact:true}).click();await page.waitForFunction(label=>document.querySelector('#status').textContent===`Đang phát: ${label}`,label);}
try{
 await Promise.all(combos.map(async(label,index)=>{
  const [width,height]=[[390,844],[1440,1000],[320,740],[844,390]][index];
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.storageWrites=[];for(const k of ['setItem','removeItem','clear'])Storage.prototype[k]=function(){window.storageWrites.push(k);};
   window.starts=[];const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){window.starts.push({when:args[0],end:this.loopEnd,loop:this.loop});return start.apply(this,args);};
   window.idbOpens=0;const open=IDBFactory.prototype.open;IDBFactory.prototype.open=function(...args){window.idbOpens++;return open.apply(this,args);};
  });
  await page.goto(url);await page.frameLocator('#sfx').locator('nav button').first().waitFor();
  assert.equal((await state(page)).active,0,'gesture required, no auto play');
  const decoded=await page.evaluate(async()=>{
   const m=await(await fetch('./manifest-b.json')).json(),results=[];
   for(const rate of [44100,48000]){
    const ctx=new AudioContext({sampleRate:rate});
    for(const p of m.pieces){let reference;for(const ext of ['wav','flac']){
     const b=await ctx.decodeAudioData(await(await fetch(`./audio-b/${p.id}.${ext}`)).arrayBuffer());
     if(b.numberOfChannels!==1||Math.abs(b.length-Math.round(p.frames*rate/44100))>1)throw Error('grid/channel mismatch');
     if(reference){if(reference.length!==b.length)throw Error('codec duration mismatch');let delta=0;for(let i=0;i<b.length;i++)delta=Math.max(delta,Math.abs(b.getChannelData(0)[i]-reference[i]));if(delta>1e-6)throw Error('codec PCM mismatch '+delta);}
     else reference=b.getChannelData(0).slice();results.push({id:p.id,ext,rate,frames:b.length});
    }}await ctx.close();
   }return results;
  });
  // A/B every piece, with B reached through a real select gesture.
  for(const v of ['a','b']){await page.locator('#version').selectOption(v);for(const id of ['arena-base','tension','anomaly','boss-core','enraged','victory','defeat']){await started(page,id);assert.equal((await state(page)).active,1);}}
  await started(page,label);
  const count=label.split(' + ').length,starts=await page.evaluate(n=>window.starts.slice(-n),count);assert.ok(starts.every(s=>s.when===starts[0].when&&s.loop));for(const s of starts.slice(1))assert.ok(Math.abs(starts[0].end-2*s.end)<1/44100);
  // Run >2 full core loops, including both overlay and core wraps. Scheduling only.
  await page.waitForFunction(()=>window.q12dSnapshot().elapsed>=49.24,{},{timeout:120000});
  const afterLoops=await state(page),elapsed=afterLoops.elapsed;assert.ok(elapsed>=49.23);assert.equal(afterLoops.active,count);
  const core=label.split(' + ')[0];
  await page.locator(`[data-stem="${core}"][data-action="mute"]`).click();await page.waitForTimeout(100);assert.ok((await state(page)).gains[core]<.001);
  await page.locator(`[data-stem="${core}"][data-action="mute"]`).click();
  await page.locator(`[data-stem="${core}"][data-action="solo"]`).click();await page.waitForTimeout(100);for(const [id,g] of Object.entries((await state(page)).gains))assert.ok(id===core?g>.999:g<.001);
  await page.locator(`[data-stem="${core}"][data-action="solo"]`).click();
  const sfx=[];if(index===3)for(const id of ['combat','perfect','arrival']){await page.locator('#'+id).click();await page.waitForTimeout(id==='arrival'?2100:1700);sfx.push({id,starts:await page.locator('#sfx').evaluate(el=>el.contentWindow.starts.length)});}assert.ok(!sfx.length||sfx.every(x=>x.starts>0));
  await page.locator('#stop').click();assert.equal((await state(page)).active,0);
  await page.evaluate(()=>{document.querySelector('#pieces button').click();document.querySelector('#version').value='a';document.querySelector('#version').dispatchEvent(new Event('change'));document.querySelector('#stop').click();});await page.waitForTimeout(250);assert.equal((await state(page)).active,0,'rapid switching cannot resurrect sources');
  await started(page,label);
  const session=await page.context().newCDPSession(page);await session.send('Emulation.setFocusEmulationEnabled',{enabled:false});
  // Real page visibility via CDP lifecycle is platform-dependent; explicitly dispatch hidden state too.
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal((await state(page)).active,0);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(100);assert.equal((await state(page)).active,0);
  // Force unsupported FLAC response and verify real WAV fallback.
  await page.route('**/audio-b/*.flac',route=>route.fulfill({status:200,body:'unsupported codec fixture'}));
  await page.locator('#version').selectOption('b');await started(page,label);const fallback=await state(page);assert.ok(Object.values(fallback.codecs).every(x=>x==='wav'));
  await page.locator('#stop').click();
  const isolated=await page.evaluate(()=>({storage:window.storageWrites,idb:window.idbOpens,overflow:document.documentElement.scrollWidth>innerWidth}));assert.deepEqual(isolated,{storage:[],idb:0,overflow:false});
  const child=await page.locator('#sfx').evaluate(el=>({storage:el.contentWindow.storageWrites,idb:el.contentWindow.idbOpens}));assert.deepEqual(child,{storage:[],idb:0});assert.deepEqual(errors,[]);
  await page.locator('#lang').click();assert.equal(await page.locator('#stop').textContent(),'Stop all');
  reports.push({width,height,label,decoded,secondsScheduled:elapsed,aligned:true,soloMute:true,rapidSwitchStop:true,hiddenEventStops:true,noAutoResume:true,gesture:true,fallback:'WAV decoded after FLAC decode failure',sfx,isolated,errors});await page.close();
 }));
 fs.writeFileSync(new URL('./browser-b.json',import.meta.url),JSON.stringify({url,browser:await browser.version(),reports,note:'Headless Chromium only; simulated visibility event; no human listening, Safari, iOS or physical speaker test.'},null,2)+'\n');console.log('PASS Phase B',reports.length,'combinations, each >2 core loops');
}finally{await browser.close();}
