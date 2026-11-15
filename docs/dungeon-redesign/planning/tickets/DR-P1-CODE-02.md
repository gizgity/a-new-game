# DR-P1-CODE-02 — World collision, path và wall queries thống nhất

Parent milestone: DR-P1
Kind: CODE
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §5/6.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Move/dash/knockback clamp rectangle, đạn chưa wall hit.
Outcome: Một query layer cho clearance/sweep/slide/LOS/path/gate để consumer dùng cùng geometry.
IN: Geometry query/navigation implementation, gate mask version invalidation, focused collision tests.
OUT: Action/AI/Boss resolver toàn bộ, damage changes, art collision theo alpha, world physics engine mới.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1§5 approved/locked; K-A/K-E/K-B radius/zone/query consumption contracts finalized.
Artifact/task dependencies: CODE-01 definition; lock/assignment. P3/P2/P4 tích hợp từng consumer trong tickets họ, không giả query unit PASS là gameplay wall PASS.
Input binding: combat.ts clampPosition/segmentHitsCircle/stepProjectiles và movement.ts audit plan§2.
Output: DỰ KIẾN query module/navigation code+focused cases, API result/error/zone rõ.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Implement canOccupy/sweepDisc/firstWallHit trên static mask+gate/version; earliest contact normal/fraction, tie wall thắng actor.
2. Implement walk slide bounded contacts theo spec, no tunneling khi Dash/knockback delta lớn; không refund distance/time/resource.
3. Implement A*clearance4neighbors/ties/smoothing hợp sweep; NO_PATH không teleport/cắt góc.
4. Expose point LOS/same-zone queries cho aim/area/aggro; invalid endpoints/no diagonal-through-wall.
5. Liệt kê consumer adapter changes chuyển P2/P3/P4 owners, không dồn runtime integration ngoài scope vào ticket này.

Audit source thực tế: Source paths/call sites plan§2; future query API S1 proposal chưa tồn tại.
Data/state/input-output/lifecycle: Input world/maskVersion/radius/from/to/zone; output hit/path/reason deterministic, không renderer-dependent or profile writes.
Thông số: dẫn S1 §5/6; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Non-visual; target N/A; debug geometry chỉ evidence annotations, không procedural environment art.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Swept fast motion/concave corner/slide/wide actor/closed gate không tunnel, NO_PATH đúng với actor không đủ clearance.
- [ ] AC2: LOS/projectile qua góc/tường/gate blocked, wall tie ưu tiên và geometry units không đổi theo device.
- [ ] AC3: Mask gate change invalidates nav/LOS caches đúng version, query không mutate definition.
- [ ] AC4: Không chỉnh balance/timing/actor scale hoặc dependency engine.

Verify plan: Typecheck/build + focused wall corner/tunneling/path/gate tests có expected geometry; consumer gameplay cases sau adapters.
Evidence cần có: Geometry fixtures/code/spec hashes và hit/path tables; actual movement/damage coverage ghi riêng.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Global lock/S1 final locked/consumer contracts và CODE-01 chưa có.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ đủ lock/deps và user giao CODE-02.

