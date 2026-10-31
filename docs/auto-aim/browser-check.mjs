import { chromium } from '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
for (const [width,height,touch] of [[1440,1000,false],[390,844,true]]) {
  const page = await browser.newPage({viewport:{width,height},hasTouch:touch});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/a-new-game/');
  await page.waitForFunction(()=>!document.querySelector('#primary').disabled);
  await page.locator('#settings summary').click();
  assert.equal(await page.locator('#desktop-auto-aim').isChecked(),false);
  assert.equal(await page.locator('#auto-aim-priority-row').isVisible(),false);
  await page.locator('#desktop-auto-aim').check();
  assert.equal(await page.locator('#auto-aim-priority-row').isVisible(),true);
  await page.locator('#auto-aim-priority').selectOption('archer');
  await page.reload();
  await page.waitForFunction(()=>!document.querySelector('#primary').disabled);
  await page.locator('#settings summary').click();
  assert.equal(await page.locator('#desktop-auto-aim').isChecked(),true);
  assert.equal(await page.locator('#auto-aim-priority').inputValue(),'archer');
  await page.selectOption('#locale','en');
  assert.equal(await page.locator('[data-i18n=desktopAutoAim]').textContent(),'Auto aim (desktop)');
  await page.locator('#primary').click();
  await page.waitForTimeout(200);
  await page.evaluate(async()=>{
    const {arena}=await import('/a-new-game/src/main.ts');
    window.a=arena; arena.game.loop.stop();
    arena.combat.enemies.length=0;
    for(const [kind,dx,dy,rupture] of [['grunt',40,0,0],['archer',0,150,0],['bulwark',-200,0,0],['grunt',0,-250,1]]){
      arena.combat.spawnEnemy(kind); Object.assign(arena.combat.enemies.at(-1),{x:arena.player.x+dx,y:arena.player.y+dy,rupture,stagger:999});
    }
    arena.input.isOver=true;
  });
  const canvas=await page.locator('canvas').boundingBox();
  await page.mouse.move(canvas.x+canvas.width*.8,canvas.y+canvas.height*.5);
  const result=await page.evaluate(touch=>{
    const a=window.a; a.update(0,0);
    const marked=a.player.angle;
    a.combat.enemies[3].rupture=0; a.update(0,0); const archer=a.player.angle;
    a.autoAimPriority='elite';a.update(0,0);const elite=a.player.angle;
    a.autoAimPriority='nearest';a.update(0,0);const nearest=a.player.angle;
    a.autoAimPriority='archer';
    return {marked,archer,elite,nearest};
  },touch);
  if(touch) { for(const angle of Object.values(result)) assert.equal(angle,0); }
  else {
    assert.equal(result.marked,-Math.PI/2); assert.equal(result.archer,Math.PI/2);assert.equal(result.elite,Math.PI);assert.equal(result.nearest,0);
    // Actual keyboard events: hold does not attack, release captures fresh target.
    for(const [key,action] of [['r','heavy'],['e','charged']]) {
      await page.keyboard.down(key);
      assert.equal(await page.evaluate(action=>window.a.pressed.has(action),action),false);
      await page.keyboard.up(key);
      assert.equal(await page.evaluate(action=>window.a.releaseAim[action],action),Math.PI/2);
      await page.evaluate(()=>{window.a.pressed.clear();window.a.releaseAim={};});
      await page.keyboard.down(key);
      await page.evaluate(()=>window.a.setPhase('paused'));
      await page.keyboard.up(key);
      assert.equal(await page.evaluate(action=>window.a.pressed.has(action),action),false);
      await page.evaluate(()=>window.a.setPhase('playing'));
      assert.equal(await page.evaluate(action=>window.a.armedSpecials.has(action),action),false);
    }
    await page.evaluate(()=>{const a=window.a;a.desktopAutoAim=false;a.update(0,0);});
    const manual=await page.evaluate(()=>window.a.player.angle);
    assert.ok(Math.abs(manual-Math.PI/2)>.1);
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({width,touch,settingsPersistence:true,angles:result,errors}));
  await page.close();
}
} finally {await browser.close();}
