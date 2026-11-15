# DR-P0 — Coverage, dependencies và thứ tự planning

Revision: 1 · 2026-11-15 · **APPROVED — PLANNING ONLY**.
Milestone: **PLANNING**; hồ sơ điều phối rev1 đã được user duyệt, chưa hoàn tất P0 toàn bộ.

**Approval record:** user “y”, 2026-11-15, hội thoại hiện tại không permalink, ngay sau bàn giao DR-P0 revision1. Phạm vi duyệt: coverage/dependencies/thứ tự planning và tickets điều phối của bản này. SHA256 file trước khi ghi nhận approval: `7E2263F287CF336BC2FAFD590FA1F679578281ABBE523F9B8F19A1C20ACA3C6A`. Nội dung kế hoạch giữ nguyên; chỉ cập nhật trạng thái/approval/điểm dừng. Không khóa detailed specs, không mở P1–P6/VERIFY-01 hoặc CODE/ART, không visual/playtest approval.

## 1. Goal, quyền và tiêu chí bàn giao lượt này

User: “Mở planning DR-P0. Đọc handoff và baseline đã duyệt, lập kế hoạch coverage, dependencies và thứ tự planning các milestone. Chỉ planning, chưa implement. Bàn giao để t review rồi dừng.” Nguồn: hội thoại hiện tại, 2026-11-15, không permalink.

**Một outcome:** có bản đồ từ toàn bộ baseline tới nơi đặc tả, milestone chịu trách nhiệm, dependency và evidence; session sau biết cần planning gì trước khi lock. Ticket thực hiện: [DR-P0-PLAN-01](tickets/DR-P0-PLAN-01.md). Ticket đóng coverage/chuẩn bị lock tương lai: [DR-P0-VERIFY-01](tickets/DR-P0-VERIFY-01.md), chưa được giao execution.

- **IN:** audit baseline/gap ở cấp điều phối, coverage toàn release P1–P6, nguồn spec, hợp đồng liên milestone, thứ tự planning, điều kiện đóng P0 và manifest NOT_LOCKED.
- **OUT:** detailed planning P1–P6, giải thuật/schema mới, chọn lát cắt combat, research/đếm footage thực tế, tạo/review concept hay artwork, code/assets/tuning, build/playtest, DDR/Bible, commit/push/main/Pages/shutdown.
- **AC lượt này:** R01–R12 đều có owner/spec đích/evidence/gap; dependency hợp đồng và artifact tách riêng, không vòng; gap có nơi xử lý; tickets P0 có outcome/AC; handoff và manifest cùng trạng thái; dừng chờ review.
- **AC toàn P0 giữ nguyên:** detailed planning toàn release và targets đầy đủ, hết blocking TBD, user khóa đúng manifest revision. **Chưa đạt**, không đồng nhất với việc soạn xong bản này.

## 2. Baseline và trace approval

| Nguồn | Binding / trạng thái |
| --- | --- |
| [REVIEW_V1](../REVIEW_V1.md), R01–R12 | Bản đã review `cc6f54c`; SHA256 `E604C6EB353BEABC3DEB45BED0A0CDCCAAAF4036459857602460A7BA3375F713` của file tại commit đó; banner hiện hành ghi approval riêng |
| [DESIGN_CHECKLIST](../DESIGN_CHECKLIST.md), C09 / log R72 | User “all y”, 2026-11-14: R01–R11 Approved Design V1; R12 Approved với amendment planning toàn scope → user spec lock → implementation |
| Log Q01–Q61/C01–C09 và [RESUME](../RESUME.md) | Giữ toàn lịch sử/supersede; Q61 thu hồi, không hỏi lại. Q01 endless đã bị thay; Q35 quota 1+1 đã bị thay; Q55 quota bầy cũ không approved; dùng R06 V1 hiện hành |
| [WORKFLOW](WORKFLOW.md), rev1 | F1/F2 đang mở cho **DR-P0**; F3 của task SPEC/CONCEPT khác chỉ khi được giao; chưa F4/F5 |
| [HARNESS](../../combat-v2/HARNESS.md) rev2; [A-H2](../../combat-v2/TASK_CARD_TEMPLATE.md) v1; [A3](../../combat-v2/REFERENCE_PROTOCOL.md) v1 | Quy trình/binding/verify có hiệu lực; ticket planning không thay execution card hoặc cấp art approval |
| [MASTER_PLAN](../../combat-v2/MASTER_PLAN.md), [DESIGN_BIBLE](../../combat-v2/DESIGN_BIBLE.md) | Baseline creative/process; B1 vẫn PAUSED/REVERTED. Planning dungeon được mở riêng, không khôi phục B1 |
| [SPEC_LOCK](SPEC_LOCK.md), DR-LOCK-01 rev0 | NOT_LOCKED, chưa trình khóa, implementation NOT AUTHORIZED |

