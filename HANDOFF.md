# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Q7A — Arena Art & Visual Contrast (task user2026-10-26): audit → illustration/design contract → visual gate. **CONCEPT APPROVED**: user “approved, làm tiếp đi” ngày2026-10-26 cho “Ấn phong bị vỡ / The Broken Seal V2”; đã triển khai/checks/push/deploy; **AWAITING USER PLAYTEST APPROVAL**, chưa runtime accepted. Q2–Q5 và draft đầu4hướng7843b98 giữ accepted; Q6 stacking đã accepted theo main bc07fd4; Q1 chưa visual approved.

## ACCEPTANCE
Concept V2 đã user duyệt; runtime asset/rendering, checks và deploy hoàn tất. Cần user chấp nhận readability/depth/performance thực tế theo GAME_BRIEF Q7A; chưa tự quality accepted. Scope/cách thử ở docs/q7a/IMPLEMENTATION.md, không yêu cầu thử lại Q2–Q6, không mở Q7B.

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
| Q5B — Rework existing pool | ACCEPTED — USER PLAYTEST APPROVAL (task Q6 xác nhận tổng thể) | Tank/sustain trên d42cdaf đã được duyệt; các vòng counter/chain/echo chưa có xác nhận riêng |
| Tank trade-off | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “oki, ổn r á” trên d42cdaf |
| Q5C — New pool tới12/8 | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “oki r, làm tiếp đi” trên b5ba138 |
| Q5D — Weighted Draft | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “oki r, làm tiếp đi” trên514063a |
| Q5E — Diversity/balance | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “playtest oki” trên8b1571d ngày2026-10-26 |
| Draft đầu4hướng | ACCEPTED — USER PLAYTEST APPROVAL | User “approve” trên7843b98 ngày2026-10-26 |
| Q6 — Curse Stacking | ACCEPTED — USER PLAYTEST APPROVAL | User “aprroved q6 lun nha” ngày2026-10-26 trên7843b98, stacking b534315; remote bc07fd4 |
| Q7A — Arena art/contrast | AWAITING USER PLAYTEST APPROVAL | Concept V2 approved; code0e0a9af/Pages40266665479 SUCCESS, cần user quality/device approval |

