# B1 — Ancient Soul / separated crystal visual prototype

Status: PROPOSED — AWAITING USER REVIEW
Kind: DESIGN
Revision: 4, 2026-11-12
Owner approval: NONE for artwork / implementation
Related phase: B; previous revision3 NEEDS REVISION
Source: user “các tinh thể dính nhau quá, chưa đẹp, có thể tham khảo các game có cùng phong cách thiết kế để ra đc prototype”, hội thoại hiện tại, không permalink.
Docs: nguồn V2/AGENTS/Art Bible/reference protocol/template và skills game-art/handoff đã đọc trong cùng task; CURRENT đọc trước lượt mới. Thứ tự ưu tiên Experience Vision → Design Bible → world/material baseline; Q7C chỉ context/scale.

## 1. One change / Outcome

Before: hai SOUL studies revision3 tạo cơ thể tinh thể dính khớp, trụ năng lượng dài; user yêu cầu sửa.
After PROPOSED: một visual prototype mới với các cụm tinh thể tách thật, năng lượng gọn hơn; nghiên cứu game references để có lý do cho topology/pose.
Why: agency/hero presence của linh hồn cổ xưa đã làm chủ vật chất; tạo khoảng âm giúp depth và cơ hội tái cấu trúc về sau.

Scope IN: nghiên cứu reference có nguồn, một neutral visual prototype ImageGen, review/cập nhật card/manifest/prompts/roadmap/handoff.
Scope OUT: code/Three.js/model3D/dependency, gameplay redesign, animation/VFX/production, camera runtime/B2/build/deploy/Bibles/Harness/DDR.
Prototype ở lượt này = hình thăm dò thiết kế, không executable. Gate A/design permission giữ nguyên; chưa approved TARGET.

## 2. Design choices / rationale

Supersedes: revision3 cho hướng tạo hình đang thăm dò; revision3 giữ trong git và hai ảnh cũ trong manifest để trace, không dùng làm mẫu. A/B/C vẫn REJECTED. Không supersede Q7C runtime approvals.
Keep: ancient soul đã làm chủ, crystal assembly, unarmed base; kiếm/súng là hướng evolution tiềm năng chưa mechanic.
Proposed change: bỏ connected stone anatomy và trụ dài; các shoulder/forearm/pelvic/lower-leg masses cách nhau qua khoảng nền tối; không glow tube/upper-arm/thigh giả nối kín. Giảm noise, broad planes/2.5D depth; năng lượng là một khối gọn bị giam giữ, không jewel ngực gắn trên giáp.
Unknown/TBD: mức gap vừa đủ unity, proportion/pose/head focus, palette/camera/style cuối, identity protagonist.
Platform: mobile-first + desktop-equivalent là yêu cầu; visual prototype chưa ở native gameplay context.

[Research có nguồn](../references/B1-PLAYER-BASE/RESEARCH.md):
- Xerath/LoL: bài học khoảng âm giữa energy và material, không lấy armor/chains/crown.
- Knack: bài học assembly thành cụm chức năng và giữ identity khi thay vật chất; không lấy mascot/red spikes/noisy relics.
- Rayman: bài học pose liên kết chi rời, không lấy cartoon/hair/clothes.
Không game nào hoàn toàn cùng direction; tách bài học cấu trúc khỏi việc copy style. Ảnh web chỉ xem/nghiên cứu, không dùng làm input hoặc production. Prototype là thiết kế text-to-image gốc.

## 3. Reference bindings

Manifest: [README](../references/B1-PLAYER-BASE/README.md).
Concept: B1-SOUL-SEPARATED v1/spec4, [visual prototype](../references/B1-PLAYER-BASE/B1-SOUL-separated-v1.png), PROPOSED.
Historical baseline: B1-BASE-M390 / D1440 trong manifest, Q7C screenshots thật; không mẫu tạo hình.
Target/approved spec/refs: NONE.
Must match (intent, chưa approved target): linh hồn đã làm chủ, các khối detached có khoảng âm thật, không trụ dài/giáp cơ bắp/aura/face/weapon; một neutral pose.
Flexible: số/cỡ/vị trí khối, gap ratio, identity/proportion/pose, palette/material/view theo user review.
Must not infer: collider theo gap/footprint, energy=weakpoint/HP, số crystal=projectile/damage, floating=flight gameplay, reassembly/attack/evolution rules, Three.js/mesh/shader/runtime FPS, camera/số hướng/animation timing.
Source/rights: [exact prompt](../references/B1-PLAYER-BASE/PROMPTS.md); ImageGen không image input, model/seed không cung cấp, theo điều khoản dịch vụ; không khẳng định CC0/độc quyền. External IP không được cấp production permission.

## 4. Acceptance / review

- [x] AC1: đã tìm nguồn game liên quan và phân tích lấy gì/không lấy; không tuyên bố cùng toàn bộ art style.
- [x] AC2: tạo một ảnh original neutral mới; nhiều khoảng hở rõ, không anatomy đá liền hoặc trụ dài.
- [ ] AC3: vẻ đẹp/hero identity/unity — AWAITING USER, không tự PASS.
- [ ] AC4: readability native gameplay scale/crowd/telegraph/mobile/desktop — NOT VERIFIED; comparison hợp lệ vẫn0/3, không dùng montage giả.
- [x] AC5: chỉ docs/design refs, không code/production/Bibles/Harness/DDR/build/deploy.

Design intent: khoảng hở tạo cảm giác linh hồn chủ động điều khiển crystal; pose làm các phần thành một protagonist.
Observed: gaps lớn ở vai/eo/chi; khối energy gọn, broad planes/warm highlights, ít noise. Số mass không đúng hoàn toàn intent khoảng9; có mảnh dưới pelvis và che khuất trong một số cụm. Chưa mọi điểm hoàn hảo.
Risks: gap quá rộng có thể mất unity, shoulder mảnh/head focus yếu; vẫn có thể giống construct/enemy; thu nhỏ có thể đọc thành fragments thay character. Không gọi đẹp hơn/đạt nếu user chưa chấp nhận.
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
Changed files: card; RESEARCH/PROMPTS/README/B1-SOUL-separated-v1.png; MASTER_PLAN; CURRENT HANDOFF.
Known gaps: unity/hero identity/pose chưa approved, full B1 scale acceptance chưa đạt.
Final status: B1 DESIGN — AWAITING USER REVIEW.
ONE NEXT ACTION: User đánh giá visual prototype tách khối để chọn/chỉnh mức độ khoảng hở, silhouette và phong thái.
