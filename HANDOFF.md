# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first trên browser (điện thoại dọc/ngang, tablet), vẫn chơi được trên desktop, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Q8C — Boss Arrival Ambient: **AWAITING USER PLAYTEST APPROVAL**; phần Boss/Enraged được user nhận xét “boss ổn r”, không yêu cầu duyệt lại phần đó. Toàn Q8C chưa tự ACCEPTED. User giao riêng ngày2026-10-26, baseline main `e6eeec7`. Q8A394341c/Q8Beb6fbbe đã ACCEPTED; giữ Q2–Q7D; không mở Q8D.

## ACCEPTANCE
Warning viền4nhịp/2s, pause spawn không pause input; Boss sau warning. Enraged một lần tại≤50%HP, transform1.4s/pose ImageGen riêng, chỉ speed+15% và cooldown−20%, không heal/HP1500/deadline5:00. Combo slam→gap0.25→locked sweep0.62→recovery0.75, geometry/Perfect đúng. Giữ Q8A/Q8B và art/build/input ngoài Boss scope. Tests/build/deploy không là acceptance; chờ user playtest.

## CURRENT STATUS — Q8C
- User “ok, làm đi” duyệt boardV2 + audio sketch. Đã tích hợp texture edge riêng ImageGen (không crop mockup),4TileSprite pooled dưới telegraph/body, halo10/14screenpx chỉ vào trong arena;4beat âm trầm/xích tăng dần đọc cùng warning clock.18testfiles/build PASS, browser390/1440/320/844 PASS4audio beats/Pause/mute/volume/Replay/khôngoverflow hoặc errors. CPUdraw p950.1–0.3ms/crowd24 softwareWebGL. Dist390/1440 PASS. Code/deploy `8cbff77801553481df4c84e764a7485d13d0c38b` đã publish main fast-forward qua GitHub connector (Git CLI thiếu xác thực), tree SHA khớp index đã test. Pages40357489627/job121693735446 completed/SUCCESS gồm Deploy. Link https://gizgity.github.io/a-new-game/?playtest=boss&v=8cbff77 . Report/ảnh trước-sau tại docs/q8c/arrival-runtime; livecurl trước bịproxy CONNECT403, không giả localdist là live.
- User thấy warning viền đỏ thiếu ambient/thu hút và yêu cầu approve trước làm. Đã duyệt hướng “áp lực phong ấn sắp vỡ” qua “ok, ổn”: mockup trước, duyệt rồi tích hợp. Chỉ tạo ImageGen review boardV2 và WAV2s/4nhịp tại docs/q8c/arrival-concept; V1 plates góc lấn sân nên superseded. Snapshot concept trước tích hợp; nay user đã duyệt cụ thể bằng “ok, làm đi”, xem trạng thái implementation phía trên. Giữ Boss/Enraged1302474 đã được user nói ổn, không tự accepted toàn Q8C hoặc mở Q8D.
- Feedback mới: user khó thấy Enraged0.8s, yêu cầu chậm hơn + dừng timer/quái/player. Đã đổi1.4s/84ticks, asset pose sine nâng/phồng chậm; chỉ transform/flash clock tiến, toàn world/run/inputbuffer freeze; Pause freeze cả transform. Tests17files/build và browser390/1440 giữD/Pause/Resume PASS; report docs/q8c/evidence/enrage-freeze.json. Correction code/deploy `1302474`, Pages40352171221/job121674876464 completed/SUCCESS gồm Deploy; link https://gizgity.github.io/a-new-game/?playtest=boss&v=1302474 ; không tự ACCEPTED/Q8D. Bản0.8s/vulnerability dưới là lịch sử.
- User yêu cầu instance nhanh1150kills/buildsẵn sau bàn giao. Đã thêm `?playtest=boss`:3:40,1150kills,4Mutation Phantom/Static/Reclaimer/Kinetic +2Curse Ghost/Parasitic; thêm50kills hoặc fallback4:00→warning→Boss, Replay giữ preset, không lưu progression/không đổi run thường. Tests17files/build PASS; browser390/1440 PASS (1150kills/4Mutation/2Curse, Pause/Replay/fallbackBoss/run thường0kills); code/deploy `eb522df`, Pages40350368400/job121668460085 completed/SUCCESS gồm Deploy. Link https://gizgity.github.io/a-new-game/?playtest=boss&v=eb522df .
- Runtime và asset đã triển khai; spec/audit/evidence/source/license/cách thử tại [docs/q8c/README.md](docs/q8c/README.md). Snapshot cũ dưới là lịch sử accepted Q8B, spawn tức thì và phase2 predicate/timing cũ được Q8C thay thế.
- `npm test`17files PASS,6focused mới; build/typecheck PASS (warning Phaser bundle có sẵn). Warning/reset/death/deadline/transform/flash/locked combo/recovery/Perfect/speed được kiểm. Browser4sizes1440/390/844/320 và dist390/1440 PASS,0errors/overflow,displayList29. CPUdraw median0–0.1ms/p950.2–1.4ms (softwareWebGL/frozen fixture, không deviceFPS). Chưa có user/device/Safari/iOS acceptance.
-4route×2styles combat thật: Tank/Sustain/Counter thắng6lượt với phase2; Ranged chết trước Boss như Q8B. Encounter riêng cấp fullbuild cả4vào phase2 và thắng; không grant HP refresh. Bot dùng Perfect predicate; không là human difficulty approval hoặc Q8D.
- ImageGen production transform pose riêng; giữ atlas/floor Q7C. Combat phase2 dùng4facings/patterns cũ tint ember, pose mới chỉ transform; không Graphics body. Gate artwork lịch sử không chặn user đã giao Q8C triển khai→test→deploy, không tự visual approved.
- Code/deploy `11bedbfbc2b88792ec8c284f311607e2dc9e9992` đã push main fast-forward. [Pages40347916413](https://github.com/gizgity/a-new-game/actions/runs/40347916413) completed/SUCCESS; job121659711323 gồm Deploy SUCCESS. URL https://gizgity.github.io/a-new-game/?v=11bedbf . Live curl bịproxy CONNECT403, không bypass; production dist local đã PASS. Ảnh trước/sau Phase1→transform→follow-up tại docs/q8c/evidence, README có links4sizes. Commit bàn giao sau chỉMarkdown, không đổi runtime.
- Playtest: dùng run thường hoặc `?playtest=route-tank|route-sustain|route-counter|route-ranged`; trigger3:40 với1200kills/fallback4:00 rồi warning2s. Kiểm input/pause trong warning, halfHP transform một lần, slam→follow-up né sector/Perfect→Heavy phản công; mobile dọc/ngang/desktop, Replay sạch. Báo bước + quan sát + thiết bị/browser. Không yêu cầu duyệt lại Q8A–B/Q7.

## PREVIOUS CHECKPOINT — Q8B ACCEPTED
- Code/deployeb6fbbe đã push main fast-forward. Pages40341327061/job121636501339 completed/SUCCESS gồm Deploy; URL https://gizgity.github.io/a-new-game/?v=eb6fbbe . Production dist local390/1440 Start/HUD/errors/overflow PASS; livecurl bịproxy CONNECT403. Browser fixtures1440/390 pause/6Draft/freeze/Boss floor/Victory-Replay/deadline-Replay PASS. [Audit/cách thử4route](docs/q8b/README.md).
- Công thức: elapsed≥minSeconds AND (kills≥target OR elapsed≥fallback). Draft floors20/50/85/120/155/190s, fallback30/60/100/140/180/205s; kills25/80/160/220/300/380. Elite200kills từ125s/fallback150s. Boss1200kills từ220s/fallback240s. Full build có15–50s trước Boss; clear nhanh không bỏ qua run.
- Chỉ sửa config milestones, predicate reached và HUD vi/en hiển thị floor/fallback. Giữ spawn Q8A, combat, growth, Boss patterns và assets. Không warning2s/Enraged Q8C.
- A/B4routes×2styles: combat/HP/resources thật, route offers deterministic, không cấp kills/clock/HP/build. Baseline Boss86.7–89.25s, Victory92.8–100.97s; Q8B Tank/Sustain/Counter Boss220s, Victory225.87–233.02s,1205–1261kills; Ranged chết157.95–178.05s/889–1002kills. Bot đọc predicate Perfect nên không đại diện người chơi.
- **Giới hạn:** Victory4:30–5:00 chưa đạt trong các lượt bot thắng; Boss chỉ sống5–13s. User đã chọn “Giữ mục tiêu mềm; cho phép thắng sớm” ngày2026-10-26. Giữ Victory ngay khi hạ Boss trước deadline, không khóa/delay hoặc thay Boss. Quyết định mục tiêu mềm riêng biệt; user sau đó đã xác nhận “oki duyệt q8b”. Giữ giới hạn coverage kỹ thuật của evidence.
- Focused tests16files PASS (thêm floor/banked-chain/draft freeze/replay; sửa fixtures mốc cũ), typecheck/build PASS; warning Phaser bundle có sẵn. Browser lifecycle desktop/mobile fixtures và deploy xem docs/q8b/README.md.
- Q8B OR cũ được đánh dấu SUPERSEDED trong GAME_BRIEF/docs liên quan, giữ lịch sử approval/evidence.

## PREVIOUS CHECKPOINT — Q8A ACCEPTED
- Baseline main7b01864 đã fetch/đối chiếu. RunDirector trước đây pack3/90ticks đầu run, soft cap18; kill reset pressure nên build mạnh thiếu quái, không kill lại không trần.
- Q8A EMA6s; sau15s bonus=max(0,rate−1), interval cơ sở/(1+bonus) sàn24ticks, soft cap18–30. Pack≤3; pressure4s hard cap48. Không xóa survivors/nerf builds/đổi milestones/Boss/art/input. Hitstop/draft/pause freeze spawn/adaptation; reset sạch.
- Tests16files PASS (4focused mới); typecheck/build PASS, warning bundle Phaser có sẵn. Safety1080vị trí/góc spawn≥220px PASS, giữ thuật toán hiện có.
- A/B density fixture60s, cùng pursuit bot, full build cấp đầu run, HP giữ mỗi tick, bỏ draft (không natural run/Q8D). Đo sau15s: baseline→Q8A normal empty16.7→0s, mean1.49→13.84; fast-chain empty26.07→0.13s, mean1.13→12.43. Kills124→284/285; lịch sử Q8A khi Q8B chưa mở; milestones này nay SUPERSEDED bởi Q8B.
- Browser desktop1440/mobile390: input smoke, pause freeze, crowd fixture48, vi/en/production checks/evidence tại docs/q8a. Software WebGL không chứng minh deviceFPS; user cần đánh giá áp lực/readability/nóng máy. Không yêu cầu duyệt lại Q7.
- Code/deploy394341c đã push main fast-forward; Pages40338795004/job121627451358 completed/SUCCESS gồm Deploy. Livecurl bị proxy CONNECT403; production smoke là local/dist. URL https://gizgity.github.io/a-new-game/?v=394341c . **ACCEPTED — USER PLAYTEST APPROVAL** theo xác nhận trực tiếp của user “q8a đạt yêu cầu”; giữ giới hạn coverage kỹ thuật. [Spec/checklist/evidence](docs/q8a/README.md).

## PROGRESS
M0–M6 là functional implementation, không phải chứng nhận chất lượng toàn MVP.

| Checkpoint | Trạng thái | Còn thiếu |
| --- | --- | --- |
| Mobile-first | Nền tảng triển khai; UX Q7B ACCEPTED | Giới hạn coverage device/iOS/Safari kỹ thuật giữ, không đòi duyệt lại Q7B |
| Q1 — Player art/animation/readability | HISTORICAL — artwork được Q7C thay thế | Artwork được thay bằng Q7C đã user accepted; giữ lịch sử Q1 |
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
| Q7C — Character & Enemy Art | ACCEPTED — USER PLAYTEST APPROVAL | User “duyệt q7c đạt” trên deploy2ef6d48; visual approved trước đó |
| Q7D — Full Run Experience Polish | ACCEPTED — USER PLAYTEST APPROVAL | User “đã đạt q7d” ngày2026-10-26 trên66e0799; Pages40311723418 SUCCESS |
| Q8A — Dynamic Spawn | ACCEPTED — USER PLAYTEST APPROVAL | User “q8a đạt yêu cầu” ngày2026-10-26 trên394341c; Pages40338795004 SUCCESS |
| Q8C — Boss Challenge & Enraged | AWAITING USER PLAYTEST APPROVAL | Chờ cảm nhận difficulty/readability/controls trên thiết bị thật |
| Q8B — Run Pacing & Milestone Balance | ACCEPTED — USER PLAYTEST APPROVAL | User “oki duyệt q8b” ngày2026-10-26 trêneb6fbbe; Pages40341327061 SUCCESS; Victory là mục tiêu mềm |

## PREVIOUS CHECKPOINT — Q7D ACCEPTED
- User xác nhận “đã đạt q7d” ngày2026-10-26 trên bản66e0799 đã deploy. Các giới hạn coverage kỹ thuật bên dưới giữ nguyên; không yêu cầu duyệt lại Q7D.
- Ba ưu tiên đã triển khai: cue chuyển mốc, result cleanup, panel/Replay continuity. Code `66e0799c65d1940692b94d9da8ac79f14550ca20` đã push main fast-forward; không đổi core/config/run/draft/input/AI/effects/balance/assets. Không artwork/content/dependency/QA infrastructure mới.
- Desktop input thật đủ6draft/Elite/Boss → Victory199.42s,458kills,39HP → Replay → naturalDefeat9.95s → Replay. Mobile390×844 CDP multitouch đủ6draft/Elite/Boss → Victory194.12s,458kills,85HP → Replay → naturalDefeat9.95s → Replay. Bot đọc state/predicate Perfect, không grants/clock overrides, không thay human acceptance.
- Build/typecheck và npmtest15files/163definitions PASS. Edge fixtures5sizes320/390/844/768/1440: pause freeze, audio settings, vi/en, draft grace, Victory freeze/death fade, deadline/Replay8cycles PASS; display list29, không overflow/errors. Fixture cấp kills/Boss slain/ticks17999 ghi rõ trong evidence, không natural run.
- Production dist5sizes assets/base/Start/Pause/vi-en/Resume PASS sau CSS cuối. WebAudio buffers/cue/stop/mute/volume PASS; chờ audio quantum60ms khi đọc gain. Không thay audio runtime vì assertion timing của harness. Scripts multitouch ban đầu lỗi phase race/TouchEnd dư đã sửa; chỉ lượt hoàn tất được tính PASS.
- rAF desktop median16.7ms/p9566.6ms; mobile16.7/16.8ms. Chromium software WebGL, desktop chạy đồng thời checks; không deviceFPS hoặc benchmark A/B. Chưa nghe âm/Safari/iOS/nhiệt máy/tầm với máy thật.
- Pages run40311723418/job121534293554 completed/SUCCESS, gồm bước Deploy. Live curl bị proxy CONNECT403; không bypass hoặc giả local/dist là live. URL bản code: https://gizgity.github.io/a-new-game/?v=66e0799 . Evidence/checklist tại docs/q7d/README.md.

## PREVIOUS CHECKPOINT — Q7C ACCEPTED
- User xác nhận “duyệt q7c đạt” ngày2026-10-26 trên bản đã deploy2ef6d48 (code0041064, docs5f3e938), Pages40305977315 SUCCESS. Đây là user playtest approval, không suy ra từ build/tests/fixture.
- Review7a1db73/research2bb4792; đãmergeorigin/main87c1ca8 trong3c940dd và ghiapproval. Sourceproduction mới riêng bằngImageGen,4facings×7states/6actors +Player8actions/Boss9patternposes/hướng;236frames. Khôngcropconceptboard. AtlasPNG1024square/990873bytes/4MiBdecoded;provenance/sourceprompt/hash tại docs/q7c/runtime-assets.json vàsource/.
- ActorPose/ActorArt/EnemySprites +PlayerVisual; bodies dùngImages/pooledassets, khôngGraphicsbody. Táchground/body/statusVFX để giữlayering. Telegraph vàdrawSlash bytewise; core/gameplay/config/AI/controls/HUD/style/i18n/floor/workflow khôngdiff. OldSVG giữlịch sử. Khôngnewgamedep/framework.
- Animationtheosimulation,4bodyfacings khôngxoayphẳng360°; aim/projectile/VFX liên tục theo inputcũ. Walk2pose/bob,windup lấyđà,attack/recovery/shot/dash/hit/deathsourceposes. Enemydeathpool8/0.28s chỉhp≤0,Playerdash6echo/0.22s,cadence0.033s; reset/pause/hitstopfreeze. Khônggiữcollider/target/rewardqua deathvisual. Volatilekhônglivingrecovery; Bosshit khôngstagger.
- Build/typecheck PASS;163testsPASS/0fail (159baseline+4focused). Renderer5sizes320/390/844/768/1440,crowd33/actualtelegraph+Charged/Boss3/grayscale,noerrors/requests/overflow PASS. Before/after freeze đúngPhaser sys.sceneUpdate, khôngnaturalrun. Initial harness overrideinstance.update sai đãchụplạitoànbộ.
- Browserinput CDPtouchmove+shoot390/844,mouse/WASD1440,Pause/vi-en/resumePASS;20resetdisplaylist29→29,ghost/deathclear. Dist5sizesatlasload/Heavyhold2/2→release1/2/Pause/locale/resume/noerrorPASS. Corner390/1440 xem runtime/corners.json. Fixtures khôngdeviceapproval.
- PerfCPUdrawmedian0.3–0.4→~0.1ms; rAF39033.3→16.7/32016.7→16.7/84433.3→16.7/76833.3→33.3/144050.1→49.9ms. SoftwareWebGL/sequentialfrozenfixture,timerthô; khôngdeviceFPS/coretickbenchmark. Atlastrim từ16MiB xuống4MiB giữpivot/appearance. Giới hạn coverage kỹ thuật Safari/iOS/thiết bị thật/natural full-run giữ nguyên; user nay đã accepted Q7C, không yêu cầu duyệt lại.
- Chi tiết/evidence/cách thử: docs/q7c/IMPLEMENTATION.md,README/index,source/PROMPTS,runtime-assets vàruntime/*.json/png. BuildwarningPhaser>500KB cósẵn.
- Deploy: Code0041064, bản deploy2ef6d48180b4873198dd666627771296f4b4837b; [Pages40305977315](https://github.com/gizgity/a-new-game/actions/runs/40305977315), job121515051426 completed/success gồm bướcDeploy. URL https://gizgity.github.io/a-new-game/?v=2ef6d48 . Livecurl bịproxy CONNECT403 (HTTP000), không giả local/dist làlive. Không đổi runtime saudeploy; commitbàn giao chỉMarkdown. GitHubconnector đọcActions được; ghCLIapi bị403 nên dùngconnector, khôngbypasspolicy.

## PLAYTEST SCOPE — ĐÃ USER ACCEPTED, GIỮ THAM CHIẾU
URL: https://gizgity.github.io/a-new-game/?v=2ef6d48 (reload bảnmới). Chỉart/animationQ7C, khôngđòiduyệtlạibalanceQ2–Q7B.
1. Opening:4hướng/Chém+Bắn giữ,Heavy/Charged giữ-thả,Dash; desktopWASD/chuột/Shift/E/Space. Playernổi,khôngcắt/nhầmhướng/giậtpose,inputcũgiữ.
2. Crowd:maskGrunt/cungArcher/5shardsVolatile phânbiệt;windup/recoveryđọcđượcgiữaRupture/Charged. Volatile nổxongbiếnmất,khôngđứnghồi.
3. Lịch sử Q7C (milestones OR cũ SUPERSEDED bởi Q8B): Bulwark200kills HOẶC2:30:lõi mở khácgiápđóng. Boss450kills HOẶC4:00:sweep/ring/slam khácpose/telegraph,giữnhịpcũ.
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
Dừng AWAITING USER PLAYTEST APPROVAL cho ArrivalV2/âm cảnh báo trên8cbff77. User thử preset1150kills/buildsẵn, thêm50kills hoặc fallback4:00→warning2s; kiểm sức hút viền rạn4nhịp/âm trầm+xích, input/telegraph/Pause/mute/volume trên phone dọc-ngang/desktop theo docs/q8c/arrival-runtime/README.md. Không yêu cầu duyệt lại Boss/Enraged đã ổn, không tự ACCEPTED toànQ8C hoặc mở Q8D.
