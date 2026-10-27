# Auto Aim desktop

Scope user27/10: thêm toggle Settings mặc định OFF; bật mới hiện ưu tiên Quái gần nhất / Archer / Elite(Boss). Selector: Rupture → nhóm chọn → gần nhất; cùng tier chọn nearest, tie giữ thứ tự enemy. Elite gồm Bulwark/Boss. Bỏ xác/coincident; không có target thì theo chuột. Không đổi touch assistance, balance, resources hay tự kích hoạt attack.

Aim được cập nhật mỗi simulation tick; Heavy/Charged chốt target còn sống khi thả phím. Pause/draft/gameout/blur vẫn dùng cancellation hiện hành, cần bấm lại sau resume. Settings có vi/en, lưu/validate trong profile v2; save cũ thiếu trường dùng OFF/nearest.

Validation: `npm run build` gồm typecheck; `npm test`22file PASS (selector, persistence và regression Q9B/touch/combat). Warning chunk Phaser có sẵn. `browser-check.mjs` là fixture local với loop dừng, đặt enemy ở vị trí kiểm soát; không là natural run/deviceFPS/device acceptance. Script dùng Chromium/Playwright có sẵn trong môi trường.

Thử desktop: mở Cài đặt → Tự ngắm (desktop), chọn Archer/Elite rồi vào run. Chuột chỉ sang phía khác, giữ bắn/chém và giữ–thả E/Shift: ưu tiên Rupture; hết dấu chọn nhóm đã chọn; thiếu nhóm chọn quái gần nhất. Elite từ2:05 (fallback2:30), Boss450kills/4:00; pause đổi lựa chọn/tắt rồi resume, tắt thì hướng trở lại theo chuột. Pause khi giữ E/Shift rồi thả phải hủy đòn, bấm lại mới đánh. Refresh giữ setting. Mobile vẫn nearest + drag override như cũ.

Chưa user playtest/thiết bị thật/iOS/Safari. Giữ Q9A/Q9B accepted; không mở Q9C.
