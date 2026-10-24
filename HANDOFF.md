# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Theo playtest mới: giữ/kéo cụm nút phải phải đổi hướng ngắm; giảm độ khó trước buff đầu tiên. Đã triển khai joystick ngắm khi giữ nút phải (vòng116/núm40), kéo ngoài nút vẫn nhận; joystick trái dẫn hướng khi chưa drag aim. Giảm HP/common spawn pressure phút đầu, ramp tuyến tính về chuẩn trong phút thứ hai. Giữ mốc draft 1/2/3 phút, Elite/Boss và nội dung MVP; không triển khai Q3–Q5. Tests/build/browser PASS, đã deploy; **AWAITING PLAYTEST APPROVAL**.

## ACCEPTANCE — AIM & OPENING BALANCE
- Kéo giữ nút phải cập nhật reticle/hướng ngắm; Heavy/Charged hoạt động như Chém/Bắn. Joystick trái vẫn hướng player khi ngón phải chưa kéo; sau drag aim, hai ngón độc lập. Capture ngoài nút, nhả/cancel/pause/resize không dính input; desktop giữ nguyên.
- Grunt trước buff đầu hạ sau hai Light trúng liên tiếp không buff; một Light + Basic Shot/Detonate vẫn hữu ích. Opening ít quái/nhịp chậm hơn, sau draft #1 tăng dần về nhịp chuẩn tới2:00; không tăng damage toàn game hoặc nerf Elite/Boss.
- Focused regression tests, build/typecheck và browser mobile dọc/ngang/desktop PASS; natural opening smoke. Cảm nhận aim/balance vẫn AWAITING PLAYTEST APPROVAL sau deploy.

## ACCEPTANCE — TOUCH FIX
- Pad di chuyển tối thiểu 132×132 (trước 80×80); tap ngoài vòng cũ vẫn nhận, kéo ra ngoài pad vẫn giữ capture; không đè nút phải ở 320px/dọc/ngang/tablet.
- Hold/rapid taps/đa chạm trong game không chọn chữ, callout/context menu, double-tap hoặc pinch zoom. Scope active arena; menu/draft/settings vẫn cuộn và thao tác được.
- Nhả/cancel/pause/resize không dính input; keyboard/mouse không regression. Build/typecheck và browser gesture/layout checks PASS; screenshot. Emulation không thay Safari/iOS thật.

