import test from 'node:test';
import assert from 'node:assert/strict';
import { SAVE_KEY, PENDING_KEY, defaultProfile, validateProfile, loadProfile, saveProfile, mutationPool, cursePool, Progression } from '../.test-build/progression.js';

test('save validation whitelists IDs/settings and rejects invalid numbers/version/prototype payloads',()=>{
 const bad=JSON.parse('{"version":1,"settings":{"locale":"xx","muted":"true","volume":4,"cosmetic":"prism"},"totals":{"kills":-5,"detonations":1.2,"perfectDodges":1e100},"unlocks":["admin","firstBlood","firstBlood"],"hp":999,"__proto__":{"polluted":true}}');
 const result=validateProfile(bad);
 assert.equal(result.settings.locale,'vi');assert.equal(result.settings.muted,false);assert.equal(result.settings.volume,1);assert.equal(result.settings.cosmetic,'mint');
 assert.equal(result.totals.kills,0);assert.equal(result.totals.detonations,0);assert.equal(result.totals.perfectDodges,1000000);
 assert.deepEqual(result.unlocks,['firstBlood','dodgeMaster']);assert.equal('hp' in result,false);assert.equal({}.polluted,undefined);
 assert.deepEqual(validateProfile({version:99}),defaultProfile());
});
test('corrupt, oversized and blocked localStorage fall back safely; valid settings round trip',()=>{
 for(const text of ['{broken','x'.repeat(21000),'null'])assert.deepEqual(loadProfile({getItem:()=>text,setItem(){}}),defaultProfile());
 const blocked={getItem(){throw Error('denied');},setItem(){throw Error('quota');}};
 assert.deepEqual(loadProfile(blocked),defaultProfile());assert.equal(saveProfile(defaultProfile(),blocked),false);
 let stored='';const memory={getItem:(key)=>{return key===SAVE_KEY ? stored : ''; },setItem:(key,value)=>{if(key===SAVE_KEY)stored=value;}};
 const profile=defaultProfile();Object.assign(profile.settings,{locale:'en',muted:true,volume:.25});
 assert.equal(saveProfile(profile,memory),true);assert.deepEqual(loadProfile(memory),profile);
});
test('four lifetime goals unlock choices/cosmetic without adding permanent stats; events count once',()=>{
 const profile=defaultProfile(),progress=new Progression(profile);
 assert.equal(mutationPool(profile).length,10);assert.equal(cursePool(profile).length,7);
 progress.beginRun();const world={kills:1,detonations:5,perfectDodges:3};
 assert.equal(progress.observe(world,'victory'),true);assert.equal(progress.observe(world,'victory'),false);
 assert.equal(profile.totals.victories,1);assert.equal(profile.totals.kills,1);assert.equal(profile.unlocks.length,4);
 assert.equal(mutationPool(profile).length,12);assert.equal(cursePool(profile).length,8);
 profile.settings.cosmetic='prism';assert.equal(validateProfile(profile).settings.cosmetic,'prism');
 progress.beginRun();progress.observe({kills:2,detonations:0,perfectDodges:0},'defeat');
 assert.equal(profile.totals.kills,3);assert.equal(profile.totals.victories,1);assert.equal(profile.totals.runs,2);
 assert.deepEqual(Object.keys(profile).sort(),['drafts','legacy','settings','totals','unlocks','version']);
});
test('desktop auto aim defaults OFF for old saves, validates preferences and persists both settings', () => {
  const old = validateProfile({ version: 1, settings: { locale: 'en' } });
  assert.equal(old.settings.desktopAutoAim, false);
  assert.equal(old.settings.autoAimPriority, 'nearest');
  const invalid = validateProfile({ version: 1, settings: { desktopAutoAim: 'true', autoAimPriority: 'boss' } });
  assert.equal(invalid.settings.desktopAutoAim, false);
  assert.equal(invalid.settings.autoAimPriority, 'nearest');
  const stored = new Map();
  const storage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => { stored.set(key, value); } };
  for (const priority of ['nearest', 'archer', 'elite']) {
    const profile = defaultProfile();
    profile.settings.desktopAutoAim = true;
    profile.settings.autoAimPriority = priority;
    assert.equal(saveProfile(profile, storage), true);
    assert.deepEqual(loadProfile(storage).settings, profile.settings);
  }
});
