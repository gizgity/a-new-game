# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Q2 và cụm nút phải mobile đã triển khai/deploy. User playtest bản trước “khá ổn”, xác nhận khó chuyển nhanh Chém/Bắn/Lướt; bản cuối gom ba nút thành tam giác 78–82px giữa các tâm. Commit game cuối `4f10e2f`, Actions run **40046706621 — success**: https://github.com/gizgity/a-new-game/actions/runs/40046706621. Chơi: https://gizgity.github.io/a-new-game/. **AWAITING PLAYTEST APPROVAL** cho Q2/bố cục mới; chưa coi feedback bản cũ là duyệt visual Q1. Dừng sau Q2, Q3–Q5 chưa giao.

## ACCEPTANCE CRITERIA — Q2 + MOBILE
- Cụm nút phải ưu tiên Chém/Bắn/Lướt theo tầm với ngón cái; đòn phụ phân cấp, Surge tránh bấm nhầm; targets ≥44px, không chồng/cắt ở 320px, dọc/ngang/tablet.
- Tap cuối recovery/cooldown được giữ tối đa 120ms simulation time, thực hiện một lần; không queue dài hoặc hành động ma sau cancel/pause/draft/resize/reset. Giữ nút lặp theo cadence; dash ưu tiên thoát đòn.
- Light/Heavy có chuẩn bị → hit → recovery, pose/trail đi qua hướng ngắm trên damage tick; recoil/impact phân biệt Basic/Charged; miss/hit/Heavy/Perfect Dodge đọc được.
- Giữ damage/range/resources/enemy/chain/build/run; thay timing và feedback trong Q2 như Brief. Không triển khai Q3–Q5.
- Typecheck/build, focused logic tests, browser touch/desktop smoke PASS; có screenshot/preview. Cảm nhận combat/bố cục trên máy thật cần user duyệt, không tự accepted qua tests.
- Tự deploy bằng workflow Pages hiện có sau checks PASS; không cần hỏi lại. Deploy không đồng nghĩa experience acceptance.

## PROGRESS
M0–M6 là functional implementation, không phải chứng nhận chất lượng toàn MVP.

| Checkpoint | Trạng thái | Bằng chứng / còn thiếu |
| --- | --- | --- |
| Mobile-first — layout, input, camera | IN PROGRESS — AWAITING PLAYTEST APPROVAL | User playtest bản cũ “khá ổn”; bố cục phải mới cần thử lại trên máy thật |
| Q1 — Player art, animation và combat readability | IN PROGRESS — AWAITING VISUAL APPROVAL | Sprite/pose/VFX + ảnh/GIF có; chưa có xác nhận riêng visual |
| Q2 — Melee, ranged, dash feel và impact feedback | IN PROGRESS — AWAITING PLAYTEST APPROVAL | Implementation + focused tests + touch/desktop browser checks; chờ user duyệt feel |
| Q3 — Enemy identity, telegraph và precision encounters | NOT VERIFIED | Cần pattern/telegraph/recovery, mob vs Elite/Boss |
| Q4 — Rupture, Detonate và Chain Reaction depth | NOT VERIFIED | Cần setup/trigger, vị trí/mục tiêu và hệ quả chain |
| Q5 — Mutation/Curse gameplay synergies | NOT VERIFIED | Cần concept gốc, build thay hành vi và draft theo lối chơi |

## IMPLEMENTATION AUDIT
| Phần | Functional implementation | Experience acceptance / khoảng thiếu |
| --- | --- | --- |
| ArenaScene / Q1 | Fractured Vessel nhiều mảnh, idle/move/melee/shoot/dash, fragmented echoes; Q2 đồng bộ slash với damage | Player chờ visual approval; enemy/floor vẫn artwork prototype |
| combat.ts — Q2 | Windup L1/L2/L3 4/5/6 ticks, Heavy 0.24s; total 0.24/0.28/0.36/0.58s. Buffer 120ms, windup tracking rồi khóa aim, dash cancel | Tests/browser chứng minh mechanics; nhịp và cảm giác mới cần user chơi |
| dash/feedback — Q2 | Dash 2 charges/0.18s/920px/s, Perfect 0.08s; sửa i-frame tick cuối. Contact sparks/SFX/hitstop theo nguồn | Không thay speed/recharge/damage; feel trên touch thật chưa accepted |
| enemies — Q3 | Grunt/Archer/Volatile/Bulwark/Boss có windup/cooldown; Boss ba pattern và cap 7 | Primitives, recovery poses thiếu; Elite gần Grunt, precision contrast chưa verified |
| chain — Q4 | Rupture/Detonate gây và lan damage thật; budget 12/tick; Volatile/Death Echo nối queue | Depth chưa verified; queue vượt budget bị bỏ; không chỉnh ở Q2 |
| builds.ts — Q5 | Adaptive so bộ đếm shots/melee/dashes; synergy theo vài điều kiện; fallback ngẫu nhiên | Khác rate hành động, chưa xét hiệu quả; fallback vẫn nhãn adaptive/synergy |
| Mutation/Curse | Có 6/4 effects và trade-offs/tests | Nhiều stat-only; lịch sử M0/M1 chưa ghi concept effects gốc; không tự sáng tác concept thiếu |

