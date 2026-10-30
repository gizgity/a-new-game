import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {presets} from './production.mjs';
const baseline=execFileSync('git',['show','a7ba63c:docs/q12d/score.mjs']);
assert.deepEqual(fs.readFileSync(new URL('./score.mjs',import.meta.url)),baseline,'composition source immutable');
import {compose,BPM,RATE,arenaRoots,bossRoots} from './score.mjs';
import {render,beatFrames,cycleFrames,pieceFrames,wav} from './render.mjs';
const pieces=compose(),audio=new Map(),reports=[];
assert.equal(BPM,156);assert.equal(cycleFrames,542769);assert.equal(pieceFrames(16),2*pieceFrames(8));assert.ok(Math.abs(RATE*60/beatFrames-BPM)<.001);assert.equal(pieces.length,7);
for(const p of pieces){
 assert.equal(p.bars,({'arena-base':16,tension:8,anomaly:8,'boss-core':16,enraged:8,victory:3,defeat:3})[p.id]);
 for(const e of p.events){assert.ok(presets[e.instrument]);assert.ok(e.beat>=0&&e.beat<p.bars*4);assert.ok(e.duration>0);assert.ok(e.velocity>=0&&e.velocity<=1);assert.ok(e.pitch===null||(Number.isInteger(e.pitch)&&e.pitch>=0&&e.pitch<=127));}
 const samples=render(p);assert.equal(samples.length,pieceFrames(p.bars));const file=fs.readFileSync(new URL(`./audio-b/${p.id}.wav`,import.meta.url));
 assert.deepEqual(file,wav(samples),'exports must match deterministic renderer');
 const decoded=execFileSync('ffmpeg',['-v','error','-i',new URL(`./audio-b/${p.id}.flac`,import.meta.url).pathname,'-f','s16le','-'],{maxBuffer:8*1024*1024});
 assert.deepEqual(decoded,file.subarray(44),'FLAC must decode sample-exact with no padding');
 let peak=0,power=0,maxStep=0;
 for(let i=0;i<samples.length;i++){const x=samples[i];assert.ok(Number.isFinite(x));peak=Math.max(peak,Math.abs(x));power+=x*x;if(i)maxStep=Math.max(maxStep,Math.abs(x-samples[i-1]));}
 const seam=Math.abs(samples[0]-samples.at(-1));assert.ok(peak<.8);assert.ok(seam<.01,`${p.id} seam ${seam}`);
 if(!p.loop)assert.ok(samples.slice(-RATE/4).every(x=>x===0),'stings need quiet ending');
 audio.set(p.id,samples);reports.push({id:p.id,peak,rms:Math.sqrt(power/samples.length),seamStep:seam,maxAdjacentStep:maxStep,sha256:crypto.createHash('sha256').update(file).digest('hex')});
}
// Overlays must share their family's root/fifth or use a specified rest-window answer.
const harmonicChecks=[];
for(const id of ['tension','anomaly','enraged']){
 const p=pieces.find(p=>p.id===id),roots=id==='enraged'?bossRoots:arenaRoots;
 for(const e of p.events){
  if(['snare','hat'].includes(e.instrument))continue;
  const b=Math.floor(e.beat/4),beat=e.beat%4,root=roots[b],interval=(e.pitch-root+120)%12;
  const chromatic=id==='enraged'&&[0,4].includes(b)&&e.instrument==='bell';
  if(chromatic){assert.ok(beat>=3);assert.ok([74,75].includes(e.pitch));}
  else assert.ok([0,7].includes(interval),`${id} off-harmony bar${b+1}`);
  if(e.instrument==='bell'){
   assert.ok(beat>=3,'response must occupy lead rest');
   const core=pieces.find(p=>p.id===(id==='enraged'?'boss-core':'arena-base'));
   for(const offset of [0,32])for(const lead of core.events.filter(n=>n.instrument==='lead'&&n.pitch!==null)){
    const start=e.beat+offset,end=start+e.duration+presets.bell.release*BPM/60;
    const leadEnd=lead.beat+lead.duration+presets.lead.release*BPM/60;
    // Octave/root unisons at reprise accents are intentional and consonant.
    if(start<leadEnd&&end>lead.beat)assert.equal((e.pitch-lead.pitch+120)%12,0,'response collides with independent lead');
   }
  }
 }
 harmonicChecks.push({id,rootFifthOrWrittenNeighbour:true,responsesInLeadRests:true});
}
function measures(a){let peak=0,power=0;for(const x of a){peak=Math.max(peak,Math.abs(x));power+=x*x;}return {peak,peakDbFS:20*Math.log10(peak),rmsDbFS:10*Math.log10(power/a.length),headroomDb:-20*Math.log10(peak)};}
// Inspect 20ms and 100ms windows around BOTH 8/16-bar boundaries over 3 cycles.
// These measurements complement (and do not replace) multi-loop listening.
function boundaries(a){const rows=[];for(let cycle=1;cycle<=3;cycle++)for(const at of [cycle*a.length,cycle*a.length-cycleFrames])for(const ms of [20,100]){const w=Math.round(RATE*ms/1000);let pre=0,post=0,maxStep=0;for(let j=-w;j<w;j++){const i=(at+j+a.length*4)%a.length,x=a[i];if(j<0)pre+=x*x;else post+=x*x;maxStep=Math.max(maxStep,Math.abs(x-a[(i+a.length-1)%a.length]));}rows.push({atFrame:at,windowMs:ms,preRms:Math.sqrt(pre/w),postRms:Math.sqrt(post/w),maxAdjacentStep:maxStep});}return rows;}
const combinations=[];
for(const ids of [['arena-base','tension'],['arena-base','anomaly'],['arena-base','tension','anomaly'],['boss-core','enraged']]){
 const n=audio.get(ids[0]).length,mix=new Float64Array(n);for(let i=0;i<n;i++)for(const id of ids){const a=audio.get(id);mix[i]+=a[i%a.length];}const m=measures(mix);assert.ok(m.peak<.65);combinations.push({ids,...m,boundaries:boundaries(mix)});
}
const manifest=JSON.parse(fs.readFileSync(new URL('./manifest-b.json',import.meta.url)));
const compressedBytes=manifest.pieces.reduce((n,p)=>n+p.files.find(f=>f.file.endsWith('.flac')).bytes,0);
const totalBytes=manifest.pieces.reduce((n,p)=>n+p.bytes,0),decodedBytes=manifest.pieces.reduce((n,p)=>n+p.decodedMonoBytes,0);
assert.ok(totalBytes<10*1024*1024);assert.ok(decodedBytes<20*1024*1024);
fs.writeFileSync(new URL('./validation-b.json',import.meta.url),JSON.stringify({bpm:BPM,actualBpm:RATE*60/beatFrames,cycleFrames,rate:RATE,reports:reports.map(r=>({...r,...measures(audio.get(r.id)),boundaries:pieces.find(p=>p.id===r.id).loop?boundaries(audio.get(r.id)):[]})),harmonicChecks,combinations,totalBytes,compressedBytes,decodedBytes,decoded48kBytes:Math.round(decodedBytes*48000/44100),compositionSourceSha256:crypto.createHash('sha256').update(baseline).digest('hex'),note:'Signal checks only; human listening remains required.'},null,2)+'\n');console.log({reports,harmonicChecks,combinations,totalBytes,decodedBytes});
