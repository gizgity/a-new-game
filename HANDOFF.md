# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Cân bằng tank theo feedback mới: “vừa giáp vừa máu, đứng tank không di chuyển; chống chịu phải giảm damage”. User yêu cầu điều chỉnh trade-off nên supersede bonus cũ của3lựa chọn phòng thủ. Aegis×0.8, Oath×0.75, Blood Pact×0.8 damage gây ra; cost nhân nhau và áp dụng một lần cho toàn bộ damage player. Aegis rate4/s (Oath5), Blood Pact không hồi khi có Barrier. Tests/build/browser/deploy PASS trên d42cdaf; **AWAITING PLAYTEST APPROVAL** cho tank trade-off. Q5A approval lịch sử giữ; Q5B/tuning mới chờ user thử, Q5C/D chưa mở.

## ACCEPTANCE
- Mọi damage player chịu cost build, gồm flat/proc/chain/Surge; enemy/environment giữ. Build không phòng thủ giữ damage baseline. HUD/card vi/en hiển thị cost.
- Blood Pact mất buff melee+30%, đổi sang damage×0.8; heal2HP/2s cap6HP/10s chỉ khi Barrier=0, kể cả hit tạo Barrier không đồng thời heal. Không tiêu budget nếu heal bị chặn.
- Aegis actual damage sau cost/giáp, rate4/s hoặc5vớiOath, không bank dư; cap30/Guard vẫn giữ. Tank sống lâu hơn baseline trong fixture nhưng không sustain đứng yên vô hạn. Vẫn có AoE/cleave/setup→trigger; không đổi quái/controls.
- Tests/build/browser/deploy và user thử lại tank/Juggernaut/Frenzy; dừng AWAITING PLAYTEST APPROVAL, không mở Q5C/D.

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
| Q5B — Rework existing pool | IN PROGRESS — AWAITING PLAYTEST APPROVAL | Deploy b06bf69 PASS; chờ user thử5Mutation/4Curse |
| Q5C — New pool tới12/8 | NOT STARTED — AWAITING PLAYTEST APPROVAL | Chỉ mở sau user accepted Q5B |
| Q5D — Weighted Draft | NOT STARTED — AWAITING PLAYTEST APPROVAL | Chỉ mở sau user accepted Q5C |
| Q5E — Diversity/balance | NOT STARTED — AWAITING PLAYTEST APPROVAL | Chỉ mở sau user accepted Q5D |

