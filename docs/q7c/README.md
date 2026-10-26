# Q7C — Character & Enemy Art Overhaul

**AWAITING VISUAL APPROVAL — chưa tích hợp.** Q7C = Character/Enemy Art; Q7D = Full Run Polish, chưa mở. Q7B đã user accepted trên5ee970e; commit78f07e6 ghi nhận approval, không suy rộng sang artwork Q7C hoặc Q1.

## Review hiện hành

- Feedback mới: user thấy arena/nhân vật lệchgóc và yêu cầu research. [Kết quả/nguồn/đánh đổi](VIEW_RESEARCH.md): đề xuất stylized top-down¾nhìnxuốngcao, giữfloor/camera/gameplay; không bắt buộc overhead90° hoặc chuyểnisometric. Chưa chốt góc/duyệt bộ hiện tại, chưa sinh artwork revision từ research.

- [Board tương tác](index.html): grayscale/1×–2×,6silhouettes,7states,arena mobile/landscape/tablet/desktop,Boss3đòn và Playeractions. Source riêng/ảnh compositing, không renderer Q7C runtime.
- [Six-character state preview](evidence/states-v1.png), [lineup](evidence/lineup-v1.png), [Boss3patterns](artwork/chain-warden-patterns-v1.png), [PlayeractionsV2](artwork/player-actions-v2.png). Board/state preview V1 hiện dùng PlayerV2; tên ảnh evidence là version của board, không version Player.
- [Mobile có HUD accepted](evidence/phone-concept-390.png) / [grayscale](evidence/phone-grayscale-390.png); [arena390](evidence/crowd-390.png), [320](evidence/crowd-320.png), [844landscape](evidence/crowd-844.png), [tablet768](evidence/crowd-768.png), [desktop1440](evidence/crowd-1440.png), [Boss/Elite390](evidence/boss-390.png). Canvas/zoom lấy layout Q7B thật:372×356/.775,302×252/.75,490×254/.75,750×536/1.3,1374×542/.85875. 320 viewport là320×740, không844. Desktop floor coverage guard chi phối zoom.
- Enemy/BossV1 và PlayerV2 hiện hành. PlayerV1 quá tối trong grayscale mobile; ImageGen đã repaint phần giáp mint sáng thànhV2, giữ pose. Giữ V1 như lịch sử, không dùng V1 làm hướng visual hiện hành.
- [Asset spec](ASSET_SPEC.md), [prompts/provenance/rights/giới hạn](PROMPTS.md), [source hashes](manifest.json), [checks](evidence/checks.json). Source PNG được copy nguyên byte, không crop board hay vẽ body procedural.

Crowd32 là staged stress composition, không natural run/spawn contract. SourceRect để trưng bày lấy từ **dedicated sprite source**; chưa runtime atlas. BEFORE là screenshot Q7B thật, AFTER là composite khác vị trí, không chứng minh improvement pixel-for-pixel. HUD/controls/sàn giữ ảnh accepted; composition bỏ threat/marks/HPbars/VFX để đọc body silhouette, nên chưa chứng minh P0 threat/P2 khi chiến đấu. Baseline thật vẫn có threat/VFX; kiểm đồng thời trong renderer sau visual approval. Không tự kết luận full hierarchy/motion/performance đã đạt.

## Validation / giới hạn hiện tại

Đã xem6sheets,PlayerV2,Boss3patterns,arena/color/grayscale. PNG integrity/hash/relative assets và board Chromium320/390/768/1440 PASS: không pageerror hoặc overflow, ảnh tải đủ. `npm run build` PASS (gồm typecheck), `npm test`159PASS/0fail trên runtime baseline; warning Phaser bundle>500KB đã có. Không diff src/public/package/lockfile/workflow; checks không là art acceptance hoặc kiểm animation mới.

Chưa runtime atlas/direction cleanup/pivots, chưa animation/alpha-clipping/performance Q7C hoặc thiết bị thật/Safari. Một số baked weapontrail/arrow/impact trong pose phải loại khỏi source runtime để giữ VFX accepted. Sau duyệt cần source sạch riêng và test renderer đúng gameplay; không dùng auto-crop7ô này làm production atlas. Q7C overall chưa complete/accepted.

## Cách duyệt lượt này

1. Xem lineup/state preview và Boss3patterns: nhận diện đủ6role; sweep/ring/slam đọc khác nhau bằng pose.
2. Xem mobile390/crowd320 ở100% và grayscale: Playermint/ivory thấy ngay, Gruntmask/Archerbow/Volatile5shards/Bulwarkshield/Bosscrown khác nhau. Desktop/tablet dùng đúng ảnh1:1 khi đánh giá, không chỉ thumbnail thu nhỏ.
3. Phản hồi nhân vật/state bị sai hoặc chìm; có thể duyệt hướng kèm điểm sửa. Chưa cần playtest gameQ7C vì chưa tích hợp. **Dừng AWAITING VISUAL APPROVAL theo yêu cầu user**, không Q7D.

Commit audit d747f49 đã push main. Bộ source/review và docs checkpoint được push branch `codex/q7c-visual-review` để không kích Pages deploy game trước visual gate. Sau approval mới đưa implementation qua workflow deploy hiện có.

## Goal / acceptance hiện tại

