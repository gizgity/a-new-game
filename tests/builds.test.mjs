import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld, COMBAT } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { BUILD } from '../.test-build/config/balance.js';
import { chainRoot } from '../.test-build/BuildEffects.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false},dt=1/60;
function world(){const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];return w;}
function target(w,x=860,hp=1000){w.spawnEnemy('grunt',hp);const e=w.enemies.at(-1);Object.assign(e,{x,y:500,stagger:999,cooldown:999});return e;}
function ticks(w,n){for(let i=0;i<n;i++)w.step(idle,dt);}
function light(w,combo){w.hitstop=0;w.attack=null;w.combo=combo-1;w.comboWindow=1;w.clearInput();w.step({...idle,melee:true},dt);ticks(w,11);}
function shot(w,e,charged=false,staticBonus=0){w.hitstop=0;w.projectiles.push({x:e.x-10,y:e.y,vx:850,vy:0,hostile:false,charged,staticBonus,life:1});w.step(idle,dt);}

test('Perfect readies Phantom and Static once per cooldown; Light miss keeps Phantom, proc adds mark but no Aegis/charge/Frenzy',()=>{
 const w=world();w.mutations=['phantomEdge','staticRiposte','aegisCore','berserker'];w.perfectAvailable=true;w.rewardPerfectDodge();
 assert.equal(w.build.phantom,3);assert.equal(w.build.staticCharge,4);assert.equal(w.chargedShots,1);
 light(w,1);assert.ok(w.build.phantom>0);assert.equal(w.build.phantoms.length,0);
 const e=target(w);light(w,1);assert.equal(w.build.phantom,0);assert.equal(w.build.phantoms.length,1);
 const charge=w.chargePoints+w.chargedShots*3,damage=w.barrier.aegisDamage,stage=w.build.comboStage,hp=e.hp;
 w.hitstop=0;ticks(w,9);assert.equal(e.hp,hp-18);assert.equal(e.rupture,2);
 assert.equal(w.chargePoints+w.chargedShots*3,charge);assert.equal(w.barrier.aegisDamage,damage);assert.equal(w.build.comboStage,stage);
 w.perfectAvailable=true;w.rewardPerfectDodge();assert.equal(w.build.phantom,0,'cooldown blocks refresh');
});

test('Static consumes only when Charged actually fires, including a miss, and adds exactly40 direct damage',()=>{
 const w=world();w.mutations=['staticRiposte'];w.build.staticCharge=4;w.chargedShots=2;
 w.fire(800,500,0,false,false);assert.equal(w.build.staticCharge,4);
 w.projectiles=[];w.fire(800,500,0,false,true);assert.equal(w.build.staticCharge,0);assert.equal(w.projectiles[0].staticBonus,40);
 const e=target(w,850);w.step(idle,dt);ticks(w,3);assert.equal(e.hp,1000-84-40-24);
 const miss=world();miss.mutations=['staticRiposte'];miss.build.staticCharge=4;miss.chargedShots=1;miss.step({...idle,charged:true},dt);
 assert.equal(miss.chargedShots,0);assert.equal(miss.build.staticCharge,0);
});

test('Frenzy requires three connecting combo hits, buffs only future melee, breaks on HP damage but not Barrier',()=>{
 const w=world();w.mutations=['berserker'];const e=target(w);
 for(const n of [1,2,3]){e.x=860;e.y=500;light(w,n);}
 assert.ok(w.build.frenzy>0);w.beginAttack(true);assert.equal(w.attack.damage,140*1.25);
 const hp=e.hp;shot(w,e);assert.equal(e.hp,hp-20-36,'Basic/Detonate not amplified by Frenzy');
 w.barrier.gain(30,false);w.hurt(10,0);assert.ok(w.build.frenzy>0);
 w.invulnerable=0;w.barrier.value=0;w.hurt(1,0);assert.equal(w.build.frenzy,0);
 const miss=world();miss.mutations=['berserker'];target(miss);light(miss,1);miss.enemies=[];light(miss,2);assert.equal(miss.build.comboStage,0);
});

test('Catalyst seeds two nearest living unmarked targets/root; same root cannot consume them, independent trigger can',()=>{
 const w=world();w.mutations=['catalyst'];const a=target(w,850),b=target(w,875),c=target(w,900),d=target(w,925);a.rupture=1;
 const root=chainRoot();w.detonate(a,1,false,undefined,root);w.resolveExplosions();
 assert.equal(w.detonations,1);assert.equal(b.rupture,1);assert.equal(c.rupture,1);assert.equal(d.rupture,0);assert.equal(root.seeded.size,2);
 w.chainSeen.clear();w.detonate(b,1,false,{x:850,y:500,damage:12,radius:105,hostile:false,root});assert.equal(b.rupture,1);
 w.detonate(b,1);assert.equal(b.rupture,0);
});

