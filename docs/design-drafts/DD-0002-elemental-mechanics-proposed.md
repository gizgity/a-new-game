# DD-0002 candidate — Elemental Mechanics Contract

**Proposed — Awaiting User Approval.** Draft ngoài DDR, chưa được user duyệt toàn bộ. DD-0002 là ID dự kiến, chưa cấp/giữ chỗ; phải đọc lại registry khi append. Không dùng draft này làm approval hoặc lệnh mở implementation Q9A.

## Metadata và nguồn

- Ngày soạn: 2026-10-26; revision ngày 2026-10-27 theo task “Revise DD-0002 Mechanics Contract”. Người đề xuất hướng cơ chế: user; các chi tiết còn thiếu được agent đề xuất để user review, không gán thành kết luận của user.
- Trạng thái dự kiến: `Proposed`; chưa append [DDR](../../DESIGN_DECISIONS.md). Theo [skill design-decision](../../.agents/skills/design-decision/SKILL.md), bước 3: “Không tự thiết kế, tự duyệt hoặc suy approval. Thiếu bằng chứng: báo chính xác phần thiếu và không append.” Bước 4 cho phép user chốt `Proposed`; không bắt mọi entry phải Approved. Draft riêng là cách giữ chi tiết do agent đề xuất ngoài registry tới khi user xác nhận nội dung/trạng thái.
- Liên quan: [DD-0001 — CURSEBREAK Legacy V1](../../DESIGN_DECISIONS.md#dd-0001--cursebreak-legacy-v1). `Supersedes: None`: đề xuất chi tiết hóa mục 1/6, không thay unlock/run/RNG/Anomaly/Ascension/economy. Nếu user đổi phần đã Approved, lần ghi sau phải chỉ rõ scope Supersedes thay vì sửa lịch sử.
- Mục tiêu/lý do user cung cấp: “Chuẩn bị DD-0002 chi tiết hóa 6 Sigil + 12 Branch để Q9A không phải tự thiết kế gameplay.”
- Nguồn: user, 2026-10-26, hội thoại task hiện tại, không có permalink. Chỉ thị nguyên văn: “Soạn DD-0002 dưới dạng Proposed, liên kết DD-0001; không sửa/xóa lịch sử.”; “Nếu quy tắc skill yêu cầu approval mới được ghi DDR, xuất bản draft riêng để user duyệt.”; “Không implementation, không mở Q9A.”
- Nguồn revision: user, 2026-10-27, hội thoại task hiện tại, không có permalink. Chỉ thị nguyên văn: “Legacy kills được kích hoạt các on-kill Mutation/Curse hợp lệ, bảo toàn synergy của CURSEBREAK.”; “Melee lethal hit lên marked target vẫn được tính là Ambush thành công.”; “Draft vẫn là Proposed — Awaiting User Approval; không tự Approved.” Các điều chỉnh cụ thể đã được yêu cầu dưới đây không được hiểu là approval toàn contract.
- Hướng cơ chế user đưa ra, nguyên văn:
  - “Fire: Charged → Ignite DoT; Wildfire = truyền Ignite khi kill; Furnace = Heavy nổ AoE trên mục tiêu Ignite.”
  - “Water: Heavy → Soaked/slow; Undertow = knockback mục tiêu Soaked; Flow State = Perfect Dodge giảm Heavy cooldown.”
  - “Lightning: Perfect Dodge → Static Charge; Basic Shot tiêu charge tạo chain lightning; Arc Relay = thêm 1 jump; Overclock = temporary attack-speed boost.”
  - “Ice: consecutive hits → Frostbite; Heavy/Charged → Shatter; Brittle = armor break/interrupt; Crystal Echo = secondary ice projectile.”
  - “Shadow: Perfect Dodge → mark target; melee → Ambush; Nightfall = shadow follow-up strike; Veilstep = reposition speed boost.”
  - “Wind: movement → Momentum; Light tiêu Momentum tạo wind slash; Tailwind = temporary attack-speed boost; Cyclone = knockback.”
- Release boundary: v0.1.0, target `4770bf617f292c407685c4fbed1ebf5d3c6cb84f`, published `2026-10-26T16:46:46Z`, theo DDR/HANDOFF; [Release](https://github.com/gizgity/a-new-game/releases/tag/v0.1.0). Task mới này tiếp sau DD-0001 trên main `9b1f988`, không backfill trước Release.
- Baseline đọc: main `9b1f988`; audit combat tại [combat.ts](../../src/game/combat.ts), [BuildEffects](../../src/game/BuildEffects.ts), [balance](../../src/game/config/balance.ts), [ActorPose](../../src/game/ActorPose.ts), [RunDirector](../../src/game/run.ts), [ArenaScene](../../src/game/ArenaScene.ts).
- Implementation/acceptance: chưa thực hiện trong task này. Nền Q9A `2868f77` nằm riêng trên nhánh `q9a-elemental-legacy`, chưa merge; draft docs tạo từ main để không kéo runtime đó vào task này. Theo dõi tại [HANDOFF](../../HANDOFF.md#elemental-contract-status).

## 1. Quy ước chung đề xuất

Mọi chi tiết từ mục này trở đi là **Proposed để duyệt**, trừ ràng buộc đã nêu trong DD-0001 hoặc prompt user. Mỗi run tối đa 1 Sigil + 1 Branch tương ứng; Branch bổ sung Core, không đồng thời có hai Branch. Không phản ứng chéo nguyên tố. Giữ 4 slot Mutation + 2 slot Curse và toàn bộ pool hiện tại.

### Event, thứ tự và quyền proc

- `primary`: hit thật có damage dương từ Light, Heavy, Basic Shot, Charged của player. Mỗi lần ra đòn/viên đạn có action ID; một action chỉ tính một hit trên mỗi target. Chạm collider mà không mất HP không kích hoạt Core/Branch.
- `legacySecondary`: Ignite tick, Furnace blast, chain lightning, Shatter bonus, Crystal Echo, Ambush bonus, Nightfall và wind slash. Giữ origin riêng xuyên suốt; không gắn nhãn Basic/Charged/Heavy để tái sử dụng proc ngầm.
- `mutationSecondary`, `ruptureDetonation`, `curseSecondary`, Surge, hostile damage không phải primary; không tạo/cộng/tiêu state Legacy, trừ ngoại lệ Wildfire giới hạn dưới đây. Không thay predicate của các event combat cũ.
- Mỗi primary snapshot state Legacy của target ngay trước damage. Resolve primary và các hook hiện hữu theo thứ tự cũ; rồi resolve consumption/secondary Legacy theo snapshot; cuối cùng apply/refresh state mới nếu target còn sống. Vì vậy Heavy Water đầu tiên chỉ Soaked; Heavy/Charged Ice đầu tiên chạm ngưỡng không tự Shatter ngay trong cùng hit. Primary giết target vẫn có thể kích hoạt Furnace/Shatter đã đủ điều kiện trước hit; Ambush tiêu mark nhưng không đánh thêm corpse. Không đánh corpse để tạo kill thứ hai.
- Secondary không chạy bằng gọi đệ quy: xếp hàng theo simulation time với event ID, parent event ID, root-event ID, origin, owner, target ID, visited targets và proc budget. Không tạo root mới để lách cap khi thực hiện tick/jump/secondary/death callback. Primary/Perfect Dodge/movement action độc lập thật mới có thể mở root mới; mọi hậu duệ kế thừa root gây ra mình, kể cả qua nhiều tick/freeze.
- Damage `legacySecondary` không trực tiếp đặt/tiêu Rupture, gọi Detonate, cho charge points/Charged ammo, tạo melee/ranged hit counters hay kích **on-hit** Aegis/Blood Pact/Catalyst/Static Riposte/Phantom Edge/Berserker/Guard Breaker/Iron Reversal. Quyền **on-kill** tách riêng theo phần dưới; không gắn sound/flag primary giả để lấy quyền proc. Những hook không phải on-kill của combat cũ vẫn có điều kiện gốc.
- Surge theo hit damage thật và kill đi qua accounting combat hiện hữu, đúng một lần/event, cùng cap hiện có; không tự cộng thêm lần nữa ở handler Legacy. Một terminal hit không vừa bị xử lý như primary vừa như Legacy hit. Giữ đường Surge/charge của primary, Perfect Dodge và Detonate; Legacy không được biến thành Detonate để kiếm charge/Surge thêm.
- Damage Legacy dùng base damage config riêng, không nhân lại toàn bộ damage đòn kích hoạt, không lấy HP tối đa Boss làm tỷ lệ. Nhân `outgoingDamageMultiplier` của player đúng một lần tại lúc secondary gây damage; không nhân lại Glass Soul bonus dành cho projectile primary. Armor mặc định của Bulwark vẫn áp dụng trừ ngoại lệ Brittle. Không double-scale khi source đã snapshot damage.

### P1 — Kill event, proc synergy và budget

- Mọi lần chuyển `HP > 0 → HP = 0` tạo **một** death ID (run + enemy ID), một kill event gắn root/origin/owner của damage kết liễu. Ghi nhận death trước khi dispatch proc; hit tiếp theo vào corpse bị bỏ, không phát kill/reward nữa. Nếu nhiều nguồn cùng tick, thứ tự simulation xác định nguồn đầu tiên làm HP về 0; không roll thêm/tùy nền tảng. Snapshot Rupture và `root.marked` trước cleanup vẫn dùng được cho on-kill.
- Legacy kill được xét **mọi on-kill Mutation/Curse hợp lệ**, giữ điều kiện sở hữu, marked, CD, heal/resource caps và root flags hiện hữu. Blood Reclaimer cần Rupture hoặc `root.marked` đúng như combat cũ; mark Shadow/Ignite/Frostbite không được giả làm Rupture. Hunted Vessel giữ CD và cap Barrier/Surge; Death Echo giữ `root.echoes`/`BUILD.echoCap`. Mỗi cặp `(death ID, proc ID)` chỉ xét/dispatch một lần; kill mới ở enemy khác vẫn được xét, không khóa cả proc một lần/root.
- Giữ kill count, Boss slain/death position và Surge kill accounting đúng một lần, độc lập với còn/hết optional proc budget. Đây không là quyền thêm Victory reward/unlock/economy mới. Volatile death explosion là hậu quả combat bắt buộc: enqueue đúng một lần theo death ID, giữ hostile damage/player damage/geometry và root cũ, không bị bỏ bởi cap optional Legacy proc. Các hậu quả đã có queue/budget safety riêng vẫn đi qua cơ chế hiện hữu.
- Proc con có origin thật (`mutationSecondary`, `curseSecondary`, `ruptureDetonation`, hostile Volatile...), giữ parent/root và ownership theo combat; không đổi thành primary và không reset origin khi đi qua death callback. Native secondary giữ quyền Rupture/Detonate/Surge/CC vốn có; ví dụ Death Echo có thể đi qua explosion resolver cũ và kích marked relay. Không cấm đường này chỉ vì nguồn root là Legacy; bản thân Furnace/DoT/chain lightning không trực tiếp đi vào resolver đó.
- Với một causal tree có Legacy, có **tổng budget proc con hữu hạn/root** và cap depth hữu hạn, ngoài cap mỗi loại/visited/cooldown có sẵn. Enqueue một optional proc gây damage/spread phải trừ budget trước; con nhận phần còn lại từ cùng root ledger, không nhận bản copy đầy budget. Fan-out cũng tiêu ngân sách, không chỉ tính số tầng. DoT giữ root của application; refresh từ primary mới có thể thay root bằng action thật đó, nhưng không reset tick clock. Refresh từ proc con luôn kế thừa root, không cấp ngân sách mới. Wildfire truyền root và generation; generation chỉ reset bởi application Core Charged độc lập thật.
- Secondary kill có thể tạo on-kill hợp lệ ở death mới trong root còn budget; đây là bounded synergy, không gọi ngược để tự tái-kích hit/charge/Ambush/Shatter. Hết budget/depth/cap thì bỏ **optional proc mới**, không bỏ damage/kill đã resolve, không refund state và không tái thử callback ở tick sau. CD/resource eligibility giữ nguyên; không tạo cooldown/resource giả cho proc bị từ chối trước enqueue. Proc đã trigger/consume rồi bị hủy do target chết/range/budget delivery không được refund.
- Giữ `ChainRoot` state cũ (seeded/marked/echoes/triggers/healed/pulsed...) cùng relay delay/visited/pendingDetonations. Root-event ID chỉ bổ sung lineage, không thay hoặc reset các guard này. Queue Rupture hiện vượt quota mỗi tick được hoãn tới tick sau như baseline, **không chuyển sang bỏ queue**. Không để quota optional Legacy lấy mất slot primary/native đã nhận. Event/tick, active projectile/queue/target caps giới hạn công việc; xử lý theo thứ tự enqueue xác định, không tích catch-up qua pause. Kill accounting và Volatile death không đi qua cơ chế drop optional proc.
- Resource-only on-kill vẫn dùng CD/heal window/resource caps cũ, dedup một lần/death; không tự sinh hit/death. Không cắt synergy này bằng budget dành cho damaging offspring. Số cụ thể của budget/depth/caps là tuning TBD; ledger phải sống qua delay/tick cho tới hết hậu duệ, không reset mỗi frame. Không sửa policy của root thuần combat cũ hoặc giảm cap đã duyệt để nhường tài nguyên cho Legacy.

| Trường hợp kill | Root/origin và accounting | Proc hợp lệ |
| --- | --- | --- |
| Direct kill | Light/Heavy/Basic/Charged gây terminal damage; root action thật, `primary` | On-kill cũ đủ điều kiện, một death/event; Legacy xét snapshot trigger như các mục dưới |
| DoT kill | Ignite Core hoặc Ignite Wildfire tick gây terminal damage; root application, `legacySecondary`, lưu generation | Blood Reclaimer nếu marked thật, Hunted Vessel/Death Echo theo guard/budget; Wildfire chỉ nếu nguồn generation0 và đủ CD |
| Chain kill | Lightning jump gây terminal damage: root discharge, `legacySecondary`; Rupture relay gây terminal damage: root cũ, `ruptureDetonation` | Mỗi enemy chết xét on-kill một lần; cả chain giữ root/visited/budget, Lightning không tự tạo Rupture nhưng Death Echo hợp lệ vẫn giữ resolver cũ |
| Secondary kill | Furnace/Shatter/Crystal Echo/Ambush/Nightfall/wind slash hoặc proc con kết liễu enemy khác | On-kill vẫn hợp lệ, root kế thừa, không mở ngân sách mới; không tự tạo quyền on-hit/Legacy trigger mới |
| Corpse/kill cạnh tranh | Target đã chết bởi event trước, hoặc Nightfall resolve sau lethal Ambush | Không damage corpse, không event kill/reward/Surge/Volatile death lần hai; không chuyển attribution từ event đã thắng |

Ví dụ review: Ignite giết A có Rupture → Blood Reclaimer xét marked/CD; Death Echo từ A giết B → kill B có thể xét Death Echo tiếp trong **cùng** root tới cap. Death Echo có thể kích Rupture B qua resolver cũ; không reset relay/echo budget. Nếu A/B là Volatile, mỗi death vẫn phát explosion bắt buộc một lần. Wildfire từ A chỉ truyền một thế hệ V1; terminal Ignite giết B vẫn có on-kill Mutation/Curse nhưng không truyền Ignite thế hệ hai. Không có root/event mới được tạo chỉ để vượt cap.

### Clock, cooldown và trạng thái

- Tất cả duration, DoT tick, cooldown, delay và movement sampling dùng **simulation time đang tiến**; dừng trong pause/Draft/menu/result/hitstop/Boss transform. Không dùng wall clock/DOM input để tích state. Không tích bù trong lúc freeze. World reset xóa hết combat state; ticket/seed giữ theo DD-0001, không lưu timer/status combat vào profile.
- Cooldown (CD) ghi trong từng mục; CD global là theo player trong run, CD target là theo target ID. CD bắt đầu khi trigger hợp lệ được nhận, trước enqueue secondary; optional proc phải qua CD/budget/cap admission trước khi bắt đầu CD. Ambush success/consume là event của Core theo melee snapshot, không bị đổi thành thất bại chỉ vì budget secondary đã hết; admission của Ambush bonus/Nightfall được xét riêng, không refund Core mark/CD; miss/cancel hoặc không có điều kiện thì không bắt đầu CD, **trừ trigger resolve không cần hit** đã ghi rõ như wind slash. Lethal Ambush vẫn là trigger hợp lệ, bắt đầu CD như hit không lethal. Nếu ghi “không CD riêng”, nhịp primary/event và budget vẫn giới hạn.
- Buff/mark/DoT một instance theo loại; refresh thay duration bằng duration config, không cộng duration. Stack có cap; không tăng damage vô hạn. Refresh DoT không reset tick về đầu để gây thêm tick tức thì. Hết hạn/target chết thì bỏ state, không chuyển ngầm sang target khác.
- Thứ tự chọn target: lọc sống/hợp lệ/range/arc rồi distance tăng dần, tie target ID. Range/arc tính theo world geometry thật; không đổi auto aim/input/camera/collider. Không có target thì bỏ effect, trừ resource được quy định giữ lại.

### Boss, Elite và cadence

- Boss nhận status phục vụ damage/combo, nhưng **miễn toàn bộ slow, stagger, interrupt, armor-break debuff và knockback do Legacy**. Không reset windup/cooldown/recovery/leap/transform/combo của Boss. Transform 1.4s và run freeze giữ nguyên. Không dùng generic `blast` để vô tình thêm interrupt/hitstop.
- Elite hiện là Bulwark. Damage/status áp dụng; slow không nhân chồng với slow cũ: dùng mức chậm mạnh nhất còn hiệu lực. Knockback dùng resistance Bulwark hiện có; Legacy interrupt có immunity window riêng sau mỗi lần thành công, không refresh bằng spam; không đổi thời gian immunity bằng các hit thường.
- Legacy secondary không thêm hitstop hay action animation mới; không cancel/restart player/Boss action. Attack-speed buff chỉ rút ngắn recovery Light và interval Basic Shot tương lai; windup/active Light, toàn bộ Heavy, Charged cooldown, Dash và enemy timing giữ nguyên. Snapshot tốc độ khi bắt đầu action, không kéo dài/rút ngắn action đang chạy. Buff cùng loại refresh, tổng bonus cộng rồi clamp một hard cap config; có recovery/shot interval tối thiểu để giữ readability. Berserker hiện tăng damage, không chuyển thành haste.

## 2. Fire — Charged → Ignite

### Core: Ignite

- **Trigger/target:** primary Charged hit gây damage dương; áp lên chính enemy còn sống sau hit, không áp qua Charged blast/Detonate.
- **Effect:** Ignite DoT damage theo tick trong duration config; không slow/interrupt/force.
- **Consumption/stacking:** không tiêu ammo thêm; một Ignite mỗi target, hit mới refresh duration, không cộng stacks/DPS và không thêm tick tức thì.
- **CD/origin:** application không CD riêng ngoài Charged cadence; DoT tick interval config theo target; damage tick là `legacySecondary`, không kích on-hit; DoT kill xét on-kill theo P1. Boss/Elite nhận DoT, vẫn xét armor theo quy tắc chung.

### Branch: Wildfire

- **Trigger/target:** enemy đang mang Ignite **gốc Core, generation0** bị damage có player ownership kết liễu (primary, DoT, chain hoặc secondary hợp lệ theo P1). Truyền tới enemy sống gần vị trí chết, theo radius/target cap config; không truyền do hostile/environment kill, không dùng corpse làm đích.
- **Effect:** đặt Ignite mới với damage/duration Wildfire config; không có burst damage khi truyền. Target đã Ignite chỉ refresh một instance, không cộng DPS/tick tức thì. Nếu Wildfire thay application hiện có thì root/owner chuyển sang transmission và generation luôn là1 (terminal), kể cả trước đó target có Ignite Core; chỉ Core Charged độc lập mới được đặt lại generation0. Damage/duration của application truyền lấy Wildfire config, không cộng với Ignite cũ.
- **Consumption/stacking:** Ignite trên nguồn hết khi chết; không tiêu Ignite target khác. Một death được xét một lần. Ignite được truyền có cờ terminal: chính target đó chết khi mang Ignite truyền **không được truyền tiếp**, dù bị primary hay DoT kết liễu. Core Charged mới có thể thay Ignite terminal thành Ignite gốc.
- **CD/origin:** CD global Wildfire và cap target/death; transmission là ngoại lệ apply status một thế hệ, dùng chung root/budget P1; không phải quyền kích lại primary/on-hit. Giới hạn **một thế hệ trong V1** là giới hạn có thể tuning qua playtest có user review sau này, không tự tăng generation trong implementation. Terminal Wildfire kill vẫn xét on-kill Mutation/Curse theo P1. Boss chết có thể làm nguồn nếu còn adds; Boss/Elite làm đích nhận DoT, không CC.

### Branch: Furnace

- **Trigger/target:** primary Heavy hit target có Ignite trong snapshot; blast tại vị trí target lúc hit, trúng target sống trong radius, có thể gồm nguồn nếu còn sống.
- **Effect:** thêm AoE damage config; không đặt Ignite/Rupture và không kích Detonate.
- **Consumption/stacking:** tiêu Ignite của nguồn khi trigger thành công; tối đa một Furnace blast cho mỗi Heavy action, chọn target Ignite gần player nhất nếu Heavy trúng nhiều target. Không tiêu Ignite của các target không được chọn.
- **CD/origin:** CD global Furnace; blast `legacySecondary`, không interrupt/force/hitstop. Boss/Elite nhận damage, không bypass armor mặc định.

## 3. Water — Heavy → Soaked

### Core: Soaked

- **Trigger/target:** primary Heavy hit gây damage dương, apply lên mỗi enemy còn sống trúng Heavy, theo cap target chung, ưu tiên gần player rồi ID.
- **Effect:** Soaked tồn tại trong duration config; slow di chuyển thường với multiplier config. Không kéo dài windup/recovery, không sửa projectile/leap travel timing.
- **Consumption/stacking:** một status/target, refresh không cộng duration/mức slow; không bị đòn Basic/Charged/Light tự tiêu. Không CD riêng ngoài Heavy cadence.
- **Origin/Boss/Elite:** primary application; status không gây damage/proc. Boss giữ marker phục vụ Undertow nhưng không slow; Bulwark slow theo quy tắc strongest-only.

### Branch: Undertow

- **Trigger/target:** primary Light/Heavy/Basic/Charged hit enemy **đã Soaked trước hit**, không kích ngay trên Heavy đầu tiên đặt Soaked.
- **Effect:** knockback ra xa vị trí player tại thời điểm hit, dùng force config, clamp arena; không kéo về player, không thêm damage/interrupt/stagger.
- **Consumption/stacking:** giữ Soaked; không cộng force do nhiều hit cùng action trên cùng enemy.
- **CD/origin:** CD riêng theo target; knockback Legacy không tạo hit event. Primary lethal vẫn có thể nhận CD theo snapshot nhưng không đẩy corpse. Boss không dịch chuyển nhưng nhận CD bình thường; Bulwark dùng resistance hiện hữu. Không reset recovery/cooldown địch.

### Branch: Flow State

- **Trigger/target:** Perfect Dodge đã được combat xác nhận, tác động resource Heavy của player; không cần enemy Soaked.
- **Effect:** cộng thời gian recharge config vào tiến trình hồi **charge Heavy đang thiếu**; không giảm windup/duration của Heavy.
- **Consumption/stacking:** không tiêu Soaked/Dash thêm; không bank nếu đủ charge. Mỗi trigger trả tối đa một charge, phần thừa bỏ; tiến trình charge tiếp theo không nhận overflow.
- **CD/origin:** CD global Flow State; một event Perfect Dodge chỉ xét một lần, giữ các hook Ghost Step/Static Riposte/Phantom Edge cũ độc lập. Boss/Elite không đổi timing; chỉ quyết định né có Perfect hay không theo predicate cũ.

## 4. Lightning — Perfect Dodge → Static Charge → Basic Shot

### Core: Static Charge / chain lightning

- **Trigger/target:** Perfect Dodge cấp một Legacy Static Charge cho player. Primary Basic Shot hit enemy gây damage dương khi có charge sẽ tiêu charge và tạo chain damage tại target đó; miss không tiêu. Nếu nhiều Basic projectile đang bay, hit hợp lệ đầu tiên tiêu charge theo thứ tự simulation; không reserve ở lúc bắn.
- **Effect:** chain đánh target đầu nếu còn sống, rồi chọn enemy sống gần node trước trong jump range; target đầu vừa chết vẫn là vị trí bắt đầu chain. Không revisit target, không đánh cùng enemy hai lần trong chain. Số jump cơ bản là config; một jump là thêm một enemy sau target đầu.
- **Consumption/stacking:** tối đa một charge, có expiry config; Perfect Dodge mới refresh charge, không cộng stack. Charged không tiêu Legacy charge. Charge độc lập hoàn toàn với `build.staticCharge` của Static Riposte.
- **CD/origin:** CD global cấp charge, CD global chain discharge; chỉ tiêu khi discharge sẵn sàng. Chain dùng budget riêng hữu hạn, tất cả damage là `legacySecondary`; không stun, không Rupture/Detonate, không cấp charge/ammo. Boss/Elite nhận damage theo armor mặc định, không CC.

### Branch: Arc Relay

- **Trigger/target:** chain lightning từ Core, dùng cùng danh sách visited và target selection.
- **Effect:** thêm **1 jump** so với số jump Core; không thêm bolt quay lại target cũ, không cho thêm jump khi kill.
- **Consumption/stacking:** dùng cùng một charge đã tiêu, không có charge/CD riêng, không nhân số jump theo số enemy chết.
- **CD/origin/Boss/Elite:** kế thừa CD/budget Core và `legacySecondary`; Boss/Elite là node hợp lệ đúng một lần, không CC. Target/budget cap phải đủ cho số jump đã cấu hình; không bỏ riêng jump Branch bằng cấu hình mâu thuẫn.

### Branch: Overclock

- **Trigger/target:** Core tiêu Legacy Static Charge thành công ở Basic hit; buff player ngay cả khi không tìm được jump target thứ hai.
- **Effect:** temporary attack-speed boost theo quy tắc cadence chung; không boost Charged/Heavy hay recharge resource.
- **Consumption/stacking:** không tiêu thêm; một buff, refresh duration không cộng magnitude/duration.
- **CD/origin/Boss/Elite:** không CD riêng, kế thừa discharge CD; event buff không tạo damage/proc. Không ảnh hưởng địch/Boss timing.

## 5. Ice — consecutive hits → Frostbite → Shatter

### Core: Frostbite / Shatter

- **Trigger/target:** mỗi primary hit gây damage dương tăng một Frostbite stack trên target nếu trong cửa sổ consecutive config tính từ hit primary trước **trên chính target đó**. Đánh target khác/miss không xóa stack của target này; hết cửa sổ thì stack về 0 trước khi tính hit mới. Light/Heavy/Basic/Charged đều tính, một stack/action/target.
- **Effect:** stack tới threshold config thì Frostbite ready; primary Heavy/Charged tiếp theo gặp ready trong snapshot gây Shatter bonus damage config. Frostbite không freeze/slow; Shatter Core không AoE/CC.
- **Consumption/stacking:** cap bằng threshold; hit Light/Basic ở cap refresh cửa sổ, không thêm stack. Shatter tiêu toàn bộ stack và hit kích Shatter không cộng lại stack. Heavy/Charged đưa stack tới threshold phải chờ hit kế tiếp mới Shatter. Nếu primary đã giết target, consume rồi bỏ bonus damage, vẫn có thể mở Crystal Echo theo event Shatter.
- **CD/origin:** CD Shatter theo target; khi CD chưa hết thì giữ stack và không tiêu; stack có thể hết hạn bình thường. Bonus `legacySecondary`, không tính thành hit tiếp theo. Boss/Elite nhận stacks/bonus damage, armor mặc định; không reset bất kỳ attack clock nào.

### Branch: Brittle

- **Trigger/target:** Shatter thành công, tác động lên chính target đó nếu còn sống.
- **Effect:** Shatter bonus bỏ qua armor của Bulwark; sau đó mở armor-break window để **primary player damage** tiếp theo trong window bỏ qua hệ số giảm damage armor của Bulwark. Không phải damage amplification chung; không làm target không có armor nhận thêm multiplier. Interrupt windup một lần lúc Shatter nếu đủ điều kiện; không stun thêm theo từng hit trong window.
- **Consumption/stacking:** một armor-break window/target, refresh duration không stack; không tiêu `fracture` của Detonation Specialist. Shatter Core vẫn tiêu Frostbite như cũ.
- **CD/origin:** damage bypass là thuộc tính Shatter; interrupt có CD target/immunity Elite riêng, đánh trong immunity chỉ damage/armor break. Không đưa armor break/interrupt thành hit để proc tiếp. Boss miễn armor break/interrupt, nhận Shatter damage thường; Bulwark được mở guard tạm thời, không bị khóa recovery.

### Branch: Crystal Echo

- **Trigger/target:** mỗi event Shatter hợp lệ enqueue tối đa một ice projectile sau delay config ở vị trí nguồn lúc Shatter, hướng tới enemy sống gần nhất **khác nguồn** trong range tại lúc projectile được tạo; không có target thì bỏ, không giữ projectile cho sau.
- **Effect:** projectile thẳng, hướng khóa khi tạo, lifetime/range/speed/damage config; va enemy sống đầu tiên thì gây damage rồi biến mất, không homing/pierce, không retarget khi target cũ chết.
- **Consumption/stacking:** không tốn Charged ammo, không cộng projectile theo số Frostbite stack; không tạo thêm projectile từ kill. Không đụng Basic/Charged projectile cap dành cho input player.
- **CD/origin:** CD global Crystal Echo, cap active Legacy projectile; `legacySecondary`, không cộng Frostbite, không Shatter lần hai, không Rupture/charge points. Boss/Elite có thể là đích khác nguồn, damage theo armor, không CC.

## 6. Shadow — Perfect Dodge → mark → Ambush

### Core: mark / Ambush

- **Trigger/target:** Perfect Dodge tìm enemy sống trong range và cone quanh hướng ngắm player tại event; chọn gần player nhất, tie ID. Không đổi predicate Perfect Dodge, không cần xác định owner của hostile projectile. Không có target hợp lệ thì không cấp mark, không thay mark cũ.
- **Effect:** target được mark trong duration config; primary melee (Light hoặc Heavy) hit đúng target khi Ambush CD sẵn sàng phát **Ambush thành công** theo snapshot, kể cả melee lethal hit. Nếu target còn sống sau primary thì gây Ambush bonus damage config; nếu đã chết thì bỏ bonus damage, vẫn giữ Ambush event thành công. Không cần đứng sau lưng, không thêm crit/teleport/i-frame.
- **Consumption/stacking:** tối đa một mark toàn player, mark mới hợp lệ thay mark cũ; miss/Basic/Charged không tiêu. Melee hit hợp lệ consume mark và phát một Ambush event ID gắn root/action/target đúng một lần dù primary đã lethal; không chuyển Ambush sang enemy khác trong cùng cleave.
- **CD/origin:** CD global cấp mark và CD global Ambush; nếu Ambush CD chưa sẵn sàng thì melee giữ mark tới expiry. Bonus `legacySecondary`; không tính thêm melee hit/Aegis/Blood Pact. Boss/Elite mark hợp lệ, nhận bonus theo armor, không CC.

### Branch: Nightfall

- **Trigger/target:** **Ambush event thành công** (bao gồm lethal melee) đã consume mark và Nightfall CD sẵn sàng: xét trigger đúng một lần/Ambush event theo admission P1; nếu budget/cap cho phép thì bắt đầu Nightfall CD và enqueue follow-up vào đúng target ID đó với delay config và cùng root. Không kiểm tra “target còn sống” để từ chối Ambush event. Nếu budget/cap từ chối follow-up trước admission thì không bắt đầu Nightfall CD mới và không retry; Ambush vẫn thành công. Follow-up đã nhận rồi bị hủy do target chết/range vẫn giữ Nightfall CD.
- **Effect:** damage config tại target nếu còn sống và còn trong range tính từ player lúc resolve; không retarget, không teleport, không chase xuyên arena khi target chạy xa.
- **Consumption/stacking:** không tiêu thêm mark, tối đa một follow-up mỗi Ambush; target đã chết ngay bởi melee/Ambush hoặc chết/out-of-range trước resolve thì hủy damage, không đánh corpse/retarget, không refund mark/CD và không tạo duplicate kill/reward. Việc hủy follow-up không hủy thành công của Ambush.
- **CD/origin:** CD global Nightfall; delay simulation time, `legacySecondary`, không tạo mark/Ambush/Phantom/chuỗi Nightfall. Boss/Elite damage theo armor, không interrupt/hitstop/force.

### Branch: Veilstep

- **Trigger/target:** Perfect Dodge thành công cấp buff di chuyển cho player, dù không tìm được enemy để mark.
- **Effect:** tăng tốc **di chuyển thường** trong duration config, không kéo dài Dash, không đổi Dash speed/distance/i-frame/recharge, không thêm invulnerability.
- **Consumption/stacking:** không tiêu mark, một buff refresh duration không stack; nếu có movement buff khác dùng mức mạnh nhất và speed cap config.
- **CD/origin/Boss/Elite:** CD global Veilstep; buff không tạo hit/proc. Bounds/collision giữ nguyên; không đổi enemy/Boss chase/attack timing.

## 7. Wind — movement → Momentum → wind slash

### Core: Momentum / wind slash

- **Trigger/target:** tích Momentum theo quãng đường di chuyển thường thực tế sau clamp/collision, do input player trong simulation. Cần có enemy sống trong combat proximity config. Không tính Dash, knockback, teleport/reposition, camera, giữ joystick sát tường, pause/hitstop/Draft/transform hoặc bước đã kết thúc run.
- **Effect:** Momentum có cap và decay sau idle grace config. Khi Light thực sự resolve (qua windup), nếu Momentum >= threshold thì tiêu để phóng một wind slash theo aim của Light tại tick resolve; miss melee vẫn phóng slash. Cancel trước resolve không tiêu/phóng.
- **Consumption/stacking:** tiêu **toàn bộ** Momentum hiện có, damage/range slash là config cố định, không scale vô hạn theo số điểm tiêu. Một slash/Light action. Nếu CD slash chưa sẵn sàng, Light không tiêu Momentum.
- **CD/origin:** CD global slash; slash là projectile thẳng, pierce tối đa target cap, mỗi target một lần, lifetime/range/speed config; `legacySecondary`, không Rupture/charge points/Light combo proc. Boss/Elite nhận damage theo armor, Core không CC. Momentum reset khi world reset, không bank qua ticket.

### Branch: Tailwind

- **Trigger/target:** Core Light tiêu Momentum/phóng slash thành công; buff lên player, kể cả slash sau đó miss.
- **Effect:** temporary attack-speed boost, cùng phạm vi và hard cap cadence như Overclock.
- **Consumption/stacking:** không tiêu thêm Momentum, một buff refresh không cộng magnitude/duration.
- **CD/origin/Boss/Elite:** không CD riêng, kế thừa CD slash; buff không sinh hit/damage. Không đổi enemy/Boss timing hoặc action đang chạy.

### Branch: Cyclone

- **Trigger/target:** wind slash hit enemy và gây damage dương; không kích từ Light melee gốc hay enemy đi xuyên VFX sau khi projectile hết.
- **Effect:** knockback theo vector ra xa player tại tick hit, force config; không hút, không tạo vortex damage tick, không thêm interrupt/stagger/slow.
- **Consumption/stacking:** không tiêu thêm Momentum; mỗi target một lần/slash, không cộng force khi collider chồng.
- **CD/origin:** CD target Cyclone; knockback không phát hit mới/không tạo slash tiếp. Boss miễn dịch knockback; Bulwark resistance hiện hữu, clamp bounds; không reset recovery/cooldown/leap.

## 8. Đối chiếu xung đột và cách xử lý đề xuất

| Điểm baseline | Nguy cơ nếu dùng hook sẵn một cách máy móc | Contract cần duyệt |
| --- | --- | --- |
| DD-0001: 1 Sigil + tối đa 1 Branch, không cross-element | Test/build gán cả 12 Branch hoặc kết hợp Fire–Ice | Chỉ cùng Core + một Branch; không tạo cross-element reaction |
| DD-0001: “4 Mutation + 2 Curse”; runtime có pool 12 Mutation/8 Curse | Đọc nhầm thành chỉ giữ 4/2 loại content | Hiểu 4/2 là slot run, giữ nguyên toàn bộ pool và progression cũ |
| Heavy: 2 charge, recharge tuần tự `HEAVY.recharge` | Flow State reset toàn cooldown/đầy cả hai charge | Cộng tiến trình charge đang thiếu, tối đa trả một charge/event, không bank/overflow |
| Static Riposte đã dùng `build.staticCharge` cho Charged | Basic tiêu nhầm buff Mutation hoặc PD cấp hai lần cùng resource | Legacy charge riêng, Basic discharge riêng; Charged Static Riposte giữ nguyên |
| Detonation Specialist dùng `fracture` + bonus Heavy/Charged | Brittle ghi đè/tiêu fracture, Shatter lấy bonus hai lần | State độc lập; primary tiêu fracture như cũ, Legacy Shatter không tiêu/copy |
| `hitEnemy` dựa vào sound để heal, hitstop, interrupt và proc kill | Legacy gắn nhãn `blast` gây interrupt/Death Echo loop | Origin/root rõ; Legacy kill giữ on-kill theo P1, dedup death/proc và bounded offspring; không mượn sound làm quyền on-hit/interrupt |
| `fire()` friendly mặc định gán ranged damage/Glass Soul/counters | Crystal Echo/wind slash trở thành Basic/Charged, cấp ammo | Secondary projectile origin/damage riêng; không gọi đường primary với flag giả |
| `resolveExplosions()` luôn xét Detonate targets | Furnace/Shatter vô tình tiêu Rupture và lan Curse | AoE Legacy không trực tiếp tham gia resolver relay; on-kill Death Echo hợp lệ vẫn có thể nối resolver cũ với cùng root/guard; không bỏ backlog Rupture |
| Boss có combo/transform freeze; Bulwark armor và resistance | Slow/interrupt refresh khóa Boss/Elite | Boss immunity tuyệt đối với Legacy CC; Elite strongest slow + interrupt immunity window |
| Light có windup/duration và pose active riêng | Haste co cả windup/active làm mất readability, Heavy bị hủy sớm | Haste chỉ recovery Light và interval Basic tương lai; hard cap + min recovery/interval |
| Kinetic Battery đã đo movement gần enemy | Momentum ghi đè state hoặc farm khi pause/Dash | Bộ đo riêng theo displacement thường có input/proximity; không sửa Kinetic Battery |
| DD-0001 chỉ duyệt tên/hướng, số là TBD | Draft bị xem là duyệt damage/DPS/winrate hoặc unlock | Contract còn Proposed; tất cả số tuning chưa duyệt; economy ngoài scope |

Các hướng user đề xuất phù hợp danh tính Core/Branch DD-0001. Chưa có lý do thay run loop/unlock/DD-0001. Revision ngày2026-10-27 thay P1 isolation cũ bằng proc synergy có budget, xác nhận lethal Ambush và các chi tiết Ice/Wind/Water/Wildfire user yêu cầu. Contract tổng thể vẫn chờ duyệt; thông số và các lựa chọn còn lại không phải chi tiết code tự quyết.

## 9. Tunable config và ranh giới approval

Không chốt con số damage/duration/cooldown/range trong draft. “Một instance”, “một lần/action”, “không revisit”, “Arc Relay thêm 1 jump” là quy tắc cơ chế đề xuất, không phải balance đã đo.

| Nhóm | Các tham số phải tập trung trong config khi được giao implementation |
| --- | --- |
| Shared safety | root proc budget/depth cap (Legacy causal tree), secondary events/tick, queue cap, AoE/chain target cap, active Legacy projectile cap, Elite interrupt immunity, player speed/attack-speed hard cap, min Light recovery/min Basic interval |
| Fire | Ignite damage/tick interval/duration; Wildfire damage/duration/radius/target cap/CD; Furnace damage/radius/CD |
| Water | Soaked duration/slow multiplier; Undertow force/target CD; Flow State recharge refund/global CD |
| Lightning | charge expiry/grant CD/discharge CD; chain damage/base jumps/jump range/delay; Overclock bonus/duration |
| Ice | Frostbite threshold/consecutive window; Shatter damage/target CD; Brittle armor-break duration/interrupt CD; Crystal Echo damage/delay/speed/range/lifetime/CD |
| Shadow | mark range/cone/duration/grant CD; Ambush damage/CD; Nightfall damage/delay/range/CD; Veilstep speed/duration/CD |
| Wind | Momentum gain/distance, cap/threshold/proximity/idle grace/decay; slash damage/speed/range/lifetime/pierce cap/CD; Tailwind bonus/duration; Cyclone force/target CD |

Validate finite/nonnegative, threshold/cap hữu hạn, tick interval/CD chống spam > 0 nơi có thể lặp, duration và minimum timing hợp lệ. Các cap phải tương thích (ví dụ số target đủ chứa Core chain + Arc Relay). Không expose damage balance như progression persistent stat. Không tự coi các giá trị khởi tạo sau này là approved balance; phải có test và user playtest đúng Q9A.

## 10. Rà soát P1–P8 và phần chờ duyệt

Các phương án dưới đã được viết cụ thể trong contract để có thể duyệt/đổi trực tiếp, không để implementation tự đoán:

| ID | Phương án đang Proposed | Điểm cần xác nhận/đổi |
| --- | --- | --- |
| P1 — Proc synergy | Theo revision user: Legacy direct/DoT/chain/secondary kill giữ on-kill hợp lệ; root ID/origin/death dedup + bounded budget/depth; giữ Surge/Volatile/Rupture | Không còn đề xuất cấm on-kill Legacy. Số budget/depth TBD; kiểm điều kiện proc cũ như marked/heal/CD/cap, không biến mọi secondary thành primary |
| P2 — Fire | Wildfire một thế hệ V1 theo yêu cầu, có thể tuning qua playtest; terminal kill vẫn on-kill; Furnace Heavy tiêu Ignite, một blast/action | Chờ duyệt policy Furnace consume và refresh Ignite; không tự đổi generation trong Q9A |
| P3 — Water | Theo yêu cầu: primary hit trên Soaked có sẵn, CD target, giữ Soaked; Boss miễn knockback. Flow State tối đa một charge | Chờ duyệt hướng force và refund không bank; Heavy đầu tiên chỉ apply Soaked |
| P4 — Lightning | Charge riêng Static Riposte; tiêu ở Basic hit, chain/Arc Relay không revisit; Overclock khi discharge | Chờ duyệt thời điểm consume/buff; on-kill chain vẫn theo P1, không tự thêm jump qua kill |
| P5 — Ice | Theo yêu cầu: consecutive theo target/time window, miss/đổi target không xóa. Shatter xét ready trước hit; Brittle guard break/interrupt giới hạn | Chờ duyệt Shatter ở hit kế tiếp và Brittle policy; stack/threshold/CD tuning TBD |
| P6 — Shadow | Theo yêu cầu: melee lethal marked hit vẫn Ambush thành công/consume một lần; Nightfall nhận Ambush event nhưng hủy corpse damage, không retarget/duplicate reward | Chờ duyệt mark selection trong aim cone và Veilstep trên Perfect Dodge; giữ CD/range/origin/Boss–Elite rules |
| P7 — Wind | Theo yêu cầu: Light miss vẫn slash nếu đủ Momentum, chỉ consume khi resolve và CD sẵn sàng; walk thực gần enemy, Cyclone trên slash | Chờ duyệt walk-only/tiêu toàn bộ và pierce policy; không farm pause/cancel, kill slash giữ P1 |
| P8 — Cadence/CC và platform parity | Haste chỉ Light recovery/Basic interval; Boss miễn Legacy CC, Elite immunity; cùng gameplay rules trên touch/keyboard–mouse theo GAME_BRIEF | Chờ duyệt phạm vi haste và chi tiết Elite CC; platform có acceptance riêng, không tự suy desktop/mobile PASS |

Có thể duyệt cả contract hoặc trả lời theo P1–P8. Approval thiết kế sau này cần invocation `$design-decision` kèm quote/version draft cụ thể và trạng thái muốn ghi; agent phải đọc lại DDR để cấp ID thật. Nếu append một entry Proposed trước, đổi thành Approved sau phải tạo ID kế tiếp + Supersedes entry Proposed đó, không sửa trạng thái entry cũ. Dù đã duyệt thiết kế, chỉ mở lại Q9A khi user giao tiếp.

## 11. Mobile-first + Desktop-equivalent

[GAME_BRIEF — tiêu chuẩn chung và acceptance từng nền tảng](../../GAME_BRIEF.md#mobile-first--desktop-equivalent--tiêu-chuẩn-chung) áp dụng toàn game, không chỉ Legacy. Đây là yêu cầu user ngày2026-10-27; không phải approval UI mới hoặc lệnh đổi runtime/art.

- Cùng damage, RNG, cooldown, i-frame, proc budget, enemy AI và Boss timing; Legacy không có bản dễ cho touch hoặc bản khó cho keyboard/mouse. Khác biệt nằm ở thao tác nhập/aim assistance và layout phù hợp, không ở luật.
- Target selection Legacy dùng cùng range/cone/distance/tie-break theo hướng aim đầu vào. Touch auto-aim/manual drag và desktop manual mouse tạo hướng khác nhau theo input contract đã duyệt; không ép cùng target khi hướng khác, không nới cone/range/Perfect Dodge window riêng cho touch.
- Aim assistance/accessibility không tự chọn build, khi nào tiêu Momentum/Static Charge, target chiến thuật ngoài aim contract, thời điểm Heavy/Charged/Dash hoặc trigger Perfect Dodge. Camera/VFX/HUD không che telegraph/target; không đổi geometry/hitbox/range để bù layout.
- Acceptance tương lai ghi riêng touch và keyboard/mouse: Shadow mark/manual override, Lightning Basic-vs-Charged consumption, Heavy release, Wind miss/resolve/cancel, multi-target Frostbite, Soaked cooldown, các chain dày, Boss phase/transform. Mỗi nền tảng cần evidence input/response, target selection, responsiveness/camera/HUD/readability và performance trong cảnh crowd tương ứng; game boot thành công không là desktop acceptance. Không suy device/iOS/Safari/FPS từ emulation hoặc build.

## 12. Kiểm chứng tài liệu / acceptance tương lai

Lượt này chỉ kiểm đủ 6 Core/12 Branch, mỗi mục có trigger/target/effect/consumption/stacking/CD/origin/Boss–Elite, links, diff và DDR không đổi. Không chạy tests/build/deploy vì chỉ Markdown.

Khi user giao implementation, focused tests cần bao phủ primary vs secondary, thứ tự snapshot/consume/apply, CD/expiry, multi-hit/multi-target/cap, Core + từng Branch, đầy/thiếu resource, target chết/miss/cancel, direct/DoT/chain/secondary kill với Blood Reclaimer/Hunted Vessel/Death Echo, root budget qua delay/freeze, một kill/event và Volatile death bắt buộc, Rupture backlog không drop; lethal marked melee vẫn Ambush/Nightfall event nhưng không corpse/retarget/reward lần hai; cặp Mutation/Curse liên quan trong bảng audit; freeze/Momentum/haste/Boss combo timing, giữ Rupture/Detonate/Draft/input. Đây là tiêu chí kiểm tương lai, không phải kết quả đã PASS hay lệnh mở Q9A.
