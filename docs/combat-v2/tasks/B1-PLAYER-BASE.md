# B1 — Ancient Soul / separated crystal visual prototype

Status: PROPOSED — AWAITING USER REVIEW
Kind: DESIGN
Revision: 5, 2026-11-12
Owner approval: NONE for artwork / implementation
Related phase: B; previous revision4 là hướng đang refinement, chưa approval
Source: user “gần hơn r, nhưng xem có cải thiện được j nữa k, chính m cũng tự nhận xét nó còn thiếu sót mà”, 2026-11-12, hội thoại hiện tại không permalink. Đây là phép refinement, không visual acceptance.
Docs: nguồn V2/AGENTS/Art Bible/reference protocol/template và skills game-art/handoff đã đọc trong cùng task; CURRENT đọc trước lượt mới. Thứ tự ưu tiên Experience Vision → Design Bible → world/material baseline; Q7C chỉ context/scale.

## 1. One change / Outcome

Before: B1-SOUL-separated-v1/spec4 đã gần ý user; còn gap quá rộng/mất unity, hướng/head focus yếu, các chi giống shard lặp.
After PROPOSED: refinement cùng identity để gap ngắn có nhịp, head nhỏ có hướng, hand/feet có công năng hình rõ; không quay về anatomy đá liền. Hai lượt edit: cohesion và correction; cả hai lưu để trace, không tự approval.
Why: agency/hero presence của linh hồn cổ xưa đã làm chủ vật chất; tạo khoảng âm giúp depth và cơ hội tái cấu trúc về sau.

Scope IN: hai edit neutral concept refinement từ ảnh spec4, review và cập nhật card/manifest/prompts/research/roadmap/handoff.
Scope OUT: code/Three.js/model3D/dependency, gameplay redesign, animation/VFX/production, camera runtime/B2/build/deploy/Bibles/Harness/DDR.
Prototype ở lượt này = hình thăm dò thiết kế, không executable. Gate A/design permission giữ nguyên; chưa approved TARGET.

## 2. Design choices / rationale

Supersedes: rationale spec4 được refined thành spec5; B1-SOUL-separated-v1 là input đúng hướng user muốn cải thiện, không ảnh rejected. Không thay lịch sử approval hay tái dùng A/B/C đã REJECTED; không supersede Q7C runtime approvals.
Keep: ancient soul đã làm chủ, crystal assembly, unarmed base; kiếm/súng là hướng evolution tiềm năng chưa mechanic.
Proposed change: thu gap từ các vùng trống lớn về các khớp tách ngắn; head thấp/nhỏ có bevel chỉ hướng; shoulder bất đối xứng; palm rộng/foot-end phẳng thay shard đâm nhọn; pelvis chevron gọn thay crescent. Không upper-arm/thigh filler, glow tubes, trụ dài, anatomy đá liền. Soul volume bớt viền như chest plate, không áo giáp chứa jewel.
Unknown/TBD: mức gap vừa đủ unity, proportion/pose/head focus, palette/camera/style cuối, identity protagonist.
Platform: mobile-first + desktop-equivalent là yêu cầu; visual prototype chưa ở native gameplay context.

[Research có nguồn](../references/B1-PLAYER-BASE/RESEARCH.md):
- Xerath/LoL: bài học khoảng âm giữa energy và material, không lấy armor/chains/crown.
- Knack: bài học assembly thành cụm chức năng và giữ identity khi thay vật chất; không lấy mascot/red spikes/noisy relics.
- Rayman: bài học pose liên kết chi rời, không lấy cartoon/hair/clothes.
Không game nào hoàn toàn cùng direction; tách bài học cấu trúc khỏi việc copy style. Ảnh web chỉ xem/nghiên cứu, không dùng làm input hoặc production. Spec4 là text-to-image gốc; spec5 edit từ chính ảnh spec4 và lượt cohesion, không input artwork game bên thứ ba.

## 3. Reference bindings

