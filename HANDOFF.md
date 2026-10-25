# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Feedback Q3: quạt Grunt khó phân biệt chuẩn bị/gây damage, khó canh Perfect Dodge. Đã tách visual thành viền đứt chuẩn bị → viền liền/chevrons sát đòn (vàng khi predicate Perfect thật) → strike flash đúng tick hit, bỏ vùng quạt trong recovery. Giữ windup0.42s, window160ms, damage/range/AI/input hiện có; không mở Q4/Q5. Acceptance lượt sửa: ba nhịp đọc khác nhau trên mobile, cue vàng khớp logic; tests/build/browser/evidence trước deploy, user duyệt feel sau.

## ACCEPTANCE
- Năm enemy có silhouette/lớp giáp/lõi/chuyển động riêng, đọc được ở mobile; không dùng hình debug đơn làm thân.
- Telegraph có tiến trình theo thời gian windup thực, khóa hướng/điểm và khớp damage; active feedback không gây hit lặp.
- Common giữ nhịp nhanh, Elite/Boss có recovery đứng yên đủ phản công; Bulwark mở giáp khi recovery. Boss giữ ba pattern, phase nhanh hơn dưới nửa HP, không stun-lock.
- Không đổi số lượng nội dung, controls, charge, chain budget, growth/drafts/deadline; toàn bộ text mới (nếu có) qua vi/en.
- Focused tests, build/typecheck, browser gameplay và ảnh evidence trước deploy Actions. Visual/feel vẫn AWAITING PLAYTEST/VISUAL APPROVAL tới khi user xác nhận.

## PROGRESS
M0–M6 là functional implementation, không phải chứng nhận chất lượng toàn MVP.

| Checkpoint | Trạng thái | Còn thiếu |
| --- | --- | --- |
| Mobile-first | IN PROGRESS — AWAITING PLAYTEST APPROVAL | Bố cục cột mới và giữ/thả trên máy thật |
| Q1 — Player art/animation/readability | IN PROGRESS — AWAITING VISUAL APPROVAL | User duyệt visual Fractured Vessel |
| Q2 — Combat feel/impact | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “ok q2 ổn đó” trên bản84fb33a |
| Q3 — Enemy identity/precision | IN PROGRESS — AWAITING PLAYTEST/VISUAL APPROVAL | Implementation/checks xong; user duyệt art và precision feel |
| Q4 — Chain depth | NOT VERIFIED | Charged tự seed Detonate hỗ trợ ranged; depth tổng thể chưa duyệt |
| Q5 — Mutation/Curse synergies | NOT VERIFIED | Catalyst/ranged và kill drafts đã cải thiện theo user; các concept còn lại chưa đối chiếu |

## CURRENT STATUS
- Grunt cue theo feedback: chuẩn bị là quạt rỗng viền đứt hồng; last160ms (tính cả stagger) viền liền3px + chevrons, vàng chỉ khi isImminentEnemyThreat thật. Tick hit lóe trắng/tô quạt2frames; sau đó chỉ vệt slash gãy fade, bỏ fill/radial edges trong recovery. Chỉ sửa EnemyVisual.ts, không đổi core timing/damage/Perfect.
- Q3: EnemyVisual.ts tách khỏi Scene, silhouette riêng: Grunt mặt nạ/móc tay, Archer mũ/áo rách/cung, Volatile lõi lò tách5mảnh, Bulwark giáp phiến, Warden vương miện/thân rỗng/3mảnh xích. Windup co/lấy đà, active bật người, recovery mở lõi; không thay collider.
- Ground cue vẽ trước bodies, outer boundary khớp hit geometry + vòng/quạt tiến độ từ windupDuration snapshot; Archer ray khóa hướng, Boss ring12rays đúng hướng đạn/slam khóa điểm. Active0.18s(common)/0.22s(Boss) giữ đúng pattern cũ, chỉ feedback, không gây hit lặp.
- Recovery đứng yên nằm trong cooldown hiện có: Grunt0.22s/Archer0.4s/Bulwark0.75s/Boss0.7s hoặc0.5s dưới nửaHP. Boss windup0.95/0.75 và cooldown1.15/0.8 giữ; dưới nửaHP không rút telegraph đang chạy. Volatile fuse0.7s giữ.
- Bulwark quét100px (trước70), bắt đầu dưới90px, arc1.7rad; cue/Perfect/hit cùng range. Giáp55% damage ngoài recovery, nhận100% khi mở giáp; Guard Breaker vẫn xuyên giáp. Đây là thay đổi balance Q3 cần user thử.
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
- Q1 atlas Fractured Vessel và Charged VFX giữ; Light ba nhát có pose/trail/SFX riêng từ bản trước. Enemy đã có layered Fractured Geometry ở Q3; floor vẫn prototype art; không tự accepted.

