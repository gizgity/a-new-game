# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Q7C — Character & Enemy Art Overhaul, task user2026-10-26. Audit → sprite concepts riêng6nhân vật → preview arena/crowd/grayscale → đồng bộ docs → **AWAITING VISUAL APPROVAL**. Q7B đã ACCEPTED; Q7D = Full Run Polish chưa mở. Chưa tích hợp runtime hoặc đổi gameplay/HUD.

## ACCEPTANCE
Reference chính Q7A Visual Hierarchy / Contrast Study V1. Đủ idle/move/windup/attack/recovery/hit/death (Volatile recovery sống=N/A), Player actions và Boss sweep/ring/slam phân biệt. Preview ghi rõ concept và gameplay scale; source riêng, không crop concept board thành runtime sprite. User duyệt visual trước asset rendering/animation/deploy; sau deploy AWAITING PLAYTEST APPROVAL, không tự accepted.

## CURRENT STATUS — Q7C AWAITING VISUAL APPROVAL
- User phản hồi góc arena/character khôngkhớp và yêu cầuresearch. Đãresearch primarysources,ghi docs/q7c/VIEW_RESEARCH.md: đềxuất top-down¾cáchđiệu nhìnxuốngcao,không overhead90°bắtbuộc/isometric; cameraengine khác gócart. Chưauserchốt recommendation,chưa sinhrevision mới hoặc đổi runtime. Bộreview hiệncó chưavisualapproved.
- Audit d747f49 đã push main từ baseline78f07e6/Q7B5ee970e accepted. Có6dedicatedsprite sheets7states; PlayerV2 sángmint hơnV1 sau grayscale review; PlayeractionsV2 và Boss3×3patterns riêng. Source/prompt/rights/hashes giữ docs/q7c; không crop concept board thành sprite.
- Board docs/q7c/index.html + evidence: mobile320/390,landscape844,tablet768,desktop1440 đúng canvas/zoomQ7B; crowd32staged,Boss/Elite,grayscale và mobile giữHUD screenshot. Không renderer runtimeQ7C/naturalrun; threat/P2/VFX chưa cùngcandidate trongarena, phải kiểm saugate.
- Typecheck/build PASS; npm test159PASS/0fail trên baseline. PNG/hash/board Chromium320/390/768/1440 đủảnh/noerror/nooverflow PASS. Không diff src/public/config/deps/workflow; chưa atlas/directions/motion/runtimeperf/device/Safari mới. Chi tiết/giới hạn/checklist: docs/q7c/README.md,ASSET_SPEC.md,manifest.json,evidence/checks.json.
- Một số source còn alpha residue/pivot khôngđều/weapontrail/arrow/impact bake, phải làm sạch riêng sau userduyệt; không đưa sheet auto-slice thành atlasproduction. Volatile recovery sống=N/A; Bosshit khôngstagger. Không tự acceptedQ1/Q7C hoặc mởQ7D.
- Bộreview/docs checkpoint push `codex/q7c-visual-review` (khôngmain) để chưa kíchPages trướcvisualgate. main cóaudit và pointer handoff; runtime vẫnQ7B5ee970e. User yêu cầu dừng visual trướcintegration; chưa deployQ7C.

## PROGRESS
M0–M6 là functional implementation, không phải chứng nhận chất lượng toàn MVP.

| Checkpoint | Trạng thái | Còn thiếu |
| --- | --- | --- |
| Mobile-first | Nền tảng triển khai; UX Q7B ACCEPTED | Giới hạn coverage device/iOS/Safari kỹ thuật giữ, không đòi duyệt lại Q7B |
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
| Q7A — Arena art/contrast | ACCEPTED — USER PLAYTEST APPROVAL | User “nếu vậy thì t approved” ngày2026-10-26 sau làm rõ floor-only; code0e0a9af/board2e48166 |
| Q7B — HUD & Combat Readability | ACCEPTED — USER PLAYTEST APPROVAL | User “q7b đã đạt” trên5ee970e; Pages40292060536 SUCCESS |
| Q7C — Character & Enemy Art | AWAITING VISUAL APPROVAL | User duyệt6characters/state/crowd/grayscale/Boss3patterns |
| Q7D — Full Run Polish | NOT STARTED | Chỉ mở khi user giao |

