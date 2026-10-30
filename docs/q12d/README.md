# Q12D Phase A — V2 synth-rock

**ACCEPTED — USER MUSIC APPROVAL — Q12D PHASE A V2**. [Nghe trực tiếp](https://av-run.ngantnk.workers.dev/s/r3Vl6hay3Lg3q2QnTsS32A). Artifacts review riêng; không runtime integration, không production music build, không Phase B/C/Q12E/DDR/artwork. Branch `q12d-phase-a`, baseline main162066d gồm balance651e3bf đang chờ user playtest; giữ nguyên gameplay, combat SFX, Arrival Q8C, elemental sounds, Q12B, gameplay RNG/Boss/balance và Pages.

## User music approval

User xác nhận **“oki đc r”** ngày2026-10-30 trong hội thoại hiện tại (không có permalink), sau khi nghe V2 ở link review bên trên. Approval cho composition/prototype Phase A V2,156BPM synth-rock và các layer đã sửa, code`a7ba63c`/bàn giao`1b5e7b6`, hosted artifact version2 (`61e90b4a-1c1a-4f90-9b5c-16f7cd8fcc29`). Đây là approval trực tiếp, không suy từ tests. Gate chờ music approval đã hoàn tất; không yêu cầu duyệt lại. Không tự mở Phase B/C/Q12E, không runtime integration/deploy gameplay hoặc DDR. Giữ giới hạn coverage thiết bị/browser, balance mới vẫn chờ playtest riêng. Lượt ghi nhận này chỉ Markdown; không build/test lại hoặc thay bundle audio. Dòng chờ duyệt trong snapshot audition V2 là nhãn trước approval này.

## Feedback và thay đổi V2

User nghe V1 và yêu cầu: “game fast pace nên nhạc hơi thiếu chất, thêm xíu rock n roll và tăng tempo, khi tổ hợp nhạc vẫn chưa thực sự khớp với nhau, nghe chênh phô” (hội thoại hiện tại,2026-10-30). Đây là yêu cầu sửa Phase A trước approval V2 được ghi ở trên. Tempo156 thay140BPM theo yêu cầu mới; 4/4/Dminor và motifD–F–E–A giữ nguyên.

V2 thêm straight-eighth bass/palm-muted power riff bằng synth, kick dồn hơn, snare backbeat rõ và fills cuối4/8bar. Đây là màu synth-rock, không dùng guitar/drum sample. Viết lại melody/voicings và layer phụ cùng progression, không chỉ tăng playback speed của WAV cũ.

V1 có các chord extensions và counterline riêng, pad detune và pitched echo vượt qua harmony kế tiếp; đó là những khả năng gây cảm giác chênh, không phải kết luận từ đo âm thanh. V2 bỏ detune, sustained thirds ở pad và pitched echo trong loop. Tension/Enraged chỉ dùng root/fifth cùng family; Anomaly đáp root/octave trong khoảng nghỉ cuối bar của lead. Eb→D chỉ xuất hiện rất ngắn ở hai khoảng nghỉ Boss, có chủ đích. Không tuyên bố test chứng minh đã hết phô; vẫn cần nghe.

## Audit, source và provenance

Đã đọc AGENTS/HANDOFF/GAME_BRIEF/ART_BIBLE và accepted Q12A–C (`audio.ts`, audio config, elementalAudio, docs, audition). Game hiện dùng Phaser ProceduralAudio cached mono PCM, cap8/cooldown/budgets; Phase A không thay manager. Node standard-library renderer, không dependency mới. Node/TypeScript/Vite/FFmpeg và Chromium/Playwright có sẵn; export WAV không cần FFmpeg.

`score.mjs` là composition source chỉnh sửa, tách `render.mjs`. Tuple `[beat,MIDI pitch|null,gate beats,velocity0..1]`, zero-based bar/beat; null là rest ghi rõ, khoảng không có event cũng nghỉ. MIDI60=C4. `events.json` là ledger generate, không sửa trực tiếp. `manifest.json` ghi export. `presets` nằm cạnh score để chỉnh gain/ADSR/cutoff mà không sửa DSP.

Score/rhythm/voicings/synth code được viết nguyên bản cho CURSEBREAK bằng trợ lý coding. Không imported MIDI/melody/sample, copyrighted recording, AI music service, paid DAW hoặc audio pack; không mô phỏng bài/nghệ sĩ cụ thể. Không bảo đảm về mọi trùng hợp của motif/chord thông dụng. Noise dùng xorshift32 per-event, seed `0x51c0ffee XOR imul(eventIndex+1,2654435761)`; không ambient RNG hay gameplay imports. V1 còn trong git tại e430cc5; V2 thay các preview cùng tên.

## Bảy piece và hòa âm

| Piece | Bars / duration(s) | Arrangement |
| --- | --- | --- |
| Arena Base |16 /24.615374| MotifD5–F5–E5–A5, đáp/rising/falling phrases, riff eighth, bass octaves, snare2/4; reprise b9–16 và accent b12/16 |
| Tension |8 /12.307687| Rhythmic root/fifth stabs; nửa sau thêm accent, hat fill b4/8; không tự tạo melody/harmony khác |
| Anomaly |8 /12.307687| Root/octave đáp cuối bar, nhịp dài/ngắn xen kẽ, đặt trong rest lead |
| Boss Core |16 /24.615374| Motif thấpD4–F4–E4–A4, repeated lowD/chained accents; kick rhythm riêng, Gminor ở phrase5/6 |
| Enraged |8 /12.307687| Root/fifth syncopation, fill, Eb5.09beat→D5.22beat ở b1/5 beat4 khi lead nghỉ |
| Victory |3 /4.615374| Motif và Bb→C→Dm cadence, highD, power accent; one-shot |
| Defeat |3 /4.615374| Motif co xuống A/E rồi lowDm; one-shot |

Arena8bar: Dm/Dm/Bb/Bb/C/C/Am/Am. Boss8bar: Dm/Dm/Bb/Bb/Gm/Gm/Am/Am. Open-fifth pad/riff không chứa third; lead định màu minor. Các nốt E trên D, D trên C hoặc A trên G là passing9th ngắn có chủ đích; không có C# hay major7 pad từ bản cũ. Hai nửa16bar dùng cùng harmony; nhịp, fills, velocity, câu đáp và accent được ghi rõ. Melody có rest cuối bar để chia chỗ với overlays. Riff eighth gate.22–.26beat, bass.27/.34beat; b4/8 bỏ một nhát để nhường fill. Không random note picker hoặc loop1bar lặp suốt.

Tổ hợp hỗ trợ: Base+Tension, Base+Anomaly, Base+Tension+Anomaly, Boss+Enraged. Overlay8bar lặp2lần trên core16bar, cùng downbeat. Không ghép Arena+Boss hoặc overlay khác family. Layer solo nhỏ hơn core có chủ đích. Adaptive preview là chọn tổ hợp thủ công/restart cùng downbeat; chưa có gameplay transitions/crossfade/ducking.

## DSP, presets và export

ADSR attack/decay/release theo giây, sustain0..1; gate theo beat. Một-pole LP `alpha=1-exp(-2π cutoff/rate)` per voice, release bắt đầu từ envelope thật tại note-off. Gain cuối=sumlinear×.85, không normalize từng layer hoặc master limiter/compressor. Riff có saturation per-voice trước LP, không distort toàn mix.

| Voice | Waveform | A / D / S / R | LPHz / gain |
| --- | --- | --- | --- |
| Bass | Sine harmonics1/2/3=.70/.22/.08 | .003/.08/.62/.025 |950/.21|
| Riff | Additive saw harmonic1..10,1/h, bỏ partial≥.45sampleRate; tanh(1.9×saw)×.72 |.003/.055/.52/.018|2450/.09|
| Pad | Exact integer harmonics1/2/3=.75/.18/.07, không detune |.035/.12/.5/.055|1000/.035|
| Stab | Harmonics1/2/4=.65/.25/.10 |.003/.055/.42/.025|1900/.075|
| Lead | Harmonics1/2/3/4=.66/.21/.09/.04 |.004/.065/.65/.045|2900/.115|
| Bell response | Harmonics1/2=.8/.2, không FM sidebands |.003/.045/.3/.035|1800/.065|
| Kick | Integrated pitch48+100exp(-55t)Hz; exp(-12t), short noise click |.0015/.13/0/.02|2200/.34|
| Snare | Noise.6 +180Hz.3 +330Hz.1; exp(-18t) |.002/.105/0/.025|4200/.21|
| Hat | Noise minus LPstate, exp(-80t) |.001/.024/0/.012|6000/.025|

Loop không pitched echo. Chỉ sting lead có một echo.5beat/gain.1. Release tails wrap modulo loop; mọi pitched loop event V2 thực tế kết thúc trước bar kế tiếp. Không chèn crossfade/gap; cuối loop hats/snare decay xong trước downbeat sau. Saturation có thể tạo thêm harmonics; không tuyên bố alias-free hoặc professional mastering. Purely synthetic timbres, không acoustic emulation chuẩn studio.

WAV44100Hz mono signed16-bit LE PCM, không lossy encoding/dither/encoder padding. 156BPM có beat không nguyên số sample: renderer lượng tử hóa một chu kỳ8bar thành542769frames trước, beatFrames=542769/32=16961.53125. Core16bar=1085538frames chính xác2chu kỳ. BPM thực156.0000663 (lệch<.0001BPM);8bar ngắn hơn156 lý tưởng5.23microseconds. Mọi layer chung grid, không round từng file độc lập gây drift. Sting3bar=round(12×beatFrames)=203538frames, có≥250ms silence cuối. Loop range `[0,frames)` là toàn file.

## Chạy và audition

[Link web hiện tại](https://av-run.ngantnk.workers.dev/s/r3Vl6hay3Lg3q2QnTsS32A) dùng Artifact Vault riêng theo yêu cầu user không chạy local được; không thay Pages. Link public không thu submission, hạn2026-11-29 theo service. Source repo public đã xác nhận bằng GitHub metadata. V2 code`a7ba63c` đãpush reviewbranch; ArtifactVault version2 uploadSUCCESS (version ID61e90b4a-1c1a-4f90-9b5c-16f7cd8fcc29), sharelink theo current. Upload/share xác nhận bằng tool; chưa kiểm playback trên host thật, Chromium kiểm local build tương ứng.

Từ repo root:

```sh
node docs/q12d/render.mjs
node docs/q12d/validate.mjs
npm run dev
```

Mở `http://localhost:5173/a-new-game/docs/q12d/index.html`. Chọn tên bài/tổ hợp để Play; Play khác thay music, không cộng hai transport; Stop all dừng cả nhạc và SFX. Gain nhạc mặc định.7, slider riêng; SFX giữ gain accepted. Combat/Arrival hoặc controls trong khung phát SFX thật, không đổi cadence warning gốc. Không loudness matching; chuyển tab dừng, không replay.

Build độc lập, không thay production config/dist:

```sh
npm run build
npx vite build --config docs/q12d/vite.config.mjs
python3 -m http.server 5174 --directory /tmp/cursebreak-q12d-review
```

Mở `http://localhost:5174/docs/q12d/index.html`. Build chỉ audition+SFX entry, không game entry/public artwork. `node docs/q12d/browser-check.mjs` kiểm dev; `Q12D_URL=http://localhost:5174/docs/q12d/index.html node docs/q12d/browser-check.mjs` kiểm build. Browser script dùng Playwright `/opt/codex/cua_node/lib/node_modules/playwright/index.mjs` và Chromium `/usr/bin/chromium`, thay paths nếu môi trường khác; không game dependency.

Không import main/profile/progression hoặc localStorage/IndexedDB trong music entry; khung dùng accepted audition.html/CombatWorld fixture không save. No real progression writes.

## Tài nguyên, validation và giới hạn

| Piece | Frames | File bytes | Float32 mono bytes |
| --- | ---: | ---: | ---: |
| Arena Base |1085538|2171120|4342152|
| Tension |542769|1085582|2171076|
| Anomaly |542769|1085582|2171076|
| Boss Core |1085538|2171120|4342152|
| Enraged |542769|1085582|2171076|
| Victory |203538|407120|814152|
| Defeat |203538|407120|814152|

Tổng8413226bytes (~8.02MiB), decoded16825836bytes (~16.05MiB) ở44.1kHz, ~17.47MiB khi resample48kHz. Không gồm fetch/decode temporary copies/browser overhead; không đo process RSS/CPU/thermal. Tối đa7cached music buffers,3music sources +8SFX trong context khung; không preload vào game.

`validation.json`: finite samples, quantized common cycle16=2×8, expected durations, deterministic export bytes/SHA, no clipping, allowed-combo peaks, seam<.01FS, quiet sting tails, total<10MiB/decoded<20MiB. Thêm score checks root/fifth family và reply rest windows; checks này không đo cảm nhận hòa âm. V2 peak tổ hợp~.4544FS trước slider, seam sample0 cho5loop. `browser.json`/`browser-build.json`: Chromium decode7WAV,4tổ hợp đồngtimestamp/loop ratios, overlay boundary, controls/rapid-stop, actual SFX, no storage/overflow/pageerror ở320/390/844/1440px. Node syntax kiểm scripts; repo TypeScript typecheck và cả build được chạy. Không đổi gameplay nên không chạy lại gameplay regression suite.

Web Audio + PCM WAV tương thích Chrome/Edge/Firefox/Safari hiện đại theo format; chỉ Chromium được kiểm. Browser cần gesture, lỗi decode hiện trên trang. Chưa Firefox/Safari/iOS/device speakers/headphones/latency/FPS/thermal; decode resampling có thể lệch1frame ở sampleRate khác. Không coi build/signal/browser PASS là nhạc hay/hết phô/mastering hay user approval.

## Human review

1. Nghe Arena2vòng (~49s): tốc độ/riff/drums có hợp combat nhanh, motif/câu đáp rõ, nối16→1 không hụt/click.
2. Base→Base+Tension→đủ3layer: chú ý những chỗ chênh trước, cuối bar Anomaly đáp có khớp và có dày/mệt không; nghe qua cả8→9 và16→1.
3. Boss rồi Boss+Enraged2vòng: motif thấp riêng, Eb→D cuối b1/5 có chủ đích nhưng nếu vẫn khó chịu hãy chỉ rõ.
4. Hai sting, Stop/đổi tab; sau đó bật Combat/Arrival khi nhạc chạy, nghe Heavy/Charged/Perfect/warning có bị che.

Phản hồi bài/tổ hợp, timestamp/bar, loa/browser và độ nhanh/lực/hòa âm/mệt tai. **Phase A V2 đã được user duyệt theo ghi nhận ở trên.** Checklist giữ để tham khảo; dừng sau Phase A, chỉ mở Phase B/C khi user giao riêng.
