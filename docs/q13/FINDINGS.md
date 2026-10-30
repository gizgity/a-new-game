# Q13 — Findings

Baseline: `0472c4af6240f0afabbff959eefd27118a4144ce`, main đã fetch ngày 2026-10-30. Mỗi đường dẫn source dưới đây tương đối root, số dòng thuộc baseline này. FAIL = sai lệch quan sát được; UNKNOWN không tính là bug. XS ≤ nửa ngày, S ~1 ngày, M 2–3 ngày, L >3 ngày; chỉ là ước lượng, không cấp phép sửa.

**Tổng lỗi chứng minh: P0 0 / P1 2 / P2 1. UNKNOWN rủi ro ảnh hưởng cao: 5.** PASS dưới đây có phạm vi hữu hạn, không chứng nhận toàn domain.

## Q13-001 — Hướng dẫn sai mốc Boss

- Domain D/C/E; **FAIL · P1 · XS**. CODE + DOCUMENT + BROWSER.
- Quan sát: `src/i18n.ts:210`, `:211`, `:594`, `:595` ghi Boss ở 450 kills hoặc 4:00 cho cả vi/en, touch/desktop. Kỳ vọng: `src/game/config/balance.ts:43`, `GAME_BRIEF.md:169`, `src/game/run.ts:152`: 1200 kills **và từ 3:40**, fallback 4:00; sau đó warning 2s trước spawn.
- Tái hiện: mở URL thường → đọc menu; đổi vi/en. Chromium Linux 154, 320×740/390×844/844×390/1440×900; renderer menu chọn text theo `src/main.ts:155`. Evidence code đủ tái hiện độc lập; ảnh HUD tham chiếu `../q12e/evidence/settings-1440.png` đã ghi 1200/floor, không gọi ảnh này là lần kiểm Q13.
- Ảnh hưởng: UI đưa hai kỳ vọng tiến trình khác nhau, người chơi không thể dựa vào lời hướng dẫn để dự đoán encounter. Không có bằng chứng người chơi thực tế bị nhầm.
- Tin cậy cao, deterministic. Đề nghị nhỏ nhất: đồng bộ lời hướng dẫn với mốc thực, không đổi pacing/balance. Xác minh lại 4 biến thể text sau khi được phép sửa.

## Q13-002 — Desktop thiếu chỉ dẫn cách Perfect Dodge

- Domain D/H; **FAIL · P1 · XS**. CODE + DOCUMENT.
- Quan sát: welcome desktop vi/en `src/i18n.ts:210`, `:594` có Space Dash nhưng không nói né lúc telegraph vàng để Perfect; bản touch `:211`, `:595` có câu này. `src/main.ts:155` chỉ hiện một trong hai body theo input mode. Footer chỉ liệt kê phím; mô tả Mutation/Curse nhắc lợi ích Perfect mà không dạy thao tác (`src/i18n.ts:332`, `:340`, `:716`, `:724`). HUD feedback báo thành công sau khi đã làm (`src/ui/CombatHUD.ts:115`). Kỳ vọng theo mobile-first + desktop-equivalent: người mới desktop cũng có thể tìm thấy cách thực hiện cơ chế phản công.
- Tái hiện: browser pointer fine, 1440×900 → menu vi/en; đối chiếu touch. Không phải khẳng định người dùng không tự khám phá được.
- Tin cậy cao cho thiếu câu giải thích, trung bình cho mức ảnh hưởng học chơi. Đề nghị: thêm một câu ngắn tương đương touch vào help hiện hữu; không tutorial mới, không đổi timing/telegraph. Kiểm bằng người chơi lần đầu sau thay đổi được duyệt.

## Q13-003 — Packaging vẫn mang nhãn prototype

- Domain J; **FAIL · P2 · XS**. CODE + BROWSER + TEST.
- Quan sát: `src/i18n.ts:199`, `:200`, `:583`, `:584` đặt page title/brand là Prototype/Bản thử nghiệm; `package.json:4` version `0.0.0`; `index.html:9` title trống trước bootstrap và không có description/social metadata. Kỳ vọng public RC: chủ dự án chốt tên hiển thị, nhãn phiên bản và metadata tối thiểu nhất quán.
- Icon riêng **đã có**, không thiếu: `public/favicon.svg:1`; build rewrite đúng `/a-new-game/favicon.svg` (`EVIDENCE/build.log`, kiểm dist/index.html). Không yêu cầu dùng codename CURSEBREAK công khai.
- Tái hiện mọi fresh load/vi-en; `EVIDENCE/natural2-result.png` ở HEAD cho thấy nhãn BẢN THỬ NGHIỆM và dòng kỹ thuật “Normal: baseline Q9C.”; không phù hợp thông tin cần thiết cho người chơi public. Tin cậy cao cho trạng thái, trung bình cho mức polish vì tên public chưa được chốt.
- Đề nghị nhỏ nhất: user chọn tên/nhãn RC; cập nhật metadata/version trong task được duyệt sau. Không thay art/HUD.

