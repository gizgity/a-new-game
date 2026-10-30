import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {compose} from './score.mjs';
import {render,wav} from './render.mjs';
import {render as renderA,wav as wavA} from './phase-a-render.mjs';
const dir=fileURLToPath(new URL('.',import.meta.url));
const root=fileURLToPath(new URL('../../',import.meta.url));
const pieces=compose();
const combos=[['arena-base','tension'],['arena-base','anomaly'],['arena-base','tension','anomaly'],['boss-core','enraged']];
const reports=[];
for(const p of pieces)assert.deepEqual(fs.readFileSync(`${dir}/audio/${p.id}.wav`),wavA(renderA(p)));
const audio=new Map(pieces.map(p=>[p.id,render(p)]));
for(const ids of combos){const n=audio.get(ids[0]).length,mix=new Float64Array(n);for(let i=0;i<n;i++)for(const id of ids){const a=audio.get(id);mix[i]+=a[i%a.length];}
 fs.writeFileSync('/tmp/q12d-mix.wav',wav(mix));
 const up=execFileSync('ffmpeg',['-v','error','-i','/tmp/q12d-mix.wav','-ar','176400','-f','f32le','-'],{maxBuffer:40*1024*1024});let peak=0;for(let i=0;i<up.length;i+=4)peak=Math.max(peak,Math.abs(up.readFloatLE(i)));assert.ok(peak<.65);
 reports.push({ids,oversampled4xPeak:peak,oversampled4xPeakDbFS:20*Math.log10(peak)});
}
const names=fs.readdirSync(`${dir}/audio-b`).sort();const hashes=()=>Object.fromEntries(names.map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync(`${dir}/audio-b/${n}`)).digest('hex')]));const before=hashes();
execFileSync('node',[`${dir}/render.mjs`]);assert.deepEqual(hashes(),before);
const protectedPaths=['src','public','audition.html','vite.config.ts','package.json','package-lock.json','.github','DESIGN_DECISIONS.md','ART_BIBLE.md','docs/q12d/score.mjs','docs/q12d/events.json','docs/q12d/audio'];
for(const p of protectedPaths)assert.equal(execFileSync('git',['diff','a7ba63c','--',p],{cwd:root}).length,0,p);
fs.writeFileSync(`${dir}/production-evidence.json`,JSON.stringify({baseline:'a7ba63c',phaseABytesMatchRenderer:true,rerenderWavFlacHashesIdentical:before,protectedPathsUnchanged:protectedPaths,combinations:reports,note:'4x FFmpeg resampled sample peaks; not a certified true-peak meter. Human listening and Safari pending.'},null,2)+'\n');console.log('PASS baseline A, deterministic B WAV/FLAC, protected paths, oversampled peaks',reports);
