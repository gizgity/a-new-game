# Scene shutdown — Chromium

PASS trên runtime Phase C, dùng Phaser Scene.stop thật (không gọi trực tiếp music.destroy).

| Metric | Trước shutdown | Sau shutdown |
| --- | ---: | ---: |
| Music sources |3|0|
| Cache entries |3|0|
| Decoded bytes |8684304|0|

Page errors:0. Chromium local, không phải human listening/Safari/iOS. Script đã chạy (lưu ở Markdown để bàn giao evidence không kích hoạt deploy lại):

```js
import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import('/opt/codex/cua_node/lib/node_modules/playwright/index.mjs');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:5173/a-new-game/?playtest=music');await p.waitForFunction(()=>window.musicFixture?.arena.musicStats());await p.locator('[data-music=early]').click();
await p.evaluate(async()=>{const a=window.musicFixture.arena;await a.sound.context.resume();a.sound.locked=false;});
await p.waitForFunction(()=>window.musicFixture.stats().sources===3);
const before=await p.evaluate(()=>window.musicFixture.stats());
await p.evaluate(()=>window.musicFixture.arena.scene.stop());await p.waitForFunction(()=>window.musicFixture.stats().cacheEntries===0);
const after=await p.evaluate(()=>window.musicFixture.stats());assert.equal(after.sources,0);assert.equal(after.cacheEntries,0);assert.deepEqual(errors,[]);
fs.writeFileSync('docs/q12d/shutdown-c.json',JSON.stringify({before,after,errors,actualPhaserSceneShutdown:true},null,2));console.log('PASS actual Phaser scene shutdown');
}finally{await b.close();}
```