## CURRENT STATUS — Q7B ACCEPTED
- User xác nhận “q7b đã đạt” ngày2026-10-26 trên bản5ee970e. Code5ee970ed41802ce75d222b714c74361949d0aae6 đã push main/review branch, Pages40292060536/job121469197980 SUCCESS gồmDeploy. URL https://gizgity.github.io/a-new-game/ ; livecurl môi trường vẫn proxy403, evidence là local dev/dist. Không giả fixture là user acceptance; approval là phát biểu user.
- Brief/HANDOFF/Q7B docs/board và crossref Q7A cập nhật acceptance; historical concepts/prompts/evidence chờgate ởsnapshot cũ giữ nguyên. Không thay gameplay/floor hoặc mở checkpoint mới.

## IMPLEMENTATION — HUD FRAME / ICON-ONLY GROUPED CONTROLS
- Baseline main6a851a0/runtimef9d7930 đã fetch/clean. User đưa ảnh frame và correction icon-only; không tự suy ra approval runtime. DOM-only layout study trước correction chữ được lưu superseded, không dùng kiểm occlusion/input.
- 5authoredSVG frame/inset/rings/pairbridge +4glyph thêm vào sheet; không copy pixels ảnhuser/thirdparty/newdep. Frame nằm ngoài canvas;2pair4attack vàutility riêng,184×272/portrait controls284px,landscape45.92px min. Mặt nút chỉicon,counter+timer/points ởmép,ARIA/tooltip vi/en. HUD_V3.md/board/provenance mô tả hiện hành.
- Build/typecheck/test14files PASS. Renderer6sizes320/390/667/844/768/1440 fullbuild/resources/Boss/4góc/details/vi-en/grayscale PASS; sửa build-info icon clipped ở667 bằng nới summary/giới hạnBoss tronggap, rerun6sizes PASS. CDP4origins/manual+move/auto resume/Chargedrelease/Heavy1charge/details2finger/cancel/draft1000ms/freshpress/card4 PASS; chờ tick thayfixed delay khi headlesschậm. Dist5sizes input/Pause/settings/details/vi-en PASS; finaldist390/667/1440 icon-only/assetbase/ARIA+tooltip/summaryoverflow PASS.
- Touch sample/reset/bind/release/move so bytewise với6a851a0 không đổi. Không diff src/game/**/floor/config/effects/draft/AI/VFX/workflow/lockfile. Evidence docs/q7b/hud-v3; fixture khôngnaturalrun hoặcdeviceapproval.

## PREVIOUS CHECKPOINT — Q7B f9d7930
- Codef9d7930e583c8756037ceab2859ea65bd3ae055a/docs6a851a0 đã push, Pages40279081013/job121428123386 SUCCESS; usernay yêu cầuframe/icon-only thaygeometry180×240/labels. Snapshot/evidence/checks ở docs/q7b/REVISION.md, giữ autoaim/draft1s. Livecurl ởvòngđó proxy403; không giảlocal làlive.

## PREVIOUS CHECKPOINT — Q7B
- Concept95c9ffd user “approved làm đi”; code6664ee0/deploy40275065554 success, docs8a469c0 là baseline trước feedback mới. Bản đó giữ canvas/controls, checks13files/5sizes/frozenperf PASS; user nay chỉ ra occlusion. Chi tiết/evidence lịch sử ở docs/q7b/IMPLEMENTATION.md, không dùng các bảo đảm “core/input/camera giữ” cho revision.
- Auto-review lượt trước đã chặn main push rồi cho phép sau đối chiếu taskQ7B section7+AGENTS Deployment và fast-forward an toàn. Quyền deploy/push hiện hành giữ; không bypass policy/ref/merge khác.

