---
name: design-decision
description: Chỉ chạy khi user gọi rõ $design-decision kèm nội dung user đã chốt để ghi quyết định mới sau Release. Không tự kích hoạt từ thảo luận hoặc implementation.
---

# Design decision

1. Kiểm tra invocation thật: prompt phải gọi `$design-decision` và cung cấp kết luận của user; nhắc tên trong ví dụ/tài liệu không phải invocation. Không có invocation thì không ghi DDR. Khi cần, đề nghị user gọi skill, không tự gọi thay user.
2. Đọc `AGENTS.md`, `DESIGN_DECISIONS.md`, `HANDOFF.md`; đọc `ART_BIBLE.md` nếu liên quan visual. Xác minh nội dung là quyết định mới sau Release, không backfill. Release boundary chưa rõ phải báo blocker; không dùng ngày deploy làm Release.
3. Kiểm nguồn: ai chốt, quote/ngày, scope, trạng thái cụ thể. “Làm concept”, tests PASS, ảnh generate thành công, commit/deploy không là Approved hoặc accepted artwork. Không tự thiết kế, tự duyệt hoặc suy approval. Thiếu bằng chứng: báo chính xác phần thiếu và không append. Lý do chưa được cung cấp ghi rõ chưa cung cấp, không bịa.
4. Dùng schema/5 trạng thái trong registry. Implementation/acceptance chỉ liên kết evidence riêng, không nhập vào trạng thái quyết định. User có thể chốt giữ Proposed/Deferred/Rejected; không nâng thành Approved.
5. Đọc toàn bộ ID, cấp max+1; registry rỗng bắt đầu DD-0001. Append entry mới; mọi thay đổi kể cả status/correction tạo ID mới và Supersedes theo scope. Giữ nguyên lịch sử; decision chưa Approved không tự thay Approved cũ. Không sửa entry trước để “đồng bộ status”.
6. Trước commit kiểm lại registry/HEAD và diff: ID duy nhất/tăng dần, nguồn thật, Supersedes tồn tại và trỏ về trước, không xóa/sửa entry. Có ghi đồng thời thì cấp lại ID mới trên HEAD mới, không ghi đè remote.
7. Art direction: ghi decision Approved mới trước, rồi mới cập nhật Art Bible trong đúng scope approval. Approval direction không tự approve ảnh cụ thể; reference mới phải qua `$game-art` và approval riêng. Nếu chưa có invocation/bằng chứng, giữ Art Bible chuẩn cũ, báo pending.
8. Báo ID/status/nguồn, file thay đổi và phần implementation/acceptance còn riêng. Cập nhật handoff theo skill handoff; không tự mở milestone hoặc deploy.

## Ví dụ gọi (chỉ mẫu, không ghi vào DDR)

```text
$design-decision Ghi kết luận tôi đã chốt: [quyết định mới]. Trạng thái: Approved.
Ngày chốt: [YYYY-MM-DD]. Lý do: [...]. Phạm vi: [...]. Supersedes: [None/ID].
Nguồn: [quote chính xác + message/evidence]; Release: [tag/ngày/evidence chứng minh sau Release].
Chỉ ghi quyết định; implementation và acceptance vẫn pending.
```
