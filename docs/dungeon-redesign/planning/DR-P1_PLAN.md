# DR-P1 — Planning world/camera/minimap

Revision: **2 · 2026-11-15 · APPROVED — PLANNING ONLY**. Milestone **PLANNING**, chưa SPEC_READY/LOCKED.
Task được giao: [DR-P1-PLAN-01](tickets/DR-P1-PLAN-01.md). Spec một nguồn: [S1 / DR-P1_WORLD rev2](specs/DR-P1_WORLD.md). Approval: user “y”,2026-11-15, hội thoại hiện tại không permalink; duyệt hồ sơ planning/S1 rev2, không target/global lock hoặc child execution.

**Binding trước ghi nhận approval:** plan SHA256 `E2EF3900B1BD3C534D912E9C013B0A87D296BB988A23D69F4C9FACFFF13DC561`; S1 `638860443625EFE4CF7DD97B6C278FF95B97C8FA8884B4C7309AFAC2445CC146`; PLAN-01 `198AC41178101D2EFE8820FEC5A03325D0224D5F4F802DBE8B999343861D44BB`. Chỉ cập nhật status/approval/next action; nội dung planning revision2 giữ nguyên. Nhãn PROPOSED trong snapshot giữ ý nghĩa proposal planning; mọi mục OPEN/target thiếu vẫn chưa đóng, chưa SPEC_READY.

## 1. Goal, scope và acceptance lượt này

User ngày2026-11-15, hội thoại hiện tại không permalink: “Mở planning DR-P1. Audit source/assets liên quan, hoàn thiện specs và tạo các ticket chi tiết cần thiết cho code, concept, art và verify. Nêu dependencies, acceptance và phần còn thiếu. Chưa implement; bàn giao để t review rồi dừng.”

Một outcome: hồ sơ P1 có source audit thật, candidate K-W đủ cụ thể để planning consumer, danh sách công việc có dependencies/AC/evidence và gap có owner. Giữ R01–R12 V1/C09 và [P0 rev1 approved planning](DR-P0_PLAN.md), không hỏi lại baseline. Các quyết định chi tiết mới trong S1 là PROPOSED để review.

- IN: world units/seed/layout/route budgets/collision/navigation/LOS, camera transforms/bounds, exploration/minimap, biome inventory/target contracts, tickets và verify scenarios đúng P1.
- OUT: CODE/ART execution, tạo ảnh/concept/source, chọn combat slice P2, skill/AI/Boss/economy/tuning, UI toàn game, DDR/Bible/approval lịch sử, main/production/save, build/test game/deploy/commit/push/shutdown. Không chạy sibling planning P3.
- AC bàn giao: mỗi requirement P1 map tới spec+tickets; source paths có evidence; seed/route/queries/gate/camera/fog/error/lifecycle cụ thể; art có source/target/rights plan; contract deps tách artifact deps không vòng; missing không giấu; handoff một next action review.
- AC milestone tương lai giữ R12: một dungeon seed cố định đúng route/collision/camera/minimap, target visual đúng scale được user duyệt; technical/visual/playtest riêng. **Chưa đạt runtime/target**, không dùng docs PASS làm P1 ACCEPTED.

## 2. Audit source/assets

Audit read-only trên `codex/dungeon-skill-rework`, HEAD `0ee02af70ab530ad81c0ff84069b7e4fbf68fd9a`, 2026-11-15. Source dưới đã đọc/rg xác nhận; proposed modules ở §3 chưa tồn tại. Working tree đã có tài liệu P0 và package-lock diff trước task, không reset/stage.

