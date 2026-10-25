# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Sửa feedback sau Q5A, trước Q5B: áp lực spawn khi không kill, Archer theo aim lúc windup, Boss nhanh hơn, hiệu ứng thắng rõ và chặn native/held-click trong draft. User xác nhận “q5a ok” trên fa4045d; Q5A ACCEPTED. Những thay đổi Q3/run dưới đây được user yêu cầu trực tiếp, không tự mở rộng Q5B. Implementation/tests/build/browser PASS; chuẩn bị deploy để user kiểm fixes.

## ACCEPTANCE
- Không đứng ở trần18 khi không kill: thêm pack3 mỗi6s không kill khi đã đủ18, không trần dân số cố định trước Boss; kill reset timer, pause/draft/hitstop không tăng pressure. Giữ milestones và Boss cap7; Elite không xóa crowd.
- Archer ray/aim theo player suốt windup (cả stagger), projectile giữ hướng khi đã bắn. Boss windup0.72/0.52, cooldown0.72/0.45, recovery0.4/0.28; giữ damage/pattern/Perfect và không rút windup đang chạy.
- Hạ Boss có vỡ ấn/chime1.1s rồi dialog CHIẾN THẮNG/ĐÃ HẠ BOSS; chết/deadline có THẤT BẠI khác màu. Mutual kill giữ Victory. Không restart bởi cú bấm đang giữ.
- Draft chặn context menu/select/drag/auxclick/gesture, chỉ nhận click primary mới hoặc keyboard; vẫn cuộn mobile và reset combat input như trước.
- Focused regression, build, browser/evidence và deploy; chờ user playtest các fixes. Không mở Q5B trong task này.

## PROGRESS
M0–M6 là functional implementation, không phải chứng nhận chất lượng toàn MVP.

| Checkpoint | Trạng thái | Còn thiếu |
| --- | --- | --- |
| Mobile-first | IN PROGRESS — AWAITING PLAYTEST APPROVAL | Bố cục cột mới và giữ/thả trên máy thật |
| Q1 — Player art/animation/readability | IN PROGRESS — AWAITING VISUAL APPROVAL | User duyệt visual Fractured Vessel |
| Q2 — Combat feel/impact | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “ok q2 ổn đó” trên bản84fb33a |
| Q3 — Enemy identity/precision | ACCEPTED — USER PLAYTEST/VISUAL APPROVAL | User xác nhận “oki q3 r” trên bảnfa55057 |
| Q4 — Chain depth | ACCEPTED — USER PLAYTEST/VISUAL APPROVAL | User xác nhận “thấy ok r” trên bản daee80a; phát sinh sau theo issue mới |
| Q5 Design Contract | APPROVED | User xác nhận “ok làm đi, xong thì deploy để test play luôn” |
| Q5A — Barrier / Juggernaut | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “q5a ok” trên fa4045d |
| Q5B — Rework existing pool | NOT STARTED | Tạm dừng theo user, sửa feedback trước |
| Q5C — New pool tới12/8 | NOT STARTED — AWAITING PLAYTEST APPROVAL | Chỉ mở sau user accepted Q5B |
| Q5D — Weighted Draft | NOT STARTED — AWAITING PLAYTEST APPROVAL | Chỉ mở sau user accepted Q5C |
| Q5E — Diversity/balance | NOT STARTED — AWAITING PLAYTEST APPROVAL | Chỉ mở sau user accepted Q5D |

