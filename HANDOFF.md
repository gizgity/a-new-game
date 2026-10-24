# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Bản sửa tổng hợp theo toàn bộ feedback đang active: Charged giữ-ngắm/thả-bắn; Heavy giới hạn lượt, mạnh hơn Light; quái tăng sức mạnh theo thời gian; cột Charged→Heavy→Dash; Perfect Dodge thực dụng hơn; va chạm thân lính; ranged build có nguồn charge/synergy; Mutation/Curse theo kills. Implementation và checks PASS, đã deploy Pages qua GitHub Actions success. **AWAITING PLAYTEST/VISUAL APPROVAL**, không bỏ phần specials/layout khi thêm feedback mới.

## ACCEPTANCE
- Mobile/desktop giữ Charged/Heavy chỉ ngắm; nhả đúng1lần theo hướng nhả, không tự lặp. Pause/blur/cancel/resize/draft xóa giữ và buffer; hết tài nguyên không queue chờ hồi.
- Heavy2lượt/hồi từng lượt8s, damage100/140 khi nối L3, range164/arc280°, windup0.24/tổng0.72s; visual/SFX/impact mạnh hơn Light. Charge trừ khi bắt đầu đòn, dash cancel không hoàn lượt.
- Light giữ18/22/30 damage và cleave100/112/128px,150°/200°/260°, nhịp4/6/10ticks; Light/Basic không xóa telegraph địch. Heavy/Charged/blast ngắt quái thường; Boss không stun-lock.
- Quái mới tăng HP/damage/speed sau60s tới300s; HP Grunt36 phút đầu vẫn hai Light hạ. Packs/cap18, Boss1500HP/cap7; không heal survivor/rút telegraph giữa đòn.
- Cột trong Charged→Heavy→Dash đúng thứ tự, không overlap pad ở320px/dọc/ngang/tablet; HUD và hướng dẫn vi/en có charges/countdown/draft kills.
- Perfect160ms nhận né khỏi đòn sắp trúng và đạn đang tới; không thưởng dash trống/sớm, tối đa1/dash. Walking body collision/slide; dash xuyên để thoát vây, không thêm contact damage/physics engine.
- Basic20 và tự tích charge; Charged84+tự thêm1Rupture/Detonate. Catalyst thêm charge cả Light/Basic; ranged-only dùng được Detonation Specialist/Volatile Soul/Death Echo.
- Draft Mutation/Curse/Mutation ở25/80/160kills, heal10 mỗi chọn; vượt nhiều mốc vẫn chọn tuần tự/không nhân đôi. Boss4:00/deadline5:00 vẫn theo thời gian.
- Tests/build/browser/preview PASS trước deploy bằng Actions có sẵn; user playtest mới quyết định experience acceptance.

## PROGRESS
M0–M6 là functional implementation, không phải chứng nhận chất lượng toàn MVP.

| Checkpoint | Trạng thái | Còn thiếu |
| --- | --- | --- |
| Mobile-first | IN PROGRESS — AWAITING PLAYTEST APPROVAL | Bố cục cột mới và giữ/thả trên máy thật |
| Q1 — Player art/animation/readability | IN PROGRESS — AWAITING VISUAL APPROVAL | User duyệt visual Fractured Vessel |
| Q2 — Combat feel/impact | IN PROGRESS — AWAITING PLAYTEST APPROVAL | Duyệt balance/specials/dodge/body/ranged bản mới |
| Q3 — Enemy identity/precision | NOT VERIFIED | Có scaling/body theo feedback, art/pattern/recovery chưa đạt |
| Q4 — Chain depth | NOT VERIFIED | Charged tự seed Detonate hỗ trợ ranged; depth tổng thể chưa duyệt |
| Q5 — Mutation/Curse synergies | NOT VERIFIED | Catalyst/ranged và kill drafts đã cải thiện theo user; các concept còn lại chưa đối chiếu |

