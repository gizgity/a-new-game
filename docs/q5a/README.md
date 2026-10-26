> Q8B: thông số milestones OR cũ trong tài liệu này là **SUPERSEDED**; giữ làm lịch sử/evidence/approval. Quy tắc hiện hành: [GAME_BRIEF](../../GAME_BRIEF.md#run-tối-đa-5-phút), [audit Q8B](../q8b/README.md). Spawn Q8A và approvals giữ nguyên.

# Q5A — Juggernaut

> Tham chiếu lịch sử checkpoint trước Q6; evidence và kết quả tại thời điểm đó giữ nguyên. Hiện hành: Q5A–Q5E đã được user duyệt (task Q6 ngày2026-10-26); Q6 hỗ trợ2Curse/4Mutation, lượt Curse thứ hai thêm hoặc Keep. Xem GAME_BRIEF.md và HANDOFF.md cho contract/trạng thái mới.

Bản fa4045deb8d332fee03cdf01555ced2d4ed29b79: Barrier + Guard Breaker + Aegis Core + Iron Oath. Actions40168884585 completed/success. Chờ user playtest; không là approval Q5A hoặc quyền mở Q5B.

- `juggernaut-{320,390,844,1440}.png`: fixture có sẵn build, Bulwark1000HP đặt gần player, simulation thật resolve một Heavy. Aegis10 + Guard12.5 với Oath =22.5 Barrier; không là natural run.
- `barrier-break-390.png`: fixture Barrier12 nhận damage20 → HP92/Barrier0, hurt pipeline thật.
- `curse-390.png`: fixture draft giữ/đổi Curse, kiểm vi/en và mô tả.
- `boss-{320,390,844,1440}.png`: fixture Boss/Barrier15, kiểm HUD không đè resource/controls; không chứng minh đánh thắng Boss.
- `production-390.png`: dist local, link trial cấp build Juggernaut rồi giữ Chém bằng input thật8s, waves thật, không inject HP/resource/enemy. Có11kills, HP67 và Barrier5 lúc chụp; không là natural acquisition hoặc full-run. Hình cho thấy giữ vị trí không làm player bất tử.

Validation: npm test PASS (80 test definitions/6files, gồm9 Q5A); typecheck/build PASS; Chromium4viewports, không runtime errors/document overflow; Barrier/HP, draft vi/en, pause, trial không lưu tiến độ và normal run vẫn lưu progression. Tests không thay user acceptance. Bundle Phaser>500KB là warning cũ. Chưa Safari/iOS, full-run hoặc thiết bị thật. HTTP Pages trực tiếp bị proxy403; browser evidence là local/dist, deploy được xác nhận bởi Actions success.

## Cách thử

- Trial: https://gizgity.github.io/a-new-game/?playtest=juggernaut — có sẵn2Mutation+Iron Oath từ đầu, có nhãn rõ, không lưu kills/unlocks/runs; dùng để thử tương tác, không đánh giá xác suất draft/natural acquisition. Những draft sau vẫn chạy theo mốc hiện có; build preset không đại diện số Mutation kiếm được trong run thường.
- Run thường: https://gizgity.github.io/a-new-game/ — Aegis/Iron Oath vào pool; Guard vẫn unlock hạ1quái. Draft Mutation25kills/0:30, Curse80/1:00, Mutation160/1:40 và220/2:20, Curse300/3:00, Mutation380/3:40. Offer vẫn random cũ; chưa Draft v2, không bảo đảm đủ bộ mỗi run.
- Giữ Chém/chuột trái vào quái: Aegis tích damage thật, Barrier cyan tăng có cap30; chém hụt không tăng. Chịu một hit: khiên giảm trước, damage dư mới vào HP.
- Đợi Grunt lấy đà rồi ngắm/thả Heavy (nút Đánh mạnh/Shift) trước khi nó đánh; hoặc Heavy vào giáp đóng Bulwark ở200kills/2:30. Guard +10 (Oath+12.5) một lần/Heavy, không nhân theo số mục tiêu. Heavy hụt/đánh recovery không thưởng Guard; Oath chỉ +4 khi bắt đầu Heavy có khiên.
- Dùng Dash (nút Lướt/Space), xem đồng hồ hồi3.64s với Oath thay vì nền2.8. Lượt Curse thứ2 có thể giữ Oath/đổi Curse; đổi không xóa Barrier đã kiếm, nhưng gỡ multiplier/Oath Heavy bonus và hồi Dash theo Curse mới.
- Mong đợi build chống chịu nhờ đánh trúng/phá thế, vẫn cần né/di chuyển; HUD/vỡ khiên đọc được, Boss giữ telegraph không bị stun.

Phản hồi: thao tác/tình huống, cảm giác hoặc lỗi quan sát, thiết bị/browser. Dừng Q5A ở AWAITING PLAYTEST APPROVAL; chưa triển khai Q5B–Q5E.
