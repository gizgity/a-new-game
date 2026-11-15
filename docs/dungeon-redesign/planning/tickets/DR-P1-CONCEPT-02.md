# DR-P1-CONCEPT-02 — Target camera và vùng world hai nền tảng

Parent milestone: DR-P1
Kind: CONCEPT
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §7/9–11.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Camera arena fit bounds và lanes lịch sử chưa target world follow mới.
Outcome: CAMERA-T01 có playRect/scale/aim/bounds storyboard và vị trí dành minimap, đọc được ở mọi viewport.
IN: Full viewport camera/layout mockup + storyboard entry/turn/edge, slot envelope; không làm UI toàn game.
OUT: Production CSS/camera code, input/AI redesign, thay actor scale hoặc thêm minimap overlay.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1§7, R01 cast range và R12 matrix; P6 K-U contract final trước lock.
Artifact/task dependencies: Baseline screenshot thật/actual CSS geometry; không phụ thuộc CODE/ART hoặc P6 runtime.
Input binding: DR-BL-M390/D1440/G390; src/style.css/ArenaScene.resize đã audit; baseline shots khác viewport cần capture chỉ quan sát runtime hiện hành.
Output: DỰ KIẾN references/DR-P1-CONCEPT-02/manifest+annotated mockups+storyboard+rect table; DR-CAMERA-T01 khi user duyệt.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Đo baseline playRect/lanes đúng viewport/version; phân biệt lịch sử284 với current override216; giữ before thật.
2. Mockup camera candidate theo S1 zoom/follow/offset guard, background ngoài bounds và7D ring; không sửa source để chụp after giả runtime.
3. Làm full viewport R12 + center/wall/gate/4góc, touch/keyboard mouse cùng world units; dành slot minimap ngoài playRect cho CONCEPT-03.
4. Đối chiếu K-U lane/safe-area sau planning P6, cập nhật delta nếu ảnh hưởng camera; trình user đúng revision.

Audit source thực tế: ArenaScene camera/resize/getWorldPoint/shake restore; style.css actual lanes, TouchControls reset.
Data/state/input-output/lifecycle: Must match S1 formula/7D guard/real-scale actors/no HUD cover; flexible lanes theo K-U approved; must not infer input latency/FPS/smoothing feel từ still image.
Thông số: dẫn S1 §7/9–11; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

DR-CAMERA-T01 NONE. Game-art mockup trên baseline thật; full matrix R12, grayscale/crowd/corners và annotation phần simulated; không cần generate bitmap nếu layout/annotation hiện có đủ.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Mỗi viewport có CSS playRect/safe inset/zoom/world span, 7D+margin và Player không bị che.
- [ ] AC2: Entry/turn/bounds storyboard không crop actor/cue để làm đẹp; backdrop không giả walkable exit.
- [ ] AC3: Touch lane/touch target R12 và desktop precision có riêng expected checks, không infer desktop từ mobile.
- [ ] AC4: Mockup version và K-U closure rõ; dừng visual review, không implementation.

Verify plan: Docs/mockup consistency + arithmetic; motion/actual-vs-target sau CODE/VERIFY.
Evidence cần có: Rect table/mocks/storyboard/baseline hashes/approval khi có.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Target NONE, K-U final lane chưa có; source captures không thay cho dungeon runtime.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ user giao CONCEPT-02 design-only.