## CURRENT STATUS
- Tank trade-off mới: Aegis−20%, Oath−25%, Blood Pact−20% damage gây ra; Aegis+Oath còn60%, Aegis+Blood còn64% trước Frenzy/Guard bonuses. Blood không heal khiBarrier>0; Aegis rate4/Oath5. Preset ?playtest=tank cấp Guard+Aegis+Berserker+Blood, không lưu progress.
- Sustain tuning: Blood Pact2HP/2s, cap riêng6HP/10s trong budget chung8; counter bloodHealed dùng cùng healWindow, giữ qua đổi Curse, reset khi hết window hoặc run mới. Frenzy modifier vẫn giữ; các cost damage phòng thủ mới áp dụng theo feedback tank ở trên.
- Q5B rework xong5Mutation/4Curse theo contract. BuildEffects.ts giữ clocks/Phantom/hazard/heal budget; combat giữ root object qua shot/Heavy/Detonate/relay/echo, cap2seed/6echo/root. BuildVisual.ts vẽ cue bounded; HUD vi/en cho Phantom/Static/Frenzy/heal/cost/Ghost risk. config/playtests.ts có4preset Q5B +Juggernaut, không lưu progress.
- Difficulty v2: pressure4s ưu tiên2Archer tới8; Grunt jump0.68s/radius48 lead160/max3/concurrent, damage6/cooldown7s/first delay4–6.6s/start gap1.6s hoặc0.7s khi18Grunt, Heavy/blast interrupt/AoE vẫn trúng. Boss far-sweep→slam leap560, chase300, ring12+fan3 speed430, windup0.62/0.46 cooldown0.55/0.38 recovery0.32/0.24. Xem docs/pressure-v2/README.md.
- Contract mới là nguồn thiết kế Q5; docs/q5/AUDIT.md thuộc lượt audit trước, không còn là quyết định/next action hiện hành. User đã duyệt concept/contract; không còn blocker thiết kế.
- Code Q5A có7Mutation/5Curse (chỉ thêm Aegis/Iron Oath), chưa Draft v2; đã deploy fa4045d. Contract đích12/8 giữ4Mutation/run,1Curse active và6draft. Q5A chỉ vertical slice Juggernaut; Blood Pact sustain đã ở Q5B; các nguồn heal mới khác chỉ ở Q5C.
- Defaults contract đã duyệt, còn tuning qua playtest: Barrier30 không decay; heal chung8HP/10s và cooldown riêng; Soul Anchor không cứu hit chí tử; Catalyst seed tối đa2/root không kích trong cùng root; proc có provenance/cap. Giữ Phantom reach/Catalyst charge/Guard Heavy bonus; các gói rework khác thay hiệu ứng cũ như contract, không ngầm cộng dồn.
- Draft Q5D đã duyệt thiết kế, chưa triển khai: weighted theo damage thực/Perfect/phá thế/chain/phòng thủ, lý do có căn cứ; anti-repeat×0.4 cho offered IDs run trước (kể cả bỏ dở), seed draft riêng kèm snapshot debug; nội dung mới eligible mặc định khi triển khai, giữ unlock Guard/Static/Death Echo.
- Q4: relay chờ4ticks simulation (66.7ms), giữ snapshot vị trí/damage/radius trước knockback; chỉ marked neighbours truyền nổ. Giữ phần queue dư qua tick sau thay vì xóa, tối đa12/tick; Detonate và +1charge tính lúc thực thi. Pending-ID chống trùng relay, chainSeen chống lặp trong tick; reset xóa queue. Pause/draft/hitstop dừng simulation. Rupture3ô hình thoi, nối nguồn→đích khi relay nổ; budget24VFX giữ.
- Grunt cue theo feedback: chuẩn bị là quạt rỗng viền đứt hồng; last160ms (tính cả stagger) viền liền3px + chevrons, vàng chỉ khi isImminentEnemyThreat thật. Tick hit lóe trắng/tô quạt2ticks simulation (hitstop có thể kéo dài thời gian thực); sau đó chỉ vệt slash gãy fade, bỏ fill/radial edges trong recovery. Chỉ sửa EnemyVisual.ts, không đổi core timing/damage/Perfect.
- Q3: EnemyVisual.ts tách khỏi Scene, silhouette riêng: Grunt mặt nạ/móc tay, Archer mũ/áo rách/cung, Volatile lõi lò tách5mảnh, Bulwark giáp phiến, Warden vương miện/thân rỗng/3mảnh xích. Windup co/lấy đà, active bật người, recovery mở lõi; không thay collider.
- Ground cue vẽ trước bodies, outer boundary khớp hit geometry + vòng/quạt tiến độ từ windupDuration snapshot; Archer ray theo player lúc windup (feedback mới sau Q5A), Boss ring12rays đúng hướng đạn/slam khóa điểm. Active0.18s(common)/0.22s(Boss) giữ đúng pattern cũ, chỉ feedback, không gây hit lặp.
- Recovery đứng yên nằm trong cooldown hiện có: Grunt0.22s/Archer0.4s/Bulwark0.75s/Boss0.32s hoặc0.24s dưới nửaHP. Boss windup0.62/0.46 và cooldown0.55/0.38 theo feedback sau Q5A; dưới nửaHP không rút telegraph đang chạy. Volatile fuse0.7s giữ.
- Bulwark quét100px (trước70), bắt đầu dưới90px, arc1.7rad; cue/Perfect/hit cùng range. Giáp55% damage ngoài recovery, nhận100% khi mở giáp; Guard Breaker vẫn xuyên giáp. Thay đổi balance thuộc Q3 đã được user duyệt.
- Input: TouchControls chỉ phát Heavy/Charged ở pointerup, snapshot aim theo action; core chỉ nhận một command và buffer120ms, không dựa held repeat. E/Shift desktop arm ở keydown, phát ở keyup; reset/gaming focus cancel arm. Heavy khóa angle khi bắt đầu, Charged giữ angle qua recovery buffer; Light vẫn tracking windup.
- Heavy có2charges, hồi tuần tự8s simulation, pause/draft/hitstop dừng recharge. HUD/nút hiển thị lượng còn và thời gian hồi; L3→Heavy140, thường100, knockback80/stagger0.6, hitstop85ms. Blade/trail amber44px/sweep0.16/fade0.18, impact0.26s và SFX low-body/overtone riêng.
- Light stagger0.08/0.10/0.14s; Light/Basic giữ telegraph/cooldown đang chạy thay vì stunlock. Knockback Light18/24/38 giữ; Heavy/Charged/blast vẫn interrupt. Boss không bị stagger/reset windup.
- Enemy growth chốt lúc spawn: common HP cơ sở36/28/36→66/48/48 từ60–120s, thêm hệ số HP1→1.6/damage1→1.5/speed1→1.2 từ60–300s; Elite theo growth tại200kills hoặc2:30, Boss giữ preset riêng. Projectiles giữ damage nguồn khi bắn, không scale lại sau đó.
- Packs3/90ticks đầu run, ban đầu6Grunt+1Archer, soft cap18 + pack3/4s không kill, pressure Archer tới8; Boss450kills hoặc4:00 dọn common/cap7 và spawn từng quái. Spawn radius360px, spread0.16rad, tránh spawn trên player.
- Perfect check tại vị trí trước dash: melee/volatile/slam sắp trúng trong160ms, hoặc segment đạn đang tới; hurt trong cửa sổ dash vẫn xử lý. Cùng predicate làm telegraph đủ điều kiện lóe vàng; không báo vàng Archer/ring từ xa sai thời điểm. Reward1/dash,3Charge Points/+15Surge; unlock vẫn3né tích lũy.
- Body collision: hai lượt resolve bounded giữa player radius16 và enemy14/22/32, clamp arena; giữ slide, bỏ resolve trong dash. Không engine/physics dependency mới.
- Basic20damage, mỗi hit gain1ChargePoint (Catalyst2); Charged84 tự tăng1Rupture cap3 rồi Detonate×2. Blast nền24/stack1→72/stack3, radius105, chỉ blast Charged gốc142 với Specialist; chain budget12, VFX24 giữ. Không đòi melee để cấp ammo/trigger các blast synergies.
- RunDirector dùng6mốc OR kills/time trong config; HUD draft kế và Boss hiển thị cả hai điều kiện. Draft ưu tiên trước encounter, vượt nhiều mốc chọn tuần tự; bossDue/eliteSpawned chặn lặp. Elite không spawn muộn sau Boss; nếu đồng thời đủ cả hai thì Boss ưu tiên, giữ Elite đã có.
- Mutation draft chỉ lấy option hợp lệ/chưa sở hữu, tối đa3; pool còn1–2 hiển thị đúng số còn, hết thì bỏ qua không heal. Curse lượt2 luôn có giữ Curse hiện tại; đổi thay toàn bộ hiệu ứng cũ, clamp maxHP sau heal10. Milestones/pool/unlocks giữ; effect dùng Q5B đã rework, Draft v2 chưa triển khai.

