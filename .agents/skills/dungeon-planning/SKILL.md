---
name: dungeon-planning
description: Lập hoặc tiếp tục planning dungeon/skill rework, chuyển milestone intent thành task chi tiết và kiểm spec lock trước implementation. Dùng cho scope dungeon rework; không tự mở milestone hoặc thay Design Harness.
---

# Dungeon planning

## Đọc đúng scope

1. Đọc CURRENT trong [HANDOFF](../../../HANDOFF.md), [workflow](../../../docs/dungeon-redesign/planning/WORKFLOW.md), [spec lock](../../../docs/dungeon-redesign/planning/SPEC_LOCK.md), rồi draft/ticket được user giao. Đọc Harness/Design Bible/Reference Protocol/A-H2 theo AGENTS; đọc source liên quan trước khi ghi path/API thật.
2. Ghi phase và quyền hiện tại: setup, planning milestone, design-only, lock review hay execution. Danh sách DRAFT/backlog/NEXT ACTION cũ không phải lệnh làm tiếp. Milestone/task/implementation bắt đầu trong session mới được giao; không tự nối việc từ setup.
3. R01–R12 có approval thiết kế tại C09 trong log, R12 amended; đừng hỏi lại quyết định đã chốt. Approval đó chưa khóa detailed specs hoặc targets chưa tồn tại, chưa mở code/art production.

## Planning milestone được giao

4. Đọc intent tại [milestone drafts](../../../docs/dungeon-redesign/planning/MILESTONE_DRAFTS.md). Audit gap/source/assets đúng phạm vi; tạo detailed plan và task tickets theo [mẫu](../../../docs/dungeon-redesign/planning/TASK_TICKET_TEMPLATE.md). Chỉ tạo ticket có outcome thực, không scaffold đủ mọi loại.
5. Với mỗi requirement, xác định spec section, ticket(s), dependency, acceptance và evidence. Mỗi ticket phải đủ việc cần làm/code-art-concept-input-output/state/refs phù hợp để session mới không đoán; ghi UNVERIFIED cho source path chưa audit. Giữ spec một nguồn, không copy số khác nhau.
6. Tách dependency spec/contract với dependency artifact/implementation để không tạo vòng lặp. Task design-only có thể được giao trước lock; CODE/ART production/integration không được chạy dưới nhãn spike/concept.
7. Nếu có artwork, dùng skill [game-art](../game-art/SKILL.md): concept/mockup→approval→source production→integration, refs/scale/rights thật. Planning ticket chưa mở quyền tạo ảnh hoặc sản xuất asset ngoài scope được giao. Không sửa Bible/DDR từ planning.

## Lock và execution

8. Chỉ trình lock khi detailed planning toàn release scope hoàn tất, specs/targets đủ, coverage/deps audit không còn blocking TBD. Điền manifest exact revisions/hashes/approval; không tự thu nhỏ scope để code sớm. User phải khóa đúng revision cụ thể sau khi xem artifact; không suy LOCKED từ “all y” của review baseline.
9. Trước CODE/ART production: kiểm global lock còn hiệu lực, task được giao, dependencies và approved spec/target đúng revision; dùng execution card A-H2. Thiếu thì dừng **task bị chặn**, vẫn hoàn tất planning độc lập được giao. Không tạo thêm approval gate ngoài yêu cầu thật đã nêu.
10. Sau lock, thay spec/ref phải ghi delta/impact/supersedes, đánh dấu affected lock STALE, dừng task phụ thuộc và cập nhật theo user approval. Không xóa lịch sử, không tự ghi DDR nếu chưa có invocation rõ.
11. Kết thúc phạm vi session: cập nhật ticket/matrix/lock/handoff bằng evidence thật, tách technical/visual/user acceptance; một next action. Không tự thực hiện ticket/milestone kế. Chỉ docs thì kiểm diff/link/consistency, không build game. Runtime code mới chạy checks thích hợp.

## Ví dụ routing

- “Planning DR-P1” → lập detailed plan/tickets và liệt kê target cần tạo; chưa code world.
- “Implement ticket X” trong khi lock NOT_LOCKED → nêu lock/spec còn thiếu và chưa chạy implementation; không giả READY.
- “Làm concept của ticket X” được giao trước lock → design-only đúng scope qua game-art, chưa asset production/runtime.
- “Tiếp tục” sau khi setup đã hoàn tất nhưng chưa mở milestone → đọc CURRENT, giữ checkpoint; không tự chọn mốc kế.
