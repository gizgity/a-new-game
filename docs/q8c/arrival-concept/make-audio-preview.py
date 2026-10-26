"""Review-only procedural sketch. Not a runtime asset or approved final mix."""
from pathlib import Path
import math, random, struct, wave, json
rng=random.Random(83); rate=44100;duration=2.0;data=[0.0]*int(rate*duration)
for beat,gain in enumerate([.32,.46,.66,.90]):
 start=.10+beat*.5
 for i in range(int(.38*rate)):
  t=i/rate;k=int(start*rate)+i
  if k>=len(data):break
  attack=min(1,t/.008)
  thump=(math.sin(2*math.pi*(76*t-24*t*t))*.20+math.sin(2*math.pi*152*t)*.055)*math.exp(-t*12)
  chain=(math.sin(2*math.pi*1187*t)*.07+math.sin(2*math.pi*1921*t)*.05+math.sin(2*math.pi*2857*t)*.025)*math.exp(-t*25)
  friction=(rng.random()*2-1)*.025*math.exp(-t*40)
  data[k]+=gain*attack*(thump+chain+friction)
# Fade exactly at2s; no audio tail extending into the existing Boss cue.
for i in range(len(data)):data[i]*=min(1,(len(data)-1-i)/(rate*.025))
folder=Path(__file__).resolve().parent
with wave.open(str(folder/'arrival-audio-sketch-v1.wav'),'wb') as f:
 f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(struct.pack('<h',round(max(-1,min(1,x))*32767)) for x in data))
(folder/'audio-preview.json').write_text(json.dumps({'status':'CONCEPT ONLY; awaiting user approval','source':'Original offline procedural synthesis, no external samples','seconds':duration,'pulseTimes':[.10,.60,1.10,1.60],'relativeGain':[.32,.46,.66,.9],'peak':max(abs(x) for x in data),'sampleRate':rate,'scope':'Low thump + metallic chain tension; review without gameplay mix. Mute/volume integration not implemented.'},indent=2)+'\n')
