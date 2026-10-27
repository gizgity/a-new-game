# Q9C — Anomaly VFX art proposal V1.1

**VISUAL APPROVED — V1.1.** User “visual ok, làm đi” ngày2026-10-27, hội thoại hiện tại không permalink; đồng thời giao production/integration. Không phải user playtest approval. Các nhãn candidate/chưa duyệt dưới đây là snapshot audit trước approval, giữ làm provenance. Delivery mới tại [vfx-production](../vfx-production/README.md). Feedback user27/10: “vfx của anomaly còn mờ nhạt, chưa phân biệt đc với cái vfx của quái, propose art để sửa, follow art bible của dự án”. Q9C gameplay chưa playtest accepted; không tự Q9D. Scope lượt này: art proposal, không balance/timing/collider/RNG/input/HUD layout changes.

## Vấn đề và hướng đề xuất

Runtime Q9C dùng cùng vòng đỏ mảnh cho Storm/Ground/Echo; prepare chuyển gold giống threat, impact Storm chỉ có một bolt nhỏ. Static chia sẻ nét relay với combat, Broken Seal dùng square cyan dễ gợi Barrier, Blood hầu như chỉ thấy resource tăng. Cảnh24quái cho thấy source của hiệu ứng không rõ khi các line/fan/pip chen nhau.

Đề xuất giữ ngôn ngữ **Fractured Geometry / Neon Occult**: nét pixel gãy, mảng obsidian, highlights cục bộ. Common source signature là **4ngoặc ấn gãy ivory đặt ngoài biên tròn**. Biên damage vẫn là circle đúng radius; brackets chỉ báo nguồn Anomaly. Khoảng rỗng và dark under-edge giúp đọc khi chồng nét quái/grayscale. Chuẩn danger chuẩn bịrose → imminentgold → activeivory giữ nguyên; nguồn được nhận diện thêm bằng shape và motion.

Không đổi thành màu sàn xanh “an toàn”; không tint cả arena, fog/bloom, particle wall hoặc ấn khổng lồ dưới Player. Common signature không dùng3diamond Rupture, cyanhex Barrier hoặc enemyfan/chevrons. Palette anchors lấy Art Bible, không tạo art direction/DDR mới. Không sửa Bible để hợp output.

| Anomaly | Benefit / visual identity | Drawback / danger identity |
| --- | --- | --- |
| Fractured Storm | Bolt gãy ngắn, vài nhánh sáng trong vùng đã báo; contact giữ player silhouette | Vòng gãy+4ngoặc; notch tia sét ở ngoài mép. Dấu chuẩn bị và impending rõ, không pillar từ trời che player |
| Blood Moon | Crescent crimson nhỏ sau contact finisher;2mảnh energy ấm về vũ khí khi nhận Charged | Trail chips ngắn sau common đang chase. Không diễn tả hồi HP hoặc liên tục phủ aura |
| Volatile Ground | Fragmented rim của Detonate rộng đúng radius đang có | Vòng gãy+4ngoặc, vài khe rạn mọc trong vùng; impact plate shards thấp rồi tan, không thành vật cản |
| Static Field | Zigzag lavender/ivory ngắn tới các target thực sự bị counter | Extra Archer shots có đầu forked shard/trail ngắn, khác native round shot; giữ hitbox/speed/count |
| Broken Seal | Heavy tách seal thành2mảnh theo hướng đẩy | Chân common có2ngoặc+slash gãy trong đúng resistance window; không bọc shield cyan hoặc thêm CC Boss/Elite |
| Echo Chamber | Extra relay có trail echo lavender đứt, pairedcorner ở điểm nối; Rupture mint giữ nguyên | Vòng gãy+4ngoặc,2arc lồng và notch riêng; mờ trace về nguồn, không ám chỉ beam damage |

## Bộ ảnh review

- [Board sáu Anomaly V1.1](source/concept-v1.1.png): nghiên cứu motif/state, **không phải spritesheet production hoặc renderer**.
- [Trang so sánh đầy đủ](review.html): current Q9C trước sửa cạnh **composite concept**,4viewports và grayscale cùng ảnh; approved Q7C/Q8C refs riêng ở đầu trang.
- Composite trên runtime thật: [320dọc](mockups/proposed-320.png), [390dọc](mockups/proposed-390.png), [844ngang](mockups/proposed-844.png), [1440desktop](mockups/proposed-1440.png). Mockup chỉ đề xuất Storm warning để duyệt source signature chung; các Anomaly còn lại ở board, chưa có runtime mockup riêng từng loại.
- Baseline current thực từ code`a489279`/handoff`e1b237e`: [320](baseline/current-320.png), [390](baseline/current-390.png), [844](baseline/current-844.png), [1440](baseline/current-1440.png). [Capture metadata](baseline/captures.json), [script](capture-baselines.mjs). Đây là **current unaccepted Q9C VFX**, không tự gọi artwork approved.
- Approved style/hierarchy: [Q7C Charged](../../q7c/runtime/after-charged-390.png), [Q7C grayscale](../../q7c/runtime/after-grayscale-390.png), [Q8C Arrival](../../q8c/arrival-runtime/evidence/peak-390.png). Đã mở ảnh và truyền ảnh thật vào ImageGen. Q7C/Q8C approval giữ theo Art Bible/index; khác fixture/viewport/layout lịch sử, không giả thành before/after cùng simulation tick.
- [BảnV1 trước correction](source/concept-v1.png) là superseded exploration. V1.1 sửa phaseStorm/bolt cao, Static không có target-lock mới, seal resistance về chân quái và Echo không dùng notch sét. Không crop bất kỳ board nào làm texture runtime.