## ACCEPTANCE — CHARGED FEEDBACK
- Charged khác Basic rõ ở kích thước chơi mobile: recoil/muzzle, silhouette projectile/trail, hit và blast theo pha core → shockwave → shards.
- Blast theo đúng radius hiện có, không che kín telegraph; không thêm damage, AoE khi trúng mục tiêu không có Rupture, hitstop hay screen flash toàn màn hình.
- SFX khai hỏa/nổ riêng, audio đồng thời và VFX vẫn bounded; pause/reset không để hiệu ứng dư.
- Build/typecheck + focused contract tests + preview/smoke dọc/ngang/desktop PASS. Chỉ ghi AWAITING PLAYTEST APPROVAL sau deploy.

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
- Aim follow-up: mỗi nút phải hiện joystick116px khi giữ, knob40px dịch tối đa38px; kéo tính từ điểm chạm đầu, deadzone8px. Tất cả6 action đều cập nhật aim, capture vượt nút; chỉ contact đã drag khóa aim khỏi joystick trái. Nhả/reset gỡ ring; dash không đổi quỹ đạo giữa đợt, Surge radial. Menu vi/en có hướng dẫn drag.
- Balance follow-up: config/balance.ts giữ HP chuẩn theo loại (sửa lỗi HP phụ thuộc spawn id), opening Grunt36/Archer28/Volatile36; 3 quái ban đầu,150ticks/spawn,cap8 tới60s. Ramp HP mới/interval/cap tới chuẩn ở120s, không heal survivor. Player damage/resources/timing, draft1/2/3 phút, Elite/Boss/chain/build giữ nguyên.
- Touch follow-up: `TouchControls` bật class touch-playing trên arena khi coarse pointer + phase playing. CSS touch-action:none, user-select:none, -webkit-user-select:none/-webkit-touch-callout:none phủ canvas/HUD/gaps/controls. Non-passive touchstart/move/end + gesturestart/change/end/selectstart/contextmenu/dragstart/dblclick guard chỉ active arena, không stopPropagation. Gỡ khi menu/paused/draft/results; không thêm maximum-scale/user-scalable=no.
- Pad nhận toàn vùng bo góc, lớn hơn vòng cũ80px; knob40px với biên visual38–42px, giữ deadzone8px và movement normalization. Pointer capture/cancel/reset theo contract cũ, không đổi combat logic.
- Cụm phải 184×184: Chém 68px dưới phải, Bắn 64px phía trên, Lướt 60px ở giữa phía trong (tam giác có khoảng tâm 78–82px để chuyển nhanh); Heavy/Tích lực 52px, Surge 48px tách góc trên. Joystick có pad 132–180px rộng, cao132px ở phone /160px ở tablet/ngang lớn, vòng116–132px; Tích lực dịch sang dưới Lướt để không đè pad ở320px; portrait dành 204px controls, landscape overlay ở góc. Giữ safe-area/dvh, vi/en và pointer capture.
- CombatWorld giữ một slot offensive buffer; tap mới thay slot, simultaneous ưu tiên Heavy. Dash/Surge có buffer ngắn riêng; capture trước hitstop, tuổi buffer chỉ giảm khi simulation chạy. Adapter consume tap mỗi tick để không lặp ở catch-up; keyboard/mouse cũng giữ được tap giữa hai tick.
- Dash clear đòn/buffer cũ, không queue khi hết charge. Tap gần cuối dash nối đòn sau khi kết thúc; held inputs vẫn hoạt động. clearInput nối với pause/draft/results/reset/resize/blur/cancel; resize cũng reset keyboard/mouse.
- Windup light 4/5/6 ticks, tổng đòn giữ nguyên. Aim theo windup và khóa ở contact. Blade/trail bắt đầu sweep trước damage một nửa sweep time, nên contact/hitstop nằm giữa nhát chém; bỏ full-arc flash cũ. Mỗi đòn resolve một lần.
- Miss có whoosh, hit mới có contact sparks và hitstop. Light/Shot mint/ivory, Heavy/Charged amber; Basic Shot hitstop 12ms, Light 33ms, Charged 40ms, Heavy 65ms (ceil fixed tick). Chain/blast giữ hitstop cũ. Perfect Dodge có dấu gãy bốn hướng; SFX phân biệt trúng đạn và chém.
- Charged follow-up: recoil 0.22s với kick rõ hơn, muzzle lance/core và fragments, projectile ivory/amber + tail 60px. Contact bloom 0.24s; Detonate chính 0.36s với core → fractured shockwave → shards theo radius thực. Tag presentation riêng trên Explosion/Impact, không lan tag sang các vụ nổ thứ cấp; budget vẫn 24 và giữ blast chính khi đông. SFX chargedGun/chargedBlast riêng, ưu tiên trong mix giới hạn. Pose/VFX freeze theo simulation, không đổi physics/balance/hitstop.
- Giữ player damage/range/knockback/resources/AI/builds/chain/dependencies; chỉ đổi HP/common wave pacing theo feedback mới. Không thêm engine, feature hoặc QA framework.
- Q1 atlas SVG 8 frames/9 parts và Prism core tint giữ nguyên. Không có Art Bible riêng trong repo; visual dựa Brief và yêu cầu Fractured Vessel của user.

## EVIDENCE
- Joystick aim mới: docs/aim-opening/production-320.png, production-390.png, production-844.png; production renderer khi giữ Bắn và kéo ra ngoài nút.
- Touch fix: docs/touch-fix/320.png, 360.png, 390.png, 844.png, 768.png (dev gesture fixture); production-320/390/844.png từ production input thật. Pad/controls không chồng và target bounds đã kiểm.
- Charged mới: [GIF so sánh](docs/charged/comparison.gif) (nửa đầu Basic, nửa sau Charged), [khai hỏa](docs/charged/charged-fire.png), [nổ](docs/charged/charged-blast.png); baseline cùng fixture ở basic-fire/basic-blast. Renderer thật, phone 390×844, 20fps; fixture 3 Rupture/cấp ammo, không phải natural run.
- Q2: [Light](docs/q2/light.png), [Heavy](docs/q2/heavy.png), [Shot](docs/q2/shot.png), [Charged](docs/q2/charged.png), [Perfect Dodge](docs/q2/perfect.png), [Dash](docs/q2/dash.png). Ảnh actual renderer ở phone 390×844/DPR2, fixture địch/tài nguyên để thấy feedback; không phải full natural run.
- Bố cục: [production dọc](docs/q2/portrait.png), [production ngang](docs/q2/landscape.png). Layout 320/360/390/844/768 đã kiểm và xem ảnh dọc/ngang.
- Q1 cũ: docs/q1/fractured-vessel.png, actions.png, action-preview.gif (zoom2×); docs/mobile/ là bản mobile trước Q2. docs/q1/mobile-* là baseline FAIL trước mở rộng mobile, không phải bản hiện tại.

