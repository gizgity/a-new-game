# DR-P1-CODE-01 — World definition deterministic và route validation

Parent milestone: DR-P1
Kind: CODE
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §2–4/6.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Chỉ ARENA constant, RunDirector edge spawns; chưa map definition.
Outcome: Pure generator tạo world/masks/anchors ổn định và từ chối map không đạt route/budgets.
IN: World data/config/generator/RNG streams/identity validation và budgets annotation interface.
OUT: Enemy composition/AI/damage/tree rolls/persistence/render/art, auto-fix bằng giảm density/đổi threshold.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1 approved/locked; SPEC-01 comparison resolved; K-E annotation/member-weight/placement schema finalized.
Artifact/task dependencies: Global lock + assignment; không cần ART-01 hoặc P2 implementation để unit-check topology, annotated actual map chờ K-E artifact.
Input binding: movement.ts, run.ts, DraftRandom audit plan§2; S1 schema proposed, không API đang có.
Output: DỰ KIẾN world/config modules theo trách nhiệm thực trong src/game + focused tests phù hợp; canonical seed/definition evidence.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Tạo data contract readonly/ID/version/error, tách renderer RNG và existing legacy draft RNG.
2. Implement fixture808 transform2/grid theo S1 (không override RNG); release phải có algorithm random đường/phân bố bầy được thiết kế/khóa riêng theo S1§3, seed→graph/digest/variant examples chứng minh đường khác sau loại đối xứng. Thiếu thiết kế này STOP phần release, không chốt xoay/lật là đủ.
3. Nhận K-E member/collider/offset/envelope/D06 rounding/placement order và worked placement theo S1§4; kiểm density/cluster gap giữa biên/clearance/budgets. Implement rounding85% bảo toàn N, nhóm dư và per-stage retry snapshots theo S1§3; log layout/count/roster/budget hashes giữ cố định, không reroll rarity hoặc mutate pack sau entry.
4. Failure trả reason/identity/stage cho entry owner, không seed khác/refill/profile write.
5. Bổ sung test script compile module mới thực dùng khi cần, không refactor package/deps unrelated.

Audit source thực tế: movement.ts ARENA/movePlayer, DraftRandom.next, run.start/spawn paths; target runtime modules chưa tạo.
Data/state/input-output/lifecycle: Pure identity→definition/result, stage BUDGET_UNANNOTATED không giả full map valid; constraints/seed/rounding/retry từ S1, gameplay weights từ R06.
Thông số: dẫn S1 §2–4/6; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Non-visual logic; TARGET N/A, không vẽ floor/placeholder để pass. Geometry test data khác production image.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Same identity có canonical digest bằng nhau trên rebuild/locale/device, renderer gọi không tiêu RNG.
- [ ] AC2: Fixture route lengths/connectivity và cả hai budgets đúng; có feasibility placement45–70/D06 từ K-E, rounding/nhóm dư/retry trace đúng S1, không dùng route193D/ledger đếm làm bằng chứng fit. Coverage release random đường và ba biến thể có spec/target/seed cases riêng, không claim từ một topology.
- [ ] AC3: Bad identity/no path/no placement/zero elite/attempt exhaustion structured fail, không entry side effect.
- [ ] AC4: Legacy default/runtime/profile untouched, no new dependencies/framework.

Verify plan: Typecheck/build + focused deterministic/invalid/budget tests, all transformed layouts và boundary depth profiles với K-E; không test fake duplicated algorithm.
Evidence cần có: Candidate code/spec hash + seed/input/output/digests/rejection table trong evidence/CODE-01.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: S1 chưa SPEC_READY/locked; release random-route algorithm/ba biến thể chưa đủ thiết kế/targets (P1/CONCEPT-01); K-E collider/member/envelope/D06 rounding/placement-order và worked feasibility còn OPEN (P2 cấp, P1 kiểm); Atlas/global lock thiếu. Lượt sửa docs không thực hiện các child tasks này; geometry candidate không tự READY.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ đủ lock/deps và user giao CODE-01.

