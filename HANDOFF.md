# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, mobile-first + desktop-equivalent trên browser (điện thoại dọc/ngang, tablet và desktop keyboard/mouse), cùng gameplay depth, combat precision và visual quality, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## IMPROVEMENT GOAL
Đưa prototype từ functional demo thành một action roguelike vertical slice có combat feel thỏa mãn, Fractured Geometry art và các cơ chế tương tác thực sự có chiều sâu.

## ACTIVE TASK
Follow-up mobile ngày2026-10-27: chỉ đưa2light attack Shoot/Melee về kích thước cũ72/76px và thu header thêm44→40px. Acceptance: nút phụ/controls lane giữ nguyên,2light không chồng nhau, icon language/pause/resume còn hoạt động; build/typecheck và browser4viewports, deploy. Không đổi gameplay/Q9A accepted hoặc mở Q9B.

## MOBILE LAYOUT STATUS
- Follow-up mới: counter-scale riêng Shoot/Melee về72/76px trong parent75%, dịch từng nút±10.5screenpx theo chiều dọc để giữ gap11.5px, không chồng nhau; icon light cũng về38px. Bốn nút phụ giữ nguyên bounding rect so9c5666b. Header40px/icon20px/brand24px, lane216px giữ nguyên. PASS build/typecheck và browser320/390/844touch+1440desktop (geometry/nooverflow/pause-locale-resume/CDPhold-release-cancel). Screenshot/checks đã cập nhật, chưa kiểm thiết bị thật; không chạy lại gameplay suite vì chỉ CSS. Đang commit/push/Pages follow-up; số44px và scale cả6nút dưới đây là baseline lượt trước.
- Concept đã duyệt qua “oki, thu nhỏ header ở mobile luôn, chỉ giữ lại icon là được”: `/workspace/generated_images/exec-c2875c60-87ae-42bc-a40f-81db3d3874c1.png`; [prompt/provenance](docs/mobile-layout-concept.md). User bác bản dịch Dash; chỉ scale toàn cụm75%, không chuyển Dash.
- Đã đồng bộ remote main9db8191; giữ toàn bộ Q9A accepted/legacy indicator. Implementation: transform toàn cụm75% giữ offset, Dash45px vẫn dưới Heavy; lane portrait216px/joystick204px, ring78px. Header mobile44px icon-only; language giữ native select44px, pause/resume có aria-label/title vi/en và icon theo phase. Desktop header giữ100px. Portrait arena tăng84px (68controls+16header); landscape header giảm4px, giữ side lanes.
- PASS typecheck/build và20testfiles trên baseline mới. [Runtime screenshots/checks](docs/mobile-layout-runtime/README.md):320×740,390×844,844×390 touch+1440×900 desktop; không overflow/error, đúng scale45px Dash/không lấn Heavy, canvas lane riêng, pause→locale→resume vi/en và CDPmove+shoot hold/release, Heavy/Charged/Dash cancel. Browser fixture dừng loop để đo layout, không là natural run/deviceFPS hay user playtest. Chưa iOS/Safari/thiết bị thật. Vite chunk warning có sẵn.
- Code9c5666b đã push main fast-forward, [Pages40436474411](https://github.com/gizgity/a-new-game/actions/runs/40436474411) completed/SUCCESS. Link chơi https://gizgity.github.io/a-new-game/?v=9c5666b . Approval review push lần đầu từ chối vì thiếu quyền deploy; đã kiểm chứng AGENTS89–90 và lời user trong handoff, reviewer cho phép lần sau. gh API bị Forbidden; xác nhận Pages qua GitHub connector GET. Chưa xác nhận liveHTTP/hash từ môi trường; không giả PASS. Commit bàn giao sau chỉ Markdown, không redeploy.
- **AWAITING USER PLAYTEST APPROVAL — mobile layout**. Scope thử: mobile dọc giữ joystick+Shoot, bấm Dash/Heavy xem có hụt/lẫn, thử icon ngôn ngữ và pause/resume; mong đợi nút tách nhau, arena rộng hơn, không kẹt input. Phản hồi tình huống/thiết bị/browser; chưa tự nghiệm thu trải nghiệm.

## Q9A STATUS
**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “duyệt 9a, nếu cần cân bằng sẽ mở issue mới” ngày2026-10-27 trên code/deploy `1a08448` (bàn giao `49394c0`), Pages40428188955 SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Đây là nghiệm thu trực tiếp của user, không suy từ tests/build/deploy; giữ giới hạn coverage kỹ thuật đã ghi. Nếu cần cân bằng, user sẽ mở issue mới; không tự tune hoặc mở Q9B. DD-0002 Approved — Design Only theo quote user “duyệt dd-0002. bắt đầu triển khai q9a”; DDR append mới, draft Proposed giữ lịch sử. Code1a08448 đã push main fast-forward, Pages40428188955/job121939115034 completed/SUCCESS gồm build/typecheck/upload/Deploy. https://gizgity.github.io/a-new-game/?v=1a08448 . Commit bàn giao tiếp theo chỉMarkdown, không redeploy.
- Đủ6Core/12Branch, root ledger/origin/death dedup, on-kill synergy, lethalAmbush/Nightfall, catalog/RNG/ticket/save allowlist, selection phase/guard/vi-en/HUD text. Không auto-unlock/reward, không production art changes. Giữ tuning hiện tại của bản Q9A đã nghiệm thu; thay đổi cân bằng sau này chờ issue mới của user.
- PASS:20testfiles,25focused elemental cases+72loadout subcases; typecheck/build; selection320/390/844touch+1440desktop; input390CDPtouch/1440keyboard-mouse (Heavy hold/release, movement+Basic, aim,4corners HUD lanes); dist390/1440(two-offer/refresh keeps seed/offers/choice/run count/no unlock). Vite Phaser chunk warning có sẵn. Không suy softwareWebGL/emulation/fixture thành deviceFPS/inputlatency/iOS/Safari/thermal/audio/user acceptance; chưa liveHTTP/hash verification từ môi trường.
- Bảng18fixture links/cách thử/kết quả mong đợi và raw reports tại [docs/q9a/README.md](docs/q9a/README.md). Fixture profile riêng không ghi progression thật; normal pool rỗng không tự có Legacy vì unlock economy thuộc Q9B+. Fire/Ice cần enemy sống qua primary; dùng Elite từ2:05/fallback2:30 hoặcBoss để thấy rõ status/stack.
- User đã nghiệm thu milestone Q9A; không suy thêm thiết bị/browser hoặc full-device coverage mà user chưa cung cấp. Checklist6/12/touch+keyboard-mouse giữ làm reference cho issue sau, không yêu cầu duyệt lại Q9A. Giữ approval Q2–Q8D; không Q9B.

## DEPLOY FOLLOW-UP
User yêu cầu “làm xong deploy luôn nha”. gh workflow dispatch bị Forbidden; rerun40360458461/attempt2 build/typecheck PASS nhưng Deploy fail vì2artifact cùng tên github-pages. Sửa workflow tối thiểu dùng tên artifact theo run_id/run_attempt cho upload và deploy; không thay game/assets. Đã push cf95428 lên main; Pages40364932127/job121719944587 completed/SUCCESS gồm build/typecheck/upload/Deploy. URL https://gizgity.github.io/a-new-game/?v=cf95428 . Livecurl proxy CONNECT403 nên không xác nhận liveHTTP từ môi trường này; không giả thành PASS. Commit bàn giao sau chỉ Markdown, không redeploy.

## LEGACY V1 STATUS
- DDR có2decision: DD-0001 Legacy V1 và DD-0002 Elemental Mechanics Contract, đều Approved — Design Only; ID tiếp theo DD-0003. DD-0001 giữ nguyên, DD-0002 bổ sung theo approval trực tiếp27/10 cho revision09267ed. Snapshot draft giữ nhãn Proposed lịch sử, hiệu lực approval đọc từ DDR.
- Q9A triển khai Core/Branch/RNG/UI trong scope user đã mở lại, đã được user nghiệm thu gameplay ngày2026-10-27; cân bằng tương lai theo issue mới. Victory rewards/unlock economy/Anomaly/Ascension/Cosmetic/fullmigration vẫn Q9B+, không tự triển khai. Chi tiết delivery/coverage tại Q9A STATUS và docs/q9a.

## DESIGN MEMORY STATUS — CHECKPOINT KHỞI TẠO
- Đã tạo DESIGN_DECISIONS.md (0entry, next DD-0001), ART_BIBLE.md, docs/art-reference/README.md và2skills design-decision/game-art; cập nhật AGENTS/handoff skill. Không backfill hoặc phê duyệt artwork/decision mới.
- Fetch phát hiện checkout cũ30e7cdc; fast-forward origin/main bcd148b trước khi audit. Q8C đã accepted7625fa2; không giữ nhầm pending từ checkout cũ. Release v0.1.0 tại4770bf6 là boundary DDR, không dời tag.
- References đủ Player/Enemy/Boss/Environment/UI/VFX, link production source/runtime/prompt/hash/provenance và ảnh arena/HUD/crowd/grayscale thật. Thiếu message permalink gốc, model/seed, raw HUD chat ref, full Enraged4facing, dedicated sheet mọi dynamic VFX và lighting/Arrival swatches có approval riêng; không tự bịa. Coverage device/iOS/Safari giữ giới hạn cũ.
- Validation PASS:98local Markdown links không gãy, DDR0entry/nextDD-0001, hashes Q7A/Q7B/Q7Csource/Q8Csource+Arrival runtime khớp manifests; diff chỉ8Markdown, không runtime/assets/roadmap. Không build/deploy theo task. Commit14b2c42 đã push main fast-forward; remote SHA xác nhận14b2c422859c375b2cedc6e6b9c701e11c5d4621, working tree sạch sau push. Task hoàn tất; commit bàn giao sau chỉ cập nhật dòng này.

## RELEASE STATUS
**HOÀN TẤT — RELEASE v0.1.0**. Đã tạo/push annotated tag `v0.1.0` (tag objectea53dc6), peeled commit `4770bf617f292c407685c4fbed1ebf5d3c6cb84f` khớp bản Q8D đã duyệt. GitHub Release published2026-10-26T16:46:46Z, không draft/prerelease, đặt latest: https://github.com/gizgity/a-new-game/releases/tag/v0.1.0 . Release notes tiếng Việt có scope/approval/link chơi/evidence/giới hạn coverage. Không đổi runtime/package hoặc tái deploy; Pagescbdb131 giữ nguyên. Commit bàn giao release sau tag chỉMarkdown, không dời tag sang commit mới.

## ACCEPTANCE / CURRENT STATUS
**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “duyệt 9a, nếu cần cân bằng sẽ mở issue mới” ngày2026-10-27 trên code/deploy `1a08448` (bàn giao `49394c0`), Pages40428188955 SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Đây là nghiệm thu trực tiếp của user, không suy từ tests/build/deploy; giữ giới hạn coverage kỹ thuật đã ghi. Nếu cần cân bằng, user sẽ mở issue mới; không tự tune hoặc mở Q9B.

## BASELINE ACCEPTANCE — Q8D (LỊCH SỬ)
**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “q8d đạt” ngày2026-10-26 trên bản deploy `cbdb131` (handoff `4791b27`), Pages40360458461 SUCCESS. Đây là approval trực tiếp của user, không suy ra từ bot/tests/build/deploy. Giữ baseline và lịch sử approval Q2–Q8C, cùng giới hạn coverage kỹ thuật. Dừng, không mở Q9.

Đã đo4hướng/build thường và synergy2Curse, hai cadence/policy; không grantsHP/kills/clock/build trong run (offers điều khiển).32ô,20trajectory khác nhau; không suy ra winrate/human balance. Density/killrate/6Draft/Elite/Boss/run/HP/damage/TTK/result/rawtimeline tại [Q8D](docs/q8d/README.md).
- Không đổi runtime: chưa có evidence tune vượt ảnh hưởngbot. Ranged pursuit thua nhưng orbit thắng; Curse thứ2 không luôn mạnh hơn. Fast role-aware8lượt thắng228–239.82s, Boss5.52–13.45s; moderateCounterthường thuaBoss, thêmParasitic thắng. Mean13–21/peak30, không quá30 trong mẫu; trống chủ yếuopening. Victory4:30–5:00 vẫn mục tiêu mềmQ8B.
- Giữ Q8A dynamic spawn, Q8B floors/fallbacks, Q8C warning2s/Enraged1.4s world freeze/HP1500/combo, Q2–Q8C builds/input/art và5:00.
- Tests18files/typecheck/build PASS, warningPhaser>500KB có sẵn. Browser4sizes + freeze390/1440 + Arrival/crowd24 + lifecycle6Draft/deadline/Replay + dist390/1440 PASS; không gọi device/iOS/Safari/thermal/audio acceptance.
- Đã push main fast-forward `cbdb131`; Pages40360458461/job121704168388 completed/SUCCESS gồm Deploy. https://gizgity.github.io/a-new-game/?v=cbdb131 . LiveHTTP5resources200/SHA256 khớp tested dist; không thay deviceplaytest. Commit bàn giao sau chỉMarkdown. Không mở Q9.

## DECISIONS / APPROVAL CONTEXT
- Q8A394341c “q8a đạt yêu cầu”; Q8Beb6fbbe “oki duyệt q8b”, user cho thắng sớm; Q8C8cbff77 “q8c đạt”, Pages40357489627 SUCCESS/handoff8e70df3, approval commit7625fa2.
- Q8C transform0.8s/vulnerability đã SUPERSEDED bởi1.4s/84ticks dừng toànworld/run (1302474); warningGraphics5px superseded ArrivalV2 asset/4beat (8cbff77). Không đòi duyệt lại.
- Q8A/B/C spec, oldevidence/giới hạn vàsource/license giữ tại docs/q8a,b,c; bảng approval dưới giữ nguyên. Q8D không thêm superseded thông số nào.
- Bot đọc Perfect predicate/aim chính xác, không đại diện độ khó người chơi. CPUdraw softwareWebGL không là deviceFPS. Các screenshot/boundary fixtures có grants phải ghi rõ.

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
| Q8C — Boss Challenge & Enraged / ArrivalV2 | ACCEPTED — USER PLAYTEST APPROVAL | User “q8c đạt” trên8cbff77; Pages40357489627 SUCCESS; giữ coverage kỹ thuật |
| Q8B — Run Pacing & Milestone Balance | ACCEPTED — USER PLAYTEST APPROVAL | User “oki duyệt q8b” ngày2026-10-26 trêneb6fbbe; Pages40341327061 SUCCESS; Victory là mục tiêu mềm |
| Q8D — Balance Validation & Final Tuning | ACCEPTED — USER PLAYTEST APPROVAL | User “q8d đạt” trên cbdb131, handoff4791b27; Pages40360458461 SUCCESS; không Q9 |
| Q9A — Elemental Legacy Core | ACCEPTED — USER PLAYTEST APPROVAL | User “duyệt 9a, nếu cần cân bằng sẽ mở issue mới” ngày2026-10-27 trên1a08448; Pages40428188955 SUCCESS; balance theo issue mới, không Q9B |

## NEXT ACTION
Chờ user thử layout mobile9c5666b theo scope ở trên; chỉ xử lý feedback được giao. Q9A vẫn accepted, balance theo issue mới; không tự tune hoặc mở Q9B/checkpoint tiếp theo.

## VALIDATION APPROVAL Q9A
Chỉ sửa4Markdown (HANDOFF, AGENTS, GAME_BRIEF, docs/q9a/README), kiểm nguồn/version/consistency/links/diff; không đổi runtime/DDR/balance/artwork, không tests/build/deploy. Kết quả kỹ thuật và Pages1a08448 giữ nguyên.

## VALIDATION LƯỢT APPROVAL Q8D (LỊCH SỬ)
Chỉ đồng bộ Markdown sau xác nhận “q8d đạt”; kiểm diff/tính nhất quán, không đổi runtime hoặc chạy lại tests/build/deploy. Kết quả kỹ thuật và Pages của cbdb131 giữ nguyên.

## VALIDATION RELEASE
`git ls-remote` xác nhận annotated tag/peeledSHA; `gh release view` xác nhận published/non-draft/non-prerelease. Diff runtime so4770bf6 rỗng, chỉ sửa Markdown bàn giao; không chạy lại tests/build. Lịch sử checks/Pages và user approval Q8D giữ nguyên.