## CURRENT STATUS
- Cụm phải 184×184: Chém 68px dưới phải, Bắn 64px phía trên, Lướt 60px ở giữa phía trong (tam giác có khoảng tâm 78–82px để chuyển nhanh); Heavy/Tích lực 52px, Surge 48px tách góc trên. Joystick 80px để vừa 320px; portrait dành 204px controls, landscape overlay ở góc. Giữ safe-area/dvh, vi/en và pointer capture.
- CombatWorld giữ một slot offensive buffer; tap mới thay slot, simultaneous ưu tiên Heavy. Dash/Surge có buffer ngắn riêng; capture trước hitstop, tuổi buffer chỉ giảm khi simulation chạy. Adapter consume tap mỗi tick để không lặp ở catch-up; keyboard/mouse cũng giữ được tap giữa hai tick.
- Dash clear đòn/buffer cũ, không queue khi hết charge. Tap gần cuối dash nối đòn sau khi kết thúc; held inputs vẫn hoạt động. clearInput nối với pause/draft/results/reset/resize/blur/cancel; resize cũng reset keyboard/mouse.
- Windup light 4/5/6 ticks, tổng đòn giữ nguyên. Aim theo windup và khóa ở contact. Blade/trail bắt đầu sweep trước damage một nửa sweep time, nên contact/hitstop nằm giữa nhát chém; bỏ full-arc flash cũ. Mỗi đòn resolve một lần.
- Miss có whoosh, hit mới có contact sparks và hitstop. Light/Shot mint/ivory, Heavy/Charged amber; Basic Shot hitstop 12ms, Light 33ms, Charged 40ms, Heavy 65ms (ceil fixed tick). Chain/blast giữ hitstop cũ. Perfect Dodge có dấu gãy bốn hướng; SFX phân biệt trúng đạn và chém.
- Charged recoil mạnh hơn; pose/muzzle dùng lastShot thực tế, không đoán bằng cooldown hoặc hướng ngắm sau bắn. Pose/trails freeze theo simulation như Q1.
- Giữ damage/range/knockback/resources/AI/run/builds/chain/dependencies. Không thêm engine, feature hoặc QA framework.
- Q1 atlas SVG 8 frames/9 parts và Prism core tint giữ nguyên. Không có Art Bible riêng trong repo; visual dựa Brief và yêu cầu Fractured Vessel của user.

## EVIDENCE
- Q2: [Light](docs/q2/light.png), [Heavy](docs/q2/heavy.png), [Shot](docs/q2/shot.png), [Charged](docs/q2/charged.png), [Perfect Dodge](docs/q2/perfect.png), [Dash](docs/q2/dash.png). Ảnh actual renderer ở phone 390×844/DPR2, fixture địch/tài nguyên để thấy feedback; không phải full natural run.
- Bố cục: [production dọc](docs/q2/portrait.png), [production ngang](docs/q2/landscape.png). Layout 320/360/390/844/768 đã kiểm và xem ảnh dọc/ngang.
- Q1 cũ: docs/q1/fractured-vessel.png, actions.png, action-preview.gif (zoom2×); docs/mobile/ là bản mobile trước Q2. docs/q1/mobile-* là baseline FAIL trước mở rộng mobile, không phải bản hiện tại.

