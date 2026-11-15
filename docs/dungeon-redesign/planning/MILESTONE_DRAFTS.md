# Draft intent tickets — Dungeon Rework

> **C10 / WORKFLOW rev2 (2026-11-15) ưu tiên:** thực hiện từng milestone P1→P2→P3→P4→P5→P6 qua plan→lock→implement→accept. P0 điều phối; global-lock/đợi P2–P6 trong snapshot bên dưới không còn là gate. Approval và intent cũ giữ nguyên; current progress xem [PROGRESS.json](PROGRESS.json), gọi dungeon-planning next để chọn một bước, thiếu/sai phải có prompt sửa.

Revision5 · 2026-11-15 · chỉ cập nhật tiến độ audit toàn rework; intent R12 và approvals P0/P1 giữ nguyên.

**DR-P0/P1 PLANNING; P2–P6 còn DRAFT, chưa kích hoạt.** [Plan P0 rev1](DR-P0_PLAN.md) đã được user “y” duyệt ngày2026-11-15 (planning only); chưa hoàn tất toàn P0/lock. User mở planning DR-P1 riêng ngày2026-11-15: [plan/S1 rev2](DR-P1_PLAN.md) APPROVED — PLANNING ONLY qua user “y”,2026-11-15,15tickets có thật nhưng chỉ PLAN-01 được giao audit/docs. File này giữ intent; detailed task tickets chỉ tạo khi user mở đúng planning milestone, theo [WORKFLOW](WORKFLOW.md). Thứ tự dưới là dependency dự kiến của implementation; thứ tự **planning** tại plan P0 §6. Không tự code sau planning từng mốc; global spec lock phải xong trước implementation đầu tiên.

**Audit hiện tại:** user giao rà soát toàn rework/spec-lock review. [Report rev1](DR-P0_CLOSURE.md), [inventory rev1](DR-P0_LOCK_INVENTORY.md), [packet rev1](SPEC_LOCK.md) có thật; DR-P0-VERIFY-01 rev2 audit xong/closure BLOCKED, L01–L08 OPEN, lock rev0 NOT_LOCKED.14child P1 rev3 chỉ sửa metadata approval, chưa execution/approval mới. Audit không mở detailed planning P2–P6 hoặc child SPEC/CONCEPT.

## DR-P0 — Chốt hồ sơ và coverage planning

- **Intent:** session sau hiểu đúng thiết kế đã duyệt, không hỏi lặp hoặc bỏ sót việc giữa nhiều subsystem.
- **Outcome:** baseline R01–R12 có trace approval, toàn release có detailed plans/coverage và lock manifest hoàn chỉnh.
- **IN/OUT:** chuẩn hóa specs/ticket/dependency/lock; ngoài scope code/art production/playtest acceptance.
- **Planning cần làm:** audit các gap R06/R11/R12; xác định nơi giữ từng spec; lập coverage matrix và thứ tự planning P1–P6. Không tự tạo số balancing mới.
- **Dependencies:** setup workflow; review V1 + C09. P0 chỉ hoàn tất khi các đầu vào planning từ P1–P6 đủ lock, không phải chỉ duyệt12câu là xong P0.
- **Acceptance:** không requirement mồ côi; không blocking TBD trong scope khóa; user khóa đúng revision manifest.
- **Đã chuẩn bị:** [coverage/deps/thứ tự planning rev1](DR-P0_PLAN.md), [PLAN-01](tickets/DR-P0-PLAN-01.md) ACCEPTED — USER PLAN APPROVAL; [VERIFY-01 rev2](tickets/DR-P0-VERIFY-01.md) đã được giao audit toàn rework, report/inventory/packet rev1 chờ review; closure BLOCKED vì thiếu inputs.
- **Còn thiếu:** detailed P2–P6/specs/targets, closure P1 (Atlas/targets/consumer contracts), device acceptance plan và user lock. **Status: PLANNING**, chưa SPEC_READY/LOCKED; P0 rev1 đã được duyệt planning. P1 đã mở riêng; audit closure P0 hiện đã giao, chưa đủ inputs để đóng.

