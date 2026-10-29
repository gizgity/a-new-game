# Q12C — Elemental Audio & Proc Feedback

**ACCEPTED — USER AUDIO/PLAYTEST APPROVAL Q12C** — user xác nhận “oki duyệt” ngày2026-10-29 trên code/deploy **3013c9d** (bàn giao **ec1a5dd**), [Pages40911173801](https://github.com/gizgity/a-new-game/actions/runs/40911173801) SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Approval cho Elemental Audio & Proc Feedback, 6 Core/12 Branch theo direction Pure Synth / Retro Arcade + Punchy & Controlled. Giữ Arrival gốc Q8C, Q12A/Q12B accepted và giới hạn coverage kỹ thuật; không suy thêm real-device/iOS/Safari/latency/FPS/thermal/liveHTTP từ approval chung. Không DDR hoặc tự mở Q12D–E.

Direction user: **Pure Synth / Retro Arcade + Punchy & Controlled**. Baseline `91490f1`, Q12B runtime `b2042e8` accepted; Q12A/Arrival Q8C giữ nguyên. **ACCEPTED — USER AUDIO/PLAYTEST APPROVAL Q12C**. Không DDR/Q12D–E/balance/artwork/combat mới.

Code/deploy **3013c9d** đã push main; [Pages40911173801](https://github.com/gizgity/a-new-game/actions/runs/40911173801) **completed/SUCCESS**, job123579227760: npmci/build/typecheck/upload/Deploy và cleanup SUCCESS. Xác minh qua GitHub connector vì gh API từ CLI trả Forbidden; không còn blocker deploy. Chưa liveHTTP/hash verification; local Chromium không thay coverage live/thiết bị thật. Commit bàn giao sau chỉMarkdown, khôngredeploy.

## Architecture / audit

Extend `ProceduralAudio`: thêm22 cached mono PCM buffers, cùng Phaser WebAudio manager, gain/mute/lifecycle/voice allocator. Không mixer/engine/dependency/assets ngoài. `SoundCue`, `BuildEffects`, resolver, root ID/admission, damage/RNG/cooldown/budget không đổi. `SoundCue` cũ tham gia combat accounting nên không thêm elemental vào đó. `CombatWorld.elementalEvents` là typed output presentation-only, clear mỗi simulation step/reset; consumer chỉ đọc sau confirmed step. Audio không gọi ngược gameplay. Hooks trong `LegacyEffects` đọc state transitions hoặc so HP trước/sau đường damage cũ.

Giữ Arrival generator nguyên source (được skip warmer processing), tones/audio processing cũ và Q12A policies. Giữ nguyên Q12B feedback/camera/ActorPose/EnemySprites/config, ngoại lệ simulation hitstop accepted. Chỉ ArenaScene gọi thêm elemental consumer sau audio cũ. Math.random chỉ tạo noise PCM khi khởi tạo, không dùng seeded gameplay RNG; gameplay không dùng Math.random.

## Sound / event contract

| Sigil | Core | Branch A | Branch B |
| --- | --- | --- | --- |
| Fire | Ignite: ignition ngắn khi apply mới | Wildfire: crackle bounded khi lan apply mới | Furnace: low blast sau damage dương thật |
| Water | Soaked: rounded filtered sweep khi apply mới | Undertow: descending sweep khi push target sống/non-Boss | Flow State: chime khi refund charge thiếu |
| Lightning | Static Charge: tick khi gain mới; Discharge: snap khi damage dương | Arc Relay: attenuated electric hops sau damage | Overclock: rising pulse khi haste bắt đầu, không refresh |
| Ice | Frostbite: crystal khi vượt threshold; Shatter: FM/glass sau damage | Brittle: transient khi armor break mới thực sự apply, Boss không có | Crystal Echo: ping khi projectile damage dương, không khi enqueue/miss |
| Shadow | Mark: reverse sweep khi target mark mới; Ambush: low-mid strike khi consume mark | Nightfall: echo tại delayed damage thật | Veilstep: muted whoosh lúc buff bắt đầu |
| Wind | Momentum: airy pulse lúc vượt threshold; slash: noise sweep khi projectile admission thành công | Tailwind: pulse khi activation mới và slash admitted | Cyclone: mono rotating filter sweep lúc confirmed positive hit + push non-Boss |

Không apply sound khi refresh, tick/expire/consume tự thân; không DoT tick/per-frame spam. Ambush là ngoại lệ target chết có chủ đích theo DD-0002: lethal marked melee vẫn xác nhận consume/Ambush, nhưng Nightfall không đánh/phát echo trên corpse/out-of-range. Wind slash phát tại launch hợp lệ kể cả melee miss theo DD-0002; Crystal Echo phát tại hit. Overclock/Brittle phản ánh buff/status đã được gameplay apply, độc lập việc secondary damage có admission hay không; không giả Shatter/Discharge impact khi budget chặn. Không sửa các luật baseline để phục vụ sound.

## Flood / priority / lifecycle

- Config `config/elementalAudio.ts`: một primary accent/root, tối đa2secondary nhỏ; subsequent distinct primary bị hạ gain secondary. Root+cue dedup (Arc/Discharge hops được phép lặp trong quota),512root history. Multi-target Furnace/Soaked/Wildfire không full-volume mỗi target.
- Primary gain0.68, secondary0.32 rồi giảm0.65 mỗi hop; nhân combatGain0.4 cũ. PCM peak≤0.22, duration45–240ms. Family primary90ms, family+secondary cue35ms cooldown, cue100ms trên engine cũ. Tất cả tunable, không gameplay clock.
- Core priority1, Branch/decorative0; không thay policy cũ. Voice cap8/frame5/regular3 và2danger slots giữ nguyên. Allocator cũ evict priority thấp trước; Arrival5/Hurt4 được bảo vệ. New audio chạy sau cues cũ để không chiếm regular slots của combat identity đã accepted.
- Drop ngay khi locked/mute/context suspended/hidden; ledger ghi nhận event bị drop nên không retry. Không audio queue/timer. Pause/transition stop voices, giữ root dedup qua resume; start/result reset ledger. World reset xóa output; scene destroy hủy owned sounds.

## Validation / giới hạn

- `npm test`:30testfiles PASS,6focused Q12C tests đủ6Core/12Branch, refresh/tick/threshold/dead/lethal Ambush/budget/cancel/root/flood/PCM. Existing Q9C/Q9D/proc synergy/Q12A/Q12B tests giữ PASS.
- `npm run build`/typecheck PASS; chunk warning Phaser có sẵn.
- [Parity126case](evidence/parity.json):18loadout (6Core+12Branch) × none/6Anomaly, Seal0–4 phân bố theo loadout,4Mutation/2Curse, seed808/cùng input. Full serialized world mỗi300tick, tối đa10800tick hoặc defeat; **chỉ loại elementalEvents**, gồm toàn bộ audio/Q12B feedback/Legacy state/tasks/root accounting. Không HP grants. Đây không là balance test hay full natural run/human input.
- [Audition WebAudio](evidence/browser.json): Chromium software WebGL320/390/844/1440,22cue scheduling/PCM, cap8/root flood/danger/mute/suspend/no replay/cleanup/storage isolation. [Crowd](evidence/crowd.json), [input/feedback regression](evidence/regression/) ghi riêng kết quả và viewport; scripts tái lập kèm theo.
- Browser automation chỉ xác nhận technical scheduling/input/render, **không nghe bằng tai, không chứng minh audio quality**, loa/headphone, iOS/Safari/real-device latency/FPS/thermal hoặc experience acceptance. User đã duyệt theo nguồn ở đầu tài liệu; checklist dưới giữ để tái lập tình huống, không yêu cầu duyệt lại.
- Tái lập: compile baseline combat/run từ91490f1 vào `/tmp/q12c-baseline` ES2022/ESM; `npm test && node docs/q12c/parity-check.mjs`. `npm run dev`, chạy browser/input/feedback/crowd scripts với Playwright toolchain `/opt/codex/cua_node`.

## Review nghe thử / playtest

[Phòng nghe Q12C](https://gizgity.github.io/a-new-game/audition.html?v=3013c9d): bấm6nút Sigil để nghe tuần tự Core/Branch, hoặc22nút tên cue để nghe riêng. Dropdown18loadout bắt đầu combat24quái; nút4 thêm Arrival, có thể Pause/Mute/Stop và đổi VI/EN. Đây là fixture riêng, cấp resource audition trong memory, không import main/profile/progression và không ghi save thật. Synthetic sample buttons không đại diện gameplay event.

[Gameplay6Core/12Branch](../q9a/README.md): các URL `?playtest=legacy-<sigil>-core` hoặc `?playtest=legacy-<sigil>-<branch>` dùng profile memory riêng. Bắt đầu → chờ1s → chọn bộ. Không dùng save thật để cấp unlock. Muốn so với baseline nghe lại audition Q12A controls1–4 hiện có; không đổi feedback Q12B.

1. Nghe riêng6Sigil và từngBranch: khác identity, punchy nhưng không chói/ngân dài. Refresh duration và DoT không lặp apply; Lightning PD→Basic, Ice3hit→Heavy, Shadow PD→melee, Wind di chuyển→Light. FireCharged→Ignite/kill→Wildfire hoặc Heavy→Furnace; WaterHeavy→Soaked/hit→Undertow/PD khi thiếuHeavy→Flow.
2. Dropdown crowd24: thử từng bộ, nhấn4 cho Arrival + combat; Arrival phải rõ, proc nhỏ hơn primary, không volume cộng theo số target. Anomaly kết hợp có technical fixture trongcrowd-check, kiểm cảm nhận thêm trong normal/Anomaly run nếu đã mở.
3. Mobile portrait/landscape: di chuyển+kéo/thả Heavy/Charged; desktop WASD+mouse/Shift/E. Hit/camera Q12B và aim giữ nguyên. Miss/cancel không giả hit, pause/resume/mute/restart không dồn tiếng. Nghe cả loa điện thoại và headphone ở volume vừa.

Phản hồi: Sigil/Branch/tình huống, âm quá nhỏ/chói/lẫn cue nào, thiết bị/browser. Gate chờ audio/playtest đã hoàn tất theo approval ở đầu tài liệu. Dừng sau Q12C ACCEPTED, không tự mở Q12D–E.