## CURRENT STATUS
- Input: TouchControls chỉ phát Heavy/Charged ở pointerup, snapshot aim theo action; core chỉ nhận một command và buffer120ms, không dựa held repeat. E/Shift desktop arm ở keydown, phát ở keyup; reset/gaming focus cancel arm. Heavy khóa angle khi bắt đầu, Charged giữ angle qua recovery buffer; Light vẫn tracking windup.
- Heavy có2charges, hồi tuần tự8s simulation, pause/draft/hitstop dừng recharge. HUD/nút hiển thị lượng còn và thời gian hồi; L3→Heavy140, thường100, knockback80/stagger0.6, hitstop85ms. Blade/trail amber44px/sweep0.16/fade0.18, impact0.26s và SFX low-body/overtone riêng.
- Light stagger0.08/0.10/0.14s; Light/Basic giữ telegraph/cooldown đang chạy thay vì stunlock. Knockback Light18/24/38 giữ; Heavy/Charged/blast vẫn interrupt. Boss không bị stagger/reset windup.
- Enemy growth chốt lúc spawn: common HP cơ sở36/28/36→66/48/48 từ60–120s, thêm hệ số HP1→1.6/damage1→1.5/speed1→1.2 từ60–300s; Elite theo growth tại2:30, Boss giữ preset riêng. Projectiles giữ damage nguồn khi bắn, không scale lại sau đó.
- Packs3/90ticks đầu run, ban đầu6Grunt+1Archer, cap18, Archer cap3; Boss4:00 dọn common/cap7 và spawn từng quái. Spawn radius360px, spread0.16rad, tránh spawn trên player.
- Perfect check tại vị trí trước dash: melee/volatile/slam sắp trúng trong160ms, hoặc segment đạn đang tới; hurt trong cửa sổ dash vẫn xử lý. Cùng predicate làm telegraph đủ điều kiện lóe vàng; không báo vàng Archer/ring từ xa sai thời điểm. Reward1/dash,3Charge Points/+15Surge; unlock vẫn3né tích lũy.
- Body collision: hai lượt resolve bounded giữa player radius16 và enemy14/22/32, clamp arena; giữ slide, bỏ resolve trong dash. Không engine/physics dependency mới.
- Basic20damage, mỗi hit gain1ChargePoint (Catalyst2); Charged84 tự tăng1Rupture cap3 rồi Detonate×2. Blast nền24/stack1→72/stack3, radius105 hoặc142 với Specialist; chain budget12, VFX24 giữ. Không đòi melee để cấp ammo/trigger các blast synergies.
- RunDirector dùng25/80/160kills cho3draft, HUD nextDraftKills; thời gian vẫn chạy để scaling/Elite/Boss/deadline. Draft pause/heal10/choose-once/reset giữ, vượt nhiều threshold xử lý lần lượt.
- Layout: trong184×184, Charged52px tại(56,0), Heavy52px(56,64), Dash60px(52,124), Shoot64px(116,24), Melee68px(116,100), Surge48px(0,0). Pad trái132–180px/cao132–160, portrait reserve204px; safe-area/dvh và native-gesture guard khi playing giữ.
- Q1 atlas Fractured Vessel và Charged VFX giữ; Light ba nhát có pose/trail/SFX riêng từ bản trước. Enemy/floor vẫn prototype art; không tự accepted.

## IMPLEMENTATION AUDIT / LIMITS
- Functional tests chứng minh input/timing/geometry/resources/run, không chứng minh combat feel. Safari/iOS, âm thanh/performance/tầm với máy thật và full-run cần user thử.
- Adaptive vẫn so bộ đếm hành động, fallback ngẫu nhiên có nhãn adaptive/synergy; Catalyst hiện đã có tác dụng cho ranged được ưu tiên. Không tuyên bố đã giải quyết toàn Q5.
- Phantom Edge/Berserker/Detonation Specialist/Volatile Soul/Ghost Step còn thiên về chỉ số. Tên/số lượng và nguồn concept thiếu giữ trong Brief; không tự thêm nội dung mới.
- Chain có damage/lan thật nhưng queue quá budget vẫn bỏ; Q4 depth chưa được review. Không thay giới hạn MVP.

## EVIDENCE
- docs/specials/: layout-320/360/390/844/768.png; heavy.png, charged.png, perfect-dodge.png; production-320/390/844.png; ranged-run.png.
- Layout/Heavy/Charged/Perfect ảnh từ renderer thật ở phone390×844 (layout có5sizes); fixtures cấp ammo/HP target để kiểm và nhìn VFX, không là natural run. Production ảnh input thật không inject stats. Ranged-run là waves thật, scripted input, không grant tài nguyên.
- Evidence trước giữ: docs/crowd-combo/combo.gif (fixture6quái500HP,30fps), docs/charged/comparison.gif, docs/aim-opening/, docs/touch-fix/, docs/q1/, docs/q2/. Không coi ảnh cũ là bản current.