## Q13-004 — Combat và deadline có kiểm tra hồi quy

- Domain A; **PASS · priority N/A · scope N/A**. CODE + TEST.
- Kỳ vọng contract combat/Q8C/Q9: combo/Heavy/Basic/Charged/Dash/Perfect/Surge, hit/miss/cancel, bounded chain, Boss và kết quả nhất quán.
- Thực tế: input buffer `src/game/combat.ts:187`, action resolution `:355`, Charged `:392`, damage-on-contact `:433`; `src/game/run.ts:97` kiểm transform freeze, `:114` kiểm Boss slain/mutual kill trước deadline 18000 ticks. Không suy số HP cũ1500 trong docs là hiện hành: config hiện tại Boss2400 (`src/game/config/balance.ts:2`).
- `npm test` PASS 32 file tại HEAD, gồm `tests/combat.test.mjs`, `chain`, `boss-phase`, `elemental-combat`, `anomalies`, `ascension`, `run`. Node runner tổng hợp **32 file**, không tự gọi con số này là 285 assertions mới. `EVIDENCE/tests.log`.
- Lặp lại được, tin cậy cao cho assertions; human combat feel/crowd responsiveness vẫn Q13-008/010. Đề nghị: giữ baseline; chưa có evidence cần rebalance.

## Q13-005 — Settings, priority và cleanup audio giữ contract

- Domain F/I; **PASS · priority N/A · scope N/A**. CODE + TEST + BROWSER.
- Q12A–E accepted giữ nguyên, Q8C Arrival gốc, Q12D V2 156BPM/Phase C continuity không bị mở gate lại. `src/game/config/audio.ts:3` cap8/perframe5/regular3; `src/game/AdaptiveMusic.ts:12` exact grid, `:184` nhả buffer, `:198` destroy/listeners; `src/game/ArenaScene.ts:342` đọc phase để giữ Draft/hitstop music.
- Chạy lại Q12E browser-check (chỉ redirect output sang Q13): 4viewport gains/native sliders/vi-en/reload/mute/no replay/same sources/reset/shutdown PASS, `EVIDENCE/browser.json`. Priority Enraged+24crowd/Storm PASS `EVIDENCE/priority.json`: cue admitted/duck/cap, SFX shared cache và owned nodes0 shutdown. Tests `audio-settings`, `audio-events`, `adaptive-music`, `arrival`, `elemental-audio` PASS.
- Tin cậy cao cho state/cleanup; không headless listening, không đo acoustic mix. Đề nghị: giữ accepted audio; coverage mới không thay approval và không tự buộc A/B lại.

## Q13-006 — Profile/migration/journal có biện pháp bảo vệ thực

- Domain I/E; **PASS · priority N/A · scope N/A**. CODE + TEST.
- `src/game/progression.ts:27` allowlist v1/v2/v3, clamp/default; `:53` corrupt/missing/pending recovery; `:68` journal trước main, quota retry bỏ optional history; `src/game/legacy.ts:34` receipt validation; `src/game/collection.ts:29` receipt/runId dedup và history20. UI persist/retry `src/main.ts:282`, `:449` không chạy tiếp khi save lỗi.
- Tests `victory-rewards`, `progression`, `collection`, `audio-settings` PASS ở HEAD bằng memory storage: legacy/corrupt/failed write/stale journal/reload/idempotency. Browser settings disposable context reload PASS. Không đụng profile người dùng thật.
- Tin cậy cao trong scenarios test; không tuyên bố storage transaction atomic với mọi browser/crash. Đề nghị giữ cơ chế; real-device restriction coverage thuộc Q13-007.

## UNKNOWN — tách khỏi số lỗi chứng minh

