# Cân bằng hướng tới khoảng50% — 2026-10-30

User yêu cầu “tỉ lệ thắng quá cao khoảng 8/16 là đc”, rồi chốt: không cần giữ balance cũ; Archer phải nhắm theo player, giữ nguyên số lượng quái; cân HP/cadence quái và damage/chống chịu player; Tank giảm damage, Ranged tăng Barrier/cơ động. Baseline deploy81f5ec6, bàn giao5be7194. Không art/audio/progression/DDR hoặc milestone mới.

## Thông số cuối

| Nội dung | Bản81f5ec6 | Bản mới |
|---|---:|---:|
| Boss HP |1500|2400|
| Boss sweep / slam / projectile damage |26 /28 /10|46 /50 /18|
| Aegis damage gây ra |×.8|×.75|
| Iron Oath damage gây ra |×.75|×.7|
| Aegis + Oath damage gây ra |×.6|×.525|
| Specialist Barrier / Charged Detonate thực gây damage |6 / hồi2s|18 / hồi2s, cap30|
| Specialist tốc độ đi bộ |×1|×1.2|
| Specialist hồi Dash |2.2s/charge|1.76s/charge (×.8)|
| Specialist direct Charged damage |×1|×1.1; không nhân flat Static|
| Glass Soul maxHP |75|90|
| Shared heal / Blood cap mỗi10s |12 /9|8 /8|
| Archer ngắm trong windup |chốt250ms cuối|theo player đến release|

Specialist vẫn cần ammo kiếm được và blast thực sự gây damage; hụt, blast rỗng, Basic hoặc nhiều hit trong cooldown không nhận thêm khiên. Mob/dash modifiers là thuộc tính Mutation thật, có thể phối hợp với Oath/Legacy theo phép nhân; không thêm charge hoặc i-frame. Mô tả vi/en và HUD cooldown đọc state thật.

Tank vẫn có Aegis4/s/Oath×1.25/Guard, nhưng Aegis+Oath chỉ còn52.5% base damage, thay60%; không vừa dọn nhanh như build damage vừa có khiên mạnh. Counter được chút giảm damage, Ranged có khoảng trống vừa di chuyển vừa tích đạn. Trần heal giảm để Sustain phải xử lý nguy hiểm thay vì thắng nhờ hồi bền. Không đặt kết quả thắng/thua trước theo seed hay build. Phantom không có mitigation mới trong source cuối; thử nghiệm đó đã bỏ.

**Spawn giữ nguyên:** không sửa RunDirector, pack size, khoảng spawn, soft/hard cap, số Archer, pressure wave, milestone hoặc Boss add count. HP quái thường và attack timings cuối cũng giữ nguyên sau thử; tăng độ khó chủ yếu bằng HP/damage Boss và trade-off player. Archer theo player cả cuối windup/khi stagger, projectile không bẻ hướng sau khi bắn. HUD Boss đã sửa lấy `maxHp` thật, không còn hardcode1500.

## Phương pháp và giới hạn

Giữ nguyên bot, seed/draft thật, reaction cadence300ms và quy tắc bossSafe của harness từ task trước; mỗi route dùng cách đánh phù hợp, không grant HP/kill/build/offers. Các nhóm16 seed đã xem trong task trước và nhóm validation50 dùng để calibration, không tiếp tục gọi là dữ liệu độc lập. Nhóm confirm50 lần đầu chưa đạt nên được ghi là thử nghiệm chưa đạt, không chốt tỷ lệ từ đó.

Đo hai nhóm32seed `combined50` và `audit50`. Kết quả audit bản trước còn lệch Tank/Counter nên đã điều chỉnh nhỏ lần cuối, bỏ mitigation thử nghiệm của Phantom và nới Oath từ×.68→×.7; sau đó chạy lại cả hai nhóm trên source cuối. Vì đã xem nhóm này trong quá trình chỉnh, **64seed cuối là regression/calibration rộng, không phải holdout độc lập hoàn toàn**. Nhóm audit đầu tiên đã được chọn trước khi chạy; không che việc dùng lại để kiểm revision cuối. Kết quả luôn ghi mẫu số thật; quy đổi “trên16” chỉ để so mục tiêu8/16. Bot aim theo tọa độ thật, seed chủ yếu đổi draft: không là tỷ lệ thắng người chơi hoặc mẫu độc lập hoàn toàn. Dao động từng nhóm16 không chứng minh tỷ lệ dân số đúng50%.

Kết quả source cuối: mỗi hướng64lượt, gồm hai nhóm32; tất cả dùng observed300ms:

