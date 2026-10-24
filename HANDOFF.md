# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Theo playtest mới: user chấp nhận hai Light hạ lính đầu run, nhưng mật độ quái quá thấp, AoE chưa thỏa mãn và L1/L2/L3 khó phân biệt. Đã tăng Grunt theo cụm nhỏ, giữ HP; mở rộng vùng quét thực và phân biệt pose/trail/nhịp/SFX ba Light. Checks PASS, đã deploy Pages; AWAITING PLAYTEST/VISUAL APPROVAL. Không triển khai enemy art/pattern Q3, chain depth Q4 hoặc builds Q5.

## ACCEPTANCE — CROWD & COMBO
- Giữ Grunt36HP đầu run (L1+L2 hạ), tăng số lính và spawn theo cụm để có mục tiêu cleave; bounded18 trước Boss/7 lúc Boss, không tăng spam ranged.
- L1/L2/L3 có hướng quét, silhouette/pose, độ rộng, nhịp và feedback khác rõ trên mobile. VFX theo vùng trúng thực, mỗi mục tiêu chỉ trúng một lần/đòn; L3 quét nhiều mục tiêu, vẫn có vùng mù phía sau. Heavy/Detonate vẫn riêng.
- Regression damage/buffer/dash/draft/Boss/chain PASS, build/typecheck PASS; preview combo và crowd ở mobile, natural combat smoke, desktop check. Chờ user playtest/visual approval sau deploy, không tự accepted.

## ACCEPTANCE — AIM & OPENING BALANCE
- Kéo giữ nút phải cập nhật reticle/hướng ngắm; Heavy/Charged hoạt động như Chém/Bắn. Joystick trái vẫn hướng player khi ngón phải chưa kéo; sau drag aim, hai ngón độc lập. Capture ngoài nút, nhả/cancel/pause/resize không dính input; desktop giữ nguyên.
- Grunt trước buff đầu hạ sau hai Light trúng liên tiếp không buff; một Light + Basic Shot/Detonate vẫn hữu ích. HP opening giữ như trước; mật độ đã tăng theo feedback crowd mới, HP tăng dần về chuẩn tới2:00; không tăng damage toàn game hoặc nerf Elite/Boss.
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
- Giữ player damage/resources/chain/build/run milestones; range/timing/HP/common waves chỉnh theo feedback mới trong Brief. Không triển khai Q3–Q5.
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
| combat.ts — Q2 | Windup L1/L2/L3 4/6/10 ticks, Heavy0.24s; total0.24/0.30/0.44/0.58s, cleave150°/200°/260°. Buffer 120ms, windup tracking rồi khóa aim, dash cancel | Tests/browser chứng minh mechanics; nhịp và cảm giác mới cần user chơi |
| dash/feedback — Q2 | Dash 2 charges/0.18s/920px/s, Perfect 0.08s; sửa i-frame tick cuối. Contact sparks/SFX/hitstop theo nguồn | Không thay speed/recharge/damage; feel trên touch thật chưa accepted |
| enemies — Q3 | Grunt/Archer/Volatile/Bulwark/Boss có windup/cooldown; Boss ba pattern và cap 7 | Primitives, recovery poses thiếu; Elite gần Grunt, precision contrast chưa verified |
| chain — Q4 | Rupture/Detonate gây và lan damage thật; budget 12/tick; Volatile/Death Echo nối queue | Depth chưa verified; queue vượt budget bị bỏ; không chỉnh ở Q2 |
| builds.ts — Q5 | Adaptive so bộ đếm shots/melee/dashes; synergy theo vài điều kiện; fallback ngẫu nhiên | Khác rate hành động, chưa xét hiệu quả; fallback vẫn nhãn adaptive/synergy |
| Mutation/Curse | Có 6/4 effects và trade-offs/tests | Nhiều stat-only; lịch sử M0/M1 chưa ghi concept effects gốc; không tự sáng tác concept thiếu |