| Path/call site đã audit | Hiện trạng / tác động planning |
| --- | --- |
| `src/game/movement.ts:1–20` · ARENA/movePlayer | Arena1600×1000/inset64, circle Player radius16; normalize vector rồi clamp chữ nhật. Chưa world wall/collision/navigation. Cần query theo world definition; không sửa constant global cho production |
| `src/game/combat.ts:60` · clampPosition; step/move/dash/knockback; stepProjectiles | Clamp actor nhiều call sites, overlap bodies; projectile có swept segment→circle nhưng chưa wall hit. P1 định query/placement, P3/P2/P4 chịu action/enemy collision integration; không coi sửa movePlayer là đã phủ hết walls |
| `src/game/ArenaScene.ts:172,265,375,455` · camera/resize/updateDesktopAim/drawArena | Follow body lerp0.12/frame; camera bounds arena, zoom minimum fit arena; floor1Image tint/depth0. Pointer dùng getWorldPoint, shake render matrix có restore. Rework cần bỏ fit-whole-arena trong entry riêng, follow theo time, backdrop, một transform không shake; không copy toàn scene thành engine mới |
| `src/game/autoAim.ts` / `touchAim.ts` | Desktop ưu tiên Rupture/role rồi nearest; touch nearest sống. Không range/LOS/camera/sticky. S1 cấp geometry filters; K-A P3 thay selector đúng R01, không port priority cũ |
| `src/game/run.ts` · RunDirector.start/step | Edge spawn/wave cap/adaptive pressure/deadline300s, milestones theo timer/kill; không dungeon packs/route/progress độc lập. P2/P5 phải orchestration rework; không tái dùng deadline để mở Boss P1 |
| `src/game/Draft.ts:5` · DraftRandom | Xorshift32 có state, gắn draft catalog; chỉ dùng thuật toán tham khảo cho stream world, không coupling RNG vào offer/render |
| `src/ui/TouchControls.ts` · reset/sample/bind; `ArenaScene.setPhase/resize` | Contacts CSS/angle, release/cancel và input flush tồn tại. P1 camera bridge phải giữ semantics; action mapping ba skill thuộc P3/P6 |
| `src/style.css:320,352,358,365,480` | Canvas trừ lanes HUD/controls; touch landscape side172/164, portrait controls216 override cũ284. Bible có số lịch sử; target mới phải đo actual playRect, không dùng full window/chép số cũ |
| `src/main.ts` · profile/buildTrial/Phaser bootstrap/UI; `src/game/progression.ts:7,58,73` | Current profile/pending keys và memory-only playtest path có thật; rework entry không được đọc/ghi hai production keys. P5 sở hữu namespace/entry transaction, P6 shell; S1 không cấp migration |
| `src/i18n.ts:1,411,819` | Hiện cả vi/en + setLocale/t trong một file, chưa cây `src/i18n/`. P1 keys phải đi qua API thật; không bịa file dictionaries đang có |
| `src/game/ActorArt.ts` / `PlayerVisual.ts` | Body40worldpx, container/pose lấy simulation; circle khác sprite. Giữ actor baseline, không scale actor theo dungeon collider |
| `tests/routes.test.mjs` / tests auto-aim/touch-aim/run/combat | “routes” hiện là build draft routes, **không** dungeon connectivity coverage. Node tests focused có sẵn; package scripts compile explicit file list, CODE cần thêm module thực dùng khi được giao; không dựng QA framework |

Repository search `minimap/lineOfSight/walkable/pathfind/navmesh/fog/wall` trong `src` chưa có subsystem world tương ứng (kết quả comment wall-clock không phải wall geometry). Không có environment module kit trong `public/assets`; chỉ floor và Arrival edge, actors/UI/VFX/music hiện hành.

### Baseline image/source đã mở và binding

Đã đọc game-art/Bible/[reference index](../../art-reference/README.md), mở trực tiếp 4ảnh dưới. Đây là audit baseline, **không review/tạo artwork mới**, không cần duyệt lại baseline.

