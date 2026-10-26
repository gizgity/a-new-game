# Q7B — HUD frame và cụm combat theo nhóm chức năng

> Checkpoint hiện hành: Q7B đã user accepted; Q7C cũng đã user accepted; hiện hành [Q7D — Full Run Experience Polish](../q7d/README.md). Các gate/“không tự Q7C” bên dưới là lịch sử checkpoint, không chặn task Q7C mới.

**ACCEPTED — USER PLAYTEST APPROVAL.** User xác nhận “q7b đã đạt” ngày2026-10-26 trên bản5ee970e. User yêu cầu bám ảnh HUD bevel/góc gãy trong hội thoại, sửa cụm quạt thành **4attack + Dash + Surge**, rồi chỉ rõ “icon là đủ k cần chữ trong nút”. Đây là correction được giao trực tiếp sau baseline6a851a0/runtimef9d7930, scope correction nay đã được user chấp nhận; không tự mở Q7C. Q2–Q7A/draft đầu4hướng giữ accepted; Q1 chưa riêng được duyệt.

## Thiết kế hiện hành

- Outer HUD dùng artwork SVG9slice: bevel obsidian, góc gãy sáng mint, đường viền kim loại/circuit nhỏ. Build summary có inset frame riêng, icon4Mutation/2Curse rõ hơn; HP liên tục/Barrier phân đoạn giữ state thật. Frame không đè sân: portrait134px,desktop96px,landscape78px ngoài canvas như vòng trước.
- Combat quạt184×272 gồm2cặp có bridge trang trí và cùng visual family: **Bắn / Bắn mạnh** ởcung trên (crosshair cyan), **Chém / Chém mạnh** ởcung dưới (blade mint). Basic circle lớn72/76px; power octagon64px với glyph riêng; không chỉ phân biệt bằng màu. Bridge không nhận input.
- **Dash**60px/double-chevron tím nằm gần thumb-rest dưới trái, tách hai cặp tấn công; **Surge**56px/star amber riêng phía trên, ít dùng hơn. Mặt nút chỉ icon: không tên, không “Ready/Charging/Hồi/points”. Count/ammo/% ởbadge mép dưới; timer numeric hoặc chargePoints có glyph↯ ởbadge mép trên. Tên/giữ-thả qua ARIA và tooltip vi/en, thông tin đầy đủ vẫn ởHUD desktop/details.
- Portrait controls284px dưới canvas; pad trái nhận cả vùng98×272 ở320,168×272 ở390 (diện tích lớn hơn vòngf9d7930), floating origin/capture/deadzone giữ. Landscape hai dải bên giữ172/164px, cluster scale0.82; target nhỏ nhất45.92px. Đổi chỗ nút theo user, không đổi pointer adapter/timing/damage/resources.
- Auto aim nearest-living/manual drag override, Heavy/Charged chỉ thả mới cast, pause/details/cancel/resize reset, draft1000ms/fresh-press giữ implementationf9d7930. Bounds/collider/AI/Boss/floor Q7A/VFX/effects/draft offers/save/unlocks/dependencies/workflow giữ nguyên.

## Artwork / provenance

[Runtime assets](runtime-assets.json) có version/bytes/SHA256/usage. Năm SVG nhỏ mới được vẽ tay trong repo: hud-frame,hud-inset,control-ring,control-power,attack-pair. Glyphsheet thêm4symbol: melee,shoot,melee-heavy,shoot-heavy; giữ toàn bộ symbols cũ. CSS dùng9slice/mask/layout, không drawing engine, shader hoặc service khi chạy. Ảnh user chỉ làm reference direction; không trích pixel/import nguyên concept thành runtime asset, không thêm artwork bên thứ ba.

`hud-v3/layout-preview-390.png` là DOM-only study trước correction icon-only, dùng chữ và viewport cũ; **superseded**, không dùng để chứng minh runtime/input/occlusion. Runtime ảnh hiện hành là các file bên dưới; preview sinh/ghép thành công không tự là ART APPROVED.

## Evidence và checks

[Board trước–sau](index.html) · [Layout6sizes](hud-v3/layout.json) · [Input/draft](hud-v3/input.json) · [Production smoke](hud-v3/dist-smoke.json) · [Final dist icon-only/assets](hud-v3/icons-dist.json).

- Renderer local6viewports320/390/667/844/768/1440: crowd/fullbuild/HP22/Barrier30, resources empty/ready/partial, vi/en, Boss/4góc/details. Không chồng HUD/control vào canvas, button≥44px/không chồng nhau, đúng2pair/4attack +2utility; nooverflow/pageerror/requesterror. Các ảnh fixture grant state/enemies/position, không natural run.
- Input CDP thật:4gốc joystick, vừa đi vừa manual aim/auto resume, Charged release đúng hướng, Heavy giữ không trừ/thả1lượt, details2ngón/cancel; draft≥1s/heldtouch/Space rejected/freshclick+Space/card4/locale noreset. Không đổi core để chữa harness; chờ điều kiện tick thay fixed delay khi software renderer chậm.
- Dist5viewports320/390/844/768/1440 inputthật +Pause/details/settings/vi-en/Heavy1/2/no stuck/noerrors. Finaldist390/667/1440 kiểm6glyph/ARIA+tooltip/khôngwordlabels/assetsnạpthật/buildsummaryfits/Pause-details/vi-en; không dựa vào DOM preview. Buildsummary667 đã được nới để không cắt iconinfo vàBoss giới hạntronggap.
- `npm test`14files PASS, typecheck/build PASS; warning Phaser bundle>500KB đã có. Không thêm test/visual framework hoặc dependency. Static SVG không thêm animation/particles; chưa benchmark thiết bị thật/iOS/Safari/full-run; approval chất lượng đến từ user “q7b đã đạt”, không đến từ tests.

## Deploy / scope đã bàn giao

[Chơi Q7B](https://gizgity.github.io/a-new-game/) — code [5ee970e](https://github.com/gizgity/a-new-game/commit/5ee970ed41802ce75d222b714c74361949d0aae6), [Pages40292060536](https://github.com/gizgity/a-new-game/actions/runs/40292060536)/job121469197980 completed/success gồmDeploy. Livecurl từ môi trường vẫn proxy403; screenshots/checks localdev/dist, không giảlive. User đã xác nhận Q7B đạt sau deploy.

Trên điện thoại dọc/ngang, thử luân phiên **crosshair thường/mạnh**, **blade thường/mạnh**, **Dash**, **Surge** khi100%; kiểm tầm với, không nhầm cặp/nút. Strong giữ-ngắm/thả mới cast; đạn/lượt hết vẫn thấy icon và số/timer. Đi sát góc và mở details để kiểm frame không phủ player; user không cần thử lại toàn bộ Q2–Q7A. Gửi nút/tình huống/thiết bị/browser nếu chưa ổn. **Q7B ACCEPTED** theo user, không yêu cầu playtest lại hoặc tự mở Q7C. Checklist trên giữ để tái hiện nếu có issue mới.