- Layout: trong184×184, Charged52px tại(56,0), Heavy52px(56,64), Dash60px(52,124), Shoot64px(116,24), Melee68px(116,100), Surge48px(0,0). Pad trái132–180px/cao132–160, portrait reserve204px; safe-area/dvh và native-gesture guard khi playing giữ.
- Q1 atlas Fractured Vessel và Charged VFX giữ; Light ba nhát có pose/trail/SFX riêng từ bản trước. Enemy đã có layered Fractured Geometry ở Q3; floor vẫn prototype art; không tự accepted.

## IMPLEMENTATION AUDIT / LIMITS
- Functional tests chứng minh input/timing/geometry/resources/run, không chứng minh combat feel. Safari/iOS, âm thanh/performance/tầm với máy thật và full-run cần user thử.
- Adaptive vẫn so bộ đếm hành động, fallback ngẫu nhiên có nhãn adaptive/synergy; Catalyst hiện đã có tác dụng cho ranged được ưu tiên. Không tuyên bố đã giải quyết toàn Q5.
- Q5B đã triển khai, chưa chứng minh experience; Q5C–Q5E chưa triển khai. Không lấy fixture/tests làm user acceptance. Không lấy mô tả contract làm bằng chứng tính năng đang chạy.
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
- Tank trade-off deploy PASS:d42cdaf4b69a2253307c5a194a2b58f022ad3f94, Actions40209412564 completed/success. Parent e1b5a02, update main expected SHA/không force;14blobs(13text/1PNG) đối chiếu local. Chưa user balance acceptance; browser local/dist, không tự nhận smoke live/Safari.
- Tank trade-off:110definitions/8files PASS (5focused mới); typecheck/build/diff PASS. Chromium320/390/844/1440 kiểm36%/40% damage cost, Barrier chặn heal/Curse swap/vi-en/trial no-progress/no-overflow/runtime error PASS. Dist390 đứng giữ Chém12s input thật:24HP tại~12s; docs/tank-balance/ ghi fixture/limits. Chưa user approval/device/full-run.
- Sustain nerf deploy PASS:f6dd69431cfeee4427bdb8748592a39d8e1bdea1, Actions40207444949 completed/success, job121211304888. Parent396ed42, update main expected SHA/không force;7blobs đối chiếu local. Browser local/dist; chưa user acceptance/device/full-run.
- Sustain nerf:105definitions/7files PASS (2test mới kiểm1/24target, cooldown2s, cap6HP/10s, hết cửa sổ/đổi Curse/reset). Typecheck/build/diff PASS. Chromium dist390 input Chém8s/pause/vi-en/trial không lưu progress/no-overflow/runtime error PASS. Chưa user acceptance/thiết bị thật/full-run.
- Q5B deploy PASS:b06bf69f82c3384145556cfed0d453d2ff7be844, Actions40193133738 completed/success, job121168217793. Parent51e3acd, update main expected SHA/không force;20blobs(16text/4PNG) đối chiếu local. Browser local/dist, không tự nhận đã smoke live; chưa user acceptance/Safari/full-run.
- Q5B:103definitions/7files PASS (13focused Q5B), typecheck/build/diff PASS. Chromium390 counter/chain/frenzy/echo fixtures: HUD/Perfect/hazard/Frenzy/haste/vi-en/Curse swap và trial không lưu progress PASS. Dist320/844/1440/input/pause/no-overflow/runtime error PASS. docs/q5b/ ghi rõ fixtures; chưa Safari/device/full-run hoặc user acceptance.
- Grunt tuning deploy PASS:6b7d7ad910b58d7bc2f524e4373dfab1fe9970cf, Actions40175067250 completed/success, job121113849271. Parent efa67d1, update main không force/expected SHA;5text blobs đối chiếu local. Chưa user acceptance/Safari/full-run; browser evidence local/dist, live deploy xác nhận bởi Actions.
- Grunt tuning:90definitions/6files PASS, build/typecheck/diff PASS. Chromium390 fixture kiểm first delay≥4s/không nhảy trước3s, damage6/cooldown>6s sau đáp; dist1440 input thật bắn+WASD14.4s ngoài đời: khoảng11s simulation/58HP, không grant stats; pause/no overflow/runtime errors PASS. Không phải natural/full-run balance acceptance hoặc thiết bị thật.
- Difficulty v2 deploy PASS: e4f0ab1b962a4e99f5172d4229ad59ee70c9e4aa, Actions40171971219 completed/success, job121104520190. Parent bccbd0f giữ nguyên, update main không force/expected SHA;11blob(9text/2PNG) đối chiếu local. Chưa user acceptance; browser dist/local, không tự nhận smoke live/Safari.
- Difficulty v2:88definitions/6files PASS, typecheck/build/diff PASS; Chromium390/844 cue/flight/Boss15shots/AoE8kills và dist1440 input thật PASS. docs/pressure-v2/ ghi fixtures/limits; user chưa duyệt difficulty.
- Fix deploy PASS: f89bfa721d38adb227c92207ef1c79c37d7a5ec6, Actions40170626907 completed/success, job121100546426 build/upload/Deploy success. Parent ee25e6e giữ nguyên, update main không force/expected SHA;20blobs(16text/4PNG) đối chiếu local. Browser là dist/local; Pages trực tiếp bị proxy chặn ở lượt trước, không tự nhận đã smoke live.
- Fixes sau Q5A: tests83definitions/6files PASS, typecheck/build PASS; Chromium390/1440: held/right click draft guard, keyboard, Boss kill thật trong fixture → vỡ ấn1.1s → Victory, defeat/reset/frozen result/vi-en PASS. Dist844 input/pause PASS. Stress fixture132Grunt: khoảng0.77ms/core tick trên Chromium máy này, không đại diện FPS mobile. Chưa user acceptance cho các fixes.
- Deploy Q5A PASS: commit fa4045deb8d332fee03cdf01555ced2d4ed29b79, Actions40168884585 completed/success, job121095494287. Main fast-forward từ5caf09d, không force; đã đối chiếu27blob (16text/11PNG) với local. Pages direct smoke bị proxy403; kết quả browser là dist/local, không tự nhận đã kiểm live/Safari.
- Q5A: npm test PASS80definitions/6files (9Q5A), typecheck/build/diff PASS. Chromium320/390/844/1440: fixture Barrier/HP, draft vi/en, Boss HUD không overlap, normal progression, trial không lưu progress, pause/input/dist PASS. docs/q5a/ ghi rõ fixtures và input thật8s. Q5A đã được user duyệt qua “q5a ok”; chưa Safari/iOS/full-run; Phaser>500KB warning cũ.
- Q4: npm test PASS (71definitions/5files), typecheck/build PASS; Phaser bundle>500KB là warning hiện trạng. Focused tests: bridge/gap/unmarked, overflow30thực thiđủ, snapshot khi target chết, hitstop, reset, stack damage/radius; giữ regression Q2/Q3/run/progression.
- Chromium mobile390: fixture setup→trigger1→relay2 có đường nối, viewport320/390/844/1440 không overflow/runtime errors. Opening390 dùng Bắn thật, pause/resume và vi/en; production dist320/390/844/1440 PASS assets/input/vi-en/no runtime-request errors. Không có thông tin kiểm riêng Safari/iOS hoặc full-run; human acceptance Q4 được ghi nhận ở trên.
- Q3 đã được user duyệt “oki q3 r” trên fa55057; cue Grunt duyệt riêng. Giữ quạt đứt→vàng→flash trắng và không thay core Q3.
- Deploy Q4 PASS: Actions40156155683 completed/success, job121057894453; implementation daee80afe9c936b1ef38feb7e945cdbbd11615fc. Build/upload/deploy success; main giữ parent e88a9f5, không force. Live https://gizgity.github.io/a-new-game/. 11ảnh upload đã đối chiếu Git blob SHA với local.