| Ref ID / path | Revision / quyền / binding |
| --- | --- |
| DR-BL-ENV · [broken-seal-v2.webp](../../../public/assets/arena/broken-seal-v2.webp) | Q7A accepted floor; SHA256 `71B8D5B2B0850D40CD7C39A795A8CAEE129E4B14DC7F08F20093D17C18FEA70A`;1600×1000. Mood/material, không là module/wall kit. Source/prompt/quyền [manifest](../../q7a/runtime-asset.json); generated output terms, không CC0/độc quyền |
| DR-BL-M390 · [after-crowd-390](../../q7c/runtime/after-crowd-390.png) | Q7C accepted screenshot390×844, fixture33enemies; hash `1B6B1A91C04363BE680AB087B9A08C0788823D9FFABDA169DBEA1CBE6713DE92`. Combat hierarchy/scale/reference HUD; không new layout/FPS proof |
| DR-BL-D1440 · [after-crowd-1440](../../q7c/runtime/after-crowd-1440.png) | File thực1440×900, Q7C fixture, hash `D53E1E3C749C2FC05C4E44E390D63BBBCA57C60A2432B8A4FBB8642BCB50923E`. Không gọi screenshot này1440×1000 R12; concept sau phải có target viewport đúng |
| DR-BL-G390 · [after-grayscale-390](../../q7c/runtime/after-grayscale-390.png) | Q7C same fixture grayscale, hash `61608A41B87AB91688035DE9BCA1995A212E3B95BA1761DB61309A564190CD7A`; hierarchy, không wall/target mới |
| Reuse actors / UI provenance | [Q7C manifest](../../q7c/runtime-assets.json), [Q7B manifest](../../q7b/runtime-assets.json), [ActorArt](../../../src/game/ActorArt.ts). Runtime actors atlas hash `E5C40AC0851BE3F1147719C79EED3E574A6664510406A5DE7EB7CB83F4542A71`; metadata hash `473B58F57757F00E6A9A0C8A35DB0A902096815A57A5807C1A09F1C742F1554C`. Chưa mở từng actor source lượt này vì không tạo/review actor art; concept owner phải mở đúng ảnh làm ImageGen input nếu dùng |

Existing Arrival edge/VFX không thành wall/gate art; SVG frame/glyph có provenance project, dùng lại theo approved scope mới. Candidate environment10families/gate4states và targets ở S1 §9. Source pixel sizes/anchors/occlusion sheet phải do concept chốt; không bịa export sẵn.

### Snapshot source để audit lại khi mở execution

SHA256: movement `4EAE84A6BFEF01F2610D3606D97D6AEA3B98BFD974B53442488E96E7B5839DE2`; ArenaScene `36631EC8C09F9D2DDBBD6ABF3E08281C0368069DA3FB9DEF9ED3FE5A92DE9C58`; combat `86E49C29B6434DB1E07EE9F78FCB7D3732F78CA254D6675E04408572090402B8`; run `3B3FCB61203BEDB05334E9A8D496F6C7539681FF62E348DA62FC038FB6ADC546`. Không thay source để khớp spec; source khác hash khi execution phải audit delta đúng scope.

## 3. S1 được bổ sung và giới hạn readiness

- §2–4: schema identity/world/region/anchors/session/budgets, seed streams/version/retry/errors; constructive world và fixture808 có đường chính193D đến cửa/204D tới tâm Boss, loop optional và envelope. **Một topology×8đối xứng** chỉ là fixture world P1. Contract release giữ ba biến thể kiến trúc cùng biome và random đường/phân bố bầy R06; thuật toán/target còn OPEN theo S1§3/9, không coi đối xứng là đủ đa dạng.
- §5–6: swept collision/sliding/pathfinding/LOS/wall-first, main budgets riêng kill/elite, gate request/accept không refill/bank; P2 giữ composition/kill owner.
- §7–8: playRect CSS↔world, follow0.08s/aim offset/7D ring guard/ngoài biên, minimap fog/state/lifecycle/reload/vi-en; P6 chốt lane cuối.
- §9–11: inventory source/target/binding, consumer handshakes, scenarios với expected failures và actual evidence tương lai.

