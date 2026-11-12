# B1 — Player Base V2 / B1-RESET

Status: PROPOSED — AWAITING USER REVIEW
Kind: DESIGN
Revision: 2 — creative reset, 2026-11-12
Owner approval: NONE
Related phase: B; previous task: Gate A / A-H4
Source request: user “B1-RESET — Redesign Player Base V2 From Zero”, “Đây là NEW DESIGN EXPLORATION”, 2026-11-12, hội thoại hiện tại, không permalink.
Docs read theo thứ tự user: AGENTS → HANDOFF CURRENT → MASTER_PLAN → HARNESS → EXPERIENCE_VISION → DESIGN_BIBLE → REFERENCE_PROTOCOL → TASK_CARD_TEMPLATE → ART_BIBLE → art-reference README. Đã đồng bộ main785ec7c lên41407d5 và đọc cập nhật; Gate A đã approved để mở design. Skills game-art/handoff và DDR đã đọc.

## 1. One change / Outcome

Baseline → ba candidates: Q7C chỉ là before/scale context; thiết kế identity hoàn toàn mới với A Press Saint / B Tuning Talon / C Seal Crab. Outcome cần quan sát: protagonist mạnh sẵn, hybrid melee/ranged rõ trong neutral pose, nhận diện giữa crowd/telegraph mà không dựa aura.

Scope IN: ba spec/character studies độc lập; thử comparisons trên screenshot thật; review; card/manifest/prompts/MASTER_PLAN/CURRENT HANDOFF.
Scope OUT: game code, production assets/atlas, animation/action boards/sprite sheets/VFX, gameplay/input/hitbox/timing/balance, HUD/enemy/arena/camera runtime; không B2/implementation/build/deploy; không sửa Bibles/Harness/DDR.

Dependency: Gate A đã mở B1 DESIGN ONLY theo main41407d5. Production vẫn cần approval riêng spec+target+scope.

## 2. Creative reset / Design choices

Supersedes: bỏ hoàn toàn rationale B1 revision1 (cải tiến mask/armor/core). Q7C/Fractured Vessel/Rift Reliquary và các B1 rejected không là starting point, không remix/nối tiếp. Approval runtime cũ và lịch sử git giữ nguyên.

Giữ có lý do: hybrid cận/xa vì Distinct Actions; kim loại sáng/tối vì liên kết thế giới obsidian và phân mảng value. Ba study dùng cùng silver/graphite để khác biệt không dựa recolor.

Direction change **PROPOSED**: pixel/fractured plates → khối liền, graphic painted/smooth metal; mask jade/ivory/core → identity bằng cấu trúc cơ thể. Ảnh thực tế hiện giống render kim loại hơn graphic painted intent; chưa chọn style cuối. Góc cao¾ chỉ là fixture đối chiếu, không khóa camera/số hướng/resolution/palette.

### A — Press Saint / Máy Ấn Phán

1. **Core/structure:** công cụ hành quyết tự vận động; biped không đầu, khối vai hình thang ngược liền rộng, khe định hướng đỉnh, eo đen, hai chân ngắn/đế lớn. Khối nặng ở trên; intent rộng:cao≈1.5, không là runtime constraint.
2. **Shape/material/identity:** đường ngang, mặt nén lớn; thép xước sáng ở vai/tay, sắt đen eo/khớp; focal là vai và hai lỗ nòng tối. Không fragmented plates, mask, core hoặc trinkets.
3. **Experience fit:** immediate power bằng thân nặng; mass slaughter gợi công cụ cắt hàng loạt; stylish có thể phát triển bằng tương phản thân ổn định/chi chức năng dứt khoát. Chain payoff có thể xuất phát cục bộ từ tay; không aura/core thường trực. Tất cả là intent, chưa có motion chứng minh.
4. **Hybrid/readability:** tay phải là lưỡi ép chữ nhật rủ thấp, tay trái nòng đôi hướng trước; khoảng âm hai bên thân. Vai ngang phân biệt với enemy thân hẹp, bạc tạo value separation. Chưa chứng minh ở gameplay scale.
5. **Trade-offs/future:** dễ giống robot công nghiệp/tank chậm, thiếu chất occult, vai che cue, eo đen chìm. Vai/eo/tay tách đủ để nghiên cứu B2–B9; mặt tay còn chỗ cho evolution vật chất có trigger thật. Không tự thêm cơ chế press hoặc khóa timing.

### B — Tuning Talon / Cộng Hưởng Liêm

