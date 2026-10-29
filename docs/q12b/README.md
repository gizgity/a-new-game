# Q12B — Hit Feel & Combat Feedback

**AWAITING USER PLAYTEST APPROVAL Q12B.** User giao2026-10-29 hướng Punchy & Controlled. Baseline accepted Q12A `893d744`, runtime `c30248a` = `591fa0e`. Không DDR hoặc Q12C–E; Arrival gốc Q8C và toàn bộ audio giữ nguyên bytes.

## Audit và implementation

- Reuse CombatWorld.hitEnemy/impact, EnemySprites, ActorPose, ArenaScene camera, Perfect cue và HUDFeedback hiện hữu. Không artwork/dependency/audio/feedback bus song song. HUDFeedback đã bounded priority/transition, giữ nguyên.
- Trước Q12B: enemy.flash120ms, EnemySprites tintFill trắng toàn body ngay cả khi ActorPose giữ windup; không camera shake. Hitstop nằm trong simulation/input buffer/RunDirector; Heavy85ms, L3 65ms, L2 45ms, Light33ms, Charged40ms, Basic12ms, Blast25–50ms, Hurt40ms.
- `config/feedback.ts`: Light L1/L2/Basic45ms; Medium L3/Charged70ms; Heavy/Detonate90ms. Chỉ Heavy/Detonate của player gây damage thật lên Bulwark (Elite)/Boss mới rung: ≤6screenpx desktop/≤2.4mobile. Quái thường và Light/L3/Basic/Charged không rung, vẫn giữ flash/VFX. Tint thường giữ chi tiết thay white fill; không tint trong windup/active/transform. ActorPose vẫn ưu tiên telegraph.
- Camera envelope cosine giảm về0 trong100ms; không RNG/displacement cộng dồn. Một envelope100ms, tối thiểu450ms giữa2lần bắt đầu: có≥350ms camera đứng giữa các burst khi spam. Không restart/queue/cộng shake trong khoảng này. Transform matrix chỉ đổi khi render, restore POST_RENDER; scroll/zoom/follow/input world mapping không sửa. Reticle bù offset render để giữ dưới pointer.
- Confirmed actualDamage>0 mới ghi metadata feedback/flash/contact impact; corpse/zero damage/miss/cancel/rejected không cấp feedback mới. Pool impact24 hiện hữu giữ nguyên, priority không dựa vào pool có thể evict. VFX explosion phát lúc nổ theo baseline; camera/flash chỉ sau damage thật.
- Perfect accent dùng local4corner cũ, rút xuống100ms presentation clock; HUD notice cũ giữ. Không thêm hitstop. Flash dùng presentation clock, không kéo dài theo legacy simulation hitstop. Pause/Draft/result/resize xóa camera tail; resume không replay; reset clears metadata.

## Ngoại lệ hitstop đã được user chốt

User ngày2026-10-29 chọn nguyên văn: **“Giữ simulation baseline; cap phần presentation mới, ghi ngoại lệ”** (hội thoại task hiện tại, không permalink). Đây là quyết định scope implementation; không ghi DDR/Approved hoặc tự nghiệm thu Q12B.

Giữ toàn bộ hitstop simulation kế thừa: Heavy85ms, L3 65ms, L2 45ms, Light33ms, Charged40ms, Basic12ms, Blast25–50ms, Hurt40ms (lượng đặt timer; simulation60Hz có lượng tử bước). Max/coalesce theo baseline, không cộng timer. Ngoại lệ này giữ nguyên input buffer/movement/cooldown/i-frame/AI/Boss/run/warning timing và world-state parity cùng input/seed. Không tuyên bố legacy hitstop đạt≤35ms.

**Q12B thêm0ms hitstop** ở presentation và simulation (≤35ms), Perfect cũng0ms mới. Không thêm clock freeze hoặc gia hạn warning; camera/flash/Perfect accent decay bằng presentation clock dù simulation đang hitstop. Xóa config cap chưa có consumer để không giả vờ đã hạ legacy freeze.

## Kiểm chứng hiện có

