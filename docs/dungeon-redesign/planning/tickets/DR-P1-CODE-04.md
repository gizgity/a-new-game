# DR-P1-CODE-04 — Exploration và cửa Boss theo state world

Parent milestone: DR-P1
Kind: CODE
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §6/8.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Chưa discovery/fog hoặc explicit Boss gate state.
Outcome: Live session có fog/Boss-discovery và gate request/accept không mở cửa/refill sai.
IN: WorldSession state/reveal/entry event validation/reset, không save storage hoặc combat damage.
OUT: Boss spawn/AI/phases/rewards/bank, fake progression timer, UI renderer minimap.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1§6/8 locked; K-E progress/pending, K-B activation, K-X entry/reset event contracts approved.
Artifact/task dependencies: CODE-01/02; global lock+assignment. Consumer runtime chưa có chỉ dùng explicit injected fixture events để kiểm state, không claim combat integration.
Input binding: run.ts state transitions khác rework; ArenaScene.setPhase/blur flush pattern; current progression receipt không reuse.
Output: Session reducer/state integration hooks/reset theo entry identity + focused transition tests.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Reveal cells chỉ playing+cell/mask change/range/LOS; known history live giữ, restart clears; no renderer/hover progression.
2. Boss discovered tại doorway approach cell, marker flag độc lập gate kill threshold; unknown không leak full topology.
3. Gate locked/open/engaged/cleared state transitions sau consumer whole-batch event; pending draft blocks entry.
4. request/accept entry identity+alive+fresh approach one-shot; reject reason không refill/spawn/charge loss.
5. Engaged barrier versions cập nhật queries hai chiều; defeat/node exit reset; K-X owns persistence.

Audit source thực tế: ArenaScene.setPhase/resize/handleBlur và run.step/current result ordering audit; no current gate API.
Data/state/input-output/lifecycle: Identity scoped event/result/rejection state; no meta/HP mutation; command id/rearm không duplicate accepted entry.
Thông số: dẫn S1 §6/8; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Logic non-visual TARGET N/A; visual glyph/gate consumers CODE-05/06 phải target approved riêng.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Boss discovered-before-unlock và unlocked-before-discover cho flags đúng, unknown không marker leaked.
- [ ] AC2: Pending/dead/wrong identity/duplicate accept denied, state không jump/Player không teleport.
- [ ] AC3: Pause/transform không reveal, reload entry same map+fog reset theo K-X, không storage write trong reducer.
- [ ] AC4: Engaged mask blocks both directions, clear không tự reward hoặc reopen farm.

Verify plan: Typecheck/build + focused transition/invalidation tests; actual combat boundary sau P2/P4 separately.
Evidence cần có: Event traces pre/post/identity/reasons+injection labels tại evidence/CODE-04.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: K-E/K-B/K-X contracts/global lock và code deps chưa có.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ đủ lock/deps và user giao CODE-04.

