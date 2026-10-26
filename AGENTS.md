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

## Artwork và visual gate
- Checkpoint hiện hành: **Q7C = Character & Enemy Art Overhaul** (Player, Grunt, Archer, Volatile, Bulwark, Chain Warden); **Q7D = Full Run Polish**, chỉ mở khi user giao. Q7B đã user accepted trên5ee970e (approval78f07e6). Q7C dùng Q7A Visual Hierarchy / Contrast Study V1 làm reference chính; giữ P0–P3, silhouette và palette.
- Q7C visual đã user duyệt “visual approved q7c”2026-10-26 sau research góc nhìn; triển khai top-down¾nhìnxuốngcao, giữfloor/camera/gameplay. Runtime đã triển khai asset atlas/state-driven poses; bàn giao **AWAITING PLAYTEST APPROVAL**, chỉ accepted sau userplaytest.
- Q7C phải tạo sprite source riêng bằng ImageGen, preview đủ idle/move/windup/attack/recovery/hit/death và Boss3đòn; không crop concept board thành runtime sprite hoặc thay bằng procedural Graphics. State không tồn tại trong simulation (như Volatile recovery sống) phải ghi N/A, không thêm timing/gameplay. Dừng **AWAITING VISUAL APPROVAL** trước tích hợp; sau duyệt mới rendering/animation/deploy và **AWAITING PLAYTEST APPROVAL**. Không tự accepted.
- Asset-first, illustration-first: audit rendering/approval và tạo concept, mockup gần tỷ lệ chơi, palette/contrast cùng cảnh đông quái trước khi thay artwork arena. Dừng **AWAITING VISUAL APPROVAL**; chỉ user duyệt mới cho triển khai concept. Ảnh sinh thành công không là ART APPROVED.
- Artwork môi trường chính dùng PNG/WebP hoặc SVG có chủ đích, render bằng Phaser Image/TileSprite/layers tĩnh. Không thay artwork bằng vòng lặp Graphics, procedural art engine, tilemap phức tạp hoặc shader nặng. Graphics dành cho dynamic combat shapes/telegraphs/VFX/debug.
- Lưu source artwork, prompt, nguồn/quyền sử dụng, version và giới hạn riêng với runtime assets. Concept/mockup và screenshot renderer thật phải ghi nhãn khác nhau; không dùng reference bên thứ ba chưa có quyền phù hợp làm asset.
- Giữ player/threats nổi hơn floor qua luminance, outline, shape, size và animation; kiểm mobile/desktop/crowd/grayscale phù hợp. Giữ sprite/VFX đã accepted, gameplay bounds/camera/collider/input và balance trừ khi user giao thay đổi.
- HUD không được che canvas tại biên/góc: ưu tiên lane riêng và kiểm player4góc trên mobile/desktop, không chỉ chụp center. Những thay đổi input/auto aim/draft interaction phải có scope user, kiểm giữ-thả/cancel/fresh-press và ghi rõ ngoại lệ contract.
- HUD/UI visual milestone cũng illustration-first: mockup dựa screenshot/bố cục thật, ghi rõ concept và baseline renderer; user duyệt trước sửa HUD production. CSS dùng cho layout/typography/interaction, asset cho icon/art có chủ đích; không UI drawing engine. Readiness/cooldown chỉ đọc resource state thật, không tạo timer/resource giả; text vi/en và giữ-thả/cancel phải được bảo toàn; thay touch hit areas/aim chỉ khi user giao.

## Kiểm thử
- Chạy typecheck/build sau thay đổi implementation liên quan.
- Focused tests cho gameplay logic rủi ro cao; playtest ngắn sau milestone gameplay.
- Không tự xây comprehensive QA, E2E suite, replay framework hay CI phức tạp.
- Không lặp lại test khi không có lý do.
- Không chạy build/test nếu chỉ sửa Markdown; kiểm tra diff và tính nhất quán của tài liệu.

## Bàn giao playtest
- Khi cần người dùng playtest/duyệt visual, phải nêu rõ scope của lượt thử: tính năng/quái/tình huống cần kiểm, phiên bản hoặc link chơi; không chỉ nói “chờ playtest”.
- Cung cấp checklist ngắn có cách vào tình huống (mốc xuất hiện nếu có), thao tác cụ thể trên mobile/desktop và kết quả mong đợi để người dùng biết thế nào là đạt hoặc lỗi.
- Nói rõ phần đã được kiểm tự động, phần còn cần cảm nhận/thiết bị thật; không coi fixture hoặc build/tests PASS là user acceptance. Ghi scope và cách thử hiện tại trong HANDOFF.md để session sau tiếp tục đúng.
- Hướng dẫn phản hồi ngắn: tình huống/bước gặp vấn đề, điều quan sát được và thiết bị/browser nếu liên quan. Không biến playtest thành comprehensive QA hoặc yêu cầu user kiểm lại mọi milestone.

## Token Efficiency
- Chỉ đọc file cần thiết; không đọc lại toàn repo khi không cần.
- Không xuất logs dài nếu không có lỗi; không viết báo cáo dài hoặc tài liệu ngoài yêu cầu.
- Báo cáo cuối task ngắn gọn: thay đổi, kiểm tra, blocker/next step; khi cần user playtest phải kèm scope/cách thử/kết quả mong đợi đủ thực hiện.

## Deployment
- Người dùng đã cho phép tự deploy sau khi hoàn tất công việc và các kiểm tra phù hợp PASS, không cần chờ xác nhận riêng.
- Dùng GitHub Actions `.github/workflows/pages.yml` để build `dist/` và deploy lên GitHub Pages đã setup; giữ Vite base `/a-new-game/`. Bảo toàn thay đổi remote, push `main` không force và theo dõi workflow tới trạng thái kết thúc.
- Visual approval/device playtest còn thiếu phải ghi rõ trong handoff; việc deploy không đồng nghĩa experience acceptance. Không tự mở rộng checkpoint gameplay chưa được giao.

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
