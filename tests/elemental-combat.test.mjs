import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld, COMBAT } from '../.test-build/combat.js';
import { chainRoot, admitProc, legacyRoot } from '../.test-build/BuildEffects.js';
import { LEGACY as L, SIGILS, BRANCHES } from '../.test-build/config/legacy.js';
import { RunDirector } from '../.test-build/run.js';
const idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
function setup(sigil,branch=null) {
 const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];w.legacy.equip({sigil,branch});return w;
}
function enemy(w,kind='grunt',hp=500,x=865,y=500) {
 w.spawnEnemy(kind,hp);const e=w.enemies.at(-1);Object.assign(e,{x,y,stagger:99,cooldown:99});return e;
}
function primary(w,e,kind='basic',damage=1,root=chainRoot()) {
 w.hitEnemy(e,damage,0,0,0,true,{light:'light',heavy:'heavy',basic:'shotHit',charged:'chargedHit'}[kind],root);
 return root;
}
function advance(w,seconds) { for(let i=0;i<Math.ceil(seconds*60);i++){w.hitstop=0;w.step(idle,1/60);} }
function legacyHit(w,e,damage,root=chainRoot(),depth=1) {
 legacyRoot(root);w.hitEnemy(e,damage,0,0,0,false,'legacy',root,true,0,{root,depth,origin:'legacySecondary'});return root;
}

