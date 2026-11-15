# DR-P1-VERIFY-02 — Bàn giao actual-vs-target camera/minimap/biome

Parent milestone: DR-P1
Kind: VERIFY
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §11 W07–09; R12.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Chỉ baseline screenshots và candidate specs, chưa target/actual dungeon.
Outcome: Review package đúng viewport/scale/input, checklist playtest world ngắn, technical/visual/user results riêng.
IN: Actual renderer comparisons/input-world precision/lifecycle/readability, user review/playtest handoff P1.
OUT: Tự approve visual/playtest, full expedition/balance/Safari coverage giả, performance suite mới.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1 locked, ENV/CAMERA/MINIMAP approved exact targets, K-U protocol/rectangles, R12.
Artifact/task dependencies: CODE-07/all P1 art+code + VERIFY-01 relevant results; crowd threats thật từ P2/P3/P4, device IDs/method P6. Theo S1§11, targets/actual camera-minimap-renderer/fixture crowd/input world và user world playtest là bắt buộc của P1. Actual combat/stress/device measurements chuyển owner P2/P3/P4/P6 với evidence yêu cầu; PARTIAL chỉ áp phần tích hợp, không dùng để ACCEPT core P1 chưa đạt.
Input binding: Same scenario code/spec/target/export hashes; baseline plan§2, geometry808 and transform variants, viewport+safe-area+playRect/DPR/device identities.
Output: DỰ KIẾN evidence/DR-P1-VERIFY-02/REPORT.md + before/target/actual shots/short clips/rect+transform data + user checklist.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Capture sixviewport R12 center/wall/gate/4góc và vi/en, crop vùng chuẩn cùng target, record playRect/zoom/world span.
2. So renderer thật module/gate states/occlusion/minimap fog/discovery/marker+legend, crowd/grayscale cùng scene; synthetic crowd chỉ label fixture, chưa combat feel.
3. Touch giữ joystick/manual aim và keyboard WASD+mouse; ring/range/world-pointer roundtrip/shake/resize/blur/pause/fresh-press, action input thật chờ K-A.
4. Đo camera follow motion/entry snap/7D visibility với clip, không khẳng định lagfeel từ stills; P6 owner responsiveness/FPS real-device protocol.
5. Bàn giao link/version/cách vào world/main+optional+gate/thao tác/kết quả mong đợi và hướng feedback; dừng chờ user visual/playtest đúng scope.

Audit source thực tế: Camera/input source+old baselines đã audit; new renderer không có nên chưa actual-vs-target.
Data/state/input-output/lifecycle: No game state/RNG mutation từ render/capture; before/target/actual đúng role/revision, baseline1440×900 không gọi là target1440×1000.
Thông số: dẫn S1 §11 W07–09; R12; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Must match 3approved targets/S1; all gate/fog states/crowd/grayscale/4góc. Counts fixture không FPS benchmark; iOS/Safari/device/human feel chỉ khi kiểm thật.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Phần P1 W07–09/S1§11 có before/approved target/actual at play scale và đủ matrix R12;320px đọc rõ minimap ngoài playRect, no HUD cover/corner/input failure. Core mismatch/NOT CHECKED chặn nghiệm thu P1; no concept-as-runtime.
- [ ] AC2: Touch và desktop có input/precision/lifecycle evidence riêng, no HUD/minimap overlay gameplay.
- [ ] AC3: User checklist world scope ngắn có cách vào/các bước/main-vs-optional/gate expected, code version/play link thật khi có.
- [ ] AC4: Technical/visual approval/user world playtest fields riêng, thiếu user quote không ACCEPTED P1; bảng chuyển P2–P6 ghi owner/evidence actual còn thiếu (combat/full-save/full-run/device), không bắt P1 hoàn tất các phần đó hoặc dùng PARTIAL bỏ qua core; no next milestone auto-open.

Verify plan: Browser/capture/input focused; device60s avg/p95 theo P6 khi assigned/artifacts đủ, không đòi measurements trước code.
Evidence cần có: Reports/images/clips/rect data/device metadata + approval quote/date/version khi user phản hồi.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Global lock/targets/runtime/device protocol chưa có; user acceptance luôn NONE tới khi có phản hồi thật.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ implementations/deps và user giao VERIFY-02.