## CURRENT STATUS — Q7A ĐÃ ACCEPTED
- User duyệt runtime Q7A sau khi xác nhận scope chỉ artwork sàn; không thay player/enemy/VFX/gameplay. Đã đồng bộ GAME_BRIEF/docs Q7A/board. Q7B có scope riêng và nay đã user accepted trên5ee970e.
- Concept V2 user duyệt “approved, làm tiếp đi” ngày2026-10-26. Đã fetch/merge main bc07fd4, bảo toàn Q6 acceptance và opening4hướng, Q2–Q6 giữ accepted; Q1 riêng chưa duyệt.
- ImageGen cleanup concept V2 bỏ footer thành source PNG mới; Pillow chỉ resize/compress1600×1000 WebP88,174334bytes. Một Phaser Image depth0, tint#7a8791 sau xem renderer thấy cạnh sàn còn sáng; không animation/shader/new dependency. ArenaScene chỉ thay preload/drawArena; mọi gameplay/camera/controls/collider/sprites/VFX giữ nguyên.
- Source/review PNG và prompt giữ docs/q7a/artwork; runtime asset public/assets/arena/broken-seal-v2.webp; provenance/hash/rights/processing ở docs/q7a/runtime-asset.json. Không third-party artwork hoặc service lúc chạy.
- Build/typecheck PASS, npm test12files PASS; browser fixture+production320/390/844/1440 PASS vi/en/pause-resume/no overflow/no runtime/request errors. Synthetic dispatch lần đầu lỗi pointer capture do harness, đã sửa sang CDP touch thật và rerun PASS; không sửa controls.
- Renderer thật: before/after identity/crowd390/1440 cùng fixture,33enemy+actual Charged blast; Boss3pattern, Grunt4phase, grayscale cùngcanvas, edge3motif, production input. Xem docs/q7a/IMPLEMENTATION.md và evidence/*.json. Fixtures không natural runs; user đã duyệt Q7A, device/Safari/full-run chưa được xác minh kỹ thuật.
- Một texture decode6.4MB (ước lượng RGBA),1quad thay static Graphics; A/B ABBA cùng page median390 giữ16.7ms;1440 old83.3→new33.4ms. Không suy ra device FPS hoặc simulation performance từ frozen headless software WebGL. Không thêm QA framework.
- Code0e0a9af2b8cd5fc201690b50ae0a420995dcdd82 đã push main fast-forward, Pages40266665479/job121390460491 completed/success gồm Deploy. Bản đồng bộ board/handoff2e48166 cũng deploy40266875087 completed/success, runtime code giống0e0a9af. URL https://gizgity.github.io/a-new-game/ ; live smoke vẫn proxy403, không giả ảnh local là live. Q7A đã được user duyệt sau deploy; Q7B theo contract/visual gate riêng.

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

- Layout hiện hành: HUDframe/lane ngoài canvas,4attack theo2pair +Dash/Surge icon-only,184×272/portrait controls284px; landscape2side lanes/scale0.82. Auto nearest/manual override/draft1s giữ; GAME_BRIEF/HUD_V3.md supersede geometry/labels cũ.
- Q1 atlas Fractured Vessel và Charged VFX giữ; Light ba nhát có pose/trail/SFX riêng từ bản trước. Enemy đã có layered Fractured Geometry ở Q3; floor đã chuyển asset Q7A; Q7B HUD/controls nay user accepted; Q1 player art vẫn chờ visual approval riêng.

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

## LAST VALIDATION — Q7B (LỊCH SỬ)
- Frame/icon-only revision: typecheck/build/test14files PASS; focused browser6sizes/corners/Boss/empty+ready/build6slots/vi-en/grayscale/nooverflow/error PASS. Layout/info button ở667 đã sửa/rerun. Input CDP hold/release/manualwhilemove/autoaim/details2finger/cancel/draft1s/freshpress PASS.
- Production5sizes Bắn/drag/Heavy1/2/mouse/WASD/details/Pause/settings/vi-en/no stuck/noerrors PASS; finaldist390/667/1440 icon/asset/overflow PASS. SVG XML/provenancehashes/PNG integrity/localdocslinks/diff PASS. Không đổi gameplay/floor/inputinternals; frame/glyphs static khôngbenchmark deviceFPS.
- User đã accepted Q7B; kỹ thuật chưa iOS/Safari/device/full-run. Pages40292060536 đã SUCCESS; proxy live403 đã kiểm lại lượt này, không bypass/giả local/dist làlive. Snapshotf9d7930/evidence trước giữ ở REVISION.md; core approvals giữ PROGRESS vàdocs từngcheckpoint.

## NEXT ACTION
Chờ user duyệt hoặc feedback bộ visual tại branch codex/q7c-visual-review/docs/q7c (README/index/evidence). Chỉ sau duyệt mới làm source sạch/asset rendering/animation, focused checks + mobile/desktop/performance, commit/push/deploy và AWAITING PLAYTEST APPROVAL. Không tự Q7D hoặc ACCEPTED.
