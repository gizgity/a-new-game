# DR-P1-CONCEPT-03 — Target minimap fog và marker cửa Boss

Parent milestone: DR-P1
Kind: CONCEPT
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §8/9.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Không minimap hoặc fog trong runtime hiện tại.
Outcome: MINIMAP-T01 có vị trí lane/legend/state rõ từ unknown tới Boss discovered/cleared, không tiết lộ nhánh.
IN: Minimap UI concept/state matrix/vi-en/glyph bindings; production source contract cho SVG tái dùng hoặc mới.
OUT: Full-screen map/pan/zoom/radar/autopath, icon mods hoặc UI khác, production source/code.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1§8 states/geometry/lifecycle; camera§7; K-U final lane contract trước lock.
Artifact/task dependencies: CONCEPT-02 slot candidate; baseline HUD SVG/provenance/screenshots; không cần CODE-04 hoặc renderer dungeon.
Input binding: Plan§2 refs và Q7B SVG manifests; game-art/A3 metadata; minimap target chưa tồn tại.
Output: DỰ KIẾN references/DR-P1-CONCEPT-03/: full viewport mocks/state board/icon sheet size+anchor/source plan/manifest; DR-MINIMAP-T01 sau approval.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Dựng state board unknown/partially known/discovered+locked/open/engaged/cleared/reload; north-up fixed bounds và gate marker tại doorway.
2. Đặt trong slot ngoài playRect, chứng minh320 lẫn desktop đọc được đường/player/gate; vi/en legend no clipped text.
3. Chỉ dùng project SVG có provenance hoặc đề xuất glyph mới theo family; chốt stroke/viewBox/pixel size/padding/state mapping cho CODE-05, không crop HUD screenshot.
4. Ghép baseline thật, label CONCEPT; kiểm crowd/grayscale/4góc/no pointer interception, đối chiếu K-U rồi trình visual approval.

Audit source thực tế: Không minimap source; src/ui/CombatHUD.ts và i18n.ts/API t hiện có, style lanes audit plan§2.
Data/state/input-output/lifecycle: Must match reveal/unknown/Boss-discovery độc lập unlock, player actual location; flexible frame ornament/SVG packing; must not infer full tree layout/loot/Boss moves hoặc runtime fog từ board.
Thông số: dẫn S1 §8/9; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

DR-MINIMAP-T01 NONE; state/control legend qua vi/en S1§8; minimap thụ động, retry fresh-press thuộc shell, không thêm combat buttons.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: State icon phân biệt bằng shape/contrast cả grayscale, unknown không leak topology/marker.
- [ ] AC2: Cùng một topology/player pose trên all states/mocks, không thay geometry cho vừa slot.
- [ ] AC3: Full viewport320/390/844/tablet/desktop hai locale không che canvas và đọc được với bounds S1.
- [ ] AC4: Export/glyph binding và approval revision đủ để CODE-05 không tự chọn UI.

Verify plan: Mockup/rights/label/localization/slot checks; không game build/test.
Evidence cần có: State board/full viewport+legend+glyph contract+same-scene grayscale/baseline/manifest.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Slot/target/glyph metadata NONE, chưa được giao; K-U closure trước lock.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ user giao CONCEPT-03 design-only.

