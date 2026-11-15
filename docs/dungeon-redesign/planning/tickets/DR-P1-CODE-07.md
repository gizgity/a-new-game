# DR-P1-CODE-07 — Entry/session bridge cho một world playable

Parent milestone: DR-P1
Kind: CODE
Status: PLANNED
Revision: 3 · 2026-11-15 — chỉ sửa metadata approval theo DR-P0-VERIFY-01, giữ yêu cầu/deps/AC rev2.
Session assignment: NONE — chỉ tạo ticket trong planning DR-P1, chưa được giao execution.
Source: R06/R11/R12 V1 tại cc6f54c, approval C09; chi tiết mới [S1 rev2](../specs/DR-P1_WORLD.md) **APPROVED — PLANNING ONLY**; S1 §3/5–8/10.
Lock binding: DR-LOCK-01 rev0 **NOT_LOCKED**
Execution card: NONE — dùng [A-H2](../../../combat-v2/TASK_CARD_TEMPLATE.md) khi được giao execution; ticket không cấp APPROVED FOR IMPLEMENTATION.

## Intent và scope

Before: Bootstrap chỉ accepted arena/run/progression, chưa dungeon world entry.
Outcome: Entry rework isolated có seed808, movement/world/camera/minimap/render thật và lifecycle sạch, không ảnh hưởng default production.
IN: Ghép các module P1 qua scene/session entry hữu hạn để review world R12; movement touch/WASD thật và injected gate scenarios có nhãn.
OUT: Combat legacy port/3skill/draft/AI/Boss/reward/progression giả, expedition save/main deploy/preview app mới.
Giữ nguyên: baseline approved ngoài đúng scope S1; không sửa Bible/DDR/approval lịch sử. Supersedes: NONE lúc planning; proposal không tự thay baseline.

## Dependencies và thứ tự

Spec dependencies: S1 locked; K-X seed/entry/error/isolation boundary và K-U shell/input flush contract finalized.
Artifact/task dependencies: CODE-01…06 + approved3targets+ART kit; global lock/session assignment. World movement không chờ P2 combat runtime; Dash thật chờ P3 action adapter và verify phải ghi NOT CHECKED nếu chưa có.
Input binding: ArenaScene lifecycle, TouchControls.sample/reset, main.ts memory fixture guard, progression current keys audit; branch default phải giữ baseline.
Output: Entry world memory-only theo approved routing (URL parameter cụ thể chốt tại execution card), map definition/session/camera/minimap/environment wired, no production save reads/writes.
Downstream: [plan§5–6](../DR-P1_PLAN.md#5-task-inventory-và-dependencies); chỉ consumer đúng hợp đồng/target được review, không tự kích hoạt.

## Việc cần làm cụ thể

1. Re-audit bootstrap/scene coupling; dùng scene bridge nhỏ, không clone entire ArenaScene/combat engine hoặc refactor main ngoài entry guard.
2. Validate identity/generate/annotate then enter; geometry-only fixture phải nhãn BUDGET_UNANNOTATED nếu chưa actual K-E, không claim complete combat map.
3. Di chuyển real dx/dy→collision/slide; disable/hide legacy attack resources trong world fixture, không giả cooldown/skills/Boss; P3/P6 sở hữu controls tương lai.
4. Route camera/render/fog/gate view từ authoritative session; injected progress/draft/engaged events chỉ scenario fixtures, actual consumer acceptance deferred.
5. Pause/blur/resize/locale/restart/exit cleanup, failure giữ trước entry retry same seed; guard không production profile keys/network/rewards.

Audit source thực tế: main.ts buildTrial/profile/bootstrap; ArenaScene.setPhase/start/resize/shutdown; TouchControls reset/sample; progression SAVE_KEY/PENDING_KEY.
Data/state/input-output/lifecycle: Memory identity/session lifetime; entry create once, retry deterministic, no entry snapshot/profile commit trong fixture. P5 adapter production future không thuộc P1.
Thông số: dẫn S1 §3/5–8/10; gameplay số nguồn R01/R05–R09 tại Review V1, không tự tạo bảng balance thứ hai.
Implementation choices: có thể chọn tổ chức module/caching/packing tối giản khi giữ contract/target và không dependency mới; thay thiết kế/geometry/input phải trình delta, không tự quyết để tiện code.
Playable boundary: chỉ entry rework/fixture được giao sau lock; production/default accepted và save cũ ngoài scope.

## Visual/audio/UI bindings

Approved ENV/CAMERA/MINIMAP targets bắt buộc, world fixture là renderer actual; screenshot không thay user playtest. UI chỉ affordances đã approved cho world scope/K-U.
Audio: N/A — P1 không đổi audio; event consumers future thuộc P6.
Baseline source/provenance/approved scope và hashes: [plan§2](../DR-P1_PLAN.md#2-audit-sourceassets). Ref version mới/target approval: **NONE** hiện tại.
Concept/task có visual dùng game-art; concept không runtime asset. UI text qua t(key) cả vi/en; action hold-release/cancel/fresh-press theo K-A/K-U, không suy từ hình.

## Acceptance và evidence

- [ ] AC1: Touch joystick/WASD vào map808, đi main/optional/gate không xuyên wall; camera/minimap real state, no legacy attack/draft/deadline side effects.
- [ ] AC2: Pause→resume/blur/rotate/resize/exit/reentry fresh input/no accumulated time/no listener leaks.
- [ ] AC3: Invalid world giữ entry error t(key), retry same identity, default accepted arena/save bytes không đổi.
- [ ] AC4: No CODE before global lock, no hidden prototype/art production hoặc handoff claim Boss/combat đã đạt.

Verify plan: Typecheck/build + focused entry isolation/lifecycle; browser touch390/keyboard1440 normalworld flow, no writes accepted keys; full camera matrix VERIFY-02.
Evidence cần có: Entry procedure/URL thực/code+spec hashes, storage spies/pre-post digests, screenshots/clip tại evidence/CODE-07.
Coverage chưa kiểm: runtime dungeon/real-device/iOS/Safari/latency/FPS/human feel NOT CHECKED cho tới evidence thật; báo cáo docs không tự đóng các coverage này.

## Readiness và approval

Blocking TBD / closure: Global lock/K-X/K-U/contracts/targets/code deps thiếu; URL routing chưa chọn là implementation detail trước card, không blocking design TBD.
Spec ready audit: **NOT SPEC_READY**; xem plan§7 và SPEC_LOCK, không tự trình lock P1 tách khỏi release.
Approved spec/ref revisions: R06/R11/R12 baseline Design V1/C09; P0 plan rev1 approved planning. P1 plan/S1 rev2 APPROVED — PLANNING ONLY qua user “y”,2026-11-15 (binding tại đầu plan);3targets vẫn NONE, S1 chưa SPEC_READY/global lock. Ticket rev3 chỉ sửa metadata, chưa user approval mới; không nâng quyền execution.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED.
Execution authorized: NO — cần session assignment riêng; CODE/ART còn cần global lock valid và approved spec/target.
STOP nếu: thiếu quyền/task/dependency/target revision, ref không mở được, lock STALE/NOT_LOCKED khi CODE/ART, hoặc phải thay scope để PASS. Vẫn có thể bàn giao planning độc lập đã được giao.

## Kết quả hiện tại

Changed files / commit / evidence execution: NONE — file này chỉ planning.
Technical runtime / visual / user playtest: **NOT CHECKED / NONE / NONE**.
NEXT ACTION: DỪNG; chờ đủ lock/deps và user giao CODE-07.