Approval baseline không là balance nghiệm thu, visual target mới hay khóa detailed specs. Số/catalog đã duyệt tiếp tục lấy từ R01–R12; tài liệu này không tạo bảng balance thứ hai. Điểm dư/full catalog và legacy/input đã được V1 giải quyết, không giữ thành câu hỏi baseline còn mở.

## 3. Nơi giữ spec và audit hiện trạng

**Quy ước đề xuất cho các session được giao sau:** mỗi milestone có một file spec có revision. Các đường dẫn bên dưới là **DỰ KIẾN / NOT CREATED**, chưa có schema/API được khóa. Khi mở milestone, audit source và lập detailed plan/tickets thật theo [template](TASK_TICKET_TEMPLATE.md); lúc đó mới tạo file cần thiết. Coverage dưới đây tham chiếu nhãn mục dự kiến, chưa khẳng định section đã tồn tại.

| Nhãn | File dự kiến dưới `docs/dungeon-redesign/planning/` | Owner / nội dung một nguồn |
| --- | --- | --- |
| S1 | `specs/DR-P1_WORLD.md` | P1: world geometry/seed/route/collision/navigation/camera/fog; target môi trường/minimap |
| S2 | `specs/DR-P2_ENCOUNTERS.md` | P2: packs/AI/rarity/affix, kill/elite progress, flask, encounter gate; lát cắt một map |
| S3 | `specs/DR-P3_BUILD.md` | P3: actions/input/aim/commit, active/support resolution, damage/CC, bag/slot/material/offers; target skill/build |
| S4 | `specs/DR-P4_BOSSES.md` | P4: roster/pattern/phase/aim lock/add queue/combat cleanup; target từng Boss |
| S5 | `specs/DR-P5_EXPEDITION.md` | P5: tree/modifier, snapshot catalog, banking/claims/terminal/storage, fresh profile, progression UI |
| S6 | `specs/DR-P6_EXPERIENCE.md` | P6: HUD/screen/input lifecycle chung, tutorial/audio/settings, device/measurement và full-loop acceptance |

R01–R12 là nguồn **giá trị thiết kế** cho tới khi spec revision được duyệt thay đúng phần; spec bổ sung mechanics/schema và dẫn baseline. Không chép cùng timing/cap sang nhiều spec: S2/S4/S5 dùng công thức/cap từ S3; S3 dùng mod đã resolve từ S5. Thay giá trị baseline cần nêu delta/impact và approval, không quyết trong lúc code.

**Audit source hẹp tại branch HEAD `0ee02af70ab530ad81c0ff84069b7e4fbf68fd9a`:** đã đọc các vùng nêu dưới, đủ xác định nơi cần audit tiếp; không coi đây là audit toàn call graph hoặc spec implementation.

| Source thực đã xem | Hiện trạng quan sát / việc planning phải giải |
| --- | --- |
| `src/game/movement.ts`: ARENA, movePlayer | Arena hữu hạn, clamp chữ nhật; P1 cần contract world/collision mới, không mặc định đã có navigation dungeon |
| `src/game/combat.ts`: CombatInput/Enemy/CombatWorld, clampPosition | Actions và state combat cũ còn hiện hữu; P3 cần contract thay action, P2/P4 cần pack/Boss lifecycle; reuse phải audit tiếp, không bê legacy proc sang rework |
| `src/game/ArenaScene.ts`: camera setup/zoom, fixed-step/input call sites | Follow/zoom bị ràng buộc arena, input cũ; P1/P3/P6 phải thống nhất camera/world-point/held-input và lifecycle |
| `src/game/progression.ts`: Profile/defaultProfile/loadProfile/saveProfile | Profile v3 và journal legacy hiện hành; P5 phải đặc tả profile rework tách dữ liệu production, storage error/claim/snapshot, không migrate |
| `src/ui/CombatHUD.ts`: markup/resource types; `src/i18n.ts`: dictionary hiện tại | HUD Heavy/Charged/Surge cũ; P6 là owner shell mới, P3/P5 là owner nội dung build/tree. i18n thực hiện đang ở **file `src/i18n.ts`**, không phải thư mục mẫu |
| `src/game/AdaptiveMusic.ts`: MusicSnapshot/musicState | State còn dựa elapsed/anomaly/Boss; P6 cần mapping progress/aggro/phase mới, không mặc định transport cũ đã đạt rework |

