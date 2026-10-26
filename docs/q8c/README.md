> Feedback user sau preset: transform0.8s và vulnerability ở bản11bedbf/eb522df đã SUPERSEDED bởi transform1.4s với world/timer freeze. Ảnh/report cũ giữ lịch sử; bằng chứng mới ở mục dưới.

# Q8C — Boss Challenge & Enraged Phase

**AWAITING USER PLAYTEST APPROVAL**. User giao triển khai/test/deploy ngày2026-10-26; không tự ACCEPTED, không mở Q8D. Audit main `e6eeec7`: Q8A394341c và Q8Beb6fbbe đã user accepted, Q2–Q7D giữ. Đã đọc AGENTS, handoff skill, GAME_BRIEF và HANDOFF mới nhất trước sửa.

## Specification hiện hành

- Giữ HP Boss1500, deadline5:00, mọi6draft/Elite/Boss floors và fallback Q8B, dynamic supply Q8A, damage/resources/build/input/atlas/floor đã duyệt. Q8B trigger1200kills từ3:40 hoặc fallback4:00 nay **bắt đầu warning**, không spawn ngay. Boss spawn sau2s simulation không hitstop (bot thực tế3:42.4–3:42.57). Không khóa hoặc trì hoãn Victory khi hạ Boss.
- Warning chỉ stroke5worldpx ở biên phần arena đang thấy,4nhịp/2s, không fill đỏ màn hình, không che telegraph. Spawn thường dừng, input/combat/crowd cũ tiếp tục. Không bank spawn debt; cleanup common/projectiles như Q8B khi Boss xuất hiện, giữ Elite còn sống. Pause/draft/hitstop freeze warning; death/deadline hủy warning; Replay reset.
- Phase1 giữ3đòn sweep/ring/slam. Phase2 latch **≤50%HP**, transform1.4s, dừng AI/đòn đang chuẩn bị an toàn, đóng băng player/quái/đạn/damage/cooldown và timer run; chỉ clock transform chạy, không hồi HP/không tăng maxHP. Pose production ImageGen riêng đồng bộ Q7C; transform quay mặt trước có chủ đích. Combat phase2 giữ4facings/3patterns Q7C với ember tint nhẹ; không thay body bằng Graphics. Flash hit vẫn fade trong transform, không phủ trắng sprite suốt1.4s.
- Chỉ tăng2chỉ số: chase300→345(+15%); cooldown0.55→0.44(−20%). Windup0.62, recovery cơ bản0.32, damage26/28, sweep range230/arc1.7, slam radius110, ring15shots/speed430 giữ. Timing enraged cũ0.46/0.24/0.38 được thay bằng contract này, không tăng toàn bộ stats.
- Combo mới phase2: **slam → stationary gap0.25s → sweep khóa hướng về player tại đầu follow-up → telegraph0.62s → stationary recovery0.75s**. Không tracking sau khóa; có thể đi ra sector, dash/Perfect hoặc giữ khoảng cách; counter được sau sweep. Không thêm đạn. Telegraph và Perfect dùng đúng sweep geometry hiện có; damage chỉ resolve một lần.

## Validation và giới hạn

- `npm test`:17files PASS/0fail, gồm6focused Q8C cho warning/input/no-spawn/freeze/reset/death/deadline, threshold chính xác, không heal, world/timer freeze, flash, speed, combo lock/recovery/geometry/Perfect. Cập nhật fixtures cũ giả định spawn tức thì/HP-predicate phase2. `npm run build`:typecheck+Vite PASS, warning bundle Phaser>500KB có sẵn.
- [Browser4sizes](evidence/browser.json):1440×1000/390×844/844×390/320×740, warning Pause/resume, spawn sau warning, actual renderer Phase1/transform/follow-up, vi/en, Replay reset, errors/overflow và100draw samples. Screenshot fixtures cấp clock/kills/HP/position và freeze simulation rõ ràng, không natural run. Test harness sai restore Phaser ban đầu đã sửa; run bị HMR do đang sửa code không tính PASS. Chỉ report cuối là kết quả.
- [Production dist](evidence/dist.json):390/1440 Start/Pause/vi-en/Resume, assetPNG200, không request lỗi/JS error/overflow. Dist local không giả là live Pages.
- [4routes×2styles](evidence/routes.json): route offers deterministic, combat/HP/resources thật, không grant kills/clock/HP/build. Tank/Sustain/Counter6lượt thắng3:47.92–3:57.17, vào phase2; Ranged2lượt chết2:37.95–2:58.05 trước Boss như Q8B. Bot pursuit/Perfect đọc predicate, không đại diện người chơi. Victory4:30–5:00 vẫn mục tiêu mềm theo quyết định Q8B, không ép chờ/nerf build.
- [4Boss encounters](evidence/encounters.json): full builds cấp đầu encounter, Boss1500HP/real resource/no HP refresh. Cả4vào phase2 và thắng, HP còn59–100/Perfect2–3; Tank burst hạ trước combo,3route còn lại thấy combo. Không biến fixture thành natural full run hoặc acceptance.
- Chromium software WebGL; draw timing report chỉ CPU draw, không deviceFPS, không kết luận iOS/Safari/nhiệt máy/độ dễ đọc hoặc cảm giác né trên thiết bị thật. Chưa nghe cue trên máy thật. Không triển khai QA framework/dependency runtime mới hay Q8D.

