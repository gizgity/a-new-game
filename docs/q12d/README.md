# Q12D Phase A — Original synth soundtrack prototype

**AWAITING USER MUSIC APPROVAL — Q12D PHASE A**. Chỉ artifacts review, không runtime integration, không production music build, không Phase B/C hoặc Q12E. Baseline `main@162066d`, gồm balance mới `651e3bf` còn chờ user playtest. Branch `q12d-phase-a` giữ nguyên gameplay, SFX/Arrival/elemental, Q12B, RNG/Boss/balance, artwork và DDR. Không push main hoặc kích hoạt Pages.

## Audit và provenance

Đã đọc AGENTS/HANDOFF/GAME_BRIEF/ART_BIBLE và implementation accepted Q12A–C: `audio.ts`, `config/audio.ts`, `elementalAudio.ts`, audition hiện hữu và docs. Game dùng Phaser ProceduralAudio/cached mono PCM, Arrival Q8C nguyên bản, cap8 và budget/cooldown có sẵn. Runtime không có music transport. Repo có Node/TypeScript/Vite; môi trường có FFmpeg và Chromium/Playwright. Không thêm dependency. Renderer dùng Node standard library; không cần FFmpeg để tái lập WAV.

Score, voicings, rhythm và synth code được viết nguyên bản cho task này bằng trợ lý coding. Không dùng sample, MIDI/melody nhập ngoài, AI music service, DAW hoặc audio pack; không mô phỏng một bài nhạc/nghệ sĩ cụ thể. Noise tạo bằng xorshift32 riêng từng event, seed cố định `0x51c0ffee XOR imul(eventIndex+1,2654435761)`; không import/chạm gameplay RNG. Không tuyên bố bảo đảm pháp lý về mọi trùng hợp âm nhạc phổ biến. Không có artwork mới.

## Nghe thử và build

