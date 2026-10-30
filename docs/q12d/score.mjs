// Original CURSEBREAK score. Beats are quarter notes; bar/beat offsets are zero-based.
// Tuple: [beat, MIDI pitch (null = explicit rest), gate in beats, velocity 0..1].
export const BPM = 140;
export const RATE = 44100;
export const presets = {
  bass: { gain: .19, attack: .004, decay: .09, sustain: .55, release: .055, cutoff: 650 },
  pad: { gain: .065, attack: .08, decay: .22, sustain: .65, release: .20, cutoff: 1250 },
  stab: { gain: .075, attack: .005, decay: .08, sustain: .26, release: .08, cutoff: 1600 },
  lead: { gain: .105, attack: .008, decay: .10, sustain: .48, release: .11, cutoff: 2300 },
  bell: { gain: .052, attack: .004, decay: .12, sustain: .20, release: .16, cutoff: 2000 },
  kick: { gain: .29, attack: .002, decay: .07, sustain: 0, release: .03, cutoff: 1800 },
  snare: { gain: .12, attack: .002, decay: .07, sustain: 0, release: .04, cutoff: 3800 },
  hat: { gain: .028, attack: .001, decay: .018, sustain: 0, release: .015, cutoff: 6500 },
};
const chords = [[50,57,65],[50,57,64],[46,53,62],[46,57,62],[48,55,64],[48,55,62],[45,52,60],[45,55,60]];
const bossChords = [[50,57,65],[50,57,65],[46,53,62],[46,53,62],[43,50,58],[43,50,58],[45,50,64],[45,52,60]];
// D–F–E–A call, descending answer, expansion, then dominant turnaround.
const arenaLead = [
 [[0,74,.65,.84],[1,77,.4,.73],[1.75,76,.2,.6],[2.5,81,.85,.8],[3.5,null,.5,0]],
 [[.5,79,.4,.7],[1.25,77,.5,.65],[2,76,.4,.65],[3,74,.6,.76]],
 [[0,74,.7,.78],[1.5,77,.4,.7],[2.25,81,.45,.75],[3,77,.6,.65]],
 [[.5,74,.45,.7],[1.25,72,.45,.6],[2.5,69,.65,.7]],
 [[0,76,.6,.78],[1,79,.4,.65],[1.75,77,.2,.62],[2.5,76,.8,.74]],
 [[.5,74,.5,.68],[1.5,72,.4,.6],[2.5,79,.4,.7],[3.25,76,.35,.6]],
 [[0,76,.6,.78],[1,77,.35,.7],[1.75,76,.2,.62],[2.5,81,.7,.8]],
 [[0,79,.35,.65],[.75,76,.4,.64],[1.5,72,.4,.62],[2.5,69,.5,.75],[3.5,null,.5,0]],
];
// Warden: low repeated D, a chained F–E pair, then a delayed octave-A answer.
const wardenLead = [
 [[0,62,.75,.95],[1.5,62,.3,.7],[2,65,.35,.8],[2.75,64,.3,.7],[3.5,69,.25,.87]],
 [[0,null,1,0],[1,69,.9,.85],[2.5,67,.4,.65],[3.25,65,.4,.7]],
 [[0,62,.85,.9],[1.5,65,.4,.75],[2.5,69,.6,.85]],
 [[.5,70,.4,.7],[1.5,69,.4,.75],[2.5,65,.7,.85]],
 [[0,67,.7,.85],[1.25,65,.35,.7],[2,62,.7,.9]],
 [[.5,70,.4,.7],[1.5,69,.4,.7],[2.5,67,.5,.8],[3.5,65,.2,.65]],
 [[0,62,.6,.88],[1,65,.35,.78],[1.75,64,.25,.72],[2.5,69,.8,.9]],
 [[.5,64,.35,.78],[1.25,61,.4,.7],[2,57,.65,.82],[3,null,1,0]],
];
function piece(id,bars,loop=true) { return {id,bars,loop,events:[]}; }
function note(p,bar,instrument,tuple) { const [beat,pitch,duration,velocity]=tuple; p.events.push({beat:bar*4+beat,instrument,pitch,duration,velocity}); }
function chord(p,bar,inst,beat,voicing,duration,velocity) { for(const pitch of voicing) note(p,bar,inst,[beat,pitch,duration,velocity]); }
function drums(p,b,boss=false) {
 const fill=b%4===3, end=b%8===7;
 for(const beat of (boss ? [0,.75,2,2.75] : [0,1.5,2.5])) note(p,b,'kick',[beat,36,.35,beat===0?.95:.72]);
 for(const beat of [1,3]) note(p,b,'snare',[beat,38,.22,.76]);
 for(const beat of [0.5,1.5,2.5,3.5]) note(p,b,'hat',[beat,42,.08,beat===1.5?.45:.64]);
 if(fill) for(const beat of (end?[3.25,3.5,3.75]:[3.75])) note(p,b,'snare',[beat,38,.13,beat===3.75?.57:.34]);
}
export function compose() {
 const base=piece('arena-base',16), tension=piece('tension',8), anomaly=piece('anomaly',8), boss=piece('boss-core',16), enraged=piece('enraged',8), victory=piece('victory',3,false), defeat=piece('defeat',3,false);
 for(let b=0;b<16;b++) {
  for(const [p,cs,mel,isBoss] of [[base,chords,arenaLead,false],[boss,bossChords,wardenLead,true]]) {
   const c=cs[b%8], root=c[0]-12;
   drums(p,b,isBoss);
   const rhythm=b%4===3?[0,.75,1.5,2.5,3.25]:b%2?[0,.5,1.5,2.25,3]:[0,.75,1.5,2,3.25];
   rhythm.forEach((beat,i)=>note(p,b,'bass',[beat,root+(i===3?12:0),.28,i===0?.92:.67]));
   chord(p,b,'pad',0,c,2.9,.65);
   chord(p,b,'stab',b%2?2.75:3.25,c.map(n=>n+12),.25,.55);
   for(const tuple of mel[b%8]) note(p,b,'lead',tuple.map((n,i)=>i===3&&b>=8?n*.9:n));
   if(b===11||b===15) note(p,b,'bell',[3.5,isBoss?81:86,.2,.55]);
  }
 }
 for(let b=0;b<8;b++) {
  const c=chords[b], bc=bossChords[b];
  // Sparse offbeat answering chord tones; second half grows without a second bassline.
  [0.5,1.75,2.5,3.5].forEach((beat,i)=>note(tension,b,'stab',[beat,c[(i+b)%3]+12,.18,(b>=4?.62:.48)*(i%2?.8:1)]));
  if(b%4===3) [2.75,3.25,3.75].forEach((beat,i)=>note(tension,b,'hat',[beat,42,.06,.4+i*.06]));
  // Fractured 3+3+2 eighth-note accents with rests between responses.
  [0.25,1.75,3.25].forEach((beat,i)=>note(anomaly,b,'bell',[beat,c[(i+1)%3]+24,.22,b%2?.58:.72]));
  note(anomaly,b,'bell',[b%2?2.5:.75,c[0]+19,.15,.37]);
  [0,.75,1.5,2.25,3,3.5].forEach((beat,i)=>note(enraged,b,'stab',[beat,bc[i%3]+12,.16,i%3===0?.74:.48]));
  // Eb is a short upper neighbour resolving to D, only above D/G roots; never over A.
  if([0,1,4,5].includes(b)) { note(enraged,b,'bell',[2.75,75,.12,.65]); note(enraged,b,'bell',[3,74,.32,.6]); }
  if(b%4===3) for(const beat of [2.5,3.25,3.75]) note(enraged,b,'snare',[beat,38,.13,.45]);
 }
 // Victory: recognizable motif, Bb→C→Dm cadence, then a full beat of silence.
 for(const [b,c] of [[0,[58,62,65]],[1,[60,64,67]],[2,[50,57,62,65]]]) chord(victory,b,'pad',0,c,b===2?2.3:2.9,.85);
 for(const t of [[0,74,.7,.9],[1,77,.5,.8],[2,76,.4,.75],[3,81,.6,.9]]) note(victory,0,'lead',t);
 for(const t of [[0,79,.7,.8],[1.5,84,.7,.85],[3,81,.6,.8]]) note(victory,1,'lead',t);
 note(victory,2,'lead',[0,86,1.5,.9]); note(victory,0,'kick',[0,36,.4,.8]);note(victory,2,'kick',[0,36,.4,.9]);
 // Defeat: motif contracts downward, unresolved E/A to a low D minor close.
 for(const t of [[0,74,.8,.8],[1.25,77,.55,.7],[2.25,76,1,.65]]) note(defeat,0,'lead',t);
 note(defeat,1,'lead',[0,69,1.25,.65]);note(defeat,1,'lead',[2,64,.6,.5]);
 chord(defeat,0,'pad',0,[50,57,65],3,.6);chord(defeat,1,'pad',0,[45,52,60],3,.6);chord(defeat,2,'pad',0,[38,45,53],2.2,.7);
 note(defeat,2,'bass',[0,26,2,.6]);
 return [base,tension,anomaly,boss,enraged,victory,defeat];
}
