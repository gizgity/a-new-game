# B1 — Ancient Soul / Armor Fragments + Mask

Status: PROPOSED — AWAITING USER REVIEW
Kind: DESIGN
Revision: 6, 2026-11-12
Owner approval: NONE for artwork / implementation
Related phase: B; previous revision5 crystal body chưa approved
Source: user “trông hiền quá ... thay vì tinh thể sẽ là những mảnh giáp, để ghép lại thành hình dáng 1 chiến binh? vs mặt nạ?”, hội thoại hiện tại, không permalink.
Docs/skills: nguồn V2/AGENTS/Art Bible/reference protocol/template, game-art/handoff đã đọc trong cùng task; CURRENT đọc trước lượt mới. Ưu tiên Experience Vision → Design Bible → world/material baseline; Q7C chỉ context/scale.

## 1. One change / Outcome

Before: soul/crystal spec5, user thấy hiền.
After PROPOSED: soul đã làm chủ các mảnh GIÁP RỖNG và MẶT NẠ RỜI, tập hợp thành chiến binh có chủ ý đe dọa. Không người mặc giáp, không đổi luật combat.
Why: mặt nạ làm điểm nhận diện/hướng nhìn; forearm/stance/fists gợi năng lực chiến đấu trước khi có weapon evolution; vật liệu forged metal tạo mass khác crystal.

Scope IN: một exploration đổi vật liệu/cấu trúc mặt/khí chất; original armor study và detached-mask correction; docs/references.
Scope OUT: code/Three.js/model3D/dependency, gameplay redesign, animation/action/VFX/production, camera runtime/B2/build/deploy; không sửa Bibles/Harness/DDR.
Dependency: Gate A mở DESIGN, chưa TARGET/implementation approval.

## 2. Design choices — material / identity proposal

Supersedes: crystal material và head wedge của spec5 trong exploration này theo đề xuất mới của user. Mặt nạ/giáp được phép ĐỀ XUẤT lại, không khôi phục Q7C/Fractured Vessel/Rift Reliquary hay hình bị từ chối. A/B/C vẫn REJECTED, không input. Lịch sử approval runtime Q7C và các ảnh proposal cũ giữ nguyên.
Keep: ancient soul đã làm chủ, body assembly detached, unarmed base; kiếm/súng có thể là evolution sau, không chốt mechanics.
Direction change PROPOSED: translucent mineral / soft pose → cold iron shells / mask / stance chiến đấu; broad planes2.5D, không pixel/style/engine cuối đã chốt.
Intent: mặt nạ là personality, che một vị trí đầu rỗng; mảng thân giáp có khoảng âm nhìn xuyên, không giáp ôm cơ bắp; linh hồn nhìn thoáng trong cavity, không jewel/core tròn ở ngực/aura.
Neutral: head hơi hạ hướng đối thủ, vai bất đối xứng, tay thấp/nắm vừa, hai chân có điểm tựa; không gesture palm-up mage hiền.
Materials: cold iron/charcoal, cạnh pale steel có chủ đích, dull copper inner cuts; không jade/ivory/neon phủ.
Rationale: identity vẫn đọc khi tắt glow, combat agency từ silhouette/pose chứ không VFX hoặc runes dán lên knight.
Trade-offs: dark armor dễ chìm floor; mask giúp personality nhưng có thể giống generic occult warrior/địch; plate gaps lớn có thể mất cohesion. Form knight không được coi là đạt chỉ vì có mask.

## 3. Reference bindings