test('Catalyst excludes pending marked relays and dead neighbours, keeps two-seed budget across delayed relays',()=>{
 const w=world();w.mutations=['catalyst'];const a=target(w,850),b=target(w,940),dead=target(w,860,1),c=target(w,960),d=target(w,970);a.rupture=b.rupture=1;
 shot(w,a);assert.equal(dead.hp,0);assert.equal(b.rupture,0);assert.equal(w.explosions.find(x=>x.enemyId===b.id).root.seeded.size,0);
 ticks(w,50);assert.equal(w.detonations,2);assert.equal(c.rupture+d.rupture,2);
});

test('Specialist buffs only primary Charged blast, marks surviving targets Fracture and next Heavy consumes flat20 once',()=>{
 const w=world();w.mutations=['detonationSpecialist'];const a=target(w,850),b=target(w,975);a.rupture=1;
 shot(w,a,true);assert.equal(a.hp,1000-84-60);assert.equal(b.hp,940);assert.ok(b.fracture>0);
 w.hitEnemy(b,20,0,0,0,false,'shotHit');assert.ok(b.fracture>0);
 w.hitEnemy(b,100,0,0,0,true,'heavy');assert.equal(b.hp,800);assert.equal(b.fracture,0);
 w.chainSeen.clear();w.lastChain=0;b.rupture=1;w.detonate(b,1);assert.equal(w.explosions.at(-1).radius,105);assert.equal(w.explosions.at(-1).damage,12);
});

test('Blood Pact heals direct melee under cooldown/shared budget, no Light cost, Heavy miss and dash-cancel cost HP through Barrier',()=>{
 const w=world();w.curse='bloodPact';w.hp=50;w.barrier.gain(30,false);const e=target(w);light(w,1);assert.equal(w.hp,52);assert.equal(w.attack.damage,18*1.3);
 w.hitEnemy(e,20,0,0,0,false,'light');assert.equal(w.hp,52);
 for(let i=0;i<5;i++){w.build.step(1.5);w.hitEnemy(e,1,0,0,0,false,'heavy');}assert.equal(w.hp,56);
 w.enemies=[];w.attack=null;w.clearInput();w.hitstop=0;w.step({...idle,heavy:true},dt);ticks(w,15);assert.equal(w.hp,52);assert.equal(w.barrier.value,30);
 w.attack=null;w.clearInput();w.hitstop=0;w.heavyCharges=1;w.step({...idle,heavy:true},dt);w.step({...idle,dash:true},dt);assert.equal(w.hp,48);
 w.hp=2;w.payBloodMiss();assert.equal(w.hp,1);
 const full=world();full.curse='bloodPact';const t=target(full);full.hitEnemy(t,1,0,0,0,false,'light');assert.equal(full.build.healed,0);assert.equal(full.build.bloodCooldown,0);
});

test('Ghost Step refunds one second on Perfect and has enemy damage risk only at zero Dash, without old maxHP/recharge passives',()=>{
 const w=world();w.curse='ghostStep';w.dashCharges=1;w.dashRecharge=2;w.perfectAvailable=true;w.rewardPerfectDodge();
 assert.equal(w.dashCharges,2);assert.equal(w.dashRecharge,0);assert.equal(w.maxHp,100);assert.equal(w.rechargeDuration,2.8);
 w.dashCharges=0;w.hurt(10,0);assert.equal(w.hp,88);
 w.invulnerable=0;w.hurt(10,0,false);assert.equal(w.hp,78);
});

test('Volatile Soul schedules one warned hazard/root, freezes during hitstop, can be escaped, never rewards Perfect',()=>{
 const w=world();w.curse='volatileSoul';const a=target(w,800);a.rupture=1;w.detonate(a,1);w.resolveExplosions();
 assert.equal(w.build.hazards.length,1);assert.equal(w.build.hazards[0].time,.8);assert.equal(w.hp,100);
 const timer=w.build.hazards[0].time;w.hitstop=1;ticks(w,20);assert.equal(w.build.hazards[0].time,timer);
 w.hitstop=0;w.enemies=[];ticks(w,49);assert.equal(w.hp,92);
 const avoid=world();avoid.curse='volatileSoul';avoid.build.hazards.push({x:800,y:500,time:.01});avoid.player.y=650;avoid.step(idle,dt);assert.equal(avoid.hp,100);
 const dash=world();dash.curse='volatileSoul';dash.build.hazards.push({x:800,y:500,time:.01});dash.dashTime=.1;dash.perfectAvailable=true;dash.step(idle,dt);assert.equal(dash.hp,100);assert.equal(dash.perfectDodges,0);
});

test('Death Echo max six/root, grants no fake Detonate, surviving common gets only temporary movement haste, Boss immune',()=>{
 const w=world();w.curse='deathEcho';for(let i=0;i<20;i++)target(w,850+i,1);
 const root=chainRoot();w.hitEnemy(w.enemies[0],100,0,0,0,true,'heavy',root);w.resolveExplosions();
 assert.equal(w.kills,20);assert.equal(root.echoes,6);assert.equal(w.detonations,0);assert.ok(w.lastChain<=12);
 const s=world();s.curse='deathEcho';const weak=target(s,850,1),strong=target(s,880);s.spawnEnemy('boss',1000);const boss=s.enemies.at(-1);boss.x=890;boss.y=500;boss.cooldown=999;
 s.hitEnemy(weak,100,0,0,0,true,'heavy');s.resolveExplosions();assert.equal(strong.echoHaste,3);assert.equal(boss.echoHaste,0);
 s.enemies.forEach(e=>e.stagger=999);s.hitstop=0;ticks(s,181);assert.equal(strong.echoHaste,0);
});

