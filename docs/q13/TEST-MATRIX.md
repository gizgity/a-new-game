# Q13 — Test matrix

Ngày 2026-10-30 UTC; code `0472c4af6240f0afabbff959eefd27118a4144ce` (runtime0859d08). Linux container, Node24.19.0, Chromium154.0.8037.57, headless SwiftShader; không GPU/phone thật, không nghe âm thanh. Test code dùng framework/tool đã có, không thêm dependency. Browser profiles đều disposable; pure unit storage dùng memory.

## Thứ tự và commands thực chạy

| Bước | Command/scenario | Kết quả thực và evidence |
| --- | --- | --- |
| 1 static | `git status --short`, `git rev-parse HEAD`, `git fetch origin main`, `git switch -c q13-audit origin/main`; đọc source/contract/test/build | Worktree ban đầu sạch; latest main0472c4a. Fetch đầu bị proxy8080 refused; chạy fetch với sandbox permission phù hợp SUCCESS. Connector fetch HANDOFF SUCCESS, thử fetch_commit sai schema (`repo_full_name`/`commit_sha` required) nên không dùng làm evidence SHA; git fetch/refs là đường xác minh thành công |
| 2 build/typecheck | `npm run build` (bao gồm `npm run typecheck`) | **PASS**, 65modules/7.80s build; warning chunk>500kB. `EVIDENCE/build.log` |
| 3 existing tests | `npm test` | **PASS 32 test files**, fail0, ~6.29s runner; `EVIDENCE/tests.log`. Reuse script nguyên trạng để compile paths nhất quán, một lượt duy nhất, không thêm suite/simulation mới. Aggregate file PASS không gọi thành số assertions chính xác; con số285 ở Q12E là lịch sử |
| 4 browser smoke | `npm run dev`; `node /tmp/q13-browser-check.mjs` (bản `docs/q12e/browser-check.mjs`, chỉ đổi output paths sang Q13) | **PASS** 4viewport; native touch/keyboard sliders, labels≥44px, save/reload, vi-en, menu→play→pause Settings, gainmatrix/mute/source continuity/no replay/duck/reset/shutdown; `EVIDENCE/browser.json`, `browser.log`, ảnh Settings4viewport |
| 5 targeted audio | `node /tmp/q13-priority-check.mjs` (Q12E priority script chỉ redirect output) | **PASS**, Enraged+24enemy+Storm, Fire/Lightning + Boss/Arrival/Hurt/major-impact cue admission/duck/cap; SFX cache52entries/1,914,864bytes@44.1kHz shared, owned SFX0shutdown; `EVIDENCE/priority.json`, `priority.log`. Controlled output scenarios, không natural fight/FPS/listening |
| 5 targeted input | `node /tmp/q13-input-c-check.mjs` (Q12E input-c) | Lần đầu **harness timeout** `page.goto` waiting load30000ms tại chain URL; `EVIDENCE/input.log`. Không đủ evidence gọi game/platform bug. Diagnostic DOMContentLoaded smoke390: canvas=true/primary.enabled=true, không pageerror. Retry đổi duy nhất waitUntil sang DOMContentLoaded trong harness tạm: **INCONCLUSIVE**, timeout chờ/click Start (`EVIDENCE/input-retry.log`); diagnostic riêng chain cho canvas=true/primary.enabled=true (`EVIDENCE/diagnostic.log`). Không count PASS mới |
| 5 targeted mapping | `node /tmp/q13-movement-check.mjs` (Q12B movement script: redirect evidence, goto DOMContentLoaded) | **INCONCLUSIVE**: timeout Start visible/enabled/stable; `EVIDENCE/movement.log`. Không có report movement hoàn chỉnh, không count PASS mới. Reuse actual touch/keyboard/mouse events, controlled fixture, không natural run |
| 6 natural | `node /tmp/q13-natural.mjs` | URL thường, context mới không seed/grant/skip/time acceleration; input Playwright keyboard/mouse, đọc nearest target để aim, xoay hướng đi/Space/E/Q, chọn card đầu. Attempt1 **INCOMPLETE**: cap480vòng/556.936s wall, game tới Draft30s/4kills/47HP, không error nhưng operator giữ chuột khiến draft fresh-input guard chưa ready; không chọn được card, không có result/history/replay. `EVIDENCE/natural.json`, `natural.log`. Không gọi guard này là bug. Attempt2 bổ sung bên dưới; automated operator không human playtest |

Các harness tạm ở `/tmp/` không commit vào runtime/repo, phép thay output tránh ghi đè Q12/Q9 evidence. Source gốc được dẫn để tái chạy; riêng natural operator là script audit nhỏ, không E2E suite mới. Không chạy transport loops48kHz/full parity126 lần vì không có nghi vấn regression tương ứng; dùng evidence lịch sử ghi đúng version.

## Platform và scenario coverage

