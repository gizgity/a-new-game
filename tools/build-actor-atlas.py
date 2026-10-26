"""Pack dedicated ImageGen sprite sources; no body drawing or runtime art generation.
Requires Pillow/numpy/scipy in the build workspace only (not game dependencies).
"""
from pathlib import Path
import hashlib,json,math
import numpy as np
from scipy import ndimage
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/q7c/source'
OUT=ROOT/'public/assets/actors'
DIRECTIONS=['south','east','north','west']
STATES=['idle','move','windup','attack','recovery','hit','death']
SPECS=[('player',40,96),('grunt',36,80),('archer',38,80),('volatile',36,64),('bulwark',50,96),('chain-warden',76,192),('player-actions',40,96),('boss-patterns',76,192)]
frames=[];sources=[];report=[]
for name,height,box in SPECS:
 path=SOURCE/f'{name}-production-v1.png';rgba=np.array(Image.open(path).convert('RGBA'));h,w=rgba.shape[:2]
 states=['light1','light2','light3','heavy','shoot','charged','dash','dash-exit'] if name=='player-actions' else [f'{p}-{s}' for p in ['sweep','ring','slam'] for s in ['windup','attack','recovery']] if name=='boss-patterns' else STATES
 cols=len(states);labels,count=ndimage.label(rgba[:,:,3]>=192,np.ones((3,3)))
 groups={(r,c):[] for r in range(4) for c in range(cols)}
 for i,sl in enumerate(ndimage.find_objects(labels),1):
  if sl is None:continue
  yy,xx=np.nonzero(labels[sl]==i)
  if len(xx)<32:continue
  xx=xx+sl[1].start;yy=yy+sl[0].start
  # Preserve whole connected limbs/weapons across cell edges, rather than cutting grids.
  row=min(3,int(float(yy.mean())/(h/4)));col=min(cols-1,int(float(xx.mean())/(w/cols)))
  groups[row,col].append((yy,xx))
 for r,direction in enumerate(DIRECTIONS):
  reference=groups[r,2 if name=='boss-patterns' else 0]
  ry=np.concatenate([x[0] for x in reference]);scale=height/(int(ry.max())-int(ry.min())+1)
  for c,state in enumerate(states):
   parts=groups[r,c]
   if not parts:raise ValueError(f'Empty source {name} {direction} {state}')
   yy=np.concatenate([p[0] for p in parts]);xx=np.concatenate([p[1] for p in parts]);x0,x1=int(xx.min()),int(xx.max())+1;y0,y1=int(yy.min()),int(yy.max())+1
   cell=np.zeros((y1-y0,x1-x0,4),np.uint8);cell[yy-y0,xx-x0]=rgba[yy,xx];cell[:,:,3]=np.where(cell[:,:,3]>=192,255,0)
   # Single scale per row preserves body proportions across poses; extra-wide weapon padding.
   k=min(scale,(box-4)/(x1-x0),(box-8)/(y1-y0));tw=max(1,round((x1-x0)*k));th=max(1,round((y1-y0)*k))
   im=Image.fromarray(cell).resize((tw,th),Image.Resampling.NEAREST)
   tile=Image.new('RGBA',(box,box));ground=box//2+(12 if name.startswith('player') else height//2)
   if th>ground-2:
    k=(ground-2)/(y1-y0);tw=max(1,round((x1-x0)*k));th=ground-2;im=Image.fromarray(cell).resize((tw,th),Image.Resampling.NEAREST)
   anchor=float(xx[yy>=y1-max(3,round((y1-y0)*.12))].mean())
   left=round(box/2-(anchor-x0)*k)
   left=max(2,min(box-tw-2,left))
   tile.alpha_composite(im,(left,ground-th))
   actor='boss' if name in ['chain-warden','boss-patterns'] else 'player' if name=='player-actions' else name
   key=f'{actor}/{direction}/{state}';frames.append((key,tile));report.append(dict(key=key,source=path.name,rect=[x0,y0,x1-x0,y1-y0],scale=round(k,4),box=box))
 sources.append(dict(file=f'docs/q7c/source/{path.name}',width=w,height=h,bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
# Trim only transparent padding; preserve sourceSize/registration in Phaser's atlas metadata.
packed=[]
for key,tile in frames:
 bounds=tile.getbbox()
 if not bounds:raise ValueError(f'Empty tile {key}')
 packed.append((key,tile.crop(bounds),bounds,tile.width))
packed.sort(key=lambda entry:entry[1].height,reverse=True)
atlas=Image.new('RGBA',(1024,2048));meta={};x=y=rowh=0
for key,tile,bounds,size in packed:
 tw,th=tile.size
 if x+tw+2>1024:x=0;y+=rowh;rowh=0
 if y+th+2>2048:raise ValueError('Atlas overflow')
 atlas.alpha_composite(tile,(x,y));meta[key]={'frame':{'x':x,'y':y,'w':tw,'h':th},'rotated':False,'trimmed':True,'spriteSourceSize':{'x':bounds[0],'y':bounds[1],'w':tw,'h':th},'sourceSize':{'w':size,'h':size}}
 x+=tw+2;rowh=max(rowh,th+2)
used_height=2**math.ceil(math.log2(y+rowh));atlas=atlas.crop((0,0,1024,used_height))
OUT.mkdir(parents=True,exist_ok=True);atlas.save(OUT/'occult-actors.png',optimize=True)
(OUT/'occult-actors.json').write_text(json.dumps({'frames':meta,'meta':{'image':'occult-actors.png','size':{'w':1024,'h':used_height},'scale':'1'}},separators=(',',':'))+'\n')
manifest=dict(approval={'date':'2026-10-26','user':'visual approved q7c'},sources=sources,processing='ImageGen art; offline connected-alpha extraction threshold192/min32pixels, per-row size normalization, nearest resize, foot registration, transparent-padding trim with Phaser metadata and PNG atlas packing. No procedural drawing. Original sources preserved.',runtime={'file':'public/assets/actors/occult-actors.png','sha256':hashlib.sha256((OUT/'occult-actors.png').read_bytes()).hexdigest(),'bytes':(OUT/'occult-actors.png').stat().st_size,'width':1024,'height':used_height,'frames':len(meta),'decodedRGBABytes':1024*used_height*4},frames=report)
(ROOT/'docs/q7c/runtime-assets.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(manifest['runtime']))