## DR-P1 — Dungeon world và camera

- **Intent:** khám phá một không gian có đường đi liền mạch, camera theo Player, lựa chọn nhánh đọc được.
- **Outcome:** một dungeon seed cố định có route/pocket/collision/camera/minimap đúng geometry và target visual được duyệt.
- **Planning cần tách:** world/seed/route contract; collision/navigation; camera two-platform; minimap/fog; biome concept→source→render; scenario entry/biên/4góc. Audit source để quyết định module thực sự cần, không scaffold engine.
- **IN/OUT:** R06/R11 phần world; chưa tree progression/đủ skill/đủ Boss.
- **Dependencies:** baseline đã duyệt; concept/mockup đúng scale. Implementation phụ thuộc global lock, không bắt đầu trong session planning.
- **Acceptance:** world core P1 theo S1§11: fixture seed/query/route budgets+annotated feasibility, không ép vét nhánh/kẹt collider; camera/minimap ngoài playRect đọc được320px và đủ matrix R12, visual/user world approval riêng. Combat/full-save/full-run chuyển P2–P6, không dùng PARTIAL để miễn core; release ba biến thể kiến trúc/random đường vẫn cần spec/targets trước global lock.
- **Đã chuẩn bị:** [plan rev2](DR-P1_PLAN.md), [S1 world spec rev2](specs/DR-P1_WORLD.md),15tickets PLAN/SPEC/CONCEPT/ART/CODE/VERIFY, source/assets audit, coverage/deps/gaps. **Status: PLANNING — hồ sơ rev2 APPROVED PLANNING ONLY**, chỉ PLAN-01 được giao; child execution NONE.
- **Còn thiếu:** Atlas sample/comparison,3target approved, K-E placement/envelopes và contracts/closure K-B/K-X/K-U, closure S1/global lock. Không SPEC_READY/READY hoặc tự thực hiện ticket.

## DR-P2 — Một map combat hoàn chỉnh

- **Intent:** kiểm được cảm giác clear bầy đông và sống sót tới Boss trước khi nhân rộng hành trình.
- **Outcome:** packs/leader/AI, main+phụ cơ bản, Dash/bình, một Boss và reward an toàn chạy xuyên một map.
- **Planning cần tách:** pack composition/activation/leash/collision/attack budget; main/aux commit; flask charge/HoT; boss gate/adds/clear batch; fixture cảm giác đông và safe reward. Chọn lát cắt dùng skill/Boss nào trong số đã duyệt, không tự chốt bằng code.
- **IN/OUT:** R01/R06–R10 cần cho lát cắt; chưa full catalog/tree/meta; không dùng placeholder art production để né gate.
- **Dependencies:** P1 world contract, P3 skill/data contract và P4 Boss contract cần được lập khi planning, dù implementation P2 chỉ dùng một phần. Dependency spec khác dependency task đã code, không tạo vòng P2↔P3/P4.
- **Acceptance:** kéo nhiều bầy/giết leader/đủ charge/né Boss/clear an toàn; không wave ba-con, không heal farm/claim trùng.
- **Còn thiếu:** task slice, cue/rarity target và fixtures đúng scope. **Status: DRAFT.**

## DR-P3 — Skill/build/reward trong lượt

- **Intent:** lựa chọn draft/support/nâng ô làm đổi cách đánh và đầu tư build qua nhiều map.
- **Outcome:**8active/9support, compatibility/tradeoff/caps, túi/ô/nâng/phân giải/draft đúng R01–R03.
- **Planning cần tách:** state/data schema; từng active và interaction; support resolution/ownership/proc order; slot level/bag/material transaction; offers/pause/build UI; skill VFX/pose/icons; input/manual aim và vi/en.
- **IN/OUT:** catalog và economy tạm; không thêm gear/mana/crit/kháng/permanent stats.
- **Dependencies:** contract/code audit combat/input, world geometry và R10 flow; implementation skill cơ bản không cần chờ toàn bộ UI catalog chạy nhưng đều phải qua global lock.
- **Acceptance:** matrix thực thi đúng, không echo vòng lặp/free CD/equip heal;17draft budget không hứa max ba ô; touch/desktop cùng luật.
- **Còn thiếu:** detailed mechanic tickets, input/state tables, approved skill/HUD targets. **Status: DRAFT.**

