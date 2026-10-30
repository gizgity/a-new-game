import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDraft, DraftRandom, weightedIndex } from '../.test-build/Draft.js';
import { draftSignals, behaviorScores } from '../.test-build/DraftSignals.js';
import { MUTATIONS, CURSES } from '../.test-build/builds.js';
import { DRAFT_TAGS } from '../.test-build/config/draft.js';
import { CombatWorld } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { defaultProfile, validateProfile, loadProfile, saveProfile, Progression } from '../.test-build/progression.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false},dt=1/60;
const context=(extra={})=>({kind:'mutation',owned:[],curses:[],pool:MUTATIONS,signals:draftSignals(),maxHp:100,previousOffers:[],choices:[],...extra});
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
function world(){const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];return w;}
function target(w,x=860,hp=1000,kind='grunt'){w.spawnEnemy(kind,hp);const e=w.enemies.at(-1);Object.assign(e,{x,y:500,stagger:999,cooldown:999});return e;}
const sample=(c,seed=123456789)=>buildDraft(c,new DraftRandom(seed));

test('xorshift32 sequence, zero seed normalization and sampling are deterministic, canonical and independent of Math.random',()=>{
 const r=new DraftRandom(1);near(r.next(),270369/2**32);assert.equal(new DraftRandom(0).seed,0x9e3779b9);
 const c=context({signals:{...draftSignals(),rangedDamage:500,rangedHits:9},owned:['phantomEdge'],previousOffers:['catalyst'],choices:['phantomEdge']});
 const first=sample(c);assert.deepEqual(first,sample(c));assert.deepEqual(first.options,sample({...c,pool:[...MUTATIONS].reverse()}).options);
 const old=Math.random;Math.random=()=>{throw Error('combat RNG touched');};try{assert.deepEqual(sample(c),first);}finally{Math.random=old;}
 const replay=new DraftRandom(first.debug.seed);replay.state=first.debug.stateBefore;assert.deepEqual(buildDraft(first.debug.context,replay),first);
 c.signals.rangedDamage=0;assert.equal(first.debug.context.signals.rangedDamage,500);
});
test('no evidence uses exploration labels, sample gates and confidence grow; weak need never pretends successful defense',()=>{
 const empty=sample(context());assert.ok(empty.options.every(o=>o.role==='wildcard'&&!o.reason));
 assert.ok(empty.debug.slots[0].candidates.every(c=>c.weight===1));
 assert.equal(behaviorScores({...draftSignals(),meleeDamage:100,meleeHits:2},100).melee,0);
 assert.equal(behaviorScores({...draftSignals(),dashes:2,perfects:2},100).perfect,0);
 assert.equal(behaviorScores({...draftSignals(),heavies:1,heavySuccess:1},100).heavy,0);
 assert.equal(behaviorScores({...draftSignals(),markedTriggers:2,relayTriggers:2,chainTargets:10},100).chain,0);
 const s=behaviorScores({...draftSignals(),meleeDamage:100,meleeHits:3,enemyHpDamage:500},100);assert.equal(s.melee,.5);assert.equal(s.need,.25);assert.equal(s.defense,0);assert.equal(s.sustain,0);
 assert.equal(behaviorScores({...draftSignals(),meleeDamage:100,meleeHits:6},100).melee,1);
});
test('weighted distribution across spread seeds favors real behavior without fixing three names; previous offers reduce probability',()=>{
 const counts=(c,slot=0)=>{const result={};for(let i=1;i<=4096;i++){const id=sample(c,Math.imul(i,0x9e3779b1)>>>0).options[slot]?.id;result[id]=(result[id]||0)+1;}return result;};
 const plain=counts(context()),ranged=counts(context({signals:{...draftSignals(),rangedDamage:800,rangedHits:12}}));
 const rangedIds=MUTATIONS.filter(id=>DRAFT_TAGS[id].includes('ranged'));const sum=(c,ids)=>ids.reduce((n,id)=>n+(c[id]||0),0);
 assert.ok(sum(ranged,rangedIds)>sum(plain,rangedIds)*1.6);assert.equal(Object.keys(ranged).length,12);
 const melee=counts(context({signals:{...draftSignals(),meleeDamage:800,meleeHits:12}}));assert.ok(melee.berserker>plain.berserker*1.5);
 const perfect=counts(context({signals:{...draftSignals(),dashes:12,perfects:12}}));assert.ok(perfect.staticRiposte>plain.staticRiposte*1.5);
 const repeat=counts(context({previousOffers:['catalyst']}));assert.ok(repeat.catalyst<plain.catalyst*.6);assert.ok(repeat.catalyst>0);
 const tank=counts(context({owned:['aegisCore']}),1),without=counts(context(),1);assert.ok(tank.ironOath===undefined);assert.ok(tank.guardBreaker>without.guardBreaker*1.5);
});
test('Adaptive/Synergy reasons match the selected candidate; combined Curse uses strongest evidence and protected keep slot',()=>{
 const s={...draftSignals(),rangedDamage:600,rangedHits:12};
 const result=sample(context({owned:['aegisCore'],signals:s}));
 for(const o of result.options){if(o.role==='adaptive')assert.ok(['ranged'].includes(o.reason.tag));if(o.role==='synergy')assert.equal(o.reason.id,'aegisCore');}
 const c=context({kind:'curse',curses:['ironOath'],owned:['aegisCore'],pool:CURSES,signals:s,previousOffers:CURSES});const r=sample(c);
 assert.deepEqual(r.options[0],{id:'ironOath',role:'curseChoice',action:'keep'});assert.equal(r.options.length,3);assert.equal(new Set(r.options.map(o=>o.id)).size,3);assert.equal(r.debug.slots[0].role,'combined');
 assert.ok(r.debug.slots.every(s=>s.candidates.every(c=>c.id!=='ironOath')));
 const noHistory=sample({...c,previousOffers:[]});for(const item of r.debug.slots[0].candidates)near(item.weight,noHistory.debug.slots[0].candidates.find(i=>i.id===item.id).weight*.4);
});
test('owned/unlocks/canonical small pools, keep-only Curse and mutation slot cap do not create undefined or add heal',()=>{
 for(const pool of [[],['catalyst'],['catalyst','catalyst','berserker']]){
  const r=sample(context({pool}));assert.equal(r.options.length,new Set(pool).size);assert.ok(r.options.every(o=>o.id));
 }
 assert.equal(sample(context({owned:['catalyst'],pool:['catalyst']})).options.length,0);
 assert.deepEqual(sample(context({kind:'curse',curses:['glassSoul'],pool:[]})).options,[{id:'glassSoul',role:'curseChoice',action:'keep'}]);
 const w=world(),r=new RunDirector(w);r.start();w.enemies=[];w.hp=50;w.mutations=['catalyst','berserker','aegisCore','soulAnchor'];r.ticks=1199;w.kills=25;r.step(idle,dt);assert.equal(r.draft.length,0);assert.equal(w.hp,50);
});
test('invalid weights use exactly one same-stream draw and warn, uniform fallback is finite',()=>{
 const old=console.warn;let warnings=0,draws=0;console.warn=()=>warnings++;
 try{assert.equal(weightedIndex([NaN,1],()=>{draws++;return .75;}),1);assert.equal(weightedIndex([0,0],()=>{draws++;return .2;}),0);}finally{console.warn=old;}
 assert.equal(warnings,2);assert.equal(draws,2);
});
test('combat signals use actual direct damage after armor/cost and overkill, exclude proc/flat/hostile sources',()=>{
 const w=world();const armor=target(w,860,1000,'bulwark');w.hitEnemy(armor,100,0,0,0,false,'heavy');near(w.draftSignals.meleeDamage,55);
 w.hitEnemy(target(w,850,5),100,0,0,0,true,'light');near(w.draftSignals.meleeDamage,60);
 const e=target(w);e.fracture=3;w.hitEnemy(e,124,0,0,0,true,'chargedHit',undefined,true,40);near(w.draftSignals.rangedDamage,84);
 w.hitEnemy(e,50,0,0,0,true,'phantom');w.hitEnemy(e,50,0,0,0,true,'blast');w.hitEnemy(e,10,0,0,0,true,'light',undefined,false);
 near(w.draftSignals.meleeDamage,60);near(w.draftSignals.rangedDamage,84);assert.equal(w.draftSignals.rangedHits,1);
 w.mutations=['aegisCore'];w.hitEnemy(e,10,0,0,0,true,'shotHit');near(w.draftSignals.rangedDamage,91.5);
});
test('dash/Perfect and Heavy counters measure started attempts and successful interrupts once per cleave, not presses',()=>{
 const w=world();w.step({...idle,dash:true},dt);assert.equal(w.draftSignals.dashes,1);assert.equal(w.draftSignals.perfects,0);w.rewardPerfectDodge();w.rewardPerfectDodge();assert.equal(w.draftSignals.perfects,1);
 w.reset();w.practice=false;w.enemies=[];for(let i=0;i<3;i++){const e=target(w,860+i*5);e.windup=.5;}
 w.beginAttack(true);assert.equal(w.draftSignals.heavies,1);for(let i=0;i<17;i++){w.hitstop=0;w.step(idle,dt);}assert.equal(w.draftSignals.heavySuccess,1);
 w.enemies=[];w.attack=null;w.beginAttack(true);for(let i=0;i<17;i++){w.hitstop=0;w.step(idle,dt);}assert.equal(w.draftSignals.heavySuccess,1);assert.equal(w.draftSignals.heavies,2);
});
test('enemy absorbed/HP loss and actual sustain exclude self-cost/hazard, invulnerability and draft heals',()=>{
 const w=world();w.hp=60;w.barrier.gain(10,false);w.hurt(20,0);assert.equal(w.draftSignals.absorbed,10);assert.equal(w.draftSignals.enemyHpDamage,10);
 w.invulnerable=0;w.hurt(8,0,false);w.payBloodMiss();assert.equal(w.draftSignals.enemyHpDamage,10);w.hurt(5,0);assert.equal(w.draftSignals.enemyHpDamage,10);
 w.setCurses(['bloodPact']);w.hitEnemy(target(w),1,0,0,0,true,'light');assert.equal(w.draftSignals.healed,3);
 const r=new RunDirector(w);r.draftKind='mutation';r.draft=[{id:'catalyst',role:'wildcard'}];r.choose(0);assert.equal(w.draftSignals.healed,3);
});
test('chain signals count marked triggers with executed relays/actual targets, never pending VFX/echo-only',()=>{
 const w=world();for(let i=0;i<3;i++)target(w,850+i*70).rupture=1;
 w.detonate(w.enemies[0],1);assert.equal(w.draftSignals.markedTriggers,1);assert.equal(w.draftSignals.chainTargets,0);
 w.resolveExplosions();assert.equal(w.draftSignals.relayTriggers,0);assert.ok(w.draftSignals.chainTargets>0);
 for(let i=0;i<5;i++){w.hitstop=0;w.step(idle,dt);}assert.equal(w.draftSignals.relayTriggers,1);
 const triggers=w.draftSignals.markedTriggers;w.explosions.push({x:850,y:500,damage:20,radius:100,hostile:false,echo:true});w.resolveExplosions();assert.equal(w.draftSignals.markedTriggers,triggers);
});
test('between-draft windows reset evidence, keep choice history/seed, and pause/render cannot consume random or change offer',()=>{
 const w=world(),r=new RunDirector(w);r.seedOverride=123;r.start();w.enemies=[];Object.assign(w.draftSignals,{meleeDamage:500,meleeHits:10});r.ticks=1199;w.kills=25;r.step(idle,dt);
 const debug=structuredClone(r.draftDebug),offer=structuredClone(r.draft);r.step(idle,1);assert.deepEqual(r.draft,offer);assert.deepEqual(r.draftDebug,debug);
 r.choose(0);r.ticks=2999;w.kills=80;w.hitstop=0;r.step(idle,dt);assert.equal(r.draftDebug.context.signals.meleeDamage,0);assert.equal(r.draftDebug.context.choices.length,1);assert.equal(r.draftDebug.seed,123);
});
test('profile migration preserves settings/unlocks; offered history whitelists unique20 IDs and rotates on abandon/reload/no-draft runs',()=>{
 const old={version:1,settings:{locale:'en',muted:true,volume:.7,cosmetic:'mint'},totals:{kills:1},unlocks:['firstBlood']};const migrated=validateProfile(old);assert.equal(migrated.settings.locale,'en');assert.ok(migrated.unlocks.includes('firstBlood'));assert.deepEqual(migrated.drafts,{previous:[],current:[],active:false});
 const p=defaultProfile(),g=new Progression(p);g.beginRun();g.offerDraft(['catalyst','berserker']);g.offerDraft(['catalyst']);g.beginRun();assert.deepEqual(p.drafts.previous,['catalyst','berserker']);assert.deepEqual(p.drafts.current,[]);
 g.offerDraft(['glassSoul']);const loaded=validateProfile({...p,drafts:{...p.drafts,current:['glassSoul','admin','glassSoul']}});new Progression(loaded).beginRun();assert.deepEqual(loaded.drafts.previous,['glassSoul']);new Progression(loaded).beginRun();assert.deepEqual(loaded.drafts.previous,[]);
 const bad=validateProfile({...p,drafts:{previous:[...MUTATIONS,...CURSES,...MUTATIONS,'admin'],current:null,active:'true'}});assert.equal(bad.drafts.previous.length,20);assert.equal(bad.drafts.active,false);
});
test('blocked storage keeps active history in session memory and debug-only generation cannot persist offers',()=>{
 const storage={getItem(){throw Error('denied');},setItem(){throw Error('denied');}};const p=loadProfile(storage),g=new Progression(p);g.beginRun();sample(context());assert.deepEqual(p.drafts.current,[]);
 g.offerDraft(['bloodReclaimer','glassSoul']);assert.equal(saveProfile(p,storage),false);g.beginRun();assert.deepEqual(p.drafts.previous,['bloodReclaimer','glassSoul']);
});

