# DR-P1-CODE-06 — Render biome bằng artwork tĩnh đúng geometry

Parent milestone: DR-P1
Kind: CODE
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §9.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: drawArena chỉ scale một floor1600×1000.
Outcome: World render module/gate layers bám collision/world bounds và hierarchy đúng ENV-T01.
IN: Preload/export metadata/render placements/static Image layers/culling/gate state swaps/cleanup.
OUT: Procedural floor Graphics/tile engine/shader, actor/Boss/VFX redesign, collision theo alpha.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1 locked/ENV-T01 approved, ART-01 export metadata exact hashes.
Artifact/task dependencies: CODE-01/02/03 và ART-01 delivered; global lock+assignment; gate event state từ CODE-04 khi ghép CODE-07.
Input binding: ArenaScene.drawArena/preload + ActorArt scale + source/runtime image manifests audit plan§2.
Output: Environment renderer module và scene preload hook đúng source scope, target-vs-actual registration evidence.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Load exported assets theo base URL hiện hành, metadata world footprint/pivot/orientation/state; fail rõ missing file/version, không fallback procedural art.
2. Place static layers theo readonly geometry/renderPlacements; corridors/inner/outer corners không false wall/path.
3. Bind gate state art to authoritative session; swaps đúng collider mask state, không fake open chỉ visual.
4. Cull offcamera artwork và release on node/shutdown; không cull threats/rules theo device hoặc tạo map-size texture khổng lồ.
5. Capture actual same scale/crowd/grayscale/4góc so baseline/target sau scene bridge; discrepancy quay gate, không sửa spec/Bible.

Audit source thực tế: ArenaScene.drawArena/preload/tint and actor rendering depth; assets production mới chưa có.
Data/state/input-output/lifecycle: Definition placements+export metadata+gate state+camera→readonly layers; no profile/RNG/AI; depth intent S1§9, numeric depth có thể quyết nếu đúng target.
Thông số: dẫn S1 §9; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

ENV-T01 approved exact required;10families/gate4states/pivot/alpha/seams theo target. No missing-asset generated placeholders.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

Biến thể release: nhận variant ID/mapping ba biến thể kiến trúc từ target ENV và definition đã khóa, kiểm đúng placements/source ở từng biến thể; render fixture808 không thay coverage cả ba. Mapping chưa có thì dependency còn OPEN.

## Acceptance và evidence

- [ ] AC1: Registration wall/gate/rim đúng collision và state, Player/cue không occluded ở4góc/gate.
- [ ] AC2: Floor yên/hierarchy/crowd/grayscale bám approved target at actual scale.
- [ ] AC3: Node/retry/resize/shutdown không texture/listener leak hoặc stale gate layer; object/resource counts ghi thật.
- [ ] AC4: Gameplay definition/digest/RNG/production accepted assets unchanged by render.

Verify plan: Typecheck/build; renderer captures + source hash/geometry overlay/read-only state checks; FPS device thuộc P6.
Evidence cần có: Before/target/actual + overlay/export manifest/code hashes tại evidence/CODE-06.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Global lock/ENV target/ART kit và code deps chưa có.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ đủ lock/deps và user giao CODE-06.

