"""Register alpha bounds in an ImageGen PRODUCTION grid. Bitmap copied unchanged, never redrawn."""
from pathlib import Path
from PIL import Image
import json,hashlib,shutil,sys
source=Path(sys.argv[1]);root=Path(__file__).resolve().parent
im=Image.open(source).convert('RGBA');w,h=im.size;assert w==h
alpha=im.getchannel('A');assert alpha.getextrema()==(0,255)
names=['scar','ripple','hunterEye','chainRim','crown','fractureFork','penaltyTick','chainSnap','pulseBurst'];frames={};records=[]
for i,name in enumerate(names):
 x=round(i%3*w/3);y=round(i//3*h/3);r=round((i%3+1)*w/3);b=round((i//3+1)*h/3)
 box=alpha.crop((x,y,r,b)).point(lambda a:255 if a>8 else 0).getbbox();assert box,name
 l,t,rr,bb=box;assert min(l,t,r-x-rr,b-y-bb)>3,(name,box,'missing transparent gutters')
 frame={'x':x+l-2,'y':y+t-2,'w':rr-l+4,'h':bb-t+4}
 frames[name]={'frame':frame,'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':frame['w'],'h':frame['h']},'sourceSize':{'w':frame['w'],'h':frame['h']}}
 records.append({'name':name,'cell':i,'alphaBounds':box,'frame':frame})
target=Path('public/assets/vfx/ascension-motifs.png');shutil.copyfile(source,target)
Path('public/assets/vfx/ascension-motifs.json').write_text(json.dumps({'frames':frames,'meta':{'image':target.name,'size':{'w':w,'h':h},'scale':'1','app':'Q9D production alpha registration, original bitmap unchanged'}},indent=2)+'\n')
(root/'source/registration.json').write_text(json.dumps({'source':str(source),'runtime':str(target),'dimensions':[w,h],'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'alphaExtrema':alpha.getextrema(),'method':'Original production PNG copied byte-for-byte. Metadata registers alpha>8 bounds with2pxgutter. No concept board crops, bitmap redraw or procedural artwork.','frames':records},indent=2)+'\n')
print('PASS9 productionframes/gutters/alpha; originalbitmapunchanged',w,h)
