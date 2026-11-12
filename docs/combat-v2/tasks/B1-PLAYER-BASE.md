# B1 — Player Base / Ancient Soul exploration

Status: PROPOSED — AWAITING USER REVIEW
Kind: DESIGN
Revision: 3, 2026-11-12
Owner approval: NONE for images / implementation
Related phase: B; previous design revision2 REJECTED
Source: hội thoại hiện tại, không permalink. User: “cả 3 không đạt ... giống quái hơn là nhân vật chính”; đề xuất “1 linh hồn cổ xưa ... tập hợp các tinh thể thành 1 hình dáng chiến đấu”; chọn “linh hồn đã làm chủ”; yêu cầu “thử xem thế nào” về 2.5D và hỏi Three.js. Gameplay redesign để sau.

## 1. One change / Outcome

Before: Q7C runtime vẫn nguyên; A Press Saint / B Tuning Talon / C Seal Crab bị user REJECTED, không phát triển tiếp.
After PROPOSED: một identity mới theo ý user — linh hồn cổ xưa đã làm chủ khối năng lượng giam giữ, tập hợp tinh thể thành cơ thể có ý chí. Hai study cùng tạo hình thử graphic có thể tích và look2.5D.
Why: tạo protagonist có phong thái, chiều sâu và nguồn gốc chung cho evolution tương lai.

Scope IN: hai neutral character studies, rationale/review, đánh giá sơ bộ Three.js dựa source hiện hành; lưu docs/refs.
Scope OUT: model3D, Three.js implementation/dependency, engine migration, shader/animation/production assets, gameplay/attack/evolution mechanics, B2, camera runtime, build/deploy; không sửa Bibles/Harness/DDR.
Dependency: Gate A đã mở design; không có approved TARGET, không được production.

## 2. Design choices

Direction đang khám phá do user định hướng: linh hồn đã làm chủ, cơ thể tinh thể, có thể2.5D. User cho thử, CHƯA approve hai ảnh.
Supersedes: revision2 và ba concepts cũ bị từ chối. Không supersede approval Q7C runtime. Lịch sử rationale/ảnh giữ trong git/manifest để trace, không dùng làm mẫu.
Keep: Mass Slaughter × Stylish Combat × Explosive Chain Reactions như outcome; chưa khóa cách đánh.
Baseline→candidate: sprite pixel phẳng → tinh thể có mặt sáng/tối, chiều dày, occlusion và contact; không tự chọn engine.

Intent:
- Một trục năng lượng có thể tích giam giữ linh hồn; cơ thể dựng có trật tự quanh nó.
- Tư thế tự chủ/điềm tĩnh, không mất kiểm soát hoặc đang cố giữ thân.
- Khối tinh thể lớn và một số khoảng âm, không cloud of shards/aura/ornament.
- Unarmed base: kiếm/súng là hướng tái cấu trúc tiềm năng, không bắt buộc anatomy tay phải kiếm/tay trái súng. Đây là thay phạm vi proposal theo user, không sửa gameplay hiện hành.
- Quartz slate-blue/white-blue energy chỉ là thử màu; phần lớn limb crystals đục, central prison trong vừa đủ. Không toàn thân kính/bloom.
- Hai ảnh cố giữ cùng pose/proportion/view để so cách render; không phải phép đo engine/performance.

## 3. Reference bindings

Manifest: [README](../references/B1-PLAYER-BASE/README.md).
Concepts: B1-SOUL-GRAPHIC v1; B1-SOUL-25D v1, PROPOSED.
Baseline: Q7C renderer390/1440 được link trong manifest, chỉ before/scale context.
Target / approved spec / approved refs: NONE.
Must match (intent thử nghiệm, chưa target): ancient soul đã làm chủ, cơ thể crystal có ý chí, neutral pose không vũ khí/aura; nhận diện protagonist.
Flexible: silhouette, tỷ lệ prison/body, anatomy, camera study, palette/material; cần sửa nếu giống golem.
Must not infer: energy=HP/core weakpoint, số crystal=damage/projectile, kiếm/súng=mechanic đã chốt, mesh/shader/rendering3D thật, Three.js approval, camera/timing/hitbox/animation/evolution.
Source/rights: ImageGen; exact prompts/input tại [PROMPTS](../references/B1-PLAYER-BASE/PROMPTS.md), model/seed không cung cấp; không khẳng định CC0/độc quyền.

## 4. Acceptance / review