[Nghe trực tiếp trên web — Phase A review](https://av-run.ngantnk.workers.dev/s/r3Vl6hay3Lg3q2QnTsS32A). User yêu cầu link do không chạy local được; bundle build từ e430cc5 được host riêng qua Artifact Vault, version1, không đổi GitHub Pages/gameplay. Link public hoạt động đến2026-11-29 theo dịch vụ; không thu submission. Host đã xác nhận upload/share, chưa kiểm lại playback trên host thật.

Từ repo root:

```sh
node docs/q12d/render.mjs
node docs/q12d/validate.mjs
npm run dev
```

Mở `http://localhost:5173/a-new-game/docs/q12d/index.html`. Chọn từng bài hoặc tổ hợp. Play khác thay music; SFX chỉ bắt đầu bằng nút Combat/Arrival hoặc controls trong khung. Stop all tắt cả hai. Mặc định music gain0.7, có slider riêng; SFX giữ gain/cap gốc. Bật tab khác dừng và không replay. Mọi layer trong tổ hợp dùng cùng timestamp Web Audio; 8bar repeat hai lần trên core16bar. Preview adaptive ở đây là bật tổ hợp thủ công và restart cùng downbeat; chưa có gameplay state/crossfade/transition manager.

Build review độc lập (không thay `vite.config.ts`, không ghi `dist/`):

```sh
npm run build
npx vite build --config docs/q12d/vite.config.mjs
python3 -m http.server 5174 --directory /tmp/cursebreak-q12d-review
```

Mở `http://localhost:5174/docs/q12d/index.html`. Build chỉ mang music audition và SFX audition, không game entry hoặc public artwork. Không publish. Để kiểm browser: start Vite rồi `node docs/q12d/browser-check.mjs`; thêm `Q12D_URL=http://localhost:5174/docs/q12d/index.html` để kiểm build tĩnh. Script cần Playwright có sẵn `/opt/codex/cua_node/lib/node_modules/playwright/index.mjs` và `/usr/bin/chromium`, có thể sửa đường dẫn trên máy khác; không phải dependency game.

Entry music không import main/profile/progression, không localStorage/IndexedDB. Khung dùng lại nguyên `audition.html` accepted: CombatWorld fixture, không save. Không có autosave/reward/progression thật.

## Score và phrasing

140 BPM, 4/4, D minor; quarter note =3/7s, bar=12/7s. `score.mjs` là source chỉnh sửa; tuple `[beat, MIDI pitch|null, gate beats, velocity0..1]`; `null` là rest rõ ràng, các khoảng không có event cũng nghỉ. MIDI60=C4. `events.json` là ledger mở rộng được generate (beat tuyệt đối zero-based); không chỉnh ledger thay score. Duration là note gate, release/echo được renderer xử lý riêng.

| Piece | Bars / duration | Vai trò và phrasing |
| --- | --- | --- |
| Arena Base |16 /27.428571s| D5–F5–E5–A5 call b1; b2 answer, b3–4 expansion/space, b5–8 turn, b9–16 reprise nhẹ hơn và accent b12/16 |
| Tension |8 /13.714286s| Chord stabs lệch nhịp, tăng velocity nửa sau, hat fill b4/8; không thêm bass/kick chồng |
| Anomaly |8 /13.714286s| Bell FM pattern3+3+2 eighth, câu đáp đổi theo bar; chord tones cao, không motif bass cạnh tranh |
| Boss Core |16 /27.428571s| Chain Warden D4 lặp/chặn, F4–E4 rồi A4 trễ; low register, nhịp kick riêng, b4/8 fill, b12/16 accent |
| Enraged |8 /13.714286s| Stab syncopation dày hơn, Eb5→D5 tại b1/2/5/6 trên D/G; không Eb kéo dài trên dominant A |
| Victory |3 /5.142857s| Motif chính, Bb→C→Dm, D6 kết + khoảng nghỉ đuôi |
| Defeat |3 /5.142857s| Motif co xuống A/E, Dm→Am→Dm thấp, tắt dần + khoảng nghỉ |

Harmony mỗi bar, cùng voicing chính xác trong score:

- Arena8bar: Dm, Dm(add9 màu E thay F), Bb, Bbmaj7, C, Csus2, Am, Am7. Hai chu kỳ cùng harmony, bass/lead/accents khác theo phrase.
- Boss8bar: Dm, Dm, Bb, Bb, Gm, Gm, Asus4, Am. Hai chu kỳ. C# ở turnaround Boss là leading tone ngắn về D; tonal center vẫn D minor.
- Tension/Anomaly follow Arena; Enraged follow Boss. Không duyệt tổ hợp Arena+Boss, Enraged+Arena hay Tension+Boss. Overlays không được normalize độc lập; solo sẽ nhỏ hơn core có chủ đích.
- Bass gate.28beat, accents đầu bar, rhythm đổi bar chẵn/lẻ/cuối4bar. Snare beats2/4; hats offbeat tiết chế; fill ghost notes cuối4bar, fill dài hơn cuối8bar. Lead có rest, durations/velocity theo từng note; không random note picker.

## Presets / mix / export

`presets` trong score chứa gain/attack/decay/sustain/release/cutoff; ADSR theo giây, sustain0..1. Gate theo beat. Renderer release từ đúng mức envelope tại note-off, một pole low-pass `alpha=1-exp(-2π cutoff/rate)` mỗi voice, không filter state xuyên event.

| Instrument | Waveform / envelope A,D,S,R(s) / LP Hz / gain |
| --- | --- |
| Bass | Sine fundamental.70 + harmonic2 .22 + harmonic3 .08; .004,.09,.55,.055 /650 /.19 |
| Pad | Sine .55 + detune1.003× .22 +2× .15 +2.994× .08; .08,.22,.65,.20 /1250 /.065 |
| Stab | Harmonics1/2/4=.65/.25/.10; .005,.08,.26,.08 /1600 /.075 |
| Lead | Sine FM2:1 index.7 exp(-9t), plus2× .2 +3× .1; .008,.10,.48,.11 /2300 /.105 |
| Bell | Sine FM2:1 index1.1 exp(-15t); .004,.12,.20,.16 /2000 /.052 |
| Kick | Integrated sine pitch48+100exp(-55t)Hz, decay exp(-17t), short noise click; .002,.07,0,.03 /1800 /.29 |
| Snare | Noise.72 +175Hz sine.28, exp(-25t); .002,.07,0,.04 /3800 /.12 |
| Hat | Noise minus low-pass state, exp(-80t); .001,.018,0,.015 /6500 /.028 |

Lead/bell finite echo at .75beat/.19gain và1.5beat/.075gain. Sum linear mono, fixed master.85; không compressor/limiter hay per-stem loudness normalization. All oscillators reset phase từng note với attack; low-harmonic synth tránh alias nặng. Không claim alias-free/pro mastering.

44100Hz mono signed16-bit little-endian PCM WAV, không dither/lossy encode. Beat=18900frames, bar=75600frames chính xác; không encoder delay/padding. WAV được browser decode ổn định hơn việc tự ghép Ogg/MP3 loop; FFmpeg có sẵn nhưng Phase A không cần bản compressed trùng lặp. Loop range `[0, frames)` là toàn file; render note release/echo vượt biên modulo về đầu, không cắt tails hoặc chèn gap/crossfade giả. Stings là one-shot, không wrap, có ít nhất250ms silence cuối. Mono giữ headroom và budget; spatial mix/codec production chưa quyết định.

## Tài nguyên và kiểm chứng

| Piece | PCM frames | File bytes | Decoded float32 mono bytes |
| --- | ---: | ---: | ---: |
| Arena Base |1209600|2419244|4838400|
| Tension |604800|1209644|2419200|
| Anomaly |604800|1209644|2419200|
| Boss Core |1209600|2419244|4838400|
| Enraged |604800|1209644|2419200|
| Victory |226800|453644|907200|
| Defeat |226800|453644|907200|

Tổng9374708bytes (~8.94MiB), float32 decoded18748800bytes (~17.88MiB) ở44.1kHz. Context48kHz resample khoảng19.46MiB; browser có thêm fetch ArrayBuffer/cache/decode overhead, có thể giữ vài bản tạm, không coi estimate là process RSS. Cache chỉ tải bài đã chọn, tối đa7 buffer; playback tối đa3 music sources + tối đa8 SFX trong context riêng của khung. Audit này không đo CPU/thermal trên điện thoại. Không preload vào game.

`validation.json`: finite samples, exact bar lengths, expected piece lengths, deterministic exported bytes/hash, bounded signal peak, tất cả tổ hợp hợp lệ, seam dưới.01FS, quiet sting tails, file<10MiB/decoded<20MiB. Max combined sample peak~.3393FS (trước slider); core seam~.00025FS hoặc thấp hơn, overlays seam0. Đây là đo tín hiệu, không là chứng minh seam không nghe được trên mọi loa. `browser.json` và `browser-build.json` ghi decode/frame count/controls/storage/layout trên Chromium (dev và build độc lập đều PASS ở320/390/844/1440px); decode resampling có thể lệch một frame tùy context sample rate. Browser yêu cầu user gesture và Web Audio; PCM WAV được hỗ trợ bởi Chrome/Edge/Firefox/Safari hiện đại theo format, nhưng chỉ Chromium đã kiểm, chưa Firefox/Safari/iOS/thiết bị thật. Không fallback nếu browser chặn audio: trang hiện lỗi. Không tuyên bố professional mastering hoặc nhạc nghe hay từ test.

## Human review bắt buộc

Nghe volume vừa trên loa điện thoại rồi tai nghe/desktop:

1. Arena ít nhất2vòng (~55s): nhận motif và câu trả lời, đổi phrase b4/8, nghe vùng nối b16→1 có click/hẫng không.
2. Solo Tension/Anomaly rồi Base+Tension và đủ3layer; nghe8bar repeat trên core16bar, không lệch nhịp/harmony hoặc quá dày.
3. Boss ít nhất2vòng, rồi Boss+Enraged; motif Chain Warden khác Arena, Eb→D không chói/gây lẫn.
4. Victory/Defeat tách riêng, kết tự nhiên; Stop/đổi tab không replay.
5. Bật Combat/Arrival bên dưới trong lúc nghe tổ hợp: Heavy/Charged/Perfect/Arrival còn phân biệt và không mệt tai. So cùng vị trí slider; chưa loudness match hay production ducking.

Phản hồi tên bài/tổ hợp, timestamp/bar, âm quá mỏng/dày/gắt/lặp hoặc seam, thiết bị/browser/loa. Listenability, emotional fit, masking và fatigue vẫn cần user nghe; automation không thay thế. Dừng **AWAITING USER MUSIC APPROVAL — Q12D PHASE A**.
