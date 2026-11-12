# B1-RESET — Reference manifest (A3)

CONCEPT — PROPOSED — NOT PRODUCTION. Task: B1-PLAYER-BASE; spec revision2; image revision1; 2026-11-12. Không TARGET/EVIDENCE candidate nào được approved.

| ref_id | task_id | type | revision | path | source | view_context | binding | status | approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1-A-CHAR | B1-PLAYER-BASE | CONCEPT | image1/spec2 | [B1-A-character-v1.png](B1-A-character-v1.png) | ImageGen, PROMPTS A, no image input | 1536×1024, một neutral character, nền study, không gameplay scale | Khối ngang/không đầu/hai chân; texture/light chỉ minh họa; không timing/collider | PROPOSED | NONE |
| B1-B-CHAR | B1-PLAYER-BASE | CONCEPT | image1/spec2 | [B1-B-character-v1.png](B1-B-character-v1.png) | ImageGen, PROMPTS B, no image input | 930×1691, một neutral character; view còn đứng hơn overhead intent | Trục cong/đầu U/chân dài; không khóa view cuối/timing/collider | PROPOSED | NONE |
| B1-C-CHAR | B1-PLAYER-BASE | CONCEPT | image1/spec2 | [B1-C-character-v1.png](B1-C-character-v1.png) | ImageGen, PROMPTS C, no image input | 1672×941, một neutral character trên nền study | Vỏ ngang/bốn chân/hai chi chức năng; không suy hitbox/locomotion | PROPOSED | NONE |
| B1-BASE-M390 | B1-PLAYER-BASE | BASELINE | Q7C0041064/deploy2ef6d48 | [after-crowd-390.png](../../../q7c/runtime/after-crowd-390.png) | Renderer fixture Q7C, nguồn/quyền và approval lịch sử trong art-reference | 390×844,33enemy,crowd/yellow telegraph, high¾ | Chỉ ngữ cảnh before/scale; không mẫu tạo hình mới | PROPOSED | NONE for B1; Q7C historical accepted |
| B1-BASE-D1440 | B1-PLAYER-BASE | BASELINE | Q7C0041064/deploy2ef6d48 | [after-crowd-1440.png](../../../q7c/runtime/after-crowd-1440.png) | Renderer fixture Q7C | 1440×900, cùng fixture, desktop | Chỉ context before; chưa candidate comparison | PROPOSED | NONE for B1; Q7C historical accepted |

Mọi ảnh concept có nhãn CONCEPT — PROPOSED — NOT PRODUCTION trong ảnh. Metadata baseline PROPOSED nói việc bind vào B1 chưa duyệt, không phủ định approval Q7C lịch sử.

## Sources / review

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

Desktop/grayscale/crowd/telegraph/4góc của candidate chưa verified. Không có approved target. Cả ba hướng PROPOSED / AWAITING USER REVIEW.

