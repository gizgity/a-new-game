# Q9A — Elemental Legacy Core

**IMPLEMENTED — AWAITING USER PLAYTEST APPROVAL**. Thiết kế được user duyệt ngày2026-10-27 qua “duyệt dd-0002. bắt đầu triển khai q9a”, [DD-0002](../../DESIGN_DECISIONS.md#dd-0002--elemental-mechanics-contract); approval thiết kế không là nghiệm thu implementation. Giữ DD-0001 và baseline Q2–Q8D, không mở Q9B.

## Delivery

Code `1a08448e40297eb762eb8530f1aeec35a37f7223` đã push main fast-forward. [Pages40428188955](https://github.com/gizgity/a-new-game/actions/runs/40428188955), job121939115034 completed/SUCCESS, gồm build/typecheck/upload/Deploy. [Chơi bản Q9A](https://gizgity.github.io/a-new-game/?v=1a08448). Validation browser/dist là local tested build; không tuyên bố đã xác minh liveHTTP/hash hoặc thiết bị thật từ workflow. Commit bàn giao tiếp theo chỉ Markdown, không redeploy.

## Implementation

- Catalog data-driven6Sigil/12Branch và tuning tại [config/legacy.ts](../../src/game/config/legacy.ts). [LegacyEffects](../../src/game/LegacyEffects.ts) tách state/logic khỏi scene; combat giữ geometry/damage/death. Chỉ một bộ compatible/run, không cross-element.
- Fire Charged→Ignite, Wildfire một thế hệ, Furnace Heavy tiêu Ignite/AoE. Water Heavy→Soaked, Undertow primary-on-Soaked/CDtarget, FlowState PD hồi tiến trình một Heavy charge.
- Lightning PD charge riêng StaticRiposte; Basic hit tiêu charge để chain/ArcRelay+1/Overclock. Ice per-target Frostbite window, Shatter ở Heavy/Charged sau khi ready; Brittle state riêng fracture, CrystalEcho không đâm lại nguồn.
- Shadow PD mark theo aimcone; melee kể cả lethal vẫn Ambush thành công/consume đúng một lần. Nightfall nhận event, không đánh corpse/retarget/reward kép; Veilstep tăng walk speed, không i-frame. Wind walk thực gần enemy→Momentum, Light resolve kể cả miss tiêu đủ Momentum→slash; Tailwind haste/Cyclone knockback.
- Root ID, origin/depth, budget hữu hạn dùng chung qua delay/DoT/chain và death dedup. Legacy secondary giữ on-kill hợp lệ (BloodReclaimer marked/root.marked, Hunted CD, DeathEcho cap); không tự lấy on-hit quyền primary. Surge/death count/Boss slain/Volatile death giữ accounting cũ; Rupture queue vượt quota vẫn defer, không drop native queue để nhường Legacy.
- Boss miễn Legacy slow/interrupt/stagger/knockback/armorbreak; transform freeze giữ nguyên. Elite resistance/immunity riêng; strongest-only slow. Haste chỉ Light recovery và Basic interval tương lai có hardcap; không sửa Heavy/Charged/Dash/AI timing.
- Selection trước combat dùng cùng guard fresh-press/1s như Draft và cùng panel/layout đã có, text vi/en. HUD indicator chỉ text trong lane hiện hữu; chi tiết ở build panel. Dynamic local status/projectile cues thuộc combat Graphics, không thay artwork production hoặc thêm asset mới.

## RNG, ticket và giới hạn progression

[legacy.ts](../../src/game/legacy.ts) roll Sigil trước, Branch sau trong unlock IDs đã sở hữu; không pad offer trùng/locked. Sigil vừa xuất hiện có weight0.65 thay1 (tuning nhẹ, không loại). Pool chỉ một bộ trả1offer, pool rỗng chơi không Legacy, Sigil chưa có Branch dùng Core. Một Sigil có hai Branch có thể cho hai bộ khác nhau.

Run đầu không Sigil. Ticket giữ seed/offers/selected/started qua refresh; không tăng số run lần nữa khi resume ticket. Chỉ Victory/Defeat đóng ticket, run tiếp mới roll. Save validate ID/dependency, bỏ fields lạ; không persist combat stats/status/timer. Chưa full save migration.

**Q9A không cấp unlock hoặc Victory reward.** Save mới/save cũ chưa có Legacy IDs sẽ tiếp tục không Sigil cả ở run sau; không backfill unlock từ victory cũ. Economy/unlock thuộc Q9B+, chưa được triển khai. Do đó nghiệm thu cả6/12 dùng các **fixture riêng không ghi progression** dưới đây. Không sửa save thật để thử, không suy fixture unlock là progression release.

## Tuning

Damage/duration/CD/range/force/threshold/haste/queue/target/root budgets trong config là thông số khởi tạo Q9A, **chưa approved balance**. Wildfire một thế hệ V1 có thể được xem lại qua playtest có user review, không tự tăng generation. Không thay damage/cadence/encounter balance cũ ngoài Legacy đã giao.

## Validation

- `npm test`: PASS20testfiles, gồm25focused elemental cases và72subcases (18sets×4loadouts). Bao phủ6Core/12Branch, tất cả12Mutation/8Curse qua nhóm4M+2C, on-kill direct/DoT/chain/secondary, root/depth/caps, final state/reset, lethalAmbush, ammo/on-hit isolation, Boss/Elite/transform freeze, Haste/cadence/Momentum, RNG/dependency/fallback/ticket/allowlist. Giữ regression combat/Rupture/Curse/Boss/Draft/spawn/mobile aim hiện hữu.
- `npm run build` gồm typecheck: PASS. Warning Vite chunk lớn/Phaser có sẵn; không thêm dependency.
- [browser.json](evidence/browser.json): selection/guard/vi-en/pause/resume, overflow/error checks ở320/390/844touch và1440desktop; firstRun/poolrỗng/refresh ticket/sốrun giữ nguyên.
- [input.json](evidence/input.json): CDPtouch390 và mouse/keyboard1440; Heavy hold/release, walk+Basic đồng thời, desktop manual aim, pause release không thêm Heavy, HUD/canvas không chồng ở4góc. Đây là fixture explicit (stagger enemy để đo input), không là naturalrun/winrate/performance evidence.
- [dist.json](evidence/dist.json): built dist390touch/1440desktop, owned-IDfixture trong context browser mới, hai offer khác nhau; refresh giữ seed/offers/choice/run count, không auto-unlock, không lỗiJS/HTTP.
- Screenshots [selection320](evidence/selection-320.png), [selection1440](evidence/selection-1440.png), [combat320](evidence/combat-320.png), [combat1440](evidence/combat-1440.png), cùng390/844 tại evidence. Ghi là runtime Chromium fixture, không concept/asset approval mới.
- Không coi softwareWebGL/emulation là deviceFPS/inputlatency/audio/iOS/Safari/thermal hoặc user experience acceptance. Mobile touch và desktop keyboard/mouse cần cảm nhận riêng theo [GAME_BRIEF](../../GAME_BRIEF.md#mobile-first--desktop-equivalent--tiêu-chuẩn-chung).

Browser scripts dùng Playwright có sẵn ngoài package project: `PLAYWRIGHT_MODULE` trỏ tới module cài trong môi trường, không thêm dependency game. [browser-check.mjs](browser-check.mjs)/[input-check.mjs](input-check.mjs) dùng Vite5173; [dist-check.mjs](dist-check.mjs) dùng preview5175, base `/a-new-game/`. Chạy sau khi code ổn định, không HMR mutation song song; input checks chờ simulation state để không suy từ software render wall time.

## User playtest — cách vào và tiêu chí đạt

Trang chơi: https://gizgity.github.io/a-new-game/ . Mỗi link fixture dưới mở menu, bấm **Bắt đầu → chờ1s → chọn bộ**. Banner thử Legacy báo không lưu tiến trình. Dùng browser/tab mới hoặc quay lại trang thường để rời fixture. Fixture có cùng gameplay/combat config, chỉ pool Legacy và profile thử được tách riêng; không tặng kill/HP/resource trong các link này.

| Sigil | Core | Branch1 | Branch2 |
| --- | --- | --- | --- |
| Fire | [Ignite](https://gizgity.github.io/a-new-game/?playtest=legacy-fire-core) | [Wildfire](https://gizgity.github.io/a-new-game/?playtest=legacy-fire-wildfire) | [Furnace](https://gizgity.github.io/a-new-game/?playtest=legacy-fire-furnace) |
| Water | [Soaked](https://gizgity.github.io/a-new-game/?playtest=legacy-water-core) | [Undertow](https://gizgity.github.io/a-new-game/?playtest=legacy-water-undertow) | [Flow State](https://gizgity.github.io/a-new-game/?playtest=legacy-water-flowState) |
| Lightning | [Static Charge](https://gizgity.github.io/a-new-game/?playtest=legacy-lightning-core) | [Arc Relay](https://gizgity.github.io/a-new-game/?playtest=legacy-lightning-arcRelay) | [Overclock](https://gizgity.github.io/a-new-game/?playtest=legacy-lightning-overclock) |
| Ice | [Frostbite/Shatter](https://gizgity.github.io/a-new-game/?playtest=legacy-ice-core) | [Brittle](https://gizgity.github.io/a-new-game/?playtest=legacy-ice-brittle) | [Crystal Echo](https://gizgity.github.io/a-new-game/?playtest=legacy-ice-crystalEcho) |
| Shadow | [Ambush](https://gizgity.github.io/a-new-game/?playtest=legacy-shadow-core) | [Nightfall](https://gizgity.github.io/a-new-game/?playtest=legacy-shadow-nightfall) | [Veilstep](https://gizgity.github.io/a-new-game/?playtest=legacy-shadow-veilstep) |
| Wind | [Momentum](https://gizgity.github.io/a-new-game/?playtest=legacy-wind-core) | [Tailwind](https://gizgity.github.io/a-new-game/?playtest=legacy-wind-tailwind) | [Cyclone](https://gizgity.github.io/a-new-game/?playtest=legacy-wind-cyclone) |

Thử theo nhóm ngắn; không cần lặp mọi milestone lịch sử:

1. **Fire/Water/Ice:** Ignite/Frostbite cần mục tiêu sống qua đòn; dùng Bulwark Elite (từ2:05 theo kills, fallback2:30) hoặc Boss để dễ thấy đầy đủ. Charged giết quái thường ngay sẽ không đặt Ignite lên corpse. Basic tích Charged rồi Charged đặt Ignite; đánh Heavy lên Ignite để Furnace hoặc kết liễu để Wildfire. Water dùng Heavy rồi primary để thấy Undertow; né vàng để FlowState hồi Heavy. Ice hit liên tiếp cùng target (có thể xen target khác), sau khi đủ3pips dùng Heavy/Charged lần sau để Shatter/Brittle/Echo. Mong đợi không tự Detonate thêm từ damage phụ, không lan Ignite thế hệ2, không mất cơ chế Rupture cũ.
2. **Lightning/Shadow:** Dash khi cue vàng/đạn sắp tới để PerfectDodge. Lightning HUD có charge; Charged không tiêu Legacy charge, Basic hit tiêu và chain; ArcRelay thêm1jump, Overclock chỉ nhanh Light/Basic. Shadow mark theo aim, melee kể cả kết liễu vẫn Ambush; Nightfall không nhảy đích/đánh xác, Veilstep không thêm i-frame. Mong đợi không double kill/resource, PD Mutation/Curse vẫn hoạt động.
3. **Wind:** đi bộ gần enemy tới Momentum≥60 rồi Light; chém hụt vẫn slash khi resolve. Dash/cancel trước resolve/đứng sát tường/pause không farm điểm. Tailwind nhanh tạm thời, Cyclone đẩy common/Elite nhưng không Boss.
4. **Touch + keyboard/mouse riêng:** chạy ít nhất một bộ trên mỗi thiết bị/input đang dùng; vừa di chuyển vừa bắn, giữ–thả Heavy/Charged, kéo aim touch hoặc manual mouse, pause/resume/Draft/đổi viewport. HUD không che player/cue ởgóc; giữ/thả/cancel không tiêu thêm lượt. Đánh giá readability/precision/responsiveness riêng, ghi nếu chỉ thử một nền tảng.
5. **Boss + build:** nhận Draft tự nhiên, giữ4M/2C; Boss warning ởkill/time window hiện hữu (sớm nhất3:40, fallback4:00), transform khi≤50%HP đóng băng world1.4s. Mong đợi status không slow/stun/knock-lock Boss, mutation/curse/relay không mất synergy hoặc gây chuỗi vô hạn. Không cần ép thắng; balance/feel chưa được suy từ tests.

Phản hồi: Sigil/Branch, thao tác/tình huống, hiện tượng và thiết bị/browser. Dừng **AWAITING USER PLAYTEST APPROVAL Q9A** sau delivery; chỉ mở Q9B khi user giao riêng.
