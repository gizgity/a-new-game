# Q13 Follow-up — Tutorial + Heavy R

**AWAITING USER PLAYTEST APPROVAL** — code `a722d03`, Pages41151759487 **completed/SUCCESS**, job124389653424 npmci/build/typecheck/upload/Deploy SUCCESS. Baseline latest main `0472c4a` ngày 2026-10-31. `docs/q13/` không tồn tại trên baseline; không có issue report Q13 cũ để đọc. Q13-001/002 được xử lý theo mô tả user và đối chiếu runtime.

## Thay đổi

- Desktop Heavy dùng **giữ R để ngắm, thả R để dùng**; Shift không có binding Heavy. Giữ cancel/fresh-press khi Pause/blur/resize, touch hold/release hiện hữu. Cập nhật hướng dẫn vi/en, GAME_BRIEF và các browser script cũ còn dùng Shift (không sửa evidence/approval lịch sử).
- Lần Bắt đầu đầu tiên mở tutorial 5 bước: WASD/joystick → chém đặt Rupture → bắn kích nổ dấu thật → R/nút Heavy giữ-thả → Space/nút Lướt. Bước cuối giới thiệu canh telegraph vàng để Perfect Dodge; Dash thành công đủ hoàn thành, không ép Perfect Dodge.
- Reuse CombatWorld/AI/cooldown/input/audio/render thật; tutorial có phiên riêng, RunDirector không step, không Draft/Boss/rewards/run/history/progression. Reset phiên giữa các bài, giữ dấu sau bài chém cho bài bắn; chết thì thử lại bài hiện tại. Mục tiêu dùng Grunt/art sẵn có.
- Skip và Replay Tutorial trong menu chính/kết quả; khi pause tutorial có Resume và Skip trong menu, không tạo phiên chồng. Hoàn tất/Skip quay về menu, Bắt đầu tiếp theo mới tạo run thật.
- Save v3 hiện hữu thêm boolean `tutorialDone`, không key/schema framework mới. Save người đã chơi (runs/kills/legacy runId) tự bỏ tutorial. Reload giữa bài chưa hoàn tất sẽ bắt đầu lại tutorial; Skip/hoàn tất được lưu. Storage lỗi giữ cảnh báo hiện hữu.
- **Q13-001:** sửa 450 kills thành cảnh báo ở 1200 kills từ 3:40 hoặc fallback 4:00, Boss xuất hiện sau warning 2 giây; deadline 5:00. Đọc từ ENCOUNTERS hiện hành, không sửa balance.
- **Q13-002:** hướng dẫn Perfect Dodge desktop/mobile, vi/en, trong menu và bài Dash. Không đổi perfect window, combat mechanics, audio Q12, DDR, art hay economy.

## Validation

- `npm test`: **33 files PASS**, gồm tutorial real combat order/movement/mark/shot explosion/Heavy/Dash, retry sau chết, save migration/round trip và regression progression.
- `npm run build` bao gồm typecheck: **PASS**; warning chunk Phaser >500KB có sẵn.
- Chromium software WebGL: **320×740, 390×844, 844×390 touch; 1440×900 desktop**, vi/en, 5 bài/Skip/Replay/reload/run thật sau tutorial/save isolation, Heavy hold/release touch và R release/cancel, Shift negative: **PASS**. [Raw](evidence/browser.json), script [browser-check.mjs](browser-check.mjs). Screenshots từng bài/locale trong evidence; banner là hàng riêng trên arena, không phủ canvas/HUD.
- Browser matrix dùng controlled real CombatWorld ticks để tới từng bài, không đại diện thao tác người. **Native tutorial PASS** cả390touch và1440desktop: joystick/Chém/Bắn/Heavy/Lướt vàWASD/chuột/R/Space thật,5bài tự chuyển,save totals vẫn0. [Raw](evidence/native-tutorial.json), [script](native-tutorial.mjs). Dist390/1440 Skip/Replay/reload/start PASS, [raw](evidence/dist.json). **Browser run tự nhiên seed808:**155.573s wall→79.417s run, thua/0HP/384kills,2Draft thật,2Dash/1PerfectDodge, không pageerror, không grants/step/clock injection. **Chưa tới Boss/Victory trên browser.** [Raw](evidence/natural-counter.json), [ảnh](evidence/natural-counter.png), [script](natural-run.mjs).
- Simulation run seed808, first-run pools/progression/draft tự nhiên, quyết định mỗi300ms, không grants HP/build/resources/kills/clock: tới Boss 222.45s/1261 kills, thua 232s/1267 kills. **Chưa Victory**. [Raw](evidence/full-simulation.json). Đây là simulation, không full-run browser hoặc người chơi.

## Lỗi và giới hạn

- Baseline thiếu `docs/q13/`; tạo hồ sơ này từ yêu cầu hiện tại, không bịa lịch sử issue.
- Git fetch ở sandbox không nối proxy; chạy qua executor elevated thành công. Không phải user approval blocker.
- Đã sửa lỗi UI đọc arena trước khởi tạo và callback hoàn tất tutorial đệ quy; browser kiểm lại PASS.
- Harness gọi Phaser `loop.start()` thiếu callback gây lỗi `this.callback is not a function`: sửa harness dùng sleep/wake, kiểm lại PASS. Controlled desktop aim từng bị pointer hiện tại ghi đè: sửa harness hướng đúng mục tiêu; native kiểm riêng.
- Lượt natural browser đang chạy bị Vite reload khi source thay đổi, mất execution context; chạy lại sau khi source ổn định. Không ghi lượt gián đoạn thành PASS.
- Native touch drag đầu bị lifecycle resize hủy contact (đúng cancel contract); harness thử lại swipe và chờ layout ổn định. Kết quả cuối ghi dưới, không coi controlled matrix thay cho native input.
- Chưa liveHTTP/hash verification của Pages từ môi trường; preview dist PASS không thay live verification.
- Chưa thiết bị thật, Safari/iOS/Firefox, FPS/thermal/latency hoặc acoustic listening; software WebGL không chứng minh các mục này. Build/deploy không là user acceptance.

## User playtest

Code đã push main fast-forward `a722d03`; [Pages41151759487](https://github.com/gizgity/a-new-game/actions/runs/41151759487) **completed/SUCCESS**, job124389653424 npmci/build/typecheck/upload/Deploy. [Chơi thử](https://gizgity.github.io/a-new-game/?v=a722d03). Trên save cũ chọn **Chơi lại hướng dẫn / Replay Tutorial** trong menu; save mới Bắt đầu tự vào bài. Thử 5 bước bằng WASD/chuột/R/Space hoặc joystick/nút cảm ứng: chỉ hành động đúng chuyển bài, R/nút Heavy thả mới ra đòn, Shift không Heavy; bài Dash có hướng dẫn Perfect Dodge. Thử Skip/Replay/refresh, kiểm bài tập không tăng runs/rewards/history và run thật chỉ bắt đầu sau khi kết thúc bài. Xác nhận cảm giác thao tác/readability trên thiết bị thật; phản hồi bước/tình huống, quan sát và thiết bị/browser.

Dừng **AWAITING USER PLAYTEST APPROVAL**. Không tự mở milestone mới.
