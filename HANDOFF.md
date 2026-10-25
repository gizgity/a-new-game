# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Tăng từ3 lên6 lượt tiến hóa; draft/Elite/Boss kích hoạt theo kills HOẶC thời gian, điều kiện tới trước. Implementation/tests/build/browser/production PASS, chuẩn bị deploy. AWAITING PLAYTEST APPROVAL. Giữ balance súng/specials và phạm vi nội dung hiện có.

## ACCEPTANCE
- 6 draft: Mutation25kills/0:30, Curse80/1:00, Mutation160/1:40, Mutation220/2:20, Curse300/3:00, Mutation380/3:40. Mỗi mốc chỉ chạy1lần; vượt nhiều mốc xử lý tuần tự, timer pause khi chọn.
- Curse sau cho đổi hoặc giữ, luôn chỉ1Curse active; tối đa4Mutation khác nhau, pool ít hơn3 thì hiện đúng số còn; cạn pool không kẹt màn chọn.
- Elite200kills/2:30; Boss450kills/4:00. Không spawn trùng/Elite muộn sau Boss, giữ Boss1500HP và deadline5:00. Draft đang tới hạn được chọn trước encounter.
- HUD/hướng dẫn vi/en hiển thị cả kills/thời gian; mobile không tràn; tests/build/browser PASS rồi deploy Actions. AWAITING PLAYTEST APPROVAL.

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
- Enemy growth chốt lúc spawn: common HP cơ sở36/28/36→66/48/48 từ60–120s, thêm hệ số HP1→1.6/damage1→1.5/speed1→1.2 từ60–300s; Elite theo growth tại200kills hoặc2:30, Boss giữ preset riêng. Projectiles giữ damage nguồn khi bắn, không scale lại sau đó.
- Packs3/90ticks đầu run, ban đầu6Grunt+1Archer, cap18, Archer cap3; Boss450kills hoặc4:00 dọn common/cap7 và spawn từng quái. Spawn radius360px, spread0.16rad, tránh spawn trên player.
- Perfect check tại vị trí trước dash: melee/volatile/slam sắp trúng trong160ms, hoặc segment đạn đang tới; hurt trong cửa sổ dash vẫn xử lý. Cùng predicate làm telegraph đủ điều kiện lóe vàng; không báo vàng Archer/ring từ xa sai thời điểm. Reward1/dash,3Charge Points/+15Surge; unlock vẫn3né tích lũy.
- Body collision: hai lượt resolve bounded giữa player radius16 và enemy14/22/32, clamp arena; giữ slide, bỏ resolve trong dash. Không engine/physics dependency mới.
- Basic20damage, mỗi hit gain1ChargePoint (Catalyst2); Charged84 tự tăng1Rupture cap3 rồi Detonate×2. Blast nền24/stack1→72/stack3, radius105 hoặc142 với Specialist; chain budget12, VFX24 giữ. Không đòi melee để cấp ammo/trigger các blast synergies.
- RunDirector dùng6mốc OR kills/time trong config; HUD draft kế và Boss hiển thị cả hai điều kiện. Draft ưu tiên trước encounter, vượt nhiều mốc chọn tuần tự; bossDue/eliteSpawned chặn lặp. Elite không spawn muộn sau Boss; nếu đồng thời đủ cả hai thì Boss ưu tiên, giữ Elite đã có.
- Mutation draft chỉ lấy option hợp lệ/chưa sở hữu, tối đa3; pool còn1–2 hiển thị đúng số còn, hết thì bỏ qua không heal. Curse lượt2 luôn có giữ Curse hiện tại; đổi thay toàn bộ hiệu ứng cũ, clamp maxHP sau heal10. Không đổi damage/resources/synergy hiện có.

- Layout: trong184×184, Charged52px tại(56,0), Heavy52px(56,64), Dash60px(52,124), Shoot64px(116,24), Melee68px(116,100), Surge48px(0,0). Pad trái132–180px/cao132–160, portrait reserve204px; safe-area/dvh và native-gesture guard khi playing giữ.
- Q1 atlas Fractured Vessel và Charged VFX giữ; Light ba nhát có pose/trail/SFX riêng từ bản trước. Enemy/floor vẫn prototype art; không tự accepted.

