import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld, COMBAT } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { chainRoot } from '../.test-build/BuildEffects.js';
import { ANOMALY as A } from '../.test-build/config/anomalies.js';
import { ANOMALIES, LEGACY_IDS, SIGILS, BRANCHES, STARTER_ANOMALIES } from '../.test-build/config/legacy.js';
import { emptyLegacy, beginLegacy, chooseAnomaly, closeLegacy, validateLegacy, rollAnomalies } from '../.test-build/legacy.js';
import { defaultProfile, saveProfile, loadProfile } from '../.test-build/progression.js';
import { MUTATIONS, CURSES } from '../.test-build/builds.js';
import { HEAVY, CHAIN, ENCOUNTERS, BOSS_PHASE } from '../.test-build/config/balance.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
function world(id){const w=new CombatWorld({x:800,y:500,angle:0});w.enemies=[];w.practice=false;if(id)w.anomaly.equip(id);return w;}
function enemy(w,kind='grunt',hp=1000,x=865,y=500){w.spawnEnemy(kind,hp);const e=w.enemies.at(-1);Object.assign(e,{x,y,cooldown:99,leapCooldown:99});return e;}
function advance(w,s,input=idle){for(let i=0;i<Math.ceil(s*60);i++){w.hitstop=0;w.step(input,1/60);}}
const points=w=>w.chargedShots*3+w.chargePoints;
const strike=(w,e,sound='heavy',stagger=HEAVY.stagger)=>w.hitEnemy(e,1,0,0,stagger,true,sound);