## CURRENT STATUS — Q7A IMPLEMENTATION
- Concept V2 user duyệt “approved, làm tiếp đi” ngày2026-10-26. Đã fetch/merge main bc07fd4, bảo toàn Q6 acceptance và opening4hướng, Q2–Q6 giữ accepted; Q1 riêng chưa duyệt.
- ImageGen cleanup concept V2 bỏ footer thành source PNG mới; Pillow chỉ resize/compress1600×1000 WebP88,174334bytes. Một Phaser Image depth0, tint#7a8791 sau xem renderer thấy cạnh sàn còn sáng; không animation/shader/new dependency. ArenaScene chỉ thay preload/drawArena; mọi gameplay/camera/controls/collider/sprites/VFX giữ nguyên.
- Source/review PNG và prompt giữ docs/q7a/artwork; runtime asset public/assets/arena/broken-seal-v2.webp; provenance/hash/rights/processing ở docs/q7a/runtime-asset.json. Không third-party artwork hoặc service lúc chạy.
- Build/typecheck PASS, npm test12files PASS; browser fixture+production320/390/844/1440 PASS vi/en/pause-resume/no overflow/no runtime/request errors. Synthetic dispatch lần đầu lỗi pointer capture do harness, đã sửa sang CDP touch thật và rerun PASS; không sửa controls.
- Renderer thật: before/after identity/crowd390/1440 cùng fixture,33enemy+actual Charged blast; Boss3pattern, Grunt4phase, grayscale cùngcanvas, edge3motif, production input. Xem docs/q7a/IMPLEMENTATION.md và evidence/*.json. Fixtures không natural runs; device/Safari/full-run/user quality còn cần thử.
- Một texture decode6.4MB (ước lượng RGBA),1quad thay static Graphics; A/B ABBA cùng page median390 giữ16.7ms;1440 old83.3→new33.4ms. Không suy ra device FPS hoặc simulation performance từ frozen headless software WebGL. Không thêm QA framework.
- Code0e0a9af2b8cd5fc201690b50ae0a420995dcdd82 đã push main fast-forward, Pages40266665479/job121390460491 completed/success gồm Deploy. Bản đồng bộ board/handoff2e48166 cũng deploy40266875087 completed/success, runtime code giống0e0a9af. URL https://gizgity.github.io/a-new-game/ ; live smoke vẫn proxy403, không giả ảnh local là live. Dừng AWAITING USER PLAYTEST APPROVAL, không Q7B.

## CURRENT STATUS — DRAFT ĐẦU4HƯỚNG
- config/draft.ts định nghĩa4đại diện; Draft.ts chỉ dùng opening ở milestone đầu từ run.ts. builds.ts có direction metadata; main/i18n/style ghi4hướng vi/en, desktop2×2/mobile cuộn. playtests.ts giữ nguyên4card đầu; route sustain chọn Reclaimer trước Catalyst. Không đổi effect/balance/progression hoặc các lượt weighted sau.
- npm test PASS12files/151definitions (2focused mới kiểm4hướng/eligibility/history/chọn từngcard/heal1lần/reset/time/later drafts); typecheck/build/diff PASS. Tests run/routes cập nhật kỳ vọng đầu4/sau3.
- Chromium local Vite320/390/844/1440 PASS:4card, nhãn vi/en, cuộn/chọncard4 nhận đúng1Mutation, Curse và Mutation kế tiếp3card, không overflow/pageerrors. Fixtures cấp kills để mở milestone, không natural run/user acceptance. Ảnh opening-320/1440 đã xem, lưu docs/q6. Chưa Safari/device thật; live vẫn bị proxy403 từ lượt trước.

## Q6 — VALIDATION LỊCH SỬ / HIỆN ĐÃ ACCEPTED
- Audit main eb49190 thay checkout Q5C cũ; Q6 chưa có spec/trùng số, contract mới đặt GAME_BRIEF. Không đổi AGENTS vì đủ quy tắc; repo không có README root. Q5 docs thêm chú thích superseded, giữ nguyên evidence/commit/approval lịch sử.
- combat.ts: danh sách readonly2slot, hasCurse/setCurses/addCurse, dọn riêng Curse bị gỡ. BuildEffects bỏ clear-all; clocks/budget giữ qua thêm/gỡ. Draft.ts/builds.ts/run.ts:2Curse trong context, Keep/add/explicit replaceSlot, cap4Mutation. BarrierVisual/BuildVisual/main/style/i18n/playtests đồng bộ HUD/cards/fixtures vi/en.
- Tests fixtures Q5 chuyển sang API setCurses (fixture thay build rõ ràng); test mới curse-stacking.test.mjs gồm12scenario/slot orders. npm test PASS12files (149definitions tổng), typecheck/build/diff PASS. balance.ts/progression.ts/input/timing/boss/chain core không tune.
- A/B PASS automated: milestone thật,3 rồi Keep+2, unique/cap, giữ effect/cooldown/timer. C/D/E PASS automated cả2thứ tự slot: Oath+Blood, Volatile+Echo, Glass+Ghost; thêm Hunted+Parasitic/hasteOR/replace cleanup. F PASS core/save cũ/untrusted/meta/settings/reset/cap/Adaptive context; browser HUD/draft/add/vi-en/no-overflow/runtime PASS Chromium320/390/844/1440.
- Browser fixtures cấp build/kills để mở draft, không natural run; chưa user playtest/mobile thật/Safari/full-run browser hoặc đo SFX/performance máy thật. Cần cảm nhận survivability/risk/readability khi2Curse và chain đông; không coi Actions success là gameplay acceptance. Chi tiết docs/q6/README.md.

## Q5 CONTEXT — LỊCH SỬ / GIỮ NGUYÊN
- Q5E thêm4route ?playtest=route-tank/route-sustain/route-counter/route-ranged: bắt đầu0build, chỉ đưa card gợi ý tại draft thật, pooltrial đầy đủ, slotcap Q5 lịch sử4/1Curse (Q6 hiện4/2), có giữ Curse, không grant HP/ammo/kills. Không lưu totals/unlocks/history; settings vẫn lưu. Không sửa tuning hoặc core combat/run/draft.
- Core script seed123456789 cả4route qua6draft và tớiElite/Boss/Victory; input có đọc vị trí/Perfect predicate nên không là human acceptance/natural acquisition. Sustain không mấtHP/heal0, cần user thử khi bị thương. Số liệu/giới hạn và checklist ở docs/q5e/README.md.
- Q5D implementation: DraftSignals actual outcomes/cửa sổ giữa draft, Draft.ts xorshift32 riêng+sampling weighted/canonical/no replacement, config/draft.ts metadata/groups/weights. Adaptive/Synergy/Wildcard có reason khi đủ evidence; Curse2 bảo đảm giữ. Không đổi gameplay tuning.
- Profile v1 bổ sung drafts.previous/current/active whitelist20IDs; ghi IDs khi thực sự hiện, rotate khi start kể reload/bỏ dở. Storage blocked giữ trong memory. Trial không ghi history. Query draftSeed/draftDebug opt-in; window.cursebreakDraft là snapshot copy. Chưa lưu/khôi phục run đang chơi.
- Q5C thêm Blood Reclaimer/Iron Reversal/Soul Anchor/Echo Chamber/Kinetic Battery và Glass Soul/Parasitic Mark/Hunted Vessel; pool12/8, mặc định eligible10/7 giữ unlock cũ. Trial sustain/anchor/chamber/glass/hunted cấp build, không lưu progress. HUD/VFX riêng cho heal/slow/pin/Anchor/Reversal/Glass/Hunted.
- Đã ghép remote c128133 (tank d42cdaf + approval), giữ Aegis×0.8/Oath×0.75/Blood×0.8 và Blood6HP/10s, Barrier chặn Blood heal. Không dùng snapshot local396ed42 để ghi đè remote.
- Tank trade-off mới: Aegis−20%, Oath−25%, Blood Pact−20% damage gây ra; Aegis+Oath còn60%, Aegis+Blood còn64% trước Frenzy/Guard bonuses. Blood không heal khiBarrier>0; Aegis rate4/Oath5. Preset ?playtest=tank cấp Guard+Aegis+Berserker+Blood, không lưu progress.
- Sustain tuning: Blood Pact2HP/2s, cap riêng6HP/10s trong budget chung8; counter bloodHealed dùng cùng healWindow, giữ qua đổi Curse, reset khi hết window hoặc run mới. Frenzy modifier vẫn giữ; các cost damage phòng thủ mới áp dụng theo feedback tank ở trên.
- Q5B rework xong5Mutation/4Curse theo contract. BuildEffects.ts giữ clocks/Phantom/hazard/heal budget; combat giữ root object qua shot/Heavy/Detonate/relay/echo, cap2seed/6echo/root. BuildVisual.ts vẽ cue bounded; HUD vi/en cho Phantom/Static/Frenzy/heal/cost/Ghost risk. config/playtests.ts giữ4preset Q5B +Juggernaut/tank, thêm5preset Q5C, không lưu progress.
- Difficulty v2: pressure4s ưu tiên2Archer tới8; Grunt jump0.68s/radius48 lead160/max3/concurrent, damage6/cooldown7s/first delay4–6.6s/start gap1.6s hoặc0.7s khi18Grunt, Heavy/blast interrupt/AoE vẫn trúng. Boss far-sweep→slam leap560, chase300, ring12+fan3 speed430, windup0.62/0.46 cooldown0.55/0.38 recovery0.32/0.24. Xem docs/pressure-v2/README.md.
- Contract mới là nguồn thiết kế Q5; docs/q5/AUDIT.md thuộc lượt audit trước, không còn là quyết định/next action hiện hành. User đã duyệt concept/contract; không còn blocker thiết kế.
- Code Q5C có12Mutation/8Curse; đã Draft v2 ở Q5D. Contract Q5 lịch sử12/8 giữ4Mutation/run,1Curse; Q6 hiện2Curse và6draft. Q5A chỉ vertical slice Juggernaut; Blood Pact sustain đã ở Q5B; các nguồn heal Q5C hiện dùng chung budget.
- Defaults contract đã duyệt, còn tuning qua playtest: Barrier30 không decay; heal chung8HP/10s và cooldown riêng; Soul Anchor không cứu hit chí tử; Catalyst seed tối đa2/root không kích trong cùng root; proc có provenance/cap. Giữ Phantom reach/Catalyst charge/Guard Heavy bonus; các gói rework khác thay hiệu ứng cũ như contract, không ngầm cộng dồn.
- Draft Q5D đã triển khai theo thiết kế: weighted theo damage thực/Perfect/phá thế/chain/phòng thủ, lý do có căn cứ; anti-repeat×0.4 cho offered IDs run trước (kể cả bỏ dở), seed draft riêng kèm snapshot debug; nội dung mới eligible mặc định khi triển khai, giữ unlock Guard/Static/Death Echo.
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
- Mutation draft chỉ lấy option hợp lệ/chưa sở hữu; hiện đầu4hướng, các lượt sau tối đa3; pool còn1–2 hiển thị đúng số còn, hết thì bỏ qua không heal. Q6 Curse lượt2 Keep hoặc thêm slot2; clamp maxHP sau heal10 (Parasitic5). Milestones/unlocks giữ; effect dùng Q5B/Q5C, Draft v2 ở Q5D.

- Layout: trong184×184, Charged52px tại(56,0), Heavy52px(56,64), Dash60px(52,124), Shoot64px(116,24), Melee68px(116,100), Surge48px(0,0). Pad trái132–180px/cao132–160, portrait reserve204px; safe-area/dvh và native-gesture guard khi playing giữ.
- Q1 atlas Fractured Vessel và Charged VFX giữ; Light ba nhát có pose/trail/SFX riêng từ bản trước. Enemy đã có layered Fractured Geometry ở Q3; floor đã chuyển asset Q7A; runtime visual còn chờ user playtest, không tự accepted.

## IMPLEMENTATION AUDIT / LIMITS
- Functional tests chứng minh input/timing/geometry/resources/run, không chứng minh combat feel. Safari/iOS, âm thanh/performance/tầm với máy thật và full-run cần user thử.
- Q5D dùng actual outcomes và weighted sampling, không còn fallback nhãn adaptive/synergy thiếu evidence. Q5D đã được user duyệt; Q5E đã được user duyệt “playtest oki”.
- Q5C đã được user duyệt; Q5D đã accepted; Q5E trial/checks/deploy PASS và đã được user playtest/chấp nhận. Không lấy fixture/tests làm user acceptance. Không lấy mô tả contract làm bằng chứng tính năng đang chạy.
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
- Handoff phải commit/push để giữ tiến độ; user đã cho phép đồng bộ HANDOFF/GAME_BRIEF hiện có trên repo public ngày2026-10-26. Quy tắc được lưu ngay trong HANDOFF.md; không chỉ giữ tiến độ ở local.
- User yêu cầu mọi bàn giao playtest phải nói rõ scope, cách thử và kết quả mong đợi; đã lưu quy tắc ở AGENTS.md.
- Mobile-first + desktop,1arena,run5phút,1sword/gun,3mobs/Elite/Boss; scope Q5 mới khóa12Mutation/8Curse (code Q5C12/8); không permanent stat upgrades/backend/account/multiplayer/leaderboard/monetization.
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
- Deploy Q7A0e0a9af: Actions40266665479/job121390460491 completed/success, bước Deploy success. Live curl vẫn bị proxy403; ảnh/checks là local Vite/dist. Sau deploy chỉ đồng bộ docs/board, không sửa code hoặc lặp tests/build.
- Q7A: user duyệt concept V2, runtime typecheck/build/test12files/browser4viewports PASS; evidence/limits/perf/cách thử tại docs/q7a/IMPLEMENTATION.md. Chỉ preload/floor rendering thay đổi, gameplay/bounds/camera/input/VFX giữ nguyên so main bc07fd4.
- User duyệt thêm Q6 qua “aprroved q6 lun nha” ngày2026-10-26. Q6 stacking và draft đầu4hướng đều ACCEPTED. Lượt này chỉ sửa trạng thái Markdown/kiểm diff và push, không đổi code hoặc chạy lại tests/build/deploy; không coi approval là bằng chứng đã thử Safari/mọi thiết bị.
- Lượt trước: user xác nhận “approve” cho draft đầu4hướng7843b98 ngày2026-10-26. Lượt này chỉ đồng bộ approval trong HANDOFF/GAME_BRIEF/docs/q6, kiểm diff; không đổi gameplay hoặc chạy lại tests/build/deploy. Không suy rộng approval sang Q6 stacking/Safari/mọi thiết bị.
- Feedback draft đầu4hướng: code7843b988e6d0a109cc20994b3c874219b05443bb đã fast-forward push main; Pages Actions40259161783 completed/success. Tests151definitions/12files, typecheck/build/browser4viewport PASS như CURRENT STATUS. URL https://gizgity.github.io/a-new-game/ ; evidence local fixture, chưa smoke live (proxy403 từ lượt trước) hoặc user acceptance.

- Q6 code b534315bb7cb15aa219e6ee8debd1682457a685a, parents c02c30a/f1fb9ea trên main eb49190; fast-forward push không force, giữ toàn bộ Q5 evidence. Pages Actions40252934135 completed/success (job121348532512), Deploy step thành công. Lượt đầu c02c30a Actions40252846937 cũng success.
- URL https://gizgity.github.io/a-new-game/ ; curl live bị network proxy403 nên chưa smoke live, không bypass policy. Chromium evidence là local Vite, không giả là live. Tài liệu reconciliation sau deploy chỉ Markdown, kiểm diff, không cần chạy lại build/tests.

- User xác nhận Q5E “playtest oki” và yêu cầu Q6 ngày2026-10-26. Lượt này chỉ đối chiếu brief/lịch sử và cập nhật approval/next action; kiểm diff, không chạy lại build/tests/deploy gameplay. Remote main8db19ba đã đối chiếu.
- Lượt đồng bộ tài liệu ngày2026-10-26: lịch sử GitHub xác nhận HANDOFF/GAME_BRIEF đã được push trước đó; user cho phép đồng bộ và yêu cầu handoff bắt buộc push. Ghi quy tắc bắt buộc push tại KEY DECISIONS, gỡ blocker quyền cũ, giữ trạng thái Q5E chờ playtest. Chỉ sửa Markdown, kiểm diff/tính nhất quán; không chạy lại tests/build/deploy gameplay.
- Q5E:137definitions/11files PASS (1focused4route×6draft), typecheck/build/diff PASS. Giữ nguyên combat.ts/run.ts/balance.ts/Draft.ts. Không thêm effects hoặc tune số Q5.
- Core offline seed123456789, script biết vị trí/timing/Perfect, không grant HP/ammo/kills/time: tank thắng3:17.2 HP76; sustain3:07.1 HP100; counter3:11.1 HP100; ranged3:10.7 HP36/75. Cả4quaElite/Boss; sustainheal0 nên chưa chứng minh utility, không suy rộng thành user balance acceptance. docs/q5e/scripted-routes.json.
- Chromium390:4route×6draft/label/reset/vi-en/no initial grant/no-progress PASS, normal unlock/old trial PASS; ảnh là fixture kill thresholds. Dist320/844/1440 real input/pause/vi-en/no-overflow/runtime PASS. Chưa Safari/iOS/device/full-run browser; local/dist chưa smoke live.
- Q5D514063a user duyệt “oki r, làm tiếp đi” ngày2026-10-26. Q5C b5ba138/Q5A/Q2/Q3/Q4 giữ approvals; tank d42cdaf giữ tuning. Không suy rộng approval Q5D sang toàn Q5B counter/chain/echo.
- Deploy Q5E PASS:8b1571d719a51c6f0da50a8b4435782c20a444ff, Actions40248846311 completed/success, job121336104379. Parent252b4b2, expected SHA/không force,13blobs(9text/4PNG) đối chiếu local+remote tree; core hash giữ nguyên.
- Remote main252b4b2 đã đối chiếu đầu Q5E. Git local vẫn396ed42+changes trước; deploy connector từ parent remote, expected SHA/không force, bảo toàn mọi evidence. Repo publicgizgity/a-new-game đã xác minh quyền ghi.

## NEXT ACTION
Chờ user playtest **Q7A0e0a9af** tại https://gizgity.github.io/a-new-game/ (reload): opening chạy giữa→rìa; crowd20–45s quan sát player/threat và Chém→Bắn/Heavy/Charged để soi pips/relay/blast; nếu tiện Boss450kills/4:00. Mobile joystick/Lướt/giữ-thả specials, desktop WASD/Space/Shift/E. Mong đợi floor có depth nhưng không che combat, controls/camera như cũ, không chậm rõ. Gửi vùng/tình huống/thiết bị/browser; checklist/evidence docs/q7a/IMPLEMENTATION.md. **AWAITING USER PLAYTEST APPROVAL**, chỉ nhận feedback Q7A, không mở Q7B.

## PLAYTEST Q5C — ĐÃ DUYỆT / THAM CHIẾU
Scope/cách thử/mong đợi/giới hạn ở docs/q5c/README.md. Link https://gizgity.github.io/a-new-game/?playtest=sustain, đổi query thành anchor/chamber/glass/hunted. Trial cấp build không lưu progress, không là natural acquisition. Mobile joystick/Lướt/Chém/Bắn; Heavy/Charged giữ-thả. Desktop WASD/Space/chuột trái-phải/Shift/E giữ-thả. Giữ tank d42cdaf đã duyệt; không yêu cầu thử lại Q5A/Q4.

## PLAYTEST Q5D — ĐÃ DUYỆT / THAM CHIẾU
Checklist scope/cách thử/giới hạn ở docs/q5d/README.md. Game thường không query để kiểm natural acquisition: draft25kills/0:30, Curse80/1:00, Mutation160/1:40 và220/2:20, Curse300/3:00, Mutation380/3:40. Chơi thiên melee/ranged/Perfect/Heavy hoặc defense, xem reason đúng bằng chứng/build; vi/en không đổi IDs; Curse2 có giữ; run kế giảm lặp có xác suất. Mobile joystick/Chém/Bắn/Lướt, specials giữ-thả; desktop WASD/chuột/Space/Shift/E. Chưa yêu cầu thử lại Q5C.

## PLAYTEST Q5E — ĐÃ DUYỆT / THAM CHIẾU
4link route/checklist chi tiết docs/q5e/README.md. Chọn card “Gợi ý” ở Mutation25/0:30,160/1:40,220/2:20,380/3:40; Curse80/1:00 và giữ300/3:00. Đi tớiElite200/2:30, Boss450/4:00 hoặc ghi đòn/mốc chết. Tank so đứng/di chuyển và damagecost; sustain thử khi mấtHP, marked kill/nổ; counter Perfect→Light/Charged vàzeroDash; ranged GlassHP75/Fracture/chain4. Mobile joystick/giữ-kéo Chém/Bắn/Lướt/specials giữ-thả; desktop WASD/chuột/Space/Shift/E. Trial không natural acquisition/không lưu progress. User đã duyệt Q5E qua “playtest oki”; checklist giữ làm tham chiếu, không yêu cầu thử lại. Không suy rộng sang Safari/mọi thiết bị.

## BLOCKERS
Không còn blocker Q6/approval; Q6 đã ACCEPTED. Live smoke trong môi trường vẫn chưa thực hiện do proxy403; giới hạn kỹ thuật này giữ nguyên.
Git fetch ngoài sandbox đã hoạt động; dùng fast-forward push main, giữ tree remote/evidence. gh API bị Forbidden, theo dõi deploy bằng connector/web GitHub nếu cần. Không còn blocker scope Q6; user đã cung cấp contract. Q5E ACCEPTED; Q5A–Q5E giữ approval theo task mới nhất (Q5B được user xác nhận tổng thể trong task này, giữ nguyên evidence approval hẹp cũ).