Manifest: [README](../references/B1-PLAYER-BASE/README.md).
Before ref: B1-SOUL-SEPARATED v1/spec4. Concepts: B1-SOUL-COHESION v1/spec5 (intermediate, có lệch); B1-SOUL-REFINED v1/spec5, [refinement](../references/B1-PLAYER-BASE/B1-SOUL-refined-v1.png), PROPOSED. Cả hai chưa TARGET.
Historical baseline: B1-BASE-M390 / D1440 trong manifest, Q7C screenshots thật; không mẫu tạo hình.
Target/approved spec/refs: NONE.
Must match (intent, chưa approved target): linh hồn đã làm chủ, các khối detached có khoảng âm thật, không trụ dài/giáp cơ bắp/aura/face/weapon; một neutral pose.
Flexible: số/cỡ/vị trí khối, gap ratio, identity/proportion/pose, palette/material/view theo user review.
Must not infer: collider theo gap/footprint, energy=weakpoint/HP, số crystal=projectile/damage, floating=flight gameplay, reassembly/attack/evolution rules, Three.js/mesh/shader/runtime FPS, camera/số hướng/animation timing.
Source/rights: [exact prompt](../references/B1-PLAYER-BASE/PROMPTS.md); ImageGen edit từ input own concept được ghi rõ, model/seed không cung cấp, theo điều khoản dịch vụ; không khẳng định CC0/độc quyền. External IP không được cấp production permission.

## 4. Acceptance / review

- [x] AC1: đã tìm nguồn game liên quan và phân tích lấy gì/không lấy; không tuyên bố cùng toàn bộ art style.
- [x] AC2: hai edits một neutral character, nhãn/provenance rõ; correction bỏ filler nối khớp, giảm head và giữ detached masses; không tự chấm quality PASS.
- [ ] AC3: vẻ đẹp/hero identity/unity — AWAITING USER, không tự PASS.
- [ ] AC4: readability native gameplay scale/crowd/telegraph/mobile/desktop — NOT VERIFIED; comparison hợp lệ vẫn0/3, không dùng montage giả.
- [x] AC5: chỉ docs/design refs, không code/production/Bibles/Harness/DDR/build/deploy.

Design intent: cohesion qua alignment và các gap ngắn, không lấp anatomy; head/hand/feet tạo ý chí và hướng; linh hồn tự chủ hơn là debris.
Observed vs spec4: correction giảm head/spacing, forearm có mặt palm và foot có đế/hướng thay đầu dao; pelvis chevron nhỏ và shoulder rõ hơn. Không upper-arm/thigh filler như intermediate. Khối soul giảm viền và bớt xanh rực; background/lighting nhìn dịu hơn.
Intermediate deviation: cohesion edit thêm filler bắp tay/đùi và đầu lớn; đã có correction chủ đích, không đổi Bible để hợp thức hóa.
Remaining gaps: correction vẫn có vùng ánh soul gần swirl dù prompt muốn fold; palm còn hơi móc/claw, chân dài và torso có thể gợi giáp. Góc còn tương đối đứng so gameplay. Giảm head/gap chỉ quan sát, không coi tỷ lệ prompt là số đo đã đạt. User quyết định vẻ đẹp/identity, không tự tuyên bố đạt.
Unverified: runtime scale, grayscale,4góc, crowd/cue interference, motion/reassembly/hero feeling/mobile/desktop/performance.
Potential B2–B9/evolution: khoảng trống cho thay relative positions và regrouping về sau; KHÔNG tạo pose/action/animation/mechanic hay mở B2.
Evidence plan sau khi user chọn/chỉnh: same-context native-scale overlay trên screenshot thật, đo source/candidate scale, không đổi arena; user approval vẫn độc lập với kỹ thuật.

## 5. Three.js / approval gate

Three.js chỉ là lựa chọn khảo sát từ revision3, chưa implementation decision. Render3D có lý do nếu cần realtime crystal reassembly; game hiện Phaser3.90, nhiều presentation/input/camera/audio phụ thuộc Phaser, CombatWorld2D có phần tách. Không suy prototyping engine từ việc user xin visual prototype. Gameplay redesign user để sau.
Approval status: AWAITING USER REVIEW.
Approved scope/spec/images/refs/quote: NONE.
STOP: không code/model/animation/production/B2 nếu chưa task+approval riêng; không tự chọn winner/engine.

## 6. Implementation / handoff

Implementation/candidate runtime evidence: NONE.
Build/typecheck/tests/deploy: NOT RUN — design-only.
Technical: PARTIAL — PNG/path/prompt/metadata/diff kiểm được, không runtime/benchmark.
Visual review: AWAITING USER. User playtest: NOT APPLICABLE.
Changed files: card; RESEARCH/PROMPTS/README/B1-SOUL-cohesion-v1.png/B1-SOUL-refined-v1.png; MASTER_PLAN; CURRENT HANDOFF.
Known gaps: unity/hero identity/pose chưa approved, full B1 scale acceptance chưa đạt.
Final status: B1 DESIGN — AWAITING USER REVIEW.
ONE NEXT ACTION: User review refinement spec5, đặc biệt cohesion/hướng nhìn/phong thái; chọn/chỉnh, chưa production.
