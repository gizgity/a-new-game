# Q12A — Combat Audio Identity V1.1

**AWAITING USER AUDIO/PLAYTEST APPROVAL Q12A.** Baseline `6ed8a96`; không tự nghiệm thu, ghi DDR, mở Q12B–E hoặc đổi balance/RNG/Boss/progression/artwork Q9A–Q9E.

**Bản nghe hiện tại591fa0e** — revision theo feedback giảm treble/tăng bass. [Pages40812380024](https://github.com/gizgity/a-new-game/actions/runs/40812380024) completed/SUCCESS. Chưa user duyệt audio hoặc liveHTTP/hash verification.

Baseline triển khai Q12A **7e74904** đã push main fast-forward. [Pages40791046554](https://github.com/gizgity/a-new-game/actions/runs/40791046554), job123176060022 SUCCESS (npmci/build/typecheck/upload/Deploy). Chưa liveHTTP/hash verification từ môi trường; không suy từ Pages success. Commit bàn giao chỉMarkdown, không redeploy.

## Follow-up Arrival — tiếng gõ trong hai giây đầu bài4

User “2 giây đầu bài 4 vẫn còn tiếng gõ thuỷ tinh” (2026-10-29) mở scope sửa riêng timbre Arrival đã giữ ở hai revision trước. Bỏ các partial ngân1187/1921/2857Hz, thay accent228/342Hz và noise low-pass; attack8→12ms. Giữ body76/152Hz, duration.38s, **bốnnhịp ở0.1/0.6/1.1/1.6s**, gain.32/.46/.66/.9, priority và toàn bộ Boss warning2s/gameplay. Không sửa cuecombat khác hoặc DDR.

[PCM/cadence](arrival/evidence/comparison.json), baseline591fa0e: năng lượng>2kHz Arrival giảm31.8dB, vùng60–300Hz lệch−0.075dB; các cuecombat đo còn lại giống baseline. Đây là evidence tín hiệu, chưa là cảm nhận loa thật. [Browser](arrival/evidence/browser.json) cap/warning giữa spam/lifecycle4sizes và build/typecheck/28testfiles PASS. Script so sánh dùng baseline tạm từ `git show 591fa0e:src/game/audio.ts` tại `src/game/audioBaseline.ts`, chạy `node docs/q12a/arrival/compare-check.mjs`, xóa file tạm trước build.

Các ghi chú “Arrival waveform giữ nguyên/exact” bên dưới là evidence lịch sử trước feedback này; từ follow-up chỉ **cadence/gain/timing** được giữ nguyên. Chưa user audio approval; nghe lại đúng2giây đầu bài4 và khả năng nhận ra warning khi spam.

## Revision theo feedback 2026-10-29

User nghe bản7e74904: “nghe hơi gắt tai, giảm treb, tăng bass thêm 1 tí. hiện tại nghe như tiếng thuỷ tinh gõ z”. Revision này chỉ tune cached PCM, không scheduling/event/gameplay/UI:

- Hạ stack từ740/980/1480 xuống520/680/860Hz, Perfect1200→880Hz, Chain1650→1100Hz, Basic650→520Hz, shotHit940→680Hz. Stack vẫn tăng theo1/2/3 thật; Perfect giữ cue riêng.
- Bỏ partial1.5× dễ gợi chuông/thủy tinh, dùng harmonic2× chỉ10%; bớt crack/noise và overtone của Heavy/Charged.
- Low-pass2pole1800Hz bake vào buffer ngoài Arrival; attack4ms/tail4ms mềm hơn. Thêm body120Hz+240Hz, gain.055 cho L3/Heavy/Charged/Detonate, .018 cho Basic/Light nhỏ; giữ peak≤.22/gain.4/cap8.
- Arrival giữ từng sample với cùngnoise seed/cadence/gain, không thêm filter hay bass vào warning accepted.

[So phổ trước/sau](warm/evidence/comparison.json), baseline7e74904: năng lượng phần>2kHz giảm~7.6–20.3dB trên các cue combat đo; vùng60–300Hz Heavy+1.7dB, Charged release+3.5dB, blast+2.3dB, Basic+3.4dB; không tăng volume tổng. Đo filter-band là evidence kỹ thuật, không thay nghe cảm nhận hoặc khẳng định đã hết gắt trên loa thật. Light1/2 vẫn ítbass; L3/Detonate tăng nhẹ hơn Heavy/Charged.

[Browser revision](warm/evidence/browser.json):390/320/844touch+1440desktop, cap/warning/root/mute/locked/suspended/unsupported/cleanup PASS; build/typecheck và28testfiles PASS. Các evidence ở `evidence/` bên dưới giữ snapshot V1; revision hiện tại dùng `warm/evidence/`. Tái lập so sánh: tạo tạm `src/game/audioBaseline.ts` từ `git show 7e74904:src/game/audio.ts`, chạy `node docs/q12a/warm/compare-check.mjs`, xóa file tạm trước build. Browser: `AUDIO_EVIDENCE_PATH=docs/q12a/warm/evidence node docs/q12a/browser-check.mjs`.

**Vẫn AWAITING USER AUDIO/PLAYTEST APPROVAL Q12A**; chưa nghe thực tế/thiết bị/iOS/Safari. Nghe lại bài1–2 để so độ sắc/thân impact, bài4 để kiểm warning giữa spam.

## Nghe thử

- [Audio Audition](https://gizgity.github.io/a-new-game/audition.html?v=591fa0e): entry riêng, không import main/profile, không đọc/ghi localStorage hay progression. Chạm/click bài để mở WebAudio; mặc định cùng volume100% như manager. Game thật vẫn dùng mute/volume Settings hiện hữu.
- [Game review](https://gizgity.github.io/a-new-game/?playtest=chain&v=591fa0e): fixture memory hiện hữu, không ghi tiến trình thật. Desktop E/Shift giữ–thả; touch giữ–thả nút Charged/Heavy. Normal game tại [Pages](https://gizgity.github.io/a-new-game/).
- Bài1: L1–3 swing rồi confirmed impact, Heavy, Basic, buildup/release/Charged hit/blast. Bài2: Dash/Perfect, stack1–3, Detonate/ticks/Hurt. Hai bài này là **cue mẫu độc lập**, không tuyên bố input/simulation đã hit; test event thật bên dưới kiểm riêng.
- Bài3/4: CombatWorld thật với24quái được grant HP/mark để stress, hướng quay và Light/Basic liên tục; bài4 dùng countdown Arrival2s như simulation. Đây là fixture, không natural run/độ khó/Boss mới. Chọn lại bài để chạy lại warning. Mute, pause/resume không nối lại âm cũ; nút giữ buildup thả/cancel để dừng. Rời tab tự pause; bấm Pause/resume để tiếp tục từ clock hiện tại.
- Đề nghị nghe loa điện thoại trước, rồi desktop ở volume vừa. Cần nhận ra L3/Heavy/Charged có lực hơn Basic; Perfect khác Dash; stack tăng rõ; Arrival vẫn dễ nhận ra trong spam; không gắt/mệt tai. Game thật: đánh hụt không impact; Charged giữ rồi pause/cancel không release/hit giả. Phản hồi bài/tình huống, âm quá nhỏ/gắt/lẫn, thiết bị/browser và loại loa.

## Audit và event map

Giữ ProceduralAudio, cache Phaser và WebAudioSoundManager; không mixer/framework song song. Giữ tần số/duration và identity cơ bản của các cue cũ, âm transition/victory. Có lý do sửa: noise cũ rộng/gắt → low-pass recurrence (revision:2pole1800Hz +4ms attack/4ms tail); Hurt cũ gần impact → double gated dissonant pulse; Perfect → harmonic chime riêng; thêm stack/chaining/buildup do thiếu identity. Arrival **giữ gain4nhịp, duration.38s và cadence**, timbre thay theo follow-up phía trên; không thêm warning giả. Các cue ngoài Arrival được giới hạn peak và gain để giữ headroom.

| Sự kiện thật | Cue | Identity / thời điểm |
| --- | --- | --- |
| Accepted Light L1/2/3 beginAttack | swing/swing2/swing3 |480/650/230Hz; .075/.095/.16s; chưa hit |
| Light confirmed contact | light/light2/light3 |330/460/145Hz, transient ngắn; miss/cancel không impact |
| Heavy accepted windup | heavySwing |150Hz/.24s; Heavy hit riêng110Hz + harmonic/crack |
| Basic fire / contact | gun / shotHit |520Hz/.055s;680Hz/.04s; miss không hit |
| Charged có resource thật + armed aim đang giữ | charge | Harmonics tăng280Hz trở lên; không tạo charge meter/gameplay state |
| Charged accepted fire / contact / resolved blast | chargedGun / chargedHit / chargedBlast | Release220Hz/crack, hit180Hz, blast95Hz+overtone; chỉ simulation phát release |
| Dash thực thi / Perfect xác nhận | dash / perfect | Movement noise ngắn / chime880Hz; không chime từ nút Dash |
| Rupture thật tăng1/2/3 | stack1/2/3 |520/680/860Hz, .055/.07/.10s; cap3 không accent giả; gồm phantom/Catalyst/Charged mark |
| Explosion resolved | detonate/chargedBlast +root ID/hop | Một primary/root; các resolution cùngroot thành chain ticks1100Hz, gain giảm0.65^hop, sàn.15 |
| Player hurt xác nhận | hurt |190/287Hz, double pulse riêng; priority cao |
| Arrival warning simulation | arrival | Cadence Q8C giữ nguyên; timbre thấp theo follow-up Q12A |

`SoundCue[]` không đủ root/hop: thêm `audioEvents: CombatSoundEvent[]` chỉ ở presentation, reset mỗi step/reset. Resolver không đổi geometry/damage/timing/queue/RNG; chỉ ghi metadata ở đúng nơi đã resolve. Loại bỏ impact Light dư từ blast lên từng victim vì primary root/tick đã đại diện tiếng nổ. Không thêm kill/proc âm giả cho Legacy/Anomaly.

Buildup là **aim presentation của Charged Shot đã tích trữ**, không phải cơ chế charge mới: resource `chargedShots>0`, player sống, playing và không Boss transform. Tối đa1.2s, không loop; giữ lâu hơn để lại silence, không tự release. Thả, cancel, resource mất, pause/resize/gameout/transition tắt voice; release chỉ từ `fire`. Có thể drop buildup khi cap đầy. Nút audition buildup chỉ là isolated sample.

## Cap / priority / scheduling

Cấu hình tại `src/game/config/audio.ts`: cap**8**, tối đa**5cue/render frame**, trong đó tối đa**3cue không-danger**; beginFrame ở scene update, không reset trong catch-up simulation ticks. Arrival được schedule trước combat và có2slot dự trữ cho danger; nếu quá budget drop, không queue. Cooldown riêng cue, không chặn mọi action bằng một timer: Basic100ms, shotHit55ms, Light60/75/95ms, Heavy160ms swing/140ms hit, Detonate140ms, chain85ms, stack70ms, Hurt85ms, Perfect100ms, Arrival0ms. Một Sound object/cue nên cue đang phát không tự restart.

Priority: Arrival5 > Hurt/Boss/Defeat4 > Heavy/L3/Charged/Detonate/Perfect3 > regular combat2 > stack/chain/buildup1 > transition0. Khi đầy chỉ thay voice có priority **thấp hơn**, chọn thấp nhất; ngang priority thì drop. Regular không cắt warning. Transition/reset/shutdown dừng voice có chủ đích; elite transition giữ Arrival đang phát. Pause giữ root ledger để delayed chain không phát primary lần nữa; run mới xóa ledger. Root history512entry có giới hạn, lớn hơn active projectile/chain budget hiện hữu.

30buffer mono cache một lần/context +30WebAudioSound tái sử dụng. Source node của WebAudio một lần phát là one-shot theo Phaser, tối đa8đang hoạt động; không synth/createBuffer trong combat. Shutdown destroy sound objects/listener, cache game giữ để scene sau dùng lại, context thuộc Phaser không tự close. Không có stereo dependency/pitch RNG trong combat. Noise dùng Math.random presentation lúc cache, không chạm seeded gameplay RNG.

Peak buffer ngoài Arrival≤.22, playback gain.4; Arrival timbre sửa riêng theo follow-up, không normalize và gain4beat như cũ. Biên bảo thủ đo từ buffer cache: `7*.22*.4 + peakArrival < 1` (bằng evidence browser). Volume manager0–1 nhân tiếp; không compressor/mixer mới. Mute event dừng voice ngay (không chỉ đọc gain getter có thể chậm một audio quantum). Locked/unsupported/suspended/hidden drop ngay, không queue/replay. Phaser giữ mobile gesture unlock; audition gọi resume trực tiếp trong gesture và vẫn drop nếu chưa running.

## Validation / evidence

- `npm run build` (gồm typecheck), `npm test`:28testfiles PASS; tests mới kiểm swing/fire/hit/miss, rejected Charged, Heavy cancel, stack1–3, Dash/Perfect và root metadata. Warning chunk Phaser>500kB có sẵn; shared bundle chứa Phaser.
- [parity.json](evidence/parity.json):15case, Seal0–4 ×none/BloodMoon/Storm, seed808 cùng input tới180s/defeat; full serialized world và run ticks/result tại mỗi300tick giống baseline, chỉ loại audioEvents/soundEvents. Không sửa config gameplay/art/progression.
- [browser.json](evidence/browser.json):390/320/844touch +1440desktop;8voice full, Arrival replacement/protection, frame budget, root dedup qua pause và tick giảm gain, buildup cancel, mute/locked/suspend/no replay/unsupported/cleanup/cache ổn định.24enemy và pause control, localStorage rỗng, không overflow/pageerror.
- [input.json](evidence/input.json):390CDPtouch/1440keyboard, giữ resource thật→buildup, pause cancel không tốn resource, resume không replay, fresh hold-release phát đúng1Charged/no hit khi không target.
- [comparison.json](evidence/comparison.json):baseline/new duration/peak/RMS/difference energy PCM. Arrival giống từng sample khi cùng presentation noise stream; swing giảm high-frequency difference energy. Đây là phân tích tín hiệu, **không phải nghe cảm nhận**.
- Screenshots [390audition](evidence/audition-390.png), [1440audition](evidence/audition-1440.png), [390game](evidence/game-390.png), [1440game](evidence/game-1440.png);320/844 audition cũng trong evidence. Không đổi HUD/artwork game.

Chạy lại: `npm run dev`, `node docs/q12a/browser-check.mjs`, `node docs/q12a/input-check.mjs`. Browser scripts dùng Playwright/Chromium có sẵn ở `/opt/codex`; môi trường khác thay executable/import path, không thêm dependency game. Compare: tạo tạm `src/game/audioBaseline.ts` từ `git show 6ed8a96:src/game/audio.ts`, chạy `compare-check.mjs`, xóa file tạm trước build. Parity: compile baseline `src/game/combat.ts` và `run.ts` bằng tsc ES2022 tới `/tmp/q12a-baseline` với package type module; `npm test` rồi `node docs/q12a/parity-check.mjs`.

Chưa nghe thực tế, Safari/iOS/mobile hardware, latency/thermal/deviceFPS hoặc natural full-run; headless Chromium mute output chỉ xác minh scheduling/PCM. Không suy acceptance hoặc punch/fatigue/speaker readability từ tests. **Chờ user audio/playtest Q12A**, không Q12B–E.
