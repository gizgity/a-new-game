# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Q5D — Weighted Draft + anti-repetition. User xác nhận Q5C “oki r, làm tiếp đi” trên b5ba138; **Q5C ACCEPTED — USER PLAYTEST APPROVAL**. Giữ toàn bộ gameplay/tank tuning, chỉ làm draft/data/UI/progression liên quan; dừng chờ playtest Q5D, không mở Q5E.

## ACCEPTANCE
- Weighted sampling không hoàn lại từ eligible canonical, Adaptive/Synergy/Wildcard có lý do thật; Curse2 bảo đảm giữ, kết hợp + Wildcard. Không reroll khi render/pause/vi-en, pool0/1/2 đúng.
- Tín hiệu actual direct damage/Perfect/marked chain/Heavy phá thế/Barrier/heal theo cửa sổ giữa draft, có sample confidence, không gán hiệu quả từ click/proc/hazard/self-cost. Nhu cầu HP chỉ contribution≤0.25.
- Draft PRNG xorshift32 riêng, debug seed+snapshot đầy đủ; không thay spawn/combat. Anti-repeat×0.4 offered IDs run trước (kể bỏ dở), whitelist bounded/storage fallback giữ settings/unlocks.
- Focused tests/phân bố, typecheck/build/browser/deploy; user acceptance riêng, dừng AWAITING PLAYTEST APPROVAL Q5D.

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
| Q5B — Rework existing pool | IN PROGRESS — AWAITING PLAYTEST APPROVAL | Tank/sustain trên d42cdaf đã được duyệt; các vòng counter/chain/echo chưa có xác nhận riêng |
| Tank trade-off | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “oki, ổn r á” trên d42cdaf |
| Q5C — New pool tới12/8 | ACCEPTED — USER PLAYTEST APPROVAL | User xác nhận “oki r, làm tiếp đi” trên b5ba138 |
| Q5D — Weighted Draft | IN PROGRESS | Đang triển khai theo contract |
| Q5E — Diversity/balance | NOT STARTED — AWAITING PLAYTEST APPROVAL | Chỉ mở sau user accepted Q5D |

## CURRENT STATUS
- Q5D implementation: DraftSignals actual outcomes/cửa sổ giữa draft, Draft.ts xorshift32 riêng+sampling weighted/canonical/no replacement, config/draft.ts metadata/groups/weights. Adaptive/Synergy/Wildcard có reason khi đủ evidence; Curse2 bảo đảm giữ. Không đổi gameplay tuning.
- Profile v1 bổ sung drafts.previous/current/active whitelist20IDs; ghi IDs khi thực sự hiện, rotate khi start kể reload/bỏ dở. Storage blocked giữ trong memory. Trial không ghi history. Query draftSeed/draftDebug opt-in; window.cursebreakDraft là snapshot copy. Chưa lưu/khôi phục run đang chơi.
- Q5C thêm Blood Reclaimer/Iron Reversal/Soul Anchor/Echo Chamber/Kinetic Battery và Glass Soul/Parasitic Mark/Hunted Vessel; pool12/8, mặc định eligible10/7 giữ unlock cũ. Trial sustain/anchor/chamber/glass/hunted cấp build, không lưu progress. HUD/VFX riêng cho heal/slow/pin/Anchor/Reversal/Glass/Hunted.
- Đã ghép remote c128133 (tank d42cdaf + approval), giữ Aegis×0.8/Oath×0.75/Blood×0.8 và Blood6HP/10s, Barrier chặn Blood heal. Không dùng snapshot local396ed42 để ghi đè remote.
- Tank trade-off mới: Aegis−20%, Oath−25%, Blood Pact−20% damage gây ra; Aegis+Oath còn60%, Aegis+Blood còn64% trước Frenzy/Guard bonuses. Blood không heal khiBarrier>0; Aegis rate4/Oath5. Preset ?playtest=tank cấp Guard+Aegis+Berserker+Blood, không lưu progress.
- Sustain tuning: Blood Pact2HP/2s, cap riêng6HP/10s trong budget chung8; counter bloodHealed dùng cùng healWindow, giữ qua đổi Curse, reset khi hết window hoặc run mới. Frenzy modifier vẫn giữ; các cost damage phòng thủ mới áp dụng theo feedback tank ở trên.
- Q5B rework xong5Mutation/4Curse theo contract. BuildEffects.ts giữ clocks/Phantom/hazard/heal budget; combat giữ root object qua shot/Heavy/Detonate/relay/echo, cap2seed/6echo/root. BuildVisual.ts vẽ cue bounded; HUD vi/en cho Phantom/Static/Frenzy/heal/cost/Ghost risk. config/playtests.ts giữ4preset Q5B +Juggernaut/tank, thêm5preset Q5C, không lưu progress.
- Difficulty v2: pressure4s ưu tiên2Archer tới8; Grunt jump0.68s/radius48 lead160/max3/concurrent, damage6/cooldown7s/first delay4–6.6s/start gap1.6s hoặc0.7s khi18Grunt, Heavy/blast interrupt/AoE vẫn trúng. Boss far-sweep→slam leap560, chase300, ring12+fan3 speed430, windup0.62/0.46 cooldown0.55/0.38 recovery0.32/0.24. Xem docs/pressure-v2/README.md.
- Contract mới là nguồn thiết kế Q5; docs/q5/AUDIT.md thuộc lượt audit trước, không còn là quyết định/next action hiện hành. User đã duyệt concept/contract; không còn blocker thiết kế.
- Code Q5C có12Mutation/8Curse; đã Draft v2 ở Q5D. Contract đích12/8 giữ4Mutation/run,1Curse active và6draft. Q5A chỉ vertical slice Juggernaut; Blood Pact sustain đã ở Q5B; các nguồn heal Q5C hiện dùng chung budget.
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
- Mutation draft chỉ lấy option hợp lệ/chưa sở hữu, tối đa3; pool còn1–2 hiển thị đúng số còn, hết thì bỏ qua không heal. Curse lượt2 luôn có giữ Curse hiện tại; đổi thay toàn bộ hiệu ứng cũ, clamp maxHP sau heal10 (Parasitic5). Milestones/unlocks giữ; effect dùng Q5B/Q5C, Draft v2 ở Q5D.

