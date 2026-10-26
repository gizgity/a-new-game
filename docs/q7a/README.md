# Q7A — Ấn phong bị vỡ / The Broken Seal

**HIỆN HÀNH: ACCEPTED — USER PLAYTEST APPROVAL** ngày2026-10-26. User xác nhận “hiện 7a chỉ mới có thay đổi về sàn arena? nếu vậy thì t approved” sau khi làm rõ scope floor-only; code0e0a9af/board2e48166. Concept V2 đã được duyệt trước đó; gameplay/camera/controls/sprites/VFX giữ nguyên. Chờ scope Q7B từ user, chưa mở task mới. Xem [implementation/checks/cách thử](IMPLEMENTATION.md), [board trước–sau](index.html) và [runtime asset provenance](runtime-asset.json). Q6 cũng đã ACCEPTED theo main bc07fd4.

---

## Snapshot visual gate trước approval

Phần dưới giữ lịch sử audit/minh họa trên main fbc994b6; những câu chờ duyệt/chưa implementation/Q6 pending phản ánh checkpoint lúc đó, được trạng thái hiện hành phía trên supersede. Không dùng ảnh concept thay screenshot runtime.

**AWAITING VISUAL APPROVAL.** Ngày2026-10-26. Gói này chỉ audit, thiết kế và minh họa; chưa sửa artwork trong game, chưa có runtime Q7A, chưa ART APPROVED.

