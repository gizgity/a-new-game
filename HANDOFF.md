# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Q7C — Character & Enemy Art Overhaul. User “visual approved q7c”2026-10-26 sau research góc nhìn. Đã triển khai asset rendering/animation; chốtchecks/deployPages rồi **AWAITING PLAYTEST APPROVAL**. Q7B accepted; Q7D = Full Run Polish chưa mở.

## ACCEPTANCE
Giữ artdirection top-down¾nhìnxuốngcao,referenceQ7A,silhouette/palette/P0–P3;6actors/state/Playeractions/Boss3patterns. Giữcollider/AI/damage/timing/telegraph/VFX/controls/HUD vàQ2–Q7B. Uservisualapproval không là runtimeacceptance; không tựQ7D.

## PROGRESS
M0–M6 là functional implementation, không phải chứng nhận chất lượng toàn MVP.

| Checkpoint | Trạng thái | Còn thiếu |
| --- | --- | --- |
| Mobile-first | Nền tảng triển khai; UX Q7B ACCEPTED | Giới hạn coverage device/iOS/Safari kỹ thuật giữ, không đòi duyệt lại Q7B |
| Q1 — Player art/animation/readability | HISTORICAL — artwork được Q7C thay thế | Q7C visualapproved, runtime chờplaytest; không tựaccepted Q1 |
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
| Q7C — Character & Enemy Art | VISUAL APPROVED / AWAITING PLAYTEST APPROVAL | User “visual approved q7c”; runtime đã triển khai, đang chốtdeploy |
| Q7D — Full Run Polish | NOT STARTED | Chỉ mở khi user giao |