test('Fire Charged primary applies one Ignite; secondary/Detonate cannot reapply or grant ammo',()=>{
 const w=setup('fire'),e=enemy(w);primary(w,e,'charged');const before=e.hp;
 assert.ok(w.legacy.targets.get(e.id).ignite);advance(w,.51);assert.equal(before-e.hp,L.fire.damage);
 const points=w.chargePoints,marks=e.rupture;legacyHit(w,e,1);
 assert.equal(w.chargePoints,points);assert.equal(e.rupture,marks);assert.equal(w.detonations,0);
 const tick=w.legacy.targets.get(e.id).ignite.tick;primary(w,e,'charged');assert.equal(w.legacy.targets.get(e.id).ignite.tick,tick);
});
test('Wildfire direct/DoT kills spread exactly one generation; terminal kills retain on-kill synergy',()=>{
 for(const dot of [false,true]){
 const w=setup('fire','wildfire'),a=enemy(w),b=enemy(w,'grunt',3,930);primary(w,a,'charged');
 if(dot){a.hp=1;advance(w,.51);}else primary(w,a,'basic',1000);
 w.legacy.resolve();assert.equal(w.legacy.targets.get(b.id).ignite.generation,1);
 advance(w,1.1);assert.equal(b.hp,0);
 const c=enemy(w,'grunt',500,940);w.legacy.resolve();assert.equal(w.legacy.targets.get(c.id)?.ignite,undefined);
 }
});
test('Furnace consumes one Ignite and AoE cannot consume Rupture or recurse',()=>{
 const w=setup('fire','furnace'),a=enemy(w),b=enemy(w,'grunt',500,900);primary(w,a,'charged');a.rupture=2;b.rupture=2;
 primary(w,a,'heavy');const hp=b.hp;w.legacy.resolve();assert.equal(hp-b.hp,L.fire.furnaceDamage);
 assert.equal(w.legacy.targets.get(a.id).ignite,undefined);assert.equal(a.rupture,2);assert.equal(b.rupture,2);assert.equal(w.detonations,0);
});
test('Water Soaked first Heavy does not Undertow; later primary has per-target cooldown; Boss immune',()=>{
 const w=setup('water','undertow'),a=enemy(w),boss=enemy(w,'boss',1500,950);
 const x=a.x;primary(w,a,'heavy');assert.equal(a.x,x);assert.equal(w.legacy.slowMultiplier(a),L.water.slow);
 primary(w,a);assert.ok(a.x>x);const moved=a.x;primary(w,a);assert.equal(a.x,moved);
 primary(w,boss,'heavy');const bx=boss.x;primary(w,boss);assert.equal(boss.x,bx);assert.equal(w.legacy.slowMultiplier(boss),1);
});
test('Flow State refunds only a missing Heavy charge, never banks or overflows; PD mutation hooks remain independent',()=>{
 const w=setup('water','flowState');w.legacy.perfect();assert.equal(w.heavyRecharge,0);
 w.heavyCharges=0;w.heavyRecharge=7;w.legacy.perfect();assert.equal(w.heavyCharges,1);assert.equal(w.heavyRecharge,0);
 w.legacy.perfect();assert.equal(w.heavyCharges,1);
});
test('Lightning Basic hit consumes Legacy charge, Charged retains it and Static Riposte remains separate',()=>{
 const w=setup('lightning'),a=enemy(w),b=enemy(w,'grunt',500,950);w.mutations=['staticRiposte'];w.build.staticCharge=4;w.legacy.perfect();
 primary(w,a,'charged');assert.ok(w.legacy.charge>0);primary(w,a,'basic');assert.equal(w.legacy.charge,0);assert.equal(w.build.staticCharge,4);
 const hp=b.hp;w.legacy.resolve();advance(w,.2);assert.equal(hp-b.hp,L.lightning.damage);
});
test('Arc Relay adds exactly one jump and never revisits a target',()=>{
 for(const [branch,jumps] of [[null,L.lightning.jumps],['arcRelay',L.lightning.jumps+1]]){
  const w=setup('lightning',branch),targets=Array.from({length:5},(_,i)=>enemy(w,'grunt',500,865+i*65));
  w.legacy.perfect();primary(w,targets[0]);w.legacy.resolve();advance(w,.5);
  assert.equal(targets.filter(e=>e.hp<500).length,jumps+1);
  assert.equal(targets[0].hp,499-L.lightning.damage);
 }
});
test('Overclock snapshots Light recovery/Basic interval with a hard cap; Heavy and Charged cadence stay fixed',()=>{
 const w=setup('lightning','overclock'),a=enemy(w);w.legacy.perfect();primary(w,a);assert.ok(w.legacy.haste>0);
 assert.ok(w.legacy.attackSpeed<=1+L.attackSpeedCap);w.beginAttack(false);assert.equal(w.attack.windup,4/60);assert.ok(w.attack.duration<.24);
 w.beginAttack(true);assert.equal(w.attack.windup,.24);assert.equal(w.attack.duration,.72);
 w.attack=null;w.shotCooldown=0;w.hitstop=0;w.step({...idle,shoot:true},1/60);assert.ok(w.shotCooldown>=L.minShotInterval);
});
test('Ice stacks per target, other targets/misses preserve window; Shatter requires pre-existing readiness',()=>{
 const w=setup('ice'),a=enemy(w),b=enemy(w,'grunt',500,1000);
 primary(w,a);primary(w,b);assert.equal(w.legacy.targets.get(a.id).frost,1);
 primary(w,a);primary(w,a,'heavy');assert.equal(w.legacy.targets.get(a.id).frost,L.ice.threshold);
 const hp=a.hp;primary(w,a,'charged');w.legacy.resolve();assert.equal(hp-a.hp,1+L.ice.damage);assert.equal(w.legacy.targets.get(a.id).frost,0);
 advance(w,L.ice.window+.1);assert.equal(w.legacy.targets.get(b.id).frost,0);
});
test('Brittle bypasses guard, interrupts once with Elite immunity and does not overwrite fracture; Boss no CC',()=>{
 for(const kind of ['bulwark','boss']){
 const w=setup('ice','brittle'),a=enemy(w,kind,1500);
 for(let i=0;i<L.ice.threshold;i++)primary(w,a);
 a.windup=.5;a.fracture=2;primary(w,a,'heavy');w.legacy.resolve();
 if(kind==='boss'){assert.equal(a.windup,.5);assert.equal(w.legacy.armorBroken(a),false);}else {assert.equal(a.windup,0);assert.ok(w.legacy.targets.get(a.id).interruptCD>=L.eliteImmunity);assert.equal(w.legacy.armorBroken(a),true);}
 assert.equal(a.fracture,0); // Existing primary fracture consumes exactly once; Shatter does not recreate it.
 }
});
test('Crystal Echo targets another enemy, stays secondary and never adds Frostbite/ammo',()=>{
 const w=setup('ice','crystalEcho'),a=enemy(w),b=enemy(w,'grunt',500,1000);
 for(let i=0;i<L.ice.threshold;i++)primary(w,a);primary(w,a,'heavy');w.legacy.resolve();const hp=b.hp;
 advance(w,.5);assert.equal(hp-b.hp,L.ice.echoDamage);assert.equal(w.legacy.targets.get(b.id)?.frost??0,0);assert.equal(w.chargePoints,0);
});
test('Shadow lethal melee remains successful Ambush; Nightfall gets event but never corpse/retarget/duplicate kill',()=>{
 const w=setup('shadow','nightfall'),a=enemy(w,'grunt',1),b=enemy(w,'grunt',500,950);w.legacy.perfect();assert.equal(w.legacy.mark.id,a.id);
 primary(w,a,'light',10);assert.equal(w.legacy.ambushes,1);assert.equal(w.legacy.nightfalls,1);assert.equal(w.legacy.mark,null);assert.equal(w.kills,1);
 w.legacy.resolve();advance(w,.3);assert.equal(w.kills,1);assert.equal(b.hp,500);primary(w,a,'light',10);assert.equal(w.legacy.ambushes,1);
});
test('Shadow nonlethal Ambush/Nightfall stay on original target and enforce range/CD',()=>{
 const w=setup('shadow','nightfall'),a=enemy(w);w.legacy.perfect();primary(w,a,'light');w.legacy.resolve();const hp=a.hp;
 a.x=1500;advance(w,.3);assert.equal(a.hp,hp);assert.equal(w.legacy.nightfalls,1);
});
test('Veilstep boosts walk only; Dash distance, recharge, duration and i-frames unchanged',()=>{
 const w=setup('shadow','veilstep');w.legacy.perfect();assert.ok(w.legacy.movementSpeed>1);
 const before=w.player.x;w.step({...idle,dx:1,dash:true},1/60);assert.ok(Math.abs(w.player.x-before-COMBAT.dashSpeed/60)<1e-6);assert.equal(w.rechargeDuration,COMBAT.dashRecharge);
});
test('Wind Light miss fires slash only on resolve; cancel before windup keeps Momentum; no Dash/pause farm',()=>{
 const w=setup('wind'),a=enemy(w,'grunt',500,1050);w.legacy.momentum=100;
 w.step({...idle,melee:true},1/60);assert.equal(w.legacy.momentum,100);w.step({...idle,dash:true},1/60);assert.equal(w.legacy.momentum,100);assert.equal(w.legacy.projectiles.length,0);
 w.dashTime=0;w.attack=null;w.clearInput();w.hitstop=0;w.step({...idle,melee:true},1/60);advance(w,.1);assert.equal(w.legacy.momentum,0);assert.ok(w.legacy.projectiles.length>0);
 advance(w,.5);assert.ok(a.hp<500);assert.equal(a.rupture,0);
 const r=new RunDirector(w);r.draft=[{id:'catalyst',role:'wildcard'}];w.legacy.momentum=50;const snap=JSON.stringify(w.legacy);r.step({...idle,dx:1},1);assert.equal(JSON.stringify(w.legacy),snap);
});
test('Tailwind triggers on slash launch even on miss; Cyclone has per-target force and no Boss knockback',()=>{
 const tail=setup('wind','tailwind');tail.legacy.momentum=100;tail.legacy.light(chainRoot(),0);assert.ok(tail.legacy.haste>0);
 for(const kind of ['grunt','bulwark','boss']){
 const w=setup('wind','cyclone'),a=enemy(w,kind,1500,900);w.legacy.momentum=100;const x=a.x;w.legacy.light(chainRoot(),0);advance(w,.16);
 if(kind==='boss')assert.equal(a.x,x);else assert.ok(a.x>x);
 }
});
test('Momentum gains actual ordinary movement near enemies, not idle, blocked wall or Dash',()=>{
 const w=setup('wind');enemy(w,'grunt',500,1000);w.step({...idle,dx:1},1/60);assert.ok(w.legacy.momentum>0);
 w.legacy.momentum=0;w.step({...idle,dx:1,dash:true},1/60);assert.equal(w.legacy.momentum,0);
 w.dashTime=0;w.player.x=1520;w.step({...idle,dx:1},1/60);assert.equal(w.legacy.momentum,0);
});
test('Legacy clocks/DoT/queue and Momentum freeze with hitstop/Boss transform; run clocks keep baseline rules',()=>{
 const w=setup('fire'),a=enemy(w);primary(w,a,'charged');w.hitstop=.5;const before=JSON.stringify(w.legacy);w.step(idle,1/60);assert.equal(JSON.stringify(w.legacy),before);
 const boss=enemy(w,'boss',1500,1200);boss.hp=700;const before2=JSON.stringify(w.legacy);for(let i=0;i<30;i++)w.step(idle,1/60);assert.equal(JSON.stringify(w.legacy),before2);
});
test('Legacy kill preserves marked Blood Reclaimer, Hunted Vessel and Death Echo under one root; no duplicate deaths',()=>{
 for(const curse of ['huntedVessel','deathEcho']){
 const w=setup('fire'),a=enemy(w,'grunt',1),b=enemy(w,'grunt',10,900);w.mutations=['bloodReclaimer'];w.setCurses([curse]);w.hp=70;a.rupture=1;
 const root=legacyHit(w,a,10);assert.ok(w.hp>70);assert.equal(w.kills,1);const surge=w.surge;legacyHit(w,a,10,root);assert.equal(w.kills,1);assert.equal(w.surge,surge);
 if(curse==='huntedVessel')assert.ok(w.barrier.value>0);else {w.resolveExplosions();assert.equal(b.hp,0);assert.equal(w.kills,2);assert.ok(root.echoes<=6);}
 }
});
test('DoT and chain kills also dispatch eligible on-kill; secondary kills never count as melee Aegis/BloodPact hits',()=>{
 const w=setup('fire'),a=enemy(w,'grunt',2);w.mutations=['aegisCore'];w.setCurses(['bloodPact']);w.hp=70;primary(w,a,'charged');const hp=w.hp,shield=w.barrier.aegisDamage;
 advance(w,.6);assert.equal(a.hp,0);assert.equal(w.hp,hp);assert.equal(w.barrier.aegisDamage,shield);
 const v=setup('lightning'),e=enemy(v,'grunt',2);v.setCurses(['huntedVessel']);v.legacy.perfect();primary(v,e);v.legacy.resolve();assert.equal(e.hp,0);assert.ok(v.barrier.value>0);
});
test('root budget is shared and finite across delayed descendants; native roots retain old policy',()=>{
 const root=chainRoot();legacyRoot(root);let count=0;while(admitProc(root,1))count++;assert.equal(count,L.rootBudget);assert.equal(admitProc(root,1),false);
 const deep=chainRoot();legacyRoot(deep);assert.equal(admitProc(deep,L.depthCap+1),false);
 const native=chainRoot();for(let i=0;i<200;i++)assert.equal(admitProc(native,999),true);
 const w=setup('fire'),a=enemy(w,'volatile',1);root.legacy.remaining=0;w.setCurses(['deathEcho']);legacyHit(w,a,10,root);assert.equal(w.kills,1);assert.equal(w.explosions.filter(e=>e.hostile).length,1);assert.equal(w.explosions.filter(e=>e.echo).length,0);
});
test('reset/equip validates branch dependencies, one set per run and clears every elemental state',()=>{
 const w=setup('fire');assert.equal(w.legacy.equip({sigil:'water',branch:'wildfire'}),false);assert.equal(w.legacy.equip({sigil:'water',branch:null}),false);
 w.reset();assert.equal(w.legacy.selection,null);assert.equal(w.legacy.targets.size,0);assert.equal(w.legacy.momentum,0);assert.equal(w.legacy.projectiles.length,0);
 for(const sigil of SIGILS){w.reset();assert.equal(w.legacy.equip({sigil,branch:null}),true);}
 for(const [branch,sigil] of Object.entries(BRANCHES)){w.reset();assert.equal(w.legacy.equip({sigil,branch}),true);}
});