1. **Core/structure:** thực thể như nhạc cụ nghi lễ sống, trục cao cong; đầu hai nhánh U mở, thân nhỏ, hông rõ, chân digitigrade dài như lò xo. Intent thân trên:chân≈1:2, rộng:cao≈0.55.
2. **Shape/material/identity:** đường cong căng, khoảng âm U và vòm chân làm focal; thép lò xo bóng nhẹ/ceramic graphite, mảng men celadon hông. Không mặt/mask/ngực sáng.
3. **Experience fit:** stylish/control precision bằng thế thăng bằng có hướng, immediate power bằng sắc bén thay giáp dày. Có thể truyền chain qua điểm tác động sau này; không suy ra mechanic cộng hưởng.
4. **Hybrid/readability:** một tay liền thành liềm cong lớn, tay kia nòng vuông ngắn; khối mảnh nhường diện tích cue. Đầu U dự kiến nhận diện bằng shape thay màu.
5. **Trade-offs/future:** tay/chân có thể mất ở40px, U nhập thành vạch hoặc giống glyph HUD; thiếu mass cho slaughter. Khớp/đường cong hỗ trợ nghiên cứu co/duỗi B2–B9, vùng hông cho evolution nếu có binding; không khóa đàn hồi gameplay hay dash.

### C — Seal Crab / Ấn Liệp

1. **Core/structure:** ấn nghi lễ sống săn mồi, phi humanoid: không đầu/cổ/torso người; vỏ lentil thấp ngang, bốn chân chống ngắn dày và hai chi chức năng phía trước. Intent rộng:cao≈1.8.
2. **Shape/material/identity:** dome đúc liền, môi trước phẳng/khe đen định hướng, bốn khoảng âm chân, một vệt đen lớn trên shell. Pewter/graphite, men xanh rất nhỏ. Không relic container/cage/portal.
3. **Experience fit:** mass slaughter gợi máy cắt xuyên crowd, stylish bằng silhouette săn mồi; chain có thể gợi ấn phát động tại contact sau này. Không thêm hiệu ứng/mechanic vào base.
4. **Hybrid/readability:** hàm kéo bán nguyệt phải, nòng đôi trái, tách khỏi bốn chân support; vỏ sáng lớn dự kiến dễ tìm, khe trước giúp đọc hướng.
5. **Trade-offs/future:** dễ giống enemy/crab/pet hơn protagonist; footprint che cue, front/back yếu, bốn chân tăng chi phí action. Support/weapon tách giúp nghiên cứu B2–B9; shell dành cho biến đổi lớn có trigger thật, không trang trí nhỏ; không khóa locomotion/camera.

## 3. Reference bindings

Manifest: [README](../references/B1-PLAYER-BASE/README.md); [exact prompts](../references/B1-PLAYER-BASE/PROMPTS.md).

Baseline ref: B1-BASE-M390 / B1-BASE-D1440, renderer Q7C historical fixture, không current live capture. Baseline body40 worldpx theo ActorArt, không tự đồng nhất40 screenpx khi camera zoom chưa đo.
Concept refs: B1-A-CHAR / B1-B-CHAR / B1-C-CHAR, v1, PROPOSED.
Target ref / approved target: NONE.

**Must match (proposal constraints, chưa là approved target):** A ngang/không đầu/hai chân ngắn; B cao cong/đầu U/chân dài; C ngang/phi humanoid/bốn support legs. Một nhân vật/neutral pose; không aura, mặt người, cloak, mask ivory/core/jade/fragmented vessel. Hybrid đọc qua hai chi chức năng.
**Flexible:** shade/texture/accent nhỏ, refinement proportions, style cuối, góc study phù hợp camera khi user chọn.
**Must not infer:** collider/footprint, speed theo chân, melee range theo lưỡi, projectile count theo lỗ nòng, mechanic theo tên, cooldown/frame/timing/hitbox/zoom/camera/số hướng/pipeline/evolution trigger.
Source/rights: ImageGen original exploration; character generation không image input để tránh tái sử dụng identity. Q7C input chỉ cho comparison attempt. Model/seed không cung cấp; theo điều khoản dịch vụ, không gán CC0/độc quyền.

## 4. Acceptance / Evidence

- [x] AC1: ba khối khác nhau: A hai chân/không đầu/vai rộng; B hai chân dài/U; C bốn chân/vỏ ngang. Ba ảnh riêng tồn tại, mở được.
- [x] AC2: rationale, hybrid neutral, material/focal, trade-offs và tiềm năng B2–B9 cho từng hướng; không action/production.
- [ ] AC3: tối thiểu ba gameplay-scale comparisons hợp lệ trên screenshot thật + Q7C cùng scale/view. **BLOCKED: 0/3 hợp lệ.**
- [ ] AC4: mobile-first + desktop-equivalent, crowd/telegraph/grayscale readability. **NOT VERIFIED**, không PASS từ study.
- [x] AC5: diff chỉ docs/design references, không code/production/Bibles/Harness/DDR; không build/deploy.
- [ ] AC6: user review/chọn/chỉnh, chưa approval.