Các đường dẫn mới/API/module dungeon và behavior ngoài vùng đọc: **UNVERIFIED**; owner milestone phải audit trước khi ghi task CODE thật. Asset/reference scope lấy R11 làm inventory đầu vào; lượt P0 không mở ảnh, kiểm quyền/alpha hay claim visual PASS. Các task concept sau phải dùng [game-art](../../../.agents/skills/game-art/SKILL.md), Art Bible/index và ảnh thật.

## 4. Coverage matrix toàn release

Mã Cxx dưới đây là **coverage ID nội bộ của DR-P0**, không phải log C01–C09. Owner là milestone planning, **chưa có ticket P1–P6 được mở/tạo**. Mỗi owner phải phân rã hàng thành ticket cụ thể khi được giao; ticket P0 [PLAN-01](tickets/DR-P0-PLAN-01.md) ghi mapping, [VERIFY-01](tickets/DR-P0-VERIFY-01.md) kiểm closure. Evidence ở bảng là **cần có**, hiện NONE cho rework mới. Nhãn mục Sx là dự kiến theo §3.

| Coverage / baseline + AC cần giữ | Spec đích / owner | Ticket P0 / evidence cần có | Gap chặn lock |
| --- | --- | --- | --- |
| C01 · R01: 8 active, tags/geometry/cadence/CD/commit/cancel | S3 Actions / P3 | PLAN-01→VERIFY-01; bảng state/input/output từng A1–A8, trace commit/hit/cancel | Chi tiết state và catalog tickets |
| C02 · R01/R10: auto/sticky/override, manual phụ, Dash/bình riêng, keys/gesture hai nền tảng | S3 Input; S6 Lifecycle / P3→P6 | Matrix touch + keyboard/mouse, LOS/range/ground invalid, hold-release/cancel/fresh-press/blur-resize | Contract và mockup layout/input |
| C03 · R02: toàn compatibility 9×8, 3-2-2, ownership/tradeoff | S3 Supports / P3 | Matrix expected hợp lệ/invalid; chuyển bản không nhân ownership | Resolver/schema/tickets |
| C04 · R02/R09: xuyên→chain, volley-family/echo, caps damage/rate/CD/duration/shield/slow | S3 Resolution / P3 | Trace proc order/unique kills; case tổ hợp hợp lệ và cap; không đệ quy/shotgun/free tick | Thuật toán/identity/event ordering |
| C05 · R03: cấp theo ô, bag/salvage/material, cửa sổ đổi/nâng | S3 Transactions / P3 | Ledger trước/sau, đổi skill giữ cấp/CD; không equip heal/auto-salvage | Build transaction/error contract |
| C06 · R03/R10: starter/offer eligibility, draft budget, pending và Boss đầu lấp phụ2 | S3 Offers; S5 Checkpoints / P3→P5 | Seed/offer ledger, pool nhỏ hiện số thật, không reroll/owned active | RNG streams/offer persistence |
| C07 · R04: 9 unlock/giá, snapshot catalog, meta bank/full catalog | S5 Meta / P5 | Ledger từng Boss/final/ceil khoản, unlock cho lượt sau/điểm dư giữ | Schema/purchase/bank ordering |
| C08 · R04/R09: Ascension0–4/mở cấp/tính điểm/chung timing | S5 Ascension; S3 Scaling / P5 + P3 | Case catalog/cấp hợp lệ, công thức điểm/HP/damage và timing parity | Điều kiện mở cấp/state chi tiết |
| C09 · R05: 22 mods, roll/range theo chặng, cap count/value/lifetime | S5 Modifiers / P5 | Seed tree/mod ledger, rarity/số nguyên, additive/cap và delta+0 | Generator/rounding/validation |
| C10 · R05/R08/R09: legal combinations và cửa né khi mod Boss | S5 Legality nhận geometry S4 / P5 + P4 | Bảng loại tổ hợp/pattern trước generation, cue/hit khớp, có đường né thật | Boss geometry legality contract |
| C11 · R06: Atlas mapping → layout/density/pockets/spacing/rarity | S1 Reference/Layout; S2 Packs / P1→P2 | Footage URL/version/timestamp/context, bảng quan sát→candidate→giới hạn và kế hoạch playtest runtime | Chưa chọn/đếm footage; không claim đã đạt feel |
| C12 · R06: route/seed, kill-weight và elite-weight, nhánh tùy chọn | S1 Generation; S2 Progress / P1 + P2 | Seed route validator/main-route budgets, hai thanh tiến độ độc lập | Generation/navigation/progress contract |
| C13 · R06/R11: follow/zoom/aim visibility/biên/fog/Boss khám phá | S1 Camera/Fog; S6 HUD envelope / P1→P6 | Mockup annotation world mới + baseline thật; viewport/4góc/LOS; target được duyệt | Geometry/camera/minimap targets |
| C14 · R07: 4 role/leader/rarity/blue escorts/6 affix | S2 Catalog / P2 | Roster/affix states, integer composition và marker/attack cue crowd | Catalog tickets/rarity targets |
| C15 · R07: aggro/LOS/share/leash/path, attack budget/không respawn | S2 AI nhận S1 Collision / P2 | Trace kéo nhiều bầy/leader chết/HP leash/đợi trước windup | AI lifecycle/navigation contracts |
| C16 · R07–R10: flask charge/HoT/kill owner/adds/refill | S2 Flask; S4 Adds; S5 Settlement / P2→P4→P5 | Timeline refresh/pause/fullHP/fractional charge/death; cleanup không kill/charge giả | Event batch/refill ordering |
| C17 · R08: 3 Boss thường/rotation/no-repeat/aim snapshot/hit geometry | S4 Patterns; S5 Boss assignment / P4→P5 | Từng pattern state/geometry; windup-active-recovery/target lock/né/counter | Detailed pattern/pose targets |
| C18 · R08: final2pha/transform freeze/combo gap | S4 Final / P4 | Timeline threshold/clock, CD/HoT đóng băng, cue đòn sau riêng | Transition/clock/animation targets |
| C19 · R08/R10: adds queue/threshold burst/cap/entry lock/cleanup/death batch | S4 Encounter outcome; S5 Settlement / P4→P5 | Multi-threshold queue, spawn hợp lệ, cô lập cửa, simultaneous death không bank | Outcome và storage handshake |
| C20 · R09: depth/Asc scaling/formulas, shield/slow/HP ratio | S3 Scaling dùng mods S5 / P3 + P5 | Worked cases từ baseline, additive/cap/parity, không tune bằng bot | Typed stat/resolution contracts |
| C21 · R09: power feel yếu/mạnh, không ép DPS/winrate | S6 Acceptance nhận S2/S3/S4 / P6 | Build/route bất lợi, fodder/Boss time quan sát, user feel; số mục tiêu mềm không timer | Scenario/baseline/version test plan |
| C22 · R10: tree9/full preview/connections/lock siblings/node confirm | S5 Tree / P5 | Seed connectivity/no-dead-end, preview không commit, node entry commit một lần | Algorithm/state/UI tree |
| C23 · R10: entry snapshot/pending/terminal/claim-once/storage error/corrupt data | S5 Persistence / P5 | State transition/payload/atomic write, retry/reload ở từng checkpoint, không undo death | Schema/version/IDs/error UX |
| C24 · R10: fresh profile/settings/legacy removal trong rework | S5 Isolation; S6 Settings / P5→P6 | Namespace/allowlist, production save giữ nguyên, defaults đúng V1, không migration/cosmetic | Storage boundary/legacy call-site audit |
| C25 · R10: screen flow/pause/resume/vi-en/no click-through | S6 UI lifecycle; S3/P5 content / P6 | State+interaction matrix/keys hai dictionary, resources thật, input flush/fresh press | UI contracts/mockups |
| C26 · R10: tutorial/skip + adaptive audio không 5-phút/anomaly | S6 Tutorial/Audio / P6 | Hint triggers, progress/aggro/phase→transport/mix, audition và lifecycle | Cue/state/mix spec và audio review |
| C27 · R11: reuse Player/4 enemy families/Chain Warden, states mới/rarity | S2/S3/S4 Visual inventories / P2/P3/P4 | Baseline source IDs/rights→concept poses/crowd→approval→production riêng→actual | Approved new states/markers chưa có |
| C28 · R11: biome/modules/collision-readable art | S1 Environment / P1 | Module inventory/geometry/rights, source riêng/layer tĩnh; target đúng camera scale | Concept/targets/source plan |
| C29 · R11: 8 skill VFX families/glyphs, HUD/minimap/build/tree | S3 Skill; S1 Minimap; S5 Tree; S6 HUD / các owner tương ứng | Inventory reuse/new theo R11, effect trigger/hitbox, mockup trước code; không thêm icon mod tùy hứng | Target binding và asset output contracts |
| C30 · R12: input responsiveness/device parity/camera viewports | S6 Device/Input / P6 | Protocol ≤2tick, event→feedback p95, 320/390/844/768×1024/1440×1000/1920×1080, safe area/44CSSpx/4góc | Device IDs/browser/method chưa chọn |
| C31 · R12: crowd/readability/FPS/không giảm luật theo device | S6 Performance / P6 | Combat thường/stress riêng, crowd theo R12, 60s/device avg/p95, grayscale/threat priority | Runtime measurement chưa có; plan/targets chưa đủ |
| C32 · R12 amended: all-scope planning→lock→execution→accept | P0 plan này + SPEC_LOCK; S6 Full-run / P0 + P6 | Ticket manifest/hashes/approval, audit cross-spec, một full9node + reload/death/end/final, technical/visual/user tách | Detailed P1–P6/targets và user lock còn thiếu |