- `npm run build`/typecheck PASS; `npm test`29testfiles PASS (4case Q12B focused): tier/flash, zero/dead/miss/cancel/rejected, Perfect không stop mới, crowd priority/pool/cap/envelope/reset.
- [Parity](evidence/parity.json):15case Seal0–4 × none/Blood Moon/Fractured Storm, input/seed808, tối đa10800ticks hoặc defeat; full serialized combat world mỗi300tick, gồm cả audio. Chỉ loại metadata mới feedback/feedbackFlash; mọi state còn lại giống baseline. Không chứng minh combat feel hoặc natural fullrun.
- [Browser](evidence/browser.json): Chromium software WebGL320×740,390×844,844×390 touch và1440×1000 desktop; scene24enemies/Boss+Elite windup/active và Boss transform; flash45/70/90ms hết dù simulation freeze; render pure, camera pixel cap (Float32 tolerance0.0001px), logical scroll/aim restore, pause/resume/decay, storage isolation; baseline/Q12B screenshots cùng state. Không phải screenshot live Pages hoặc deviceFPS.
- [Input](evidence/input.json):390CDPtouch/1440keyboard giữ Charged, cancel qua pause, fresh press/release đúng mộtresource, miss không hit. Chưa user cảm nhận, real-device/iOS/Safari/latency/thermal/FPS; [Movement/aim/resize](evidence/movement.json): A/B390touch multi-input joystick+manual Basic drag và1440WASD+mouse Basic, position/angle/projectile count giống nhau khi impulse; rotate390→844 và desktop1440→1100 xóa tail/input, world mapping ổn định. Không suy responsiveness/feel từ kiểm kỹ thuật này.
- Tái lập baseline: compile `src/game/combat.ts`/`run.ts` của893d744 vào `/tmp/q12b-baseline` (ES2022/ESM), package.json type module; `npm test && node docs/q12b/parity-check.mjs`. Browser dùng `npm run dev` rồi `node docs/q12b/browser-check.mjs`, `node docs/q12b/input-check.mjs` và `node docs/q12b/movement-check.mjs`; Playwright tại toolchain `/opt/codex/cua_node`.

## A/B và checklist review

**Bản đầu e631673 (lịch sử; revision bên dưới supersede tuning shake)**, [Pages40889132551](https://github.com/gizgity/a-new-game/actions/runs/40889132551) **completed/SUCCESS**, gồm npmci/build/typecheck/upload/Deploy. Chưa liveHTTP/hash verification; local dist không thay live verification. Các URL dùng fixture memory riêng; `feedback=baseline` chỉ được đọc khi có `playtest`. Không ghi progression thật; thêm `draftSeed=808` để cố định RNG, thao tác tay vẫn có thể khác.

- [Baseline A](https://gizgity.github.io/a-new-game/?playtest=chain&draftSeed=808&feedback=baseline&v=e631673) / [Q12B B](https://gizgity.github.io/a-new-game/?playtest=chain&draftSeed=808&v=e631673). Baseline giữ120ms/tintFill/Perfect cũ và không impulse, cùng audio/simulation.
- Light1–2/Basic: đánh trúng thấy accent ngắn, camera đứng; đánh hụt/cancel/không đủresource không impact giả.
- L3/Charged và dọn crowd thường: flash/VFX nhưng camera đứng. Heavy/marked Detonate/Chain trúng Elite/Boss: rung rõ hơn, có khoảng nghỉ và không giật cộng dồn. Touch giữ–kéo–thả Heavy/Charged; desktop WASD+mouse/Shift/E phải chính xác, reticle luôn sát pointer.
- [Boss B](https://gizgity.github.io/a-new-game/?playtest=boss&v=e631673) / [Boss A](https://gizgity.github.io/a-new-game/?playtest=boss&feedback=baseline&v=e631673); tới warning/Boss, spam hit lúc windup, cue vẫn đọc rõ. Elite/Bulwark còn armor/telegraph như cũ; damage bị giảm vẫn là confirmed damage.
- Perfect Dodge accent ngắn, không stop mới. Pause/resume/rotate/resize/Replay không replay camera tail hoặc kẹt aim.
- Phản hồi: tình huống/thao tác, thấy gì, thiết bị/browser; cảm giác hit đủ rõ/đủ nhẹ, có lệch aim hoặc warning bị che không.

## Revision theo feedback tăng rung / tránh rung liên tục

User2026-10-29: “tăng lên đi, và cũng nên cân nhắc, nếu chém quái là rung thì chắc k bao giờ camera ngừng rung, hay chỉ làm cho elite và boss?”. Revision dùng threat+strength gate: chỉ confirmed player Heavy/blast (Detonate) lên Elite/Boss; amplitude6px desktop/2.4pxmobile, cosine1cycle/100ms và450ms giữa2lần bắt đầu. Giữ flash45/70/90ms trên mọi target. Không trigger từ hostile damage, miss/cancel/zero damage. Đây là tuning presentation theo yêu cầu mới, thay cap3px/0.9px và shake trên common ở bản đầu; không đổi simulation/audio/Arrival/ngoại lệ hitstop.

PASS build/typecheck/29testfiles (thêmcase mọi loại target×7cue×player/hostile và spam120ticks ≤5burst/≥70%timeline đứng),15case full-world parity. Browser4viewport và movement/aim/resize evidence được cập nhật cho6px/2.4px. Evidence dist.md giữ snapshot bản đầu e631673, không giả là revision đã kiểm production. Chưa user feel/device/iOS/Safari; vẫn AWAITING USER PLAYTEST APPROVAL Q12B.
