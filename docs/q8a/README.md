# Q8A — Dynamic Spawn

**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “q8a đạt yêu cầu” ngày2026-10-26 trên code/deploy394341c (handoff938acf9). Đây là approval trực tiếp, không suy ra từ tests/fixture. Chỉ Q8A được duyệt. Q2–Q7D giữ ACCEPTED; Q8B–D chưa mở. User giao ngày2026-10-26; baseline main `7b01864` đã fetch/đối chiếu trước sửa. Code/deploy `394341c`, Pages SUCCESS; link chơi bên dưới.

## Audit và specification hiện hành

`RunDirector` cũ sinh pack3 mỗi90ticks đầu run, nhanh dần sau60–120s; soft cap18. Kill reset pressure clock nên build mạnh dọn xong phải đợi cadence. Nhánh không kill4s khi đủ cap lại sinh pack3 liên tục không có hard cap. `CombatWorld.spawnEnemy` đã có radius360px, clamp bounds và fallback đối diện nếu gần player<220px; giữ nguyên thuật toán này.

Q8A chỉ sửa `src/game/run.ts` và defaults `config/balance.ts`:

- EMA kill rate với hằng số6s simulation, không đọc loại build. Sau15s, bonus=max(0,rate−1). Interval=round(baseInterval/(1+bonus)), sàn24ticks; soft cap18+min(12,floor(bonus×3)), tức18–30. Không kill/clear chậm giữ cadence cơ sở. Rate giảm mượt khi ngừng clear.
- Pack≤3, không nhiều pack/catch-up trong một tick. Pressure4s không kill giữ hành vi cũ/Archer≤8 nhưng chỉ bù tới hard cap48, tính cả Elite. Cap giảm không xóa enemy đang sống. Spawn thường Archer≤3; Volatile sau45s theo wave index như cũ.
- Hitstop/draft/pause không tiến spawn/adaptation; Replay reset rate/clock. Run elapsed và milestones giữ contract cũ. Boss không adaptive/pressure, giữ bổ sung1/cap7 và cleanup cũ.
- Không đổi HP/growth/damage/AI/builds/draft thresholds/resources/art/input/camera. Không thêm enemy/weapon/map/framework/dependency. Spawn separation≥220px được kiểm cả góc/biên; không spawn trực tiếp tại player.

## Validation và giới hạn

`npm test`:16files PASS, gồm4focused tests mới: adaptive supply/decay, hard cap/reset, draft/hitstop/Boss,1080 tổ hợp vị trí/góc spawn. `npm run build`:typecheck+Vite PASS, warning chunk Phaser>500KB hiện hữu. Tests mở đầu/HP growth/milestones/encounter gốc giữ PASS.

[A/B density](evidence/density-comparison.json):60s/core case, cùng pursuit bot và input, đo density từ15–60s. Baseline compile từ7b01864, Q8A từ code hiện tại. Normal không Mutation/Curse; fast-chain cấp4Mutation (Specialist/Catalyst/Echo/Kinetic) + Glass/Volatile đầu fixture. Cả hai giữ HP mỗi tick và bỏ drafts để cô lập density; damage/resources/AI/spawn thật. **Không natural run, không đo survivability hoặc Q8D**.

| Build | Arena trống trước → sau | Mean enemies trước → sau | Kills trong60s trước → sau |
| --- | --- | --- | --- |
| Normal |16.70 → 0s|1.49 → 13.84|124 → 284|
| Fast-chain |26.07 → 0.13s|1.13 → 12.43|124 → 285|

Sau Q8A max observed24/23, khoảng cách spawn nhỏ nhất232/247px; core step p95 khoảng0.047/0.036ms (Node trong container, không device benchmark). Supply cũ giới hạn cả hai về124kills; supply mới cho phép biểu hiện clear tốt hơn, vẫn không đảm bảo arena luôn có quái ở mọi build.

Reproduce: compile baseline thành `/tmp/q8a-baseline` (hoặc `Q8_BASELINE_DIR`) và `npm test` compile code hiện tại, rồi `node docs/q8a/compare.mjs` từ repo root. Script chỉ là fixture A/B, không runtime hay QA framework.

