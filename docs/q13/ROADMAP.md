# Q13 — Đề xuất sau audit (chưa được phép triển khai)

Giữ KISS/free-tier; không mở Q14/Q15. Chỉ user mới quyết định scope tiếp theo. Không thay approval Q12A–E/Q9/Q8C hoặc tự tune để đạt50%.

| Nhóm | Việc / dependency | Effort | Thứ tự đề xuất |
| --- | --- | --- | --- |
| P0 must resolve before RC | **Không có P0 được chứng minh.** Nếu verification phát hiện mất control/data/crash thật thì phân loại theo evidence trước khi sửa | N/A | Không tạo bug giả từ UNKNOWN |
| P1 | Q13-001 đồng bộ mốc Boss trong4welcome variants; cần user duyệt fix text, đọc config hiện hành | XS | 1 |
| P1 | Q13-002 thêm chỉ dẫn Perfect ngắn cho desktop vi/en; cần user duyệt, giữ nguyên predicate và accepted telegraph | XS | 1, gộp cùng task text nếu được phép |
| P2 optional polish | Q13-003 user chốt public name/RC label/metadata/version; không dùng codename mặc định, không redraw HUD | XS | 2, trước public RC nên chốt identity dù severity chỉ polish |
| Verification-only | Q13-007 smoke trên iOS Safari + Android Chrome và desktop Firefox: joystick+actions, Charged hold/cancel/fresh, rotate, focus/background, audio unlock, save restrictions; phụ thuộc thiết bị sẵn có, không mua dịch vụ | S | 2 |
| Verification-only | Q13-008 capture ngắn crowd+Boss frame-time và sau3restart, object/audio nodes/RSS nếu công cụ browser sẵn có; cần thiết bị mục tiêu. Payload chunk lớn là cơ sở đo, chưa cho phép optimize/split | S | 2, cùng lượt device |
| Verification-only | Q13-009 một natural Victory với profile thử có unlock hợp lệ, xem anomaly/Boss/recap/replay; không ép thắng/skip bằng fixture. Lượt natural Q13 không thay coverage Victory qua Anomaly ở run2+ | S | 3 |
| Verification-only | Q13-010 user playtest gate balance50% riêng + vài người mới desktop/touch; dùng quan sát thao tác/lý do thua, không tạo retention metric hoặc tự tune | S–M | 3, sau fix help nếu được duyệt; giữ approval nội dung cũ |
| Verification-only | Q13-011 xác minh public URL/hash/runtime version và ghi recovery known-good SHA/Pages workflow; không deploy/rollback thực trong Q13. Đối chiếu provenance hiện có, bổ sung thông tin thiếu nếu user yêu cầu | S | 4, trước quyết định phát hành |

Điểm quyết định tiếp theo: user review Q13 và cho phép một scope nhỏ sửa help/packaging hoặc chỉ verification trước. Muốn thay balance cần yêu cầu/phê duyệt riêng theo gate đang chờ. Không có đề nghị thêm mechanics/enemy/art/music/analytics/backend/monitoring/service worker.