## CURRENT STATUS
- Contract mới là nguồn thiết kế Q5; docs/q5/AUDIT.md thuộc lượt audit trước, không còn là quyết định/next action hiện hành. User đã duyệt concept/contract; không còn blocker thiết kế.
- Code Q5A có7Mutation/5Curse (chỉ thêm Aegis/Iron Oath), chưa Draft v2; đã deploy fa4045d. Contract đích12/8 giữ4Mutation/run,1Curse active và6draft. Q5A chỉ vertical slice Juggernaut; các nguồn hồi HP mới ở Q5C, Blood Pact rework ở Q5B.
- Defaults contract đã duyệt, còn tuning qua playtest: Barrier30 không decay; heal chung8HP/10s và cooldown riêng; Soul Anchor không cứu hit chí tử; Catalyst seed tối đa2/root không kích trong cùng root; proc có provenance/cap. Giữ Phantom reach/Catalyst charge/Guard Heavy bonus; các gói rework khác thay hiệu ứng cũ như contract, không ngầm cộng dồn.
- Draft Q5D đã duyệt thiết kế, chưa triển khai: weighted theo damage thực/Perfect/phá thế/chain/phòng thủ, lý do có căn cứ; anti-repeat×0.4 cho offered IDs run trước (kể cả bỏ dở), seed draft riêng kèm snapshot debug; nội dung mới eligible mặc định khi triển khai, giữ unlock Guard/Static/Death Echo.
- Q4: relay chờ4ticks simulation (66.7ms), giữ snapshot vị trí/damage/radius trước knockback; chỉ marked neighbours truyền nổ. Giữ phần queue dư qua tick sau thay vì xóa, tối đa12/tick; Detonate và +1charge tính lúc thực thi. Pending-ID chống trùng relay, chainSeen chống lặp trong tick; reset xóa queue. Pause/draft/hitstop dừng simulation. Rupture3ô hình thoi, nối nguồn→đích khi relay nổ; budget24VFX giữ.
- Grunt cue theo feedback: chuẩn bị là quạt rỗng viền đứt hồng; last160ms (tính cả stagger) viền liền3px + chevrons, vàng chỉ khi isImminentEnemyThreat thật. Tick hit lóe trắng/tô quạt2ticks simulation (hitstop có thể kéo dài thời gian thực); sau đó chỉ vệt slash gãy fade, bỏ fill/radial edges trong recovery. Chỉ sửa EnemyVisual.ts, không đổi core timing/damage/Perfect.
- Q3: EnemyVisual.ts tách khỏi Scene, silhouette riêng: Grunt mặt nạ/móc tay, Archer mũ/áo rách/cung, Volatile lõi lò tách5mảnh, Bulwark giáp phiến, Warden vương miện/thân rỗng/3mảnh xích. Windup co/lấy đà, active bật người, recovery mở lõi; không thay collider.
- Ground cue vẽ trước bodies, outer boundary khớp hit geometry + vòng/quạt tiến độ từ windupDuration snapshot; Archer ray theo player lúc windup (feedback mới sau Q5A), Boss ring12rays đúng hướng đạn/slam khóa điểm. Active0.18s(common)/0.22s(Boss) giữ đúng pattern cũ, chỉ feedback, không gây hit lặp.
- Recovery đứng yên nằm trong cooldown hiện có: Grunt0.22s/Archer0.4s/Bulwark0.75s/Boss0.4s hoặc0.28s dưới nửaHP. Boss windup0.72/0.52 và cooldown0.72/0.45 theo feedback sau Q5A; dưới nửaHP không rút telegraph đang chạy. Volatile fuse0.7s giữ.
- Bulwark quét100px (trước70), bắt đầu dưới90px, arc1.7rad; cue/Perfect/hit cùng range. Giáp55% damage ngoài recovery, nhận100% khi mở giáp; Guard Breaker vẫn xuyên giáp. Thay đổi balance thuộc Q3 đã được user duyệt.
- Input: TouchControls chỉ phát Heavy/Charged ở pointerup, snapshot aim theo action; core chỉ nhận một command và buffer120ms, không dựa held repeat. E/Shift desktop arm ở keydown, phát ở keyup; reset/gaming focus cancel arm. Heavy khóa angle khi bắt đầu, Charged giữ angle qua recovery buffer; Light vẫn tracking windup.
- Heavy có2charges, hồi tuần tự8s simulation, pause/draft/hitstop dừng recharge. HUD/nút hiển thị lượng còn và thời gian hồi; L3→Heavy140, thường100, knockback80/stagger0.6, hitstop85ms. Blade/trail amber44px/sweep0.16/fade0.18, impact0.26s và SFX low-body/overtone riêng.
- Light stagger0.08/0.10/0.14s; Light/Basic giữ telegraph/cooldown đang chạy thay vì stunlock. Knockback Light18/24/38 giữ; Heavy/Charged/blast vẫn interrupt. Boss không bị stagger/reset windup.
- Enemy growth chốt lúc spawn: common HP cơ sở36/28/36→66/48/48 từ60–120s, thêm hệ số HP1→1.6/damage1→1.5/speed1→1.2 từ60–300s; Elite theo growth tại200kills hoặc2:30, Boss giữ preset riêng. Projectiles giữ damage nguồn khi bắn, không scale lại sau đó.
- Packs3/90ticks đầu run, ban đầu6Grunt+1Archer, soft cap18 + pack3/6s không kill, Archer cap3; Boss450kills hoặc4:00 dọn common/cap7 và spawn từng quái. Spawn radius360px, spread0.16rad, tránh spawn trên player.
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
- Implementation ngoài slice Q5A vẫn giữ hiệu ứng cũ. Contract Q5 đã đặc tả lại; Q5B–Q5E chưa triển khai hoặc chứng minh experience. Không lấy mô tả contract làm bằng chứng tính năng đang chạy.
- Q4 đã sửa bỏ queue quá budget; user đã chấp nhận chiều sâu/feel trên daee80a. Browser/tests là bằng chứng kỹ thuật riêng; không suy rộng approval thành kiểm mọi thiết bị/Safari hoặc full-run.

