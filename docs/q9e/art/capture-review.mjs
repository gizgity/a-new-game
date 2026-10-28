import fs from 'node:fs';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1600,height:1200}});
await p.goto('http://localhost:5173/a-new-game/docs/q9e/art/review.html');await p.locator('.board').waitFor();await p.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
const evidence=[];for(const w of[320,390,844,1440])for(let i=-1;i<6;i++){
 const el=p.locator(`#v${w}-${i} .viewport`);await el.scrollIntoViewIfNeeded();await el.screenshot({path:`docs/q9e/art/mockups/composite-${w}-${i}.png`});await p.locator('body').evaluate(e=>e.classList.add('gray'));await el.screenshot({path:`docs/q9e/art/mockups/composite-${w}-${i}-gray.png`});await p.locator('body').evaluate(e=>e.classList.remove('gray'));evidence.push({viewport:w,trail:i,baselineUnmodified:true,conceptOnly:true});}
fs.writeFileSync('docs/q9e/art/mockups/review.json',JSON.stringify(evidence,null,2));await b.close();console.log('Captured',evidence.length,'color + grayscale pairs');