Manifest: [README](../references/B1-PLAYER-BASE/README.md).
Concepts:
- B1-ARMOR-STUDY image1/spec6: [initial](../references/B1-PLAYER-BASE/B1-ARMOR-study-v1.png), original text generation, no input.
- B1-ARMOR-MASK image1/spec6: [correction](../references/B1-PLAYER-BASE/B1-ARMOR-mask-v1.png), edit từ initial.
Baseline refs: B1-BASE-M390 / D1440 trong manifest, Q7C renderer thật, chỉ before/context/scale.
Target/approved spec/refs: NONE. Các concept đều PROPOSED.
Must match (intent chưa approval): soul điều khiển armor rỗng, mask rời, negative space không aura, neutral warrior, không body người/giáp jade/ivory chest core.
Flexible: mask silhouette/material/angle, số mảng/spacing, pose/proportion/contrast/palette cuối; sửa nếu generic knight.
Must not infer: giáp=armor stat, mask=weakpoint/HP, floating=flight, gap=hitbox, arm edge=melee mechanics, weapon mapping/evolution/timing/animation/3D renderer/camera cuối.
Source/rights: [exact prompts](../references/B1-PLAYER-BASE/PROMPTS.md); ImageGen, model/seed không cung cấp, theo điều khoản dịch vụ, không khẳng định CC0/độc quyền; không external artwork input.

## 4. Acceptance / review

- [x] AC1: hai ảnh riêng một character/neutral pose có nhãn CONCEPT — PROPOSED — NOT PRODUCTION, path/source/inputs thật.
- [x] AC2: body material mới metal hollow shell + mask; không recolor crystal hoặc reuse rejected images.
- [ ] AC3: character identity/menace/không generic knight — AWAITING USER, không visual PASS.
- [ ] AC4: native-scale/crowd/telegraph/mobile/desktop/grayscale — NOT VERIFIED; valid comparisons vẫn0/3.
- [x] AC5: chỉ docs/design references, không code/production/Bibles/Harness/DDR/build/deploy.

Intent: đổi cảm giác hiền sang tự chủ/nguy hiểm bằng mask góc hạ, forearms/fists và mass; vẫn ancient soul, không generic knight.
Observed initial: stance/fists/metal làm warrior rõ, nhưng closed helmet và breastplate giống knight; không gọi nó target.
Observed correction: mask rời thấy mép/rỗng, torso có mảng và khe lớn; bỏ full upper-arm/thigh shells; fists giữ intent, forearm sáng tạo value focal, không cần energy aura.
Remaining deviations: mask correction có đuôi nhọn/cặp mép trên vểnh hơn blunt-mask intent, opening có thể đọc như mắt; torso-left/shoulder vẫn lớn, gaps chân/tay khá rộng; material tối, energy giống smoke hơn volume giam giữ. Chưa chứng minh menace/hero identity ở gameplay scale. Không sửa Bible cho output.
Unverified: runtime readability/lighting/camera, gameplay scale/4góc/crowd/telegraph, motion/evolution/3D/mobile/desktop/performance.
B2–B9 potential: shell groups cho hướng tổ hợp/weapon evolution về sau nhưng chưa tạo assets/actions hoặc mechanics.
Evidence plan nếu user chọn: đo native-scale cùng source/anchor trên screenshot thật, tăng contrast bằng diện/mảng nếu cần, không giả arena/comparison.

## 5. Approval / implementation / handoff

Approval status: AWAITING USER REVIEW.
Approved scope/spec/image/refs/quote: NONE. Đề xuất armor+mask của user cho exploration, không final artwork approval.
Implementation/candidate runtime: NONE. Build/typecheck/tests/deploy: NOT RUN — design-only.
Technical: PARTIAL — files/paths/PNG/source/diff kiểm được; không runtime benchmark.
Visual review: AWAITING USER. User playtest: NOT APPLICABLE.
STOP: không tự winner/approve/production/Three.js/gameplay/B2.
Changed files: card; PROMPTS/README/RESEARCH/B1-ARMOR-study-v1.png/B1-ARMOR-mask-v1.png; MASTER_PLAN; CURRENT HANDOFF.
Final status: B1 DESIGN — AWAITING USER REVIEW.
ONE NEXT ACTION: User review hướng armor rỗng + mask rời, đánh giá khí chất/identity/spacing để chọn hoặc chỉnh.