## EVIDENCE
- docs/q4/: setup/trigger/relay390 và layout320/844/1440 là fixture core/renderer thật (grant HP/marks), không là natural run. Opening390 dùng input Bắn thật, không grant stats.
- docs/grunt-cue/: prepare/perfect-window/strike/recovery + prepare320/844 và production390. Fixture core tick thật/renderer thật; production input thật. Ảnh đã xem trực quan.
- docs/q3/: identity/common telegraphs, ba pattern Boss windup/active, Bulwark mở giáp, viewports, production. Ảnh pattern là fixture; production opening dùng input thật, không grant stats. README ghi giới hạn.
- docs/milestones/: HUD mobile/desktop, Curse đổi/giữ và Mutation cuối; fixture kiểm ngưỡng và pool, không là natural run. HUD320/390/844/1440 và draft-4/draft-5; fixture pool cố định và kills để kiểm ngưỡng, không là natural run.
- docs/specials/: layout-320/360/390/844/768.png; heavy.png, charged.png, perfect-dodge.png; production-320/390/844.png; ranged-run.png.
- Layout/Heavy/Charged/Perfect ảnh từ renderer thật ở phone390×844 (layout có5sizes); fixtures cấp ammo/HP target để kiểm và nhìn VFX, không là natural run. Production ảnh input thật không inject stats. Ranged-run là waves thật, scripted input, không grant tài nguyên.
- Evidence trước giữ: docs/crowd-combo/combo.gif (fixture6quái500HP,30fps), docs/charged/comparison.gif, docs/aim-opening/, docs/touch-fix/, docs/q1/, docs/q2/. Không coi ảnh cũ là bản current.

