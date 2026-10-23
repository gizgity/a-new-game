# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, chơi được trên desktop browser, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## ACTIVE TASK
Đã đưa toàn bộ MVP lên `origin/main` theo yêu cầu user, không force-push. MVP commit `3c24066`; merge `2724ce0` bảo toàn remote commit `b75ef2e` (AGENTS/handoff mới). Repo private chưa có Pages/workflow/hosting, nên chưa có link chơi public; đã hỏi user có cần xuất bản thêm web.

### Điều kiện hoàn thành task đưa lên main
- Source/test/docs MVP được commit và push lên main; đã bảo toàn thay đổi remote.
- Xác minh source/test sau merge giống bản MVP đã PASS; merge chỉ sửa Markdown nên không lặp build/tests theo AGENTS.
- Đối chiếu remote main và local main, working tree sạch sau push; public hosting là bước riêng chưa có đích được chọn.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## ACCEPTANCE CRITERIA
- Có repository instructions và handoff skill sử dụng được.
- Có game chạy trên desktop browser.
- Core combat sword/gun/dash hoạt động.
- Chain Reaction, Mutation và Curse hoạt động.
- Có game loop 5 phút, Boss, victory/death.
- Có i18n cho text người chơi.
- Có save unlock/settings bằng localStorage.
- Build thành công, không có lỗi gameplay nghiêm trọng đã biết.

Tất cả tiêu chí MVP trên đã đạt qua kiểm tra tự động và playtest Chromium. Chưa thay thế đánh giá combat feel thủ công trên thiết bị thật.

## PROGRESS
- [x] M0 — Agent foundation + Game Brief
- [x] M1 — Game scaffold + movement + aiming + arena
- [x] M2 — Melee, ranged, dash và enemy combat
- [x] M3 — Rupture, chain reaction, Charged Shots và Surge
- [x] M4 — Run timer, waves, Mutation/Curse drafts
- [x] M5 — Elite, Boss, victory/death và restart
- [x] M6 — Unlocks, localStorage, SFX và polish tối thiểu

## CURRENT STATUS
- Arena hình học; WASD/mouse aim, LMB combo L1/L2/L3, Shift Heavy/finisher, RMB Basic Shot, E Charged Shot, Space dash, Q Surge.
- Rupture max 3; Shot/Heavy kích Detonate, chain budget 12/tick, Volatile nổ lan. Đủ 3 Charge Points đổi 1 Charged Shot, tối đa 3 viên; Surge max 100.
- Dash hai charges, hồi tuần tự 2.8 giây; Perfect Dodge 0.08 giây đầu khi tránh hit thật. Có knockback/stagger/flash/hitstop/telegraph.
- Run: Grunt/Archer từ đầu, Volatile sau 0:45; Mutation 1:00, Curse 2:00, Mutation 3:00; mỗi draft heal 10 HP không vượt max. Pause/draft đóng băng timer và combat.
- Bulwark 2:30; Chain Warden 4:00 với sweep/vòng đạn/slam khóa vị trí; dưới nửa HP tăng nhịp. Boss không bị stun-lock bởi Basic Shot.
- Victory khi Boss chết trước deadline; mutual kill cùng tick vẫn Victory. Tại tick 18000 (5:00) là deadline/Defeat. Hết HP có Defeat; Play Again reset toàn bộ run/build/resources.
- Sáu Mutation/bốn Curse đã có hiệu ứng, mô tả vi/en và trade-off; xem bảng trong GAME_BRIEF.md. Draft ba lựa chọn adaptive/synergy/wildcard, không lặp Mutation đã sở hữu.
- Bốn mục tiêu tích lũy: hạ 1 quái → Guard Breaker; 5 Detonate → Death Echo; 3 Perfect Dodge → Static Riposte; hạ Boss → cosmetic Prism. Ban đầu có bốn Mutation/ba Curse; không có permanent stat upgrades.
- localStorage lưu locale/mute/volume/cosmetic/totals/unlocks; schema version 1, validate/whitelist, xử lý JSON hỏng/oversized/quota/security errors. Storage bị chặn vẫn chơi trong phiên.
- Procedural SFX qua Phaser Sound Manager cho Light/Heavy Hit, Gun, Dash, Perfect Dodge, Detonate, Hurt; throttle/dedupe và giới hạn voices. UI/settings/HUD/draft/results vi/en, mặc định vi.

