# Q7B — sửa theo playtest: vùng chơi, cảm ứng và draft

> HIỆN HÀNH: Q7B ACCEPTED, user “q7b đã đạt” trên5ee970e. [Bản đã chốt](HUD_V3.md). Phần dưới giữ snapshotf9d7930 và gate lúc đó, không sửa lịch sử thành thiết kế mới.

**AWAITING USER PLAYTEST APPROVAL.** User báo thanh HUD che arena trên điện thoại, yêu cầu kiểm desktop/góc; giao thêm joystick vùng lớn, combat tỏa tròn quanh vị trí ngón cái Chém/Bắn, mobile auto aim quái gần nhất và draft chờ1giây. Đây là ngoại lệ scope do user giao trực tiếp sau bản6664ee0/docs8a469c0, không phải acceptance runtime Q7B hoặc Q1. Q2–Q7A giữ accepted; không Q7C.

## Hiện hành / snapshot

Vòng này là snapshot runtimef9d7930. User nay giao correction frame/art và icon-only/groupedcontrols; **xem [HUD_V3.md](HUD_V3.md)**. Các kích thước180×240/controls252px và câu “không thay SVG” bên dưới chỉ đúng snapshotf9d7930, đã superseded; evidence cũ giữ nguyên.

## Thay đổi tại f9d7930

- HUD nằm ngoài canvas: dải trên134px ởportrait,96px desktop,78px landscape ngắn. Desktop resources/milestones có dải96px dưới. Phone dọc controls252px dưới; landscape controls ở2dải bên (canvas chừa172px trái,164px phải). Player/đạn/telegraph không thể nằm phía sau các card HUD. Đổi kích thước viewport/camera fit; arena1600×1000, movement/collision bounds và follow không đổi. Zoom tối thiểu phủ floor khi canvas rộng/ngắn.
- Joystick nhận toàn vùng trái, điểm chạm mới làm gốc, kéo8px để bắt đầu; không phải tìm núm giữa. Pad102×240 ở320,172×240 ở390; so pad132×132/156×132 trước, diện tích tăng. Capture vẫn nhận ngoài vùng, thả/cancel dừng. Landscape pad156px rộng, cao phần còn lại của arena.
- Combat6nút trên cung180×240: Chém72 và Bắn68 ởphải làm vị trí nghỉ/ngắm của ngón cái; Dash62 dưới trái,Heavy58 giữa trái,Charged58 trên trái,Surge56 phía trên. Landscape scale0.82, target nhỏ nhất45.92px. Không chồng button; thông tin charges/cooldown giữ đúng state thật.
- Mobile auto aim chọn **quái còn HP gần nhất theo khoảng cách world**, bỏ body chết/trùng vị trí; không có target dùng hướng cuối/di chuyển. Kéo combat vượt8px ưu tiên hướng tay khi đang giữ, kể cả đang di chuyển; thả trở lại auto aim. Heavy/Charged giữ chỉ ngắm, thả đúng1lần, snapshot hướng manual theo chính action. Không tăng damage/range/fire rate, không dẫn đạn hoặc tự bắn. Desktop mouse aim giữ.
- Mỗi draft hiển thị ngay, đọc/cuộn được nhưng button disabled1000ms wallclock, có lời nhắc vi/en. Timer không phụ thuộc simulation đang pause; rerender/đổi locale không reset khóa. Chỉ press mới sau khóa mới chọn; nhấn trước/thả sau và Enter/Space giữ qua khóa bị từ chối. Keyboard event ở draft không bị Space của game nuốt. Offers/weights/4hướng/milestones/heal/Curse logic giữ nguyên.
- Giữ reset khi pause/details/draft/results/blur/resize/pointercancel. Không thay asset SVG, PlayerVisual/BuildVisual/BarrierVisual, AI/pattern, CombatWorld/RunDirector/config/balance/effects/save/unlocks hoặc dependency.

## Evidence và kiểm tra