## IMPLEMENTATION AUDIT / LIMITS
- Functional tests chứng minh input/timing/geometry/resources/run, không chứng minh combat feel. Safari/iOS, âm thanh/performance/tầm với máy thật và full-run cần user thử.
- Adaptive vẫn so bộ đếm hành động, fallback ngẫu nhiên có nhãn adaptive/synergy; Catalyst hiện đã có tác dụng cho ranged được ưu tiên. Không tuyên bố đã giải quyết toàn Q5.
- Phantom Edge/Berserker/Detonation Specialist/Volatile Soul/Ghost Step còn thiên về chỉ số. Tên/số lượng và nguồn concept thiếu giữ trong Brief; không tự thêm nội dung mới.
- Chain có damage/lan thật nhưng queue quá budget vẫn bỏ; Q4 depth chưa được review. Không thay giới hạn MVP.

## EVIDENCE
- docs/milestones/: HUD mobile/desktop, Curse đổi/giữ và Mutation cuối; fixture kiểm ngưỡng và pool, không là natural run. HUD320/390/844/1440 và draft-4/draft-5; fixture pool cố định và kills để kiểm ngưỡng, không là natural run.
- docs/specials/: layout-320/360/390/844/768.png; heavy.png, charged.png, perfect-dodge.png; production-320/390/844.png; ranged-run.png.
- Layout/Heavy/Charged/Perfect ảnh từ renderer thật ở phone390×844 (layout có5sizes); fixtures cấp ammo/HP target để kiểm và nhìn VFX, không là natural run. Production ảnh input thật không inject stats. Ranged-run là waves thật, scripted input, không grant tài nguyên.
- Evidence trước giữ: docs/crowd-combo/combo.gif (fixture6quái500HP,30fps), docs/charged/comparison.gif, docs/aim-opening/, docs/touch-fix/, docs/q1/, docs/q2/. Không coi ảnh cũ là bản current.

## KEY DECISIONS
- Mobile-first + desktop,1arena,run5phút,1sword/gun,3mobs/Elite/Boss,6Mutation/4Curse; không permanent stat upgrades/backend/account/multiplayer/leaderboard/monetization.
- User mới nhất mở rộng6draft và milestone theo kills HOẶC thời gian (tới trước áp dụng trước), gồm Elite/Boss; các thay đổi ranged synergy/dodge/body/special charges và enemy growth trước vẫn giữ. Các phần chưa giao của Q3–Q5 vẫn dừng.
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
- npm test PASS:62definitions/3files; thêm6mốc kills/time/both/biên trước ngưỡng, nhiều mốc cùng tick, cạn pool, giữ/đổi Curse, Elite/Boss OR một lần và không Elite muộn. Regression combat/progression cũ PASS.
- Typecheck/build PASS; Phaser bundle warning>500KB là hiện trạng, không mở scope bundling.
- Chromium320×568/390×844/844×390/1440×900 PASS: HUD vi/en cả kills/time không tràn,6draft qua UI, Curse có giữ/đổi, pool1option cuối, Boss sớm, pause/resume; production base/a-new-game/ HUD/load/no overflow/runtime errors PASS. Ảnh HUD320 và Curse đã xem trực quan.
- Natural ranged scripted input, waves thật/no HP-ammo grants:266kills/128.8s,565shots/0melee/71detonations,4draft tại25/80/161/222kills; chết trước draft5. Assertion kỳ vọng full6/Boss của script không đạt do player chết, không phải runtime lỗi; toàn6mốc/Boss chỉ được kiểm bằng core tests+browser fixtures. Không tuyên bố full-run cân bằng hoặc experience accepted.
- Safari/iOS/thiết bị thật, tầm với, combat feel và full-run cần user playtest.
- Bản deploy trước: Actions40122478494, head066e0428c3abc27821acfcb7fe754a4ff6686b7f success. Bản mốc mới chưa deploy.

## NEXT ACTION
Push main/deploy GitHub Actions, theo dõi tới kết thúc, ghi nhận kết quả rồi dừng chờ user playtest nhịp6draft/Boss sớm.