- [x] Hai concept một nhân vật/neutral pose, nhãn CONCEPT — PROPOSED — NOT PRODUCTION, files/inputs tồn tại.
- [x] Graphic→2.5D study có thay cách thể hiện mặt/ánh sáng; không tạo engine demo giả.
- [ ] Hero identity đạt: cần user đánh giá; quan sát hiện tại vẫn giống crystal golem, trụ quá dài/chiếm ưu thế, anatomy giống giáp.
- [ ] Soul “cổ xưa/tự chủ” đọc rõ: tư thế yên nhưng chưa đủ cá tính/ý chí; ánh năng lượng không chứng minh có linh hồn.
- [ ] Readability game scale/mobile/desktop/crowd/telegraph: NOT VERIFIED. Đây chỉ character studies nền trung tính, KHÔNG runtime comparisons.
- [x] Không code/production/gameplay/B2/build/deploy.
- [ ] User chọn/chỉnh, không tự visual PASS.

Observed: bản2.5D giảm nhiễu bề mặt, phân mặt sáng/tối và cạnh prison rõ hơn bản graphic. Silhouette gần như giữ nguyên, nên nó vẫn giữ vấn đề golem và trụ lớn. Bản graphic đã có shading3D, chênh lệch hai study còn hạn chế; không phải so 2D phẳng với real3D. Góc study còn đứng hơn gameplay overhead; chưa chứng minh nhìn tốt trên arena.
Unknown: silhouette thu nhỏ, hướng nhìn, chất protagonist, performance/transparency/occlusion ở runtime.
B1 gameplay comparisons cũ vẫn0/3 hợp lệ; không tái sử dụng ảnh generated montage sai scale. Không fake arena hay quality PASS.

## 5. Three.js suitability — đánh giá sơ bộ, không engine decision

**Có lý do để khảo sát nếu realtime crystal rearrangement là nhu cầu quan trọng về sau.** Mesh riêng cho các khối có thể đổi vị trí/hướng, cùng vật liệu/đèn/camera tạo depth thật. Three.js là thư viện render3D; input/game loop/collision/UI/audio/lifecycle không tự được thay thế đầy đủ như game engine.

Evidence từ repo: package.json dùng Phaser3.90, main.ts new Phaser.Game/type AUTO/pixelArt true; PlayerVisual là Container/Image và Graphics cho slash/muzzle; EnemySprites/VFX/camera/audio phụ thuộc Phaser. combat.ts có CombatWorld/state/input2D và không import Phaser trực tiếp: có cơ sở giữ simulation khi nghiên cứu renderer khác, nhưng chưa audit chứng minh port dễ hoặc độc lập hoàn toàn.

| Lựa chọn | Lợi ích | Chi phí / chưa biết |
| --- | --- | --- |
| Phaser + art2.5D/pre-render | Thử volume với ít thay kiến trúc | Không tự có realtime light/reassembly; variation nhiều hướng có chi phí asset |
| Three.js renderer, luật combat trên mặt phẳng | Volume/lighting/reassembly thật, camera orthographic hoặc perspective có kiểm soát | Phải chuyển presentation/input mapping/telegraphs/camera/resource lifecycle; không cần tự đổi luật2D |
| Phaser + Three.js cùng runtime | Có thể thử chuyển từng phần | Sync2camera/depth/input và2renderer/WebGL contexts dễ phức tạp; không mặc định là phương án nhẹ nhất |

Rủi ro chính: nhiều crystal trong suốt gây overdraw và sorting; shadow/postprocess và nhiều mesh/draw calls có thể tốn mobile. Hướng khảo sát: phần lớn opaque, ít transparency, geometry đơn giản và material dùng chung; instancing khi thật sự phù hợp, không coi là đảm bảo FPS.
Khuyến nghị chưa phê duyệt: chốt look/identity trước; nếu chọn realtime3D, mở technical spike riêng sau user giao, đo phone/desktop ở mật độ crowd/telegraph mục tiêu, so cùng scene và gameplay plane. Không gán hardware FPS mục tiêu hoặc chuyển engine ở B1.

## 6. Approval / implementation / handoff

Approval status: AWAITING USER REVIEW. Approved image/spec/refs/scope/quote: NONE.
Design input của user được ghi nhận; không phải visual acceptance.
Implementation/candidate runtime: NONE. Tests/build/deploy: NOT RUN, design-only.
Technical: PARTIAL — files/PNG/paths/prompts/diff kiểm được. Engine feasibility chưa benchmark.
Visual review: AWAITING USER. User playtest: NOT APPLICABLE.
STOP: không model/animation/Three.js/gameplay/B2/production nếu chưa task+approval riêng.
Known gaps: identity còn golem, chưa runtime-scale comparison, hai styles chưa tách mạnh, không3D runtime.
Final status: B1 DESIGN — AWAITING USER REVIEW (exploration revision3; full B1 acceptance chưa đạt).
ONE NEXT ACTION: User đánh giá hướng linh hồn/tinh thể và chiều sâu trong hai study để chọn/chỉnh; chưa chọn engine.