**Trace log phụ trợ:** Q01–Q12/Q40–Q44/Q58–Q59→C07–C09/C22–C24; Q13–Q29/Q31–Q39/Q57/Q61 thu hồi→C01–C06/C20/C24–C25; Q30/Q45–Q48/Q55→C06/C11–C15; Q49–Q54→C16–C19; Q56→C09–C10; Q60→C02/C25. C01–C09 của log được giữ ở nguồn, không thay bởi các Cxx coverage trên. Các quyết định legacy Q31–Q34 phải kiểm trong audit C24, không tự mang Sigil/Mutation/Curse/Anomaly/Surge cũ vào runtime rework.

## 5. Dependencies hợp đồng — tránh vòng P2↔P3/P4

Các mã K dưới đây là **deliverable spec**, không tên class/API hoặc ticket đã tồn tại. Một hợp đồng chỉ được dùng khi có section/revision cụ thể, không dùng tên nhãn này làm chứng cứ đã sẵn sàng.

| ID / producer | Input hợp đồng | Output cần rõ trước consumer |
| --- | --- | --- |
| K-W / P1 | R06/R11 và constraints R12 đã duyệt | World units/coordinates/seed/layout/collision/LOS/room/route budgets/camera bounds; chưa cần combat code/HUD final |
| K-A / P3 | K-W + R01–R03/R09/R10 | Action/input/target/commit/cancel/CD, stat/proc/kill owner, build/offer payload; chưa cần AI/Boss runtime |
| K-E / P2 | K-W + K-A + lifecycle invariant R10 | Packs/aggro/leash/attack admission, progress/flask, gate request/encounter events, yêu cầu lát cắt; chưa cần Boss production |
| K-B / P4 | K-W + K-A + K-E + R08 | Pattern/geometry/room constraints, threshold/add queue/clock, damage-batch kết thúc và outcome khi Player còn sống; không trực tiếp commit meta |
| K-X / P5 | K-W/K-A/K-E/K-B + R04/R05/R10 | Tree/mod rolls/legal geometry, serialized entry/pending/terminal, bank/claim/refill/purchase ordering, storage failure và catalog snapshot |
| K-U / P6 | K-W/K-A/K-E/K-B/K-X + R10–R12 | HUD world lane/safe area/screen lifecycle/input flushing, audio/tutorial/device acceptance; không tạo simulation resource/timer mới |

