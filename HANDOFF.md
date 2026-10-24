# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Deploy bản Q1 + mobile-first lên GitHub Pages hiện có qua GitHub Actions. User đã cho phép **xong việc thì tự deploy, không cần chờ xác nhận**; dùng workflow `.github/workflows/pages.yml`, không Sites/hosting khác. Đang tích hợp remote main `dc3aef5` (cấu hình Pages + Vite base `/a-new-game/`) với code mobile đã kiểm tra. Q1 vẫn AWAITING VISUAL APPROVAL và mobile chờ device playtest; các trạng thái này không chặn deploy theo yêu cầu mới. Q2–Q5 chưa được giao.

## ACCEPTANCE CRITERIA — DEPLOY
- Giữ nguyên workflow/base trên remote, bảo toàn thay đổi Q1/mobile và lịch sử; push main không force.
- Build/typecheck PASS với base `/a-new-game/`; kiểm tra touch/asset trong subpath phù hợp.
- GitHub Actions build/upload/deploy PASS cho đúng commit đã push; báo URL Pages và giới hạn xác minh URL trực tiếp nếu môi trường chặn.
- Lưu quyền tự deploy sau khi hoàn tất công việc; không tự coi deploy thành visual/experience acceptance.

## ACCEPTANCE CRITERIA — MOBILE
- Phone 360×640 / 390×844, landscape 844×390 và tablet: menu/HUD/draft/settings/results nằm trong viewport, overlay cuộn được khi cần; controls tối thiểu 44 CSS px.
- Player đủ lớn để đọc silhouette/animation; touch controls tránh vùng chơi chính, hỗ trợ safe-area.
- Đa chạm: joystick di chuyển đồng thời giữ Chém/Bắn và kéo ngắm; dùng được dash/Heavy/Charged/Surge; nhả/cancel/pause/draft/resize/blur không giữ input cũ.
- Desktop keyboard/mouse và combat timing/balance giữ nguyên. Build/typecheck, focused regression và browser touch smoke PASS; có screenshots dọc/ngang.
- Giả lập không thay thế kiểm tra thiết bị thật/Safari hoặc người dùng duyệt feel/visual.

## ACCEPTANCE CRITERIA — Q1
- Fractured Vessel: lõi và giáp tách mảnh, silhouette nhận diện được, artwork có chủ đích thay hình học debug của player.
- Idle/movement/melee/shoot/dash có animation phân biệt; slash sắc cạnh có chuyển động, dash fragmented afterimages.
- Đồng bộ visuals với combat hiện có; không thay balance/hitbox hay các hệ thống Q2–Q5. Phần mobile được giao sau Q1 bổ sung input adapter, layout và camera.
- Typecheck/build PASS; focused regression và playtest ngắn không phát hiện gameplay regression.
- Có screenshot/preview ở kích thước chơi và chi tiết động tác để người dùng đánh giá.
- Chỉ accepted khi người dùng xác nhận hình ảnh; trước đó **AWAITING VISUAL APPROVAL**. Build/tests không thay thế experience acceptance.

## PROGRESS
M0–M6 có functional implementation; các kiểm tra cũ xác nhận logic/luồng chạy, không xác nhận chất lượng trải nghiệm toàn MVP.

| Checkpoint | Trạng thái | Bằng chứng cần có |
| --- | --- | --- |
| Mobile-first — layout, input, camera | IN PROGRESS — AWAITING DEVICE PLAYTEST | Functional checks/production emulation PASS, ảnh mới ở docs/mobile; chờ kiểm tra thiết bị và người dùng duyệt feel |
| Q1 — Player art, animation và combat readability | IN PROGRESS — AWAITING VISUAL APPROVAL | Code/art và kiểm tra kỹ thuật đã có; ảnh/GIF bên dưới. Chờ người dùng duyệt visual |
| Q2 — Melee, ranged, dash feel và impact feedback | NOT VERIFIED | Playtest timing/buffering/cancel/impact, thao tác nhanh và cảm nhận điều khiển |
| Q3 — Enemy identity, telegraph và precision encounters | NOT VERIFIED | Đọc pattern/telegraph/recovery trong mob, Elite và Boss encounters |
| Q4 — Rupture, Detonate và Chain Reaction depth | NOT VERIFIED | Chơi có setup/trigger, chọn vị trí/mục tiêu và hệ quả chain |
| Q5 — Mutation/Curse gameplay synergies | NOT VERIFIED | Đối chiếu concept gốc, các build tạo hành vi khác nhau và draft phản ánh lối chơi |