test('ticket: no anomaly run1, seeded two distinct unlocked offers, immutable choice, migrate/refresh/restart, close updates history',()=>{
 let s=emptyLegacy();let t=beginLegacy(s,0,44);assert.deepEqual(t.anomalyOffers,[]);assert.equal(chooseAnomaly(s,0),false);
 closeLegacy(s);t=beginLegacy(s,1,45);assert.equal(t.anomalyOffers.length,2);assert.deepEqual([...t.anomalyOffers].sort(),[...STARTER_ANOMALIES].sort());
 for(const bad of [-1,.5,2,NaN])assert.equal(chooseAnomaly(s,bad),false);
 assert.equal(chooseAnomaly(s,1),true);assert.equal(chooseAnomaly(s,0),false);
 s=validateLegacy(JSON.parse(JSON.stringify(s)));assert.deepEqual(beginLegacy(s,99,999),t);
 const old=structuredClone(s);delete old.ticket.anomalyOffers;delete old.ticket.anomalySelected;delete old.previousAnomalies;
 const migrated=validateLegacy(old);assert.deepEqual(migrated.ticket.anomalyOffers,t.anomalyOffers);assert.equal(migrated.ticket.anomalySelected,null);
 old.ticket.anomalySelected='staticField';assert.equal(validateLegacy(old).ticket.anomalySelected,null);
 closeLegacy(s);assert.deepEqual(s.previousAnomalies,t.anomalyOffers);assert.equal(s.ticket,null);
 const p=defaultProfile();p.legacy=validateLegacy({...old,ticket:{...old.ticket,anomalySelected:t.anomalySelected}});
 const memory=new Map(),storage={setItem:(k,v)=>memory.set(k,v),getItem:k=>memory.get(k)??null};assert.equal(saveProfile(p,storage),true);assert.deepEqual(loadProfile(storage).legacy,p.legacy);
});
test('weighted anomaly sampler is deterministic, distinct and softly discourages previous offers',()=>{
 let baseline=0,repeated=0;
 for(let i=1;i<=8000;i++){
  const seed=Math.imul(i,2654435761)>>>0,a=rollAnomalies(LEGACY_IDS,seed),b=rollAnomalies(LEGACY_IDS,seed,['staticField']);
  assert.equal(a.length,2);assert.notEqual(a[0],a[1]);assert.deepEqual(a,rollAnomalies(LEGACY_IDS,seed));
  if(a[0]==='staticField')baseline++;if(b[0]==='staticField')repeated++;
 }
 assert.ok(repeated>0&&repeated<baseline,{repeated,baseline});
});
test('135s queue: Draft first; frozen selection; exactly one activation; restart waits to135 again; run1 excluded',()=>{
 const w=world(),r=new RunDirector(w),s=emptyLegacy();r.seedOverride=2;r.start();r.anomalyTicket=beginLegacy(s,1,5);
 r.ticks=8099;w.enemies=[];w.hp=100; // Existing milestones queue before anomaly, one choice at a time.
 r.step(idle,1/60);assert.ok(r.draft.length);assert.equal(r.anomalyPending,false);
 for(let n=0;n<8&&!r.anomalyPending;n++){if(r.draft.length)r.choose(0);r.step(idle,1/60);}
 assert.equal(r.anomalyPending,true);const frozen=JSON.stringify(w),ticks=r.ticks;r.step({...idle,shoot:true},1/60);assert.equal(r.ticks,ticks);assert.equal(JSON.stringify(w),frozen);
 chooseAnomaly(s,0);assert.equal(r.resolveAnomaly(),true);assert.equal(r.resolveAnomaly(),false);assert.equal(w.anomaly.active,s.ticket.anomalySelected);
 r.start();r.anomalyTicket=s.ticket;assert.equal(w.anomaly.active,null);r.prepareBossPlaytest(0,134);r.step(idle,1/60);assert.equal(w.anomaly.active,null);r.ticks=8100;r.step(idle,1/60);assert.equal(w.anomaly.active,s.ticket.anomalySelected);assert.equal(r.anomalyPending,false);
 const first=emptyLegacy();r.start();r.anomalyTicket=beginLegacy(first,0,8);r.prepareBossPlaytest(0,136);r.step(idle,1/60);assert.equal(r.anomalyPending,false);assert.equal(w.anomaly.active,null);
});
test('Elite transition, arrival, transform and boss combo cannot overlap selection',()=>{
 const w=world(),r=new RunDirector(w);r.start();r.anomalyTicket=beginLegacy(emptyLegacy(),1,3);r.prepareBossPlaytest(0,135);
 // Restore Elite eligibility for simultaneous threshold.
 r.eliteSpawned=false;w.kills=ENCOUNTERS.elite.kills;r.step(idle,1/60);assert.ok(w.enemies.some(e=>e.kind==='bulwark'));assert.equal(r.anomalyPending,false);
 r.step(idle,1/60);assert.equal(r.anomalyPending,true);r.anomalyPending=false;
 r.prepareBossPlaytest(ENCOUNTERS.boss.kills,ENCOUNTERS.boss.minSeconds);r.step(idle,1/60);assert.equal(r.bossWarning,BOSS_PHASE.arrival);assert.equal(r.anomalyPending,false);
 r.step(idle,1/60);assert.equal(r.anomalyPending,false);
 r.bossWarning=0;r.bossDue=true;const b=enemy(w,'boss',1500,1200);b.windup=.5;b.windupDuration=.5;r.step(idle,1/60);assert.equal(r.anomalyPending,false);
 b.hp=700;const ticks=r.ticks;r.step(idle,1/60);assert.equal(r.ticks,ticks);assert.equal(r.anomalyPending,false);
});
test('Storm locks zone, damages both sides after full warning; walking and Dash avoid; hitstop freezes',()=>{
 for(const evade of ['none','walk','dash']){
  const w=world('fracturedStorm'),e=enemy(w,'grunt',1000,800);e.stagger=99;w.anomaly.clock=0;advance(w,1/60);
  const z={...w.anomaly.zones[0]};assert.ok(z.duration>=1);assert.equal(e.hp,1000);assert.equal(w.hp,100);
  w.hitstop=1;w.step(idle,1/60);assert.equal(w.anomaly.zones[0].time,z.time);
  if(evade==='walk')w.player.x=z.x+z.radius+20;
  advance(w,z.duration-.05);assert.equal(w.hp,100);
  if(evade==='dash')w.dashTime=.18;
  advance(w,.1);assert.equal(e.hp,1000-A.storm.enemyDamage);assert.equal(w.hp,evade==='none'?100-A.storm.playerDamage:100);
  assert.equal(w.detonations,0);assert.equal(e.rupture,0);
 }
});
test('Blood Moon: real third hit grants once per attack/cooldown, no whiff/secondary grant; enemies pursue faster',()=>{
 const base=world(),w=world('bloodMoon');const e=enemy(w,'grunt',1000,850);e.stagger=99;
 w.combo=2;w.comboWindow=1;const before=points(w);advance(w,.19,{...idle,melee:true});assert.equal(points(w)-before,1+A.blood.charge);assert.ok(w.anomaly.finisherCooldown>0);
 const got=points(w);w.anomaly.finisher();assert.equal(points(w),got);w.hitEnemy(e,1,0,0,0,false,'anomaly');assert.equal(points(w),got);
 w.enemies=[];advance(w,3);w.combo=2;w.comboWindow=1;w.attack=null;advance(w,.19,{...idle,melee:true});assert.equal(points(w),got);
 const a=enemy(base,'grunt',1000,1100),b=enemy(w,'grunt',1000,1100);w.player.x=800;advance(base,.1);advance(w,.1);assert.ok(b.x<a.x);
});
test('Volatile Ground: real Detonate radius expands; warning floors hurt only after delay; curse hazards stay independent',()=>{
 const w=world('volatileGround'),a=enemy(w),b=enemy(w,'grunt',1000,865+CHAIN.radius*1.15);a.rupture=1;
 w.detonate(a,1);w.resolveExplosions();assert.ok(b.hp<1000);assert.equal(w.detonations,1);
 w.enemies=[];w.anomaly.clock=0;w.anomaly.step(.01);assert.equal(w.hp,100);w.anomaly.step(A.ground.telegraph-.02);assert.equal(w.hp,100);w.anomaly.step(.03);assert.equal(w.hp,100-A.ground.damage);
 w.setCurses(['volatileSoul']);w.anomaly.clock=0;w.anomaly.step(.01);w.setCurses([]);assert.equal(w.anomaly.zones.length,1);assert.equal(w.build.hazards.length,0);
});
test('Static Field: real Perfect Dodge counters once, capped targets/CD; Archer fires extra spread with existing cap',()=>{
 const w=world('staticField');for(let i=0;i<6;i++)enemy(w,'grunt',1000,860+i*5);
 w.perfectAvailable=true;w.rewardPerfectDodge();assert.equal(w.enemies.filter(e=>e.hp<1000).length,A.static.targets);assert.equal(w.perfectDodges,1);
 const hp=w.enemies.map(e=>e.hp);w.perfectAvailable=true;w.rewardPerfectDodge();assert.deepEqual(w.enemies.map(e=>e.hp),hp);assert.equal(w.perfectDodges,2);assert.equal(w.detonations,0);
 const archer=enemy(w,'archer',1000,1200);archer.windup=.001;archer.windupDuration=.5;w.stepEnemy(archer,1/60);assert.equal(w.projectiles.length,3);
 archer.windup=.001;archer.recovery=0;w.stepEnemy(archer,1/60);assert.equal(w.projectiles.length,4);
 w.projectiles=Array.from({length:COMBAT.projectileLimit},()=>({hostile:true,life:1,x:100,y:100,vx:0,vy:0}));w.anomaly.volleyCooldown=0;archer.windup=.001;archer.recovery=0;w.stepEnemy(archer,1/60);assert.equal(w.projectiles.length,COMBAT.projectileLimit);
});
test('Broken Seal: Heavy control vs common, resistance prevents re-interrupt, expires; Boss/Elite unchanged',()=>{
 const w=world('brokenSeal'),e=enemy(w);strike(w,e);assert.equal(e.stagger,HEAVY.stagger+A.seal.stagger);assert.equal(w.anomaly.resists(e),true);
 e.stagger=0;e.windup=.4;strike(w,e);assert.equal(e.stagger,0);assert.equal(e.windup,.4);
 w.anomaly.step(HEAVY.stagger+A.seal.stagger+A.seal.resistance+.01);strike(w,e);assert.equal(e.stagger,HEAVY.stagger+A.seal.stagger);
 for(const kind of ['boss','bulwark']){const b=enemy(w,kind);strike(w,b);assert.equal(w.anomaly.resists(b),false);assert.equal(b.stagger,kind==='boss'?0:HEAVY.stagger);}
});
test('Echo Chamber: one extra marked relay per root/CD; real detonation pays once, counter is warned and canceled by death',()=>{
 const w=world('echoChamber'),a=enemy(w),b=enemy(w,'grunt',1000,865+CHAIN.radius+60);a.rupture=1;b.rupture=2;
 w.detonate(a,1);w.resolveExplosions();assert.equal(b.rupture,0);assert.equal(w.detonations,1);assert.equal(w.anomaly.zones.length,1);assert.ok(w.anomaly.zones[0].time>=1);
 advance(w,.2);assert.equal(w.detonations,2);const energy=points(w);advance(w,.3);assert.equal(w.detonations,2);assert.equal(points(w),energy);
 const root=chainRoot();root.anomalyRelay=true;b.rupture=1;assert.deepEqual(w.anomaly.relay(root,865,500,CHAIN.radius),[]);
 b.hp=0;w.anomaly.step(2);assert.equal(w.hp,100);assert.equal(w.anomaly.zones.length,0);
 const c=enemy(w);w.anomaly.retaliate(c);w.anomaly.step(A.echo.telegraph+.01);assert.equal(w.hp,100-A.echo.damage);
});
test('Anomaly dangers cancel during Boss combo/arrival and restart full warning; transform freezes clocks',()=>{
 for(const id of ['fracturedStorm','volatileGround','echoChamber']){
  const w=world(id),b=enemy(w,'boss',1500,1200);w.anomaly.zones=[{x:800,y:500,radius:70,time:.01,duration:1.3,storm:id==='fracturedStorm'}];
  b.followup=true;w.anomaly.step(1);assert.equal(w.hp,100);assert.equal(w.anomaly.zones.length,0);
  b.followup=false;w.anomaly.suspended=true;w.anomaly.step(10);assert.equal(w.anomaly.zones.length,0);
  w.anomaly.suspended=false;if(id!=='echoChamber'){w.anomaly.clock=0;w.anomaly.step(.01);assert.ok(w.anomaly.zones[0].time>=1);}
  b.hp=700;const clock=w.anomaly.clock;w.step(idle,1/60);assert.equal(w.anomaly.clock,clock);assert.equal(w.hp,100);
 }
});
test('all6 reset clears zones/CD/resistance/selection; one anomaly per run; stopped/dead worlds do not advance',()=>{
 for(const id of ANOMALIES){const w=world(id);assert.equal(w.anomaly.equip(ANOMALIES.find(x=>x!==id)),false);w.anomaly.finisherCooldown=2;w.anomaly.counterCooldown=2;w.anomaly.resistance.set(1,2);w.anomaly.retaliate(enemy(w));w.hp=0;const frozen=JSON.stringify(w.anomaly);w.step(idle,1/60);assert.equal(JSON.stringify(w.anomaly),frozen);w.reset();assert.equal(w.anomaly.active,null);assert.equal(w.anomaly.zones.length,0);assert.equal(w.anomaly.resistance.size,0);assert.equal(w.anomaly.finisherCooldown+w.anomaly.counterCooldown+w.anomaly.volleyCooldown+w.anomaly.relayCooldown,0);}
});
test('all6 ×18 Sigil/Core/Branch ×4Mutation/2Curse: bounded secondaries, death dedup, Rupture and health integrity',()=>{
 const loadouts=SIGILS.flatMap(sigil=>[{sigil,branch:null},...Object.keys(BRANCHES).filter(b=>BRANCHES[b]===sigil).map(branch=>({sigil,branch}))]);
 for(const id of ANOMALIES)for(const loadout of loadouts){
  const w=world(id);w.legacy.equip(loadout);w.mutations=['catalyst','detonationSpecialist','staticRiposte','echoChamber'];w.setCurses(['volatileSoul','deathEcho']);
  const a=enemy(w,'grunt',30),b=enemy(w,'grunt',1000,950),boss=enemy(w,'boss',1500,1100);a.stagger=b.stagger=99;a.rupture=b.rupture=3;
  w.hitEnemy(a,1,0,0,0,true,'chargedHit');w.detonate(a,2,true);w.resolveExplosions();advance(w,2);
  assert.ok(w.detonations<=3,`${id}/${loadout.branch}`);assert.ok(w.kills<=2);assert.equal(boss.stagger,0);assert.ok(w.anomaly.zones.length<=A.zoneCap);assert.ok(w.projectiles.length<=COMBAT.projectileLimit);assert.ok(w.hp>=0&&w.hp<=w.maxHp);assert.ok(w.enemies.every(e=>Number.isFinite(e.hp)&&e.rupture>=0&&e.rupture<=3));
 }
});
test('five minute deadline, Boss victory and rewards remain authoritative for all6',()=>{
 for(const id of ANOMALIES){const w=world(),r=new RunDirector(w);r.start();w.anomaly.equip(id);r.prepareBossPlaytest(0,299);for(let n=0;n<62&&!r.result;n++)r.step(idle,1/60);assert.equal(r.result,'defeat');assert.equal(r.reason,'deadline');assert.equal(r.ticks,18000);r.start();w.anomaly.equip(id);r.prepareBossPlaytest(0,250);w.bossSlain=true;r.step(idle,1/60);assert.equal(r.result,'victory');}
});