## KEY DECISIONS
- Mobile-first + desktop, một arena, run 5 phút, 1 sword/gun, 3 mobs/Elite/Boss, 6 Mutation/4 Curse; không permanent stat upgrades, backend/account/multiplayer/leaderboard/monetization.
- Free/open-source, KISS; Phaser 3.90 + TypeScript 5.9 + Vite 7; fixed 60Hz, catch-up tối đa 100ms; logic độc lập renderer. Không dependency mới.
- UI vi/en qua t(key). Codename cursebreak không phải public brand; original Neon Occult / Fractured Geometry, không sao chép asset.
- Quyền tự deploy sau checks PASS đã được user cấp và ghi AGENTS.md. Dùng `.github/workflows/pages.yml`, base `/a-new-game/`, dist qua GitHub Actions; bảo toàn remote, không force, theo dõi run tới kết thúc. Không Sites/hosting khác.
- Remote main được bảo toàn, push không force. Q2 + bố cục tam giác `4f10e2f`; Charged feedback mới `17ec0bc`; commit handoff sau deploy chỉ Markdown, không đổi artifact.

## RELEVANT FILES
- GAME_BRIEF.md: quality bar, scope và contract Q2; AGENTS.md + .agents/skills/handoff/SKILL.md đã đọc.
- src/game/combat.ts: buffer/timing/contact/dash + Charged presentation tags; ArenaScene.ts: input/graphics; PlayerVisual.ts: poses/slash/recoil; chargedVfx.ts: hai helper vẽ projectile/impact, không engine/state riêng; audio.ts: procedural SFX.
- src/ui/TouchControls.ts + src/style.css: touch adapter và bố cục; tests/combat.test.mjs: thêm 11 focused Q2 tests, không tạo framework.
- src/game/builds.ts / run.ts / progression.ts: contracts giữ nguyên; public/assets/fractured-vessel.svg: atlas gốc.
- vite.config.ts + .github/workflows/pages.yml: workflow/base có sẵn, không sửa.

## RUN
npm run dev (5173); npm run build (typecheck + dist); npm run preview (4173); npm test.

