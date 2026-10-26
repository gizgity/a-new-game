import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CombatWorld } from '../.test-build/combat.js';
import { artDirection, enemyArtPose, attackArtPose } from '../.test-build/ActorPose.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
const dt=1/60;
function world(kind='grunt') {const w=new CombatWorld({x:800,y:500,angle:0});w.enemies=[];w.spawnEnemy(kind);Object.assign(w.enemies[0],{x:850,y:500,cooldown:0,hp:500,maxHp:500});return w;}

test('a hit cannot replace real windup/active or mutate the enemy while selecting body art',()=>{
 const w=world();w.step(idle,dt);const e=w.enemies[0];e.flash=.1;assert.ok(e.windup>0);
 const before=JSON.stringify(e);assert.equal(enemyArtPose(e,false),'windup');assert.equal(JSON.stringify(e),before);
 e.windup=0;e.active=.1;e.recovery=.22;assert.equal(enemyArtPose(e,false),'attack');
 e.active=0;assert.equal(enemyArtPose(e,false),'recovery');
});

test('player body release stays on the existing damage tick and freezes through hitstop',()=>{
 const w=world();w.enemies[0].cooldown=99;w.step({...idle,pressed:['melee']},dt);assert.ok(w.attack);
 let prior;while(w.attack&&!w.attack.resolved){prior=attackArtPose(w.attack);w.step(idle,dt);}
 assert.equal(prior,'windup');assert.ok(w.attack?.resolved);assert.equal(attackArtPose(w.attack),'attack');
 const age=w.attack.age;assert.ok(w.hitstop>0);w.step(idle,dt);assert.equal(w.attack.age,age);assert.equal(attackArtPose(w.attack),'attack');
});

test('Volatile art does not introduce living recovery after its fuse resolves',()=>{
 const w=world('volatile');w.step(idle,dt);const e=w.enemies[0];assert.equal(enemyArtPose(e,false),'windup');
 for(let i=0;i<60&&w.enemies.includes(e);i++)w.step(idle,dt);
 assert.ok(!w.enemies.includes(e));assert.ok(e.hp<=0);assert.equal(enemyArtPose(e,false),'death');
});

test('atlas contains every facing/state and every existing player/Boss attack family',()=>{
 const atlas=JSON.parse(fs.readFileSync(new URL('../public/assets/actors/occult-actors.json',import.meta.url),'utf8'));
 const directions=[artDirection(0),artDirection(Math.PI/2),artDirection(Math.PI),artDirection(-Math.PI/2)];assert.equal(new Set(directions).size,4);
 for(const kind of ['player','grunt','archer','volatile','bulwark','boss'])for(const d of directions)for(const s of ['idle','move','windup','attack','recovery','hit','death'])assert.ok(atlas.frames[`${kind}/${d}/${s}`],`${kind}/${d}/${s}`);
 for(const d of directions){for(const s of ['light1','light2','light3','heavy','shoot','charged','dash','dash-exit'])assert.ok(atlas.frames[`player/${d}/${s}`]);for(const p of ['sweep','ring','slam'])for(const s of ['windup','attack','recovery'])assert.ok(atlas.frames[`boss/${d}/${p}-${s}`]);}
 for(const {frame:f} of Object.values(atlas.frames)){assert.ok(f.x>=0&&f.y>=0&&f.x+f.w<=atlas.meta.size.w&&f.y+f.h<=atlas.meta.size.h);}
});
