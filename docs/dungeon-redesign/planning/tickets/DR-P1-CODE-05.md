# DR-P1-CODE-05 — Minimap view trong lane riêng

Parent milestone: DR-P1
Kind: CODE
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §8/9.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Chưa minimap UI hoặc các translation keys world.
Outcome: Minimap readonly khớp fog/state/position thật và target, đủ vi/en, không che world/input.
IN: Minimap view/approved original SVG glyph exports, readonly state binding và keys vi/en đúng scope.
OUT: World state mutation/radar/full map/autopath/new gameplay UI/refactor toàn i18n.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1 locked; MINIMAP-T01 approved gồm SVG source/export/stroke/anchor contract; K-U slot keys/lifecycle finalized.
Artifact/task dependencies: CODE-03/04, CONCEPT-03 APPROVED, global lock+assignment; glyph production thuộc task này theo target, không cần bitmap ART ticket rỗng.
Input binding: src/ui/CombatHUD.ts pattern, src/i18n.ts actual dictionaries/t; HUD SVG source provenance manifest Q7B.
Output: DỰ KIẾN src/ui minimap view + public/assets/ui SVG nếu cần thật + src/i18n.ts keys, không filename giả đã tồn tại.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Render north-up fixed bounds topology qua explored mask, Player/gate states từ WorldSession, không tự fog clock.
2. Đặt đúng slot ngoài playRect, passive pointer behavior; aria/legend/label theo target vi/en.
3. Tái dùng/project-author SVG có provenance hoặc vẽ SVG source theo approved target; kiểm size/anchor/hash, không crop screenshot hoặc procedural art engine.
4. Subscribe/reset đúng node/reload/locale/resize; no memory leaks hoặc stale marker identity.
5. Empty/error state không lộ map seed/topology cho người chơi, shell retry text đi qua t(key).

Audit source thực tế: i18n.ts vi/en/t và style.css/CombatHUD thực; minimap module chưa tồn tại.
Data/state/input-output/lifecycle: Readonly WorldDefinition+WorldSession+slot→view; no input movement/save/clock/resource; keys từ S1§8.
Thông số: dẫn S1 §8/9; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

MINIMAP-T01 NONE; must match state shapes/unknown/privacy/slot scale; flexible SVG packing/DOM organisation. Full matrix/2locale/crowd/grayscale/4góc.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Unknown topology/undiscovered Boss không hiện, marker actual Player/gate không nhảy do fit vùng reveal.
- [ ] AC2: 320 và desktop đọc đường/player/gate, vi/en không clip, minimap không intercept aim/touch canvas.
- [ ] AC3: Refresh/reset/session/locale/resize không marker leak/duplicate listener; state readonly.
- [ ] AC4: SVG source+rights/hash đầy đủ, no external icon package/Bible changes.

Verify plan: Typecheck/build + focused view-state binding nếu cần, browser full matrix two locales/grayscale/corners.
Evidence cần có: Target/actual/baseline comparisons, rects/state metadata/code hashes tại evidence/CODE-05.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Approved slot/glyph target/K-U/global lock và CODE-03/04 thiếu.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ đủ lock/deps và user giao CODE-05.

