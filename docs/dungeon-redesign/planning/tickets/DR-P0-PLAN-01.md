# DR-P0-PLAN-01 — Bản đồ coverage và dependency planning toàn rework

Parent milestone: DR-P0
Kind: PLAN
Status: ACCEPTED — USER PLAN APPROVAL
Revision: 1 · 2026-11-15
Session assignment: user mở planning DR-P0, chỉ coverage/dependencies/thứ tự planning; bàn giao review rồi dừng (2026-11-15, hội thoại hiện tại, không permalink).
Source: R01–R12 V1 tại `cc6f54c`, approval C09; R12 amended.
Lock binding: DR-LOCK-01 rev0 NOT_LOCKED
Execution card: NONE — task tài liệu planning; chưa CODE/ART execution.

## Intent và scope

Before: setup có draft P0–P6 và manifest rỗng, chưa coverage/owner/thứ tự planning; P2 có dependency P3/P4 dễ bị hiểu thành vòng implementation.
Outcome: [DR-P0_PLAN rev1](../DR-P0_PLAN.md) dẫn toàn baseline tới spec owner, evidence, gaps và hợp đồng theo thứ tự không vòng.
IN: hồ sơ điều phối P0, tickets P0 có outcome thật, đồng bộ manifest/draft/resume/handoff.
OUT: detailed planning/child tickets P1–P6, giải quyết schema/thuật toán/targets, research footage thực tế, artwork/code/build/deploy/commit/push/shutdown. Không thay baseline, Harness/Bible/DDR hoặc package-lock có diff trước task.

## Dependencies và thứ tự

