# Mẫu task ticket — điền khi mở planning milestone

Chỉ tạo file thật khi có work item cụ thể. File đích đề xuất `docs/dungeon-redesign/planning/tickets/<TASK-ID>.md`; chưa tạo thư mục/ticket rỗng. ID ổn định: `DR-Pn-KIND-nn`, ví dụ minh họa `DR-P3-SPEC-01` (không phải task đã mở).

Ticket là bản planning; khi execution dùng card [A-H2](../../combat-v2/TASK_CARD_TEMPLATE.md), dẫn ngược ticket và lock. Không thay Harness bằng mẫu này. Xóa hướng dẫn không liên quan khi điền; mục N/A cần lý do, không bỏ trống dependency/approval/evidence.

```md
# <TASK-ID> — <một outcome>

Parent milestone: DR-Pn
Kind: PLAN | SPEC | CONCEPT | ART | CODE | VERIFY
Status: DRAFT
Revision: 1
Session assignment: NONE hoặc quote/ngày/scope user đã giao
Source: Rxx + mục spec/revision + nguồn approval
Lock binding: NOT_LOCKED hoặc LOCK-ID/revision
Execution card: NONE hoặc path thật

## Intent và scope
Vấn đề / before có evidence:
Outcome / after quan sát được:
Vì sao cần cho intent milestone:
IN:
OUT:
Giữ nguyên / phần supersede rõ phạm vi:

## Dependencies và thứ tự
Spec dependencies (phải rõ trước khi code):
Artifact/task dependencies (phải hoàn tất trước execution):
Input artifacts + path/revision/hash/status:
Output artifacts + path dự kiến:
Task bị ảnh hưởng phía sau:

## Việc cần làm cụ thể
1. <hành động + file/state/asset liên quan + kết quả mong đợi>
2. <bước tiếp theo có dependency rõ>
Audit source thực tế: <path/call site hoặc UNVERIFIED, cần audit trong planning>
Data/state/input-output contract:
Thứ tự event/commit/cancel/pause/save/error nếu liên quan:
Thông số: <dẫn spec, không chép các bản số khác nhau>
Integration boundaries / cách giữ playable:
Điều Codex được tự quyết về implementation:
Điều chưa biết cần giải trong planning:

## Visual/audio/UI bindings khi liên quan
Baseline / concept / TARGET: <IDs, paths, revisions, status; NONE nếu chưa có>
Must match / flexible / must not infer:
States/poses/geometry/timing/scale/viewport:
Mockup/crowd/grayscale/4góc:
Source production/export/pivot/alpha/format/provenance:
UI vi/en keys và touch/keyboard-mouse lifecycle:
Nếu N/A: <lý do>

## Acceptance và evidence
- [ ] AC1 <precondition → thao tác → expected result>
- [ ] AC2 <đối chiếu spec/target hoặc focused logic invariant>
- [ ] AC3 <mobile/desktop đúng scope hoặc lý do N/A>
- [ ] AC4 <không regression ngoài scope>
Verify plan: <typecheck/build/focused tests/capture/playtest phù hợp, không mọi loại mặc định>
Evidence cần có: <path dự kiến, scenario/seed/version/viewport/device>
Coverage chưa kiểm / giới hạn:

## Readiness và approval
Blocking TBD / cách giải / dependency chịu ảnh hưởng:
Spec ready audit:
Approved spec/ref revisions + quote/ngày/source:
Global lock status:
Execution authorized: NO hoặc quote/scope user giao trong session execution
STOP nếu:

## Kết quả khi execution thực sự diễn ra
Changed files / commit / evidence: NONE
Technical / visual / user playtest: NOT CHECKED
NEXT ACTION: <một hành động trong đúng scope được giao hoặc STOP>
```

Coverage matrix của milestone đặt ở detailed plan thực tế khi lập:

| Requirement / AC | Spec path + mục/revision | Task IDs | Evidence / verify | Gap chặn lock |
| --- | --- | --- | --- | --- |

Không điền giả path/ref/approval để hết ô trống. Blocking TBD hợp lệ trong DRAFT/PLANNING; không hợp lệ khi agent trình lock hoặc mở task CODE/ART production.