## IMPLEMENTATION AUDIT
| Phần | Functional implementation | Experience acceptance / khoảng thiếu |
| --- | --- | --- |
| ArenaScene.ts trước Q1 | Player hình thoi xoay, sector slash, vòng tròn dash; flash/telegraph có render | Chưa có Fractured Vessel, articulation hay animation phân biệt. Q1 thay phần player/VFX này |
| combat.ts — melee/input | L1/L2/L3: windup 0.05s, duration 0.24/0.28/0.36s; Heavy 0.24/0.58s; resolve một lần tại windup; giữ nút lặp đòn | Chưa có buffer cho tap melee/shoot/heavy trong recovery. Space chỉ được giữ qua frame thiếu tick/hitstop; không phải action buffer chung. Timing/feel chưa được duyệt (Q2) |
| combat.ts — dash/feedback | Dash 2 charges, 0.18s, 920px/s, hủy melee; Perfect Dodge 0.08s; knockback/stagger/hitstop/flash/SFX | Có logic nhưng chưa chứng minh độ đọc/cảm giác trúng đòn, tính rõ ràng của cancel và dodge (Q2) |
| combat.ts — enemies | Grunt/Archer/Volatile/Bulwark, Boss ba pattern; windup/cooldown, Boss cap 7 | Artwork còn primitives, recovery chưa có pose; Elite gần Grunt về pattern. Mob/precision distinction chưa được experience accepted (Q3) |
| combat.ts — chain | Melee đặt 3 Rupture; Shot/Heavy kích nổ, lan damage/Detonate sang mục tiêu trong radius; Volatile/Death Echo nối queue; budget 12/tick | Là mechanic thật, không chỉ VFX; setup/độ đọc/chiều sâu quyết định chưa verified. Queue vượt budget bị bỏ, cần đánh giá khi làm Q4 |
| builds.ts — Adaptive Evolution | So số shots/melee/dashes để chọn preferred; synergy dựa detonations/Catalyst/Phantom Edge; fallback ngẫu nhiên nếu thiếu pool | Đếm số hành động có rate khác nhau; không xét chất lượng timing/hiệu quả. Fallback vẫn mang nhãn adaptive/synergy. Chưa chứng minh phù hợp hành vi (Q5) |
| Mutation/Curse trong Brief | Đủ 6/4, effect và trade-off có code/tests; xem bảng hiện trạng trong Brief | Nhiều effect chỉ tăng stat, lệch yêu cầu thay đổi cách chơi. Bản Brief M0/M1 không ghi concept effect chi tiết; chưa có Art Bible riêng trong repo. Không tự sáng tác concept gốc hay thay effects ở Q1 |

## CURRENT STATUS
- Brief đã có QUALITY BAR & EXPERIENCE ACCEPTANCE; effect Mutation/Curse được ghi là functional implementation, chưa đồng nghĩa concept accepted. User mở rộng nền tảng sang mobile-first; Project Goal đã đổi phần platform theo yêu cầu này, các quyết định nội dung giữ nguyên.
- Q1: atlas SVG 8 frames, 9 sprite parts; idle/movement/melee/shoot/dash, slash đa đoạn và pool 6 fragmented afterimages; animation đóng băng theo pause/draft/hitstop. Prism dùng tint lõi, giữ unlock/settings. Art vẫn chờ duyệt.
- Mobile: `TouchControls.ts` dùng Pointer Events/capture theo từng ngón; joystick trái, giữ/kéo Chém/Bắn để ngắm, các nút Lướt/Heavy/Tích lực/Surge và số tài nguyên. Nhả giữ hướng; joystick đổi hướng nhìn khi không giữ nút ngắm. Không auto-aim.
- Tap chỉ giữ qua frame thiếu tick/hitstop, consume một lần mỗi tick; không buffer qua recovery/cooldown. Cancel dash không lưu trong keyboard queue. Pause/draft/result/resize/blur xóa contacts/queued input; khi đổi tab game pause.
- UI mobile-first: HUD gọn; draft phone một cột; overlay cuộn nội bộ; safe-area/dvh. Controls ≥44px, chừa vùng dưới khi dọc và hai góc dưới khi ngang. Player phone ~24–27 CSS px; tablet ~42px. Desktop keyboard/mouse còn hỗ trợ.
- CombatWorld/movement/run/builds và balance/timing/hitbox không sửa. Không thêm dependency/engine/QA framework.
- Evidence mới: [production dọc](docs/mobile/portrait.png), [production ngang](docs/mobile/landscape.png), [move + shoot đa chạm](docs/mobile/move-and-shoot.png), [menu 320px](docs/mobile/small-menu.png), [draft phone](docs/mobile/phone-draft.png), [tablet](docs/mobile/tablet.png), [Boss preview](docs/mobile/boss-preview.png).
- Evidence Q1 gốc: [cận cảnh](docs/q1/fractured-vessel.png), [động tác](docs/q1/actions.png), [GIF](docs/q1/action-preview.gif). GIF zoom 2×, cảnh kiểm tra riêng; draft/Boss ảnh mobile dùng fixture mở state thật. Các ảnh này không chứng minh full-run combat feel.
- Source nền commit 09625b9 trên branch work; thay đổi Q1 + mobile còn trong working tree, chưa commit/push.