## CURRENT STATUS — Q7C IMPLEMENTED
- Review7a1db73/research2bb4792; đãmergeorigin/main87c1ca8 trong3c940dd và ghiapproval. Sourceproduction mới riêng bằngImageGen,4facings×7states/6actors +Player8actions/Boss9patternposes/hướng;236frames. Khôngcropconceptboard. AtlasPNG1024square/990873bytes/4MiBdecoded;provenance/sourceprompt/hash tại docs/q7c/runtime-assets.json vàsource/.
- ActorPose/ActorArt/EnemySprites +PlayerVisual; bodies dùngImages/pooledassets, khôngGraphicsbody. Táchground/body/statusVFX để giữlayering. Telegraph vàdrawSlash bytewise; core/gameplay/config/AI/controls/HUD/style/i18n/floor/workflow khôngdiff. OldSVG giữlịch sử. Khôngnewgamedep/framework.
- Animationtheosimulation,4bodyfacings khôngxoayphẳng360°; aim/projectile/VFX liên tục theo inputcũ. Walk2pose/bob,windup lấyđà,attack/recovery/shot/dash/hit/deathsourceposes. Enemydeathpool8/0.28s chỉhp≤0,Playerdash6echo/0.22s,cadence0.033s; reset/pause/hitstopfreeze. Khônggiữcollider/target/rewardqua deathvisual. Volatilekhônglivingrecovery; Bosshit khôngstagger.
- Build/typecheck PASS;163testsPASS/0fail (159baseline+4focused). Renderer5sizes320/390/844/768/1440,crowd33/actualtelegraph+Charged/Boss3/grayscale,noerrors/requests/overflow PASS. Before/after freeze đúngPhaser sys.sceneUpdate, khôngnaturalrun. Initial harness overrideinstance.update sai đãchụplạitoànbộ.
- Browserinput CDPtouchmove+shoot390/844,mouse/WASD1440,Pause/vi-en/resumePASS;20resetdisplaylist29→29,ghost/deathclear. Dist5sizesatlasload/Heavyhold2/2→release1/2/Pause/locale/resume/noerrorPASS. Corner390/1440 xem runtime/corners.json. Fixtures khôngdeviceapproval.
- PerfCPUdrawmedian0.3–0.4→~0.1ms; rAF39033.3→16.7/32016.7→16.7/84433.3→16.7/76833.3→33.3/144050.1→49.9ms. SoftwareWebGL/sequentialfrozenfixture,timerthô; khôngdeviceFPS/coretickbenchmark. Atlastrim từ16MiB xuống4MiB giữpivot/appearance. Chưa Safari/iOS/máythật/naturalfullrun; chờuser.
- Chi tiết/evidence/cách thử: docs/q7c/IMPLEMENTATION.md,README/index,source/PROMPTS,runtime-assets vàruntime/*.json/png. BuildwarningPhaser>500KB cósẵn.
- Deploy: đangchốtpushmain/Pages; khônggọi local/dist làlive. GitHubconnector đọcActions được; ghCLIapi bị403 nên dùngconnector, khôngbypasspolicy.

## PLAYTEST SCOPE
URL sauPages: https://gizgity.github.io/a-new-game/ (reload bảnmới). Chỉart/animationQ7C, khôngđòiduyệtlạibalanceQ2–Q7B.
1. Opening:4hướng/Chém+Bắn giữ,Heavy/Charged giữ-thả,Dash; desktopWASD/chuột/Shift/E/Space. Playernổi,khôngcắt/nhầmhướng/giậtpose,inputcũgiữ.
2. Crowd:maskGrunt/cungArcher/5shardsVolatile phânbiệt;windup/recoveryđọcđượcgiữaRupture/Charged. Volatile nổxongbiếnmất,khôngđứnghồi.
3. Bulwark200kills HOẶC2:30:lõi mở khácgiápđóng. Boss450kills HOẶC4:00:sweep/ring/slam khácpose/telegraph,giữnhịpcũ.
4. Pause/resume/restart khôngstaleghost;chúýđộmượt/nóngmáy dọc/ngang/desktop. Báonhânvật/state/bướcgặplỗi+thiếtbị/browser.

## IMPORTANT CONTEXT / APPROVAL HISTORY
- Q7B5ee970e đãuser “q7b đã đạt”,Pages40292060536SUCCESS; approval78f07e6 cũngPages40295723153SUCCESS. Q7A floor-only0e0a9af/board2e48166accepted. Khôngđòiduyệtlại.
- Q2timing/input/impact,Q3precision/telegraph,Q4relay4ticks/marked-only/budget12+24VFX,Q5effects/draftweighted,Q6cap4Mutation/2Curse giữ. Approvalchi tiết trongPROGRESS/GAME_BRIEF/docs từngcheckpoint, khôngviếtlạithànhQ7C.
- Gameplay1arena/mobile-first/desktop,run5phút,sword+gun,3common+Elite+Boss. No permanentstats/backend/account/multiplayer/newcontent/framework. vi/en qua t(key),codename khôngpublicbrand.
- Q7Bviewport/HUDlanes/floatingjoystick/nearestmobileautoaim+manualoverride/holdrelease/draftlock1s/icon-only2pair+Dash/Surge đãaccepted; khôngsửa ởQ7C.
- Standingauthorization: user cho phépcommit/pushdocs vàtựdeploy sauchecks,khôngforce; workflow .github/workflows/pages.yml,base /a-new-game/. Deploy khônguseracceptance. Bảo toànremote.

## RELEVANT FILES / RUN
AGENTS.md,GAME_BRIEF.md,.agents/skills/handoff/SKILL.md;src/game/ActorPose.ts,ActorArt.ts,EnemySprites.ts,PlayerVisual.ts,EnemyVisual.ts,ArenaScene.ts;public/assets/actors;tools/build-actor-atlas.py;tests/actor-art.test.mjs;docs/q7c/IMPLEMENTATION.md.
`npm run dev`; `npm run build` (typecheck+dist); `npm test`; `npm run preview`. Offlineatlaspacker cầnPillow/numpy/scipy trongworkspace,khôngcần trênCI/runtime.

## NEXT ACTION
Chốtpushmain/Pages vàlink/commit/before-after/checklistuser,ghiAWAITING PLAYTEST APPROVAL rồi dừng. Sau đó chỉ nhậnfeedback/playtestQ7C; khôngtựQ7D hoặc runtimeACCEPTED.