## IMPLEMENTATION AUDIT / LIMITS
- Functional tests chứng minh input/timing/geometry/resources/run, không chứng minh combat feel. Safari/iOS, âm thanh/performance/tầm với máy thật và full-run cần user thử.
- Adaptive vẫn so bộ đếm hành động, fallback ngẫu nhiên có nhãn adaptive/synergy; Catalyst hiện đã có tác dụng cho ranged được ưu tiên. Không tuyên bố đã giải quyết toàn Q5.
- Phantom Edge/Berserker/Detonation Specialist/Volatile Soul/Ghost Step còn thiên về chỉ số. Tên/số lượng và nguồn concept thiếu giữ trong Brief; không tự thêm nội dung mới.
- Chain có damage/lan thật nhưng queue quá budget vẫn bỏ; Q4 depth chưa được review. Không thay giới hạn MVP.

## EVIDENCE
- docs/grunt-cue/: prepare/perfect-window/strike/recovery + prepare320/844 và production390. Fixture core tick thật/renderer thật; production input thật. Ảnh đã xem trực quan.
- docs/q3/: identity/common telegraphs, ba pattern Boss windup/active, Bulwark mở giáp, viewports, production. Ảnh pattern là fixture; production opening dùng input thật, không grant stats. README ghi giới hạn.
- docs/milestones/: HUD mobile/desktop, Curse đổi/giữ và Mutation cuối; fixture kiểm ngưỡng và pool, không là natural run. HUD320/390/844/1440 và draft-4/draft-5; fixture pool cố định và kills để kiểm ngưỡng, không là natural run.
- docs/specials/: layout-320/360/390/844/768.png; heavy.png, charged.png, perfect-dodge.png; production-320/390/844.png; ranged-run.png.
- Layout/Heavy/Charged/Perfect ảnh từ renderer thật ở phone390×844 (layout có5sizes); fixtures cấp ammo/HP target để kiểm và nhìn VFX, không là natural run. Production ảnh input thật không inject stats. Ranged-run là waves thật, scripted input, không grant tài nguyên.
- Evidence trước giữ: docs/crowd-combo/combo.gif (fixture6quái500HP,30fps), docs/charged/comparison.gif, docs/aim-opening/, docs/touch-fix/, docs/q1/, docs/q2/. Không coi ảnh cũ là bản current.

## KEY DECISIONS
- User yêu cầu mọi bàn giao playtest phải nói rõ scope, cách thử và kết quả mong đợi; đã lưu quy tắc ở AGENTS.md.
- Mobile-first + desktop,1arena,run5phút,1sword/gun,3mobs/Elite/Boss,6Mutation/4Curse; không permanent stat upgrades/backend/account/multiplayer/leaderboard/monetization.
- User mới nhất mở rộng6draft và milestone theo kills HOẶC thời gian (tới trước áp dụng trước), gồm Elite/Boss; các thay đổi ranged synergy/dodge/body/special charges và enemy growth trước vẫn giữ. Q3 được user giao tiếp; Q4/Q5 vẫn dừng.
- Free/open-source/KISS, Phaser3.90+TS5.9+Vite7, fixed60Hz/catchup100ms; không dependency mới/QA framework/art engine.
- UI vi/en qua t(key). Codename cursebreak không là public brand; Neon Occult/Fractured Geometry original.
- Quyền tự deploy sau checks PASS, không hỏi lại. Dùng .github/workflows/pages.yml, base /a-new-game/, giữ remote/main, push không force, theo dõi Actions tới kết thúc. Deploy không là visual/device approval.

## RELEVANT FILES
- GAME_BRIEF.md, AGENTS.md, .agents/skills/handoff/SKILL.md là source/workflow đã đọc.
- config/balance.ts: HP/growth/combo/Heavy/ranged/kill thresholds; combat.ts: command/resource/physics/dodge/shot/impact; run.ts: waves/scaling/kill drafts.
- TouchControls.ts/ArenaScene.ts: release input/reset/aim snapshot; PlayerVisual.ts/audio.ts: Heavy feedback; main.ts/style.css/i18n.ts: layout/HUD/vi-en.
- EnemyVisual.ts/config/balance.ts/combat.ts: art/cues/recovery/armor Q3; tests/enemies.test.mjs: khóa hướng, recovery, mở giáp, phase/fuse.
- tests/combat.test.mjs/run.test.mjs/progression.test.mjs: regression contracts; public/assets/fractured-vessel.svg giữ.
- vite.config.ts/.github/workflows/pages.yml giữ nguyên.

## RUN
npm run dev (5173); npm run build (typecheck+dist); npm run preview (4173); npm test.

