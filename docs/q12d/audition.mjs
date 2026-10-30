// Isolated review transport. No imports from gameplay, profile, saves or RNG.
const dictionary={
 vi:{intro:'V2 · Synth-rock nguyên bản · 156 BPM · 4/4 · D minor. Phase A V2 đã duyệt; Phase B chờ duyệt production. Chọn bài để nghe; mọi layer bắt đầu cùng downbeat. Không ghi tiến trình.',combos:'Tổ hợp đồng bộ',volume:'Âm lượng nhạc',stop:'Dừng tất cả',compare:'So sánh SFX đã duyệt',compareHint:'Nghe nhạc riêng rồi nhấn Combat hoặc Arrival để nghe chồng với SFX thật bên dưới. Arrival dùng bài warning gốc Q8C trong crowd; phát lại nhạc không đổi nhịp warning. Các nút trong khung vẫn dùng được. Khởi động lại bài để so A/B, không có loudness matching. Đổi tab sẽ dừng, không tự tiếp tục.',combat:'Combat SFX',arrival:'Arrival Q8C + crowd',loading:'Đang tải…',playing:'Đang phát',stopped:'Đã dừng',error:'Không phát được; kiểm tra server và hỗ trợ Web Audio/WAV.',sfxLoading:'SFX đang tải, thử lại sau.',version:'Bản phối (đổi bản khởi động lại downbeat)',mute:'Tắt',solo:'Solo',stems:'Điều khiển stem',perfect:'Perfect Dodge SFX',codec:'Codec: FLAC → WAV fallback'},
 en:{intro:'V2 · Original synth-rock prototype · 156 BPM · 4/4 · D minor. Phase A V2 approved; Phase B awaiting production approval. Select a piece; all layers start on the same downbeat. No progression writes.',combos:'Synchronized combinations',volume:'Music volume',stop:'Stop all',compare:'Compare accepted SFX',compareHint:'Listen to music alone, then press Combat or Arrival to overlay the actual SFX below. Arrival uses the original Q8C warning in crowd; restarting music does not retime the warning. Embedded controls also work. Restart for A/B; no loudness matching. Hiding the tab stops playback with no auto-resume.',combat:'Combat SFX',arrival:'Arrival Q8C + crowd',loading:'Loading…',playing:'Playing',stopped:'Stopped',error:'Playback failed; check server and Web Audio/WAV support.',sfxLoading:'SFX loading; try again shortly.',version:'Mix (switch restarts on downbeat)',mute:'Mute',solo:'Solo',stems:'Stem controls',perfect:'Perfect Dodge SFX',codec:'Codec: FLAC → WAV fallback'}};
