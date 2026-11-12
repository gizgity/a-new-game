# A-H2 — Task Card Template (Combat V2)

> **APPROVED v1 · 2026-11-12.** User xác nhận “uh chốt h2” cho đúng A-H2 Task Card Template. Không phải approval hình ảnh hoặc gameplay. Mẫu để copy cho **một thay đổi duy nhất** vào `docs/combat-v2/tasks/<TASK-ID>.md`. Không tự tạo hàng loạt task. Không khóa camera, style, palette, animation, gameplay hay balance; các giá trị đó thuộc spec đã duyệt từng task. Tuân thủ `HARNESS.md` (A-H1) và `REFERENCE_PROTOCOL.md` (A3).

## Mẫu task card (copy đúng một task khi bắt đầu)

```md
# <TASK-ID> — <Một thay đổi quan sát được>

Status: PROPOSED
Kind: DESIGN | IMPLEMENT | REVIEW
Revision: 1
Owner approval: NONE
Last updated: YYYY-MM-DD
Related phase: <B/C/D/E>; previous task: <id hoặc NONE>
Source request: <quote user + ngày + link nếu có; không bịa permalink>
Docs read: <AGENTS, HARNESS, MASTER_PLAN, DESIGN_BIBLE, GAME_BRIEF, ART_BIBLE / DDR nếu liên quan>

## 1. One change / Outcome
Before: <trạng thái hiện hành có bằng chứng>
After: <một kết quả khác biệt người xem kiểm được>
Why: <liên hệ Experience Vision>
Scope IN: <phần được thay, các file dự kiến>
Scope OUT: <các phần KHÔNG thay; gameplay/balance/collider/input nếu chưa duyệt>
Dependency: <task/ref thật sự phải có trước; không mặc định>

## 2. Design choices — CHƯA tự khóa
Baseline fallback: <link + version>
Proposed change: <mô tả candidate; chỉ đề xuất đến khi duyệt>
Keep: <phần kế thừa>
Supersedes: <spec/ref nào, chỉ rõ phạm vi; NONE nếu không>
Unknown/TBD: <câu hỏi chưa giải quyết; thiếu thông tin quan trọng => STOP>
Platform/context: <mobile/desktop, viewport, orientation và state thực tế cần xem>

## 3. Reference bindings
Baseline ref: <ID + path + revision hoặc NONE>
Concept refs: <ID + path + revision/status hoặc NONE>
Target ref: <ID + path + revision + APPROVED?; NONE trước user approval>
Reference manifest: <path hoặc NONE>
Must match: <những dấu hiệu đã được duyệt phải đúng>
Flexible: <phần Codex được tinh chỉnh kỹ thuật>
Must not infer: <chi tiết không thể suy ra từ ảnh như damage, hitbox, timing, AI>
Source/rights: <ảnh do ai tạo, nguồn/prompt/quyền dùng nếu cần>

## 4. Acceptance — kiểm chứng được
- [ ] AC1 <quan sát/hành vi cụ thể, hoàn cảnh, pass/fail>
- [ ] AC2 <đối chiếu reference đúng scale/trigger>
- [ ] AC3 <mobile và desktop nếu tác động>
- [ ] AC4 <không regress ngoài phạm vi>
Evidence plan: <runtime screenshot/clip/test, expected filenames và versions>
Non-goals: <điều task này không kiểm/không cam kết>

## 5. Approval gate
Approval status: AWAITING USER VISUAL APPROVAL | APPROVED FOR IMPLEMENTATION | NOT APPLICABLE (non-visual)
Approved scope: <phần cụ thể hoặc NONE>
Approved spec revision: <revision hoặc NONE>
Approved refs: <IDs + revisions hoặc NONE>
Approval quote/date/source: <bằng chứng chính xác hoặc NONE>
STOP if: <thiếu approved target, reference sai, xung đột, scope đổi, dependency chưa có>

## 6. Implementation (chỉ điền sau approval phù hợp)
Prompt ID: <link/commit hoặc NONE>
Changed files: <danh sách diff>
Implementation commit: <SHA hoặc NONE>
Build/typecheck/focused tests: PASS | FAIL | NOT CHECKED (+lý do)
Scope audit: PASS | FAIL | NOT CHECKED
Preview app scenario / baseline SHA / candidate SHA: <ghi thật, không gọi hai iframe cùng code là A/B>
Runtime evidence: <file/link/viewport/seed/revision, hoặc NONE>
Compliance AC1..AC4: PASS | FAIL | NOT CHECKED + bằng chứng / lý do

## 7. Review and handoff
Technical: PASS | FAIL | PARTIAL | NOT CHECKED
Visual review: AWAITING USER | APPROVED | REJECTED | NOT APPLICABLE
User playtest: AWAITING USER | ACCEPTED | REJECTED | NOT APPLICABLE
Known gaps: <gaps, không che FAIL>
Final status: PROPOSED | AWAITING USER VISUAL APPROVAL | APPROVED FOR IMPLEMENTATION | IMPLEMENTED-NEEDS-REVIEW | ACCEPTED | BLOCKED | SUPERSEDED
NEXT ACTION (exactly one): <một task/decision tiếp theo hoặc STOP>
```

## Rule set kiểm task card

1. **DESIGN-only:** được tạo proposal/concept mà chưa có approved target. Chưa được CODE.
2. **IMPLEMENT visual:** bắt buộc có **approved spec revision + approved target ref + scope**. Thiếu một trong ba => STOP.
3. **Một task một thay đổi:** nếu Player body + attack + HUD là ba kết quả độc lập => tách ba card. Không gộp do cùng phase.
4. **Ảnh có ranh giới:** `Must match` là phần phải theo; `Flexible` cho phép lựa chọn kỹ thuật; `Must not infer` ngăn Codex tự đoán mechanic.
5. **Thay design:** user có thể đổi bất cứ lúc nào; tạo revision mới, nêu supersedes và impact, không sửa/xóa approval lịch sử. Baseline không phải luật bất biến.
6. **Verification:** code PASS không có nghĩa đúng design; screenshot target không phải runtime evidence; preview app chỉ là công cụ quan sát.
7. **Handoff:** chỉ có một NEXT ACTION; trạng thái task và acceptance người dùng độc lập với CI/deploy.
8. **KISS:** không sinh task rỗng, không thêm công cụ/template engine hay pipeline nặng cho việc này.

## Ví dụ *không phải task đã mở*

`B1 Player Base` được dùng làm ví dụ khi bắt đầu Phase B. **Chưa tạo B1 card, chưa có target được duyệt**. Sau A-H3 và A-H4/Gate A, mới lập `tasks/B1-...md` và tạo concept/target để user duyệt, tiếp đến implementation và review.

## A-H2 gate / next action

A-H2 hoàn thành ở mức DOC khi mẫu chứa đủ: scope, anti-scope, before/after, ref bindings, approval, AC/evidence, changed files, commit, status, next action. **A-H2 APPROVED v1**, được user chốt ngày 2026-11-12.

A-H3 đã liên kết `AGENTS.md`. Tình trạng toàn dự án và bước tiếp theo được theo dõi ở `MASTER_PLAN.md` và `HANDOFF.md`, không tự mở production.