**Proposed file boundaries sau lock**, chưa tạo runtime file: world definition/generation/config nhỏ trong `src/game/` và `src/game/config/`; geometry query module riêng cùng navigation thực sự cần; camera bridge tách input transform khỏi render; minimap view trong `src/ui/`; renderer environment nhận placements readonly. Chỉ đặt tên/file khi execution re-audit, không khóa một framework/class giả. Existing touch/actor art/i18n là API đã audit; state ở S1 là proposal mới. P1 không sửa toàn combat.ts/main.ts để tiện tích hợp.

Một P1 world fixture sau lock có entry memory-only, geometry/render/camera/minimap và di chuyển thật; không có combat/draft/rewards giả. Đây là outcome P1 R12, **không được làm trước global lock dưới nhãn prototype**. Dùng bridge scene hiện có khi hợp lý; không tạo preview app mới. P2 tích hợp combat thực riêng; Dash thật cần core K-A của P3, không bật CombatWorld legacy đầy đủ để lách catalog mới. Production default tiếp tục giữ ngoài entry rework cho tới task tích hợp được giao.

## 4. Atlas/reference audit và protocol đóng G01

Đã truy cập lại ngày2026-11-15: [trang GGG Atlas of Worlds](https://www.pathofexile.com/atlasofworlds) hỗ trợ ý tưởng cấu trúc map/Boss/modifier; không có thống kê mật độ theo gameplay sample. Trang trỏ trailer [YouTube embed 92SpXUJEIVs](https://www.youtube.com/embed/92SpXUJEIVs?rel=0&showinfo=0), công cụ fetch báo **Cache miss**. Không đã xem/đếm clip; không dùng trailer montage thay mapping liên tục. [PoEDB Maps](https://poedb.tw/us/Maps) mở được nhưng là nguồn phụ, không dùng làm footage hoặc chứng cứ số bầy/scale; không thêm số từ trang vào S1. Không lấy asset PoE.

**DR-P1-SPEC-01** đóng gap bằng một memo reference có thật, không chỉ tiếp tục search:

1. Chọn PoE1 continuous mapping một đoạn ≥90s có entry→di chuyển→ít nhất6cluster/pocket transitions; nếu clip cắt/thiếu sample thì chọn clip khác hoặc ghi sample không đủ. Nguồn creator/official có quyền xem công khai; lưu URL/title/uploader/date/access date, patch/league/map/tier/mods/build/speed setup nếu thấy, không thấy ghi UNKNOWN. Không khẳng định official trailer là representative map.
2. Pin đúng start/end timestamps, liệt kê từng khoảng traverse/combat/cut/occlusion. Đếm pack/cluster/rare quan sát **chỉ khi phân biệt được**, kèm lower bound/UNKNOWN khi bị VFX che. Không suy tất cả enemies toàn map từ một frame.
3. Ghi spacing theo screen fraction/player body scale quan sát; **không quy đổi pixel video sang D/world px** khi thiếu camera calibration. Ghi clear cadence là elapsed time của sample/build đó, không áp timer game mình.
4. Bảng observed→R06 candidate→inference/limitation: cluster2–3, liên kết pocket/chuyển đoạn, kéo bầy, rarity visibility; tách pack count/escorts/active visible. Báo mâu thuẫn nếu có, đề xuất delta để review, không tự tune R06.
5. P2 nhận memo và chốt actual placement/roster/density spec; sau implementation playtest cảm giác mới có evidence, **không đòi runtime PASS trước lock**. Trước lock phải có comparison/spec/ref đầy đủ; human feel vẫn checkpoint execution.

Hiện **G01 OPEN — chưa có footage đủ điều kiện/timestamps/counts**. Ticket SPEC-01 chưa được giao; tool fetch hạn chế không chặn việc bàn giao planning độc lập hôm nay.

## 5. Task inventory và dependencies

Tất cả revision2. Chỉ PLAN-01 được giao ở lượt này; các ticket còn lại **PLANNED / execution assignment NONE**, không READY. KIND là loại việc cần làm, không quyền làm. Mọi CODE/ART cần global lock+spec/ref+session assignment; CONCEPT/SPEC design-only có thể giao trước lock.

| Ticket | Một outcome | Spec dependency | Artifact/task dependency khi execution |
| --- | --- | --- | --- |
| [PLAN-01](tickets/DR-P1-PLAN-01.md) | Hồ sơ P1 review | R06/R11/R12/P0 | Source audit; lượt này |
| [SPEC-01](tickets/DR-P1-SPEC-01.md) | Atlas comparison/density closure | S1 §1/3/4 + R06 | Footage phù hợp; K-E density closure sau P2 |
| [CONCEPT-01](tickets/DR-P1-CONCEPT-01.md) | Biome/module+gate target | S1 §2/4/5/9 | Baseline refs; camera geometry candidate §7; không chờ renderer mới |
| [CONCEPT-02](tickets/DR-P1-CONCEPT-02.md) | Camera/playRect target | S1 §7 + R12 | Baseline runtime captures; K-U lane closure trước lock, không chờ P6 code |
| [CONCEPT-03](tickets/DR-P1-CONCEPT-03.md) | Minimap target | S1 §8 | Camera slot candidate CONCEPT-02; K-U closure; baseline refs |
| [ART-01](tickets/DR-P1-ART-01.md) | Environment source/export kit | Approved S1 §9 / ENV-T01 | CONCEPT-01 approved, lock; source riêng rồi export, không crop |
| [CODE-01](tickets/DR-P1-CODE-01.md) | Deterministic world definition | S1 §2–4/6 + K-E annotation contract | Lock; SPEC-01 closure; geometry không cần production art |
| [CODE-02](tickets/DR-P1-CODE-02.md) | Collision/navigation/LOS queries | S1 §5 | CODE-01 definition; lock |
| [CODE-03](tickets/DR-P1-CODE-03.md) | Camera/input transform bridge | S1 §7 / K-U playRect | CODE-01, CONCEPT-02 approved; lock |
| [CODE-04](tickets/DR-P1-CODE-04.md) | Exploration/gate world state | S1 §6/8 + K-E/K-B/K-X event contracts | CODE-01/02, lock; geometry fixture có script events **ghi rõ injected**, actual combat verify chờ P2/P4 |
| [CODE-05](tickets/DR-P1-CODE-05.md) | Minimap view trong lane | S1 §8 / K-U | CODE-03/04, CONCEPT-03 approved; lock |
| [CODE-06](tickets/DR-P1-CODE-06.md) | Static environment renderer | S1 §9 / approved ENV-T01 | CODE-01/02/03 + ART-01; lock |
| [CODE-07](tickets/DR-P1-CODE-07.md) | World entry/session bridge playable | S1 §3/5–8/10 | CODE-01…06, K-X/K-U contracts; lock. Không đòi full expedition implementation để có world fixture |
| [VERIFY-01](tickets/DR-P1-VERIFY-01.md) | Seed/route/query/entry technical report | S1 §11 W01–06/08 | CODE-07; K-E actual pack annotation; action cases chờ P3, Boss boundary thật chờ P2/P4 |
| [VERIFY-02](tickets/DR-P1-VERIFY-02.md) | Actual-vs-target/input review package | S1 §11 W07–09 / R12 | CODE-07, approved3targets; crowd/live combat/device phần giao thoa từ P2/P3/P4/P6 |

**Contract DAG:** baseline → S1/K-W candidate → K-A(P3) → K-E(P2) → K-B(P4) → K-X(P5) → K-U(P6). Closure Atlas/room/camera/HUD trở lại **revisions/targets**, không bắt P2/P6 implement trước khi viết P1 spec. Chưa khóa thì CODE/ART DAG chưa chạy. Sau lock: CODE-01→02/03→04→05; ART-01+01/02/03→06; 01…06→07→VERIFY. Không cạnh từ actual verify về quyền bắt đầu CODE, không dùng thiếu runtime trước code làm vòng gate.

## 6. Coverage P1 → spec/ticket/evidence

`Cxx` là coverage P0, không log Cxx. Mỗi hàng có evidence **cần có**, hiện NONE trừ docs audit ở §2/9.

| Requirement / AC | S1 rev2 section | Tickets | Evidence / gap |
| --- | --- | --- | --- |
| C11 R06 Atlas layout/density/spacing + random đường/phân bố bầy | §1/3/4; plan§4 | SPEC-01, CODE-01, VERIFY-01/02; P2 final density | Observation/comparison có timestamp; release graph khác sau loại đối xứng và placement seed ledger; G1/G2 còn OPEN |
| C12 R06 seed/main/optional/budgets | §2–4/6 | CODE-01/02/04, VERIFY-01; P2 kill owner | Same-seed digest, connectivity/weights valid+invalid, no optional requirement; G2 |
| C13 R06/R11 camera/fog/Boss discovery | §6–8 | CONCEPT-02/03, CODE-03/04/05/07, VERIFY-02 | Target+actual6viewports/4góc, discover/locked/open riêng; G3/G4 |
| C15 P2 navigation/LOS/home/leash input | §5/10 | CODE-02, VERIFY-01; P2 AI consumer | Wall/corner/NO_PATH/return-home cases; AI timing do P2 |
| C17–19 P4 room/gate/adds boundary | §4–6/10 | CODE-02/04/07, VERIFY-01; P4 patterns/adds | Boundary2chiều, room envelope/escape compatibility; G5 |
| C23–24 P5 seed/reload/isolation | §2/3/8/10 | CODE-07, VERIFY-01; P5 persistence | Entry rebuild/error, fog reset/no production key writes, no bank/refill ngoài owner; G6 |
| C28 R06/R11 biome/ba biến thể kiến trúc/new sources | §3/9 | CONCEPT-01, ART-01, CODE-01/06, VERIFY-02 | Mapping variant→family/source/state, target đủ3biến thể trong cùng bộ art, export/registration/crowd/grayscale; G3 OPEN |
| C29 minimap/HUD content giao thoa | §7–9 | CONCEPT-02/03, CODE-05, VERIFY-02; P6 shell | Lane/state/legend2locale, không overlay gameplay; G4 |
| C30 R12 input/viewport/parity | §5/7/11 | CODE-02/03/07, VERIFY-01/02; P3 input/P6 devices | Roundtrip, fresh-press, move/aim/cancel, sixviewport+safearea; G4/G7 |
| C31 R12 crowd/readability/performance | §7/9/11 | CONCEPT-01/02/03, VERIFY-02; P2/P6 combat measurements | Crowd composited chỉ visual, runtime/device measurements riêng; G7 |
| C32 R12 amended planning/lock | §1/10/11 + plan này | PLAN-01 → P0-VERIFY-01 khi được giao | Tickets/coverage/manifest có hash+approval thật, không partial lock |

## 7. Missing/closure register

| Gap P1 / P0 gap | Đã có / còn thiếu cụ thể | Owner/ticket / điều kiện đóng |
| --- | --- | --- |
| G1 / G01 | Protocol + URL primary checked; chưa continuous footage/sample metadata/timestamp/count/comparison | SPEC-01→P2 density; memo có observed/inferred/unknown, giải delta với R06 trước lock |
| G2 / G02 | Candidate geometry/RNG/query/budgets, chưa review spec; chưa K-E member/collider/cluster spawn envelopes/placement contract. Phải chứng minh density cao fit pocket và khoảng trống giữa **biên** cụm R06, không dùng center spacing thay thế | P2 cấp member IDs/role-rarity radii/offsets/envelopes/D06 rounding/placement order; P1 đối chiếu tọa độ+margin/gap giữa biên/route budgets theo S1§4 trước lock. Release random-route algorithm do P1 thiết kế còn OPEN; route193D và worked count45/70 chưa chứng minh fit, không tự giảm density/nới room |
| G3 / G07 | Baseline images đã mở;10families/gate4states; thiếu mapping/targets ba biến thể kiến trúc R06, **không target/ảnh mới** và chưa pixel/anchor/occlusion sheet | CONCEPT-01/ART-01; target ENV-T01 approved trước lock/production; nguồn/quyền đầy đủ |
| G4 / G07–08 | Camera formula/minimap states candidate; chưa full viewport/mockup/slot/legend targets/K-U lanes | CONCEPT-02/03 + P6 contract closure, approved CAMERA/MINIMAP targets; không tự sửa HUD để tạo ảnh |
| G5 / G05 | Room22D + gate/add safe mask candidate; chưa legal escape envelope toàn Boss+mods | P4→P5 pattern/mod legality, đối chiếu S1 trước lock; nếu thiếu chỗ trình delta, không tự nerf/tăng phòng |
| G6 / G06 | Identity/rebuild/error handshakes; chưa P5 node snapshot/persistence transaction schema | P5 K-X nhận S1, chốt version/retry/entry/error/reload semantics; no production key reuse |
| G7 / G08 | P1 expected scenarios/viewport có; chưa device IDs/browser/method ở P6, chưa measurements/runtime | P6 chọn protocol/device trước lock; actual FPS/latency/input/human feel sau code, không đánh PASS sớm |
| G8 / G09 | 15tickets/spec/coverage rev2 tồn tại; chưa review/approval/closure toàn P1–P6 | P0-VERIFY-01 sau đủ inputs; exact hashes/quotes/manifest revision cho user lock |

Không yêu cầu user duyệt lại R01–R12; review lần này dành cho **chi tiết S1/candidate topology/camera/minimap và phân rã tickets**. Không hỏi thông số đã chốt. Missing targets/footage/consumer specs là việc design-only tiếp theo cần được user giao, không tự mở từ danh sách này.

Nghiệm thu riêng world P1 theo bảng S1§11: seed/query/feasibility/budgets, camera/minimap/renderer/input/lifecycle và visual/user world approval là bắt buộc. Combat/action/full-save/full-run/device measurements được chuyển owner P2–P6 cùng evidence yêu cầu; không dùng PARTIAL của tích hợp để bỏ qua core P1. Contract release đa dạng vẫn phải hoàn thiện trước global lock, không được đóng từ fixture P1.

## 8. Readiness/manifest

S1 rev2 và tất cả15tickets revision2 có thật (các ticket đã đủ chỉ đổi binding S1/revision); paths/hashes ở [SPEC_LOCK](SPEC_LOCK.md) chỉ **candidate inventory**, không là binding approved. DR-LOCK-01 revision0 không đổi, NOT_LOCKED. P0 accepted plan giữ nguyên, P1 PLANNING, P2–P6 chưa mở. Không checklist global lock nào tự đóng chỉ nhờ một P1 plan.

## 9. Validation lượt planning

**Delta rev2 theo user:** chỉ sửa5gap: release diversity/fixture boundary; feasibility inputs+count example; giữ nguyên nội dung SPEC-01/CONCEPT-02/03 đã đủ output/AC; PROPOSED rounding/retry snapshots; bảng P1 core vs integration và VERIFY. Không child execution/artifact mới, các gaps evidence/targets vẫn OPEN. Revision/hash candidate cập nhật đúng artifact đổi; checks rev2 là diff/link/coverage/dependency consistency, không xác nhận feasibility/Atlas/target đã đạt.


PASS: audit source/assets đúng scope; đã mở4ảnh baseline; walkthrough route193/204D và hai ngân sách success/failure; coverage/ticket/schema/dependency audit, local Markdown links và diff/scope. Chi tiết validation cuối cùng tại PLAN-01. Các file proposed/evidence tương lai luôn ghi chưa tồn tại, không giả approved target.

Không game build/typecheck/tests, không code/artwork/asset production/renderer capture mới/deploy. Technical docs PASS ≠ S1 approved/visual accepted/user playtest; toàn runtime dungeon NOT CHECKED. Footage fetch thất bại ghi thật ở §4, không báo đã xem clip.

**ONE NEXT ACTION: DỪNG; chờ user giao task/planning tiếp theo trong session mới. Không tự thực hiện child task, mở DR-P3 hoặc implementation.**
