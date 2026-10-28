"""Register original ImageGen production alpha regions; bitmap remains byte-for-byte unchanged."""
from pathlib import Path
from PIL import Image
import json,hashlib,shutil
root=Path(__file__).resolve().parent;source=root/'source/trails-v1.png'
im=Image.open(source).convert('RGBA');w,h=im.size;a=im.getchannel('A');assert a.getextrema()[0]==0 and a.getextrema()[1]>240
frames={};records=[]
for i,name in enumerate(['fire','water','lightning','ice','shadow','wind']):
 x=round(i%3*w/3);y=round(i//3*h/2);r=round((i%3+1)*w/3);b=round((i//3+1)*h/2)
 box=a.crop((x,y,r,b)).point(lambda n:255 if n>8 else 0).getbbox();assert box
 l,t,rr,bb=box;assert min(l,t,r-x-rr,b-y-bb)>=4,(name,box)
 frame={'x':x+l-2,'y':y+t-2,'w':rr-l+4,'h':bb-t+4}
 frames[name]={'frame':frame,'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':frame['w'],'h':frame['h']},'sourceSize':{'w':frame['w'],'h':frame['h']}}
 records.append({'id':name,'cell':i,'alphaBounds':box,'frame':frame})
target=Path('public/assets/vfx/elemental-trails.png');shutil.copyfile(source,target)
Path('public/assets/vfx/elemental-trails.json').write_text(json.dumps({'frames':frames,'meta':{'image':target.name,'size':{'w':w,'h':h},'scale':'1','app':'Q9E original production PNG alpha registration'}},indent=2)+'\n')
(root/'source/registration.json').write_text(json.dumps({'source':str(source),'runtime':str(target),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'dimensions':[w,h],'decodedBytes':w*h*4,'alphaExtrema':a.getextrema(),'method':'PNG copied byte-for-byte; metadata alpha>8 bounds+2px padding, no artwork redraw/crop/alpha edits. Independent production source, not concept board.','frames':records},indent=2)+'\n')
print('PASS six frames, true alpha, gutters, unchanged bitmap',w,h)
