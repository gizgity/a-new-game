import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {BPM,RATE,presets,compose} from './score.mjs';
export const beatFrames=RATE*60/BPM;
const tau=2*Math.PI;
// No gameplay imports or ambient RNG. Per-event xorshift32 noise seed.
function voice(e,index) {
 const p=presets[e.instrument], gate=e.duration*60/BPM, length=Math.ceil((gate+p.release)*RATE), out=new Float64Array(length);
 const hz=440*2**((e.pitch-69)/12); let seed=(0x51c0ffee ^ Math.imul(index+1,2654435761))>>>0, low=0, phase=0;
 for(let i=0;i<length;i++) {
  const t=i/RATE; seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
  const noise=(seed>>>0)/2147483648-1;
  const envelope=t<p.attack?t/p.attack:t<p.attack+p.decay?1-(1-p.sustain)*(t-p.attack)/p.decay:p.sustain;
  // Release begins at the actual envelope level at note-off, including short gates.
  const gateLevel=gate<p.attack?gate/p.attack:gate<p.attack+p.decay?1-(1-p.sustain)*(gate-p.attack)/p.decay:p.sustain;
  const env=t<gate?envelope:gateLevel*Math.max(0,1-(t-gate)/p.release);
  const ph=tau*hz*t; let x=0;
  switch(e.instrument) {
   case 'bass': x=.70*Math.sin(ph)+.22*Math.sin(ph*2)+.08*Math.sin(ph*3);break;
   case 'pad': x=.55*Math.sin(ph)+.22*Math.sin(ph*1.003)+.15*Math.sin(ph*2)+.08*Math.sin(ph*3*.998);break;
   case 'stab': x=.65*Math.sin(ph)+.25*Math.sin(ph*2)+.1*Math.sin(ph*4);break;
   case 'lead': x=.7*Math.sin(ph+.7*Math.exp(-t*9)*Math.sin(ph*2))+.2*Math.sin(ph*2)+.1*Math.sin(ph*3);break;
   case 'bell': x=Math.sin(ph+1.1*Math.exp(-t*15)*Math.sin(ph*2));break;
   case 'kick': phase+=tau*(48+100*Math.exp(-t*55))/RATE;x=Math.sin(phase)*Math.exp(-t*17)+noise*.08*Math.exp(-t*180);break;
   case 'snare': x=(noise*.72+Math.sin(tau*175*t)*.28)*Math.exp(-t*25);break;
   case 'hat': x=(noise-low)*Math.exp(-t*80);break;
  }
  const alpha=1-Math.exp(-tau*p.cutoff/RATE);low+=alpha*(x-low);
  out[i]=(e.instrument==='hat'?x:low)*env*p.gain*e.velocity;
 }
 return out;
}
export function render(p) {
 const n=p.bars*4*beatFrames, out=new Float64Array(n);
 p.events.forEach((e,index)=>{
  if(e.pitch===null)return;
  const start=Math.round(e.beat*beatFrames), samples=voice(e,index);
  for(let i=0;i<samples.length;i++) { const at=start+i; if(p.loop||at<n)out[at%n]+=samples[i]; }
  // Finite feed-forward dotted-eighth echo on melodic voices only; fold tails across loop.
  if(['lead','bell'].includes(e.instrument)) for(const [delay,gain] of [[.75,.19],[1.5,.075]])
   for(let i=0;i<samples.length;i++) {const at=start+Math.round(delay*beatFrames)+i;if(p.loop||at<n)out[at%n]+=samples[i]*gain;}
 });
 // Fixed gain across every stem; no per-file normalization or nonlinear limiter.
 for(let i=0;i<n;i++)out[i]*=.85;
 return out;
}
export function wav(samples) {
 const b=Buffer.alloc(44+samples.length*2); b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(RATE,24);b.writeUInt32LE(RATE*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);
 samples.forEach((x,i)=>{if(!Number.isFinite(x)||Math.abs(x)>=1)throw Error(`Invalid/clipped sample ${i}: ${x}`);b.writeInt16LE(Math.round(x*32767),44+i*2);});return b;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const dir=path.dirname(fileURLToPath(import.meta.url));fs.mkdirSync(`${dir}/audio`,{recursive:true});
 const manifest=compose().map(p=>{const samples=render(p);fs.writeFileSync(`${dir}/audio/${p.id}.wav`,wav(samples));return {id:p.id,bars:p.bars,loop:p.loop,frames:samples.length,seconds:samples.length/RATE,bytes:samples.length*2+44,decodedMonoBytes:samples.length*4};});
 fs.writeFileSync(`${dir}/manifest.json`,JSON.stringify({bpm:BPM,rate:RATE,channels:1,format:'PCM s16le WAV',pieces:manifest},null,2)+'\n');
 // Expanded, reviewable note/rest ledger; generated from score, never a second source.
 fs.writeFileSync(`${dir}/events.json`,JSON.stringify(compose(),null,2)+'\n');
 console.log(manifest);
}