## KEY DECISIONS
- Mobile-first + desktop,1arena,run5phút,1sword/gun,3mobs/Elite/Boss,6Mutation/4Curse; không permanent stat upgrades/backend/account/multiplayer/leaderboard/monetization.
- User mới nhất đã thay draft theo phút thành theo kills, mở scope ranged synergy/dodge/body/special charges và scaling. Các phần chưa giao của Q3–Q5 vẫn dừng.
- Free/open-source/KISS, Phaser3.90+TS5.9+Vite7, fixed60Hz/catchup100ms; không dependency mới/QA framework/art engine.
- UI vi/en qua t(key). Codename cursebreak không là public brand; Neon Occult/Fractured Geometry original.
- Quyền tự deploy sau checks PASS, không hỏi lại. Dùng .github/workflows/pages.yml, base /a-new-game/, giữ remote/main, push không force, theo dõi Actions tới kết thúc. Deploy không là visual/device approval.

## RELEVANT FILES
- GAME_BRIEF.md, AGENTS.md, .agents/skills/handoff/SKILL.md là source/workflow đã đọc.
- config/balance.ts: HP/growth/combo/Heavy/ranged/kill thresholds; combat.ts: command/resource/physics/dodge/shot/impact; run.ts: waves/scaling/kill drafts.
- TouchControls.ts/ArenaScene.ts: release input/reset/aim snapshot; PlayerVisual.ts/audio.ts: Heavy feedback; main.ts/style.css/i18n.ts: layout/HUD/vi-en.
- tests/combat.test.mjs/run.test.mjs/progression.test.mjs: regression contracts; public/assets/fractured-vessel.svg giữ.
- vite.config.ts/.github/workflows/pages.yml giữ nguyên.

## RUN
npm run dev (5173); npm run build (typecheck+dist); npm run preview (4173); npm test.

## LAST VALIDATION
- Deployment tổng hợp: Actions `40122478494`, head `066e0428c3abc27821acfcb7fe754a4ff6686b7f`, completed/success; job `120956831956` npm ci/build/configure/upload/deploy đều PASS. Live https://gizgity.github.io/a-new-game/. Commit handoff sau deploy chỉ Markdown.
- npm test PASS:58definitions/3files. Bao gồm command-once/aim buffer, empty/cancel/regen/reset Heavy; damage/telegraph/scale thực cả projectile/melee; dodge sớm/trễ/trống/đạn đi xa/né ra ngoài; body walk/slide/dash; ranged-only ammo/Catalyst/blast synergies; kill draft pause/heal/overshoot/choose-once/reset; các regression chain/Boss/progression cũ.
- Build/typecheck PASS sau chỉnh predicate telegraph cuối; bundle warning Phaser>500KB là hiện trạng (~1.28MB/gzip356KB), không mở scope bundling.
- CDP touch320×568/360×640/390×844/844×390/768×1024 PASS: bounds/no overlaps/order column; giữ1s không tiêu, drag ngoài rồi thả đúng1lần/angle snapshot dù ngón trái đổi hướng; independent release/cancel/pause/rotation; desktop E/Shift giữ/thả và Esc cancel PASS. Không selection/zoom/runtime errors.
- Browser gameplay PASS: đi bộ bị chặn/dash xuyên; dash ra xa đòn sắp trúng nhận Perfect không mất HP; kill thứ25 mở draft, hủy Charged đang giữ, chọn/resume không bắn ma; Heavy hit5targets/100HP và consume1; Charged release preview.
- Production /a-new-game/ PASS320/390/844/1440: assets200, Heavy held không tiêu/release tiêu1, pause/resume/vi-en và runtime/request errors sạch. Predicate telegraph cuối chỉ chia sẻ logic đúng với màu cue; build/tests cuối PASS.
- Natural ranged-only: đã tới25/80/160kills bằngCDP, không melee/grantHP/ammo/buff/waves; chọn Catalyst/Curse/Detonation Specialist theo UI. Chỉ tăng tốc render clock. Smoke cuối PASS:160kills ở80.08s,85HP,352shots,0melee,46Detonate; Catalyst/Volatile Soul/Detonation Specialist; draft ở26/80/160kills (mốc đầu vượt bởi cùng tick). Screenshot ranged-run.png đã có. Không suy ra human balance accepted.
- Baseline deploy trước: crowd/combo Actions40097407500 headf2b9a80 success; aim/opening40095777323 headf4c19ed success; touch40094746371 headb94c45a success; Charged40078759766 head17ec0bc success.

## NEXT ACTION
Dừng chờ user playtest toàn bộ bản mới: giữ/thả Charged/Heavy, cột nút, physical body/dodge, ranged synergy, scaling và kill drafts. Chỉ sửa theo phản hồi; không tự mở milestone/content khác.

## BLOCKERS
Không blocker implementation. Pages URL trực tiếp ngoài allowlist; xác minh deployment qua Actions và production local đúng subpath. Chưa kiểm máy thật/Safari hoặc full-run; không tự accepted visual/feel.
