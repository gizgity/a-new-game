// Browser presentation of ImageGen mockups; CSS grayscale uses the exact same source image.
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:2000,height:1200}});
await p.goto('http://127.0.0.1:5173/a-new-game/docs/q9d/vfx-art-v1/review.html');
const data=[];
for(const width of [320,390,844,1440]){
 const fig=p.locator(`figure:has(img[src="mockups/proposed-${width}.png"])`);await fig.scrollIntoViewIfNeeded();
 await p.evaluate(()=>document.body.classList.add('gray'));
 await fig.screenshot({path:`docs/q9d/vfx-art-v1/mockups/review-gray-${width}.png`});
 const dims=await fig.locator('img').evaluate(i=>({naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,cssWidth:i.getBoundingClientRect().width}));
 data.push({width,...dims,method:'Browser CSSgrayscale of same ImageGen composite at targetCSSwidth; NOT runtime integration, native pixel fidelity, motion or device proof.'});
 await p.evaluate(()=>document.body.classList.remove('gray'));
}
fs.writeFileSync('docs/q9d/vfx-art-v1/mockups/review.json',JSON.stringify(data,null,2));await b.close();console.log('review gray4viewport captured');
