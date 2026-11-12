# B1 — Reference manifest (A3)

CONCEPT — PROPOSED — NOT PRODUCTION (SOUL separated study hiện hành). Task: B1-PLAYER-BASE; active spec revision4; image revision1; 2026-11-12. Không TARGET/EVIDENCE candidate nào được approved.

| ref_id | task_id | type | revision | path | source | view_context | binding | status | approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1-A-CHAR | B1-PLAYER-BASE | CONCEPT | image1/spec2 | [B1-A-character-v1.png](B1-A-character-v1.png) | ImageGen, PROMPTS A, no image input | 1536×1024, một neutral character, nền study, không gameplay scale | Khối ngang/không đầu/hai chân; texture/light chỉ minh họa; không timing/collider | REJECTED | User “cả 3 không đạt”, 2026-11-12; chỉ A/B/C |
| B1-B-CHAR | B1-PLAYER-BASE | CONCEPT | image1/spec2 | [B1-B-character-v1.png](B1-B-character-v1.png) | ImageGen, PROMPTS B, no image input | 930×1691, một neutral character; view còn đứng hơn overhead intent | Trục cong/đầu U/chân dài; không khóa view cuối/timing/collider | REJECTED | User “cả 3 không đạt”, 2026-11-12; chỉ A/B/C |
| B1-C-CHAR | B1-PLAYER-BASE | CONCEPT | image1/spec2 | [B1-C-character-v1.png](B1-C-character-v1.png) | ImageGen, PROMPTS C, no image input | 1672×941, một neutral character trên nền study | Vỏ ngang/bốn chân/hai chi chức năng; không suy hitbox/locomotion | REJECTED | User “cả 3 không đạt”, 2026-11-12; chỉ A/B/C |
| B1-BASE-M390 | B1-PLAYER-BASE | BASELINE | Q7C0041064/deploy2ef6d48 | [after-crowd-390.png](../../../q7c/runtime/after-crowd-390.png) | Renderer fixture Q7C, nguồn/quyền và approval lịch sử trong art-reference | 390×844,33enemy,crowd/yellow telegraph, high¾ | Chỉ ngữ cảnh before/scale; không mẫu tạo hình mới | PROPOSED | NONE for B1; Q7C historical accepted |
| B1-BASE-D1440 | B1-PLAYER-BASE | BASELINE | Q7C0041064/deploy2ef6d48 | [after-crowd-1440.png](../../../q7c/runtime/after-crowd-1440.png) | Renderer fixture Q7C | 1440×900, cùng fixture, desktop | Chỉ context before; chưa candidate comparison | PROPOSED | NONE for B1; Q7C historical accepted |

Mọi ảnh concept có nhãn CONCEPT — PROPOSED — NOT PRODUCTION trong ảnh. Metadata baseline PROPOSED nói việc bind vào B1 chưa duyệt, không phủ định approval Q7C lịch sử.

## Historical exploration — spec revision3 / NEEDS REVISION

| ref_id | task_id | type | revision | path | source | view_context | binding | status | approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1-SOUL-GRAPHIC | B1-PLAYER-BASE | CONCEPT | image1/spec3 | [B1-SOUL-graphic-v1.png](B1-SOUL-graphic-v1.png) | ImageGen original, PROMPTS SOUL graphic; no image input | 1024×1536, neutral, nền study; không gameplay scale | Soul-prison/crystal assembly intent; identity/proportion còn cần sửa; không runtime/mesh/timing | PROPOSED | NONE |
| B1-SOUL-25D | B1-PLAYER-BASE | CONCEPT | image1/spec3 | [B1-SOUL-25d-v1.png](B1-SOUL-25d-v1.png) | ImageGen edit từ SOUL graphic, PROMPTS SOUL2.5D | 1024×1536, cùng neutral/view; look study, không Three.js render | So planes/light/material; không khóa silhouette/engine/camera/gameplay | PROPOSED | NONE |

Ba study A/B/C ở bảng trên là lịch sử REJECTED; approval “cả 3 không đạt, concept k có chất game, giống quái hơn là nhân vật chính”, 2026-11-12, hội thoại hiện tại không permalink. Không tái dùng làm design input.

## Active exploration — spec revision4

| ref_id | task_id | type | revision | path | source | view_context | binding | status | approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1-SOUL-SEPARATED | B1-PLAYER-BASE | CONCEPT | image1/spec4 | [B1-SOUL-separated-v1.png](B1-SOUL-separated-v1.png) | ImageGen original text, no image input; exact prompt in PROMPTS | 1199×1312, một neutral figure, nền study, không game-scale/runtime | Detached masses/compact soul intent; gap/pose/identity còn cần chỉnh; không suy code/3D/flight/timing | PROPOSED | NONE |

[Research có nguồn và review](RESEARCH.md). Hai SOUL studies revision3 cần sửa theo user “các tinh thể dính nhau quá, chưa đẹp”; không phải TARGET. Study mới không sửa/tiếp nối A/B/C đã REJECTED. Ảnh reference game bên thứ ba chỉ xem qua web, không lưu/dùng ImageGen input/asset.

## Sources / review

SOUL original outputs: `exec-736a46e8-ab40-4248-bcea-e3d4b98af8fe.png` (graphic), `exec-55fce45a-80c0-4cdb-b8ba-7a319f8da878.png` (2.5D); giữ original ngoài repo, refs là bản copy nguyên ảnh.

SHA256 graphic: `6dd0db0b1c692cc2a23f1aa2831dc59a482fd9fff9be07986a0a00dcc9bd6a0d`; 2.5D: `8da5daa3e74f2694738476765613e5d9fedfda7fd8d636291984544d4846dac5`.

[Task card](../../tasks/B1-PLAYER-BASE.md), [exact prompts](PROMPTS.md), [source/rights baseline](../../../art-reference/README.md). ImageGen model/seed không được cung cấp; output theo điều khoản dịch vụ, không khẳng định CC0/độc quyền. Không production asset hoặc external art.

Character source generated originals (giữ nguyên ngoài repo, bản copy vào refs):
- A: exec-943bab6c-3c11-4db8-b9fc-4861417291de.png.
- B: exec-b86423be-76f4-4d0d-8e3a-38d31a090c2c.png.
- C: exec-4a049301-0519-45ee-9629-2eee94bfe109.png.

SHA256:
- A: d0f14d8bec9cdc12b4a0c2b22a71501be98c08aae945fc305400e51e32cf4c06
- B: be51b47ffdbcffc33f1d6fe45da5bcf2c865074c239d2290ffb0463b593af58b
- C: f57cabcb41540d646d1123a8a2439903dadcd982fb592326119ecb8e8d9063fa

## Gameplay-scale comparisons

**RUNTIME COMPARISON BLOCKED — 0/3 valid.** Nguồn screenshot thật tồn tại và đã xem, không thiếu screenshot. Ba ImageGen edit attempts làm thay HUD/panel scale/identity; không lưu ảnh sai vào repo, không cấp ref IDs giả. Không gọi chúng runtime evidence hoặc dùng để PASS readability. Xem prompt và review chi tiết trong card.

Desktop/grayscale/crowd/telegraph/4góc của candidate chưa verified. Không có approved target. Ba hướng A/B/C bị REJECTED bởi user, không phát triển tiếp. Hai SOUL studies mới PROPOSED, chưa runtime comparison.


Separated prototype SHA256: `61a0a488ac6a4ccd004efc3021bb2aa8bbafb17c13b64a799ab85d3754767cee`. Original: `exec-742c157e-57c8-4d56-b9cd-57ccd4eb3367.png` (copy nguyên ảnh; original giữ ngoài repo).