## Ảnh renderer thật trước/sau Enraged

Cùng scene/position fixture: “trước” = Phase1/Q7C appearance giữ nguyên; “sau” = transform/Phase2 Q8C. Không gọi đây là natural-run video hoặc A/B baseline timing.

| Kích thước | Trước Phase1 | Transform mới | Follow-up Phase2 | Warning |
| --- | --- | --- | --- | --- |
| Desktop1440 | [Ảnh](evidence/phase1-1440.png) | [Ảnh](evidence/transform-1440.png) | [Ảnh](evidence/followup-1440.png) | [Ảnh](evidence/warning-1440.png) |
| Phone390 | [Ảnh](evidence/phase1-390.png) | [Ảnh](evidence/transform-390.png) | [Ảnh](evidence/followup-390.png) | [Ảnh](evidence/warning-390.png) |
| Landscape844 | [Ảnh](evidence/phase1-844.png) | [Ảnh](evidence/transform-844.png) | [Ảnh](evidence/followup-844.png) | [Ảnh](evidence/warning-844.png) |
| Phone320 | [Ảnh](evidence/phase1-320.png) | [Ảnh](evidence/transform-320.png) | [Ảnh](evidence/followup-320.png) | [Ảnh](evidence/warning-320.png) |

[Source/prompt/quyền/giới hạn](source/PROMPTS.md), [hash/packer](source/asset.json). Source không phải concept board, atlas Q7C không sửa. Browser scripts dùng playwright-core tạm trong/tmp, không game dependency.

## Playtest chỉ Q8C

1. Reload bản deploy mới. Run thường hoặc `?playtest=route-tank`, `route-sustain`, `route-counter`, `route-ranged` (route chỉ hướng draft, không cấp full build). Boss trigger3:40 nếu≥1200kills, fallback4:00; sau warning2s mới xuất hiện. Trong warning thử di chuyển/chém/bắn, Pause rồi Resume:4nhịp viền, không overlay đỏ, không spawn pack mới, không mất input.
2. Đưa Boss xuống nửa thanh HP: pose gồng Enraged khoảng1.4s đúng một lần, không heal/teleport, sprite vẫn rõ. Sau đó Boss chạy nhanh hơn vừa phải; giữ timing né đọc được.
3. Phase2 đợi slam: né vòng landing, đọc sector follow-up mới rồi bước khỏi sector hoặc Dash sát hit để Perfect; sau sweep áp sát Heavy/Charged trong recovery0.75s. DesktopWASD/chuột/Space; mobile joystick/các nút giữ-thả hiện có. Đạt nếu không có hit ngoài cue hoặc follow-up không có thời gian né.
4. Chú ý cả Tank/Sustain/Counter/Ranged, portrait/landscape/desktop; Pause/Replay không giữ viền/pose cũ, combat không giật hoặc che cue. Không cần duyệt lại Q7. Báo bước/tình huống, điều quan sát và thiết bị/browser; approval chỉ khi user xác nhận.

## Deploy

