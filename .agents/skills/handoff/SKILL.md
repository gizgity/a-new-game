---
name: handoff
description: Dùng khi bắt đầu hoặc tiếp tục task, cập nhật tiến độ, kết thúc session, gặp blocker, chuẩn bị chuyển session hoặc compaction để duy trì trạng thái công việc.
---

# Handoff

## START / RESUME
1. Đọc `HANDOFF.md` ở root repository.
2. Xác định GOAL, CURRENT STATUS và NEXT ACTION.
3. Chỉ đọc file liên quan; không quét lại toàn bộ repo khi không cần.
4. Tiếp tục từ trạng thái hiện tại.
5. Nếu user giao task mới, cập nhật task active mà không làm mất goal dài hạn của project.

## CHECKPOINT
Chủ động cập nhật handoff khi:
- Hoàn thành milestone hoặc phần việc có ý nghĩa.
- Có quyết định thay đổi implementation.
- Xuất hiện blocker quan trọng.
- Task bị gián đoạn hoặc cần chuyển giao.
- Trước compaction nếu nhận biết được.
- Trước kết thúc session chưa hoàn thành; khi hoàn thành dùng bước COMPLETE.

## UPDATE
- Giữ nguyên Goal trừ khi user thay đổi.
- Cập nhật checklist theo kết quả thực tế và trạng thái đang làm.
- Ghi quyết định quan trọng, file liên quan, vấn đề chưa giải quyết.
- Xác định đúng một Next Action cụ thể.
- Ghi rõ check đã chạy và chưa chạy.
- Thay thông tin cũ không còn giá trị, tránh append lịch sử dài.

## COMPLETE
- Chỉ đánh dấu hoàn thành khi acceptance criteria đạt.
- Ghi kết quả ngắn gọn.
- Không xóa goal hoặc context cần cho session tiếp theo.

## TOKEN RULES
- Handoff là snapshot hiện tại, không phải nhật ký hoạt động.
- Giữ ngắn, ưu tiên dưới khoảng 150 dòng.
- Không copy logs, stack traces hoặc diff dài.
- Không tạo task database, scripts, dependencies hoặc hệ thống quản lý handoff phức tạp.
