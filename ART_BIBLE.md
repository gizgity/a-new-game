# Art Bible — Fractured Geometry / Neon Occult

Chuẩn visual rút từ **artwork/runtime đã user accepted Q7A–Q8C**, audit 2026-10-26 trên `main@bcd148b`. Đây là tài liệu chuẩn hóa baseline, không phải approval mới. Release [v0.1.0](https://github.com/gizgity/a-new-game/releases/tag/v0.1.0) trỏ `4770bf617f292c407685c4fbed1ebf5d3c6cb84f`; release published 2026-10-26T16:46:46Z theo HANDOFF. Artwork accepted trước Release được dùng tại đây; DDR chỉ quyết định mới sau Release, hiện rỗng.

## Nguồn và phạm vi audit

[Reference board/index](docs/art-reference/README.md) chứa ảnh thực, nguồn gốc, assets gốc, exact prompts, hash manifests và approval evidence. Ưu tiên runtime/source production accepted hơn concept; không lấy chữ/nhân vật/scale sai trong concept làm chuẩn.

| Mốc | Bằng chứng user trong repo (2026-10-26) | Phạm vi chuẩn |
| --- | --- | --- |
| Q7A | [IMPLEMENTATION](docs/q7a/IMPLEMENTATION.md), “hiện 7a chỉ mới có thay đổi về sàn arena? nếu vậy thì t approved”, code0e0a9af | Floor Broken Seal V2; không approve sprite mới trong palette board |
| Q7B | [HUD_V3](docs/q7b/HUD_V3.md), “q7b đã đạt”,5ee970e/approval78f07e6 | HUD SVG bevel, icon-only, 4attack + Dash + Surge |
| Q7C | [IMPLEMENTATION](docs/q7c/IMPLEMENTATION.md), “visual approved q7c”, “duyệt q7c đạt”, code0041064/deploy2ef6d48 | Player/4enemy/Boss, top-down¾,236frame atlas |
| Q7D | [README](docs/q7d/README.md), “đã đạt q7d”,66e0799 | Presentation/result cleanup; không artwork mới |
| Q8A / Q8B | [Q8A](docs/q8a/README.md) “q8a đạt yêu cầu”,394341c; [Q8B](docs/q8b/README.md) “oki duyệt q8b”,eb6fbbe | Crowd/pacing accepted, giữ art; không suy ra concept mới |
| Q8C | [README](docs/q8c/README.md), “q8c đạt”,8cbff77/approval7625fa2 | Enraged1.4s freeze và Arrival V2; thay transform0.8s/Graphics warning cũ |

Các câu AWAITING trong snapshot cũ không override approval note mới. Evidence là trích dẫn đã lưu trong repo/commit, không có permalink hội thoại gốc; không tự tạo permalink hoặc approval ngoài scope trên.

## Art direction, camera, material, light

Dark occult geometric arena, crisp pixel actors, fractured plates/masks/hollow cores, ít chi tiết nhưng role rõ. Môi trường obsidian phẳng, các mặt rộng/bevel nông, vòng khắc nghi lễ đứt và ba inlay bất đối xứng. Không biến khe/ornament thành chướng ngại mới. HUD cùng họ obsidian/kim loại/góc gãy, SVG có chủ đích.

Actor **top-down three-quarter nhìn cao xuống**: thấy đỉnh đầu/vai/vũ khí, thân/chân rút ngắn; bốn hướng south/east/north/west vẽ theo hướng, north là lưng, không xoay hình humanoid phẳng360°. Floor gần orthographic; giữ camera/zoom/bounds runtime, không đổi camera để khớp artwork. Actor và floor không dùng phối cảnh cinematic hoặc isometric mới.

Giáp là các mảng jade/ivory hoặc metal tối với cạnh sáng tiết chế, joints tối, core nhỏ. Floor có shading nông chìm. Ánh sáng stylized ổn định giữa pose/hướng, bright accents cục bộ; không bloom/fog/halo rộng. Không có bằng chứng góc đèn vật lý cố định theo độ/Kelvin: không tự thêm con số. Sprite body không bake shadow/ground/aura/VFX; dynamic cues tách lớp.

## Palette HEX và hierarchy

Swatches từ [Q7A exact prompt](docs/q7a/PROMPTS.md), actor từ [source prompts Q7C](docs/q7c/source/PROMPTS.md), dynamic colors từ [EnemyVisual](src/game/EnemyVisual.ts), [chargedVfx](src/game/chargedVfx.ts), [style](src/style.css). Đây là semantic anchors, texture có shading/antialias, không phải mọi pixel phải trùng HEX. Không đổi runtime để làm màu prompt đồng nhất giả.

| Tầng | Màu / shape | Quy tắc đọc |
| --- | --- | --- |
| P0 — Player + nguy hiểm tức thì | Player `#9DFFE2` / `#E9FFF0`; prepare `#FF6F87` dashed fan; imminent `#FFE599` solid + chevrons; active `#FFEDCE` | Tìm Player/cue ngay trong crowd, giữ shape+luminance khi grayscale |
| P1 — role / projectile | Grunt `#FF6F87`, Archer/hostile `#C399FF`, Volatile source `#FFCC80`, Bulwark source `#63D9F5`, Boss amber/bronze `#FFCC80` | Distinct silhouette, không palette-swap cùng body; EnemyVisual status dùng Volatile `#FFB36B`, Bulwark `#91B5FF`, không nhầm với body palette |
| P2 — mark / field / feedback | Rupture mint `#6BF3D0`/full `#E5FFF7`,3diamonds; Barrier cyan `#63D9F5` segmented hex; Charged amber `#FFCC80` (VFX `#FFBD62`, hot `#FFF5DB`) | Local ring/relay line/pips, không phủ Player hoặc cue |
| P3 — floor | `#090D19`, `#111925`, `#202D3A`; dim rune `#35474D`; runtime floor tint `#7A8791` | Gray-blue, tối hơn combat; không runes màu threat/bright frame giả collider |

Hierarchy là ưu tiên chú ý, không phải danh sách depth cứng. Arrival V2 là warning đặc biệt: ember red/orange/hot amber nằm sát biên, halo10screenpx mobile/14desktop, dưới telegraph/body, không full-screen fill. Chưa có bộ HEX độc lập được chốt cho texture Arrival; dùng **ảnh/runtime gốc** chứ không bịa swatches. HUD text `#EDF7F5`, panel `#080E19`, crosshair cyan `#74E8FC`, blade mint `#95F3CD`, Dash `#CAB1FA`, Surge `#F2C58B`; state còn shape/glyph/badge, không chỉ màu.

## Silhouette, scale và animation

| Actor | Identity bắt buộc | Body height world px / logical box |
| --- | --- | --- |
| Player | Mask ivory nhọn gãy, core sáng, jade plates rời bất đối xứng; blade tay phải/gun tay trái |40 /96 |
| Grunt | Mask móc rose, eo hẹp, dáng săn khom, cẳng tay liềm dài |36 /80 |
| Archer | Hood violet mặt rỗng, cloak ngắn chẻ, chân mảnh, crescent bow |38 /80 |
| Volatile | Core furnace nứt +5shards obsidian, phi humanoid, không tay/chân |36 /64 |
| Bulwark | Vai slab rộng, chân nặng thấp, shield chữ nhật, recovery mở plate lộ core nhỏ |50 /96 |
| Chain Warden | Crown3mũi gãy, ribcage rỗng,3chain nặng/shackle, bronze-charcoal, floating executioner; không là Bulwark phóng to |76 /192 |

Thông số actual tại [ActorArt](src/game/ActorArt.ts) và [implementation Q7C](docs/q7c/IMPLEMENTATION.md); box chứa weapon/padding, không phải body height. Collider Player16/common14/Bulwark22/Boss32 giữ riêng, không tự đổi theo sprite. Arena1600×1000, floor tint và pivot/foot anchor theo manifests. Atlas1024²/236frames/4MiB decoded; alpha sạch, không matte, không cắt weapon.

Actual animation là **pose-key + transforms**, không phải budget frame sơ bộ trong ASSET_SPEC. Idle breathing/bob, walk theo quãng đường, windup lấy đà/co theo state, attack/recovery/hit/death theo simulation. Player có L1/L2/L3/Heavy/Basic/Charged/Dash/exit; Boss sweep/ring/slam có windup/attack/recovery. Volatile không recovery sống. Hit flash không che cue; death ghost0.28s không collider, dash echoes tách lớp. Pause/hitstop không tự chạy clock giả.

Q8C transform pose riêng front-facing có chủ đích, normalize76px/pivot134/box192; **1.4s world/run freeze**. Phase2 combat vẫn4facings/patterns Q7C + ember tint nhẹ. Không lấy các view Enraged chưa dùng làm bằng chứng đủ4facings mới.

## HUD, VFX và readability

HUD dùng asset9slice/glyph/mask, icon-only paired attacks, HP liên tục/Barrier phân đoạn,4Mutation/2Curse, badge số/timer theo resource thật. Portrait HUD134px + controls284px ngoài canvas; desktop96px, landscape78px với side lanes; kiểm4góc thay vì center-only. Không bake chữ ImageGen, không thêm center spam hoặc fake cooldown.

Telegraph giữ geometry thật, prepare dashed → imminent solid/chevrons → active/recovery. Rupture3diamonds, relay thin mint, Charged local fragmented amber ring, Barrier segmented hex. Graphics hợp lệ cho **dynamic combat cues/VFX**, không thay body/floor bằng procedural drawing. Arrival4nhịp/2s, seam rạn tiết chế ở biên; không wall of fire/fill đỏ/shake lớn.

Ảnh mới phải so cạnh approved baseline tại world scale, có mockup trên arena/HUD runtime thật. Kiểm320/390 portrait,844 landscape và1440 desktop, crowd, grayscale cùng scene, player4góc, khi cue/VFX sáng. Không dùng grayscale minh họa ImageGen thay phép grayscale cùng ảnh; không biến fixture thành natural run/deviceFPS.

## Master ImageGen prompt

Dùng ảnh đã mở từ reference index làm **image inputs thực**, ít nhất đúng loại asset + screenshot runtime chứa arena/HUD. Đây là template tổng hợp từ prompts accepted, không là artwork/decision mới được duyệt. Điền fields theo scope được giao; output luôn candidate.

```text
Create [ASSET TYPE / CONCEPT or PRODUCTION SOURCE] for the original Fractured Geometry / Neon Occult game. Match attached APPROVED [reference paths + versions], especially exact identity, silhouette, palette and material. Preserve stylized high top-down THREE-QUARTER camera for actors, foreshortened torso/legs, visible top of head and shoulders; same elevation across directions. Crisp intentional pixel clusters for actors; broad quiet obsidian facets for environment; deliberate fractured bevel glyph art for HUD. Player mint/ivory remains P0; threat shapes readable, P1 roles distinct, P2 feedback local, P3 floor dim gray-blue. Restrained local edge highlights, no broad bloom. [TYPE TEMPLATE]. Body height [actual world px], consistent ground anchor and handedness. Keep all simulation, scale, camera, HUD geometry and input unchanged. Produce [format/grid/alpha] and label review material as CONCEPT outside the asset. Compare candidate at runtime scale on the attached actual arena/HUD screenshot; never claim generated composition is runtime evidence.
```

Negative constraints: no cinematic/front-view/isometric camera drift; no photoreal/soft3D/anime style swap; no noisy bright floor, glowing combat-colored floor runes, fog/bloom/fullscreen flashes; no palette-swapped shared enemy body; no baked bars/pips/slash/projectile/shadow/aura on actor; no concept-board crops; no text/grid/border in production texture; no invented controls/geometry/resources; no flat rotation to fake facings. Không tự nới constraints khi output lệch.

### Template theo asset type (ghép vào master)

| Type | Nội dung template / refs bắt buộc |
| --- | --- |
| Player | Exact Fractured Vessel identity, blade RIGHT/gun LEFT;4rows S/E/N/W ×7columns idle/move/windup/attack/recovery/hit/death; source1792×1024, clear transparent gutters/constant scale. Action sheet4×8 L1/L2/L3/Heavy/Basic/Charged/Dash/exit riêng. Dùng player source + runtime crowd |
| Enemy | [Grunt/Archer/Volatile/Bulwark identity ở bảng],4×7pose source, clean alpha/ground baseline, no baked effects. Volatile aftermath không state recovery sống. Dùng đúng role source + crowd |
| Boss | Exact Chain Warden crown/chains/void identity;4facings ×3patterns ×3phases theo source boss-patterns. Enraged transform là source riêng, chỉ front pose đã dùng; đừng hứa các view còn lại accepted. Dùng Boss source + runtime Boss/transform |
| Environment | Single flat obsidian floor, broad facets/broken ritual arcs/3flat inlays,1600×1000, no actors/UI/caption, no apparent obstacle, giữ camera/bounds. Dùng original floor + runtime tinted floor |
| UI | Original fractured obsidian bevel frame/glyph, intended scale24px glyph or exact HUD slot, transparent source/no baked text; circle basic/octagon power,4attack+Dash+Surge. Mockup trên HUD thật; ImageGen là study, production SVG cần scope/approval riêng |
| VFX | [semantic cue/shape] in separated phases, confined local area/clean alpha, preserve threat geometry. Arrival: single horizontal seam ≥12:1, hot amber thin core/red-orange fractures, inward-only falloff, no frame/runes/flame wall; runtime512×32 tiling at10–14screenpx. Dùng Arrival source + peak runtime; telegraph mới không tự đổi hit geometry |

Exact prompts lịch sử và quyền dùng được link theo type trong index; không thay prompt cũ bằng bản master này.

## Update và giới hạn bằng chứng

Đổi art direction: user gọi `$design-decision` kèm nội dung đã chốt → append Approved decision mới → cập nhật Bible theo đúng approval → `$game-art` qua concept/consistency/user approval/production/integration. Không sửa Bible để hợp thức hóa output lệch. Skill/registry không tự gọi nhau thay user.

Không thiếu category reference trong6nhóm được yêu cầu. Còn thiếu: permalink hội thoại gốc; exact model/seed ImageGen; reference image HUD user gửi trong chat không có bản gốc độc lập trong repo (dùng runtime SVG accepted); dedicated approved VFX production sheet cho mọi dynamic effect (dùng runtime/code accepted, không bịa sheet); chưa có approved4facing Enraged mới hoàn chỉnh. Không có thông số đèn vật lý hoặc HEX riêng cho texture Arrival đã chốt. Coverage Safari/iOS/thiết bị thật/thermal/motion đầy đủ không được suy từ fixtures. Các thiếu hụt này không hủy approval baseline, nhưng task mới phụ thuộc chúng phải báo blocker cụ thể.