Code/deploy [`11bedbf`](https://github.com/gizgity/a-new-game/commit/11bedbfbc2b88792ec8c284f311607e2dc9e9992), push main fast-forward. [Pages40347916413](https://github.com/gizgity/a-new-game/actions/runs/40347916413) completed/SUCCESS, job121659711323 gồm Deploy SUCCESS. [Chơi Q8C](https://gizgity.github.io/a-new-game/?v=11bedbf). Livecurl qua proxy bị CONNECT403; không bypass hoặc giả local dist là live. Commit bàn giao sau chỉMarkdown; không đổi runtime sau deploy. Dừng AWAITING USER PLAYTEST APPROVAL, không Q8D.

## Preset Boss nhanh — user yêu cầu sau bàn giao

URL `?playtest=boss`: bắt đầu1150kills,3:40, bỏ6draft/Elite đã qua, spawn7common theo growth hiện tại. Build có sẵn4Mutation: Phantom Edge, Static Riposte, Blood Reclaimer, Kinetic Battery;2Curse: Ghost Step, Parasitic Mark. HP/resource theo reset bình thường; không bất tử hoặc tăng damage riêng. Hạ thêm50quái→warning2s→Boss, hoặc fallback4:00. Giữ toàn bộ Q8C/BossHP/deadline. Pause/resume không cấp lại; Replay khởi tạo lại preset. Dùng cơ chế trial hiện có để không lưu progression/unlocks/draft history; URL run thường và các trial cũ giữ nguyên. Đây là fixture có grants, không là natural-run evidence hoặc Q8D.

Tests17files/build PASS, thêm focused shortcut threshold/reset. Browser390/1440 kiểm initial1150kills/4Mutation/2Curse, pause/resume, fallbackwarning→Boss, Replay preset và run thường0kills/no build: [report](evidence/boss-preset.json). Clock chỉ cấp tới4:00 trong bước kiểm fallback; initial/Replay đi qua UI thật.

Preset đã deploy code `eb522df`: [Mở1150kills + build](https://gizgity.github.io/a-new-game/?playtest=boss&v=eb522df). [Pages40350368400](https://github.com/gizgity/a-new-game/actions/runs/40350368400) /job121668460085 completed/SUCCESS gồm Deploy. Q8C vẫn AWAITING USER PLAYTEST APPROVAL.

## Feedback: Enraged chậm và dừng thế giới

User nhận xét0.8s khó thấy, yêu cầu animation chậm hơn và ngừng timer/quái/player. Hiện hành:1.4s (84fixedticks), pose asset được nâng/phồng nhẹ theo một nhịp sine chậm, không art mới/không đổi collider. Chỉ transform clock/flash fade thay đổi. Player/Boss/common positions/aim, projectile/explosion/hitbox, AI/damage/build/resources/cooldown và RunDirector ticks/spawn/adaptation đều freeze. Camera/reticle không điều khiển aim khi freeze. Pause còn freeze cả transform; Resume chạy nốt, Replay reset. Lần bấm rồi thả trong freeze được tiêu, không bank đòn; giữ movement/basic sẽ tiếp tục theo input khi combat trở lại. Không hồi HP, vẫn đúng50%/một lần, stats/pattern/HP/deadline giữ; timer được trừ đúng1.4s nghỉ như user yêu cầu.

Tests17files PASS,8focused trong boss-phase (thêm84tick snapshot và dead-at-threshold/reset), typecheck/build PASS. [Browser390/1440](evidence/enrage-freeze.json) chạy Scene thật, không override update: giữD trong transform không đổi player/grunt/projectile/HP/timer; transform clock tiến, Pause freeze, Resume combat;0errors. BossHP/placement có grant như mô tả report; không naturalrun. [Ảnh390](evidence/enrage-freeze-390.png), [Ảnh1440](evidence/enrage-freeze-1440.png). Chờ playtest, không tự ACCEPTED/Q8D.

Correction đã deploy [`1302474`](https://github.com/gizgity/a-new-game/commit/130247467408541c56cbaac7528b08635fa3efa1), [Pages40352171221](https://github.com/gizgity/a-new-game/actions/runs/40352171221)/job121674876464 completed/SUCCESS gồm Deploy. [Preset1150kills bản mới](https://gizgity.github.io/a-new-game/?playtest=boss&v=1302474). Dừng AWAITING USER PLAYTEST APPROVAL; thử halfHP, animation1.4s chậm/đứng thế giới/timer, Pause giữa transform và combat tiếp tục sau đó.