| Hướng | Nhóm combined32 | Nhóm audit32 | Tổng | Tỷ lệ | Quy đổi trung bình /16 |
|---|---:|---:|---:|---:|---:|
| Tank |22/32|16/32|38/64|59.38%|9.5|
| Sustain |14/32|19/32|33/64|51.56%|8.25|
| Counter |16/32|18/32|34/64|53.13%|8.5|
| Ranged |14/32|23/32|37/64|57.81%|9.25|

Tổng142/256 =55.47%, chênh giữa4tỷ lệ gộp7.81điểm%. Đạt mục tiêu thực nghiệm quanh8/16 (mỗi hướng trong6–10/16 khi quy đổi tỷ lệ trên64mẫu); không nói một nhóm16 bất kỳ đều thắng đúng8. Ví dụ Ranged nhóm audit23/32 nhưng combined14/32: dao động RNG/trajectory còn rõ. Không khẳng định tỷ lệ người chơi giống bot.

Raw cuối: [combined](evidence/half-release-expanded.json), [audit](evidence/half-release-audit.json), [verification](evidence/half-verification.json). [56kết quả thử rút gọn](evidence/half-calibration-summary.json) gồm các lần chưa đạt; full trajectories của bản cuối giữ nguyên. Không dùng kết quả cấu hình đã bỏ làm số liệu deploy.

## Validation và cách thử

**30testfiles PASS**, typecheck/build PASS; warning Phaser chunk>500KB hiện có. [Browser4viewport](evidence/half-browser.json) PASS320/390/844touch+1440desktop: vi/en, input Charged giữ→thả thật,18Barrier/cap/cooldown/pause, actual walk×1.2/dash1.76s và BossHUD max2400/value1800 đúng75%. Fixture có cấp Mutation/ammo/target, không gọi là natural run. [Script](browser-half-check.mjs). Spawn/count/timing preservation đã assert bằng deep equality so81f5ec6; source RunDirector không đổi. Focused cases: live aim cuối windup và stagger, projectile giữ hướng sau release; Tank tax một lần/multiplicative; Specialist Charged không nhân flat Static, Barrier cap/cooldown/freeze/reset, mobility thật; Boss HUD maxHp thật.

Sau deploy: thử run mới với từng hướng. Tại20–100s chú ý Tank giết chậm hơn; Ranged đi bộ/dash nhanh hơn, Charged blast trúng cụm tạo18Barrier và HPGlass90. Archer còn theo người trong windup: di chuyển ngang hoặc đổi hướng, đạn đã bắn không tự bẻ lái. Khi Boss xuất hiện220–240s, HP2400 và mỗi hit nguy hiểm hơn; cần dùng nhịp windup/recovery để phản công và né/thoát cụm. Mong đợi vẫn có thể thua, cơ hội thắng quanh mức bot đã đo chứ không gần như chắc thắng. Báo hướng/Mutation+Curse, mốc chết/thắng và thiết bị/browser.

Playtest ngắn input thật trên source cuối: [Ranged](evidence/half-release-natural-ranged.json),46.3s wall→33.1s simulation,97kills,100HP,0dash, chọn Specialist tự nhiên20s, khôngpageerror. Chưa Curse/Boss/fullrun, khônggrantresource.

Chưa user/device/iOS/Safari/FPS hoặc natural full-run browser acceptance. Deploy không là nghiệm thu cảm giác cân bằng.


## Tái lập

```bash
npm test
BALANCE_POLICY=bossSafe BALANCE_MODES=observed BALANCE_SET=combined50 BALANCE_OUTPUT=/tmp/half-combined.json node docs/early-run-balance/four-routes.mjs
BALANCE_POLICY=bossSafe BALANCE_MODES=observed BALANCE_SET=audit50 BALANCE_OUTPUT=/tmp/half-audit.json node docs/early-run-balance/four-routes.mjs
npm run build
node docs/early-run-balance/browser-half-check.mjs
```

Live HTTP/hash verification và thiết bị thật chưa thực hiện. Code **651e3bfe1f4b087c5f98d5e2909a93cfba35b406** đã push main fast-forward từ5be7194. [Pages40980017891](https://github.com/gizgity/a-new-game/actions/runs/40980017891) **completed/SUCCESS**, build/typecheck/upload/Deploy. [Chơi bản mới](https://gizgity.github.io/a-new-game/?v=651e3bf). **AWAITING USER PLAYTEST APPROVAL**; chưa tựaccepted trải nghiệm.
