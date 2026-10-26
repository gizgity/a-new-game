import test from 'node:test';import assert from 'node:assert/strict';
import {arrivalPulse} from '../.test-build/arrival.js';
test('arrival has four monotonic peaks, no cue before first beat, and is absent at reset/spawn',()=>{
 assert.deepEqual(arrivalPulse(0),{beat:-1,gain:0,alpha:0});assert.equal(arrivalPulse(2).beat,-1);
 const peaks=[.1,.6,1.1,1.6].map(age=>arrivalPulse(2-age));assert.deepEqual(peaks.map(p=>p.beat),[0,1,2,3]);
 for(let i=1;i<4;i++)assert.ok(peaks[i].alpha>peaks[i-1].alpha);
 for(const age of [.1,.6,1.1,1.6])assert.ok(arrivalPulse(2-age).alpha>arrivalPulse(2-age-.15).alpha);
 for(let i=0;i<120;i++){const p=arrivalPulse(2-i/60);assert.ok(p.alpha>=0&&p.alpha<=1);}
 assert.equal(arrivalPulse(-1).alpha,0);
});
