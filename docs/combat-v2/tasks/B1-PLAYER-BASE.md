# B1 — Ancient Soul / Armor Fragments + Mask

Status: PROPOSED — AWAITING USER REVIEW
Kind: DESIGN
Revision: 7, 2026-11-12
Owner approval: NONE for artwork / implementation
Related phase: B; previous revision6 armor/mask chưa approved
Source: user “uh nhưng chưa thể hiện đc linh hồn, chưa có j kết nối các mảnh giáp”, 2026-11-12, hội thoại hiện tại không permalink. Đây là feedback yêu cầu sửa, không visual approval.
Docs/skills: nguồn V2/AGENTS/Art Bible/reference protocol/template, game-art/handoff đã đọc trong cùng task; CURRENT đọc trước lượt mới. Ưu tiên Experience Vision → Design Bible → world/material baseline; Q7C chỉ context/scale.

## 1. One change / Outcome

Before: armor/mask spec6 có giáp rỗng tách rời nhưng chỉ khói ngực mờ; user chưa thấy linh hồn và kết nối.
After PROPOSED: một thể linh hồn hiện rõ trong thân, phân nhánh có trật tự vào sau mask/shoulders/bracers/pelvis/greaves, giữ các mảnh giáp thành một cơ thể. Giữ armor/mask/stance, không đổi luật combat.
Why: cho thấy chủ thể điều khiển vật chất và sự thống nhất cơ thể; linh hồn là phần structural identity, không khói/aura trang trí.

Scope IN: một edit neutral concept visible soul/links từ armor-mask-v1, review và docs/references.
Scope OUT: code/Three.js/model3D/dependency, gameplay redesign, animation/action/VFX/production, camera runtime/B2/build/deploy; không sửa Bibles/Harness/DDR.
Dependency: Gate A mở DESIGN, chưa TARGET/implementation approval.

## 2. Design choices — material / identity proposal

Supersedes: cách thể hiện soul bằng faint smoke và chủ ý không vẽ connection trong exploration trước, theo feedback mới của user. Cho structural energy links, vẫn không external aura/particle cloud. Không khôi phục Q7C/Fractured Vessel/Rift Reliquary/A-B-C rejected; không thay lịch sử approval.
Keep: ancient soul đã làm chủ, armor/mask/stance và khoảng hở, unarmed base; weapon evolution chưa chốt mechanics.
Direction refinement PROPOSED: khói ngực mờ → thể soul có thể tích và đường liên kết xuyên thân. Năng lượng có ranh giới, phần lớn ở trong vỏ giáp và chỉ bắc cầu qua khớp; giáp vẫn giữ silhouette, không cần aura để nổi.
Intent: soul liên tục từ torso tới mặt nạ/tay/eo/chân, thấy nó chui vào mặt trong các shell thay vì sợi sáng trang trí bám góc ngoài. Dải chính trong torso rõ, nhánh khớp mảnh hơn, còn khoảng tối hai bên.
Neutral: head hơi hạ hướng đối thủ, vai bất đối xứng, tay thấp/nắm vừa, hai chân có điểm tựa; không gesture palm-up mage hiền.
Materials: cold iron/charcoal, cạnh pale steel có chủ đích, dull copper inner cuts; không jade/ivory/neon phủ.
Rationale: identity vẫn đọc khi tắt glow, combat agency từ silhouette/pose chứ không VFX hoặc runes dán lên knight.
Trade-offs: links quá mảnh có thể mất ở game scale, quá sáng có thể thành neon mannequin; cần giữ armor/material/mask có hierarchy. Body links không tự chứng minh agency/menace hoặc chất cổ xưa.

## 3. Reference bindings

