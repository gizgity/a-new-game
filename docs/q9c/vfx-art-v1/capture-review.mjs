// Grayscale proof of the SAME candidate/baseline images via browser CSS, never ImageGen grayscale.
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
import fs from 'node:fs';
fs.mkdirSync('docs/q9c/vfx-art-v1/proof',{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await browser.newPage({viewport:{width:3100,height:1500}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:5173/a-new-game/docs/q9c/vfx-art-v1/review.html');await p.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
const sizes=await p.locator('img').evaluateAll(imgs=>imgs.map(i=>({path:i.getAttribute('src'),width:i.naturalWidth,height:i.naturalHeight})));
for(const w of[320,390,844,1440]){
 const row=p.locator('#viewport-'+w+' .row');await row.screenshot({path:`docs/q9c/vfx-art-v1/proof/compare-${w}.png`});
 await p.evaluate(()=>document.body.classList.add('gray'));await row.screenshot({path:`docs/q9c/vfx-art-v1/proof/compare-${w}-gray.png`});await p.evaluate(()=>document.body.classList.remove('gray'));
}
await browser.close();fs.writeFileSync('docs/q9c/vfx-art-v1/proof/review.json',JSON.stringify({method:'CSS grayscale of the same actual renderer / ImageGen composite concept pair. Native CSSwidth320/390/844/1440; candidate bitmap may differ by subpixel registration. Browser review only, not game integration/FPS/geometry evidence.',sizes,errors},null,2));console.log('PASS proof pairs4color/4gray, decode',sizes.length,'errors',errors.length);
