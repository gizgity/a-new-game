import fs from 'node:fs';
import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=user-gesture-required']});
const url=process.env.Q12D_URL||'http://localhost:5173/a-new-game/docs/q12d/index.html';
const reports=[];
try {
 for(const [width,height] of [[390,844],[1440,1000],[320,740],[844,390]]) {
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.reviewStorage=[];for(const name of ['setItem','removeItem','clear']){const fn=Storage.prototype[name];Storage.prototype[name]=function(...args){window.reviewStorage.push(name);return fn.apply(this,args);};}
   window.reviewSources=[];const fn=AudioBufferSourceNode.prototype.start;
   AudioBufferSourceNode.prototype.start=function(...args){window.reviewSources.push({when:args[0],loop:this.loop,loopEnd:this.loopEnd,frames:this.buffer?.length,rate:this.buffer?.sampleRate});return fn.apply(this,args);};
  });
  await page.goto(url);await page.frameLocator('#sfx').locator('nav button').first().waitFor();
  const decode=await page.evaluate(async()=>{
   const manifest=await(await fetch('./manifest.json')).json(),ctx=new AudioContext(),results=[];
   for(const p of manifest.pieces){const r=await fetch(`./audio/${p.id}.wav`);if(!r.ok)throw Error(r.status);const b=await ctx.decodeAudioData(await r.arrayBuffer());results.push({id:p.id,length:b.length,rate:b.sampleRate,channels:b.numberOfChannels,duration:b.duration,expected:p.seconds});}
   await ctx.close();return results;
  });
  for(const d of decode){assert.equal(d.channels,1);assert.ok(Math.abs(d.duration-d.expected)<=1/d.rate);}
  for(const id of ['arena-base','tension','anomaly','boss-core','enraged','victory','defeat']){
   await page.getByRole('button',{name:id,exact:true}).click();await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('Đang phát'));
   const last=await page.evaluate(()=>window.reviewSources.at(-1));assert.equal(last.loop,!['victory','defeat'].includes(id));
  }
  for(const label of ['arena-base + tension','arena-base + anomaly','arena-base + tension + anomaly','boss-core + enraged']){
   await page.getByRole('button',{name:label,exact:true}).click();await page.waitForFunction(label=>document.querySelector('#status').textContent===`Đang phát: ${label}`,label);
   const count=label.split(' + ').length,starts=await page.evaluate(n=>window.reviewSources.slice(-n),count);assert.ok(starts.every(s=>s.when===starts[0].when&&s.loop));for(const s of starts.slice(1))assert.ok(Math.abs(starts[0].loopEnd-2*s.loopEnd)<=1/s.rate,'8-bar overlay must align with 16-bar core');
  }
  // Let Boss/Enraged pass one overlay boundary; do once, no human listening claim.
  if(width===390) await page.waitForTimeout(13000);
  await page.locator('#combat').click();await page.waitForTimeout(150);
  await page.locator('#arrival').click();await page.waitForTimeout(2100);
  const sfx=await page.locator('#sfx').evaluate(el=>({calls:el.contentWindow.reviewSources,storage:el.contentWindow.reviewStorage}));
  assert.ok(sfx.calls.length>4,'real accepted SFX must start');assert.deepEqual(sfx.storage,[]);
  await page.locator('#stop').click();assert.equal(await page.locator('#status').textContent(),'Đã dừng');
  // Rapid play/stop must cancel pending decode, not replay after loading finishes.
  await page.getByRole('button',{name:'victory',exact:true}).click();await page.locator('#stop').click();await page.waitForTimeout(150);assert.equal(await page.locator('#status').textContent(),'Đã dừng');
  const state=await page.evaluate(()=>({storage:window.reviewStorage,overflow:document.documentElement.scrollWidth>innerWidth}));assert.deepEqual(state.storage,[]);assert.equal(state.overflow,false);assert.deepEqual(errors,[]);
  await page.locator('#lang').click();assert.equal(await page.locator('#stop').textContent(),'Stop all');
  reports.push({width,height,decode,errors,storageWrites:0,alignedCombinations:4,realSfxStarts:sfx.calls.length,passedOverlayBoundary:width===390});await page.close();
 }
 fs.writeFileSync(new URL(process.env.Q12D_URL?'./browser-build.json':'./browser.json',import.meta.url),JSON.stringify({url,reports,note:'Headless Chromium scheduling/decode only. No human sound quality or device coverage claim.'},null,2)+'\n');console.log('PASS',url,reports.length,'viewports');
} finally {await browser.close();}