Tạo artwork Neon Occult / Fractured Geometry đồng nhất cho Player, Grunt, Archer, Volatile, Bulwark và Chain Warden. Giao sprite concept riêng, state previews, Boss3pattern, mockup trong arena Q7A ở tỷ lệ gameplay, crowd và grayscale. Đồng bộ docs/push và dừng **AWAITING VISUAL APPROVAL**. Chưa thay runtime, chưa mở Q7D.

## Audit baseline

- Remote main đã fetch và fast-forward từ5ee970e tới78f07e67933fee148a57b2325dd264a976e42d6a; clean trước task. Không có open PR qua GitHub connector tại audit.
- Đã đọc AGENTS.md, GAME_BRIEF.md, HANDOFF.md, `.agents/skills/handoff/SKILL.md`; nguồn quyết định mới nhất là yêu cầu Q7C và approval Q7B của user.
- `PlayerVisual.ts`: SVG8parts `public/assets/fractured-vessel.svg`, pose từ simulation, muzzle/slash/dash ghosts đã có. `EnemyVisual.ts`: bodies bằng Graphics, ground telegraph tách hàm. `ArenaScene.ts`: floorImage depth0, combatGraphics depth1, playerContainer depth2. Q7C sau duyệt chỉ thay body artwork; giữ ground telegraphs/VFX và thứ tự ưu tiên.
- Floor Q7A: `public/assets/arena/broken-seal-v2.webp`,1600×1000,tint#7a8791; hash71b8d5b2b0850d40cd7c39a795a8caee129e4b14dc7f08f20093d17c18fea70a. Không đổi asset này.
- Collider radius: Player16/common14/Bulwark22/Boss32. Body display size và collider là hai thông số riêng. Camera compact clamp(min(canvasWidth/480,canvasHeight/400),0.75,1.3), luôn phủ floor; desktop min(width/1120,height/700), cùng floor coverage guard. Preview phải ghi scale, không gọi mockup là runtime screenshot.
- Timing nguồn: `balance.ts` và `combat.ts`, không sửa. Grunt0.42s windup/0.22s recovery (+leap hiện có), Archer0.7/0.4, Volatile fuse0.7/recovery0, Bulwark0.65/0.75, Boss0.62/0.46 và recovery0.32/0.24. Animation sau duyệt theo phase simulation, không animation events gây damage.
- Boss attackAction0=sweep,1=12ray ring+fan3,2=targeted slam/leap; giữ nguyên hướng/khóa mục tiêu/damage/threat geometry. Không thiết kế đòn thứ4.
- Pages baseline code5ee970e đã deploy success theo handoff (40292060536). Audit gh run hiện bị policy403 tại api.github.com; không tuyên bố kiểm lại live/workflow thành công.

## Reference / hierarchy khóa

Reference chính là ảnh user Q7A Visual Hierarchy / Contrast Study V1; bản gốc tương ứng có tại `../q7a/artwork/contrast-palette-v1.png`. Chỉ dùng làm art direction, không cắt figure từ board thành sprite.

| Tier | Giữ nguyên |
| --- | --- |
| P0 | Player mint#9DFFE2/ivory#E9FFF0; warning rose#FF6F87; imminent#FFE599 theo predicate thật |
| P1 | Grunt hooked mask rose; Archer hood/bow violet#C399FF; Volatile5shards amber#FFCC80; Bulwark broad plate/shield cyan#63D9F5; projectile violet/white point |
| P2 | Rupture3diamonds/relay mint, charged ring amber, barrier broken hex cyan; không bake vào sprite |
| P3 | Obsidian floor#090D19/#111925/#202D3A, rune#35474D, ít tương phản hơn actor/threat |

Boss mở rộng nguyên ngôn ngữ Q3: crown gãy, ribcage rỗng,3chain segments; dark bronze/amber tiết chế. Phân biệt với Volatile bằng kích thước, crown/body/chains; không tăng glow lấn P0.

## State contract

Mỗi sheet source riêng có7cột idle/move/windup/attack/recovery/hit/death. Đây là pose concepts, chưa là animation atlas đã QA. Windup/attack/recovery không thêm simulation duration. Volatile recovery là mảnh nguội aftermath **N/A với actor sống**, không thêm recovery; attack đi thẳng tới death/explosion hiện có. Hit chỉ đổi presentation; Boss không bị stagger bởi hit pose. Death không trì hoãn remove/kill/reward; nếu sau duyệt cần linger thì chỉ visual ghost hữu hạn.

Player cần bao phủ L1/L2/L3/Heavy, basic/charged và dash ngoài sheet identity; Boss cần sweep/ring/slam khác tư thế, cùng identity. Hướng/sốframe/pivot cuối chỉ chốt sau approval; không dùng sheet sinh đầu làm atlas production khi chưa kiểm clipping/alpha/registration.

## Gate sau visual approval

Chỉ sau user duyệt: sprite source/atlas riêng và asset-based rendering+animation; không framework/dependency hoặc body procedural. Giữ hitbox/AI/damage/timing/telegraph/VFX/controls/HUD/Q2–Q7B. Kiểm typecheck/build, focused regressions enemies/combat/input, renderer320/390/844/768/1440, crowd/grayscale, reset/pause/hitstop, performance so cùng scene/baseline và bounded pools. Commit/push theo giai đoạn, deploy Pages hiện có, bàn giao link/ảnh before-after/cách thử và **AWAITING PLAYTEST APPROVAL**. User playtest mới accepted; không tự Q7D.
