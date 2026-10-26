# Q9A — Elemental Legacy Core

**IN PROGRESS — BLOCKED ON MECHANICS SPEC**, chưa nghiệm thu, không Q9B.

Nguồn chuẩn: [DD-0001](../../DESIGN_DECISIONS.md#dd-0001--cursebreak-legacy-v1). User giao Q9A ngày 2026-10-26. DDR giữ append-only, không ghi quyết định mới từ implementation.

## Đã có trên nhánh nền

- Catalog 6 Sigil/12 Branch với dependency allowlist; mỗi offer tối đa một Branch đúng Sigil.
- RNG roll Sigil trước, rồi Branch đã sở hữu; hai offer khác nhau. Sigil vừa xuất hiện nhận trọng số 0.65 thay 1, không bị loại. Đây là giá trị tuning implementation.
- Fallback: pool rỗng trả 0 offer, một bộ trả 1 offer; Sigil chưa sở hữu Branch dùng Core. Một Sigil có cả hai Branch có thể tạo hai bộ khác nhau. Không tạo offer Core để tăng pool khi đã có Branch, không tự unlock.
- Ticket giữ seed/offers/selected qua serialization; first run không Legacy; chỉ đóng khi có kết quả. Validation lưu IDs, bỏ thuộc tính thừa, dependency sai và duplicate. Profile cũ thiếu Legacy nhận pool rỗng, không suy unlock từ victories cũ. Chưa có full migration/reward economy.
- Các API này chưa nối vào UI/combat. Production main/Pages chưa thay đổi bởi checkpoint này.

## Blocker

DDR chỉ ghi **tên**, chưa có trigger/hiệu ứng cụ thể cho Ignite, Soaked, Perfect Dodge, Frostbite/Shatter, Dodge/Ambush, Momentum hoặc 12 Branch. Ví dụ chưa chốt Wildfire lan trên hit/kill/tick, Furnace tăng damage hay tiêu thụ Ignite, Crystal Echo xuất hiện sau Shatter hay đòn đánh. Damage/cooldown/radius được phép tuning nhưng lựa chọn trigger/effect là thiết kế cơ chế, không thể xác minh “đúng cơ chế đã duyệt” chỉ từ tên.

Đã hỏi user bằng câu hỏi trong hội thoại: cung cấp/link spec đã duyệt, hoặc cho phép lựa chọn cơ chế theo tên và ghi rõ implementation. Chờ câu trả lời trước combat effects/UI mô tả. Đây là thiếu đặc tả trong DDR, không phải skill bắt xin approval cho code. Không cần artwork mới cho phần nền hiện tại.

## Kiểm chứng

- `npm test`: PASS toàn bộ 19 test files, gồm focused Legacy RNG/dependency/fallback/anti-repeat/ticket/profile validation và regression combat/Boss/Draft/mobile input hiện có.
- `npm run build` (gồm typecheck): PASS; warning bundle Vite lớn giữ từ baseline.
- Chưa có combat Legacy hooks, effect tests, browser/UI/device playtest; không suy từ checks trên là hoàn thành acceptance Q9A.

## Tiếp tục

Sau khi user làm rõ spec, hoàn tất effects/config safety, selection UI và HUD text vi/en, tests đủ 6/12 + Mutation/Curse/Boss timing, browser mobile/desktop; rồi commit/push main và theo dõi Pages. Chỉ sau đó bàn giao checklist nghiệm thu Q9A. Không mở Q9B.
