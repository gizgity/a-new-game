import test from 'node:test';
import assert from 'node:assert/strict';
import { AdaptiveMusic, MUSIC, musicLayers, musicState } from '../.test-build/AdaptiveMusic.js';
const flush = async()=>{for(let i=0;i<30;i++)await Promise.resolve();};
class Param { value=1; events=[]; setValueAtTime(v,t){this.value=v;this.events.push([v,t]);} linearRampToValueAtTime(v,t){this.setValueAtTime(v,t);} cancelScheduledValues(){} cancelAndHoldAtTime(){} }
class Node { gain=new Param(); connect(){} disconnect(){} }
class Context extends EventTarget { currentTime=0;state='running';sources=[];createGain(){return new Node();}createBufferSource(){const s=new Node();s.start=(t,o)=>{s.at=t;s.offset=o;};s.stop=t=>{s.until=t;};this.sources.push(s);return s;}async decodeAudioData(){return {length:1085538,numberOfChannels:1,duration:1085538/44100};} }
globalThis.document=Object.assign(new EventTarget(),{hidden:false});
globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(10)});
const setup=()=>{const c=new Context(),m=new AdaptiveMusic(c,new Node(),'/');return [m,c];};
async function play(m,state){m.update(state,false);await flush();m.update(state,false);}
test('mapping uses real boss/phase2/anomaly, 60s threshold and legal combinations',()=>{
 const s={phase:'playing',elapsed:59.9,anomaly:false,boss:false,enraged:true};
 assert.equal(musicState(s),'early');assert.equal(musicState({...s,elapsed:60}),'tension');
 assert.equal(musicState({...s,anomaly:true}),'anomaly');assert.equal(musicState({...s,boss:true}),'enraged');
 assert.equal(musicState({...s,phase:'ready'}),'silent');
 for(const state of ['silent','early','tension','anomaly','boss','enraged','victory','defeat'])assert.ok(musicLayers(state).length<=3);
});
test('shared phase, exact 2:1 loops, next-bar gains, repeated pauses preserve offset',async()=>{
 const [m,c]=setup();await play(m,'early');assert.equal(c.sources.length,3);
 assert.deepEqual(c.sources.map(s=>s.at),[0,0,0]);assert.equal(c.sources[0].loopEnd,c.sources[1].loopEnd*2);
 c.currentTime=.4;m.update('anomaly',false);assert.equal(m.stats().sources,3);
 for(let i=0;i<20;i++){c.currentTime+=.1;const p=m.stats().position;m.update('anomaly',true);c.currentTime+=10;m.update('anomaly',false);assert.ok(Math.abs(m.stats().position-p)<1e-9);assert.equal(m.stats().sources,3);}
 m.destroy();assert.equal(m.stats().sources,0);assert.equal(m.stats().decodedBytes,0);
});
test('boss bounded crossfade, lazy cache groups, result claimed once and reset',async()=>{
 const [m,c]=setup();await play(m,'anomaly');c.currentTime=1;await play(m,'enraged');assert.ok(m.stats().sources<=3);assert.equal(m.stats().cacheEntries,2);
 // Simulate WebAudio onended after fade.
 c.currentTime+=1;for(const s of c.sources)if(s.until!==undefined)s.onended?.();
 await play(m,'victory');const count=c.sources.length;for(let i=0;i<20;i++)m.update('victory',false);assert.equal(c.sources.length,count);
 m.update('victory',true);await play(m,'victory');assert.equal(c.sources.length,count);
 m.reset();assert.equal(m.stats().cacheEntries,0);await play(m,'early');assert.equal(m.stats().sources,3);m.destroy();
});
test('FLAC decode failure falls back once, cached transitions do not decode; failure is silent',async()=>{
 const [m,c]=setup();let calls=0;c.decodeAudioData=async()=>{if(++calls%2)throw Error('codec');return {length:10,numberOfChannels:1,duration:25};};
 await play(m,'early');assert.equal(calls,6);await play(m,'anomaly');assert.equal(calls,6);m.duck();m.destroy();
 const [bad,b]=setup();b.decodeAudioData=async()=>{throw Error('bad')};await play(bad,'early');assert.equal(bad.stats().errors,1);assert.equal(bad.stats().sources,0);bad.destroy();
});

test('result reached while locked/suspended is dropped, never replayed on resume',async()=>{
 const [m,c]=setup();c.state='suspended';m.update('defeat',true);c.state='running';await play(m,'defeat');assert.equal(c.sources.length,0);m.reset();await play(m,'early');m.destroy();
});
