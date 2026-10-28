import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultProfile,Progression,saveProfile,loadProfile,SAVE_KEY,PENDING_KEY,validateProfile} from '../.test-build/progression.js';
import {beginLegacy} from '../.test-build/legacy.js';
import {challenges,validateCollection} from '../.test-build/collection.js';
import {SIGILS,LEGACY_IDS,ANOMALIES} from '../.test-build/config/legacy.js';
const summary={at:1793145600000,duration:290,mutations:['staticRiposte'],curses:['deathEcho'],kills:1100,boss:true};
function finish(p,result='victory',sigil='fire',anomaly='bloodMoon') {
 p.legacy.receipt=null;const ticket=beginLegacy(p.legacy,2,123);ticket.selected={sigil,branch:null};ticket.anomalySelected=anomaly;
 const progress=new Progression(p);progress.beginRun(false);progress.observe(summary,result,summary);return progress;
}
test('20 summaries bounded; receipt/run id dedup and refresh; win sets survive history reset',()=>{
 const p=defaultProfile();p.legacy.unlocks=[...LEGACY_IDS];
 for(let i=0;i<26;i++) {const progress=finish(p,i===25?'defeat':'victory',SIGILS[i%6],ANOMALIES[i%6]);progress.observe(summary,'victory',summary);}
 assert.equal(p.collection.history.length,20);assert.equal(p.collection.lastRunId,26);assert.equal(p.collection.history[0].result,'defeat');
 assert.equal(p.collection.sigilWins.length,6);assert.equal(p.collection.anomalyWins.length,6);
 const data=new Map(),store={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};saveProfile(p,store);const r=loadProfile(store);
 assert.deepEqual(r.collection,p.collection);assert.equal(r.legacy.victories,25);
 r.collection.history=[];assert.equal(challenges(r.legacy,r.collection).find(c=>c.id==='elementalConqueror').value,6);
});
test('defeat gives no victory evidence; first run without sigil does not invent wins; schema1/2 migration',()=>{
 const p=defaultProfile();finish(p,'defeat');assert.deepEqual(p.collection.sigilWins,[]);
 p.legacy.receipt=null;beginLegacy(p.legacy,0,123);const progress=new Progression(p);progress.beginRun();progress.observe(summary,'victory',summary);
 assert.deepEqual(p.collection.sigilWins,[]);assert.equal(challenges(p.legacy,p.collection)[0].value,1);
 for(const version of [1,2]) {const old=validateProfile({...p,version,collection:undefined});assert.equal(old.version,3);assert.equal(old.collection.history.length,0);assert.equal(old.legacy.victories,1);}
});
test('allowlist strips arbitrary stats, invalid IDs/dependencies, duplicates and future run ids',()=>{
 const c=validateCollection({version:1,lastRunId:999,sigilWins:['fire','fire','evil'],anomalyWins:['bad'],history:[{...summary,runId:1,result:'victory',seal:999,legacy:{sigil:'fire',branch:'undertow'},damage:999},{...summary,runId:1,result:'victory'},{runId:2,result:'invalid'}]},2);
 assert.deepEqual(c.sigilWins,['fire']);assert.deepEqual(c.anomalyWins,[]);assert.equal(c.lastRunId,1);assert.equal(c.history.length,1);assert.equal(c.history[0].legacy,null);assert.equal('damage' in c.history[0],false);
});
test('metadata corruption and quota cannot discard core; journal recovers complete receipt and metadata',()=>{
 const p=defaultProfile();p.legacy.unlocks=[...LEGACY_IDS];finish(p);
 const data=new Map(),store={getItem:k=>data.get(k),setItem:(k,v)=>{if(v.length>1500)throw Error('quota');data.set(k,v);}};
 for(let i=0;i<19;i++)p.collection.history.push({...p.collection.history[0],runId:1});
 // Use valid, unique summaries to exercise optional-history fallback.
 p.legacy.nextRunId=21;p.collection.lastRunId=20;p.collection.history=Array.from({length:20},(_,i)=>({...p.collection.history[0],runId:20-i}));
 assert.equal(saveProfile(p,store),true);assert.equal(loadProfile(store).legacy.victories,1);assert.equal(loadProfile(store).collection.history.length,0);assert.deepEqual(loadProfile(store).collection.sigilWins,['fire']);
 const hostileHistory=validateProfile({...p,collection:{...p.collection,history:[{runId:1,result:{toString:{broken:true}}}]}});assert.equal(hostileHistory.legacy.victories,1);assert.deepEqual(hostileHistory.collection.history,[]);
 const core=validateProfile({...p,collection:'broken'});assert.equal(core.legacy.victories,1);assert.deepEqual(core.collection.history,[]);
 const failMain={getItem:k=>data.get(k),setItem:(k,v)=>{if(k===SAVE_KEY)throw Error('blocked');data.set(k,v);}};
 data.clear();assert.equal(saveProfile(p,failMain),false);assert.ok(data.get(PENDING_KEY));assert.equal(loadProfile(failMain).collection.lastRunId,20);
});
test('trail selection only accepts six journaled Victory Sigils; migration/metadata failure safely uses None',()=>{
 for(const sigil of SIGILS) {
  const p=defaultProfile();assert.equal(p.settings.trail,null);p.settings.trail=sigil;
  assert.equal(validateProfile(p).settings.trail,null);
  finish(p,'victory',sigil);assert.equal(p.collection.history[0].trailUnlocked,sigil);
  assert.equal(validateProfile(p).settings.trail,sigil);
  const first=p.collection.history[0];finish(p,'victory',sigil);assert.equal(p.collection.history[0].trailUnlocked,null);assert.equal(p.collection.sigilWins.length,1);
  assert.equal(first.trailUnlocked,sigil);
  p.settings.trail='admin';assert.equal(validateProfile(p).settings.trail,null);
  p.settings.trail=sigil;p.collection.history=[];assert.equal(validateProfile(p).settings.trail,sigil);
  p.collection='broken';assert.equal(validateProfile(p).settings.trail,null);assert.equal(validateProfile(p).legacy.victories,2);
 }
 const p=defaultProfile();finish(p,'defeat');assert.equal(p.collection.history[0].trailUnlocked,null);
});
