# DR-P1-CODE-03 — Camera world và bridge tọa độ input

Parent milestone: DR-P1
Kind: CODE
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §7.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Camera minimum fit toàn ARENA, follow0.12/frame; resize không world-specific.
Outcome: World camera theo playRect/aim/follow đúng target và pointer-world không lệch bởi shake/resize.
IN: Camera follow/zoom/bounds/backdrop viewport và coordinate bridge, input invalidation camera events.
OUT: Selector auto/sticky/action mapping, full HUD CSS redesign, enemy AI/art/collision.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1§7 locked; CAMERA-T01 approved; K-U playRect/safe-area+K-A aim query interface finalized.
Artifact/task dependencies: CODE-01, CONCEPT-02 approved, global lock+assignment; environment source không cần để math tests, actual compare chờ CODE-06/07.
Input binding: ArenaScene.resize/getWorldPoint/preRender/restoreMatrix; TouchControls.reset; style.css measured lanes.
Output: Camera adapter thực theo source organisation, worldToScreen/screenToWorld và readable visibleRect contract.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Nhận actual playRect từ shell, zoom theo S1 không fit toàn dungeon/DPR gameplay scaling.
2. Implement exponential follow/aim guard/snap entry/no-bounds-clamp backdrop theo approved spec; phase freeze không replay hidden delta.
3. Dùng transform không shake chung cho pointer/visibleRect, reticle draw matrix tách render như baseline principle.
4. Resize/orientation/blur/phase/node reset captures/held/preview qua owner hooks, fresh press; không đổi spell target quyết định.
5. Expose query cho K-A và minimap, không tự chọn enemy ngoài7D/camera.

Audit source thực tế: ArenaScene lines camera172/resize265/updateDesktopAim375 và shake restore; CSS/TouchControls audit plan§2.
Data/state/input-output/lifecycle: playRect CSS+player+aim+phase→camera/visibleRect; inverse matrix roundtrip S1, renderer shake không input offset.
Thông số: dẫn S1 §7; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

DR-CAMERA-T01 NONE hiện tại; must match approved formula/scale/lanes/4góc, flexible adapter internals; no latency/FPS claim từ screenshots.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Six viewport matrix có world spans/ring+margin trong playRect, backdrop có thể lộ ngoài bounds nhưng collision không đổi.
- [ ] AC2: Roundtrip≤0.5CSSpx at DPR/resize/camera follow, shake on/off mouse ground point không lệch.
- [ ] AC3: Pause/blur/resize/rotate/resume không stale aim/action; desktop mouse và touch angle có riêng evidence.
- [ ] AC4: Legacy default camera/input accepted không đổi ngoài entry rework.

Verify plan: Typecheck/build, focused math/invalidation khi meaningful + browser/input captures 2platform; scene actual sau CODE-07.
Evidence cần có: Rect/zoom/matrix JSON và captures version/viewport/phase tại evidence/CODE-03.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Target/global lock NONE; S1 final và K-U/K-A chưa đủ, CODE-01 chưa có.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ đủ lock/deps và user giao CODE-03.

