# DR-P1-PLAN-01 — Hồ sơ world/camera đủ để review

Parent milestone: DR-P1
Kind: PLAN
Status: ACCEPTED — USER PLAN APPROVAL
Revision: 2 · 2026-11-15
Session assignment: User mở planning DR-P1 ngày2026-11-15; audit source/assets, specs/tickets, chưa implement, bàn giao review rồi dừng; hội thoại hiện tại không permalink.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **PROPOSED**; S1 §1–11; plan §1–9.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: P1 chỉ có intent draft, chưa source audit/spec/ticket chi tiết.
Outcome: Plan + S1 candidate + coverage/deps/missing + 15ticket có thật, user có bộ tài liệu cụ thể để review.
IN: Audit read-only và Markdown P1/status index/handoff.
OUT: Thực hiện child tickets, code/artwork/build/tests game/DDR/Bible/commit/push/deploy.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: R06/R11/R12 V1/C09; P0 rev1 approved planning; workflow rev1; Harness/A-H2/A3 đã duyệt.
Artifact/task dependencies: Nguồn repo hiện tại và baseline image index; không cần runtime dungeon để planning.
Input binding: Review V1 tại cc6f54c (baseline hash ở SPEC_LOCK); P0 rev1 approval “y” 2026-11-15; source HEAD0ee02af, audited hashes plan§2.
Output: DR-P1_PLAN.md + specs/DR-P1_WORLD.md rev2 + các tickets liệt kê plan§5; status index/SPEC_LOCK/RESUME/HANDOFF.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Đọc đúng CURRENT/baseline/Harness, xác định AC và giữ scope planning.
2. Đọc source thật và mở4ảnh baseline; phân biệt geometry/logic hiện có với subsystem chưa có.
3. Viết candidate K-W có identity/RNG/generation/query/gate/camera/fog/art contracts; chỉ dẫn R06 cho balance, không copy số khác.
4. Tạo actual child ticket IDs/coverage/evidence/deps; nêu Atlas/target/consumer gaps và điều kiện đóng.
5. Audit tài liệu/hash/link/scope, cập nhật handoff đúng một next action review rồi dừng.

Audit source thực tế: Các paths/call sites và hashes đã audit tại plan§2; không source path giả.
Data/state/input-output/lifecycle: Một nguồn S1 cho chi tiết mới; baseline R01–R12 lấy Review V1. Chỉ status P1/index thay, P0 approved plan giữ nguyên.
Thông số: dẫn S1 §1–11; plan §1–9; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Đã mở DR-BL-ENV/M390/D1440/G390; chỉ baseline, target NONE. Read game-art để lập ticket/binding, không tạo/review artwork mới.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [x] AC1: Mỗi requirement P1 có spec section/ticket/evidence/owner gap, không requirement mồ côi.
- [x] AC2: Điểm source/API thật hoặc dự kiến được phân biệt; chưa có target không ghi APPROVED.
- [x] AC3: Hai DAG không vòng, global lock vẫn NOT_LOCKED; P2–P6 không tự mở.
- [x] AC4: Diff của lượt này chỉ Markdown; production/runtime/assets/package-lock và approval lịch sử giữ nguyên (existing package-lock diff không đổi).

Verify plan: Diff/local links/consistency/schema/deps walkthrough; không build/typecheck/game tests.
Evidence cần có: Plan§2/4/6–9, ticket này và CURRENT; không renderer/visual/playtest evidence mới.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Atlas sample/3target/consumer closure/global spec lock còn thiếu, không chặn bàn giao planning; chặn production như plan§7.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 approved planning qua “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, global lock NOT_LOCKED.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: YES chỉ audit/docs planning theo user ở đầu ticket; không child execution.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files/evidence: plan/S1/tickets P1 và status indices/handoff; xem plan§9. Technical docs audit PASS:17file P1/15tickets, local link audit,10node artifact DAG không vòng, route193D/204D và hai budget success/failure examples đúng; diff protected paths so snapshot đầu task giống hoàn toàn, git diff --check PASS. File hashes candidate tại SPEC_LOCK. User plan approval ACCEPTED — PLANNING ONLY qua “y”,2026-11-15; nguồn/binding tại đầu plan. Không game build/test/deploy.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
Rev2: user giao riêng sửa5gap audit, chỉ các đoạn liên quan và bindings. Đã kiểm local links/anchors, candidate hashes, rounding/group-count45–70 và consistency boundary P1/integration; không xác nhận placement/Atlas/targets đã đạt. SPEC-01/CONCEPT-02/03 giữ nguyên body đủ yêu cầu, chỉ đổi source binding/revision. Global lock vẫn NOT_LOCKED, P0/baseline/package-lock và thay đổi có sẵn giữ nguyên.
NEXT ACTION: DỪNG; chờ user giao task/planning tiếp theo trong session mới. Không tự thực hiện child task, mở DR-P3 hoặc implementation.