| ID / domain | Quan sát so với điều cần biết; evidence chính xác | Repro / tin cậy | Urgency / khuyến nghị nhỏ nhất / effort |
| --- | --- | --- | --- |
| Q13-007 G/H/I/F | **UNKNOWN** compatibility iOS Safari/WebKit, Android thật, Firefox; mới Chromium Linux headless+touch emulation. `EVIDENCE/browser.json`; input/movement Q13 retry timeout nên không có PASS mới (`EVIDENCE/input-retry.log`, `movement.log`, diagnostic Start enabled). Giới hạn lịch sử `../q12d/README.md:84`. Chưa chứng minh gesture unlock/background/storage restriction thực | Coverage thiếu xác nhận chắc chắn; bug platform chưa chứng minh | Cao trước public RC; một iOS Safari + Android Chrome, desktop Firefox, thử move+actions/rotate/background/reload. S, không cần dịch vụ trả phí |
| Q13-008 J/G/H | **UNKNOWN** frame-time/crowd/Boss/thermal/RSS qua nhiều run. Bundle nặng1,332.05kB (gzip371.43) báo warning500kB, `EVIDENCE/build.log`; assets~14MiB; source cap/pool không phải FPS. `src/game/AdaptiveMusic.ts:195` decoded estimate không là RSS | Kích thước đo được chắc chắn; ảnh hưởng device chưa đo. Không kết luận chậm từ software-renderer | Cao; một capture frame-time ngắn trên thiết bị mục tiêu crowd+Boss, lặp restart3lần; chỉ optimize nếu tái hiện. S |
| Q13-009 A/E | **UNKNOWN** natural Victory qua toàn chuỗi Draft→Anomaly→Boss→result/replay trên HEAD. Natural Defeat32.133s/104kills/replay đã hoàn tất, chưa Boss/Anomaly (`EVIDENCE/natural2.json`); fixture/state forcing không thay natural Victory. `src/game/run.ts:113`, `tests/run.test.mjs`, lịch sử `../q9e/production/evidence/flow.json` | Tin cậy cao rằng coverage natural Victory chưa đủ; không bằng chứng flow hỏng | Cao; một run thường đến Boss/Victory trên save thử có unlock hợp lệ, không grant/skip. S |
| Q13-010 D/A/E | **UNKNOWN** first-time learnability, agency/variety cảm nhận, human win rate quanh50%. Hướng dẫn dài là **nguy cơ tiềm năng**, không có quan sát người mới. Gate balance tại `../../HANDOFF.md` BALANCE STATUS; bot55.47% lịch sử không là tỷ lệ người | Không có HUMAN mới trong Q13; accepted Q9/Q12 vẫn giữ nguyên | Cao; user playtest balance riêng và vài first-time observations ngắn; ghi thao tác/thiết bị/lý do kết thúc, không retention metric giả. S–M |
| Q13-011 J | **UNKNOWN** live Pages đúng bytes HEAD/runtime và rollback thực. `.github/workflows/pages.yml:28` build/upload/Deploy; HANDOFF lưu Pages41081881459 SUCCESS lịch sử, chưa live hash/rollback verification; tagv0.1.0 là bản cũ | Deploy lịch sử có document; public smoke/current recovery chưa chạy Q13 | Cao; đối chiếu artifact/hash với phiên bản public và xác nhận cách quay về known-good SHA trước RC; audit không deploy/rollback. S |

Các dòng UNKNOWN đều có status UNKNOWN, priority **N/A (verification-only)**, không tự gán P0/P1 cho bug chưa chứng minh. Licensing/provenance: index `../art-reference/README.md:5` và source manifests ghi nguồn/prompt/rights, generated output không mặc định CC0/độc quyền; chưa có legal review độc lập, không khẳng định đã clearance toàn bộ. Không phát hiện missing asset trong smoke; lỗi tải mọi asset/codec cùng lúc chưa fault-injection mới, N/A acoustic quality assertion trong headless.

## Q13-012 — Run thường kết thúc và replay hoạt động

- Domain E/I; **PASS · priority N/A · scope N/A**. BROWSER. Kỳ vọng: HP0 chốt Defeat/slain, recap/history một lần, replay reset.
- Chromium154/Linux1440×900, URL thường, profile mới; stationary melee + occasional E/Q, chọn card đầu bằng DOM click sau nhả input. Không grant/skip/time acceleration/world mutation. `EVIDENCE/natural2.json`, `natural2-result.png`, `natural2.log`: 32.133s game/104kills/AegisCore, HP0/slain, history1entry đúng, no reward, replayplaying100HP/0.1s, pageerrors0.
- Repro bằng flow và input trên; số kills/thời điểm không deterministic, không coi là human/balance/playfeel. Tin cậy cao cho terminal/save/replay ở run này; full Victory/late game UNKNOWN Q13-009. Đề nghị giữ behavior, xác minh late game riêng. Attempt1 failed operator được giữ trong TEST-MATRIX, không bỏ evidence bất lợi.