## NEXT ACTION
Chờ user thử tank trade-off trên d42cdaf bằng các link tank/Juggernaut/Frenzy; chỉ sửa feedback balance, không mở Q5C/D.

## PLAYTEST TANK TRADE-OFF — AWAITING PLAYTEST APPROVAL
Bản d42cdaf đã deploy, tải lại ?playtest=tank (Guard+Aegis+Berserker+Blood), juggernaut hoặc frenzy tại https://gizgity.github.io/a-new-game/. Trial không lưu progress. Giữ Chém/chuột trái vào cụm20–40s: thấy HUD damage−36% (tank) hoặc−40% (Juggernaut), có Barrier không đồng thời hồiHP; kill chậm hơn build công. Thử đứng yên rồi dùng joystick/WASD, Lướt/Space, Heavy/Shift giữ-thả để so: khiên giúp chịu đòn nhưng vẫn cần di chuyển/phá thế. Frenzy4s chỉ khiL1–L3 trúng, Blood vẫn miss Heavy cost4. Báo build, bước, cảm giác damage/chống chịu/AoE và thiết bị/browser. Fixture kỹ thuật không là balance acceptance.

## THAM CHIẾU SUSTAIN f6dd694
Lượt giảm Blood2HP/2s cap6 đã deploy; feedback mới supersede damage bonus và cho heal chỉ khi Barrier0. Không yêu cầu thử lại bản cũ.