**Đồ thị hợp đồng:** baseline → K-W → K-A → K-E → K-B → K-X → K-U. Các producer có thể dùng trực tiếp baseline cho constraint đã duyệt, không chờ code consumer. Payload có request/result/error và ownership, nhưng field/API cụ thể thuộc planning producer, chưa quyết tại P0.

**Đồ thị artifact/implementation riêng:** sau global lock, P1 world implementation → lát cắt P2 (phụ thuộc task core action P3 và một Boss P4 đã được giao riêng) → catalog P3/roster P4 → full-loop P5 → integration/verify P6. Đây là thứ tự dự kiến theo R12; detailed tickets quyết thứ tự chính xác, không buộc toàn milestone P3/P4 phải code xong mới có P2. ART production phụ thuộc target approved + lock; integration phụ thuộc source production/contract; verify actual phụ thuộc runtime thật. Không có cạnh “P2 phải implement để planning P3/P4”.

**Feedback khi closure:** target camera/HUD cuối cùng cần K-U, mod legality cần K-B, reward UI cần K-X. Vì vậy P1/P2/P3/P4 có thể đã có plan nhưng chưa SPEC_READY cuối cùng cho tới lượt đối chiếu; đây là dependency của **artifact hoàn chỉnh**, không quay ngược hợp đồng đầu vào thành vòng. Nếu closure thay contract đã review, ghi delta/impact và sửa affected revisions, không tự đổi baseline.