- Layout: trong184×184, Charged52px tại(56,0), Heavy52px(56,64), Dash60px(52,124), Shoot64px(116,24), Melee68px(116,100), Surge48px(0,0). Pad trái132–180px/cao132–160, portrait reserve204px; safe-area/dvh và native-gesture guard khi playing giữ.
- Q1 atlas Fractured Vessel và Charged VFX giữ; Light ba nhát có pose/trail/SFX riêng từ bản trước. Enemy đã có layered Fractured Geometry ở Q3; floor vẫn prototype art; không tự accepted.

## IMPLEMENTATION AUDIT / LIMITS
- Functional tests chứng minh input/timing/geometry/resources/run, không chứng minh combat feel. Safari/iOS, âm thanh/performance/tầm với máy thật và full-run cần user thử.
- Q5D dùng actual outcomes và weighted sampling, không còn fallback nhãn adaptive/synergy thiếu evidence. Chưa user acceptance Q5D, Q5E chưa triển khai.
- Q5C đã được user duyệt; Q5D implementation/checks PASS, đang deploy, Q5E chưa triển khai. Không lấy fixture/tests làm user acceptance. Không lấy mô tả contract làm bằng chứng tính năng đang chạy.
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
- Q5D:136definitions/10files PASS (14focused mới), phân bố4096seed/điều kiện, replay/eligibility/keep/poolcap/signals/actual damage/windows/profile migration/history/abandon/reload/storage fallback PASS. Typecheck/build PASS, warning Phaser bundle cũ.
- Chromium390 năm style +320/844/1440Curse2: reason/vi-en/no reroll/debug copy/history/keep/HP5/no-overflow/runtime PASS. Fixture grant build/targets/eligible/seed; chain snapshot mẫu; không là natural run. Dist320/844/1440 input thật/pause/vi-en/history/no-overflow/runtime PASS, không inject stats. Evidence docs/q5d/README.md.
- Q5C b5ba138 deploy PASS Actions40211566822; user duyệt “oki r, làm tiếp đi”. Tank d42cdaf đã duyệt, giữ tuning; Q5B counter/chain/echo chưa có xác nhận riêng. Q5A/Q2/Q3/Q4 giữ approvals lịch sử.
- Remote main5a84c89 đã đối chiếu đầu Q5D; git local vẫn396ed42+changes của các lượt trước. Deploy qua connector từ parent remote/expected SHA/không force, không push lịch sử local. Browser evidence local/dist, chưa smoke live.

## NEXT ACTION
Deploy Q5D sau checks PASS, theo dõi Pages Actions tới kết thúc rồi bàn giao playtest; không mở Q5E.

## PLAYTEST Q5C — ĐÃ DUYỆT / THAM CHIẾU
Scope/cách thử/mong đợi/giới hạn ở docs/q5c/README.md. Link https://gizgity.github.io/a-new-game/?playtest=sustain, đổi query thành anchor/chamber/glass/hunted. Trial cấp build không lưu progress, không là natural acquisition. Mobile joystick/Lướt/Chém/Bắn; Heavy/Charged giữ-thả. Desktop WASD/Space/chuột trái-phải/Shift/E giữ-thả. Giữ tank d42cdaf đã duyệt; không yêu cầu thử lại Q5A/Q4.

## PLAYTEST Q5D — AWAITING PLAYTEST APPROVAL
Checklist scope/cách thử/giới hạn ở docs/q5d/README.md. Game thường không query để kiểm natural acquisition: draft25kills/0:30, Curse80/1:00, Mutation160/1:40 và220/2:20, Curse300/3:00, Mutation380/3:40. Chơi thiên melee/ranged/Perfect/Heavy hoặc defense, xem reason đúng bằng chứng/build; vi/en không đổi IDs; Curse2 có giữ; run kế giảm lặp có xác suất. Mobile joystick/Chém/Bắn/Lướt, specials giữ-thả; desktop WASD/chuột/Space/Shift/E. Chưa yêu cầu thử lại Q5C.

## BLOCKERS
Không blocker implementation Q5D; còn deploy và user playtest experience. Q5E chưa mở. Pages direct từng bị proxy chặn, chưa tự nhận smoke live.