## CURRENT STATUS
- Aim follow-up: mỗi nút phải hiện joystick116px khi giữ, knob40px dịch tối đa38px; kéo tính từ điểm chạm đầu, deadzone8px. Tất cả6 action đều cập nhật aim, capture vượt nút; chỉ contact đã drag khóa aim khỏi joystick trái. Nhả/reset gỡ ring; dash không đổi quỹ đạo giữa đợt, Surge radial. Menu vi/en có hướng dẫn drag.
- Balance follow-up: config/balance.ts giữ HP chuẩn theo loại (sửa lỗi HP phụ thuộc spawn id), opening Grunt36/Archer28/Volatile36; 7 quái ban đầu (6Grunt/1Archer), pack3/90ticks, cap18; cùng hướng spawn±0.16rad để tụ cụm. Archer cap3, special cuối mỗi pack thứ4/6, Boss bổ sung1/cap7. Ramp HP mới/interval tới chuẩn ở120s, không heal survivor. Player damage/resources, draft1/2/3 phút, Elite/Boss/chain/build giữ nguyên.
- Touch follow-up: `TouchControls` bật class touch-playing trên arena khi coarse pointer + phase playing. CSS touch-action:none, user-select:none, -webkit-user-select:none/-webkit-touch-callout:none phủ canvas/HUD/gaps/controls. Non-passive touchstart/move/end + gesturestart/change/end/selectstart/contextmenu/dragstart/dblclick guard chỉ active arena, không stopPropagation. Gỡ khi menu/paused/draft/results; không thêm maximum-scale/user-scalable=no.
- Pad nhận toàn vùng bo góc, lớn hơn vòng cũ80px; knob40px với biên visual38–42px, giữ deadzone8px và movement normalization. Pointer capture/cancel/reset theo contract cũ, không đổi combat logic.
- Cụm phải 184×184: Chém 68px dưới phải, Bắn 64px phía trên, Lướt 60px ở giữa phía trong (tam giác có khoảng tâm 78–82px để chuyển nhanh); Heavy/Tích lực 52px, Surge 48px tách góc trên. Joystick có pad 132–180px rộng, cao132px ở phone /160px ở tablet/ngang lớn, vòng116–132px; Tích lực dịch sang dưới Lướt để không đè pad ở320px; portrait dành 204px controls, landscape overlay ở góc. Giữ safe-area/dvh, vi/en và pointer capture.
- CombatWorld giữ một slot offensive buffer; tap mới thay slot, simultaneous ưu tiên Heavy. Dash/Surge có buffer ngắn riêng; capture trước hitstop, tuổi buffer chỉ giảm khi simulation chạy. Adapter consume tap mỗi tick để không lặp ở catch-up; keyboard/mouse cũng giữ được tap giữa hai tick.
- Dash clear đòn/buffer cũ, không queue khi hết charge. Tap gần cuối dash nối đòn sau khi kết thúc; held inputs vẫn hoạt động. clearInput nối với pause/draft/results/reset/resize/blur/cancel; resize cũng reset keyboard/mouse.
- Windup light4/6/10ticks, tổng0.24/0.30/0.44s. Range100/112/128, arc150°/200°/260°, knockback18/24/38; damage18/22/30 giữ nguyên. Heavy range128/arc210°; damage/timing giữ nguyên. Aim theo windup và khóa ở contact. Blade/trail bắt đầu sweep trước damage một nửa sweep time, nên contact/hitstop nằm giữa nhát chém; bỏ full-arc flash cũ. Mỗi đòn resolve một lần.
- Miss có whoosh, hit mới có contact sparks và hitstop. Light/Shot mint/ivory, Heavy/Charged amber; Basic Shot hitstop 12ms, Light33/45/65ms, Charged40ms, Heavy 65ms (ceil fixed tick). Chain/blast giữ hitstop cũ. Perfect Dodge có dấu gãy bốn hướng; SFX phân biệt trúng đạn và chém.
- Charged follow-up: recoil 0.22s với kick rõ hơn, muzzle lance/core và fragments, projectile ivory/amber + tail 60px. Contact bloom 0.24s; Detonate chính 0.36s với core → fractured shockwave → shards theo radius thực. Tag presentation riêng trên Explosion/Impact, không lan tag sang các vụ nổ thứ cấp; budget vẫn 24 và giữ blast chính khi đông. SFX chargedGun/chargedBlast riêng, ưu tiên trong mix giới hạn. Pose/VFX freeze theo simulation, không đổi physics/balance/hitstop.
- Giữ player damage/resources/AI/builds/chain/dependencies; HP/common wave pacing, Light range/knockback/timing/feedback và Heavy envelope chỉnh theo feedback. Không thêm engine, feature hoặc QA framework.
- Q1 atlas SVG 8 frames/9 parts và Prism core tint giữ nguyên. Không có Art Bible riêng trong repo; visual dựa Brief và yêu cầu Fractured Vessel của user.