## KEY DECISIONS
- User yêu cầu mọi bàn giao playtest phải nói rõ scope, cách thử và kết quả mong đợi; đã lưu quy tắc ở AGENTS.md.
- Mobile-first + desktop,1arena,run5phút,1sword/gun,3mobs/Elite/Boss; scope Q5 mới khóa12Mutation/8Curse (code Q5A7/5); không permanent stat upgrades/backend/account/multiplayer/leaderboard/monetization.
- Quyết định run còn hiệu lực:6draft và milestone theo kills HOẶC thời gian (tới trước áp dụng trước), gồm Elite/Boss; các thay đổi ranged synergy/dodge/body/special charges và enemy growth trước vẫn giữ. Q3/Q4 đã accepted; user đã duyệt contract và yêu cầu triển khai/deploy Q5A ngày2026-10-25. User sẽ tạo issue mới cho phát sinh khi trải nghiệm sau, không giữ Q4 ở trạng thái chờ thử.
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
- Fixes sau Q5A: tests83definitions/6files PASS, typecheck/build PASS; Chromium390/1440: held/right click draft guard, keyboard, Boss kill thật trong fixture → vỡ ấn1.1s → Victory, defeat/reset/frozen result/vi-en PASS. Dist844 input/pause PASS. Stress fixture132Grunt: khoảng0.77ms/core tick trên Chromium máy này, không đại diện FPS mobile. Chưa user acceptance cho các fixes.
- Deploy Q5A PASS: commit fa4045deb8d332fee03cdf01555ced2d4ed29b79, Actions40168884585 completed/success, job121095494287. Main fast-forward từ5caf09d, không force; đã đối chiếu27blob (16text/11PNG) với local. Pages direct smoke bị proxy403; kết quả browser là dist/local, không tự nhận đã kiểm live/Safari.
- Q5A: npm test PASS80definitions/6files (9Q5A), typecheck/build/diff PASS. Chromium320/390/844/1440: fixture Barrier/HP, draft vi/en, Boss HUD không overlap, normal progression, trial không lưu progress, pause/input/dist PASS. docs/q5a/ ghi rõ fixtures và input thật8s. Q5A đã được user duyệt qua “q5a ok”; chưa Safari/iOS/full-run; Phaser>500KB warning cũ.
- User xác nhận Q4 “thấy ok r” trên daee80a, yêu cầu cập nhật handoff; phát sinh sau sẽ tạo issue mới. Lượt này chỉ sửa Markdown, kiểm diff/nhất quán; không chạy lại tests/build/deploy.
- Q4: npm test PASS (71definitions/5files), typecheck/build PASS; Phaser bundle>500KB là warning hiện trạng. Focused tests: bridge/gap/unmarked, overflow30thực thiđủ, snapshot khi target chết, hitstop, reset, stack damage/radius; giữ regression Q2/Q3/run/progression.
- Chromium mobile390: fixture setup→trigger1→relay2 có đường nối, viewport320/390/844/1440 không overflow/runtime errors. Opening390 dùng Bắn thật, pause/resume và vi/en; production dist320/390/844/1440 PASS assets/input/vi-en/no runtime-request errors. Không có thông tin kiểm riêng Safari/iOS hoặc full-run; human acceptance Q4 được ghi nhận ở trên.
- Q3 đã được user duyệt “oki q3 r” trên fa55057; cue Grunt duyệt riêng. Giữ quạt đứt→vàng→flash trắng và không thay core Q3.
- Đã đối chiếu remote main e88a9f5, ghép EnemyVisual/Brief/handoff mới trước Q4; giữ nguyên các ảnh remote docs/grunt-cue. Git CLI hiện lỗi kết nối proxy; deploy bằng GitHub connector từ parent main và expected SHA, không push lịch sử local work.
- Deploy Q4 PASS: Actions40156155683 completed/success, job121057894453; implementation daee80afe9c936b1ef38feb7e945cdbbd11615fc. Build/upload/deploy success; main giữ parent e88a9f5, không force. Live https://gizgity.github.io/a-new-game/. 11ảnh upload đã đối chiếu Git blob SHA với local.

## NEXT ACTION
Hoàn tất validation/browser và deploy các fixes sau Q5A, rồi bàn giao checklist riêng. Không triển khai Q5B trong task sửa feedback này.

