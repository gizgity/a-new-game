# Draft intent tickets — Dungeon Rework

Revision1 · 2026-11-14 · nguồn: R12 V1 được user duyệt kèm flow planning.

**Tất cả là DRAFT, chưa milestone nào được kích hoạt.** File ghi intent trước; detailed task tickets chỉ tạo khi user mở planning milestone trong session mới, theo [WORKFLOW](WORKFLOW.md). Thứ tự dưới là dependency dự kiến của implementation, không phải quyền code lần lượt ngay sau khi planning từng mốc. Global spec lock phải xong trước implementation đầu tiên.

## DR-P0 — Chốt hồ sơ và coverage planning

- **Intent:** session sau hiểu đúng thiết kế đã duyệt, không hỏi lặp hoặc bỏ sót việc giữa nhiều subsystem.
- **Outcome:** baseline R01–R12 có trace approval, toàn release có detailed plans/coverage và lock manifest hoàn chỉnh.
- **IN/OUT:** chuẩn hóa specs/ticket/dependency/lock; ngoài scope code/art production/playtest acceptance.
- **Planning cần làm:** audit các gap R06/R11/R12; xác định nơi giữ từng spec; lập coverage matrix và thứ tự planning P1–P6. Không tự tạo số balancing mới.
- **Dependencies:** setup workflow; review V1 + C09. P0 chỉ hoàn tất khi các đầu vào planning từ P1–P6 đủ lock, không phải chỉ duyệt12câu là xong P0.
- **Acceptance:** không requirement mồ côi; không blocking TBD trong scope khóa; user khóa đúng revision manifest.
- **Còn thiếu:** detailed plans, Atlas comparison, visual targets, device acceptance plan. **Status: DRAFT.**

## DR-P1 — Dungeon world và camera

- **Intent:** khám phá một không gian có đường đi liền mạch, camera theo Player, lựa chọn nhánh đọc được.
- **Outcome:** một dungeon seed cố định có route/pocket/collision/camera/minimap đúng geometry và target visual được duyệt.
- **Planning cần tách:** world/seed/route contract; collision/navigation; camera two-platform; minimap/fog; biome concept→source→render; scenario entry/biên/4góc. Audit source để quyết định module thực sự cần, không scaffold engine.
- **IN/OUT:** R06/R11 phần world; chưa tree progression/đủ skill/đủ Boss.
- **Dependencies:** baseline đã duyệt; concept/mockup đúng scale. Implementation phụ thuộc global lock, không bắt đầu trong session planning.
- **Acceptance:** route đủ kill/elite weights, không đòi vét nhánh, không mắc collider; camera/HUD đúng target touch–desktop.
- **Còn thiếu:** thuật toán/contract cụ thể, reference mapping Atlas, environment/camera target. **Status: DRAFT.**

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

Các mục “còn thiếu” là đầu vào cho planning, không mời agent tự làm tiếp trong session này. Không task con nào đã được giao từ file draft.