## KEY DECISIONS
- Free-first, KISS, mobile-first + desktop browser, một arena; không backend/account/multiplayer/leaderboard/monetization.
- Phaser 3.90 + TypeScript 5.9 + Vite 7; fixed 60Hz, catch-up tối đa 100ms; logic độc lập rendering. Giữ package-lock.
- Codename cursebreak không phải tên public. Art Neon Occult / Fractured Geometry gốc, không asset sao chép. Fractured Vessel bám yêu cầu user và phần Art của Brief; nguồn Art Bible chi tiết chưa có trong repo.
- UI vi/en qua t(key); UI cảm ứng được user cho phép trong phần mở rộng mobile-first. Save/unlock/cosmetic giữ contract hiện có.
- Giữ run 5 phút, timeline, mob/Elite/Boss, 6 Mutation/4 Curse; không permanent stat upgrades.
- Deploy sau khi hoàn tất qua GitHub Actions/Pages đã setup, không chờ approval riêng; không dùng Sites/hosting khác. Không ECS/custom art engine, replay/QA framework hoặc dependency mới. Test/playtest scripts tạm ngoài repo; preview evidence cần giữ để review.

## RELEVANT FILES
- AGENTS.md, .agents/skills/handoff/SKILL.md: workflow đã đọc.
- GAME_BRIEF.md: source of truth, quality bar và ghi nhận lệch concept.
- src/game/ArenaScene.ts: input/fixed step/render integration; src/game/combat.ts: combat state/timing.
- src/game/PlayerVisual.ts: sprite poses, slash, muzzle flash và pool afterimages; public/assets/fractured-vessel.svg: atlas gốc 8 frames 32×32, sửa trực tiếp không cần generator/dependency.
- src/game/builds.ts: Adaptive Evolution; src/game/run.ts: run/draft/outcome.
- src/ui/TouchControls.ts: touch input adapter; src/style.css: mobile-first/responsive UI; src/main.ts và src/i18n.ts: UI/settings/cosmetic + vi/en; tests/*.test.mjs: 30 focused tests hiện có.
- docs/q1/: Q1 và audit mobile cũ; docs/mobile/: screenshots sau mở rộng mobile-first. Scripts kiểm tra/xuất ảnh ở /tmp/q1-browser, không thêm QA framework vào repo.

## RUN
- npm run dev (5173); npm run build (typecheck + dist); npm run preview (4173); npm test.

## LAST VALIDATION
- Build cuối: `npm run build` PASS (gồm typecheck), `npm test` PASS các file combat/run/progression. Vite giữ cảnh báo chunk Phaser >500 kB (~1.27 MB JS, gzip 351 kB); chưa đánh giá hiệu năng trên máy thật.
- Layout Chromium touch/DPR 2: 320×568, 360×640, 390×844, 844×390, 768×1024 PASS; page đúng viewport, controls ≥44px; tap Start, cả lựa chọn draft thứ ba, settings/mute, resume được. Đã xem screenshots dọc/ngang/menu/draft.
- Touch CDP: PASS hai ngón move + aim/shoot, nhả độc lập, pointercancel, tap melee, Heavy, Charged, Surge, dash qua hitstop đúng một lần; cancel dash trong hitstop và tap recovery qua frame 100ms không tạo hành động trễ/lặp. Fixture riêng tắt waves, cấp tài nguyên để kiểm nút; không xem là run tự nhiên đầy đủ.
- PASS clear input khi pause/draft/rotation/blur, death/victory và restart. Boss HUD đọc được trong camera mobile. AudioContext unlock bằng tap DOM: running, locked=false; chưa nghe/đánh giá âm thanh trên thiết bị thật.
- Production mobile 390×844 và 844×390: PASS asset HTTP 200, đa chạm move/shoot, melee/dash, pause, locale vi/en/aria labels và persistence sau reload; page không overflow, không page/request error. Ảnh production dùng keyboard-free touch.
- Desktop smoke: PASS WASD/mouse/LMB/RMB/Shift/Space, Esc pause/resume, vi/en, resize 960×600 / 1440×1000 / 1920×1080; production PASS asset/actions/pause/resize.
- Q1 trước mobile: renderer read-only đối với CombatWorld; hitstop thật giữ pose/age, reset xóa ghosts/recoil. Visual chưa được user accepted.
- `git diff --check` PASS. Chưa Safari/iOS, thiết bị thật, perf/feel thực tế hoặc full run bằng cảm ứng; không tuyên bố mobile experience đã accepted.

## AUDIT MOBILE TRƯỚC KHI MỞ RỘNG
Bản desktop trước đó tải được nhưng mobile FAIL: menu 440px/draft ba cột bị cắt, HUD chồng chữ, page ngang cao 520px trên viewport 390px, player dọc ~9–10px và chỉ tap melee được. Các lỗi layout/input này đã được xử lý trong implementation mới và checks bên trên; ảnh cũ ở docs/q1/mobile-*.png chỉ là baseline.

## NEXT ACTION
Tích hợp origin/main, kiểm tra build dưới subpath Pages, push main và theo dõi Actions tới deploy thành công. Không triển khai Q2–Q5.

## BLOCKERS
Không blocker kỹ thuật đã biết trong phạm vi kiểm tra. Còn visual approval và device playtest/Safari; Art Bible/concept effect gốc chi tiết chưa có trong repo/history đã kiểm tra. Q2–Q5 vẫn chưa được giao triển khai.