## PLAYTEST Q5A — ĐÃ DUYỆT / THAM CHIẾU
Bản Q5A fa4045d đã deploy; dùng link trial https://gizgity.github.io/a-new-game/?playtest=juggernaut; tải lại trang. Trial cấp Guard+Aegis+Oath từ đầu, có nhãn rõ và không lưu kills/unlocks/runs; không là natural acquisition. Run thường không query vẫn pool7/5 và luật unlock/draft cũ, không bảo đảm draft ra cả bộ.
1. Giữ Chém (mobile)/chuột trái vào quái: Barrier cyan tăng theo damage thật, tối đa30; hụt không tăng. Nhận hit thì Barrier giảm trước, phần dư mấtHP; không đứng im bất tử.
2. Đợi Grunt lấy đà rồi ngắm/thả Heavy (Đánh mạnh/Shift) để phá đòn; hoặc Heavy giáp đóng Bulwark tại200kills/2:30. Guard +10 (Oath12.5) một lần/Heavy, Aegis có thể cộng thêm; không thưởng Guard khi hụt/đánh recovery/Boss. Heavy bắt đầu có khiên với Oath +4.
3. Dash (Lướt/Space) thấy hồi3.64s với Oath; draft Curse thứ2 tại300kills/3:00 đổi/giữ. Giữ không nhân thưởng/reset, đổi giữ Barrier đã kiếm nhưng gỡ modifier Oath. Kiểm HUD/vỡ khiên và cảm giác phải đánh trúng/phá thế để tank.
Checklist đầy đủ + evidence/giới hạn: docs/q5a/README.md. Phản hồi tình huống/thao tác, quan sát và thiết bị/browser. User đã duyệt Q5A, không yêu cầu thử lại; Q5B–Q5E chưa mở, Q1–Q4 giữ approval lịch sử.

## PLAYTEST Q4 — ĐÃ DUYỆT / THAM CHIẾU
User đã duyệt Q4 qua “thấy ok r”. Checklist dưới là scope đã bàn giao, không phải yêu cầu thử lại; phát sinh sau user sẽ tạo issue mới.
Bản Q4 daee80a tại https://gizgity.github.io/a-new-game/; tải lại trang. Chỉ thử setup→trigger→lan, không yêu cầu duyệt lại Q3.
1. Trong opening, gom2–3Grunt, giữ Chém (mobile) / chuột trái (desktop) để đánh dấu hình thoi. Bắn vào một con bằng nút Bắn / chuột phải, hoặc giữ-thả Đánh mạnh / Shift. Mong đợi Rupture biến mất khi kích, có vòng nổ rồi đường nối/nổ tiếp qua quái đã đánh dấu nằm gần nhau; quái chưa đánh dấu chỉ nhận AoE, không tự truyền.
2. Thử kéo hai quái đã đánh dấu ra xa rồi bắn một con: mong đợi con ngoài vòng nổ giữ dấu, không có đường nối vượt khoảng trống. Đặt nhiều dấu cho nổ mạnh hơn; quái opening có thể chết trước3stacks, dùng quái sau60s hoặc Bulwark nếu muốn so3stacks.
3. Giữ Bắn tích đạn rồi giữ-thả Tích lực / E vào quái chưa chém: mong đợi vẫn tự seed và nổ; thêm marked neighbours để so hiệu quả dọn đám. Kiểm cảm giác relay có đủ rõ mà không chậm/ngợp hoặc che telegraph.
Khi tạo issue mới, ghi tình huống/cách setup, điều quan sát được và thiết bị/browser nếu liên quan. Q4 không còn chờ playtest/visual approval.

## BLOCKERS
Không blocker implementation. Cần deploy fixes và user thử nhịp Boss/áp lực crowd; Q5B chưa mở. Git local base5caf09d, snapshot Q5A vẫn working tree; remote main ee25e6e đã được đối chiếu, cập nhật qua connector với expected SHA không force. HTTP Pages trực tiếp từng bị proxy403, chỉ xác nhận deploy qua Actions và browser dist local.