## Geometry và readability

Baseline visual fixture:24quái,2Grunt windup, Storm radius64worldpx,0.85/1.3s warning, world freeze để chụp. Zoom320/844=0.75,390=0.775,1440≈0.9171. Bán kính hiển thị tương ứng48/49.6/48/58.70screenpx. Không sửa production để làm mockup. Input/hit area/HUD camera baseline giữ nguyên; có baseline4góc390.

ImageGen composite là **đề xuất art có thể có sai số pixel/typography/registration**. Chưa dùng output làm bằng chứng collider đúng, asset đúngpivot/alpha hoặc FPS. Chỉ runtime integration sau approval mới chứng minh geometry/motion. Grayscale proof phải dùng CSS grayscale trên chính ảnh màu, không yêu cầu ImageGen vẽ một cảnh grayscale khác.

## Consistency check

Đã xem boardV1.1 final, cả4composite, baseline4góc và grayscale của cùng cặp ảnh. PASS dưới đây chỉ là review tĩnh trong scope đề xuất, không là approval của user.

| Tiêu chí | Kết quả | Evidence / giới hạn |
| --- | --- | --- |
| Palette / semantic danger | PASS tĩnh | Rose/gold/ivory, lavender/cyan/amber cục bộ theo Bible; không floor tint hoặc safe-mint hazard; final board xóa warning rim tồn tại sai sau nổ |
| Player P0 / role silhouette / top-down¾ | PASS tĩnh | Player mint và silhouette Grunt/Archer còn đọc được trong4composite; không đề xuất actor mới; không chứng nhận4facing production từ ảnh này |
| Obsidian / fractured materials / local light | PASS tĩnh | Rạn/plate/bolt theo reference Q7C/Q8C, không fog/bloom rộng |
| Anomaly vs enemy source | PASS định tính | Ivory corner brackets + dashed circle phân biệt với thin native circle/fan; trên [390gray](proof/compare-390-gray.png) và [320gray](proof/compare-320-gray.png) vẫn nhận ra nguồn |
| Phone dọc/ngang / desktop / crowd | PASS review tĩnh | Cặp before/composite320/390/844/1440,24quái. [Color pairs](proof/compare-390.png), [844gray](proof/compare-844-gray.png), [1440gray](proof/compare-1440-gray.png); cần cảm nhận user |
| Exact scale / pivot / alpha / untouched pixels | UNKNOWN production | ImageGen đã redraw/resample một phần; bitmap không đồng kích thước đầu vào. Aspect gần baseline, không suy collider/HP text/pixel registration đúng tuyệt đối; không dùng làm texture runtime |
| State / motion / cooldown fidelity | UNKNOWN runtime | Board mô tả existing triggers/timings, không animation proof; V1.1 đã bỏ Static target-lock giả/HP heal và sửa foot glyphs. Captions là study, contract/config hiện hữu là authority |
| Four corners / arena edges | PASS baseline, UNKNOWN proposed integration | [NW](baseline/corner-nw-390.png), [NE](baseline/corner-ne-390.png), [SW](baseline/corner-sw-390.png), [SE](baseline/corner-se-390.png). Chưa generated proposed-corner/renderer proof; kiểm clipping source brackets sau approval |
| HUD / player / important telegraphs | PASS composition, UNKNOWN live overlap | HUD lane/controls giữ bố cục trongcomposite; ImageGen không là chứng cứ bảo toàn từng pixel hoặc telegraph motion. Production sẽ kiểm đồng thời Boss combo/Charged/marks |
| All6 separate runtime mockups | UNKNOWN / chưa có | Board đủ6; chỉ Storm warning có4composite để duyệt common source signature. Không giả thành6runtime implementations |
| Device / FPS / latency / playtest | UNKNOWN | Không iOS/Safari/thiết bị thật hoặc user playtest cho bộ art mới |

Không có visual approval mới. Production gate tiếp theo sau user duyệt art: tạo source riêng có alpha/registration, không crop board; kiểm từng effect ở world scale, Boss/crowd/grayscale/4góc rồi mới integrate theo scope được giao.

## Provenance và gate

Theo [game-art](../../../.agents/skills/game-art/SKILL.md): “concept → consistency check → user approval → production asset → integration”; “Dừng AWAITING VISUAL APPROVAL”. Cần user duyệt **V1.1, source signature chung,6motif và mockup readability** trước production. Nếu muốn sửa chỉ cần nêu motif nào/điểm nào khó phân biệt.

[Exact prompts](source/PROMPTS.md); refs/output hashes trong `manifest.json`. SourceImageGen dùng artwork dự án đã approved làm input; không third-party art. Output theo điều khoản dịch vụ áp dụng, không khẳng định CC0/độc quyền; seed/model không được cung cấp. Source/raw trong `/workspace/generated_images` giữ nguyên; bảncopy trong docs chỉreview, không public/assets.

Chưa tạo production textures, chưa tích hợp/deploy, không đổi src/config/assets/artBible/DDR. Không build/test gameplay lại cho lượt proposal; kiểm diff/paths/refs và browser baseline/proof. Q9C acceptance/build/test/deploy cũ giữ nguyên nhãn, không dùng lại như approval cho V1.1.
