# Pressure v2 — chống chạy vòng, giữ AoE

> Note lịch sử, giữ nguyên evidence/approval tại thời điểm đó. Damage/cooldown Grunt trong note này đã được feedback sau e4f0ab1 supersede (hiện damage6, cooldown7s+offset); không lấy thông số lịch sử làm tuning mới. Contract/trạng thái hiện hành ở [GAME_BRIEF](../../GAME_BRIEF.md) và [HANDOFF](../../HANDOFF.md); Q7A chỉ visual concept, chưa đổi gameplay.

Bản e4f0ab1b962a4e99f5172d4229ad59ee70c9e4aa đã deploy; Actions40171971219 completed/success. Chờ user playtest, chưa là experience acceptance. Browser evidence là local/dist; không xác minh trực tiếp live từ môi trường bị chặn Pages.

- Không kill4s khi đủ18: thêm pack3, ưu tiên2Archer tới cap8; sau đó tiếp tục thêm Grunt. Boss phase bổ sung Archer trước tới2, vẫn cap7. Kill reset clock; không tăng HP quái, không nerf damage/resources/cleave/AoE của player.
- Grunt nhảy khi cách150–380px: cue0.68s, bay0.24s cuối, khóa điểm dự đoán hướng chạy160px, tầm tối đa560, radius48/damage12×growth. Tối đa3cú cùng chuẩn bị/bay, cooldown3.6s+ID offset. Chạy thẳng bị đón, đổi hướng hoặc Dash tránh; Heavy/blast ngắt, Light trì hoãn bằng stagger; quái vẫn bị AoE trúng khi bay.
- Boss ở xa không sweep hụt mà khóa điểm slam/nhảy tối đa560px. Chase300px/s; windup0.62/0.46, cooldown0.55/0.38, recovery0.32/0.24. Ring12đạn thêm fan3 aimed, speed430; cue đủ15ray. Giữ1500HP/damage/Perfect, target khóa không homing, recovery mở để phản công.

## Kiểm tra

88definitions/6files PASS (5test mới); typecheck/build/diff PASS. Chromium390/844: cue/flight, Boss15projectiles, Surge hạ8Grunt, không overflow/runtime error. Hai ảnh đã lưu `grunt-flight-390.png`, `boss-flight-390.png` là fixture target/core thật, không natural run. Boss có1enemy được đặt xa, tự chọn slam qua logic thật. Grunt nhảy vào điểm khóa; renderer có shadow/body nâng cao.

Lượt dist1440 input thật bắn+WASD theo vòng, không grant stats/enemy: tại~10s có5kills/HP28; đó là kiểm tương tác/dấu hiệu áp lực, không chứng minh cân bằng hoặc full-run. Browser automation không thay user acceptance. Chưa mobile thật/Safari hoặc kiểm toàn run. Phaser>500KB là warning hiện trạng.

## User thử sau deploy

Tải lại https://gizgity.github.io/a-new-game/. Dùng run thường hoặc link Juggernaut cũ nếu muốn so chống chịu.
1. Từ opening, chạy thẳng khi Grunt ở xa: có vòng đáp rồi nhảy đón; đổi hướng sau khi thấy vòng/Lướt (Space) để né. Heavy giữ-thả (Shift) hoặc blast ngắt trước đáp. Đánh giá cue có đủ rõ trên điện thoại.
2. Không kill20–30s: đợt bổ sung ưu tiên Archer, không chỉ đuôi Grunt chậm. Sau đó gom/chém đặt dấu→Bắn/Charged hoặc Heavy/Surge để dọn; quái không được tăng HP để làm khó.
3. Boss450kills/4:00: chạy ra xa vẫn bị slam áp sát, ring có fan aimed; đổi hướng/Dash rồi phản công recovery. Dưới nửaHP nhanh hơn nhưng không khóa trúng hoặc phá Perfect window. Kiểm có đủ sức ép và còn cơ hội gây damage không.

Phản hồi tình huống, thiết bị/browser, chết bởi đòn nào/cue có đọc được, và nhịp AoE có còn thỏa mãn không. Q5A accepted; Q5B chưa mở, difficulty v2 AWAITING PLAYTEST APPROVAL.