[Browser](evidence/browser.json), [production](evidence/dist.json): Chromium desktop1440×1000/mobile390×844, Start/Pause/Resume/vi-en/base+assets/no overflow/no runtime error PASS. Desktop có mouse+keyboard input ngắn không grants (simulation~0.53s), mobile chỉ touch-capable click smoke; không coi là mobile combat playtest. Pause giữ ticks/rate/spawn clock. Crowd fixture cấp48quái/stagger rồi đặt radius90–160 để kiểm renderer: [desktop](evidence/crowd-1440.png), [mobile](evidence/crowd-390.png). Đây là screenshot runtime fixture, không natural encounter hoặc artwork concept.

Software WebGL tại48quái visible: rAF median49.9ms desktop/66.6ms mobile viewport, p9583.4ms; không đạt bằng chứng60FPS, không suy ra FPS thiết bị thật hoặc hồi quy A/B renderer. Hard cap thay nhánh không trần, cần user kiểm độ mượt/nóng máy thật. Chưa Safari/iOS/human difficulty; không yêu cầu duyệt lại Q7.

**Pacing còn pending:** density tăng kéo kills/milestones OR tới sớm hơn. Boss vẫn450kills HOẶC4:00, không có warning/phase2/pattern mới trong Q8A. Target Boss3:40–4:00/Victory4:30–5:00 thuộc Q8B chưa mở. Approval Q8A chỉ về density/an toàn/áp lực, không suy ra roadmap đã hoàn thành.

## Playtest Q8A — đã user accepted, giữ tham chiếu

Mở bản deploy Q8A (link/version bên dưới), reload. Chỉ cần thử density, không kiểm lại toàn bộ Q2–Q7D:

1. Run thường: giữ Chém+Bắn, dùng Heavy/Charged khi có lượt, gom rồi dọn pack; từ15s trở đi quái bổ sung nhanh theo clear, ít khoảng trống dài. Desktop WASD/chuột, mobile joystick+nút đã có. Cảm nhận có đủ thời gian đọc cue và thoát vây không.
2. So build chain nhanh bằng [link chain fixture](https://gizgity.github.io/a-new-game/?playtest=chain) với [run thường](https://gizgity.github.io/a-new-game/). Link chain cấp Catalyst+Specialist/Volatile từ đầu theo mode test sẵn có, không phải natural progression/full4Mutation của A/B. Dọn liên tục30–60s; supply phải tăng nhưng không xuất hiện ngay trên player hoặc bù một đám tức thời.
3. Sát tường/góc vẫn di chuyển và dọn; quái vào từ khoảng cách an toàn. Nếu đủ chống chịu, ngừng kill ngắn để xem crowd không tăng vô hạn; không cần đứng yên chịu chết để kiểm trần (đã có focused test). Pause/Resume/Replay phải giữ nhịp/reset sạch.
4. Trên điện thoại chú ý frame giật/nóng máy và khả năng nhìn telegraph trong crowd. Gửi tình huống/thời điểm, build, điều quan sát được và thiết bị/browser. Timing Boss sớm đã ghi nhận cho Q8B.

## Deploy

Code `394341ca66256af72fd8221e4185725c192cf116` đã push main fast-forward, Pages [40338795004](https://github.com/gizgity/a-new-game/actions/runs/40338795004) completed/SUCCESS, job121627451358 gồm bước Deploy SUCCESS. Không đổi runtime sau đó; commit bàn giao chỉ Markdown.

Chơi [run thường Q8A](https://gizgity.github.io/a-new-game/?v=394341c) hoặc [chain fixture Q8A](https://gizgity.github.io/a-new-game/?v=394341c&playtest=chain). Live curl bị proxy CONNECT403; không bypass hoặc coi local/dist là live verification. GitHub CLI Actions cũng bị403, connector đọc kết quả được. User đã approve Q8A qua “q8a đạt yêu cầu”; trạng thái chờ playtest trước đây được supersede bởi **ACCEPTED — USER PLAYTEST APPROVAL**. Giữ giới hạn coverage kỹ thuật; dừng chờ user giao Q8B, không yêu cầu duyệt lại Q8A.