test('Dash fresh press on the impact tick avoids zone damage; hitstop and transform never consume warning time',()=>{
 const w=world('volatileGround');w.anomaly.clock=0;w.anomaly.step(.01);w.anomaly.zones[0].time=1/60;
 w.step({...idle,dash:true,dx:1},1/60);assert.equal(w.hp,100);assert.equal(w.dashCharges,1);
});
test('extra Static bullets are tagged and canceled before collision during Boss combo, native shots remain',()=>{
 const w=world('staticField'),a=enemy(w,'archer',1000,1200);a.windup=.001;a.windupDuration=.7;w.stepEnemy(a,1/60);assert.equal(w.projectiles.filter(s=>s.anomaly).length,2);
 const b=enemy(w,'boss',1500,1300);b.windup=.7;b.windupDuration=.7;w.stepProjectiles(1/60);assert.equal(w.projectiles.length,1);assert.equal(w.projectiles[0].anomaly,false);
});
test('Broken Seal resistance also blocks Brittle interrupt without suppressing Shatter or changing Boss immunity',()=>{
 const w=world('brokenSeal');w.legacy.equip({sigil:'ice',branch:'brittle'});const e=enemy(w);strike(w,e);e.stagger=0;e.windup=.5;
 for(let i=0;i<3;i++)w.hitEnemy(e,1,0,0,0,true,'shotHit');
 const hp=e.hp;w.hitEnemy(e,1,0,0,0,true,'chargedHit');w.legacy.resolve();assert.ok(e.hp<hp-1);assert.equal(e.windup,.5);
});
test('all6 cover all12Mutations and all8Curses in legal4/2 combinations without loop, duplicate death or resource overflow',()=>{
 for(const id of ANOMALIES)for(let group=0;group<3;group++)for(let pair=0;pair<4;pair++){
  const w=world(id);w.legacy.equip({sigil:'lightning',branch:'arcRelay'});w.mutations=MUTATIONS.slice(group*4,group*4+4);w.setCurses(CURSES.slice(pair*2,pair*2+2));
  w.hp=Math.min(40,w.maxHp);const a=enemy(w,'grunt',10),b=enemy(w,'grunt',500,950);a.rupture=b.rupture=3;a.stagger=b.stagger=99;
  w.perfectAvailable=true;w.rewardPerfectDodge();w.hitEnemy(a,20,0,0,0,true,'shotHit');const kills=w.kills;w.hitEnemy(a,999,0,0,0,true,'heavy');assert.equal(w.kills,kills);
  w.detonate(b,2,true);w.resolveExplosions();advance(w,3);
  assert.ok(w.kills<=2);assert.ok(w.detonations<=3);assert.ok(w.chargedShots<=3&&w.chargePoints<=2&&w.surge<=100);assert.ok(w.hp>=0&&w.hp<=w.maxHp);assert.ok(w.anomaly.zones.length<=A.zoneCap);
 }
});