test('changing Curse removes hazards/haste/pending echoes/queued Volatile boost; keeping Curse preserves clocks and heal budget',()=>{
 const w=world(),run=new RunDirector(w);w.curse='volatileSoul';const e=target(w);e.rupture=1;w.detonate(e,1);w.build.hazards.push({x:800,y:500,time:.8});
 w.curse='bloodPact';assert.equal(w.build.hazards.length,0);assert.ok(Math.abs(w.explosions[0].damage-12)<1e-9);w.hp=50;w.hitEnemy(e,1,0,0,0,false,'light');
 const budget=w.build.healed,cd=w.build.bloodCooldown;run.draftKind='curse';run.draft=[{id:'bloodPact',role:'curseChoice'}];run.choose(0);assert.equal(w.build.healed,budget);assert.equal(w.build.bloodCooldown,cd);
 w.curse='deathEcho';w.hitEnemy(e,10000,0,0,0,true,'heavy');assert.ok(w.explosions.some(x=>x.echo));e.echoHaste=3;
 w.curse='ghostStep';assert.ok(w.explosions.every(x=>!x.echo));assert.equal(e.echoHaste,0);
 w.reset();assert.equal(w.build.phantoms.length,0);assert.equal(w.build.frenzy,0);assert.equal(w.build.healed,0);assert.equal(w.explosions.length,0);
});

test('Catalyst root exclusion and seed cap survive overflow over several simulation ticks',()=>{
 const w=world();w.mutations=['catalyst'];const root=chainRoot();
 for(let i=0;i<30;i++){const e=target(w,850+i*.1,10000);e.rupture=1;w.detonate(e,1,false,undefined,root);}
 const b=target(w,870,10000),c=target(w,875,10000);w.resolveExplosions();assert.equal(w.detonations,12);assert.equal(root.seeded.size,2);
 for(let i=0;i<120;i++){w.step(idle,dt);assert.ok(w.lastChain<=COMBAT.chainLimit);assert.ok(w.impacts.length<=24);}
 assert.equal(w.detonations,30);assert.equal(b.rupture,1);assert.equal(c.rupture,1);assert.equal(root.seeded.size,2);
});

test('all build clocks and deferred effects freeze in hitstop/draft and reset removes them',()=>{
 const w=world(),run=new RunDirector(w);w.build.phantom=3;w.build.staticCharge=4;w.build.frenzy=4;w.build.healed=2;w.build.healWindow=10;
 w.build.phantoms.push({x:800,y:500,angle:0,range:100,arc:1.7,delay:.12,root:chainRoot()});w.build.hazards.push({x:800,y:500,time:.8});
 const before=JSON.stringify(w.build);w.hitstop=.5;ticks(w,10);assert.equal(JSON.stringify(w.build),before);
 run.draft=[{id:'catalyst',role:'adaptive'}];run.step(idle,1);assert.equal(JSON.stringify(w.build),before);
 run.start();assert.equal(w.build.phantom,0);assert.equal(w.build.staticCharge,0);assert.equal(w.build.phantoms.length,0);assert.equal(w.build.hazards.length,0);
});

test('Blood Pact sustain is capped at6HP/10s for both single-target hits and crowded cleaves',()=>{
 for(const count of [1,24]){
  const w=world();w.curse='bloodPact';w.hp=40;
  const enemies=Array.from({length:count},(_,i)=>target(w,850+i*.1,10000));
  for(let frame=0;frame<599;frame++){
   w.build.step(dt);
   for(const e of enemies)w.hitEnemy(e,1,0,0,0,false,'light');
  }
  assert.equal(w.hp,46);assert.equal(w.build.bloodHealed,6);assert.equal(w.build.healed,6);
  w.build.step(.1);w.hitEnemy(enemies[0],1,0,0,0,false,'light');assert.equal(w.hp,48,'new window starts with a new real hit');
 }
});

test('Blood Pact cannot bypass its cap by switching Curse; cooldown is2s and full HP costs no budget',()=>{
 const w=world();const e=target(w);w.curse='bloodPact';w.hp=50;w.hitEnemy(e,1,0,0,0,false,'light');
 w.build.step(1.5);w.hitEnemy(e,1,0,0,0,false,'light');assert.equal(w.hp,52);
 w.build.step(.5);w.hitEnemy(e,1,0,0,0,false,'light');assert.equal(w.hp,54);
 w.curse='ghostStep';w.curse='bloodPact';w.hitEnemy(e,1,0,0,0,false,'light');assert.equal(w.hp,56);
 w.curse='ghostStep';w.curse='bloodPact';w.hitEnemy(e,1,0,0,0,false,'light');assert.equal(w.hp,56);
 w.reset();assert.equal(w.build.bloodHealed,0);
});