[Board](index.html) · [Raw checks](revision/checks.json) · [Di chuyển thật4góc](revision/moving.json) · [Production smoke](revision/dist-smoke.json) · [Resize cancel](revision/resize.json). PNG trong `revision/` là screenshot renderer thật, không ImageGen. Baseline chạy worktree8a469c0, bản sửa chạy local source; fixture grant HP/build/enemies/position để soi rõ, không natural run hoặc user acceptance. Evidence cũ ở `evidence/` và concept ở `artwork/` giữ nguyên lịch sử.

- Before/after crowd và4góc ở390/1440; sau thêm320/667landscape/844landscape/768tablet. Kiểm geometry: mọi HUD/control card không giao canvas,6button không chồng và≥44px, player radius ở4góc nằm trong canvas; no overflow/pageerror/HTTPerror.
- Boss cue/bar tại6viewports; build4Mutation+2Curse/HP22/Barrier30, details/scroll/vi-en/Resume. Đây là state fixture, không chứng minh cảm giác đọc Boss trong run thật.
- Movement thật: touch390/keyboard1440 đi chéo từ gần mép tới đúng4worldcorners, player radius trong canvas. Rotate390→844 khi đang giữHeavy: hủy,khôngcast,canvas/parent490×254 khớp. Trial label dùng chung feedback row,không trùngBoss bar.
- CDP touch thật:4gốc joystick lệch tâm; vừa di chuyển vừa manual aim; nearest/auto resume; Heavy hold/release và Charged hướng riêng;2ngón mở details hủy đang giữ, pointercancel clear. Draft trước1s/touch giữ qua khóa/fresh click/held Space/fresh Space/locale rerender/lượt mới/card4.
- Production dist5viewports320/390/844/768/1440: input Bắn/drag/Heavy hoặc WASD/mouse, Heavy1/2,details/Pause/settings/vi-en/no stuck/nooverflow/no pageerror/HTTPerror. Không grant state trong production smoke.
- Focused tests thêm nearest living/manual override/fallback/tie/no mutation. Toàn bộ14testfiles PASS; typecheck/build PASS. Không thêm framework hoặc dependency.
- Giới hạn: Chromium WebGL emulation/local dist; chưa iOS/Safari/thiết bị thật, chưa full-run. Không lấy frozen scene hoặc test PASS làm user acceptance. Đổi viewport làm vùng nhìn khác trước, cần user đánh giá độ thoáng/tầm với; không tuyên bố performance thiết bị đã đạt.

Floor Q7A SHA256 giữ `71b8d5b2b0850d40cd7c39a795a8caee129e4b14dc7f08f20093d17c18fea70a`. Không asset mới hoặc ImageGen trong vòng sửa interaction này.

## Deploy / thử trên điện thoại

[Chơi bản mới](https://gizgity.github.io/a-new-game/) — reload sau deployment. Code [f9d7930](https://github.com/gizgity/a-new-game/commit/f9d7930e583c8756037ceab2859ea65bd3ae055a) đã push main fast-forward; [Pages40279081013](https://github.com/gizgity/a-new-game/actions/runs/40279081013)/job121428123386 completed/success gồm Deploy. Workflow/base giữ nguyên. Live HTTP kiểm lại từ môi trường vẫn bị proxy403; không giả local/dist làlive. Deploy không là approval.

1. Đi vào4góc trên phone dọc/ngang và desktop: nhân vật phải thấy rõ, HUD không phủ sân. Chạm/kéo từ mép trên/dưới vùng trái, thả phải dừng ngay.
2. Chỉ giữ Bắn/Chém, kỳ vọng tự hướng quái gần nhất; kéo sang hướng khác để override, vừa đi vừa kéo. Heavy/Charged chỉ ra đòn khi thả; mở dải build khi đang giữ rồi Resume không tự cast. Đánh giá tầm với cung nút trên máy thật.
3. Draft đầu ở25kills hoặc0:30: chạm ngay/giữ ngón khi dialog mở không chọn; sau1giây chạm mới chọn được. Các lượt tiếp cũng khóa1giây. Cuộn tới card4,đổi locale/Pause/details vẫn thao tác.

Phản hồi ngắn: hướng xoay/thiết bị/browser, góc hoặc nút gặp lỗi, bước tái hiện. **AWAITING USER PLAYTEST APPROVAL**, không tự mở Q7C.