Manifest: [README](../references/B1-PLAYER-BASE/README.md).
Before ref: B1-ARMOR-MASK image1/spec6.
Concept: B1-ARMOR-SOUL-BINDING image1/spec7, [soul binding](../references/B1-PLAYER-BASE/B1-ARMOR-soul-binding-v1.png), edit từ armor-mask-v1; PROPOSED. Studies cũ giữ trong manifest để trace.
Baseline refs: B1-BASE-M390 / D1440 trong manifest, Q7C renderer thật, chỉ before/context/scale.
Target/approved spec/refs: NONE. Các concept đều PROPOSED.
Must match (intent chưa approval): soul volume và links liên tục vào bên trong từng nhóm shell, còn negative space ở khớp, giữ armor/mask/neutral stance; không aura ngoài silhouette, jewel/core ngực, muscle ghost, body người hoặc jade/ivory.
Flexible: link thickness/opacity/folds, soul volume/contrast/material tint, tổng hierarchy theo user; chưa khóa intensity/renderer/pose cuối.
Must not infer: giáp=armor stat, mask=weakpoint/HP, floating=flight, gap=hitbox, arm edge=melee mechanics, weapon mapping/evolution/timing/animation/3D renderer/camera cuối.
Source/rights: [exact prompts](../references/B1-PLAYER-BASE/PROMPTS.md); ImageGen, model/seed không cung cấp, theo điều khoản dịch vụ, không khẳng định CC0/độc quyền; không external artwork input.

## 4. Acceptance / review

- [x] AC1: một edit, một character/neutral pose, nhãn CONCEPT — PROPOSED — NOT PRODUCTION, source/input/path thật.
- [x] AC2: trong ảnh lớn thấy soul volume trong thân, links tới mask/tay/eo/chân; không tự kết luận gameplay readability.
- [ ] AC3: character identity/menace/không generic knight — AWAITING USER, không visual PASS.
- [ ] AC4: native-scale/crowd/telegraph/mobile/desktop/grayscale — NOT VERIFIED; valid comparisons vẫn0/3.
- [x] AC5: chỉ docs/design references, không code/production/Bibles/Harness/DDR/build/deploy.

Intent: một ý chí cổ xưa nối và điều khiển giáp, thấy volume/route mà vẫn đọc armor rời. Không cần thêm aura/particle hoặc VFX action.
Observed: thân có dải soul nhiều lớp, cổ nối sau mask; routes qua vai xuống bracers/gauntlets và qua eo/pelvis xuống greaves/ankles. Giáp/pose gần như giữ, soul bị plate che một phần tạo depth. Không chest orb/spiral hoặc haze phủ arena.
Remaining deviations: links limb trông hơi như gân/dây tròn hơn folded bands intent; ánh qua mask thành hai khe mắt sáng hơn dự định. Soul thân khá đầy và phần cánh tay/chân mảnh; chưa kiểm silhouette/brightness ở40worldpx/crowd. Agency/cổ xưa/menace vẫn user review, không quality PASS.
Unverified: runtime readability/lighting/camera, gameplay scale/4góc/crowd/telegraph, motion/evolution/3D/mobile/desktop/performance.
B2–B9 potential: shell groups cho hướng tổ hợp/weapon evolution về sau nhưng chưa tạo assets/actions hoặc mechanics.
Evidence plan nếu user chọn: đo native-scale cùng source/anchor trên screenshot thật, tăng contrast bằng diện/mảng nếu cần, không giả arena/comparison.

## 5. Approval / implementation / handoff

Approval status: AWAITING USER REVIEW.
Approved scope/spec/image/refs/quote: NONE. Feedback soul/connection cho refinement, không final artwork approval.
Implementation/candidate runtime: NONE. Build/typecheck/tests/deploy: NOT RUN — design-only.
Technical: PARTIAL — files/paths/PNG/source/diff kiểm được; không runtime benchmark.
Visual review: AWAITING USER. User playtest: NOT APPLICABLE.
STOP: không tự winner/approve/production/Three.js/gameplay/B2.
Changed files: card; PROMPTS/README/RESEARCH/B1-ARMOR-soul-binding-v1.png; MASTER_PLAN; CURRENT HANDOFF.
Final status: B1 DESIGN — AWAITING USER REVIEW.
ONE NEXT ACTION: User review soul volume và connection giữa các mảnh giáp, chọn/chỉnh mức độ hiện diện và hierarchy.
