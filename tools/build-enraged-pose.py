"""Pack the first dedicated ImageGen Enraged transform pose; no procedural body art."""
from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[1]
p=root/'docs/q8c/source/enraged-v1.png'
im=Image.open(p).convert('RGBA');im=im.crop((0,0,im.width//4,im.height));im=im.crop(im.getbbox());im.thumbnail((140,76),Image.Resampling.LANCZOS)
tile=Image.new('RGBA',(192,192));tile.alpha_composite(im,((192-im.width)//2,134-im.height));tile.save(root/'public/assets/actors/enraged-transform.png',optimize=True)
(root/'docs/q8c/source/asset.json').write_text(json.dumps({'source':'enraged-v1.png','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'tool':'OpenAI ImageGen','rights':'Generated for this project; Q7C reference from repository','processing':'First front-facing production transform pose, alpha trim, downsample to 76px, 192px box with Q7C foot pivot134. Other generated views unused. Not a concept crop.','runtime':'public/assets/actors/enraged-transform.png','approval':'AWAITING USER PLAYTEST APPROVAL; task authorizes Q8C implementation/deploy, no separate visual acceptance claimed'},indent=2)+'\n')
