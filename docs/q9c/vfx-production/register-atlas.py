"""Register alpha bounds of a generated PRODUCTION grid; never redraw or crop bitmap pixels."""
from pathlib import Path
import sys,json,hashlib,shutil
from PIL import Image
source=Path(sys.argv[1]);root=Path(__file__).resolve().parent;target=Path('public/assets/vfx/anomaly-motifs.png')
im=Image.open(source).convert('RGBA');width,height=im.size
assert width==height,(width,height)
alpha=im.getchannel('A');assert alpha.getextrema()==(0,255),'Missing genuine transparent background'
names=['stormRune','stormBolt','groundCracks','groundBurst','bloodCrescent','energy','pursuit','staticArc','forkShot','sealBreak','resistance','relay','echoArcs','bracket','sparks','echoRune']
# Actual transparent gutter midpoints, measured from final ImageGen source, not assumed square cells.
columns=[0,326,643,934,width];rows=[0,369,671,929,height]
assert (width,height)==(1254,1254),(width,height)
frames={};measure=[]
for i,name in enumerate(names):
 x=columns[i%4];y=rows[i//4];endx=columns[i%4+1];endy=rows[i//4+1];cw=endx-x;ch=endy-y;cell=alpha.crop((x,y,endx,endy))
 box=cell.point(lambda a:255 if a>8 else 0).getbbox();assert box,(i,name)
 l,t,r,b=box;pad=2;l=max(0,l-pad);t=max(0,t-pad);r=min(cw,r+pad);b=min(ch,b+pad)
 assert l>0 and t>0 and r<cw and b<ch,(name,'cell gutter overflow',box)
 frame={'x':x+l,'y':y+t,'w':r-l,'h':b-t};frames[name]={'frame':frame,'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':r-l,'h':b-t},'sourceSize':{'w':r-l,'h':b-t}}
 measure.append({'frame':name,'cell':i,'alphaBounds':list(box),'registered':frame})
shutil.copyfile(source,target)
Path('public/assets/vfx/anomaly-motifs.json').write_text(json.dumps({'frames':frames,'meta':{'image':'anomaly-motifs.png','size':{'w':width,'h':height},'scale':'1','app':'Q9C VFX production grid registration'}},indent=2)+'\n')
shutil.copyfile(source,root/'source/atlas-v1.png')
(root/'source/registration.json').write_text(json.dumps({'source':str(source),'runtime':str(target),'width':width,'height':height,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'alphaExtrema':alpha.getextrema(),'method':'Original ImageGen production PNG copied unchanged. Metadata registers per-cell alpha bounds>8 with2px transparent gutter; no bitmap editing, no concept-board crops, no procedural artwork.','columnCuts':columns,'rowCuts':rows,'frames':measure},indent=2)+'\n')
print('PASS alpha registration:',width,height,'16frames, gutters; original bitmap unchanged')
