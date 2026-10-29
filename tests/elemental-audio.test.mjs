import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { chainRoot, legacyRoot } from '../.test-build/BuildEffects.js';
import { LEGACY as L } from '../.test-build/config/legacy.js';
import { ElementalAdmission, synthesizeElemental } from '../.test-build/elementalAudio.js';
import { ELEMENTAL_TONES } from '../.test-build/config/elementalAudio.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
function setup(sigil,branch=null){const w=new CombatWorld({x:800,y:500,angle:0});w.enemies=[];w.legacy.equip({sigil,branch});w.spawnEnemy('grunt',1000);const e=w.enemies[0];Object.assign(e,{x:850,y:500,hp:1000,maxHp:1000,stagger:100});return [w,e];}
const cues=w=>w.elementalEvents.map(e=>e.cue);
const primary=(w,e,kind,root=chainRoot())=>{w.legacy.primary(e,kind,root);return root;};
function resolve(w){w.legacy.step(.2);w.legacy.resolve();}
test('six cores distinguish apply/refresh/tick/consume/expire and confirmed thresholds',()=>{
 let [w,e]=setup('fire');primary(w,e,'charged');primary(w,e,'charged');assert.deepEqual(cues(w),['ignite']);w.elementalEvents=[];resolve(w);assert.deepEqual(cues(w),[]);
 [w,e]=setup('water');primary(w,e,'heavy');primary(w,e,'heavy');assert.deepEqual(cues(w),['soaked']);
 [w,e]=setup('lightning');w.legacy.perfect();w.legacy.perfect();assert.deepEqual(cues(w),['staticCharge']);primary(w,e,'basic');w.legacy.resolve();assert.ok(cues(w).includes('discharge'));w.elementalEvents=[];resolve(w);assert.deepEqual(cues(w),[]);
 [w,e]=setup('ice');for(let i=0;i<5;i++)primary(w,e,'basic');assert.deepEqual(cues(w),['frostbite']);primary(w,e,'heavy');w.legacy.resolve();assert.ok(cues(w).includes('shatter'));
 [w,e]=setup('shadow');w.legacy.perfect();w.legacy.perfect();primary(w,e,'light');assert.deepEqual(cues(w),['shadowMark','ambush']);
 [w,e]=setup('wind');w.legacy.move(130,.1);w.legacy.move(10,.1);assert.deepEqual(cues(w),['momentum']);w.legacy.light(chainRoot(),0);assert.ok(cues(w).includes('windSlash'));w.elementalEvents=[];w.legacy.step(10);assert.deepEqual(cues(w),[]);
});
test('all twelve branches emit only their corresponding confirmed event',()=>{
 let [w,e]=setup('fire','wildfire');primary(w,e,'charged');w.spawnEnemy('grunt',1000);const b=w.enemies.at(-1);Object.assign(b,{x:870,y:500});e.hp=0;const root=chainRoot();legacyRoot(root);w.legacy.killed(e,{root,depth:0,origin:'primary'});w.legacy.resolve();assert.ok(cues(w).includes('wildfire'));
 [w,e]=setup('fire','furnace');primary(w,e,'charged');primary(w,e,'heavy');w.legacy.resolve();assert.ok(cues(w).includes('furnace'));
 [w,e]=setup('water','undertow');primary(w,e,'heavy');primary(w,e,'basic');assert.ok(cues(w).includes('undertow'));
 [w,e]=setup('water','flowState');w.heavyCharges=0;w.legacy.perfect();assert.ok(cues(w).includes('flowState'));
 [w,e]=setup('lightning','arcRelay');w.spawnEnemy('grunt',1000);Object.assign(w.enemies.at(-1),{x:880,y:500});w.legacy.perfect();primary(w,e,'basic');w.legacy.resolve();resolve(w);assert.ok(cues(w).includes('arcRelay'));
 [w,e]=setup('lightning','overclock');w.legacy.perfect();primary(w,e,'basic');assert.ok(cues(w).includes('overclock'));
 for(const branch of ['brittle','crystalEcho']){[w,e]=setup('ice',branch);w.spawnEnemy('grunt',1000);Object.assign(w.enemies.at(-1),{x:890,y:500});for(let i=0;i<3;i++)primary(w,e,'basic');primary(w,e,'heavy');resolve(w);w.legacy.step(.1);assert.ok(cues(w).includes(branch),branch);}
 [w,e]=setup('shadow','nightfall');w.legacy.perfect();primary(w,e,'light');resolve(w);assert.ok(cues(w).includes('nightfall'));
 [w,e]=setup('shadow','veilstep');w.legacy.perfect();assert.ok(cues(w).includes('veilstep'));
 for(const branch of ['tailwind','cyclone']){[w,e]=setup('wind',branch);w.legacy.move(130,.1);w.legacy.light(chainRoot(),0);for(let i=0;i<10;i++)w.legacy.step(.01);assert.ok(cues(w).includes(branch),branch);}
});
test('dead/budget blocked secondary and canceled Nightfall do not produce impact audio; lethal Ambush remains confirmed',()=>{
 let [w,e]=setup('shadow','nightfall');w.legacy.perfect();primary(w,e,'light');e.hp=0;resolve(w);assert.ok(!cues(w).includes('nightfall'));
 [w,e]=setup('fire','furnace');primary(w,e,'charged');const root=chainRoot();legacyRoot(root);root.legacy.remaining=0;primary(w,e,'heavy',root);w.legacy.resolve();assert.ok(!cues(w).includes('furnace'));
 [w,e]=setup('shadow','nightfall');w.legacy.perfect();e.hp=0;primary(w,e,'light');resolve(w);assert.ok(cues(w).includes('ambush'));assert.ok(!cues(w).includes('nightfall'));
 [w,e]=setup('ice');for(let i=0;i<3;i++)primary(w,e,'basic');e.hp=0;primary(w,e,'heavy');w.legacy.resolve();assert.ok(!cues(w).includes('shatter'));
});
test('no Sigil/miss/cancel and frame clearing; no sound event can execute effects',()=>{
 const w=new CombatWorld({x:800,y:500,angle:0});w.step({...idle,heavy:true},1/60);w.step({...idle,dash:true},1/60);assert.deepEqual(w.elementalEvents,[]);
 w.elementalEvents.push({cue:'furnace',root:123});const before=w.kills;w.step(idle,1/60);assert.deepEqual(w.elementalEvents,[]);assert.equal(w.kills,before);
});
test('root dedup survives delayed frames, bounds secondary, family rate and history; reset permits fresh run',()=>{
 const a=new ElementalAdmission();assert.ok(a.admit({cue:'ignite',root:1},0));assert.equal(a.admit({cue:'ignite',root:1},500),0);
 assert.ok(a.admit({cue:'furnace',root:1},500));assert.ok(a.admit({cue:'wildfire',root:1,secondary:true},600));assert.equal(a.admit({cue:'soaked',root:1,secondary:true},700),0);
 assert.equal(a.admit({cue:'ignite',root:2},20),0);a.reset();assert.ok(a.admit({cue:'ignite',root:1},0));
 for(let i=2;i<2000;i++)a.admit({cue:'ignite',root:i},i*200);assert.ok(a.roots.size<=512);
});
test('22 bounded mono PCM identities; no external resources; synthesis does not use world RNG',()=>{
 for(const cue of Object.keys(ELEMENTAL_TONES)){const pcm=synthesizeElemental(cue,24000);assert.ok(pcm.length<=24000*.25);assert.ok(pcm.every(Number.isFinite));assert.ok(Math.max(...pcm.map(Math.abs))<=.220001);assert.ok(pcm.some(x=>Math.abs(x)>.1));}
});
