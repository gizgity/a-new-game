import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatWorld } from '../.test-build/combat.js';
import { RunDirector } from '../.test-build/run.js';
import { chainRoot } from '../.test-build/BuildEffects.js';
import { MUTATIONS, CURSES } from '../.test-build/builds.js';
const dt=1/60,idle={dx:0,dy:0,melee:false,shoot:false,heavy:false,dash:false};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
function world(mutations=[],curse=null){const w=new CombatWorld({x:800,y:500,angle:0});w.practice=false;w.enemies=[];w.mutations=mutations;w.curse=curse;return w;}
function target(w,x=860,hp=1000,kind='grunt'){w.spawnEnemy(kind,hp);const e=w.enemies.at(-1);Object.assign(e,{x,y:500,cooldown:999,stagger:999});return e;}
function step(w,n,input=idle){for(let i=0;i<n;i++){w.hitstop=0;w.step(input,dt);}}

test('Q5C has exactly12/8 unique IDs; new content defaults eligible without extra slots',()=>{
 assert.equal(MUTATIONS.length,12);assert.equal(CURSES.length,8);assert.equal(new Set([...MUTATIONS,...CURSES]).size,20);
});
test('Reclaimer sees consumed marks on Basic/Detonate kills, ignores unmarked and caps multikill',()=>{
 const w=world(['bloodReclaimer']);w.hp=50;const e=target(w,850,10);e.rupture=1;
 w.fire(800,500,0,false);step(w,1);assert.equal(w.hp,53);
 w.hitEnemy(target(w,860,1),2,0,0,0);assert.equal(w.hp,53);
 const marked=target(w,900,1);marked.rupture=1;w.hitEnemy(marked,2,0,0,0);assert.equal(w.hp,53);
 w.build.step(2);const a=target(w,880,10);a.rupture=1;w.chainSeen.clear();w.detonate(a,1);w.resolveExplosions();assert.equal(w.hp,56);
});
test('all sustain shares8/10s; Blood keeps separate6 cap, cooldowns and fullHP do not waste budget',()=>{
 const w=world();w.hp=50;w.hp+=w.build.heal(w.hp,100);w.hp+=w.build.heal(w.hp,100,'reclaimerCooldown',3,2);w.hp+=w.build.heal(w.hp,100,'parasiticCooldown',2,2);
 w.build.step(2);w.hp+=w.build.heal(w.hp,100,'reclaimerCooldown',3,2);assert.equal(w.hp,58);assert.equal(w.build.bloodHealed,2);
 w.curse='glassSoul';assert.equal(w.build.healed,8);w.build.step(8);assert.equal(w.build.healed,0);
 const full=world();assert.equal(full.build.heal(100,100,'reclaimerCooldown',3,2),0);assert.equal(full.build.reclaimerCooldown,0);
});
test('Reversal needs enemy HP loss, expires, is not refreshed, consumes on Heavy start including cancellation',()=>{
 const w=world(['ironReversal']);w.barrier.gain(10,false);w.hurt(10,0);assert.equal(w.build.reversal,0);
 w.invulnerable=0;w.hurt(5,0,false);assert.equal(w.build.reversal,0);
 w.invulnerable=0;w.hurt(5,0);assert.equal(w.build.reversal,4);w.build.step(1);w.invulnerable=0;w.hurt(1,0);assert.equal(w.build.reversal,3);
 w.beginAttack(true);near(w.attack.damage,140);assert.equal(w.build.reversal,0);w.hitstop=0;w.step({...idle,dash:true},dt);assert.equal(w.attack,null);
 const expired=world(['ironReversal']);expired.hurt(1,0);expired.build.step(4);expired.beginAttack(true);assert.equal(expired.attack.damage,100);
});
test('Anchor once/run, no hazard or lethal rescue; pushes common/Elite, preserves Boss timing and resets only on run',()=>{
 const w=world(['soulAnchor']);w.hp=30;const a=target(w,840),b=target(w,850,1000,'bulwark'),boss=target(w,870,1000,'boss');boss.windup=.5;
 w.hurt(10,0);assert.equal(w.hp,20);assert.equal(w.barrier.value,20);assert.equal(a.x,920);assert.equal(b.x,882);assert.equal(boss.x,870);assert.equal(boss.windup,.5);
 w.curse='glassSoul';w.curse='parasiticMark';assert.equal(w.build.anchorUsed,true);
 w.barrier.value=0;w.invulnerable=0;w.hurt(1,0);assert.equal(w.barrier.value,0);
 const lethal=world(['soulAnchor']);lethal.hp=10;lethal.hurt(20,0);assert.equal(lethal.hp,0);assert.equal(lethal.build.anchorUsed,false);
 const hazard=world(['soulAnchor']);hazard.hp=20;hazard.hurt(1,0,false);assert.equal(hazard.build.anchorUsed,false);
 w.reset();assert.equal(w.build.anchorUsed,false);
});
test('Echo Chamber counts executed Ruptures across delayed relays, once/root; excludes Boss and echoes',()=>{
 const w=world(['echoChamber']),root=chainRoot();for(let i=0;i<4;i++){const e=target(w,850+i*50,10000);e.rupture=1;}
 const boss=target(w,920,10000,'boss');w.detonate(w.enemies[0],1,false,undefined,root);w.resolveExplosions();assert.equal(root.detonations,1);assert.equal(w.build.chamberCooldown,0);
 step(w,4);assert.equal(root.detonations,3);assert.equal(root.pulsed,false);step(w,4);assert.equal(root.detonations,4);assert.equal(root.pulsed,true);assert.equal(boss.slow,0);assert.ok(w.enemies[2].slow>0);
 const count=w.impacts.filter(i=>i.kind==='slow').length;w.explosions.push({x:900,y:500,damage:0,radius:80,hostile:false,root,echo:true});w.resolveExplosions();assert.equal(root.detonations,4);assert.equal(w.impacts.filter(i=>i.kind==='slow').length,count);
});
test('slow/Hunted only affect chase movement, not windup/recovery/projectiles/Boss, and Curse swap removes chase haste',()=>{
 const plain=world(),slow=world([], 'huntedVessel');const a=target(plain,1000),b=target(slow,1000);a.stagger=b.stagger=0;b.slow=2;
 plain.stepEnemy(a,dt);slow.stepEnemy(b,dt);near(1000-b.x,(1000-a.x)*1.15*.7);
 b.windup=.5;b.windupDuration=.5;slow.stepEnemy(b,.1);near(b.windup,.4);b.windup=0;b.recovery=.5;slow.stepEnemy(b,.1);near(b.recovery,.4);
 slow.curse='deathEcho';b.echoHaste=3;slow.curse='huntedVessel';assert.equal(b.echoHaste,0);
});
test('Kinetic counts real walk/dash near enemies, cap/rate; no idle/wall/knockback/collision/outside combat',()=>{
 const w=world(['kineticBattery']);const e=target(w,1000);step(w,30,{...idle,dy:1});assert.equal(w.build.kinetic,1);step(w,10,{...idle,dy:-1});assert.equal(w.build.kinetic,1);
 step(w,80,{...idle,dy:-1});assert.equal(w.build.kinetic,2);
 w.player.y=80;e.y=100;w.build.kineticRate=0;w.build.kineticDistance=0;step(w,90,{...idle,dy:-1});assert.equal(w.build.kinetic,2);assert.equal(w.build.kineticDistance,0);
 w.build.kineticDistance=0;w.invulnerable=0;w.hurt(1,0,false);step(w,1);assert.equal(w.build.kineticDistance,0);
 const empty=world(['kineticBattery']);step(empty,60,{...idle,dx:1});assert.equal(empty.build.kinetic,0);
 const dash=world(['kineticBattery']);target(dash,1000);step(dash,9,{...idle,dy:1,dash:true});assert.equal(dash.build.kinetic,1);
});
test('Kinetic converts before damage, respects avoidance/cooldown and cap, hazard cannot consume',()=>{
 const w=world(['kineticBattery']);w.build.kinetic=3;w.hurt(20,0,false);assert.equal(w.build.kinetic,3);w.invulnerable=0;w.hurt(20,0);assert.equal(w.hp,72);assert.equal(w.build.kinetic,0);
 w.build.kinetic=2;w.invulnerable=0;w.hurt(1,0);assert.equal(w.build.kinetic,2);w.build.step(3);w.invulnerable=0;w.barrier.gain(29,false);w.hurt(5,0);assert.equal(w.barrier.value,25);assert.equal(w.build.kinetic,0);
});
test('Glass buffs only direct base at fire time, Static flat remains40; swap removes in-flight Glass buff and HP stays lost',()=>{
 const w=world(['staticRiposte'],'glassSoul');assert.equal(w.hp,75);w.build.staticCharge=4;const e=target(w,850);w.fire(800,500,0,false,true);step(w,1);near(e.hp,1000-84*1.3-40-24);
 w.fire(800,500,0,false);w.curse='ghostStep';assert.equal(w.maxHp,100);assert.equal(w.hp,75);assert.equal(w.projectiles[0].damage,20);
});
test('Parasitic one heal/root, no empty/echo heal; Reclaimer priority then residual budget; draft5 versus10',()=>{
 const w=world(['bloodReclaimer'],'parasiticMark');w.hp=50;w.build.healed=4;w.build.healWindow=10;const a=target(w,850,10);a.rupture=1;const root=chainRoot();w.detonate(a,1,false,undefined,root);w.resolveExplosions();assert.equal(w.hp,54);assert.equal(w.build.lastHeal,1);assert.equal(root.healed,true);
 w.build.step(2);w.explosions.push({x:850,y:500,damage:20,radius:100,hostile:false,root,echo:true});w.resolveExplosions();assert.equal(w.hp,54);
 const r=new RunDirector(w);r.draftKind='curse';r.draft=[{id:'parasiticMark',role:'curseChoice'}];r.choose(0);assert.equal(w.hp,59);
 r.draft=[{id:'glassSoul',role:'curseChoice'}];r.choose(0);assert.equal(w.hp,69);r.draft=[{id:'ghostStep',role:'curseChoice'}];r.choose(0);assert.equal(w.hp,79);
 const empty=world([],'parasiticMark');empty.hp=50;const dead=target(empty,850);dead.rupture=1;empty.detonate(dead,1);dead.hp=0;empty.resolveExplosions();assert.equal(empty.hp,50);assert.equal(empty.build.parasiticCooldown,0);
});
test('Hunted reward capped once/second, Barrier/Surge capped, keep Curse preserves cooldown; pause/hitstop freeze Q5C',()=>{
 const w=world([],'huntedVessel');for(let i=0;i<3;i++)w.hitEnemy(target(w,850,1),2,0,0,0);assert.equal(w.barrier.value,2);assert.equal(w.surge,33);
 w.curse='huntedVessel';assert.equal(w.build.huntedCooldown,1);w.build.step(1);w.barrier.value=29;w.surge=99;w.hitEnemy(target(w,850,1),2,0,0,0);assert.equal(w.barrier.value,30);assert.equal(w.surge,100);
 w.build.reversal=4;const r=new RunDirector(w);r.draft=[{id:'catalyst',role:'wildcard'}];const before=JSON.stringify(w.build);r.step(idle,dt);assert.equal(JSON.stringify(w.build),before);r.draft=[];w.hitstop=1;w.step(idle,dt);assert.equal(JSON.stringify(w.build),before);
 w.curse='glassSoul';assert.equal(w.build.huntedCooldown,0);
});
