import { DRAFT_MILESTONES } from '../.test-build/config/balance.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld, COMBAT } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { BUILD, BARRIER } from '../.test-build/config/balance.js';
import { chainRoot } from '../.test-build/BuildEffects.js';
import { CURSES } from '../.test-build/builds.js';
import { buildDraft, DraftRandom } from '../.test-build/Draft.js';
import { draftSignals } from '../.test-build/DraftSignals.js';
import { validateProfile, defaultProfile } from '../.test-build/progression.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false},dt=1/60;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
function world(ids=[]){const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];w.setCurses(ids);return w;}
function target(w,hp=10000,x=850){w.spawnEnemy('grunt',hp);const e=w.enemies.at(-1);Object.assign(e,{x,y:500,cooldown:999,stagger:999});return e;}
function sample(ids,pool=CURSES){return buildDraft({kind:'curse',owned:[],curses:ids,pool,signals:draftSignals(),maxHp:100,previousOffers:[],choices:[]},new DraftRandom(42));}
test('A/B: actual milestones offer 3 then Keep+2 unowned; add/Keep preserve clocks, old effects and frozen timer',()=>{
 for(const keep of [false,true]){
  const w=world(),r=new RunDirector(w);r.start();w.enemies=[];
  for(const kills of [25,80,160,220,300]){
   r.ticks=DRAFT_MILESTONES.find(m=>m.kills===kills).minSeconds*60-1;w.kills=kills;r.step(idle,dt);assert.ok(r.draft.length);
   if(kills===300){const first=w.curses[0],clock=r.ticks;w.build.hazardCooldown=1.2;w.build.healed=4;w.build.healWindow=8;
    assert.equal(r.draft[0].action,'keep');assert.equal(r.draft.length,3);assert.ok(r.draft.slice(1).every(o=>!w.hasCurse(o.id)));
    r.step(idle,dt);assert.equal(r.ticks,clock);r.choose(keep?0:1);
    assert.equal(w.curses[0],first);assert.equal(w.curses.length,keep?1:2);assert.equal(w.build.hazardCooldown,1.2);assert.equal(w.build.healed,4);
   }else r.choose(0);
  }
 }
 assert.equal(sample([]).options.length,3);assert.equal(sample(['ironOath'],['ironOath']).options.length,1);
});
test('slot capacity, duplicates, immutable ownership and explicit full-slot replacement preserve remaining effect',()=>{
 const w=world(['volatileSoul','deathEcho']);assert.equal(w.addCurse('volatileSoul'),false);assert.equal(w.addCurse('bloodPact'),false);assert.throws(()=>w.curses.push('bloodPact'));
 w.build.hazardCooldown=1;w.build.hazards.push({x:800,y:500,time:.5});const e=target(w);e.echoHaste=3;
 const offers=sample(w.curses).options;assert.equal(offers[0].action,'keep');assert.equal(offers.length,5);assert.deepEqual(offers.slice(1).map(o=>o.replaceSlot),[0,1,0,1]);
 const r=new RunDirector(w);r.draftKind='curse';r.draft=[{id:'bloodPact',role:'wildcard'}];assert.equal(r.choose(0),false);
 r.draft=[{id:'bloodPact',role:'wildcard',replaceSlot:1}];assert.equal(r.choose(0),true);assert.deepEqual(w.curses,['volatileSoul','bloodPact']);assert.equal(w.build.hazards.length,1);assert.equal(w.build.hazardCooldown,1);assert.equal(e.echoHaste,0);
 w.setCurses(['bloodPact']);assert.equal(w.build.hazards.length,0);
});
for(const reverse of [false,true]){
 const pair=(a,b)=>reverse?[b,a]:[a,b];
 test(`C: Oath+Blood shared caps/cost and sustain risks, reversed=${reverse}`,()=>{
  const w=world(pair('ironOath','bloodPact'));w.mutations=['aegisCore','bloodReclaimer'];near(w.outgoingDamageMultiplier,.75*.7*.8);near(w.rechargeDuration,COMBAT.dashRecharge*BARRIER.oathDashMultiplier);
  w.barrier.gain(100,true);assert.equal(w.barrier.value,30);w.hp=40;const e=target(w);w.hitEnemy(e,10,0,0,0,false,'light');assert.equal(w.hp,40);
  w.barrier.value=0;for(let i=0;i<5;i++){w.hitEnemy(e,1,0,0,0,false,'light');w.build.step(2);}assert.equal(w.hp,48);
  w.hp+=w.build.heal(w.hp,w.maxHp,'reclaimerCooldown',3,2);assert.equal(w.build.healed<=8,true);
  w.build.bloodCooldown=1;w.setCurses(['ironOath']);w.addCurse('bloodPact');assert.equal(w.build.bloodCooldown,1);
  w.barrier.value=30;w.hp=100;for(let i=0;i<12;i++){w.invulnerable=0;w.hurt(20,0);}assert.ok(w.hp<=0,'standing still is mortal');
 });
 test(`D: Volatile+Echo execute both, bounded kills/queue/hazard/haste, reversed=${reverse}`,()=>{
  const w=world(pair('volatileSoul','deathEcho'));w.mutations=['catalyst','echoChamber'];const root=chainRoot();
  for(let i=0;i<20;i++){const e=target(w,1,840+i);e.rupture=1;}
  const survivor=target(w,10000,900);const first=w.enemies[0];w.detonate(first,1,false,undefined,root);near(w.explosions[0].damage,12*BUILD.volatileMultiplier);
  for(let i=0;i<200;i++){w.hitstop=0;w.step(idle,dt);assert.ok(w.lastChain<=12);assert.ok(w.build.hazards.length<=BUILD.hazardCap);assert.ok(w.impacts.length<=24);}
  assert.equal(w.kills,20);assert.ok(root.echoes<=6);assert.ok(root.seeded.size<=2);assert.equal(w.explosions.length,0);assert.ok(survivor.hp<10000);
  const hazard=world(pair('volatileSoul','deathEcho'));hazard.build.hazards.push({x:800,y:500,time:0});hazard.step(idle,dt);assert.equal(hazard.hp,92);
  const haste=world(pair('deathEcho','huntedVessel')),plain=world();const a=target(haste,10000,1000),b=target(plain,10000,1000);a.stagger=b.stagger=0;a.echoHaste=3;haste.stepEnemy(a,dt);plain.stepEnemy(b,dt);near(1000-a.x,(1000-b.x)*BUILD.hasteMultiplier);
 });
 test(`E: Glass+Ghost HP, direct projectile and Perfect/zeroDash risk, reversed=${reverse}`,()=>{
  const w=world(pair('glassSoul','ghostStep'));assert.equal(w.maxHp,90);assert.equal(w.hp,90);assert.equal(w.rechargeDuration,COMBAT.dashRecharge);
  w.fire(800,500,0,false);near(w.projectiles[0].damage,20*BUILD.glassMultiplier);w.dashCharges=0;w.dashRecharge=.5;w.perfectAvailable=true;w.rewardPerfectDodge();near(w.dashRecharge,1.5);
  w.invulnerable=0;w.dashTime=0;w.hurt(10,0);near(w.hp,78);w.hp+=w.build.heal(w.hp,w.maxHp,'reclaimerCooldown',100,2);assert.ok(w.hp<=90);
 });
 test(`Hunted+Parasitic both trigger with shared heal/capped kill reward, reversed=${reverse}`,()=>{
  const w=world(pair('huntedVessel','parasiticMark'));w.hp=50;const a=target(w,1);a.rupture=1;w.detonate(a,1);w.resolveExplosions();assert.equal(w.hp,53);assert.equal(w.barrier.value,2);assert.equal(w.build.huntedCooldown,1);assert.equal(w.build.parasiticCooldown,2);
  const r=new RunDirector(w);r.draftKind='curse';r.draft=sample(w.curses).options;r.choose(0);assert.equal(w.hp,58);
 });
}
test('F: reset clears both/effects/clocks; old and untrusted saves retain meta/settings and never restore curses; four mutation cap',()=>{
 const old=defaultProfile();old.totals.kills=99;old.settings.locale='en';delete old.drafts;old.curses=['glassSoul','ghostStep'];const profile=validateProfile(old);assert.equal(profile.totals.kills,99);assert.equal(profile.settings.locale,'en');assert.ok(profile.unlocks.includes('firstBlood'));assert.equal('curses' in profile,false);
 const w=world(['volatileSoul','glassSoul']),r=new RunDirector(w);w.build.hazards.push({x:1,y:1,time:1});w.build.healed=8;w.build.huntedCooldown=1;r.start();assert.deepEqual(w.curses,[]);assert.equal(w.maxHp,100);assert.equal(w.build.hazards.length,0);assert.equal(w.build.healed,0);assert.equal(w.build.huntedCooldown,0);assert.equal(r.ticks,0);
 w.mutations=['catalyst','aegisCore','berserker','echoChamber'];r.draftKind='mutation';r.draft=[{id:'soulAnchor',role:'wildcard'}];assert.equal(r.choose(0),false);assert.equal(w.mutations.length,4);
});

test('adding slot2 retains queued Glass/Volatile/Blood effects and clocks; removing one leaves the other intact',()=>{
 const w=world(['volatileSoul']);const e=target(w);e.rupture=1;w.detonate(e,1);const damage=w.explosions[0].damage;w.build.hazards.push({x:1,y:1,time:.8});w.build.hazardCooldown=2;
 w.addCurse('glassSoul');w.fire(800,500,0,false);const shot=w.projectiles.at(-1);near(shot.damage,26);assert.equal(w.explosions[0].damage,damage);assert.equal(w.build.hazards.length,1);assert.equal(w.build.hazardCooldown,2);
 w.setCurses(['glassSoul','bloodPact']);near(shot.damage,26);near(w.explosions[0].damage,damage/BUILD.volatileMultiplier);assert.equal(w.build.hazards.length,0);
 w.beginAttack(true);assert.equal(w.attack.bloodPact,true);w.setCurses(['bloodPact','ghostStep']);assert.equal(w.attack.bloodPact,true);near(shot.damage,20);assert.equal(w.maxHp,100);assert.equal(w.hp,90);
});
