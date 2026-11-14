# Spec lock manifest — Dungeon Rework

Lock ID: DR-LOCK-01 · Revision: 0 (chuẩn bị cấu trúc, chưa trình khóa).
Status: **NOT_LOCKED** · Implementation: **NOT AUTHORIZED**.
Ngày:2026-11-14 · Task setup: DUNGEON-PLAN-FLOW-01.

User đã duyệt12mục thiết kế và yêu cầu planning trước lock; không dùng “all y” làm bằng chứng đã khóa các detailed specs chưa tồn tại. Mọi milestone/task thực hiện trong session mới được giao riêng. Tuân thủ [WORKFLOW](WORKFLOW.md).

## Scope khóa dự kiến

Toàn dungeon/skill rework đã duyệt: P1–P6, kế thừa R01–R11 và R12 amended. P0 điều phối coverage/lock. Không gồm cosmetic/migration/legacy archive, B1 bị dừng, production/main/deploy. Muốn đổi scope khóa phải ghi rõ chỉ dẫn user, không tự bỏ các phần chưa plan để bắt đầu code.

## Baseline thiết kế được duyệt

Artifact: [REVIEW_V1.md](../REVIEW_V1.md), nội dung tại commit `cc6f54c`.
SHA256 file ở commit đó: `E604C6EB353BEABC3DEB45BED0A0CDCCAAAF4036459857602460A7BA3375F713`.
Approval: user “all y”,2026-11-14, hội thoại hiện tại không permalink; R12 có bổ sung flow tại C09 trong [log](../DESIGN_CHECKLIST.md). Hash trên ràng buộc bản đã review, không phải hash bản có banner trạng thái sau ghi nhận approval.

| Milestone | Nguồn baseline | Detailed plan/tickets | Specs/targets cho implementation | Lock state |
| --- | --- | --- | --- | --- |
| DR-P0 | R01–R12 + C09 | Chưa mở planning; [draft](MILESTONE_DRAFTS.md#dr-p0--chốt-hồ-sơ-và-coverage-planning) | Coverage/manifest chưa hoàn tất | NOT_LOCKED |
| DR-P1 | R06/R11 | Chưa có | World/camera/minimap/biome target chưa có | NOT_LOCKED |
| DR-P2 | R01/R06–R10 lát cắt | Chưa có | Pack/AI/input/flask/first Boss contracts chưa chi tiết | NOT_LOCKED |
| DR-P3 | R01–R03/R10–R11 | Chưa có | Skill/support/build transactions/targets chưa chi tiết | NOT_LOCKED |
| DR-P4 | R08/R09/R11 | Chưa có | Boss states/pattern/animation targets chưa có | NOT_LOCKED |
| DR-P5 | R04/R05/R09/R10 | Chưa có | Tree/mod/save/claim schemas/UI targets chưa có | NOT_LOCKED |
| DR-P6 | R10–R12 | Chưa có | Tutorial/audio/UI/device/evidence plan chưa đủ | NOT_LOCKED |

## Manifest phải bổ sung trước khi trình khóa

Mỗi spec/ticket/ref thật có một dòng: ID, path, revision, hash hoặc commit, requirement covered, approval source, dependencies, trạng thái. Không tạo dòng APPROVED cho target chưa tồn tại. Task non-visual ghi refs N/A kèm lý do.

## Lock checklist — chưa có mục nào được đánh dấu xong

- [ ] Mọi milestone thuộc scope có detailed plans và task tickets đầy đủ, không requirement mồ côi.
- [ ] Spec/data/state/input/geometry/timing/save/error/integration rõ cho từng thay đổi cần implement.
- [ ] Visual targets đúng scope có thật, mở được, có user approval và binding theo Reference Protocol.
- [ ] Dependency spec khác dependency implementation, không vòng lặp hoặc hidden prerequisite.
- [ ] Gap Atlas/reference, device/verify plan đã có cách kiểm cụ thể; không claim đã đo runtime trước khi chạy.
- [ ] Không blocking TBD/xung đột; nội dung hoãn phải được user đồng ý và cập nhật scope, không tự loại.
- [ ] Coverage/consistency audit và bằng chứng đủ để user review trọn manifest.
- [ ] User xác nhận khóa đúng lock revision sau khi artifact cụ thể hoàn tất.

## Approval record

Lock approval quote/date/source: **NONE**.
Approved lock revision: **NONE**.
Implementation session/task assignment: **NONE**.

Khi đủ điều kiện và user khóa: lập revision1, điền các bản spec/refs/tickets đã được duyệt; lưu lịch sử revision0 bằng git. Đổi sau lock phải có delta/impact/supersedes/re-approval theo workflow. Không tự đánh dấu LOCKED từ việc tạo được file này.