## PLAYTEST Q5B — AWAITING PLAYTEST APPROVAL
Bản b06bf69 đã deploy; tải lại link thử có build sẵn: ?playtest=counter (Phantom+Static+Ghost), chain (Catalyst+Specialist+Volatile), frenzy (Berserker+Blood Pact), echo (Catalyst+Death Echo). Có nhãn rõ, không lưu progress; không là natural acquisition. Base https://gizgity.github.io/a-new-game/. Checklist thao tác/mong đợi/giới hạn ở docs/q5b/README.md. Run thường giữ milestones/pool7/5/unlock, chưa Draft v2. Chỉ Q5B cần user duyệt; Q5A và difficulty giữ trạng thái cũ.

## THAM CHIẾU DIFFICULTY / GRUNT / FIXES
Giữ tuning Grunt6b7d7ad, difficulty e4f0ab1 và fixes f89bfa7 theo yêu cầu trước; không tự accepted experience. Các checklist/evidence ở docs/pressure-v2/, docs/post-q5a/. Lượt này chỉ yêu cầu thử tank trade-off.

## PLAYTEST Q5A — ĐÃ DUYỆT / THAM CHIẾU
Bản Q5A fa4045d đã deploy; dùng link trial https://gizgity.github.io/a-new-game/?playtest=juggernaut; tải lại trang. Trial cấp Guard+Aegis+Oath từ đầu, có nhãn rõ và không lưu kills/unlocks/runs; không là natural acquisition. Run thường không query vẫn pool7/5 và luật unlock/draft cũ, không bảo đảm draft ra cả bộ.
1. Giữ Chém (mobile)/chuột trái vào quái: Barrier cyan tăng theo damage thật, tối đa30; hụt không tăng. Nhận hit thì Barrier giảm trước, phần dư mấtHP; không đứng im bất tử.
2. Đợi Grunt lấy đà rồi ngắm/thả Heavy (Đánh mạnh/Shift) để phá đòn; hoặc Heavy giáp đóng Bulwark tại200kills/2:30. Guard +10 (Oath12.5) một lần/Heavy, Aegis có thể cộng thêm; không thưởng Guard khi hụt/đánh recovery/Boss. Heavy bắt đầu có khiên với Oath +4.
3. Dash (Lướt/Space) thấy hồi3.64s với Oath; draft Curse thứ2 tại300kills/3:00 đổi/giữ. Giữ không nhân thưởng/reset, đổi giữ Barrier đã kiếm nhưng gỡ modifier Oath. Kiểm HUD/vỡ khiên và cảm giác phải đánh trúng/phá thế để tank.
Checklist đầy đủ + evidence/giới hạn: docs/q5a/README.md. Phản hồi tình huống/thao tác, quan sát và thiết bị/browser. User đã duyệt Q5A, không yêu cầu thử lại; Q5B đang chờ playtest; Q5C–Q5E chưa mở, Q1–Q4 giữ approval lịch sử.

## PLAYTEST Q4 — ĐÃ DUYỆT / THAM CHIẾU
Q4 được user chấp nhận qua “thấy ok r” trên daee80a; phát sinh theo issue mới, không yêu cầu thử lại. Evidence/checklist lịch sử ở docs/q4/ và brief; các thay đổi Q5B trên root/seed là interaction user đã duyệt thiết kế, không thay baseline chain khi không có Mutation/Curse.

## BLOCKERS
Không blocker deploy Q5B; còn user playtest approval. Remote main51e3acd đã đối chiếu đầu task; update qua connector expected SHA không force vì git local còn snapshot từ base5caf09d. Pages direct smoke từng bị proxy chặn; chỉ xác nhận Actions và browser dist/local. Q5C/D/E chưa mở.
