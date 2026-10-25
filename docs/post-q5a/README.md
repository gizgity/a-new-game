# Fixes sau Q5A

Q5A được user chấp nhận qua “q5a ok”. Task này sửa feedback riêng, chưa mở Q5B.

- Dân số18 là soft cap: nếu6s không kill khi đủ crowd, spawn thêm3 và tiếp tục mỗi6s; không trần cố định trước Boss. Kill reset pressure, pause/draft/hitstop không cộng clock. Elite không xóa crowd; mốc Boss và cap7 trong Boss giữ.
- Archer theo player suốt windup/cả stagger; ray cùng hướng thật, đạn đã bắn giữ hướng. Boss windup0.72/0.52, cooldown0.72/0.45, recovery0.4/0.28 ở hai phase, không thay damage/pattern/Perfect.
- Boss chết có vỡ ấn/chime1.1s rồi dialog thắng vàng; chết/deadline dialog thua hồng. Simulation kết thúc trước animation, không gây damage mới. Reset xóa hiệu ứng.
- Draft ngăn native menu/select/drag/auxclick/gesture trong arena; chỉ primary click mới/keyboard mới chọn, cú thả từ gameplay không chọn. Mobile vẫn cuộn dialog.

## Evidence và giới hạn

`boss-break-390.png`, `victory-390.png`, `defeat-390.png`, `draft-390.png` là fixture renderer thật. Boss1HP bị projectile thật giết qua combat/run pipeline; không inject bossSlain/result flag. Defeat đặt HP0 để kiểm trình bày; draft cấp sẵn choices để kiểm mouse/keyboard. Không là natural/full run.

Tests83definitions/6files PASS, typecheck/build/diff PASS. Browser Chromium390/1440 kiểm held/right click/keyboard/native events, victory reveal/result/reset, defeat, vi/en, result freeze; production dist844 input/pause/no-overflow/no-runtime-errors PASS. Test pressure đi qua30s rồi thêm12s chứng minh crowd tiếp tục +6 sau khi vượt18, kill reset và pause/draft/hitstop freeze. Fixture132Grunt hoạt động đo khoảng0.46–0.77ms/core tick trên Chromium môi trường này; không chứng minh FPS trên mobile thật. Chưa Safari/iOS/full-run hoặc user acceptance cho fixes; warning bundle Phaser>500KB hiện trạng.

## Checklist user

Tải lại https://gizgity.github.io/a-new-game/ sau deploy.
1. Đầu run chạy né, không kill trong20–30s: khi đủ18, vẫn có pack mới mỗi6s không kill. Hạ một quái rồi tiếp tục chạy: pressure timer bắt đầu lại, không tạo pack tràn ngay. Không cần cố sống tới Boss để kiểm điểm này.
2. Đứng trước Archer lúc nó gồng, di chuyển ngang: cung/ray quay theo bạn; dash hoặc né tiếp sau khi đạn đã bắn thì đạn không bẻ lái.
3. Draft đầu tại25kills/0:30: thử giữ chuột trái trước khi mở rồi nhả trên card, hoặc chuột phải; không tự chọn/menu browser. Bấm trái mới hoặc Enter chọn bình thường; mobile kiểm cuộn các card.
4. Boss tại450kills/4:00: ba pattern nối nhanh hơn, còn cue/recovery để phản ứng. Hạ Boss thấy vỡ ấn rồi CHIẾN THẮNG/ĐÃ HẠ BOSS vàng; chết hoặc hết5phút thấy THẤT BẠI hồng.

Mobile: kéo joystick để chạy, nút Lướt để né; desktop WASD/Space. Phản hồi tình huống, quan sát và thiết bị/browser, đặc biệt crowd có ép giao chiến và nhịp Boss có đủ khó/đọc được không. Các fixtures không thay lượt thử trên thiết bị thật.