## 6. Thứ tự planning đề xuất — chưa mở milestone tiếp

| Thứ tự | Session cần user giao | Outcome để chuyển planning / còn phải đóng sau |
| --- | --- | --- |
| 0 · hiện tại | DR-P0-PLAN-01 | Bản đồ coverage/deps/gaps này; dừng chờ review, chưa toàn P0 complete |
| 1 | Planning DR-P1 | Audit geometry/world + Atlas protocol/quan sát, K-W và detailed tickets/spec/target list. Camera concept dùng baseline thật có annotation; HUD final đối chiếu K-U sau |
| 2 | Planning DR-P3 | K-A, đủ active/support/build/offers/economy/input tickets và targets cần tạo; không chờ P2 code. Runtime proc legacy audit ở đây |
| 3 | Planning DR-P2 | K-E, packs/AI/flask/progress/rarity tickets; đề xuất lát cắt skill/Boss từ catalog đã duyệt, nêu lý do/AC cho user review. Lát cắt chưa được P0 tự chọn; final binding chờ K-B/K-X/K-U |
| 4 | Planning DR-P4 | K-B và đủ từng Boss/pattern/phase/adds/artwork/verify tickets; giữ interface K-E, giải bài toán cửa né cho P5 legality |
| 5 | Planning DR-P5 | K-X, tree/mod/schema/transaction/error/unlock/Ascension/UI tickets, không bỏ pending/terminal/isolation; trả payload cho P3/P6 |
| 6 | Planning DR-P6 | K-U, toàn UI/tutorial/audio/device/full-loop tickets/evidence plan; bind shell với nội dung P1/P3/P5 và clocks P2/P4 |
| 7 | Task SPEC/CONCEPT design-only cụ thể, khi được giao | Hoàn thiện specs/targets còn thiếu theo dependency; có thể được giao sớm sau contract phù hợp, không cần đợi hết sáu session. Mỗi concept qua game-art/approval; chưa production |
| 8 | DR-P0-VERIFY-01, khi được giao và inputs đủ | Đối chiếu tất cả contract/targets/tickets, cập nhật coverage actual IDs, chuẩn bị exact manifest revision để user review/lock; không tự khóa hoặc code |

Thứ tự này đề xuất **planning P1→P3→P2→P4→P5→P6**, không đổi intent/implementation order R12. Nếu một milestone cần nhiều session SPEC/CONCEPT, chỉ mở đúng task user giao. Không hứa mỗi milestone xong trong một chat, không tự bắt đầu mục tiếp khi review bản này xong.

## 7. Gap register và điều kiện đóng

