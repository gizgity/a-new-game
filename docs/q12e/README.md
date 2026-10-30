# Q12E — Final Audio Mix, Settings & Performance

**AWAITING USER PLAYTEST APPROVAL — Q12E**. User giao ngày 2026-10-30. Baseline fetch/fast-forward `04640b4`, giữ Q12D Phase C accepted `7ead766`, composition156BPM/Phase A V2/B, balance `651e3bf` và Q12A–C. Không DDR/Q13/artwork/combat/balance mới.

## Kiến trúc và defaults

Reuse Settings `<details>` trong menu/Pause và Profile v3/key `cursebreak.save.v1`, journal `cursebreak.pending.v2` hiện hữu; không persistence/page thứ hai. Khi đang chơi bấm Pause (desktop Esc hoặc nút pause, mobile nút pause) → cuộn xuống Settings; Resume trở lại run. Native range hỗ trợ touch, mouse, Tab/Home/End/Arrow; checkbox label44px và sliders44px cao. Labels vi/en, số phần trăm và aria-valuetext cập nhật realtime theo input.

| Setting | Default / migration |
| --- | --- |
| Master (`volume`) | 40%, giữ giá trị legacy hữu hạn/clamp0–1 |
| Music (`musicVolume`) | 100% của bus nhạc accepted `.7` |
| SFX (`sfxVolume`) | 100% của SFX accepted |
| Mute All (`muted`) | false; giữ legacy true |
| Reduce Camera Shake | false; OS reduced-motion làm default nếu chưa có boolean lưu |

Migration additive cho v1/v2/v3, giữ version/key/schema và progression. Missing/invalid Music/SFX →1, Master →.4; số hữu hạn ngoài range clamp, string/NaN/Infinity không được nhận. Corrupt JSON/settings dùng defaults qua validator/loadProfile cũ. Boolean explicit false/true thắng OS preference, không có listener ghi đè sau đó. Lần persist tiếp theo lưu lựa chọn đã resolve. Fixture `playtest` vẫn profile memory/không ghi save như trước.

Audio path: `cue gain → SFX bus → Phaser masterMute → masterVolume → destination`; `lane → Music bus(.7 × setting) → duck bus → masterMute → masterVolume → destination`. Không nhân Master trong cue/lane. Effective music = Master × Music × .7 × duck × lane; SFX = Master × SFX × approved cue/combat gain. SFX bus thêm đúng1GainNode/scene, reroute non-spatial owned sounds từ volumeNode; không tác động sound manager chung hoặc thay PCM. Music dùng bus hiện hữu. Gain target10ms, cancel/hold automation trước thay target để không giữ hàng dài slider events. Không restart transport, decode hoặc schedule playback khi kéo slider. Mute chỉ chặn master và dừng SFX cũ theo lifecycle accepted; nhạc chạy im, unmute không restart. Không queue/replay SFX.

Reduce Camera Shake bỏ riêng render offset; giữ Q12B defaults6pxdesktop/2.4mobile/100ms/450ms khi off. Không đổi camera aim/world pointer, hitstop, flash, warning, telegraph hoặc simulation.

## Mix và tài nguyên

Không đổi defaults mix, waveform, assets, music score hoặc priority config. Reuse duck8dB/attack10ms/hold120ms/release350ms cho Boss/Arrival/Hurt/major impacts, cap8SFX/5frame/3regular và22elemental cues. Không có nghe A/B mới đủ để đổi gain; kiểm scheduling/duck không là tuyên bố mix hay hơn hoặc acoustic masking đã hết.

[Asset sizes](evidence/assets.json):7FLAC **1,651,526bytes**,7WAV fallback **8,413,226bytes**, cả hai **10,064,752bytes**. Không thêm network asset/dependency/codec. Menu không tải music. Lazy cache theo group Arena3/Boss2/Results2; transitions overlay, hitstop, Draft/Curse không decode lại. Music tối đa3active sources (kể cả silent lanes/fading core). Decoded44.1kHz Arena8,684,304bytes; Boss6,513,228; Results1,628,304; peak Arena→Boss khoảng15,197,532bytes khi còn fade. 48kHz khoảng×48000/44100; actual buffer-length estimate xem browser/transport evidence. Không phải process RSS, không gồm temporary fetch/decode, GC/browser overhead.

Reset/shutdown music0sources/0cache, abort load/generation guard; shutdown disconnect buses/listeners. Source đã remove được clear `buffer=null` để nhả stale reference rõ ràng. SFX cached PCM giữ trong shared Phaser cache cho reuse theo baseline; owned sounds và SFX bus destroy/disconnect, không synthesis theo frame/hitstop. Đo44.1kHz52entries/1,914,864bytes, owned sounds0 sau shutdown; chi tiết trong [priority](evidence/priority.json), không gọi shared cache retained là leak. Không polling timer runtime; vòng chờ chỉ có trong QA scripts.

