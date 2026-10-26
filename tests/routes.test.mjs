import test from 'node:test';
import assert from 'node:assert/strict';
import { DIVERSITY_ROUTES, routeDraft } from '../.test-build/config/playtests.js';
import { CombatWorld } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
test('Q5E routes progress through actual six drafts without starting resources or exceeding four slots; keep Curse stays valid',()=>{
 for(const route of DIVERSITY_ROUTES){
  const w=new CombatWorld({x:800,y:500,angle:0}),r=new RunDirector(w);r.start();w.enemies=[];
  assert.deepEqual(w.mutations,[]);assert.equal(w.curse,null);assert.equal(w.hp,100);assert.equal(w.chargedShots,0);
  for(const kills of [25,80,160,220,300,380]){
   w.kills=kills;r.step(idle,1/60);assert.ok(r.draft.length);
   r.draft=routeDraft(route,r.draftKind,w.mutations,w.curse,r.draft);
   assert.ok(r.draft.length<=3);assert.equal(new Set(r.draft.map(o=>o.id)).size,r.draft.length);
   const expected=r.draftKind==='curse'?route.curse:route.mutations.find(id=>!w.mutations.includes(id));
   assert.ok(r.draft.some(o=>o.id===expected));r.choose(r.draft.findIndex(o=>o.id===expected));
  }
  assert.deepEqual(w.mutations,route.mutations);assert.equal(w.curse,route.curse);
  const options=routeDraft(route,'curse',w.mutations,'deathEcho',[{id:'glassSoul',role:'wildcard'}]);
  assert.equal(options[0].id,'deathEcho');assert.ok(options.some(o=>o.id===route.curse));
 }
});
