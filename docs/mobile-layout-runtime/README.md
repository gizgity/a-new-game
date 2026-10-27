# Mobile layout — runtime sau scale75%

User duyệt concept75% và yêu cầu header mobile chỉ icon ngày2026-10-27. Thay đổi CSS/markup trên main9db8191, giữ toàn bộ Q9A/gameplay đã accepted. Không dịch Dash, scale cả cụm kể cả offset và counters; không đổi touch aim/resource timings. Không ghi DDR từ thảo luận.

## Evidence

Ảnh Chromium renderer thật, khác concept ImageGen ở [proposal](../mobile-layout-concept.md). Fixture bắt đầu run, dừng game loop để đo geometry; profile browser tạm, không phải natural run hay thiết bị thật.

- [320×740](layout-320.png), [390×844](layout-390.png), [844×390](layout-844.png), [1440×900](layout-1440.png).
- [Geometry/input checks](checks.json): đúng header44px mobile/100px desktop, Dash45px dưới Heavy, portrait lane216px, controls204px, canvas không bị nút che, không overflow/pageerror; icon pause/resume và locale vi/en; CDPmultitouchmove+shoot giữ/thả, Heavy/Charged/Dash cancel sạch. Không test tự động mới cho thay đổi layout.
- Build/typecheck và20testfiles PASS. Vite chunk warning có sẵn. Chưa kiểm thiết bị thật/iOS/Safari, FPS, cảm giác hit area hoặc full-run từ các fixture này.

## Cách thử trên điện thoại

1. Vào run, giữ joystick và Shoot cùng lúc; thử kéo ngắm và thả Heavy/Charged. Mong đợi vẫn di chuyển/đánh đúng, thả không kẹt.
2. Bấm Dash dưới Heavy và luân phiên Heavy/Melee. Kiểm có dễ bấm hụt hoặc lẫn trên thiết bị của bạn sau scale75%.
3. Bấm icon quả địa cầu đổi vi/en, icon pause rồi play để tiếp tục; game giữ trạng thái.

Scope acceptance chỉ layout/input/header của lượt này; không yêu cầu duyệt lại Q9A. Báo bước gặp lỗi, thiết bị và browser. Chưa user playtest approval cho layout runtime.
