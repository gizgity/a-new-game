import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const [width,height,touch]of [[390,844,true],[1440,1000,false]]){
 const p=await b.newPage({viewport:{width,height},hasTouch:touch}),errors=[],assets=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().includes('ascension-motifs'))assets.push({url:r.url(),status:r.status()});});
 await p.goto('http://127.0.0.1:5175/a-new-game/?playtest=seal-3');await p.locator('#primary').click();await p.waitForTimeout(1100);
 const choose=async()=>{if(touch)await p.locator('[data-choice="0"]').tap();else {await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}};await choose();
 await p.waitForFunction(()=>document.querySelector('#draft-panel').textContent.includes('Fractured Choice')&&!document.querySelector('#draft-panel').hidden,{},{timeout:60000});await p.waitForTimeout(1100);await p.selectOption('#locale','en');assert.match(await p.locator('#draft-panel').textContent(),/50%.*10%/);await choose();await p.waitForFunction(()=>document.querySelector('#overlay').hidden);
 assert.match(await p.locator('#legacy-indicator').textContent(),/Seal 3/);await p.locator('#pause').click();await p.locator('#menu-build').click();assert.match(await p.locator('#build-panel').textContent(),/Static Riposte/);await p.locator('#build-resume').click();
 for(const file of ['ascension-motifs.png','ascension-motifs.json'])assert.ok(assets.some(a=>a.url.endsWith(file)&&a.status===200));
 assert.equal(await p.evaluate(()=>localStorage.getItem('cursebreak.save.v1')),null);assert.deepEqual(errors,[]);await p.screenshot({path:`docs/q9d/vfx-production/evidence/dist-${width}.png`});reports.push({width,height,touch,productionBundle:true,legacyAndFractureChoice:true,viEn:true,detailsPauseResume:true,assets,isolatedSave:true,errors});await p.close();
}
await b.close();const files=['dist/index.html',...fs.readdirSync('dist/assets').filter(f=>/\.(js|css)$/.test(f)).map(f=>'dist/assets/'+f),'dist/assets/vfx/ascension-motifs.png','dist/assets/vfx/ascension-motifs.json'];
fs.writeFileSync('docs/q9d/vfx-production/evidence/dist.json',JSON.stringify({hashes:Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')])),reports},null,2));console.log('PASS dist2platform/actualFractureFlow/assets200');
