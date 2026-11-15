# DR-P1-ART-01 — Source production riêng cho biome dungeon

Parent milestone: DR-P1
Kind: ART
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §9.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Chỉ arena PNG/WebP accepted; chưa module production dungeon.
Outcome: Kit source/export10families/gate4states với mapping đủ ba biến thể kiến trúc R06 khớp ENV-T01, có registration/pivot/alpha/rights để renderer dùng.
IN: ImageGen source riêng và export environment, metadata/hash/provenance/QA; không source minimap SVG.
OUT: Crop board, integrate runtime, đổi topology/Bible/palette/camera, production trước global lock.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1 revision được khóa; ENV-T01 approved exact revision gồm export sheet.
Artifact/task dependencies: CONCEPT-01 APPROVED; global lock valid; session user giao ART; tool/ref thực có sẵn.
Input binding: Approved target chưa có (NONE); baseline DR-BL-ENV + actor/HUD mocks mở lại, truyền ảnh thật ImageGen. Không coi plan inventory là approved target.
Output: DỰ KIẾN docs/dungeon-redesign/art/DR-P1-ART-01/source + prompt/manifest; public/assets/dungeon/ exports+metadata khi được giao; tất cả paths chưa tạo.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Kiểm lock/spec/target/hash/approval rồi mở đúng refs; thiếu STOP.
2. Sinh source riêng theo module/state inventory, exact prompts/image inputs; không cắt ảnh concept thành floor/wall.
3. Export theo target pixel/world/anchor/orientation/occlusion sheet; alpha sạch cho overlays, floor liền seam, không text/grid/actors/bright fake mechanic.
4. Kiểm orientation/inner-outer junction/door state seams, registration geometry và mockup camera scale/crowd/grayscale/corners; lệch đáng kể quay về visual gate.
5. Lưu raw source/export hashes/rights/limits; bàn giao renderer ticket, chưa tích hợp.

Audit source thực tế: Q7A manifest/arena asset/Q7C atlas source refs trong plan§2; exports mới NONE.
Data/state/input-output/lifecycle: Production output metadata S1§9 là contract duy nhất, chưa có pixel/pivot approved thì không tự chọn. Không đổi collider theo texture.
Thông số: dẫn S1 §9; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Must match ENV-T01 geometry/material/hierarchy/state identity; flexible packing/compression không đổi silhouette; must not infer timing/hitboxes/room expansion. Model/seed không cung cấp phải ghi thật.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Đủ inventory từng family/state/orientation và mapping ba biến thể kiến trúc theo target đã duyệt, chỉ rõ source dùng chung/riêng với hash/pivot/alpha/world footprint; không suy xoay/lật là đủ biến thể.
- [ ] AC2: Source riêng, provenance+exact inputs/prompts/rights đầy đủ; không external PoE pixels/CC0 claims.
- [ ] AC3: Mockup at runtime scale không apparent false walls/corridors hoặc che cue/Player.
- [ ] AC4: Không code/runtime integration hoặc thay baseline assets/metadata accepted.

Verify plan: Asset/alpha/seam/registration/mockup QA; không chạy build game chỉ vì thêm source; build khi integration sau.
Evidence cần có: Source/export manifest, QA comparisons và hashes; technical asset QA không tự là user acceptance.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Global NOT_LOCKED; ENV-T01/pixel+anchor sheet/approval NONE; execution chưa giao.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ lock/approved target và user giao ART-01.