test('all six Cores/twelve Branches coexist with the four Mutation groups and every Curse without changing native slots/relay caps',()=>{
 const sets=[...SIGILS.map(sigil=>({sigil,branch:null})),...Object.entries(BRANCHES).map(([branch,sigil])=>({sigil,branch}))];
 const builds=[
  [['phantomEdge','catalyst','berserker','detonationSpecialist'],['volatileSoul','deathEcho']],
  [['staticRiposte','guardBreaker','aegisCore','bloodReclaimer'],['bloodPact','ironOath']],
  [['ironReversal','soulAnchor','echoChamber','kineticBattery'],['glassSoul','parasiticMark']],
  [['phantomEdge','staticRiposte','bloodReclaimer','catalyst'],['ghostStep','huntedVessel']],
 ];
 for(const offer of sets)for(const [mutations,curses] of builds){
  const w=setup(offer.sigil,offer.branch);w.mutations=[...mutations];w.setCurses(curses);w.hp=Math.min(60,w.maxHp);
  const a=enemy(w),b=enemy(w,'grunt',500,930);w.legacy.perfect();
  for(let i=0;i<3;i++)primary(w,a,'light',1);
  primary(w,a,'heavy',1);primary(w,a,'charged',1);primary(w,a,'basic',1);
  w.legacy.momentum=100;w.legacy.light(chainRoot(),0);w.legacy.resolve();advance(w,.4);
  a.rupture=3;b.rupture=2;w.detonate(a,1);w.resolveExplosions();advance(w,.1);
  legacyHit(w,a,1000);w.resolveExplosions();advance(w,.1);
  assert.equal(w.mutations.length,4);assert.deepEqual(w.curses,curses);
  assert.ok(Number.isFinite(w.hp)&&w.hp>=0&&w.hp<=w.maxHp,JSON.stringify(offer));
  assert.ok(w.lastChain<=COMBAT.chainLimit);assert.ok(w.legacy.projectiles.length<=L.projectileCap);
  assert.ok(w.barrier.value<=30);assert.ok(w.chargedShots<=3);assert.ok(w.surge<=100);
 }
});
test('actual Perfect Dodge grants both Legacy and existing Mutation/Curse rewards once per Dash',()=>{
 const w=setup('lightning','overclock');w.mutations=['phantomEdge','staticRiposte'];w.setCurses(['ghostStep']);
 w.projectiles.push({x:w.player.x+COMBAT.dashSpeed/60,y:w.player.y,vx:0,vy:0,hostile:true,life:1});
 w.step({...idle,dx:1,dash:true},1/60);assert.equal(w.perfectDodges,1);assert.ok(w.legacy.charge>0);assert.ok(w.build.phantom>0);assert.ok(w.build.staticCharge>0);
 advance(w,.12);assert.equal(w.perfectDodges,1);
});

test('one action/target contributes at most one elemental hit and dead Shadow marks clear after non-melee kills',()=>{
 const w=setup('ice'),a=enemy(w),root=chainRoot();primary(w,a,'light',1,root);primary(w,a,'light',1,root);assert.equal(w.legacy.targets.get(a.id).frost,1);
 const shadow=setup('shadow'),b=enemy(shadow,'grunt',1);shadow.legacy.perfect();primary(shadow,b,'basic',10);assert.equal(shadow.legacy.mark,null);assert.equal(shadow.legacy.ambushes,0);
});
