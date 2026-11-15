# DR-P1-VERIFY-01 — Báo cáo seed/route/query/session theo K-W

Parent milestone: DR-P1
Kind: VERIFY
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §11 W01–06/08.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Chưa runtime dungeon; existing tests/routes chỉ build routes.
Outcome: Technical report exact version cho world invariants, integration cases thiếu được ghi riêng thay vì giả PASS.
IN: Focused logic/runtime validation geometry/determinism/budget/gate/isolation, báo actual failure/coverage.
OUT: Comprehensive QA/replay framework, tune numbers/implementation ngoài ticket, tự acceptance.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1 locked exact version; K-A/K-E/K-B/K-X contracts mapped; AC S1 W01–06/08.
Artifact/task dependencies: CODE-07 và all P1 implementations; K-E actual annotation cho budget, P3 core adapter cho Dash/ground-cast/wall hits, P2/P4 actual gate encounter cho isolation. Áp dụng bảng S1§11: annotated K-E input/feasibility và mọi tiêu chí world P1 là bắt buộc; P2/P3/P4 combat/P5 full-save runtime là kiểm tích hợp chuyển owner, không prerequisite nghiệm thu world. PARTIAL chỉ mô tả tích hợp còn thiếu, không miễn hoặc ACCEPT core P1 còn thiếu.
Input binding: Build/source/target/spec identities + seed808 và transformed seeds/depth/Asc/mod edge fixtures; fixture injected metadata không thay actual integration.
Output: DỰ KIẾN docs/dungeon-redesign/evidence/DR-P1-VERIFY-01/REPORT.md + minimal raw seed/case tables/traces.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Pin code/spec/target/export hashes, entry steps và real-vs-injected distinction; không chạy suite không liên quan.
2. Kiểm same identity rebuild/cross device input/locale parity, connectivity và hai main budgets actual member totals; validate invalid seeds/zero elite/no space/retry error.
3. P1 bắt buộc kiểm movement/sweep/path/wall query ở góc/door và các clearance radius từ K-E; actual Dash/knockback/projectile/ground-cast qua adapter P3 là kiểm tích hợp chuyển P3, chưa có ghi NOT CHECKED riêng.
4. P1 bắt buộc kiểm Boss-discovery/gate/pending/engaged/restart state và zone query với commands injected có nhãn; damage/projectile actual encounter/isolation chuyển P2/P4 với combat traces khi consumer có.
5. P1 bắt buộc kiểm pause/error/session rebuild same seed/definition/annotated initial packs, fog reset và no writes production keys/no bank-refill giả; reload persisted entry/pending/terminal và storage integrity chuyển P5 với profile traces theo K-X.

Audit source thực tế: Existing tests routes/combat/run/autoaim và package compile list audit plan§2; không coi tests lịch sử là coverage dungeon.
Data/state/input-output/lifecycle: Expected S1 từng case, actual digest/state/events/version; failure không nới baseline hoặc xóa optional để PASS.
Thông số: dẫn S1 §11 W01–06/08; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Visual review N/A cho báo cáo logic; gate/source drawings chỉ evidence context, không TARGET hoặc user approval.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Mọi outcome P1 trong W01–06/08/S1§11 có PASS/FAIL và raw evidence seed/version, rounding/retry/fixed snapshots, annotated budgets+feasibility; core NOT CHECKED/BUDGET_UNANNOTATED không đủ nghiệm thu P1.
- [ ] AC2: Bảng chuyển tích hợp ghi owner P2/P3/P4/P5 và evidence actual cần có cho action wall-hit/Boss combat/full-save; chưa adapter ghi NOT CHECKED riêng phần đó, vẫn kiểm đầy đủ query/gate injected state/session rebuild/no production writes của P1.
- [ ] AC3: Technical tests/typecheck/build thích hợp PASS trước handoff, fail có owner/blocker, không tự sửa ngoài scope.
- [ ] AC4: Không gán user acceptance hoặc mở P2/P3/milestone tiếp từ report.

Verify plan: Dùng existing focused Node tests + browser cases cần thiết; không framework/CI mới; build/test sau changes trước verify không lặp vô lý nếu exact hash đã có PASS.
Evidence cần có: Case matrix seeds/versions/input/expected/actual/digests + traces; device emulation labels, no naturalrun/FPS claims.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Runtime/deps/global lock NONE; actual full combat/save cases phụ thuộc P2/P3/P4/P5 artifacts sau này.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ implementations/deps và user giao VERIFY-01.

