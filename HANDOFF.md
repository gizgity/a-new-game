# HANDOFF

## PROJECT GOAL
Xây dựng game HTML5 action roguelike hoàn chỉnh ở quy mô MVP, chơi được trên desktop browser, combat nhanh, chính xác, melee/ranged synergy, chain reaction, Curse, Adaptive Evolution và run 5 phút có Boss. Ưu tiên free-tier, KISS, hiệu năng và khả năng mở rộng vừa đủ.

## ACTIVE TASK
Cập nhật repository instructions và handoff workflow để chuẩn hóa kiến trúc source code — đã hoàn thành, chỉ sửa Markdown và dừng. Session bootstrap M0/M1 đã hoàn thành; M2 chưa được yêu cầu.

## TASK GOAL
Thiết lập nền tảng agent/handoff, chuẩn hóa game specification và triển khai tuần tự một bản game playable.

## ACCEPTANCE CRITERIA
- Có repository instructions và handoff skill sử dụng được.
- Có game chạy trên desktop browser.
- Core combat sword/gun/dash hoạt động.
- Chain Reaction, Mutation và Curse hoạt động.
- Có game loop 5 phút, Boss, victory/death.
- Có i18n cho text người chơi.
- Có save unlock/settings bằng localStorage.
- Build thành công, không có lỗi gameplay nghiêm trọng đã biết.

### Điều kiện hoàn thành session M0/M1
- Bốn file nền tảng đầy đủ; game brief giữ đúng scope.
- Phaser + TypeScript + Vite; arena, player, WASD, mouse aim, camera/viewport và Start/Pause hoạt động.
- UI qua dictionary vi/en, mặc định vi; `npm run dev` và `npm run build` chạy được.
- Chạy check cần thiết và playtest ngắn, cập nhật handoff; dừng trước M2.

### Điều kiện hoàn thành task cấu hình agent hiện tại
- AGENTS có cấu trúc source tham chiếu, coding conventions và Source of Truth.
- Handoff tiếp tục task đang dở sau compact/session mới trong phạm vi được giao; hoàn thành milestone thì cập nhật và dừng.
- Giữ nguyên goals, scope và quyết định đã xác nhận; không sửa gameplay, Game Brief hoặc dependencies, không tạo tài liệu mới.
- Kiểm tra diff và tính nhất quán; không chạy build/test cho thay đổi chỉ Markdown.

## PROGRESS
- [x] M0 — Agent foundation + Game Brief
- [x] M1 — Game scaffold + movement + aiming + arena
- [ ] M2 — Melee, ranged, dash và enemy combat
- [ ] M3 — Rupture, chain reaction, Charged Shots và Surge
- [ ] M4 — Run timer, waves, Mutation/Curse drafts
- [ ] M5 — Elite, Boss, victory/death và restart
- [ ] M6 — Unlocks, localStorage, SFX và polish tối thiểu

## CURRENT STATUS
Task cấu hình agent đã hoàn thành: cập nhật `AGENTS.md`, handoff skill và snapshot này; không triển khai gameplay hoặc thay đổi `GAME_BRIEF.md`.
M0/M1 hoàn thành; goal MVP tổng thể chưa hoàn thành. Bốn file nền tảng được tạo đúng thứ tự trước scaffold/package/gameplay.
Game chạy được: arena hình học, player WASD, mouse aim, camera follow/resize, Start/Pause/Resume (Esc hoặc nút), tự pause khi mất focus, UI vi/en.
Chưa có combat, enemies, draft, run timer, save hoặc audio; thuộc M2–M6.

## KEY DECISIONS
- Free-first, KISS, tiết kiệm token.
- Phaser + TypeScript + Vite.
- Neon Occult geometric pixel art.
- UI i18n, mặc định tiếng Việt; desktop browser trước.
- Không backend; localStorage là dữ liệu không đáng tin cậy.
- Không có permanent stat upgrades.
- `cursebreak` chỉ là codename nội bộ, không phải thương hiệu public.
- Phaser 3.90, TypeScript 5.9, Vite 7; chỉ ba dependencies này, có package-lock.
- Di chuyển fixed timestep 60Hz, normalize hướng chéo, clamp biên arena; giới hạn catch-up 100ms/frame.
- Logic di chuyển độc lập Phaser; arena/player vẽ bằng Graphics, UI dùng DOM + dictionary có kiểm tra key bằng TypeScript.
- Không thêm suite E2E/CI; playtest dùng Chromium có sẵn và script tạm ngoài repo.
- Kiến trúc source tham chiếu nằm trong `AGENTS.md`; chỉ tạo/tách module khi thực sự cần trong phạm vi task được giao. Code M1 vẫn dùng các đường dẫn bên dưới, chưa được di chuyển/refactor trong task tài liệu này.
- Resume chỉ tiếp tục task đang dở đã được giao; hoàn thành milestone thì dừng, không tự bắt đầu milestone tiếp theo.

## RELEVANT FILES
- `AGENTS.md`: quy tắc repository.
- `.agents/skills/handoff/SKILL.md`: workflow handoff.
- `GAME_BRIEF.md`: specification MVP.
- `src/game/movement.ts`: tham số arena/player và bước di chuyển.
- `src/game/ArenaScene.ts`: scene, input, camera, trạng thái ready/playing/paused và hình học.
- `src/main.ts`, `src/style.css`: khởi tạo Phaser và UI.
- `src/i18n.ts`: dictionary vi/en và `t(key)`.
- `package.json`: dev/typecheck/build/preview; môi trường đã dùng Node 24, npm 11.

## RUN
- Từ root repo: `npm ci` nếu chưa có dependencies.
- `npm run dev` (port mặc định 5173); `npm run build` gồm typecheck, output `dist/`.
- `npm run preview` để phục vụ bản build.

## NEXT ACTION
Dừng và chờ yêu cầu mới của user; chỉ triển khai M2 — melee, ranged, dash và enemy combat theo GAME_BRIEF.md — khi user yêu cầu tiếp tục.

## BLOCKERS
Không có blocker M0/M1. Vite cảnh báo bundle lớn vì Phaser (~1.22 MB JS, gzip ~336 KB); chưa tối ưu thêm ở M1.

## LAST VALIDATION
### Task cấu hình agent
- Đã đối chiếu AGENTS, handoff skill, HANDOFF và GAME_BRIEF: quy tắc kiến trúc, Source of Truth, resume và dừng tại milestone nhất quán; goals/scope và quyết định trước đó được giữ nguyên.
- Đã kiểm tra diff; chỉ thay đổi ba file Markdown, không tạo file mới. Không chạy build/test vì không đổi implementation.

### M0/M1 (kết quả trước task cấu hình agent)
- Đã kiểm tra repo trống và thứ tự/nội dung bốn file M0; đọc và sử dụng handoff skill.
- `npm run build`: PASS, gồm `tsc --noEmit`; chỉ có cảnh báo dung lượng nêu trên.
- `npm run dev`: khởi động thành công.
- Playtest Chromium headless: PASS cho mặc định vi, Start, WASD, mouse aim, camera follow, Esc/nút Pause/Resume, bất động khi pause/ready, biên arena, pause khi blur, đổi en, viewport 960×600 / 1280×800 / 1920×1080.
- Đã xem ảnh màn hình Start và đang chơi; không có browser runtime/network error trong lượt playtest đạt.
- Chưa kiểm tra combat/M2–M6 vì chưa triển khai; chưa playtest thủ công trên thiết bị desktop của người dùng.
