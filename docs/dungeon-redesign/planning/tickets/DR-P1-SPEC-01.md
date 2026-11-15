# DR-P1-SPEC-01 — Đối chiếu Atlas và đóng reference mật độ

Parent milestone: DR-P1
Kind: SPEC
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; Plan §4; S1 §1/3/4/10.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: R06 có candidate density đã duyệt nhưng chưa footage đếm được.
Outcome: Một memo quan sát có timestamp/limitations và bảng đối chiếu R06 dùng được cho density P2.
IN: Research/view/đếm sample, reference memo và delta candidate nếu cần.
OUT: Tạo art/copy PoE assets, tune balance/runtime, đổi R06 không approval.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: R06 V1, S1 world geometry candidate, P0 G01.
Artifact/task dependencies: Footage continuous PoE1 phù hợp protocol plan§4; không cần code P1/P2.
Input binding: Primary GGG Atlas page và embed đã audit plan§4; embed fetch Cache miss, chưa viewed; phải tìm footage đủ điều kiện thay vì giả dùng trailer.
Output: DỰ KIẾN specs/DR-P1_ATLAS_REFERENCE.md rev1: source ledger/timestamps/counts/observed-vs-inferred/delta và handoff P2.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Tìm clip công khai đủ điều kiện mapping liên tục theo plan§4, ghi provenance/context/version/build/mods UNKNOWN khi không biết.
2. Xem đúng sample; đánh dấu cut/occlusion/traverse/combat, đếm cluster/pack/rarity với lower bounds khi cần, không đếm lại một bầy qua frame.
3. Đối chiếu route/pocket/spacing/rarity/clear cadence R06 bằng observed→candidate→limitation, không đổi video pixels sang D khi thiếu calibration.
4. Nêu proposal delta/impact nếu reference không hỗ trợ candidate; P2 nhận memo để hoàn thiện placement/roster spec, user review phần thay đổi.

Audit source thực tế: S1/plan§2 world source đã audit, không runtime source cần sửa.
Data/state/input-output/lifecycle: Output là reference observation, không gameplay asset hoặc chứng minh full map density; không dùng timer/camera PoE làm luật game.
Thông số: dẫn Plan §4; S1 §1/3/4/10; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

External footage chỉ reference mechanics/composition; không production rights. Memo pin URL/title/uploader/access/time ranges; screenshots chỉ khi quyền phù hợp, có nhãn external.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Sample có nguồn/context/start-end và ≥protocol sample; thiếu thì báo BLOCKED cụ thể, không giả complete.
- [ ] AC2: Mọi số đo truy lại time range được, observed/inferred/UNKNOWN rõ; không extrapolate total map từ viewport.
- [ ] AC3: R06 không bị âm thầm thay; P2 nhận conclusions/delta/limits rõ, không hứa đạt feel/FPS.
- [ ] AC4: Không art/runtime/save/legacy baseline changes.

Verify plan: Read/view sample và audit arithmetic/table nguồn; docs-only không game build/test.
Evidence cần có: Memo/time ledger + comparison; runtime feel deferred VERIFY-02/P2/P6.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Chưa chọn/xem footage đủ điều kiện; task design-only cần user giao riêng, sample không load thì tìm nguồn khác hoặc ghi blocker.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ user giao SPEC-01 design-only.