## Validation và evidence

- Typecheck/build PASS, warning Phaser chunk>500KB kế thừa. `npm test`:285tests/32files PASS, migration/OS preference/roundtrip/live gain và Q12A–D regression.
- [Full-world parity](evidence/parity.json):126/126,18loadout×7Anomaly,Seal0–4, cùngseed808/input,4Mutation+2Curse, serialized world gồm mọi field/audio/feedback. Không grantsHP, không balance/human acceptance.
- [Settings browser](evidence/browser.json):320×740/390×844portrait,844×390landscape touch,1440×900desktop. Native touch tap/keyboard slider; menu/Pause/vi-en/reload/persistence, six gain combinations, music source identity/network unchanged, mute no old SFX replay, reduced-shake leaves hitstop, reset/shutdown. Screenshots `evidence/settings-*.png`.
- `continuity-check.mjs`: Mutation/Curse DOM card thật, run freeze nhưng nhạc/source identity giữ; melee thật gây hitstop không restart. `input-c-check.mjs`:CDP touch390/keyboard1440 hold→pause cancel→fresh release. `browser-c-check.mjs`:4viewport/state/transform/pause/SFX/results/cleanup/no overflow/storage; `transport-c-check.mjs`:48kHz/2coreloops/12pause/visibility/suspend/duck/result và injected FLAC failure→WAV thực. Raw JSON trong `evidence/`.
- `priority-check.mjs`: Enraged+24crowd+FracturedStorm với Fire/Lightning output + từng priority cue Boss/Arrival/Hurt/major impacts; xác nhận admission/duck/cap/cleanup. Controlled grants, không natural run hoặc acoustic evidence.

Tái lập: `npm test && npm run build`, `npm run dev`; chạy các `docs/q12e/*-check.mjs` (Playwright toolchain `/opt/codex/cua_node`, Chromium `/usr/bin/chromium`; không dependency game). Parity cần compile baseline combat/run04640b4 ES2022 vào `/tmp/q12e-baseline` với package type module.

Lỗi/giới hạn đã gặp: sandbox chặn Chromium socket/Vite bind; chạy approved elevated process giải quyết. Assertion đầu kỳ vọng không có pending journal sai, sửa test theo save lifecycle cũ. Một lần chờ wall130ms chưa đủ gain settle khi software render/CPU cạnh tranh; QA đổi sang chờ AudioContext≥200ms, runtime target10ms không đổi. Continuity wall1.1s có false failure cùng điều kiện; QA chờ audio clock thực. Fixture gọi renderer sai signature gây zoom undefined; sửa fixture dùng camera.preRender, không sửa runtime để né lỗi. ghCLI API trả Forbidden; theo dõi deploy qua GitHub connector. Ghi cả lỗi dù đã có workaround.

Safari/iOS/Firefox/thiết bị thật **NOT RUN**, không giả PASS. Chưa đo latency/FPS/thermal/RSS, không nghe bằng loa/tai nghe trong môi trường này; touch là browser touch events/CDP, không điện thoại vật lý. User approval Q12A–D giữ nguyên, không suy thêm coverage từ approval/tests.

## Deploy và checklist playtest

Link deploy/version và Pages run sẽ cập nhật sau push. Đổi settings cần dùng bản thường để kiểm persistence; fixture music/legacy memory không lưu settings.

1. Bản thường: menu→Settings, kéo3slider, thử Music0/SFX0/Master0, Mute/unmute; reload phải giữ từng giá trị. Khi chơi bấm Pause→Settings→Resume: không dồn SFX/nhảy về đầu nhạc. Mobile kéo bằng ngón tay; desktop Tab/Arrow/Home/End và mouse.
2. [Music fixture](https://gizgity.github.io/a-new-game/?playtest=music): Early→Tension→Anomaly, Boss→Enraged; nghe cùng speaker/headphone, Arrival/Hurt/Heavy vẫn rõ. Draft Mutation/Curse và đánh nhiều hit không làm nhạc giật; Pause/đổi tab/resume/reset không tiếng cũ.
3. [Boss fixture](https://gizgity.github.io/a-new-game/?playtest=boss): Heavy/Detonate vào Elite/Boss, thử Reduce Camera Shake off/on ở Pause; on hết rung nhưng flash/telegraph/warning còn rõ, aim và hitstop không đổi. Thử Fire/Lightning nếu có build tương ứng, kiểm warning trong crowd.
4. Nếu có iPhone/Safari thật: unlock bằng Start, mute/reload, đổi tab/quay lại/resume; báo decode/nhạc mất/khựng dù workaround có hiệu quả.

Phản hồi ngắn: bước/tình huống, quan sát hoặc âm bị che/giật, thiết bị/browser/loa. Dừng **AWAITING USER PLAYTEST APPROVAL — Q12E**; không tự accepted/DDR/Q13.