let locale='vi';const t=k=>dictionary[locale][k];
function translate(){document.documentElement.lang=locale;document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));}
translate();document.querySelector('#lang').onclick=()=>{locale=locale==='vi'?'en':'vi';translate();controls();};
const ids=['arena-base','tension','anomaly','boss-core','enraged','victory','defeat'];
const loops=new Set(ids.slice(0,5));const cache=new Map();let context,gain,sources=[],generation=0,selection=[],version='b',startedAt=0;
const stemGains=new Map(),muted=new Set(),solo=new Set(),codecs=new Map();
function updateStems(){for(const [id,g] of stemGains)g.gain.setTargetAtTime(!muted.has(id)&&(!solo.size||solo.has(id))?1:0,context.currentTime,.008);}
function controls(){const el=document.querySelector('#stems');el.replaceChildren();for(const id of ids){const row=document.createElement('div');row.append(document.createTextNode(id+' '));for(const [key,set] of [['mute',muted],['solo',solo]]){const b=document.createElement('button');b.dataset.stem=id;b.dataset.action=key;b.textContent=t(key);b.setAttribute('aria-pressed',String(set.has(id)));b.onclick=()=>{set.has(id)?set.delete(id):set.add(id);b.setAttribute('aria-pressed',String(set.has(id)));updateStems();};row.append(b);}el.append(row);}}
controls();
const status=document.querySelector('#status');const frame=document.querySelector('#sfx');
function stopMusic(){generation++;for(const s of sources){s.onended=null;s.stop();s.disconnect();}sources=[];for(const g of stemGains.values())g.disconnect();stemGains.clear();status.textContent=t('stopped');}
function sfxButton(index){return frame.contentDocument?.querySelectorAll('nav button')[index];}
function stopAll(){stopMusic();sfxButton(6)?.click();}
async function play(next){
 selection=[...next];
 stopMusic();const token=generation;
 try{
  context??=new AudioContext();gain??=context.createGain();gain.disconnect();gain.connect(context.destination);gain.gain.value=Number(document.querySelector('#volume').value);
  await context.resume();if(token!==generation)return;status.textContent=t('loading');
  const currentVersion=version;
  const buffers=await Promise.all(selection.map(async id=>{
   const key=currentVersion+':'+id;
   if(!cache.has(key))cache.set(key,(async()=>{
    const formats=currentVersion==='a'?['wav']:['flac','wav'];let last;
    for(const ext of formats)try{
     const dir=currentVersion==='a'?'audio':'audio-b';
     const r=await fetch(new URL(`./${dir}/${id}.${ext}`,document.baseURI));if(!r.ok)throw Error(r.status);
     const b=await context.decodeAudioData(await r.arrayBuffer());
     const expected=Math.round((id==='victory'||id==='defeat'?203538:id==='arena-base'||id==='boss-core'?1085538:542769)*context.sampleRate/44100);
     if(Math.abs(b.length-expected)>1)throw Error('Decoded musical grid mismatch');
     if(version===currentVersion)codecs.set(key,ext);return b;
    }catch(e){last=e;}
    throw last;
   })().catch(e=>{cache.delete(key);throw e;}));
   return cache.get(key);
  }));
  if(token!==generation)return;
  const when=context.currentTime+.08;startedAt=when;
  buffers.forEach((buffer,i)=>{const s=context.createBufferSource();s.buffer=buffer;s.loop=loops.has(selection[i]);s.loopStart=0;s.loopEnd=buffer.duration;const g=context.createGain();stemGains.set(selection[i],g);s.connect(g);g.connect(gain);g.gain.value=!muted.has(selection[i])&&(!solo.size||solo.has(selection[i]))?1:0;s.start(when);sources.push(s);s.onended=()=>{sources=sources.filter(x=>x!==s);s.disconnect();if(!sources.length)status.textContent=t('stopped');};});
  status.textContent=`${t('playing')}: ${selection.join(' + ')}`;
 }catch(e){if(token===generation)status.textContent=`${t('error')} (${e.message})`;}
}
function button(parent,label,selection){const el=document.createElement('button');el.textContent=label;el.onclick=()=>play(selection);document.querySelector(parent).append(el);}
ids.forEach(id=>button('#pieces',id,[id]));
for(const selection of [['arena-base','tension'],['arena-base','anomaly'],['arena-base','tension','anomaly'],['boss-core','enraged']])button('#combos',selection.join(' + '),selection);
document.querySelector('#stop').onclick=stopAll;
document.querySelector('#version').onchange=e=>{version=e.target.value;cache.clear();codecs.clear();if(selection.length)play(selection);};
document.querySelector('#volume').oninput=e=>{if(gain)gain.gain.setTargetAtTime(Number(e.target.value),context.currentTime,.01);};
for(const [id,index] of [['combat',0],['perfect',1],['arrival',3]])document.querySelector(`#${id}`).onclick=()=>{const b=sfxButton(index);if(b)b.click();else status.textContent=t('sfxLoading');};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});window.addEventListener('pagehide',stopAll);
// Read-only diagnostics for offline browser validation; no runtime integration.
export function snapshot(){return {active:sources.length,loops:sources.map(s=>s.loop),starts:sources.map(s=>s.loopEnd),cached:cache.size,contextRate:context?.sampleRate,version,selection,muted:[...muted],solo:[...solo],codecs:Object.fromEntries(codecs),elapsed:context?context.currentTime-startedAt:0,gains:Object.fromEntries([...stemGains].map(([id,g])=>[id,g.gain.value]))};}

Object.defineProperty(window,'q12dSnapshot',{value:snapshot});
