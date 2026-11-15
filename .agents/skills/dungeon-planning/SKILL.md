---
name: dungeon-planning
description: Planning, khóa specs và triển khai dungeon rework theo từng milestone. Dùng next để script kiểm tiến độ, sửa gap hoặc thực hiện một bước hợp lệ kế tiếp; giữ user approval cho spec, visual và playtest.
---

# Dungeon planning — next

## Lệnh

- **$dungeon-planning next**: user giao agent tự xác định và thực hiện **một bước** hợp lệ kế tiếp, gồm mở planning milestone hiện tại hoặc thực hiện ticket khi gates đủ. Không yêu cầu user nhớ ID hay xin lại assignment routine.
- **$dungeon-planning status**: chỉ kiểm và báo tiến độ/prompt đề xuất, không thực hiện task.
- User giao ID/scope cụ thể: ưu tiên phạm vi đó, vẫn kiểm gates. Task sửa flow/skill không tự chạy action do script trả khi chỉ test CLI.

## Đọc tiến độ và chọn bước

1. Đọc CURRENT [HANDOFF](../../../HANDOFF.md), [WORKFLOW rev2](../../../docs/dungeon-redesign/planning/WORKFLOW.md) và [SPEC_LOCK index](../../../docs/dungeon-redesign/planning/SPEC_LOCK.md). R01–R12 đã duyệt; C10 đổi thành **plan→lock→implement→accept từng milestone**, không đợi plan toàn rework. P0 điều phối không chặn P1 bằng closure toàn release.
2. Chạy tại repo: `node docs/dungeon-redesign/planning/next.mjs next --json` (hoặc status). Script [next.mjs](../../../docs/dungeon-redesign/planning/next.mjs) đọc [PROGRESS.json](../../../docs/dungeon-redesign/planning/PROGRESS.json), metadata ticket và proofs; không tự ghi/approve/execute. Agent mới là bên thực hiện bước trả về.
3. Đối chiếu nội dung thật theo paths/reasons; đọc Harness/Design Bible/Reference Protocol/A-H2 và đúng ticket/spec/refs khi cần. Giải thích ngắn đang ở milestone/task nào và sẽ làm một việc gì, rồi làm trong scope user next đã giao. Không chỉ in prompt rồi dừng khi action có thể thực hiện.

## Khi thiếu hoặc sai

4. Mọi gap phải có vấn đề→file/ticket→việc sửa→điều kiện đạt→**suggestedPrompt**. Nếu script chưa biết gap mà agent đọc thấy, cập nhật issues và chọn repair trước, không gửi hồ sơ biết là chưa đủ để review.
5. repair_planning/repair_task/repair_lock/repair_progress: làm một bước sửa có thể hoàn tất an toàn, kiểm lại và bàn giao. Nếu cần quyết định/tool/input ngoài khả năng hiện tại, nêu chính xác phần thiếu và prompt tiếp tục; không chỉ nói “chờ review”. Không bịa footage, ảnh, benchmark hoặc approval để hết blocker.
6. request_* chỉ khi artifact cụ thể đủ điều kiện review và thật sự thiếu user approval. Next không tự duyệt spec/visual/playtest. Nếu package chưa đủ, chuyển về repair và đưa prompt sửa, không hỏi user duyệt bản thiếu.

## Thực hiện theo milestone

7. Chưa có plan: đọc [draft intent](../../../docs/dungeon-redesign/planning/MILESTONE_DRAFTS.md), audit source, tạo detailed plan/spec/tickets/coverage theo [mẫu](../../../docs/dungeon-redesign/planning/TASK_TICKET_TEMPLATE.md). Không tự chọn thêm gameplay; source chưa audit ghi UNVERIFIED. Tách contract tối thiểu cần cho milestone hiện tại khỏi phần tích hợp ở mốc sau, không ép P1 chờ toàn planning P2–P6.
8. SPEC/CONCEPT có thể chạy trước lock. Artwork dùng [game-art](../game-art/SKILL.md), actual refs/mockup/scale/rights, concept→user approval→source riêng→integration. Không dùng prototype/art production để né lock milestone.
9. CODE/ART production/VERIFY runtime cần lock milestone valid + exact approved spec/target + deps; tạo execution card A-H2. Không có global lock gate. Giữ technical/visual/playtest riêng; đổi spec sau lock cần delta/impact/affected STALE và re-approval đúng scope, không xóa lịch sử/Bible/DDR.
10. Hoàn tất một bước: cập nhật header status, proof/verification/approval và issues theo [PROGRESS_FORMAT](../../../docs/dungeon-redesign/planning/PROGRESS_FORMAT.md); chạy script **status** để kiểm consistency, cập nhật handoff và báo suggestedPrompt cho bước/sửa tiếp theo. Không thực hiện action thứ hai trong cùng lượt next.
11. Khi milestone có nghiệm thu user thật, lần next sau chọn planning milestone kế tiếp. Build PASS/all task DONE không tự là milestone acceptance. Gặp dependency vòng, missing/hash sai, approval thiếu thì sửa/báo đúng artifact, không chỉnh status để nhảy bước.

Không tự push/main/Pages/shutdown từ lệnh next; các hành động đó cần scope user riêng. Quy tắc handoff và source/approval lịch sử vẫn giữ; next là cách giao bước tiếp, không lệnh duyệt kết quả.