## DR-P4 — Boss roster và trận cuối

- **Intent:** mỗi Boss kiểm khả năng đọc trận khác nhau, final là kết thúc mạnh nhất có cửa phản công.
- **Outcome:**3Boss thường+final2pha, moves/telegraph/recovery/add queues/lock/clear theo R08/R09.
- **Planning cần tách:** mỗi Boss/pattern, geometry/aim lock; threshold queue/transition; player+Boss simultaneous death; concept/pose/state/source cho Boss và cue; verification burst-skip/add cap/recovery.
- **IN/OUT:** đúng roster đã duyệt, không Boss/phase riêng mỗi Ascension, không thay artwork baseline ngoài scope.
- **Dependencies:** P2 core combat contract, P1 room/collision, P3 damage/CC contracts; từng target Boss phải có approval riêng.
- **Acceptance:** cues khớp hit, không tracking sau snapshot, luôn có đường né với mod legal; cleanup không cho reward/charge giả.
- **Còn thiếu:** pattern state specs, art/animation targets và evidence scenarios. **Status: DRAFT.**

## DR-P5 — Tree/progression/save

- **Intent:** người chơi chọn rủi ro theo tuyến, giữ động lực sau mỗi Boss và nghỉ đúng node mà không dupe reward.
- **Outcome:** tree9 có nối/preview/lock siblings,22mods/caps, meta unlock/Ascension, snapshot/pending/terminal profile mới.
- **Planning cần tách:** tree generation/path validation; modifier rolls/preview/cumulative resolution; claim/bank/unlock transaction; state/save/reload/corruption; tree/catalog/result UI và vi/en; acceptance death/end/final.
- **IN/OUT:** R04/R05/R09/R10; không migration/archive/cosmetic/cloud save/điểm sink mới.
- **Dependencies:** map/build/Boss outcome contracts rõ; implementation P1–P4 đủ dùng trước integration full loop.
- **Acceptance:** seed cố định/reload về entry; pending offers không đổi/claim một lần; chết không undo; tổng mod đúng tuyến/cap; meta banking đúng.
- **Còn thiếu:** schemas/transaction ordering, tree/UI targets và scenario reload. **Status: DRAFT.**

## DR-P6 — Trải nghiệm full-run và nghiệm thu

- **Intent:** một hành trình trọn vẹn vừa đọc được vừa phản hồi tốt trên touch và keyboard/mouse.
- **Outcome:** tutorial/audio/settings/HUD lifecycle hoàn chỉnh, full9node và kết quả technical/visual/user playtest tách riêng.
- **Planning cần tách:** tutorial triggers/skip; adaptive audio state/mix; UI states/input lifecycle; measured device/viewport plan; crowd/performance cases; full-loop verification và checklist bàn giao ngắn.
- **IN/OUT:** R10–R12 đã duyệt; không mở lại content/cosmetic hay ép mọi build cùng winrate/DPS.
- **Dependencies:** các spec P1–P5; implementation integration sau các task phụ thuộc đã kiểm. Chọn thiết bị đại diện trong planning, không suy coverage từ screenshot cũ.
- **Acceptance:** R12 input/FPS/readability được đo đúng context; vi/en; flow/reload đúng; phần chưa kiểm ghi NOT CHECKED, user acceptance có nguồn thực.
- **Còn thiếu:** device plan, audio/UI targets và detailed evidence checklist. **Status: DRAFT.**

Các mục “còn thiếu” là đầu vào planning, không tự mở việc. Assignment hiện tại chỉ audit toàn rework theo DR-P0-VERIFY-01; audit packet rev1 chờ user review, L01–L08 chưa đóng. P2–P6 detailed planning/child SPEC/CONCEPT/ART/CODE/VERIFY và implementation cần đúng session assignment. **ONE NEXT ACTION: User review audit packet rev1 và findings L01–L08; dừng, chưa implementation.**