| Platform / viewport | Kiểm mới Q13 | Evidence lịch sử reuse (không tính PASS mới) | UNKNOWN còn lại |
| --- | --- | --- | --- |
| Chromium touch emulated 320×740 | Settings/menu/pause/vi-en/reload/gains/cleanup **PASS** | Q7C/Q8C/Q9 production crowd/corners/Arrival; Q12E browser-c | Thumb reach vật lý, active combat crowd/motion full stack ở HEAD, device FPS |
| Chromium touch emulated 390×844 | Settings như trên **PASS**; targeted input/movement kết quả bổ sung | Q12B mapping rotate, Q9E reward refresh/corrupt/trail/corners | iOS touch arbitration thực, simultaneous fingers dài hạn, screen reader |
| Chromium touch emulated 844×390 | Settings như trên **PASS** | Q12B390→844 rotate, Q9C/D/E landscape renderer | Real orientation safe-area/Safari/background |
| Chromium fine pointer 1440×900 | Settings native keyboard/menu/pause **PASS**; natural/mapping bổ sung | Q12B resize1440→1100, crowd/Boss/4corners, Q9E complete synthetic reward flow | Desktop Firefox/WebKit/GPU frame-time, natural late-game victory |
| Android Chrome thật / iOS Safari thật | **UNKNOWN — NOT RUN** | Không có bằng chứng real-device mới để reuse | Thermal/FPS/RSS/gesture unlock/visibility/codec/input/save restrictions |
| Firefox / Safari-WebKit desktop | **UNKNOWN — NOT RUN** | Q12D ghi Safari NOT RUN; WAV là fallback implementation, không là compatibility PASS | Decode và cancelAndHoldAtTime/lifecycle/platform rendering |

## Reuse evidence và kiểm source

- Combat: `tests/combat.test.mjs:25` combo, `:80` swept collision, `:131` i-frame/Perfect, `:351` buffering, `:459` miss/impact; `tests/run.test.mjs:61` mutual kill/deadline, `:137` floor/fallback, `:223` replay reset. Tất cả nằm trong lượt test HEAD PASS.
- Legacy/Anomaly/Seal/Mutation/Curse: focused files `legacy`, `elemental-combat`, `anomalies`, `ascension`, `curse-stacking`, `defense-tradeoff` PASS trong cùng lượt; không thêm bot cân bằng.
- Save: `tests/victory-rewards.test.mjs:47` journal recovery/stale receipt; `tests/progression.test.mjs:5` invalid/schema/settings; `tests/collection.test.mjs`; refresh unlock UI `../q9e/production/evidence/flow.json` là lịch sử2fcdfd2, không chạy lại ở HEAD.
- Art: đã mở renderer `../q7c/runtime/after-crowd-390.png` và `../q12e/evidence/settings-1440.png`, đối chiếu palette/silhouette/lane với source và ảnh Settings mới. Không generate/sửa ảnh. Q8C Arrival/Enraged, Q9C/D/E production snapshots tái sử dụng qua `../art-reference/README.md`; không coi ảnh tĩnh là animation/FPS measurement mới.
- Audio: Q12D `INTEGRATION.md`/Q12E `continuity.json`, `transport-c.json` là evidence lịch sử Draft/Curse/hitstop/suspend/hidden/WAV fallback; approval giữ nguyên. Q13 mới xác minh Settings/priority/reset/shutdown, không nghe lại composition/mix.
- Performance: build chunk `i18n-BKzxeDYS.js`1,332.05kB (gzip371.43kB), main121.39kB, CSS34.88kB; chunk tên i18n chứa shared Phaser dependency, không có nghĩa dictionary tự nặng1.3MB. `du -sh public/assets dist` lần audit ~14M/16M (disk allocation, không network download). Music current-group decoded bytes trong browser JSON là estimate buffer, không RSS. **Không đo device FPS, không gọi synthetic timing là FPS defect.**
- Packaging: dist index có favicon/base rewrite đúng, title trống trước JS/bootstrap; no public-name approval mới được suy ra. Workflow main-only, audit branch không auto-deploy; không invoke workflow_dispatch.

## Lỗi công cụ và workaround

Fetch sandbox mặc định proxy refused → elevated fetch thành công; không bypass proxy. Vite/browser chạy trong quyền thực thi được cho phép; không public host/deploy. Connector commit query sai schema bỏ qua, không tạo kết quả giả. Browser input lần đầu timeout load khi có nhiều browser tasks → DOMContentLoaded diagnostic hoạt động nhưng retry input/movement vẫn timeout thao tác Start; chưa đủ evidence khẳng định nguyên nhân contention hoặc regression game. Một lệnh đọc `tail -4` bị CLI option error, sửa `tail -n`; một search dùng glob `*Vfx.ts` không match chữ hoa trả exit1, đọc đúng file sau; không liên quan game. Không sửa bug nào trong audit.

## Giới hạn interpretation

Confirmed missing explanations: Q13-001/002. Potential learnability risk: menu dài/nhiều thuật ngữ, không nhất thiết lỗi. Cần HUMAN: có khám phá và phân biệt mechanics/lý do thua, đọc cue khi đông, agency/tradeoff/repetition cảm nhận. User approvals accepted là evidence lịch sử có giá trị, không proof toàn thiết bị hoặc metric engagement. Balance50% vẫn gate riêng; Q13 không cấp/chặn lại acceptance Q12.

## Natural run — chi tiết cuối

Attempt1 cho thấy hạn chế operator, không performance benchmark: wall time phần lớn đợi Draft, không quy đổi556s thành FPS hay gameplay duration. Attempt2 dùng cùng URL thường/context mới, nhả tất cả input trước card; stationary melee/aim + occasional Charged/Surge, không grant/skip/accelerate. Đây là kiểm run kết thúc qua gameplay thật, không đo balance/engagement và không thay natural Victory qua Anomaly. **Attempt2 PASS cho normal Defeat/result/history/replay:** 65.925s wall, game32.133s,104kills, HP0/reason=slain, Aegis Core chọn tự nhiên, chưa Curse/Anomaly/Boss. History1entry đúng runId1/resultdefeat/duration32/kills104/no reward; Continue/Replay→playing100HP/0.1s. Pageerrors0. `EVIDENCE/natural2.json`, `natural2.log`, `natural2-result.png`. Không có bypass mechanics hoặc ghi world từ harness; stationary policy không là representative player/balance sample.
