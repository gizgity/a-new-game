# Q7A — runtime / bàn giao playtest

**CONCEPT APPROVED**: user “approved, làm tiếp đi” ngày2026-10-26 cho V2. Runtime **AWAITING USER PLAYTEST APPROVAL**, không tự accepted và không mở Q7B. Q2–Q6 và draft đầu4hướng giữ accepted; Q6 approval mới đã lấy từ main bc07fd4, Q1 vẫn riêng chưa visual approved.

## Thay đổi

- [Source artwork](artwork/arena-floor-source-v2.png): ImageGen chỉnh concept đã duyệt để bỏ footer/caption, giữ obsidian facets/broken ritual circles/ba motif phẳng. Không dùng mockup có actors/UI làm floor.
- [Runtime WebP](../../public/assets/arena/broken-seal-v2.webp):1600×1000,174334bytes (~170KiB), resize Lanczos/compress WebP88 bằng Pillow có sẵn; không thêm package/dependency. [Provenance/hash/quyền dùng/processing](runtime-asset.json), [prompt](PROMPTS.md). Artwork generated theo quyền dùng output dịch vụ; không gán CC0 hoặc lấy reference bên thứ ba.
- ArenaScene preload một lần, một Phaser Image depth0 phủ đúng1600×1000world. Tint#7a8791 giữ cạnh sàn chìm sau khi xem renderer. Không per-frame floor drawing, animation, particle, shader hoặc art engine mới. Decode RGBA khoảng6.4MB (ước lượng), texture dưới2048px mỗi chiều.
- Chỉ thay preload/drawArena. Kiểm diff từ main bc07fd4 xác nhận phần còn lại của ArenaScene cùng toàn bộ source/controls/AI/resources/Mutation/Curse/draft/bounds/collision/camera/PlayerVisual/EnemyVisual/VFX không đổi. Giữ opening4hướng đã accepted; không tuning gameplay.

## Bằng chứng renderer thật

[Board trước–sau](index.html) có checkbox grayscale trên cùng ảnh; đây không phải ImageGen.

| File trong evidence/ | Setup / giới hạn |
| --- | --- |
| before/after-identity-{390,1440}.png | Cùng4enemy, positions/camera/viewport; baseline code floor cũ từ main bc07fd4; source gameplay trùng. Trước–sau fixture, không natural run |
| before/after-crowd-{390,1440}.png | Cùng33enemy HP800/marks0–3, Barrier15, invulnerable để chụp. Charged thực qua world.step tới chargedBlast; thêm projectile và pose/windup fixture để soi threat. Không bằng chứng balance |
| crowd-{320,844}.png | Fixture crowd trên portrait nhỏ/landscape |
| crowd-grayscale-390.png | Cùng canvas runtime qua CSS grayscale(1), HUD vẫn màu; xem hình/viền/luminance, không coi màu là cue duy nhất |
| boss-{0,1,2}-390.png | Sweep/ring/slam windup fixture; giữ geometry/pattern runtime. Không chứng minh thắng Boss |
| grunt-{prepare,imminent,hit,recovery}-390.png | Snapshot state thật vào EnemyVisual; dashed/solid+chevrons/brief flash/recovery trail. Không đổi timing |
| edge-{nw,east,south}-390.png | Đặt camera/player/enemies gần3motif để kiểm material không giống chướng ngại và không che actor |
| relay-390.png + relay.json | Basic shot thật vào3enemy marks3/2/1; step tới chainBlast, có nguồn→đích và pending/consumed pips. Fixture cấp HP/marks, không natural setup |
| production-{320,390,844,1440}.png | Bản dist/base thật; Start, input Bắn qua CDP touch trên mobile hoặc mouse+WASD desktop; không grant stats/enemies. Chỉ opening ngắn, không full-run |

Ảnh đã xem trực quan: floor có material/inlay; threat, pips và blast nổi hơn floor trong các snapshot. Đây là đánh giá implementation phục vụ review, **không thay user quality acceptance**. Chưa xác minh mọi camera/animation/crowd, Safari/iOS hoặc máy thật.

## Kiểm tra

- npm test:12files PASS; không thêm test phản chiếu drawArena hoặc QA framework.
- npm run build gồm typecheck: PASS. Warning bundle Phaser>500KB có từ trước, không thêm dependency.
- Chromium WebGL fixture và dist320/390/844/1440: không pageerror/request>=400/document overflow; vi/en, pause/resume và asset loading PASS. [Report](evidence/browser-checks.json).
- Harness touch lần đầu dùng dispatchEvent gây setPointerCapture error do không có pointer thật; đã đổi sang CDP Input.dispatchTouchEvent và chạy lại PASS. Không sửa game/controls để chữa harness.
- Frame-time sample tách trang trước–sau có nhiễu CPU, chỉ giữ raw reports. Phép so chính [ABBA cùng page/browser](evidence/performance-abba.json): frozen33enemy, floor cũ/mới xen kẽ,60rAF samples/lượt, software WebGL headless.

| Viewport | Floor cũ median / p95 ms | Floor mới median / p95 ms |
| --- | --- | --- |
| 390×844 | 16.7 /50.0–50.1 | 16.7 /16.8 |
| 1440×900 | 83.3 /100 | 33.4 /66.7 |

Không thấy suy giảm do artwork trong mẫu này; không suy ra mobile FPS hoặc mức cải thiện trên thiết bị. Đây là **frozen render fixture**, không benchmark simulation/animation/full-run. Load asset local khoảng5–8ms trong report, không là thời gian tải mạng live. Cần user thử nhiệt/độ mượt trên máy thật.

## Deploy / cách user thử

Code [0e0a9af](https://github.com/gizgity/a-new-game/commit/0e0a9af2b8cd5fc201690b50ae0a420995dcdd82) đã fast-forward push main. [Pages40266665479](https://github.com/gizgity/a-new-game/actions/runs/40266665479) / job121390460491 completed/success, gồm bước Deploy; giữ base /a-new-game/. Live curl từ môi trường bị proxy403 nên chưa smoke live; không bypass policy. Ảnh là local Vite/dist, không giả live. Actions success không là visual acceptance.

[Chơi Q7A](https://gizgity.github.io/a-new-game/) — reload sau deploy.

1. **Opening / floor**: mobile dùng joystick, desktop WASD chạy từ giữa tới rìa. Mong đợi mặt obsidian/các dấu khắc rõ bản sắc nhưng không trông như đường đi/collider mới; player luôn tìm lại được, controls/camera giữ như cũ.
2. **Crowd / cue**: ở20–45s hoặc khi có nhiều Grunt, quan sát dashed chuẩn bị → solid/chevrons → hit/recovery, né bằng Lướt/Space. Bắn/Chém đặt dấu rồi Heavy/Charged để so Rupture/relay/blast với floor. Mong đợi floor không lấn threat hay che player/VFX; không cần duyệt lại damage/timing/build Q2–Q6.
3. **Boss nếu tiện**:450kills hoặc4:00, quan sát sweep/ring/slam trên sàn mới. Không yêu cầu chơi cảrun để báo lỗi floor. Thử phone dọc/ngang và desktop nếu có; chú ý độ mượt khi đông quái.

Phản hồi: hình/vùng hoặc tình huống, thứ bị chìm/che/mỏi mắt, thiết bị/browser và cảm giác độ mượt. Q7A dừng **AWAITING USER PLAYTEST APPROVAL**; Q1 và Q7B không tự được duyệt/mở.