**RUNTIME COMPARISON BLOCKED:** screenshot nguồn có sẵn và đã xem; không thiếu arena/runtime. Đã thử ba edit ImageGen với screenshot thật và từng study. Tool tái vẽ HUD/nhân vật và đổi panel size, không giữ native390×844/40px yêu cầu. Không xác nhận game scale/pixel nền; cả ba bị loại khỏi refs/deliverable, không commit. Exact prompt được lưu để trace. Thiếu composite đúng scale bảo toàn source/identity; không thay bằng arena tưởng tượng, placeholder hoặc procedural character.

Evidence plan khi xử lý được: baseline nguyên bản + overlay cùng source/view/anchor; đo screen/world scale và body/weapon extents theo zoom thật thay vì giả định40 screenpx; kiểm390/1440 rồi320/844, grayscale/cue overlap/4góc khi cần. Không đổi code/production để lấy ảnh. Không gọi generated montage là runtime candidate.

## 5. Review — intent / observed / chưa kiểm

| Tiêu chí | A — quan sát/rủi ro | B — quan sát/rủi ro | C — quan sát/rủi ro |
| --- | --- | --- | --- |
| Experience Vision | Khối nặng gợi immediate power; stylish/chain chưa chứng minh | Thế thanh/sắc; slaughter/chain chưa chứng minh | Săn mồi thấp/shear rõ ở ảnh lớn; chain chưa chứng minh |
| Design Bible | Mảng lớn/không glow; công nghiệp lấn occult | Shape riêng/ít accent; góc còn quá đứng | Mass liền/không trinket; giống máy crab |
| Silhouette | Vai ngang/không đầu/chân ngắn thấy rõ | U/chân dài khác A/C | Bốn chân/vỏ ngang khác A/B |
| Hierarchy/contrast | Bạc nổi trên nền study; eo có thể chìm | Highlight hẹp có thể mất | Shell sáng có thể tranh cue |
| Hybrid neutral | Chém/nòng đôi thấy ở ảnh lớn | Liềm/nòng vuông thấy ở ảnh lớn | Shear/nòng đôi thấy ở ảnh lớn |
| Gameplay/mobile/desktop | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Crowd/telegraph | Vai/tay rộng có nguy cơ che cue; chưa đo | Nhường cue nhưng dễ mất thân; chưa đo | Chân rộng/giống enemy; chưa đo |
| B2–B9/evolution | Khối tay/eo tách; chưa action evidence | Đường cong/khớp có tiềm năng; chưa timing evidence | Support/weapon tách; motion có thể tốn hơn |

Lệch ảnh: cả ba giống render kim loại hơn graphic painted intent; A/C có facet mép nhưng không fragmented armor. B chưa overhead như prompt, hông chưa đủ dominant. Ratio là intent, không số đo output. Không tuyên bố concept hoàn toàn khớp spec hoặc visual quality PASS.

Kiểm reset: không dùng ảnh Q7C/Fractured Vessel hoặc concept cũ làm image input character; không mask/core/jade/fragmented plates/reliquary. Không tái dùng file cũ. Ảnh Rift Reliquary và các B1 rejected không có file độc lập truy cập được trong checkout đã đồng bộ; không khẳng định pixel-compare mọi rejected image. Giữ nguyên prohibition của user.

## 6. Approval gate / Implementation

Approval status: AWAITING USER REVIEW.
Approved scope/spec/refs/quote: NONE. A/B/C đều PROPOSED.
STOP: thiếu approved target, AC3/AC4 chưa đạt; không winner/production/B2.
Implementation commit / candidate runtime evidence: NONE / NONE.
Build/typecheck/tests: NOT RUN — design-only; không build/deploy.
Technical: PARTIAL — PNG/path/metadata/diff kiểm được; runtime readability NOT CHECKED.
Visual review: AWAITING USER. User playtest: NOT APPLICABLE.
Changed files: card này; references/B1-PLAYER-BASE/{README.md,PROMPTS.md,B1-A-character-v1.png,B1-B-character-v1.png,B1-C-character-v1.png}; MASTER_PLAN.md; CURRENT HANDOFF.md.
Known gaps: AC3 0/3; chưa candidate evidence desktop/grayscale/4góc; world identity/style/view cần review.
**FINAL STATUS: BLOCKED — B1 DESIGN; candidates PROPOSED / AWAITING USER REVIEW.**
**ONE NEXT ACTION: User xem và chọn/chỉnh một phương án.** Chưa cấp approval production; comparison thiếu vẫn phải giải quyết.