## KEY DECISIONS
- Mobile-first + desktop, một arena, run 5 phút, 1 sword/gun, 3 mobs/Elite/Boss, 6 Mutation/4 Curse; không permanent stat upgrades, backend/account/multiplayer/leaderboard/monetization.
- Free/open-source, KISS; Phaser 3.90 + TypeScript 5.9 + Vite 7; fixed 60Hz, catch-up tối đa 100ms; logic độc lập renderer. Không dependency mới.
- UI vi/en qua t(key). Codename cursebreak không phải public brand; original Neon Occult / Fractured Geometry, không sao chép asset.
- Quyền tự deploy sau checks PASS đã được user cấp và ghi AGENTS.md. Dùng `.github/workflows/pages.yml`, base `/a-new-game/`, dist qua GitHub Actions; bảo toàn remote, không force, theo dõi run tới kết thúc. Không Sites/hosting khác.
- Remote main được bảo toàn, push không force. Code Q2 `446b972`, polish `d237bf5`, bố cục tam giác cuối `4f10e2f`; commit handoff sau deploy chỉ Markdown, không đổi artifact.

## RELEVANT FILES
- GAME_BRIEF.md: quality bar, scope và contract Q2; AGENTS.md + .agents/skills/handoff/SKILL.md đã đọc.
- src/game/combat.ts: buffer/timing/contact/dash; ArenaScene.ts: input/graphics; PlayerVisual.ts: poses/slash/recoil; audio.ts: procedural SFX.
- src/ui/TouchControls.ts + src/style.css: touch adapter và bố cục; tests/combat.test.mjs: thêm 11 focused Q2 tests, không tạo framework.
- src/game/builds.ts / run.ts / progression.ts: contracts giữ nguyên; public/assets/fractured-vessel.svg: atlas gốc.
- vite.config.ts + .github/workflows/pages.yml: workflow/base có sẵn, không sửa.

## RUN
npm run dev (5173); npm run build (typecheck + dist); npm run preview (4173); npm test.

## LAST VALIDATION
- GitHub Actions run `40046706621` completed/success cho head `4f10e2fad37d0afb4893ea0a95a4a933f31ec610`: npm ci/build/configure/upload/deploy đều PASS; job `120729989991` success. Các bản Q2/polish trước cũng deploy PASS; bản cuối đã chứa phản hồi chuyển nút của user.
- Focused suite PASS: 41 test definitions trong 3 files, gồm 11 Q2 tests (buffer expiry/once/latest, Heavy/Charged transitions, hitstop/dash/Surge cancel, reset, windup lock và ticks, miss/contact feedback, i-frame tick cuối). Existing combat/run/progression regression PASS.
- Chromium touch/DPR2: 320×568, 360×640, 390×844, 844×390, 768×1024 PASS: tất cả nút ≥44px, không chồng/cắt/overflow, không runtime errors; screenshots dọc/ngang đã xem.
- CDP touch PASS: move + aim/shoot, nhả độc lập/cancel; tap cuối recovery nối đúng một lần, tap sớm hết hạn; Light→Heavy, dash cancel, shoot cuối dash, Charged sau Heavy; dash/Surge qua hitstop và cancel dash. Phase pause/draft/defeat/victory/rotation clear input; vi/en PASS. Fixture tắt waves/cấp resource cho các edge cases này.
- Natural-wave smoke ~20s bằng CDP touch: 90HP, 2 kills, 103 shots, không runtime error; scripted movement/aim, không cấp stats/resources hoặc bất tử. Không coi là human feel/full-run acceptance.
- Desktop smoke PASS mouse tap, WASD + RMB, Shift/Space, Esc pause/resume không dư hành động.
- Build/typecheck bản pose cuối, CSS tap-highlight và bố cục tam giác cuối PASS; production `/a-new-game/` PASS 390×844, 844×390 và desktop 1440×1000: SVG HTTP200 đúng base, move/shoot/dash/pause/resume, không runtime/request/HTTP errors. Bundle warning Phaser >500kB là hiện trạng (~1.27MB JS/gzip352KB), không mở scope bundling.
- Không xác nhận Safari/iOS, cảm nhận âm thanh/performance/tầm với trên máy thật hay full-run. User chỉ phản hồi bản trước Q2 “khá ổn”.

## NEXT ACTION
Chờ user chơi bản Pages Q2, đánh giá chuyển Chém/Bắn/Lướt, nối đòn/dash cancel và impact trên điện thoại. Chỉ sửa tiếp theo phản hồi được giao; không tự triển khai Q3–Q5. Sau sửa đổi được giao và checks PASS, tự deploy theo quyền đã cấp.

## BLOCKERS
Không blocker đã biết. URL Pages trực tiếp ngoài allowlist; xác minh deployment qua Actions và production local đúng subpath. Q2/bố cục mới vẫn chờ user playtest, Q1 vẫn chờ xác nhận visual; Q3–Q5 chưa giao.