Mở [board review](index.html) để xem baseline cạnh concept và bật grayscale trên cùng ảnh. [Contract hiện hành](../../GAME_BRIEF.md#q7a-design-contract--arena-art--visual-contrast), [prompt đầy đủ](PROMPTS.md).

## Bốn deliverables để duyệt

| Hình | Vai trò / cách đọc | Trạng thái |
| --- | --- | --- |
| [Arena Concept V2](artwork/arena-concept-v2.png) | Material obsidian, khắc nghi lễ gãy, ba motif phẳng cố định, trung tâm yên | Đề xuất chính; supersede V1 nhiều masonry/rubble |
| [Combat Mockup V2](artwork/combat-mockup-v2.png) | Bố cục portrait cạnh desktop, actor nhỏ so với playfield, phân lớp combat trên nền mới | Minh họa tỷ lệ gần game, không phải camera/UI specification chính xác |
| [Contrast / Palette V1](artwork/contrast-palette-v1.png) | P0–P3, màu + shape + luminance, ví dụ grayscale | Palette reference; không duyệt sprite thiết kế lại trong ảnh |
| [Crowd Mockup V2](artwork/crowd-mockup-v2.png) | Player giữa khoảng22enemy, prepare/imminent, projectiles, Rupture/relay/Detonate/Charged và Barrier trên floor | Static stress concept; chưa chứng minh animation/performance |

V1 của concept/combat/crowd giữ trong artwork làm lịch sử iteration, không phải hướng triển khai hiện hành. V2 bớt gạch/vụn, chuyển sang các mặt obsidian rộng. Palette V1 vẫn dùng cho màu/hierarchy, ví dụ sàn/sprite trong board không override V2/code.

## So với arena hiện tại

- Baseline renderer thật: [enemy identity390](../q3/identity-390.png), [Boss slam390](../q3/boss-2-windup.png), [chain relay390](../q4/relay-390.png), [desktop1440](../q3/layout-1440.png). Đây là evidence lịch sử của Q3/Q4, không giả là ảnh live/main mới chụp. Có fixture; xem README gốc cho setup/giới hạn. Đối chiếu remote diff xác nhận ArenaScene/PlayerVisual/EnemyVisual không đổi sau baseline.
- Hiện tại: grid48px, rounded border, circles/radials và diamond mảnh bằng Graphics; tối/readable nhưng thiếu material/depth và địa điểm nhận diện.
- Đề xuất V2: texture có mặt cắt/bevel/shadow nông, arc nghi lễ bị cắt, ba inlay bất đối xứng. Không thêm topology hoặc obstacles. Center giữ yên, sắc sáng tiếp tục thuộc player/threat/VFX.
- Giữ camera hiện hành: world1600×1000/inset64, follow0.12; compact zoom clamp(min(width/480,height/400),0.75,1.3), desktop min(width/1120,height/700). Các panel ImageGen đôi chỗ vẫn thu vòng nghi lễ quá nhiều; không lấy đó làm lý do đổi zoom.

## Audit / specification hiện hành

- Checkout ban đầu sạch tại `38d5e1c22eb3263ff44cc29e6fac3a9b3251bef0`, nhánh work. Git fetch ban đầu lỗi proxy connection trong sandbox; GitHub connector đọc main **fbc994b6d5319dfb490e9a8bf30556dd52273224** và compare cho thấy ahead3/behind0. Không force/reset hoặc ghi đè source.
- Ba commit mới gồm implementation draft đầu4hướng7843b98 và approval fbc994b6; đã đọc remote Draft.ts/config/draft.ts/run.ts cùng patch toàn bộ commit để xác nhận scope. Không thay arena, input core, EnemyVisual/PlayerVisual hoặc combat tuning. GAME_BRIEF/HANDOFF/docs/q6 được đồng bộ từ remote trước khi bổ sung Q7A; sau đó fetch thành công khi cấp network capability và tạo nhánh q7a-visual-review từ origin/main fbc994b6; checkout source hiện đã đúng main, giữ đủ opening4hướng. Không sửa implementation.
- Q2–Q5 accepted; draft đầu4hướng7843b98 accepted (user “approve”); Q6 stacking vẫn AWAITING USER PLAYTEST APPROVAL; Q1 chưa visual approved. Không suy rộng approval mới.
- Không có specification/implementation Q7 khác; các tham chiếu Q7 cũ chỉ là “không tự mở Q7”. Task mới mở Q7A visual riêng, không Q7B. M6 functional không trùng Q7.
- Đã đọc AGENTS, handoff skill, HANDOFF, GAME_BRIEF; toàn bộ13Markdown trong docs cũ (Q3/Q4/Grunt, Q5 audit/A–E, tank, post-Q5A, pressure, Q6), workflow Pages; repo không có README root hay Art Bible/art-reference riêng. Q5 audit và A–E đã có superseded note; thêm cross-reference ở notes cũ còn dễ hiểu nhầm. Không viết lại evidence/approval lịch sử.
- Rendering: ArenaScene preload chỉ Vessel, drawArena là Graphics static; combatGraphics depth1, Vessel depth2, reticle3. PlayerVisual ghép8frame32px từ fractured-vessel.svg với pose/trail pool; EnemyVisual Graphics hiện hành có silhouette/telegraph thật; chargedVfx/BuildVisual/BarrierVisual vẽ dynamic feedback. combat/movement/config/style/main/TouchControls được đối chiếu boundaries/palette/layout, không sửa.
- Mâu thuẫn hiện hành được xử lý: Art cũ ưu tiên Graphics chuyển thành asset-first cho artwork mới; câu “không mở Q7” ở tổng kết chuyển thành Q7A gate theo task này. Q5 contract lịch sử1Curse/các next steps cũ giữ nguyên, có nhãn lịch sử; Q6 contract2Curse và opening4hướng là hiện hành.

## Nguồn, quyền dùng, version

- 7PNG sinh bằng **ImageGen có sẵn trong phiên Codex**, không cài paid API/service/dependency. Không có tên model/seed được tool cung cấp; không bịa metadata. Original outputs giữ nguyên trong /workspace/generated_images, copy vào artwork; PNG chưa tối ưu cho game.
- V1 arena/palette tạo từ prompt mới. Combat V1 dùng arena V1 + screenshot repo docs/q3/identity-390.png. Crowd V1 dùng screenshot đó + arena V1. Arena V2 chỉnh arena V1; combat/crowd V2 chỉnh bảnV1 tương ứng + arenaV2. Inputs đều là ảnh repo này và output trong phiên; không dùng asset/reference bên thứ ba.
- Đây là **generated concept/review material**, không gán license CC0/open-source hoặc bảo đảm độc quyền bản quyền. Quyền dùng output theo điều khoản dịch vụ tạo ảnh áp dụng cho tài khoản; chưa có license asset runtime riêng. Screenshot/sprite repo giữ nguồn/quyền hiện có. Không có external reference nào được cấp phép để nhập vào game.
- Sau approval mới chuẩn bị source artwork phù hợp, bỏ caption, chốt quyền dùng và tối ưu PNG/WebP/SVG cho runtime. Board/mockup chứa UI/actors không phải floor texture được phép import nguyên khối. Không cần dịch vụ tạo ảnh lúc chạy.
- Exact prompts giữ tại PROMPTS; [manifest](artwork-manifest.json) ghi inputs, kích thước, SHA256 và usage để tái bàn giao.

## Sai lệch ImageGen không thuộc thiết kế được đề nghị

- Mockup không pixel-perfect: thiếu Charged button và các HUD/Curse slot; chữ/số HUD có lỗi; actor proportions/poses khác atlas; góc/cỡ fan không khớp hit geometry. Giữ UI/controls/palette/camera/core hiện hành, không “sửa game cho giống ảnh”.
- Palette board có nhân vật fantasy chi tiết hơn sprite và nhầm nhãn P1/P2, dùng cyan cho Bulwark; chỉ duyệt hierarchy/swatches, không thay sprite. Grayscale do ImageGen minh họa chưa phải phép biến đổi cùng scene; toggle grayscale trong HTML là CSS filter thật trên cùng PNG.
- Crowd V2 vẽ quá nhiều enemy có đủ3pips và Barrier gần tròn; chưa diễn đạt tốt mọi trạng thái0/1/2/3 hay exact segmented hex. Relay line/Detonate/Charged có thể lệch màu/shape; Q2/Q4/Q5 runtime giữ nguyên. Hình minh họa lớp P2, không chứng minh logic này.
- Các bevel/motif có thể còn trông nhô; runtime phải làm phẳng bằng material/shadow restraint, không thêm collision. Chi tiết floor gần player cần được hạ nếu cạnh sàn cạnh tranh threat; không tự tuyên bố đạt quality.
- Chưa có renderer Q7A, full-run/camera-edge crowd, animated threat/Boss test, device/Safari/performance evidence; chỉ thực hiện sau visual approval.

## File thay đổi / dự kiến

- Lượt gate: GAME_BRIEF.md (contract/current art), HANDOFF.md (snapshot), AGENTS.md (quy tắc dài hạn), docs/q7a (hình/prompt/board/audit), các note superseded liên quan. docs/q6 đồng bộ approval từ remote; không thay lịch sử.
- Sau approval: src/game/ArenaScene.ts cho preload/static floor layers; thêm public/assets/arena/* và metadata; docs/evidence/handoff. **Không dự kiến sửa PlayerVisual, EnemyVisual, VFX, balance, run/draft/AI, controls, bounds/collider/camera hoặc dependency.**

## Gate review

1. Xem concept V2: có muốn dùng obsidian phẳng, arcs gãy và ba motif này làm hướng arena không?
2. Xem combat/crowd ở kích thước phone và grayscale: player có bắt mắt, threat có rõ, floor có quá bận/tối không? Chỉ nhận xét hình, chưa cần chơi lại Q2–Q6.
3. Phản hồi bằng tên hình và vùng cần đổi, hoặc duyệt hướng V2 để triển khai arena theo contract. Approval concept không tự accepted runtime/Q1/Q6.

Không build/test game ở checkpoint chỉ docs/art này; diff/check liên kết nội bộ PASS,7PNG header/dimensions/SHA256 PASS; diff src/public/tests/package/workflow so main fbc994b6 không đổi. Board có CSS grayscale toggle, nhưng Chromium headless preview timeout không xuất screenshot; chưa xác minh browser rendering, không ghi grayscale/browser PASS. Sau user duyệt mới implementation/checks/deploy/renderer evidence, rồi AWAITING USER PLAYTEST APPROVAL. Dừng tại **AWAITING VISUAL APPROVAL**.
