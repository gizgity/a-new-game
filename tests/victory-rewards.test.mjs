import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyLegacy, beginLegacy, finishLegacy, rollVictory, validateLegacy } from '../.test-build/legacy.js';
import { SIGILS, BRANCHES, LEGACY_IDS, STARTER_ANOMALIES } from '../.test-build/config/legacy.js';
import { defaultProfile, loadProfile, saveProfile, SAVE_KEY, PENDING_KEY, Progression } from '../.test-build/progression.js';
const memory = () => { const data = new Map(); return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}; };
test('first victory: two distinct Sigils; defeat: none; closed run cannot settle twice or after reload',()=>{
 for(let seed=1;seed<=200;seed++){
  const s=emptyLegacy();const ticket=beginLegacy(s,0,seed);assert.deepEqual(ticket.offers,[]);
  assert.equal(finishLegacy(s,'victory'),true);assert.equal(s.receipt.rewards.length,2);
  assert.ok(s.receipt.rewards.every(id=>SIGILS.includes(id)));assert.equal(new Set(s.receipt.rewards).size,2);
  assert.equal(finishLegacy(s,'victory'),false);assert.equal(finishLegacy(validateLegacy(s),'victory'),false);
 }
 const s=emptyLegacy();beginLegacy(s,0,12);finishLegacy(s,'defeat');assert.deepEqual(s.unlocks,[...STARTER_ANOMALIES]);assert.equal(s.victories,0);
});
test('subsequent victory dependencies, duplicates, pity and finite completion over many runs',()=>{
 for(let seed=1;seed<=80;seed++){
  const s=emptyLegacy();let runs=0;
  while(s.unlocks.length<LEGACY_IDS.length){
   s.receipt=null;beginLegacy(s,runs,Math.imul(seed+runs,2654435761)>>>0);const before=[...s.unlocks],pity=s.pity;
   finishLegacy(s,'victory');const rewards=s.receipt.rewards;
   assert.equal(rewards.length,runs===0?2:1);
   for(const id of rewards){assert.ok(!before.includes(id));if(Object.hasOwn(BRANCHES,id))assert.ok(before.includes(BRANCHES[id]));}
   if(pity===3 && SIGILS.some(id=>!before.includes(id)))assert.ok(rewards.some(id=>SIGILS.includes(id)));
   assert.equal(new Set(s.unlocks).size,s.unlocks.length);runs++;assert.ok(runs<30);
  }
  s.receipt=null;beginLegacy(s,runs,42);finishLegacy(s,'victory');assert.deepEqual(s.receipt.rewards,[]);
 }
});
test('each eligible ID has 5/3/2 weight, independent of category size',()=>{
 const s=emptyLegacy();s.victories=1;s.unlocks.push('fire');const counts={sigil:0,branch:0,anomaly:0};
 for(let i=1;i<=30000;i++){
  const [id]=rollVictory(s,Math.imul(i,2654435761)>>>0);
  counts[SIGILS.includes(id)?'sigil':Object.hasOwn(BRANCHES,id)?'branch':'anomaly']++;
 }
 // Five Sigils *5, two branches *3, four Anomalies *2 =39.
 for(const [kind,weight] of [['sigil',25],['branch',6],['anomaly',8]])assert.ok(Math.abs(counts[kind]/30000-weight/39)<.015,JSON.stringify(counts));
});
test('v1 migration preserves settings, IDs and active ticket; counters, IDs and derived stats are bounded',()=>{
 const old={version:1,settings:{locale:'en',volume:.3},totals:{runs:1},legacy:{unlocks:['fire','wildfire','brittle','alien'],ticket:{seed:12,firstRun:false,started:true,offers:[{sigil:'fire',branch:'wildfire',damage:999}],selected:{sigil:'fire',branch:'wildfire'}}}};
 const m=memory();m.setItem(SAVE_KEY,JSON.stringify(old));const p=loadProfile(m);
 assert.equal(p.version,2);assert.equal(p.settings.locale,'en');assert.equal(p.legacy.ticket.seed,12);assert.equal(p.legacy.ticket.runId,1);
 assert.ok(!p.legacy.unlocks.includes('brittle'));assert.equal(p.legacy.ticket.offers[0].damage,undefined);
 assert.equal(saveProfile(p,m),true);assert.deepEqual(loadProfile(m),p);
 const s=validateLegacy({pity:999,victories:1e9,nextRunId:1e9,unlocks:LEGACY_IDS});assert.equal(s.pity,3);assert.equal(s.victories,1e6);assert.equal(s.nextRunId,1000001);
});
test('pending receipt recovers failed main write, retry/refresh cannot duplicate; stale journal cannot replace new ticket',()=>{
 const m=memory(),p=defaultProfile();beginLegacy(p.legacy,0,42);saveProfile(p,m);
 const progression=new Progression(p);progression.beginRun();progression.observe({kills:0,detonations:0,perfectDodges:0},'victory');
 const fail={getItem:m.getItem,setItem:(k,v)=>{if(k===SAVE_KEY)throw Error('quota');m.setItem(k,v);}};
 assert.equal(saveProfile(p,fail),false);const restored=loadProfile(m);assert.deepEqual(restored.legacy,p.legacy);
 assert.equal(finishLegacy(restored.legacy,'victory'),false);assert.equal(restored.legacy.victories,1);
 const journal=m.getItem(PENDING_KEY);saveProfile(restored,m);restored.legacy.receipt=null;const next=beginLegacy(restored.legacy,1,99);saveProfile(restored,m);
 m.setItem(PENDING_KEY,journal);assert.equal(loadProfile(m).legacy.ticket.runId,next.runId);
 m.setItem(SAVE_KEY,'{broken');assert.equal(loadProfile(m).legacy.victories,1);
});
