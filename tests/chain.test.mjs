import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld, COMBAT } from '../.test-build/combat.js';
import { FIXED_STEP } from '../.test-build/movement.js';
const idle = { dx:0, dy:0, melee:false, shoot:false, heavy:false, dash:false };
function setup(positions, stacks = 1) {
  const w = new CombatWorld({x:0,y:0,angle:0}); w.practice=false;
  const template = w.enemies[0];
  w.enemies=positions.map((x,id)=>({...template,id,x,y:500,hp:1000,maxHp:1000,stagger:100,rupture:Array.isArray(stacks)?stacks[id]:stacks}));
  w.projectiles.push({x:820,y:500,vx:2000,vy:0,hostile:false,life:1});
  w.step(idle,FIXED_STEP); return w;
}
function settle(w) { for(let i=0;i<180;i++) { w.step(idle,FIXED_STEP); assert.ok(w.lastChain<=COMBAT.chainLimit); } }
test('a marked bridge relays beyond the first radius; a gap or unmarked bridge stops it',()=>{
  const linked=setup([860,950,1040]);
  assert.equal(linked.detonations,1); assert.equal(linked.enemies[2].hp,1000);
  settle(linked); assert.equal(linked.detonations,3); assert.ok(linked.enemies[2].hp<1000);
  const gap=setup([860,1000,1090]); settle(gap); assert.equal(gap.detonations,1); assert.equal(gap.enemies[1].rupture,1);
  const bridge=setup([860,950,1040],[1,0,1]); settle(bridge);
  assert.equal(bridge.detonations,1); assert.equal(bridge.enemies[2].hp,1000); assert.equal(bridge.enemies[2].rupture,1);
  const unmarked=setup([860,950,1040]); unmarked.enemies[2].rupture=0; settle(unmarked);
  assert.equal(unmarked.detonations,2); assert.ok(unmarked.enemies[2].hp<1000); // AoE, no auto-seed.
});
test('relay snapshots survive marked target death and knockback without moving the blast center',()=>{
  const w=setup([860,950,1040]);
  assert.equal(w.enemies[1].rupture,0);
  w.enemies[1].hp=0; w.enemies[1].x=1300;
  settle(w); assert.equal(w.detonations,3);
  assert.ok(w.enemies.find(e=>e.id===2).hp<1000);
});
test('queued detonation pays charge and unlock progress only when executed; hitstop freezes it',()=>{
  const w=setup([860,950]); const points=w.chargedShots*3+w.chargePoints;
  assert.equal(w.detonations,1);
  w.hitstop=1;
  for(let i=0;i<30;i++) w.step(idle,FIXED_STEP);
  assert.equal(w.detonations,1); assert.equal(w.chargedShots*3+w.chargePoints,points);
  settle(w); assert.equal(w.detonations,2); assert.equal(w.chargedShots*3+w.chargePoints,points+1);
});
test('reset discards queued relays, marks and rewards',()=>{
  const w=setup([860,950,1040]); w.reset(); w.practice=false; w.enemies=[];
  settle(w); assert.equal(w.detonations,0); assert.equal(w.chargedShots,0); assert.equal(w.impacts.length,0);
});
test('stack investment increases blast damage without growing radius or seeding neighbours',()=>{
  for(const stacks of [1,2,3]) {
    const w=setup([860,940,1100],stacks); w.enemies[1].rupture=0; // Already queued; snapshot keeps original stacks.
    assert.equal(w.enemies[1].hp,1000-12*stacks);
    assert.equal(w.enemies[2].hp,1000);
    settle(w); assert.equal(w.detonations,2); assert.equal(w.enemies[2].rupture,stacks);
  }
});
