// Isolated review transport. No imports from gameplay, profile, saves or RNG.
const dictionary={
 vi:{intro:'V2 · Synth-rock nguyên bản · 156 BPM · 4/4 · D minor. Chưa được duyệt. Chọn bài để nghe; mọi layer bắt đầu cùng downbeat. Không ghi tiến trình.',combos:'Tổ hợp đồng bộ',volume:'Âm lượng nhạc',stop:'Dừng tất cả',compare:'So sánh SFX đã duyệt',compareHint:'Nghe nhạc riêng rồi nhấn Combat hoặc Arrival để nghe chồng với SFX thật bên dưới. Arrival dùng bài warning gốc Q8C trong crowd; phát lại nhạc không đổi nhịp warning. Các nút trong khung vẫn dùng được. Khởi động lại bài để so A/B, không có loudness matching. Đổi tab sẽ dừng, không tự tiếp tục.',combat:'Combat SFX',arrival:'Arrival Q8C + crowd',loading:'Đang tải…',playing:'Đang phát',stopped:'Đã dừng',error:'Không phát được; kiểm tra server và hỗ trợ Web Audio/WAV.',sfxLoading:'SFX đang tải, thử lại sau.'},
 en:{intro:'V2 · Original synth-rock prototype · 156 BPM · 4/4 · D minor. Awaiting approval. Select a piece; all layers start on the same downbeat. No progression writes.',combos:'Synchronized combinations',volume:'Music volume',stop:'Stop all',compare:'Compare accepted SFX',compareHint:'Listen to music alone, then press Combat or Arrival to overlay the actual SFX below. Arrival uses the original Q8C warning in crowd; restarting music does not retime the warning. Embedded controls also work. Restart for A/B; no loudness matching. Hiding the tab stops playback with no auto-resume.',combat:'Combat SFX',arrival:'Arrival Q8C + crowd',loading:'Loading…',playing:'Playing',stopped:'Stopped',error:'Playback failed; check server and Web Audio/WAV support.',sfxLoading:'SFX loading; try again shortly.'}};
let locale='vi';const t=k=>dictionary[locale][k];
function translate(){document.documentElement.lang=locale;document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));}
translate();document.querySelector('#lang').onclick=()=>{locale=locale==='vi'?'en':'vi';translate();};
const ids=['arena-base','tension','anomaly','boss-core','enraged','victory','defeat'];
const loops=new Set(ids.slice(0,5));const cache=new Map();let context,gain,sources=[],generation=0;
const status=document.querySelector('#status');const frame=document.querySelector('#sfx');
function stopMusic(){generation++;for(const s of sources){s.stop();s.disconnect();}sources=[];status.textContent=t('stopped');}
function sfxButton(index){return frame.contentDocument?.querySelectorAll('nav button')[index];}
function stopAll(){stopMusic();sfxButton(6)?.click();}
async function play(selection){
 stopMusic();const token=generation;
 try{
  context??=new AudioContext();gain??=context.createGain();gain.disconnect();gain.connect(context.destination);gain.gain.value=Number(document.querySelector('#volume').value);
  await context.resume();status.textContent=t('loading');
  const buffers=await Promise.all(selection.map(async id=>{
   if(!cache.has(id))cache.set(id,fetch(new URL(`./audio/${id}.wav`,document.baseURI)).then(r=>{if(!r.ok)throw Error(r.status);return r.arrayBuffer();}).then(b=>context.decodeAudioData(b)).catch(e=>{cache.delete(id);throw e;}));
   return cache.get(id);
  }));
  if(token!==generation)return;
  const when=context.currentTime+.08;
  buffers.forEach((buffer,i)=>{const s=context.createBufferSource();s.buffer=buffer;s.loop=loops.has(selection[i]);s.loopStart=0;s.loopEnd=buffer.duration;s.connect(gain);s.start(when);sources.push(s);s.onended=()=>{sources=sources.filter(x=>x!==s);s.disconnect();if(!sources.length)status.textContent=t('stopped');};});
  status.textContent=`${t('playing')}: ${selection.join(' + ')}`;
 }catch(e){if(token===generation)status.textContent=`${t('error')} (${e.message})`;}
}
function button(parent,label,selection){const el=document.createElement('button');el.textContent=label;el.onclick=()=>play(selection);document.querySelector(parent).append(el);}
ids.forEach(id=>button('#pieces',id,[id]));
for(const selection of [['arena-base','tension'],['arena-base','anomaly'],['arena-base','tension','anomaly'],['boss-core','enraged']])button('#combos',selection.join(' + '),selection);
document.querySelector('#stop').onclick=stopAll;
document.querySelector('#volume').oninput=e=>{if(gain)gain.gain.setTargetAtTime(Number(e.target.value),context.currentTime,.01);};
for(const [id,index] of [['combat',0],['arrival',3]])document.querySelector(`#${id}`).onclick=()=>{const b=sfxButton(index);if(b)b.click();else status.textContent=t('sfxLoading');};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});window.addEventListener('pagehide',stopAll);
// Read-only diagnostics for offline browser validation; no runtime integration.
export function snapshot(){return {active:sources.length,loops:sources.map(s=>s.loop),starts:sources.map(s=>s.loopEnd),cached:cache.size,contextRate:context?.sampleRate};}