| Gap / owner | Việc phải hoàn thiện khi được giao | Chặn gì / evidence đủ để đóng |
| --- | --- | --- |
| G01 · P1→P2 Atlas | Chọn footage mapping đại diện có nguồn/quyền xem, version/build/context/timestamp; đếm sample pack/spacing/clear cadence, tách observed vs inferred/không thấy toàn map; so với R06 và nêu limitations | Chặn mật độ spec final/lock nếu chưa có comparison; không copy asset. Runtime feel chỉ có thể kiểm sau implementation, phải ghi kế hoạch playtest; không dùng thiếu playtest trước code làm vòng gate |
| G02 · P1 world | Seed/layout route/collision/navigation/fog/camera và generator validate budget R06, room constraint R08 | Chặn K-W/consumer; spec algorithm, data và failure handling đủ để không đoán |
| G03 · P3 skill/input/build | K-A; legacy removal boundary, cooldown khi đổi/echo ownership, offer RNG, transaction/pause | Chặn K-E/K-B và tickets CODE; input/state tables + worked cases |
| G04 · P2 encounters | K-E; roster/affix/rarity/AI/flask/progress/lát cắt, thiết lập density từ P1 | Chặn K-B/one-map tickets; output/input ownership và scenario expected rõ |
| G05 · P4 Boss | K-B; pattern/phase geometry/add queue/death batch và legal escape constraints | Chặn mod legality/K-X/Boss tickets; không lấy accepted Boss cũ làm approved đòn mới |
| G06 · P5 expedition | K-X; tree/mod generator/RNG IDs/banking/pending/entry/terminal/storage failure/corruption/fresh namespace | Chặn progression/integration; ledger/schema/reload examples và error UX cụ thể |
| G07 · P1/P2/P3/P4/P5/P6 visual | Owner tạo danh sách target đúng R11, refs thật/revision/rights/bindings, concept và mockup scale chơi thật→user approval; production output inventory riêng | Chặn visual lock/ART-CODE; không chỉ có câu “sẽ làm art”. Gồm environment, rarity, actor states, skill/glyph, Boss, HUD/minimap/build/tree |
| G08 · P6 UI/audio/device | K-U; hint/audio cue-state/mix/approval phù hợp; máy/browser đại diện và phương pháp đo input/FPS, cảnh bình thường/stress, vi/en/resize | Chặn readiness lock nếu spec/plan/target thiếu; measurements/real-device/user listening thực tế vẫn NOT CHECKED cho tới execution, không claim PASS sớm |
| G09 · P0 closure | Map C01–C32→actual child tickets + exact sections/revisions/refs/hashes; audit hợp đồng + anti-scope + scenario coverage | Chặn trình lock khi còn requirement mồ côi, hidden dependency, unresolved conflict/TBD hoặc target chưa approved |

Thiếu nguồn/thiết bị khi task tương ứng được giao: ghi blocker cụ thể và phần chưa kiểm; tiếp tục planning độc lập, không bịa số hoặc tự cắt scope. Không thêm gate approval giả cho các lựa chọn kỹ thuật thông thường; không hỏi lại baseline.

## 8. Lock readiness và review hiện tại

- DR-LOCK-01 rev0 vẫn **NOT_LOCKED**; manifest hiện chỉ index planning. Chưa đủ để lập revision trình khóa.
- P1–P6 còn DRAFT; các S1–S6/K-W..K-U chưa tồn tại/được approved. P0-VERIFY-01 là PLANNED, execution assignment NONE.
- Trước lock: từng hàng coverage có actual ticket/spec/target (hoặc N/A có lý do), user approval đúng revisions cho thiết kế/targets; số liệu baseline không bị âm thầm thay; mọi task CODE/ART còn chờ global lock và session assignment.
- Khi đủ: lập manifest revision mới, bind exact hashes/revisions và nguồn approval; user khóa đúng bản sau review. Review kế hoạch P0 lần này **không** là spec lock.

**Validation lượt này:** audit tĩnh coverage/dependency/link/diff/scope; kết quả cụ thể tại ticket PLAN-01. Không build/typecheck/test game vì docs-only. Technical docs tách khỏi user review; visual/playtest N/A cho lượt P0, rework runtime NOT CHECKED.

**ONE NEXT ACTION: DỪNG; chờ user giao planning DR-P1 trong session mới theo thứ tự đã duyệt.**
