import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {compose,BPM,RATE,presets} from './score.mjs';
import {render,beatFrames,wav} from './render.mjs';
const pieces=compose(),audio=new Map(),reports=[];
assert.equal(BPM,140);assert.equal(beatFrames,18900);assert.equal(pieces.length,7);
for(const p of pieces){
 assert.equal(p.bars,({'arena-base':16,tension:8,anomaly:8,'boss-core':16,enraged:8,victory:3,defeat:3})[p.id]);
 for(const e of p.events){assert.ok(presets[e.instrument]);assert.ok(e.beat>=0&&e.beat<p.bars*4);assert.ok(e.duration>0);assert.ok(e.velocity>=0&&e.velocity<=1);assert.ok(e.pitch===null||(Number.isInteger(e.pitch)&&e.pitch>=0&&e.pitch<=127));}
 const samples=render(p),file=fs.readFileSync(new URL(`./audio/${p.id}.wav`,import.meta.url));
 assert.deepEqual(file,wav(samples),'exports must match deterministic renderer');
 let peak=0,power=0,maxStep=0;
 for(let i=0;i<samples.length;i++){const x=samples[i];assert.ok(Number.isFinite(x));peak=Math.max(peak,Math.abs(x));power+=x*x;if(i)maxStep=Math.max(maxStep,Math.abs(x-samples[i-1]));}
 const seam=Math.abs(samples[0]-samples.at(-1));assert.ok(peak<.8);assert.ok(seam<.01,`${p.id} seam ${seam}`);
 if(!p.loop)assert.ok(samples.slice(-RATE/4).every(x=>x===0),'stings need quiet ending');
 audio.set(p.id,samples);reports.push({id:p.id,peak,rms:Math.sqrt(power/samples.length),seamStep:seam,maxAdjacentStep:maxStep,sha256:crypto.createHash('sha256').update(file).digest('hex')});
}
const combinations=[];
for(const ids of [['arena-base','tension'],['arena-base','anomaly'],['arena-base','tension','anomaly'],['boss-core','enraged']]){
 let peak=0;const n=audio.get(ids[0]).length;for(let i=0;i<n;i++){let x=0;for(const id of ids){const a=audio.get(id);x+=a[i%a.length];}peak=Math.max(peak,Math.abs(x));}assert.ok(peak<.85);combinations.push({ids,peak});
}
const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)));
const totalBytes=manifest.pieces.reduce((n,p)=>n+p.bytes,0),decodedBytes=manifest.pieces.reduce((n,p)=>n+p.decodedMonoBytes,0);
assert.ok(totalBytes<10*1024*1024);assert.ok(decodedBytes<20*1024*1024);
fs.writeFileSync(new URL('./validation.json',import.meta.url),JSON.stringify({rate:RATE,reports,combinations,totalBytes,decodedBytes,note:'Signal checks only; human listening remains required.'},null,2)+'\n');console.log({reports,combinations,totalBytes,decodedBytes});
