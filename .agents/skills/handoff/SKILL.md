---
name: handoff
description: Dùng khi bắt đầu hoặc tiếp tục task, cập nhật tiến độ, kết thúc session, gặp blocker, chuẩn bị chuyển session hoặc compaction để duy trì trạng thái công việc.
---

# Handoff

## START / RESUME
1. Đọc `HANDOFF.md` ở root repository.
2. Xác định PROJECT GOAL, TASK GOAL, ACTIVE TASK, CURRENT STATUS và NEXT ACTION, gồm giới hạn milestone đã được giao.
3. Chỉ đọc file liên quan; không quét lại toàn bộ repo khi không cần.
4. Tiếp tục task chưa hoàn thành từ trạng thái hiện tại sau compact/session mới, trong phạm vi đã được giao, không cần xin phép lại. Nếu milestone được giao đã hoàn thành, giữ trạng thái dừng; không tự bắt đầu milestone tiếp theo.
5. Nếu user giao task mới, cập nhật task active mà không làm mất project goal, task goal đã xác nhận hoặc quyết định quan trọng còn hiệu lực; chỉ đổi goal/scope khi user yêu cầu.

## CHECKPOINT
Chủ động cập nhật handoff khi:
- Hoàn thành milestone hoặc phần việc có ý nghĩa.
- Có quyết định thay đổi implementation.
- Xuất hiện blocker quan trọng.
- Task bị gián đoạn hoặc cần chuyển giao.
- Trước compaction nếu nhận biết được.
- Trước kết thúc session chưa hoàn thành; khi hoàn thành dùng bước COMPLETE.

Không cập nhật sau mỗi thao tác nhỏ; handoff chỉ cần phản ánh các checkpoint quan trọng.

## UPDATE
- Giữ nguyên project goal và task goal đã xác nhận trừ khi user thay đổi.
- Cập nhật checklist theo kết quả thực tế và trạng thái đang làm.
- Ghi quyết định quan trọng, file liên quan, vấn đề chưa giải quyết.
- Xác định đúng một Next Action cụ thể.
- Ghi rõ check đã chạy và chưa chạy.
- Thay thông tin cũ không còn giá trị, tránh append lịch sử dài; không làm mất quyết định quan trọng hoặc context còn hiệu lực.

## COMPLETE
- Chỉ đánh dấu hoàn thành khi acceptance criteria đạt.
- Ghi kết quả ngắn gọn.
- Không xóa goal hoặc context cần cho session tiếp theo.
- Khi hoàn thành milestone được giao, cập nhật progress, validation, context và NEXT ACTION rồi dừng, dù goal tổng thể chưa hoàn thành. Nếu NEXT ACTION thuộc milestone tiếp theo, ghi rõ chỉ thực hiện khi user yêu cầu; không tự chuyển milestone khi resume.

## TOKEN RULES
- Handoff là snapshot hiện tại, không phải nhật ký hoạt động.
- Giữ ngắn, ưu tiên dưới khoảng 150 dòng.
- Không copy logs, stack traces hoặc diff dài.
- Không tạo task database, scripts, dependencies hoặc hệ thống quản lý handoff phức tạp.
