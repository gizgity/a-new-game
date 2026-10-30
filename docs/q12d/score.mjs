// V2: original synth-rock arrangement. 0-based bar/quarter-beat timing.
// Tuple [beat, MIDI pitch|null for a written rest, gate beats, velocity0..1].
export const BPM = 156;
export const RATE = 44100;
export const REVISION = 'V2 synth-rock';
export const presets = {
 bass:{gain:.21,attack:.003,decay:.08,sustain:.62,release:.025,cutoff:950},
 riff:{gain:.09,attack:.003,decay:.055,sustain:.52,release:.018,cutoff:2450},
 pad:{gain:.035,attack:.035,decay:.12,sustain:.5,release:.055,cutoff:1000},
 stab:{gain:.075,attack:.003,decay:.055,sustain:.42,release:.025,cutoff:1900},
 lead:{gain:.115,attack:.004,decay:.065,sustain:.65,release:.045,cutoff:2900},
 bell:{gain:.065,attack:.003,decay:.045,sustain:.3,release:.035,cutoff:1800},
 kick:{gain:.34,attack:.0015,decay:.13,sustain:0,release:.02,cutoff:2200},
 snare:{gain:.21,attack:.002,decay:.105,sustain:0,release:.025,cutoff:4200},
 hat:{gain:.025,attack:.001,decay:.024,sustain:0,release:.012,cutoff:6000},
};
// One shared harmony per family, repeated exactly in both 8-bar halves.
export const arenaRoots=[38,38,34,34,36,36,33,33]; // D D Bb Bb C C A A
export const bossRoots=[38,38,34,34,31,31,33,33]; // D D Bb Bb G G A A
const arenaLead=[
 [[0,74,.55,.9],[.75,77,.3,.78],[1.5,76,.18,.7],[2,81,.72,.9],[3,null,1,0]],
 [[0,81,.4,.85],[.75,77,.35,.76],[1.5,74,.35,.8],[2.25,86,.5,.88],[3,null,1,0]],
 [[0,74,.55,.85],[1,77,.35,.8],[1.75,82,.35,.86],[2.5,77,.3,.75],[3.25,null,.75,0]],
 [[0,77,.35,.8],[.75,74,.35,.75],[1.5,70,.6,.84],[2.5,77,.3,.74],[3.25,null,.75,0]],
 [[0,76,.5,.87],[.75,79,.35,.76],[1.5,84,.55,.9],[2.5,79,.3,.75],[3.25,null,.75,0]],
 [[0,79,.35,.8],[.75,76,.35,.76],[1.5,74,.18,.65],[2,72,.7,.87],[3,null,1,0]],
 [[0,76,.4,.85],[.75,81,.35,.8],[1.5,84,.5,.87],[2.5,81,.3,.74],[3.25,null,.75,0]],
 [[0,76,.35,.8],[.75,72,.35,.76],[1.5,69,.65,.88],[2.5,76,.3,.73],[3.25,null,.75,0]],
];
const wardenLead=[
 [[0,62,.55,.96],[.75,65,.28,.83],[1.5,64,.18,.74],[2,69,.65,.92],[3,null,1,0]],
 [[0,62,.28,.9],[.5,62,.28,.73],[1.5,69,.6,.9],[2.5,65,.28,.8],[3.25,null,.75,0]],
 [[0,62,.65,.92],[1.25,65,.3,.8],[2,70,.65,.9],[3,null,1,0]],
 [[0,70,.3,.85],[.75,65,.3,.8],[1.5,62,.7,.9],[2.5,58,.28,.78],[3.25,null,.75,0]],
 [[0,67,.55,.9],[.75,70,.3,.8],[1.5,69,.18,.7],[2,74,.65,.9],[3,null,1,0]],
 [[0,67,.3,.85],[.5,67,.28,.7],[1.5,70,.5,.84],[2.5,62,.28,.78],[3.25,null,.75,0]],
 [[0,64,.55,.88],[1,69,.3,.82],[1.75,72,.35,.85],[2.5,69,.28,.76],[3.25,null,.75,0]],
 [[0,64,.3,.84],[.75,60,.3,.76],[1.5,57,.65,.9],[2.5,64,.28,.78],[3.25,null,.75,0]],
];
function piece(id,bars,loop=true){return {id,bars,loop,events:[]};}
function note(p,bar,instrument,tuple){const [beat,pitch,duration,velocity]=tuple;p.events.push({beat:bar*4+beat,instrument,pitch,duration,velocity});}
function chord(p,b,inst,beat,pitches,duration,velocity){for(const pitch of pitches)note(p,b,inst,[beat,pitch,duration,velocity]);}
function power(p,b,inst,beat,root,duration,velocity){chord(p,b,inst,beat,[root,root+7],duration,velocity);}
function drums(p,b,boss){
 const fill=b%4===3,end=b%8===7;
 for(const beat of (boss?[0,.5,1.75,2,2.5]:[0,.5,1.5,2,2.75]))note(p,b,'kick',[beat,36,.38,beat%2===0?.96:.68]);
 for(const beat of [1,3])note(p,b,'snare',[beat,38,.32,.92]);
 for(const beat of [0,.5,1,1.5,2,2.5,3,3.5])note(p,b,'hat',[beat,42,.1,beat%1===0?.43:.64]);
 if(fill)for(const beat of (end?[2.75,3.25,3.5,3.75]:[3.5,3.75]))note(p,b,'snare',[beat,38,.16,beat===3.75?.65:.4]);
}
export function compose(){
 const base=piece('arena-base',16),tension=piece('tension',8),anomaly=piece('anomaly',8),boss=piece('boss-core',16),enraged=piece('enraged',8),victory=piece('victory',3,false),defeat=piece('defeat',3,false);
 for(let b=0;b<16;b++)for(const [p,roots,mel,isBoss] of [[base,arenaRoots,arenaLead,false],[boss,bossRoots,wardenLead,true]]){
  const root=roots[b%8];drums(p,b,isBoss);
  // Palm-muted, straight-eighth power riff: fifth accents, a breath on beat4.
  const rhythm=b%4===3?[0,.5,1,1.5,2,2.5]:[0,.5,1,1.5,2,2.5,3];
  rhythm.forEach((beat,i)=>{
   note(p,b,'bass',[beat,root+(i===5?12:0),i%2?.27:.34,i%4===0?.9:.7]);
   power(p,b,'riff',beat,root+12,isBoss?.22:.26,i%4===0?.85:.62);
  });
  // Open fifth pad avoids rubbing a sustained F against the motif's passing E.
  power(p,b,'pad',0,root+12,2.7,.6);
  for(const [beat,pitch,gate,velocity] of mel[b%8])note(p,b,'lead',[beat,pitch,gate,velocity*(b>=8?.94:1)]);
  // Second 8-bar phrase: written octave answers in the same rest windows as overlays.
  if(b===11||b===15)note(p,b,'lead',[3.5,root+24,.16,.67]);
 }
 for(let b=0;b<8;b++){
  const root=arenaRoots[b],br=bossRoots[b];
  // Rhythmic fifth reinforcement, no independent thirds or competing melody.
  for(const beat of (b<4?[.5,2.5]:[.5,1.5,2.5]))power(tension,b,'stab',beat,root+24,.18,beat===2.5?.72:.58);
  if(b%4===3)for(const beat of [3.25,3.75])note(tension,b,'hat',[beat,42,.08,.45]);
  // Root/octave response only in the lead's written final-beat rest.
  note(anomaly,b,'bell',[3.25,root+36,.16,b%2?.63:.78]);
  if(b%2)note(anomaly,b,'bell',[3.75,root+48,.1,.5]);
  // Boss reinforcement in a distinct syncopated rhythm, same root/fifth harmony.
  for(const beat of [.25,1.25,2.25])power(enraged,b,'stab',beat,br+24,.16,beat===2.25?.77:.6);
  if(b===0||b===4){
   // Core melody is silent here. Brief Eb neighbour over D/G, then D resolution.
   note(enraged,b,'bell',[3,75,.09,.52]);note(enraged,b,'bell',[3.25,74,.22,.68]);
  }else note(enraged,b,'bell',[3.25,br+36,.18,.63]);
  if(b%4===3)for(const beat of [3.25,3.75])note(enraged,b,'snare',[beat,38,.14,.43]);
 }
 // Dedicated one-shot cadences; no overlay at results.
 for(const [b,c] of [[0,[58,62,65]],[1,[60,64,67]],[2,[50,57,62,65]]])chord(victory,b,'pad',0,c,b===2?2.1:2.8,.9);
 for(const t of [[0,74,.5,.9],[.75,77,.35,.8],[1.5,76,.18,.7],[2,81,.6,.9]])note(victory,0,'lead',t);
 for(const t of [[0,79,.5,.85],[1,84,.6,.9],[2.5,81,.4,.8]])note(victory,1,'lead',t);
 note(victory,2,'lead',[0,86,1.5,.9]);note(victory,0,'kick',[0,36,.4,.8]);note(victory,2,'kick',[0,36,.4,.9]);power(victory,2,'riff',0,50,1,.7);
 for(const t of [[0,74,.65,.8],[1,77,.4,.7],[2,76,.6,.65]])note(defeat,0,'lead',t);
 note(defeat,1,'lead',[0,69,1,.7]);note(defeat,1,'lead',[2,64,.5,.55]);
 chord(defeat,0,'pad',0,[50,57,65],2.8,.8);chord(defeat,1,'pad',0,[45,52,60],2.8,.8);chord(defeat,2,'pad',0,[38,45,53],2,.85);note(defeat,2,'bass',[0,26,1.8,.7]);
 return [base,tension,anomaly,boss,enraged,victory,defeat];
}
