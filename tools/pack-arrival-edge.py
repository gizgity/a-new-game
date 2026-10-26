"""Normalize dedicated ImageGen edge strip. Never extracts concept board artwork."""
from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[1];src=root/'docs/q8c/arrival-runtime/source/arrival-edge-production-v1.png'
im=Image.open(src).convert('RGBA');box=im.getbbox();rows=[]
for y in range(box[1],box[3]):
 rows.append((sum((r+g+b)*a for r,g,b,a in [im.getpixel((x,y)) for x in range(0,im.width,4)]),y))
seam=max(rows)[1];bounds=(0,max(box[1],seam-6),im.width,min(box[3],seam+82));tile=im.crop(bounds).resize((512,32),Image.Resampling.LANCZOS)
out=root/'public/assets/arena/arrival-edge.png';tile.save(out,optimize=True)
manifest={'tool':'OpenAI ImageGen','rights':'Generated for project from own approved Q8C concept reference','sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'sourceBytes':src.stat().st_size,'processing':'Find brightest horizontal seam, keep lower/inward glow only, normalize512x32 with Lanczos. No drawing/body art, no concept board crop.','sourceCrop':bounds,'runtimeSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'runtimeBytes':out.stat().st_size,'decodedRGBABytes':512*32*4,'approval':'User ok,làmđi approving V2 + audio sketch before implementation; runtime awaits playtest'}
(root/'docs/q8c/arrival-runtime/source/asset.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print(json.dumps(manifest))
