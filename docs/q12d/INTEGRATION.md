# Q12D Phase C — Adaptive Music Integration

Triển khai theo yêu cầu user2026-10-30; Phase A V2 và Phase B đã được duyệt. **AWAITING USER PLAYTEST APPROVAL — Q12D PHASE C**; chưa nghiệm thu Phase C, không mở Q12E/DDR. Main fetch mới nhất `162066d`, balance `651e3bf` được bảo toàn; Phase B `15f24af` nối trực tiếp main, production baseline `fe7438d`. Không checkout branch cũ đè runtime. Không render/chỉnh composition/mix/SFX/art/balance/progression.

Code/deploy **dc9ea84**, đãpushmain/branchq12d-phase-c. [Pages41071953432](https://github.com/gizgity/a-new-game/actions/runs/41071953432) **completed/SUCCESS**, job124118094997 build/typecheck/upload/DeploySUCCESS. Chưa liveHTTP/hash verification. BàngiaoMarkdown sau khôngđổiruntime/redeploy.

## State và lifecycle

| State thật | Music nghe được |
| --- | --- |
| Main menu | Silent |
| Active run <60s | Arena Base |
| Active run ≥60s (`run.elapsed`) | Base + Tension |
| `combat.anomaly.active` sau lựa chọn hợp lệ | Base + Tension + Anomaly |
| Enemy Boss còn sống trong world | Boss Core |
| Boss `enraged` thật | Boss Core + Enraged |
| Victory / Defeat | Fade300ms → sting tương ứng một lần |

Scene chỉ đọc state rồi gọi `AdaptiveMusic.update`; không thay combat resolver/clock/RNG/input. `run.bossDue` hoặc timer không dùng để suy Boss. Draft/Legacy/Anomaly Selection/Pause dừng sources, ghi offset theo `AudioContext.currentTime`; resume dựng lại tất cả lanes tại cùng timestamp/offset. Restart/New Run gọi reset tại cùng chỗ `run.start`, một lần; legacy→playing không reset lại. Shutdown abort request, stop/disconnect sources/buses, clear cache/listeners.

Menu không fetch. Khi audio locked/suspended/hidden không start; context state/visibility listener chụp vị trí và stop ngay, Scene giữ pause hiện hữu khi blur. Trở về cần resume flow có sẵn; không replay SFX/cue đã qua. Sting đã claim khi bị ngắt không replay. Audio failure không chặn run; fetch/decode từng group fail thì bỏ nhạc group đó, không retry mỗi frame; New Run cho phép retry.

## Transport và mix

Reuse Phaser3/WebAudio, không dependency mới. Bus riêng gain`.7` như audition đã duyệt, nối vào `masterMuteNode → masterVolumeNode → destination` của Phaser. Gain SFX giữ nguyên. Thêm callback output-only sau admission/play SFX: Arrival, Boss Warning, Hurt và major impact (Heavy/ChargedBlast/Detonate/Light3/ChargedGun) duck music8dB, attack10ms/hold120ms/release350ms; config tại `MUSIC`. Cap8SFX/perframe5/regular3 và mọi policy Q12A–C không đổi. Arrival generator/cadence/trigger/volume giữ nguyên; xem diff và regression.

Common grid chính xác export:8bar542769frames@44100, core16bar1085538frames, bar=542769/44100/8s, actual156.0000663BPM (~156),4/4. Native looping BufferSource, explicit common loopEnd, overlay8bars lặp2lần/core; không JS beat timer/setInterval. Cả3Arena lanes chạy chung timestamp/offset, overlays gain0 trước activation; Boss2lanes tương tự. Các lanes im vẫn tính vào source cap. Gain đổi ở next bar (~≤1.539s), không chờ16bars; thay đổi nhanh cancel automation chưa tới, không queue cue.

Boss load xong crossfade300ms ngay, không đợi bar và không trì hoãn gameplay. Dừng overlay Arena, giữ1core fading +2Boss sources (≤3). Family mới mở downbeat riêng. Results giữ1core fade rồi one-shot; không restart sting vì nhiều frame/result callback. Pause giữ offset và mức gain từng lane; pending overlay vẫn đợi đúng bar sau resume, lanes đã bật không bị tắt tới bar kế. Attack4ms khi dựng sources lại; không reset musical position. Scene cũng freeze transport trong hitstop/Boss transform khi simulation frozen; run-time60s chỉ đọc clock thật. Draft/Selection/Pause được freeze đầy đủ. Combat hitstop có thể tạo ngắt nhạc rất ngắn; cần nghe user playtest, không tự đổi hitstop để làm nhạc mượt.

## Assets, network và memory

7production pieces FLAC ưu tiên, WAV fallback khi HTTP/decode lỗi. `public/assets/music` byte-identical với `docs/q12d/audio-b`; SHA/bytes tại [assets-c.json](assets-c.json). Không render, trim, normalize hoặc đổi playbackRate.

| Lazy group | FLAC bytes | Decoded mono Float32@44.1kHz |
| --- | ---: | ---: |
| Arena (3) |789074|8684304 |
| Boss (2) |738282|6513228 |
| Results (2) |124170|1628304 |
| Tổng7file |1651526|16825836 |

WAV fallback toàn bộ8413226bytes; hai format production10064752bytes. Cache chỉ giữ group hiện tại≤3entries; transition không decode lại mỗi layer activation. Mỗi New Run clear cache; không preload all7. Group load sequential, tối đa một group request; decode group mới rồi thay cache, sources cũ nhả buffer sau300ms fade. Peak decoded sống trong lúc chuyển Arena→Boss khoảng15197532bytes@44.1kHz (~16.54MB@48kHz), chưa tính encoded fetch/copy, decoded tạm, resampler/browser/Phaser/SFX/GC/RSS. Cache report hiện tại không phải process-memory measurement. `musicStats()` báo network body bytes thực nhận (gồm FLAC thử lỗi + WAV), cache decoded estimate theo buffer.length×channels×4, active/peak source count, errors và position; HTTP headers/cache overhead không tính.

## Fixtures và cách nghe/chơi

[Chơi tích hợp](https://gizgity.github.io/a-new-game/?playtest=music&v=dc9ea84) — panel Early/Áp lực/Anomaly/Boss/Enraged/Thắng/Thua phía trên; fixture grants dùng world thật và profile memory, không ghi progression. Chọn Early→Áp lực→Anomaly: chờ tối đa1bar sau activation; Boss→Enraged; thử Pause/Resume, Restart, đổi tab. Các nút stage là grants phục vụ review, không chứng minh natural threshold/selection/combat khó dễ. Anomaly grant trực tiếp chỉ có trong fixture; production cần lựa chọn hợp lệ. `window.musicFixture.stats()` dùng để inspect, chỉ expose khi `playtest=music`.

Bản thường không panel: [game](https://gizgity.github.io/a-new-game/). Rising pressure từ60s active; Anomaly sau chọn; Boss thật sau Arrival; phase2 khi≤50%HP. [SFX audition](https://gizgity.github.io/a-new-game/audition.html) vẫn giữ nguyên. Muốn nghe phối hợp hãy thử Boss fixture trong game, dùng Heavy/Detonate/Perfect Dodge, nghe Arrival khi encounter đến tự nhiên hoặc shortcut `?playtest=boss`.

Mobile giữ joystick+Shoot và bấm Heavy/Dash, pause rồi tiếp tục không kẹt/nhảy nhạc. Desktop WASD+mouse/Shift/E/Space, giữ-thả và pause; nghe Arrival/Perfect/Heavy/Detonate khi Boss music chạy có bị che không. Phản hồi stage/bước/âm nghe được/thiết bị-browser. Cần user nghe nhiều vòng8→9/16→1 và xác nhận cảm giác phối SFX, không suy sound quality từ assertions.

## Evidence và giới hạn

- Typecheck/build PASS; warning chunk Phaser lớn kế thừa. `npm test`:31files, gồm5focused tests mới cho mapping/grid/pause20lần/crossfade/result/reset/cache/codec failure; regression Q12A–C giữ PASS.
- [parity-c.json](parity-c.json):126/126 full-world serialized snapshots giống latest main với cùngseed808/input,18loadout×7Anomaly,Seal0–4,4Mutation+2Curse; không bỏ elementalEvents. Không chứng minh balance/feel.
- `browser-c-check.mjs` / `browser-c.json`: Chromium320/390portrait,844landscape,1440desktop, state/freeze/mute/SFX/input/cleanup/no storage/console/overflow. Controlled scene fixture, không natural run hoặc human listening.
- `input-c-check.mjs` / `input-c.json`: real CDP touch390 và keyboard1440 Charged hold→pause cancel→fresh press/release, resource2→1 và chargeSFX đúng khi3music sources đang chạy.
- `transport-c-check.mjs` / `transport-c.json`: real48kHz,2coreloops,pendingoverlay pause/resume trước downbeat,12pause/resume, controlled visibility event, context suspend, duck/release/result và injected FLAC-unsupported→realWAV fallback. Không phải tabOSbackground thật hoặc acoustic test.
- [shutdown-c.md](shutdown-c.md): actual Phaser Scene.stop giải phóng3sources/3cache về0, page errors0.
- Safari/iOS/Firefox/thiết bị thật **NOT RUN**. Chưa đo FPS/thermal/latency/RSS, chưa nghe bằng loa/tai nghe trong môi trường này. Chromium checks không là sound-quality approval; cần user playtest. Không thay approval Phase A/B hoặc Q12A–C; balance651e3bf vẫn có gate playtest riêng.
