# Q12D Phase C — Integration

User giao Phase C ngày2026-10-30 sau khi duyệt Phase A V2/B. Scope và evidence hiện hành tại [INTEGRATION.md](INTEGRATION.md). **AWAITING USER PLAYTEST APPROVAL — Q12D PHASE C**. Không Q12E. Các gate không Phase C bên dưới là lịch sử đã được yêu cầu hiện tại supersede; approval A/B giữ nguyên.

# Q12D Phase B — Production & Mixing

**ACCEPTED — USER MUSIC PRODUCTION APPROVAL — Q12D PHASE B**. User đã duyệt Phase A V2 (`a7ba63c`) và giao Phase B riêng ngày 2026-10-30. Review branch `q12d-phase-b` từ `bc54edd`; không thay main/Pages. Các gate “không Phase B” trong hồ sơ Phase A bên dưới đã được yêu cầu mới supersede, chỉ trong scope production này. Không Phase C/Q12E/integration/DDR. Balance `651e3bf` vẫn chờ playtest riêng.

## User production approval

User xác nhận **“oki dc r”** ngày2026-10-30 trong hội thoại hiện tại (không có permalink), sau bàn giao production commit `fe7438d` trên `q12d-phase-b` và [artifact A/B Phase B](https://av-run.ngantnk.workers.dev/s/5Vpnib8BraJBZAWL5Jhi-A), version1 `b2859408-03cb-4c33-8eed-1ec9b36b59a6`. Đây là approval trực tiếp cho production/mixing Phase B, không suy từ tests; giữ approval composition Phase A V2 `a7ba63c`. Gate chờ production approval đã hoàn tất, không yêu cầu duyệt lại.

Lượt ghi nhận chỉ sửa README/HANDOFF, không đổi renderer/presets/assets/audition hoặc artifact. Nhãn chờ duyệt trong audition/bundle là snapshot trước approval này. Không chạy lại build/tests hoặc deploy; không suy thêm coverage Safari/iOS, thiết bị thật, số vòng nghe hoặc từng mục checklist từ xác nhận chung. Không tích hợp runtime, không mở Phase C/Q12E, không ghi DDR Approved; balance `651e3bf` vẫn chờ playtest riêng.

## Phạm vi và thiết kế bất biến

`score.mjs`, `events.json`, WAV trong `audio/` giữ nguyên bytes baseline; `phase-a-render.mjs` giữ renderer A để tái tạo/so sánh. Giữ 156 BPM, 4/4, D minor, motif D–F–E–A, đủ 7 pieces và mọi note/harmony/rhythm/velocity/fill/gate. Production không thêm track hoặc counterline. Root/fifth, reply rests và Eb→D ngắn giữ nguyên; không detune hoặc pitched loop echo. Không sửa src/, public/, SFX/Arrival/Q12A–C, config, save, artwork, DDR hoặc workflows.

## Production B

`production.mjs` chứa presets riêng. Bass HP32/LP780Hz, riff HP175/LP1950Hz; duck bass tối đa42%, riff20% theo kick hiện hữu, hồi exponential32ms/cửa sổ90ms. Không thay timing kick hoặc nốt bass. Riff saturation per voice: Arena drive1.7, Boss2.3 tạo màu dày hơn; Boss không tăng master gain. Snare gain.28 với noise/body decay22/28, HP130/LP3400Hz; hats HP4500/LP6200Hz, gain.022 và attack1.5ms thay bypass LP của A. Lead HP240/LP2350Hz, gain.125; giảm vùng cao để chừa chỗ cho SFX. Các release giữ theo approved presets, không kéo harmony qua bar.

Fixed output×.85 cho mọi stem, không normalize riêng, không master limiter/compressor. Gain audition mặc định.7 (~−3.10dB thêm). Không tuyên bố professional mastering hoặc đã chứng minh cảm giác Boss/tension bằng phép đo. Filter/ducking là thay đổi sound design, cần nghe trên loa/tai nghe để đánh giá bass, snare, motif và fatigue.

## Export và metrics thực tế

WAV master mono PCM16/44100Hz trong `audio-b/`; FLAC lossless cùng PCM, nén bằng FFmpeg có sẵn, không dependency mới. Decode FFmpeg kiểm từng sample bằng WAV, không silence/padding/crossfade/trim. Grid nguyên V2: 8bar542769frames, 16bar1085538, sting203538; actual156.0000663BPM. Loops full buffer, overlays8bar lặp chính xác2lần/core16bar. Audition chọn FLAC và thử WAV nếu fetch/decode thất bại, hiển thị lỗi nếu cả hai không được. Không fallback bằng codec có padding chưa đo.

| Stem | Peak dBFS | RMS dBFS (toàn file) |
| --- | ---: | ---: |
| Arena Base |−8.69|−23.65|
| Tension |−23.65|−46.07|
| Anomaly |−30.25|−52.68|
| Boss Core |−7.48|−23.84|
| Enraged |−23.06|−44.42|
| Victory |−10.29|−31.45|
| Defeat |−18.99|−34.47|

| Tổ hợp | Peak dBFS | RMS dBFS | Headroom dB |
| --- | ---: | ---: | ---: |
| Base + Tension |−8.69|−23.57|8.69|
| Base + Anomaly |−8.69|−23.64|8.69|
| Base + Tension + Anomaly |−8.69|−23.57|8.69|
| Boss Core + Enraged |−7.48|−23.80|7.48|

RMS overlay thấp vì đáp/stab thưa có chủ đích; không kéo gain để bằng RMS core. Peak4×resample FFmpeg tương ứng−8.694/−7.477dBFS; không gọi là certified true peak. Đây là headroom nhạc, không đảm bảo mọi tổ hợp SFX cực hạn đều không clip ở thiết bị thật. Không đổi gain accepted của SFX.

FLAC7file = **1,651,526bytes (1.58MiB)**; WAV7file =8,413,226bytes. Production cả hai format10,064,752bytes; review thêm WAV A8,413,226bytes. Decoded7mono Float32=16,825,836bytes (16.05MiB)@44.1kHz, ~18,313,835bytes@48kHz. Cache tải lazy, xóa khi đổi A/B; tối đa7entries phiên bản hiện tại. Không tính temporary fetch/decode, bản buffer chờ GC, Phaser/SFX, browser overhead hoặc RSS; không preload vào gameplay.

`manifest-b.json`: từng file/bytes/SHA256. `validation-b.json`: deterministic render→WAV, finite, durations/grid, harmonic contract, combo peak/RMS/headroom và cửa sổ20/100ms trước/sau biên8/16bar qua3chu kỳ. `production-evidence.json`: render lại WAV+FLAC hash giống hệt, A khớp renderer cũ, protected paths và oversampled peaks. Cửa sổ loop cho thấy chuyển năng lượng xuống/upbeat thực, không chỉ seam sample; chưa thay thế nghe nhiều vòng.

## Audition A/B và cách kiểm

[Nghe review Phase B A/B](https://av-run.ngantnk.workers.dev/s/5Vpnib8BraJBZAWL5Jhi-A) — Artifact Vault riêng version1 (`b2859408-03cb-4c33-8eed-1ec9b36b59a6`), không thu submission, link hạn2026-11-29. Upload/share SUCCESS; chưa kiểm playback host thật. Snapshot README trong bundle là bản trước khi thêm link hosting; assets/code giống review build cuối. Hoặc chạy local:

```sh
node docs/q12d/render.mjs
node docs/q12d/validate.mjs
node docs/q12d/production-check.mjs
npm run build
npx vite build --config docs/q12d/vite.config.mjs
python3 -m http.server 5174 --directory /tmp/cursebreak-q12d-review
node docs/q12d/browser-b-check.mjs
```

URL `http://localhost:5174/docs/q12d/index.html`. Production check rerender B để so hash. Không dùng `phase-a-render.mjs` CLI để tránh ghi đè export A. Build review dùng config riêng, không deploy production dist.

A/B selector đổi presets/export và restart cùng downbeat, không loudness matching; nghe cùng slider. Nút tên stem solo playback; controls Mute/Solo độc lập cho từng stem trong combo, hỗ trợ nhiều solo. Stop all dừng nhạc và SFX; tab hidden/pagehide dừng và không tự resume. Combat, Perfect Dodge (chuỗi proc gốc có dash→perfect), Arrival Q8C+crowd chạy accepted fixture gốc, không viết progression/localStorage/IndexedDB.

Checklist tham khảo của lượt review production đã được user duyệt ở trên; không yêu cầu duyệt lại Phase A/B:

- [ ] Cùng slider A→B: Base riêng, kiểm bass/kick tách rõ, snare/backbeat và hats không mệt; motif còn rõ.
- [ ] Mỗi tổ hợp Base+Tension, Base+Anomaly, đủ3layer, Boss+Enraged nghe **ít nhất2vòng core (~50s/tổ hợp)**. Chú ý biên8→9 và16→1; không click/hụt/drift, không layer che nhau.
- [ ] Solo/mute từng stem trong combo; bỏ solo trở về đúng mix. Nghe Boss mạnh hơn Arena về texture/attack dù RMS không cao hơn, Enraged căng hơn mà không rối.
- [ ] Boss+Enraged, lần lượt bật Combat, Perfect Dodge, Arrival; warning và phản hồi chiến đấu vẫn rõ. Nghe cả Victory/Defeat.
- [ ] Play/Stop, đổi A/B/đổi bài nhanh, mute, chuyển tab rồi quay lại phải đứng im; phát lại cần gesture. Kiểm Safari/iPhone thật: FLAC hoặc WAV fallback decode, không drift qua2vòng.

Phản hồi: bài/tổ hợp, A/B, bar/timestamp, điều nghe được và loa/browser. **Human multi-loop listening, Safari/iOS, Firefox và thiết bị thật chưa thực hiện trong môi trường này**. Các ô trên giữ trống vì chưa có báo cáo từng bước/device; approval production trực tiếp đã được ghi ở trên, không suy chi tiết coverage từ approval chung.

## Validation và giới hạn browser

Typecheck/game build và isolated review build PASS (warning Phaser chunk lớn kế thừa). Focused checks là validator, production-check và browser-b-check; không chạy gameplay regression vì không đổi gameplay. Chromium kiểm WAV/FLAC7piece ở44.1/48kHz sample-equivalent, A/B7piece, 4combo cùng timestamp/ratio2:1, mỗi combo chạy>2coreloops, WAV fallback sau FLAC decode lỗi, solo/mute, rapid switch/Stop, user gesture/no autoplay, hidden-event stop/no resume, SFX thật, vi/en,4viewport/no overflow/pageerror/storage writes. Visibility được phát event có kiểm soát; tab inactive/device background thực vẫn cần manual review. Headless chạy transport không phải nghe âm thanh.

Web Audio + FLAC được hỗ trợ trong Chromium và Safari hiện đại theo format; WAV PCM là fallback dự kiến cho Safari. **Safari NOT RUN, không PASS**; không có Safari/WebKit/device để xác nhận decode fallback/gesture/background. Không đo latency/FPS/thermal, acoustic loudness hay LUFS; RMS không phải perceived loudness. User đã duyệt production theo ghi nhận ở trên; dừng sau Phase B, không Phase C/Q12E.

---

## Hồ sơ Phase A đã duyệt (lịch sử)

### Q12D Phase A — V2 synth-rock

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