Spec dependencies: [WORKFLOW rev1](../WORKFLOW.md), [draft P0](../MILESTONE_DRAFTS.md#dr-p0--chốt-hồ-sơ-và-coverage-planning), [REVIEW_V1](../../REVIEW_V1.md), [C09](../../DESIGN_CHECKLIST.md#c09--duyệt12mục-và-bổ-sung-planningspec-lock-2026-11-14).
Artifact/task dependencies: setup DUNGEON-PLAN-FLOW-01 đã có; không cần P1–P6 hoặc runtime mới để lập bản đồ.
Input binding: baseline hash/commit/source approval tại plan §2; branch snapshot `0ee02af70ab530ad81c0ff84069b7e4fbf68fd9a`.
Output: plan rev1; ticket này; [DR-P0-VERIFY-01](DR-P0-VERIFY-01.md); status index trong WORKFLOW/SPEC_LOCK/MILESTONE_DRAFTS/RESUME/HANDOFF.
Downstream: các planning milestone P1–P6 và closure P0 khi được giao, không tự kích hoạt.

## Việc cụ thể / contract

1. Đối chiếu CURRENT, baseline/approval, workflow/lock và Harness; không hỏi lại R01–R12.
2. Ghi spec homes dự kiến, mỗi contract một producer; phân biệt audited source và UNVERIFIED, không khóa API giả.
3. Lập matrix C01–C32 với spec section dự kiến/owner/evidence/gap; log Qxx dẫn nguồn, không xóa lịch sử.
4. Vẽ dependency hợp đồng khác artifact/implementation, cho P2 dùng contract P3/P4 trước production; nêu closure feedback.
5. Xếp thứ tự planning với entry/output/điều kiện còn thiếu, gap owner và lock readiness; tạo ticket closure thực sự cần nhưng chưa giao.
6. Kiểm docs và cập nhật CURRENT, một next action chờ user review.

Audit source: phạm vi thực đã đọc ghi ở plan §3; behavior/module ngoài vùng đọc UNVERIFIED, audit lại khi planning milestone cụ thể. Data/input-output ở task này là baseline→coverage/spec owner/dependency/evidence. Event/save/UI không thay đổi. Thông số chỉ dẫn R01–R12; integration N/A vì không runtime. Agent tự quyết cách trình bày/mã coverage, không tự chọn lát cắt hoặc balancing.

## Visual/audio/UI bindings

N/A cho output task này: chỉ Markdown, không tạo/review ảnh hoặc âm. Plan chỉ phân công target/evidence cho các owner; source refs/rights/scale/state/vi-en/input lifecycle phải được điền trong detailed tickets đúng scope sau. Concept/TARGET mới: NONE; visual audit NOT CHECKED.

## Acceptance và evidence

- [x] AC1 R01–R12 đều có mapping owner/spec dự kiến/evidence/gap; không dùng hash/approval baseline thành lock mới.
- [x] AC2 Có thứ tự planning và đồ thị contract không vòng; dependency implementation/target closure khác contract.
- [x] AC3 Gaps Atlas/visual/device và shared actions/encounter/outcome/transaction có owner và điều kiện đóng; platform được phân công cụ thể.
- [x] AC4 Manifest/draft/handoff phản ánh P0 PLANNING, P1–P6 DRAFT, NOT_LOCKED; runtime/assets/Bible/DDR/production/package-lock bảo toàn; dừng đúng scope.

Verify plan: diff whitespace/local links + coverage/contract walkthrough + scope audit; không build/tests game. Evidence: plan §2–8 và diff tài liệu. Kiểm nguồn snapshot/hash baseline, package-lock trước/sau, main revision; không network hoặc measurement runtime.
Coverage giới hạn: chưa có detailed milestone specs/tickets/targets/device measurements; mapping ở cấp planning không chứng minh full release readiness.

## Readiness và approval

Blocking TBD cho task tài liệu này: NONE sau audit; unresolved cho toàn rework tại plan §7.
Spec ready audit: hồ sơ điều phối đã có, **chưa SPEC_READY toàn P0**.
Approved design baseline: user “all y”, 2026-11-14, C09. User plan approval rev1: **“y”**, 2026-11-15, hội thoại hiện tại không permalink, ngay sau bàn giao bản rev1; hash trước approval ghi tại đầu plan. Chỉ duyệt hồ sơ điều phối, không hoàn tất toàn P0/spec lock hoặc giao milestone tiếp.
Global lock: NOT_LOCKED. Execution authorized: chỉ task PLAN này; CODE/ART **NO**.
STOP nếu scope chuyển sang giải quyết milestone kế/production hoặc có conflict baseline; bàn giao review rồi dừng.

## Kết quả lượt planning

Changed files: plan, hai tickets P0 và status docs nêu trên; commit/push/deploy NONE.
Technical docs: PASS — whitespace diff, 8 file tài liệu/107 local links+anchors hợp lệ (bỏ fenced template), C01–C32/R01–R12 và K-W→K-U đủ/không vòng; walkthrough bên dưới PASS ở mức tài liệu.
Protected scope: package-lock SHA256 `42F4579FD99A0D649C9918E0EAE48821AA23A2CEC57AEDD71C105841AAD1359D`, main `63f4f3b88826eb556664bf240e8be538e8f654e6`; REVIEW_V1/log/DDR/Bible/runtime/assets không thay trong lượt.
User plan review: ACCEPTED — USER PLAN APPROVAL rev1. Lượt ghi nhận chỉ sửa status/approval/handoff, kiểm diff/link/consistency; không build/tests game. Visual/user playtest: N/A cho docs; runtime rework NOT CHECKED.

| Walkthrough tài liệu | Expected / kết quả audit |
| --- | --- |
| P2 cần skill/Boss khi chưa có implementation | K-A/K-E/K-B được lập theo thứ tự; chưa cần runtime, final slice bindings chờ closure — PASS |
| P1 target cần HUD P6, P5 legality cần Boss P4 | Dependency artifact final được ghi riêng, không quay ngược graph contract — PASS |
| Review kế hoạch P0 trước khi có specs/targets | P0 PLANNING; plan NEEDS_REVIEW; P1–P6 DRAFT; manifest NOT_LOCKED — PASS |
| Thiếu Atlas/targets/device measurements | Gap có owner, pre-lock cần specs/targets/protocol; runtime measurements/feel sau implementation, không claim PASS hoặc bỏ scope — PASS |
| Giao CODE trước global lock hoặc tự làm VERIFY-01 sau bàn giao | Chưa có quyền/dependencies, STOP; không dùng tickets/backlog làm assignment — PASS |

NEXT ACTION: DỪNG; chờ user giao planning DR-P1 trong session mới theo thứ tự đã duyệt.
