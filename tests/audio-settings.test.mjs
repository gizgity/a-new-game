import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultProfile,validateProfile,loadProfile,saveProfile,SAVE_KEY} from '../.test-build/progression.js';
test('audio defaults, legacy v1–3 migration and corrupt settings preserve progression',()=>{
 for(const version of [1,2,3]){
  const p=validateProfile({version,settings:{volume:.27,muted:true},totals:{kills:123}});
  assert.equal(p.settings.volume,.27);assert.equal(p.settings.muted,true);assert.equal(p.settings.musicVolume,1);assert.equal(p.settings.sfxVolume,1);assert.equal(p.totals.kills,123);
 }
 const p=validateProfile({version:3,settings:{volume:NaN,musicVolume:'1',sfxVolume:Infinity,reduceCameraShake:'false'}});
 assert.equal(p.settings.volume,.4);assert.equal(p.settings.musicVolume,1);assert.equal(p.settings.sfxVolume,1);
 assert.equal(validateProfile({version:3,settings:{musicVolume:-2,sfxVolume:9}}).settings.sfxVolume,1);
 const storage={getItem:()=>'{bad',setItem(){}};assert.deepEqual(loadProfile(storage),defaultProfile());
});
test('stored explicit motion choice wins over OS default; settings roundtrip uses existing key',()=>{
 globalThis.matchMedia=()=>({matches:true});assert.equal(defaultProfile().settings.reduceCameraShake,true);
 const p=validateProfile({version:3,settings:{reduceCameraShake:false,musicVolume:.23,sfxVolume:.54,volume:0,muted:true}});
 assert.equal(p.settings.reduceCameraShake,false);
 const map=new Map();const storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 assert.equal(saveProfile(p,storage),true);assert.deepEqual(loadProfile(storage).settings,p.settings);assert.deepEqual([...map.keys()],[SAVE_KEY,'cursebreak.pending.v2']);delete globalThis.matchMedia;
});