## LAST VALIDATION
- Aim/opening deployment: Actions `40095777323`, head `f4c19ed9b9ae70c17744ebf7a54d733cb47644ad`, completed/success; job `120877618562`. Live https://gizgity.github.io/a-new-game/. Handoff commit sau deploy chỉ Markdown.
- Aim/opening production `/a-new-game/` PASS 320×568/390×844/844×390/1440×1000: SVG200, real-time outside-button drag, touch pause/resume/rotation clear ring, desktop mouse/WASD/dash/Esc; không page/request errors. Đã xem ảnh dọc390/ngang844.
- Natural opening CDP: điều khiển scripted orbit + aim mục tiêu gần/bắn, chỉ tăng tốc render clock; không sửa HP/resources/enemies/waves. Tới draft đầu đúng60s,48HP,25kills,319shots,2enemies; chọn draft/resume PASS. Đây là smoke mechanics, không thay human balance/aim acceptance hoặc máy thật/Safari.
- Aim/opening: npm test PASS (3 files,47 test definitions), build/typecheck PASS. Thêm3 regression tests: Grunt không buff hạ bằng2 Light hoặc Light+Shot/Detonate; opening cadence/cap, ramp HP36→51→66 không heal survivor/reset; HP theo loại không phụ thuộc id, Elite/Boss giữ nguyên.
- CDP đa chạm 320×568/390×844/844×390 PASS cả6 nút: drag120px vượt biên, đổi hướng2 lần, player/attack/shot theo aim, movement độc lập; trước drag joystick trái vẫn dẫn aim, nhả riêng/cancel gỡ ring và không kẹt; không selection/zoom/runtime errors. Đây là Chromium emulation, chưa thay máy thật/Safari.
- Touch fix deploy: Actions run `40094746371`, đúng head `b94c45a9de8c3dde972d282413ae81d3432f387f`, completed/success; job `120874535521` npm ci/build/configure/upload/deploy đều PASS. Live: https://gizgity.github.io/a-new-game/. Handoff commit sau deploy chỉ Markdown, không đổi artifact.
- Touch fix build/typecheck PASS. Browser Chromium touch 320×568,360×640,390×844,844×390,768×1024 PASS: pad tối thiểu132×132, không overlap/cắt; tap ngoài vòng40px cũ, kéo vượt pad, move+shoot hai ngón/nhả riêng/cancel; long press700ms,8 rapid taps,pinch giữ visualViewport.scale=1 và selection rỗng. Synthetic Safari gesture/selection/contextmenu events bị preventDefault khi playing; không thay Safari/iOS thật.
- Menu/settings touch scroll PASS cả phone nhỏ/ngang; guard gỡ khi pause/draft, chọn option3 bằng tap được. Rotation/draft/pause trong lúc giữ joystick clear input, resume không bị dính. Không thêm unit tests mô phỏng CSS hoặc framework; combat.ts/builds/run không đổi, không chạy lại gameplay suite không liên quan.
- Touch production `/a-new-game/` PASS ở 320×568,390×844,844×390 và desktop1440×1000: assets HTTP200, move+shoot, melee/dash, pause/resume; không runtime/request errors. Rotation/draft/choice/pause reset khi đang giữ joystick PASS. Đã xem screenshot production320; không overlap hoặc highlight chọn chữ.
- Charged deployment: Actions run `40078759766`, đúng head `17ec0bc`, completed/success; job `120827700850` npm ci/build/configure/upload/deploy đều PASS. Commit handoff sau deploy chỉ Markdown, không thay artifact.
- Charged follow-up: build/typecheck PASS, 44 test definitions PASS (thêm 3 contract tests: không thêm AoE khi không Rupture, damage/radius 105/142 giữ nguyên, chain/VFX bounded và reset/lifetime). Geometry-only tweak cuối đã build lại; không lặp logic tests khi mechanics không đổi.
- Charged CDP touch/keyboard PASS 320×568, 390×844, 844×390, desktop 1440×1000: đúng 1 shot/ammo, chargedGun/chargedBlast cue, radius105, WebAudio running, pause giữ life/pose, resume hết hiệu ứng. Fixture cấp ammo/marked target, không đánh giá âm thanh trên máy thật.
- Production `/a-new-game/` cùng 4 kích thước PASS asset HTTP200, shoot/dash/pause/resume, không page/request errors. Charged fixture chạy dev, production smoke dùng input thật không inject resources. Đã xem fire/blast và render chuỗi 72 frames Basic→Charged thành GIF; không tự kết luận feel accepted.
- GitHub Actions run `40046706621` completed/success cho head `4f10e2fad37d0afb4893ea0a95a4a933f31ec610`: npm ci/build/configure/upload/deploy đều PASS; job `120729989991` success. Các bản Q2/polish trước cũng deploy PASS; bản cuối đã chứa phản hồi chuyển nút của user.
- Focused suite PASS: 41 test definitions trong 3 files, gồm 11 Q2 tests (buffer expiry/once/latest, Heavy/Charged transitions, hitstop/dash/Surge cancel, reset, windup lock và ticks, miss/contact feedback, i-frame tick cuối). Existing combat/run/progression regression PASS.
- Chromium touch/DPR2: 320×568, 360×640, 390×844, 844×390, 768×1024 PASS: tất cả nút ≥44px, không chồng/cắt/overflow, không runtime errors; screenshots dọc/ngang đã xem.
- CDP touch PASS: move + aim/shoot, nhả độc lập/cancel; tap cuối recovery nối đúng một lần, tap sớm hết hạn; Light→Heavy, dash cancel, shoot cuối dash, Charged sau Heavy; dash/Surge qua hitstop và cancel dash. Phase pause/draft/defeat/victory/rotation clear input; vi/en PASS. Fixture tắt waves/cấp resource cho các edge cases này.
- Natural-wave smoke ~20s bằng CDP touch: 90HP, 2 kills, 103 shots, không runtime error; scripted movement/aim, không cấp stats/resources hoặc bất tử. Không coi là human feel/full-run acceptance.
- Desktop smoke PASS mouse tap, WASD + RMB, Shift/Space, Esc pause/resume không dư hành động.
- Build/typecheck bản pose cuối, CSS tap-highlight và bố cục tam giác cuối PASS; production `/a-new-game/` PASS 390×844, 844×390 và desktop 1440×1000: SVG HTTP200 đúng base, move/shoot/dash/pause/resume, không runtime/request/HTTP errors. Bundle warning Phaser >500kB là hiện trạng (~1.27MB JS/gzip352KB), không mở scope bundling.
- Không xác nhận Safari/iOS, cảm nhận âm thanh/performance/tầm với trên máy thật hay full-run. User phản hồi Charged hiện tại chưa đủ lực; bản follow-up chờ chơi lại.

## NEXT ACTION
Dừng chờ user playtest joystick ngắm (giữ/kéo xa ngoài nút) và độ khó trước/sau buff đầu tiên trên điện thoại thật; chỉ sửa theo phản hồi, không tự mở Q3–Q5.

## BLOCKERS
Không blocker đã biết. URL Pages trực tiếp ngoài allowlist; xác minh deployment qua Actions và production local đúng subpath. Q2/bố cục mới vẫn chờ user playtest, Q1 vẫn chờ xác nhận visual; Q3–Q5 chưa giao.
