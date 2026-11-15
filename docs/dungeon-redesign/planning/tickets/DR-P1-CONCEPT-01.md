# DR-P1-CONCEPT-01 — Target biome dungeon và module/gate registration

Parent milestone: DR-P1
Kind: CONCEPT
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §2/4/5/9.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Arena floor accepted không có wall/door/pocket kit.
Outcome: ENV-T01 thể hiện một biome đọc collision được, gate4state và sheet export/pivot đủ để sản xuất riêng.
IN: Concept10families/gate4states, mapping ba biến thể kiến trúc R06 trong cùng biome/bộ art, scale/occlusion study và mockup geometry808; không dùng một fixture làm target đủ ba biến thể.
OUT: Production source/crop board/runtime, Boss/actor redesign, đổi collision/biome direction/Bible.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1 rev được review §2/4/5/9; camera geometry §7 candidate; R11 và Bible giữ direction.
Artifact/task dependencies: Ảnh baseline thật plan§2 + source floor/Q7A manifests; K-U/camera closure trước final target lock, không cần renderer dungeon.
Input binding: DR-BL-ENV/M390/D1440/G390 đã mở; lúc execution mở thêm320/844/corners và đúng actor source nếu cần ImageGen input.
Output: DỰ KIẾN docs/dungeon-redesign/references/DR-P1-CONCEPT-01/: manifest A3, concept-v1, exact prompts/inputs/hashes/rights/checklist, ENV-T01 khi user duyệt.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Dùng game-art; mở approved images thực và truyền vào ImageGen; ghi exact prompts/negative constraints/provenance.
2. Vẽ environment-only concept inventory S1§9; gate locked/open/engaged/cleared, inner/outer corner, join/rim/backdrop; không tự thêm hazard/reward shrine.
3. Chốt proposed pixel dimensions/world footprint/anchor/padding/orientation/occlusion cho từng family/state để ART không đoán.
4. Ghép trên baseline renderer thật cùng actor scale, annotation geometry808/camera mới; label COMPOSITE CONCEPT, phần world chưa runtime; không sửa scene để tạo mockup.
5. So mobile/desktop/crowd/grayscale/4góc; sửa lệch palette/threat/collider-readability, bàn giao user visual approval đúng revision.

Audit source thực tế: ArenaScene.drawArena, ActorArt, asset hashes/manifests trong plan§2; planned module source chưa có.
Data/state/input-output/lifecycle: Must match route/collision footprint/palette P0–P3/gate semantics; flexible ornament yên/packing nguồn trong target; must not infer hitbox/rules/FPS từ ảnh.
Thông số: dẫn S1 §2/4/5/9; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Target dự kiến DR-ENV-T01/NONE; reference scope cũ không approve dungeon. Viewports R12, gồm320/390/844/768×1024/1440×1000/1920×1080; baseline1440×900 phải ghi đúng, capture baseline mới nếu cần. Gate/edge/corner states đầy đủ.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: 10families đủ geometry/registration/export sheet, các state gate phân biệt không chỉ màu; có bảng variant1–3→family dùng chung/khác, target chứng minh ba biến thể kiến trúc R06 trong cùng bộ art, không chỉ xoay/lật fixture. Visual differences chưa được thiết kế/duyệt vẫn OPEN.
- [ ] AC2: Wall/gate art không che Player/cue ở edge/corner; crowd/grayscale so cùng scene, không gán PASS phần chưa có.
- [ ] AC3: Concept có before/after scale/context/prompt/input/rights/binding, không production crops.
- [ ] AC4: Dừng AWAITING USER VISUAL APPROVAL, quote/revision NONE tới khi user duyệt.

Verify plan: Consistency/scale/mockup QA theo game-art; không code/build/deploy, motion/device/FPS NOT CHECKED.
Evidence cần có: Manifest+prompts+images+same-scene comparisons+checklist; user quote/version khi có.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Target/images/export sheet chưa có; camera/HUD closure phải khớp K-U trước lock; task này chưa được giao tạo ảnh.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ user giao CONCEPT-01 design-only.

