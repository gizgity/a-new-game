# Quy tắc repository

## Ngôn ngữ
- Ngôn ngữ mặc định của repository là tiếng Việt. Trao đổi, tài liệu, báo cáo, task notes và handoff dùng tiếng Việt.
- Code identifiers (variables, functions, classes, filenames) dùng tiếng Anh theo chuẩn lập trình.
- Mọi text hiển thị cho người chơi phải qua i18n; tuyệt đối không hardcode trực tiếp vào UI.
- Game mặc định `vi`, có dictionary `en` và hàm dịch đơn giản; không cần thư viện i18n ngoài.
- Tên riêng như Mutation, Curse, Boss có thể giữ nguyên khi phù hợp.
- Không dịch console errors, technical identifiers hoặc nội dung machine-readable không dành cho người chơi.

## Phát triển
- Free/open-source first; KISS, tránh over-engineering.
- Ưu tiên game playable, combat feel và hiệu năng.
- Chỉ thêm dependency/công cụ khi thật sự cần; không tạo abstraction/framework cho nhu cầu giả định.
- Không tự thêm tính năng ngoài scope, không sửa/refactor phần không liên quan.
- Mỗi milestone phải giữ game chạy được.

## Kiểm thử
- Chạy typecheck/build sau thay đổi implementation liên quan.
- Focused tests cho gameplay logic rủi ro cao; playtest ngắn sau milestone gameplay.
- Không tự xây comprehensive QA, E2E suite, replay framework hay CI phức tạp.
- Không lặp lại test khi không có lý do.

## Token Efficiency
- Chỉ đọc file cần thiết; không đọc lại toàn repo khi không cần.
- Không xuất logs dài nếu không có lỗi; không viết báo cáo dài hoặc tài liệu ngoài yêu cầu.
- Báo cáo cuối task tối đa vài dòng: thay đổi, kiểm tra, blocker/next step.

## Handoff — bắt buộc
- Trước khi bắt đầu/resume task, đọc `HANDOFF.md`.
- Nếu task chưa hoàn thành, tiếp tục theo NEXT ACTION trừ khi user giao mục tiêu mới.
- Task mới phải xác định Goal và acceptance criteria trước khi bắt đầu.
- Sử dụng workflow `.agents/skills/handoff/SKILL.md`.
- Chủ động cập nhật handoff ở checkpoint quan trọng, khi có blocker, khi kết thúc session và trước compaction nếu nhận biết được; không cập nhật sau mỗi thay đổi nhỏ.
- Không đánh dấu Goal hoàn thành khi acceptance criteria chưa đạt; không thay đổi Goal đã xác nhận khi user chưa yêu cầu.
- Không dựa duy nhất vào auto-trigger của skill; các quy tắc handoff này luôn có hiệu lực.
