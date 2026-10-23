# Quy tắc repository

## Source of Truth
- `AGENTS.md`: quy tắc làm việc và coding conventions.
- `GAME_BRIEF.md`: mục tiêu, gameplay specification và giới hạn scope.
- `HANDOFF.md`: active task, progress, context và NEXT ACTION.
- Chỉ dẫn mới nhất của người dùng được ưu tiên khi có xung đột giữa các tài liệu này và yêu cầu của người dùng.
- Không tự ý thay đổi project goal, task goal, scope hoặc quyết định đã khóa; chỉ thay đổi khi người dùng yêu cầu.

## Ngôn ngữ
- Ngôn ngữ mặc định của repository là tiếng Việt. Trao đổi, tài liệu, báo cáo, task notes và handoff dùng tiếng Việt.
- Code identifiers (variables, functions, classes, filenames) dùng tiếng Anh theo chuẩn lập trình.
- Mọi text hiển thị cho người chơi phải qua i18n `t(key)`; tuyệt đối không hardcode trực tiếp vào UI. Mỗi key phải có trong cả dictionary `vi` và `en`.
- Game mặc định `vi`, có dictionary `en` và hàm dịch đơn giản; không cần thư viện i18n ngoài.
- Tên riêng như Mutation, Curse, Boss có thể giữ nguyên khi phù hợp.
- Không dịch console errors, technical identifiers hoặc nội dung machine-readable không dành cho người chơi.

## Phát triển
- Free/open-source first; KISS, tránh over-engineering.
- Ưu tiên game playable, combat feel và hiệu năng.
- Chỉ thêm dependency/công cụ khi thật sự cần; không tạo abstraction/framework cho nhu cầu giả định.
- Không tự thêm tính năng ngoài scope, không sửa/refactor phần không liên quan.
- Mỗi milestone phải giữ game chạy được.

## Tổ chức source code
Cấu trúc tham chiếu; chỉ tạo thư mục/file khi thực sự cần, không scaffold trước toàn bộ cây:

```text
src/
├── main.ts
├── game/
│   ├── scenes/
│   ├── entities/
│   ├── systems/
│   └── config/
├── ui/
└── i18n/
    ├── index.ts
    ├── vi.ts
    └── en.ts
public/assets/
```

- `main.ts` chỉ bootstrap ứng dụng.
- Không dồn toàn bộ gameplay logic vào một Phaser Scene hoặc một file lớn.
- Tách code theo trách nhiệm thực tế, không chia file máy móc; phân tách hợp lý game logic, rendering, UI và configuration.
- Tập trung thông số balance trong `src/game/config/`; nội dung dịch thuộc `src/i18n/`, UI thuộc `src/ui/`, assets thuộc `public/assets/` khi cần.
- Không tạo abstractions, frameworks, placeholder modules hoặc barrel files không cần thiết; `src/i18n/index.ts` dành cho API dịch `t(key)`, không chỉ re-export.
- Giữ code đơn giản, dễ đọc, dễ mở rộng theo milestone; chỉ tổ chức lại code liên quan trong phạm vi task được giao.

## Kiểm thử
- Chạy typecheck/build sau thay đổi implementation liên quan.
- Focused tests cho gameplay logic rủi ro cao; playtest ngắn sau milestone gameplay.
- Không tự xây comprehensive QA, E2E suite, replay framework hay CI phức tạp.
- Không lặp lại test khi không có lý do.
- Không chạy build/test nếu chỉ sửa Markdown; kiểm tra diff và tính nhất quán của tài liệu.

## Token Efficiency
- Chỉ đọc file cần thiết; không đọc lại toàn repo khi không cần.
- Không xuất logs dài nếu không có lỗi; không viết báo cáo dài hoặc tài liệu ngoài yêu cầu.
- Báo cáo cuối task tối đa vài dòng: thay đổi, kiểm tra, blocker/next step.

## Handoff — bắt buộc
- Trước khi bắt đầu/resume task, đọc `HANDOFF.md`.
- Nếu task chưa hoàn thành, tiếp tục theo NEXT ACTION trong phạm vi đã được giao sau compact/session mới mà không cần xin phép lại, trừ khi user giao mục tiêu mới.
- Task mới phải xác định Goal và acceptance criteria trước khi bắt đầu.
- Sử dụng workflow `.agents/skills/handoff/SKILL.md`.
- Chủ động cập nhật handoff ở checkpoint quan trọng, khi có blocker, khi kết thúc session và trước compaction nếu nhận biết được; không cập nhật sau mỗi thay đổi nhỏ.
- Không đánh dấu Goal hoàn thành khi acceptance criteria chưa đạt; không thay đổi Goal đã xác nhận khi user chưa yêu cầu.
- Sau khi hoàn thành milestone được giao, cập nhật progress, validation, context và NEXT ACTION rồi dừng; không tự chuyển sang milestone tiếp theo nếu user chưa yêu cầu, kể cả khi resume.
- Khi cập nhật handoff, giữ nguyên project goal, task goal đã xác nhận và các quyết định quan trọng còn hiệu lực.
- Không dựa duy nhất vào auto-trigger của skill; các quy tắc handoff này luôn có hiệu lực.
