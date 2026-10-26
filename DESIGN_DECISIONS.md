# Design Decisions Registry (DDR)

Nguồn sự thật cho **quyết định mới từ sau Release**. Khởi tạo ngày 2026-10-26 theo task Design Memory & Art Consistency System; **0 decision, ID tiếp theo DD-0001**. Không backfill Q7A–Q8C hoặc bất kỳ lịch sử trước Release. Task tạo hệ thống này không tự là một decision được ghi.

## Quy tắc

- Chỉ ghi qua lời gọi rõ ràng `$design-decision` kèm nội dung user đã chốt và nguồn kiểm chứng. Không auto-trigger từ thảo luận, code, handoff hay prompt chỉ nhắc tên skill.
- Append-only: không sửa/xóa entry cũ, không tái sử dụng ID. Mỗi thay đổi nội dung hoặc trạng thái tạo decision mới, ID bằng max ID hiện có + 1 (padding tối thiểu 4 chữ số); kiểm lại HEAD/registry trước commit để tránh trùng khi có người ghi đồng thời.
- Trạng thái quyết định: `Proposed`, `Approved`, `Deferred`, `Rejected`, `Superseded`. Chỉ ghi trạng thái được bằng chứng user hỗ trợ. Agent không tự chốt hoặc suy đoán approval.
- Trạng thái implementation và acceptance theo dõi riêng trong HANDOFF/task evidence; Approved không có nghĩa đã triển khai, visual approved không có nghĩa playtest accepted.
- `Supersedes: None` hoặc danh sách ID cũ. Trạng thái hiệu lực của một chuỗi được đọc từ entry mới nhất có nguồn hợp lệ; entry cũ giữ nguyên trạng thái lịch sử. Decision mới thay quyết định cũ phải chỉ rõ phần thay thế; không dùng Superseded cho quyết định kế nhiệm đang Approved. Nếu user chỉ chốt đánh dấu một entry Superseded mà chưa có nội dung kế nhiệm, ghi event mới trạng thái Superseded, liên kết ID cũ, không tự bịa phương án thay thế. Proposed/Deferred/Rejected không tự vô hiệu hóa Approved trước đó.
- Nguồn phải có quote chính xác, ngày, người chốt, link message hoặc đường dẫn evidence/commit + scope. Nếu chỉ có hội thoại hiện tại không có permalink, ghi rõ “hội thoại task hiện tại, không có permalink”, quote nguyên văn và ngày; không chế URL. Thiếu ngày/Release boundary/approval/scope thì báo phần thiếu, không ghi entry suy đoán.
- Release boundary đã xác minh từ HANDOFF trên main@bcd148b: v0.1.0, target4770bf617f292c407685c4fbed1ebf5d3c6cb84f, published2026-10-26T16:46:46Z; https://github.com/gizgity/a-new-game/releases/tag/v0.1.0 . Không lấy Q8C deploy hoặc ngày tạo registry làm Release. Mỗi lần ghi phải có bằng chứng nội dung thuộc sau Release. Artwork accepted trước Release được audit trong ART_BIBLE.md, không nhập DDR.

## Mẫu entry (không phải decision)

```markdown
### DD-<số> — <tên>
- Ngày: YYYY-MM-DD (ngày user chốt; ngày ghi nếu khác)
- Trạng thái: Proposed | Approved | Deferred | Rejected | Superseded
- Quyết định: <nội dung user đã chốt>
- Lý do: <user nêu; nếu chưa nêu ghi “Chưa được user cung cấp”>
- Phạm vi: <áp dụng và giới hạn>
- Nguồn: <người, quote, ngày, permalink/evidence, bằng chứng sau Release>
- Supersedes: None | DD-...
- Theo dõi implementation/acceptance: <link task/handoff; chưa có thì ghi chưa có>
```

## Registry

_Chưa có decision. Không chép ví dụ vào registry._