## EVIDENCE
- Crowd/combo mới: [GIF L1→L2→L3](docs/crowd-combo/combo.gif), l1/l2/l3.png và production-320/390/844.png trong docs/crowd-combo/. GIF renderer thật30fps ở phone390×844, crop arena không zoom; fixture6quái500HP để nhìn cả3 đòn, không phải natural run.
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
- src/game/config/balance.ts: HP/combo/waves; run.ts: grouped spawn; builds.ts/progression.ts giữ nguyên; public/assets/fractured-vessel.svg: atlas gốc.
- vite.config.ts + .github/workflows/pages.yml: workflow/base có sẵn, không sửa.

## RUN
npm run dev (5173); npm run build (typecheck + dist); npm run preview (4173); npm test.

## LAST VALIDATION
- Crowd/combo deployment: Actions `40097407500`, head `f2b9a80d39103f2c94a6f41f1919a215e8f0278f`, completed/success; job `120882436263`. Live https://gizgity.github.io/a-new-game/. Commit handoff sau deploy chỉ Markdown.
- Crowd/combo: npm test PASS (3files,49test definitions), typecheck/build PASS. Test mới kiểm cleave2/4/6 mục tiêu theo góc, ngoài tầm/phía sau không trúng, mỗi mục tiêu chỉ nhận1hit/Rupture/charge/đòn; Light+Light hạ3 lính36HP cùng lúc; cue/impact/hitstop tăng dần. Cập nhật windup4/6/10 và pack/cap/HP-ramp tests; buffer/dash/Heavy/draft/Boss/chain/progression regression PASS.
- CDP giữ Chém nối1→2→3, nhiều contact thật, pause/resume không dính buffer; đã xem ảnh3đòn và ghi GIF renderer. Preview là fixture6quái500HP, freeze AI ban đầu để thấy animation; hitstagger thật tiếp tục sau trúng.
- Natural crowd CDP (không cấp stats/buff/bất tử hoặc chỉnh waves): scripted di chuyển tiếp cận/vòng quanh + giữ Chém/Bắn, aim mục tiêu gần; tăng tốc render clock. Tới draft60s:100HP,124kills,292shots,3enemies, peak8; chọn draft/resume PASS. Không dùng kết quả robot để accepted độ khó/feel trên người chơi.
- Production `/a-new-game/` PASS 320×568,390×844,844×390 và1440×1000: asset200, input cảm ứng/drag ngoài nút, pause/resume/rotation, desktop WASD/mouse/dash/Esc; không page/request errors. Safari/iOS và âm thanh/feel trên máy thật chưa xác nhận.
- Baseline input trước task: CDP cả6nút, multi-touch độc lập, nhả/cancel, menu/settings scroll, long press/rapid taps/pinch không selection/zoom PASS. TouchControls/CSS không đổi lần này.
- Deployment trước: aim/opening Actions40095777323 headf4c19ed success; touch fix40094746371 headb94c45a success; Charged40078759766 head17ec0bc success; Q2 40046706621 head4f10e2f success. Evidence cũ giữ trong docs/.
- Bundle warning Phaser>500KB là hiện trạng (~1.27MB JS/gzip354KB), không mở scope bundling. Visual/feel cần user duyệt; test/build không chứng nhận experience acceptance.

## NEXT ACTION
Dừng chờ user chơi lại density/AoE và L1→L2→L3 trên điện thoại, xem docs/crowd-combo/combo.gif; chỉ sửa theo phản hồi, không tự chuyển Q3–Q5.

## BLOCKERS
Không blocker đã biết. URL Pages trực tiếp ngoài allowlist; xác minh deployment qua Actions và production local đúng subpath. Q2/bố cục mới vẫn chờ user playtest, Q1 vẫn chờ xác nhận visual; Q3–Q5 chưa giao.
