const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
for(const touch of [true,false])for(const id of ['fracturedStorm','bloodMoon','volatileGround','staticField','brokenSeal','echoChamber']){
 const p=await browser.newPage({viewport:{width:touch?390:1440,height:touch?844:1000},hasTouch:touch}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5175/a-new-game/?playtest=anomaly-'+id);await p.locator('#primary').click();await p.waitForFunction(()=>document.querySelector('#draft-panel h2')?.textContent==='Chọn một Anomaly');await p.waitForTimeout(1100);assert.equal(await p.locator('[data-choice]').count(),2);
 if(touch)await p.locator('[data-choice="0"]').tap();else{await p.locator('[data-choice="0"]').focus();await p.keyboard.press('Enter');}
 await p.waitForFunction(()=>document.querySelector('#overlay').hidden);assert.ok((await p.locator('#legacy-indicator').textContent()).length);
 await p.locator('#pause').click();await p.locator('#menu-build').click();assert.ok((await p.locator('#anomaly-details').textContent()).length>40);await p.locator('#build-resume').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('cursebreak.save.v1')),null);assert.deepEqual(errors,[]);reports.push({id,touch,productionBundle:true,choose:true,hudAndDetails:true,pauseResume:true,isolatedSave:true,errors});await p.close();
}
await browser.close();const files=['dist/index.html',...fs.readdirSync('dist/assets').filter(x=>x.endsWith('.js')||x.endsWith('.css')).map(x=>'dist/assets/'+x)];const hashes=Object.fromEntries(files.map(x=>[x,crypto.createHash('sha256').update(fs.readFileSync(x)).digest('hex')]));fs.writeFileSync('docs/q9c/evidence/dist.json',JSON.stringify({hashes,reports},null,2));console.log('PASS',reports.length);
