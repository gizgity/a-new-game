// Review-only build. Production vite.config.ts and Pages entry points stay untouched.
import {defineConfig} from 'vite';
import fs from 'node:fs';
import path from 'node:path';
export default defineConfig({base:'./',build:{outDir:'/tmp/cursebreak-q12d-review',emptyOutDir:true,copyPublicDir:false,rollupOptions:{input:{music:'docs/q12d/index.html',sfx:'audition.html'}}},plugins:[{name:'review-assets',closeBundle(){const out='/tmp/cursebreak-q12d-review/docs/q12d';fs.mkdirSync(out,{recursive:true});fs.cpSync('docs/q12d/audio',path.join(out,'audio'),{recursive:true});for(const f of ['README.md','manifest.json'])fs.copyFileSync(`docs/q12d/${f}`,path.join(out,f));}}]});