test('skipped empty milestones do not discard behavior before the next actual draft',()=>{
 const w=world(),r=new RunDirector(w);r.start();w.enemies=[];r.mutationPool=[];Object.assign(w.draftSignals,{rangedDamage:300,rangedHits:6});r.ticks=1199;w.kills=25;r.step(idle,dt);assert.equal(r.draft.length,0);
 r.ticks=2999;w.kills=80;r.step(idle,dt);assert.equal(r.draftDebug.context.signals.rangedDamage,300);assert.equal(r.draftDebug.context.signals.rangedHits,6);
});


test('opening milestone always offers four eligible directions despite behavior/history and keeps snapshot isolated',()=>{
 const expected=['aegisCore','bloodReclaimer','phantomEdge','detonationSpecialist'];
 for(const seed of [1,42,999]){
  const random=new DraftRandom(seed),before=random.state;
  const c=context({opening:true,signals:{...draftSignals(),rangedDamage:10000,rangedHits:20},previousOffers:MUTATIONS});
  const {options,debug}=buildDraft(c,random);
  assert.deepEqual(options.map(o=>o.id),expected);assert.deepEqual(options.map(o=>o.direction),['tank','sustain','counter','ranged']);assert.equal(random.state,before);
  options[0].id='catalyst';assert.equal(debug.options[0].id,'aegisCore');
 }
 const small=buildDraft(context({opening:true,pool:['bloodReclaimer','staticRiposte','phantomEdge'],owned:['phantomEdge']}),new DraftRandom(2));
 assert.deepEqual(small.options.map(o=>o.id),['bloodReclaimer']);assert.equal(buildDraft(context({opening:true,pool:[]}),new DraftRandom(2)).options.length,0);
});
test('each of four starting choices grants one Mutation, heals once, records offers; later milestones remain adaptive and restart restores opening',()=>{
 for(let choice=0;choice<4;choice++){
  const w=world(),r=new RunDirector(w),profile=defaultProfile(),p=new Progression(profile);r.start();w.enemies=[];w.hp=50;r.ticks=1199;w.kills=25;
  r.step(idle,dt);const options=r.draft;assert.equal(options.length,4);p.beginRun();p.offerDraft(options.map(o=>o.id));assert.deepEqual(new Set(profile.drafts.current),new Set(options.map(o=>o.id)));
  const ticks=r.ticks;r.step(idle,dt);assert.equal(r.ticks,ticks);assert.equal(r.choose(choice),true);assert.deepEqual(w.mutations,[options[choice].id]);assert.equal(w.hp,60);assert.equal(r.choose(choice),false);
  r.ticks=5099;w.kills=160;r.step(idle,dt);assert.equal(r.draftKind,'curse');assert.equal(r.draft.length,3);r.choose(0);r.step(idle,dt);assert.equal(r.draftKind,'mutation');assert.ok(r.draft.length<=3);assert.ok(r.draft.every(o=>!o.direction && !w.mutations.includes(o.id)));
  r.start();w.enemies=[];r.ticks=1799;r.step(idle,dt);assert.equal(r.draft.length,4);assert.deepEqual(w.mutations,[]);
 }
});