## LAST VALIDATION
- Grunt cue: 66tests PASS, typecheck/build PASS. Chromium320/390/844 PASS: dashed trước cửa sổ/no damage, solid gold chỉ khi đủ threat160ms, strike flash trùng damage12, recovery không fill; dash sớm0Perfect/dash vàng1Perfect/ngoài threat không vàng. Production320/390/844/1440 PASS assets/input/pause/vi-en/no overflow/runtime errors. Bằng chứng kỹ thuật, chưa là user duyệt readability.
- Bản sửa Grunt chưa deploy; đang đưa lên main/Actions sau checks PASS.
- Q3: npm test PASS (66definitions/4files; thêm4focused definitions), typecheck/build PASS; bundle Phaser>500KB vẫn là warning hiện trạng.
- Chromium mobile390: gallery,3Boss patterns/active/locked target, né slam không mất HP, Boss đứng yên qua recovery, Bulwark mở giáp PASS. Viewports320/390/844/768/1440 không overflow/runtime errors. Đây là fixtures, không phải human playtest/full-run.
- Production smoke /a-new-game/ PASS320/390/844/1440: assets/base, giữ Bắn opening, pause/resume, vi/en, no overflow/runtime/request errors. Deployment Q3: Actions40149381888 completed/success, heada3e93379d25b3f7a49f8b2389ff5ba517a2302ac. Live https://gizgity.github.io/a-new-game/.
- Baseline giữ remote4d98a2e (Q2 user approval), implementation84fb33a/Actions40147434160 success. Sáu draft/encounters và vi/en mới đã ghép trước tests; không quay về bản3draft.
- Git CLI không có credential hợp lệ; deploy bằng GitHub connector với parent4d98a2e/tree mới và expected SHA, không force. Remote diff chỉ Q3+evidence; mọi blob đã đối chiếu hash với local. Branch local work là snapshot từb55e354, đã ghép source/text remote mới; lịch sử local chưa fetch3commit trướcQ3 và ảnh docs/milestones chỉ có remote. Không push branch work lên main; lần làm tiếp cần đọc remote handoff mới nhất/đồng bộ lịch sử khi CLI auth có lại.

## NEXT ACTION
Deploy cue Grunt qua Actions; sau đó dừng chờ user thử scope Grunt ở opening: lại gần dụ quạt, đợi viền đứt chuyển liền/vàng rồi Lướt (Space desktop). Mong đợi dễ phân biệt chuẩn bị/hit và canh Perfect hơn; trắng là đòn đã ra, recovery không còn vùng quạt.

## PLAYTEST Q3 — SCOPE / CÁCH THỬ
Lượt sửa mới chỉ cần thử Grunt ở opening: không tấn công để tránh stagger/ngắt đòn, lại gần dụ quạt, quan sát viền đứt hồng → liền/vàng → trắng. Nhấn Lướt/Space khi chuyển vàng, trước lóe trắng; mong đợi thông báo Perfect Dodge và không mất HP. Thử một lần lướt sớm ở viền đứt để đối chiếu (không thưởng Perfect). Ra ngoài quạt thì không có vàng từ Grunt đó. Cho biết có đọc được nhịp mà không đoán không; chưa yêu cầu thử lại Elite/Boss trong lượt này. Hướng dẫn toànQ3 bên dưới được giữ làm tham chiếu.
Bản live https://gizgity.github.io/a-new-game/ (implementation a3e9337). Chơi trên thiết bị thường dùng; mobile dùng joystick/nút Lướt/Đánh mạnh, desktop WASD/Space và giữ-thả Shift. Mục tiêu lượt này là art/readability, đọc hướng/vùng đòn và né→phản công; Q2 đã accepted, Q4/Q5 chưa giao.
1. Trong waves, nhìn Grunt (mặt nạ/móc tay), Archer (mũ/cung), Volatile (lõi cam). Thử nhận ra từng loại khi đang di chuyển và có nhiều quái; mong đợi phân biệt được bằng hình/chuyển động, player và dấu báo đòn không bị lẫn.
2. Đến gần Grunt rồi lướt ngang ra khỏi quạt khi nó lấy đà; với Archer đi ngang đường ngắm, với Volatile rời vòng nổ trước khi vòng đầy. Mong đợi hướng/vị trí báo giữ cố định, đòn xảy ra theo vùng/đường đã báo, có đủ dấu hiệu để phản ứng; đạn Archer vẫn phải né khi bay tới.
3. Bulwark xuất hiện200kills hoặc2:30 (cái nào trước). Lại gần để dụ quét, lướt ra ngoài quạt rồi quay vào đánh lúc giáp tách/lõi sáng. Mong đợi có khoảng đứng yên để phản công; cùng loại đòn gây damage rõ hơn lúc mở giáp (tránh Guard Breaker khi so giáp).
4. Boss xuất hiện450kills hoặc4:00. Quan sát một vòng quét→vòng đạn→slam: né khỏi quạt, luồn khe đạn, rời vòng slam đã khóa rồi quay lại đánh khi Boss hồi. Mong đợi phân biệt3dấu báo và có khoảng phản công; dưới nửaHP nhịp nhanh hơn nhưng vẫn đọc được. Nếu chưa tới encounter, ghi rõ đã thử tới đâu, không coi là đã duyệt toànQ3.
Phản hồi cần: phần/quái nào khó đọc hoặc khó né, thao tác đã làm và thực tế xảy ra; kèm thiết bị/browser khi liên quan. Các tests/browser fixtures đã PASS, còn cảm giác/readability trên máy thật và full-run chưa được user xác nhận.

## BLOCKERS
Không blocker implementation/deploy. Chưa user duyệt Q3 hoặc kiểm máy thật/Safari/full-run; không tự accepted. Hạn chế đồng bộ lịch sử local nêu ở validation; connector vẫn truy cập remote được.