## KEY DECISIONS
- Giữ nguyên Project Goal/scope: free-first, KISS, desktop browser, một arena, không backend/account/multiplayer/leaderboard/monetization.
- Phaser 3.90 + TypeScript 5.9 + Vite 7, giữ package-lock; không thêm dependency.
- `cursebreak` chỉ là codename nội bộ, không phải thương hiệu public. Art Neon Occult hình học gốc vẽ bằng Phaser Graphics.
- Simulation fixed 60Hz, normalize hướng chéo, clamp arena, catch-up tối đa 100ms/frame. Logic gameplay độc lập Phaser; UI DOM + dictionary có kiểm tra key bằng TypeScript.
- Balance là tham số tạm. Mutation/Curse/unlock được quyết định ở milestone tương ứng và ghi vào GAME_BRIEF.md.
- Waves tối đa 18 enemies, sau Boss tổng cap 7; tối đa 80 projectiles/24 impacts/12 explosions mỗi tick. Swept segment-circle chống đạn xuyên mục tiêu; mỗi melee resolve một lần.
- Không ECS/custom engine, replay framework, suite E2E/CI phức tạp. Focused tests dùng TypeScript compiler và Node test runner sẵn có.
- Giữ nguyên AGENTS/handoff mới từ remote commit `b75ef2e`: Source of Truth, kiến trúc source tham chiếu và giới hạn resume theo phạm vi user giao. User đã cho phép hoàn thành toàn M3–M6; task hiện tại chỉ đưa code lên main, không tự refactor kiến trúc ngoài scope.
- Script playtest/ảnh/mô phỏng tạm ngoài repo. Khi kiểm tra Vite, import đúng URL module trong document (có thể có timestamp) để tránh tạo game thứ hai.

## RELEVANT FILES
- `AGENTS.md`, `.agents/skills/handoff/SKILL.md`: quy tắc/workflow.
- `GAME_BRIEF.md`: scope/spec, bảng Mutation/Curse/unlock và tham số MVP.
- `src/game/movement.ts`: arena và di chuyển.
- `src/game/combat.ts`: combat/resources/collision, ba common enemies/Elite/Boss, feedback và sound cues.
- `src/game/builds.ts`: IDs và lựa chọn draft.
- `src/game/run.ts`: timeline/waves/drafts/heal/outcomes/restart.
- `src/game/progression.ts`: validation/load/save, whitelist và bốn unlock.
- `src/game/audio.ts`: procedural AudioBuffer qua Phaser Sound Manager, throttle/voice cap.
- `src/game/ArenaScene.ts`: input, fixed simulation, camera, Graphics/telegraph và phase.
- `src/main.ts`, `src/style.css`, `src/i18n.ts`: HUD/menu/settings/draft/results, profile lifecycle và vi/en.
- `tests/combat.test.mjs`, `tests/run.test.mjs`, `tests/progression.test.mjs`: 30 focused tests.

## RUN
- Từ `/workspace/a-new-game`: `npm ci` nếu chưa có dependencies.
- `npm run dev`: port 5173. `npm run build`: typecheck + production output `dist/`.
- `npm run preview`: phục vụ bản production tại port 4173.
- `npm test`: biên dịch logic sang `.test-build/` (gitignored), chạy Node focused tests.

## NEXT ACTION
Chờ user xác định có cần link chơi web public và chọn đích hosting; code MVP đã có trên main.

## BLOCKERS
Không có blocker cho push main hoặc lỗi gameplay nghiêm trọng đã biết. Chưa có đích/cấu hình hosting để xuất bản web; repo private, Pages chưa bật và Actions chưa có workflow. Vite cảnh báo bundle Phaser ~1.25 MB JS/gzip ~347 KB; chưa tối ưu bundle. Chưa đánh giá chủ quan âm thanh/combat feel trên loa và thiết bị desktop của người dùng.

## LAST VALIDATION
- M3: PASS 16 tests, typecheck/build, Chromium LMB → tích Charge → E Detonate/chain → Q Surge, Pause và i18n.
- M4: PASS 20 tests, typecheck/build, Chromium cả ba draft/ba lựa chọn/heal đúng một lần, freeze timer khi Pause/draft, locale và viewport 960×600.
- M5: PASS 26 tests, typecheck/build, Chromium Boss spawn/HUD/telegraph, mutual-kill Victory, slain/deadline Defeat, Play Again reset và i18n.
- M6/cuối: `npm test` PASS 30 tests; typecheck/build PASS, chỉ cảnh báo bundle nêu trên. Tests gồm build effects, chain budget, Boss cooldown, full timeline/deadline/mutual kill, save validation/fallback/idempotent unlocks.
- M6 Chromium: PASS corrupt/blocked storage, locale/mute/volume sau reload, audio buffers/phát SFX, bốn unlock/cosmetic persistence, pool mở thêm và không tăng stat vĩnh viễn.
- Production `npm run preview`: PASS Start/movement/shoot/dash/Pause/settings/vi-en/resize 960×600, 1280×800, 1920×1080; không có runtime/network error.
- Mô phỏng toàn run bằng input tự động, không sửa HP/damage: đủ ba draft, thắng Boss ở 259.4 giây, còn 26 HP. Lượt chỉ ưu tiên quái gần nhất sống tới deadline nhưng thua khi bỏ qua Boss.
- Task main: MVP commit `3c24066`; đã đọc và giữ nguyên AGENTS/skill mới từ remote `b75ef2e`, giải quyết HANDOFF theo trạng thái MVP hiện tại. Merge chỉ thay Markdown, không lặp build/tests theo AGENTS; gameplay giữ nguyên bản đã PASS. `git push -u origin main`: PASS; remote nhận `2724ce0`, bao gồm MVP và commit hướng dẫn mới.
- Đã xem ảnh draft, Boss telegraph, Victory/settings. `git diff --check`: PASS. Đã push main; chưa publish website và chưa playtest thủ công trên thiết bị thật.
