# Q12B — Hit Feel & Combat Feedback

**IN PROGRESS — chờ giải quyết xung đột hitstop với gameplay parity.** User giao2026-10-29 hướng Punchy & Controlled. Baseline accepted Q12A `893d744`, runtime `c30248a` = `591fa0e`. Không DDR hoặc Q12C–E; Arrival gốc Q8C và toàn bộ audio giữ nguyên bytes.

## Audit và implementation

- Reuse CombatWorld.hitEnemy/impact, EnemySprites, ActorPose, ArenaScene camera, Perfect cue và HUDFeedback hiện hữu. Không artwork/dependency/audio/feedback bus song song. HUDFeedback đã bounded priority/transition, giữ nguyên.
- Trước Q12B: enemy.flash120ms, EnemySprites tintFill trắng toàn body ngay cả khi ActorPose giữ windup; không camera shake. Hitstop nằm trong simulation/input buffer/RunDirector; Heavy85ms, L3 65ms, L2 45ms, Light33ms, Charged40ms, Basic12ms, Blast25–50ms, Hurt40ms.
- `config/feedback.ts`: Light L1/L2/Basic45ms/0px; Medium L3/Charged70ms/≤1.5px; Heavy/Detonate90ms/≤3px. Mobile30% (≤0.45/0.9px). Tint thường giữ chi tiết thay white fill; không tint trong windup/active/transform. ActorPose vẫn ưu tiên telegraph.
- Camera envelope cosine giảm về0 trong100ms; không RNG/displacement cộng dồn. Một envelope, ưu tiên Heavy>Medium>Light; equal/lower không restart burst đang chạy. Transform matrix chỉ đổi khi render, restore POST_RENDER; scroll/zoom/follow/input world mapping không sửa. Reticle bù offset render để giữ dưới pointer.
- Confirmed actualDamage>0 mới ghi metadata feedback/flash/contact impact; corpse/zero damage/miss/cancel/rejected không cấp feedback mới. Pool impact24 hiện hữu giữ nguyên, priority không dựa vào pool có thể evict. VFX explosion phát lúc nổ theo baseline; camera/flash chỉ sau damage thật.
- Perfect accent dùng local4corner cũ, rút xuống100ms presentation clock; HUD notice cũ giữ. Không thêm hitstop. Flash dùng presentation clock, không kéo dài theo legacy simulation hitstop. Pause/Draft/result/resize xóa camera tail; resume không replay; reset clears metadata.

## Xung đột cần user chốt

Contract mới yêu cầu Heavy hitstop≤35ms, Light không hitstop và presentation-only, đồng thời không đổi cooldown/movement/AI/Boss timing và world state với cùng input/seed. Baseline thực tế freeze toàn simulation khi hitstop>0 (combat.ts captureInput/step, RunDirector.step), Heavy85ms/L3 65ms. Không thể hạ/xóa freeze này và vẫn giữ world-state parity theo wallclock/input giống hệt. Chưa sửa legacy hitstop; `FEEDBACK.hitstopCap` là target contract, **chưa có hiệu lực**. Không báo cap35ms PASS hoặc Q12B hoàn tất.

Đã hỏi user hai lựa chọn:

1. Giữ simulation baseline, cap presentation mới và ghi ngoại lệ hitstop kế thừa.
2. Cho phép thay simulation hitstop, kiểm parity theo active simulation ticks và ghi khác biệt wallclock.

Chờ câu trả lời trước thay phần phụ thuộc. Chưa deploy review Q12B, chưa chuyển AWAITING USER PLAYTEST APPROVAL.

## Kiểm chứng hiện có

- `npm run build`/typecheck PASS; `npm test`29testfiles PASS (3case Q12B mới): tier/flash, zero/dead/miss/cancel/rejected, Perfect không stop mới, crowd priority/pool/cap/envelope/reset.
- [Parity](evidence/parity.json):15case Seal0–4 × none/Blood Moon/Fractured Storm, input/seed808, tối đa10800ticks hoặc defeat; full serialized combat world mỗi300tick, gồm cả audio. Chỉ loại metadata mới feedback/feedbackFlash; mọi state còn lại giống baseline. Không chứng minh combat feel hoặc natural fullrun.
- [Browser](evidence/browser.json): Chromium software WebGL320×740,390×844,844×390 touch và1440×1000 desktop; scene24enemies/Boss windup, render pure, camera pixel cap (Float32 tolerance0.0001px), logical scroll/aim restore, pause/resume/decay, storage isolation; baseline/Q12B screenshots cùng state. Không phải screenshot live Pages hoặc deviceFPS.
- [Input](evidence/input.json):390CDPtouch/1440keyboard giữ Charged, cancel qua pause, fresh press/release đúng mộtresource, miss không hit. Chưa user cảm nhận, real-device/iOS/Safari/latency/thermal/FPS; movement/manual drag aim và resize impulse đầy đủ còn cần kiểm bổ sung.
- Tái lập baseline: compile `src/game/combat.ts`/`run.ts` của893d744 vào `/tmp/q12b-baseline` (ES2022/ESM), package.json type module; `npm test && node docs/q12b/parity-check.mjs`. Browser dùng `npm run dev` rồi `node docs/q12b/browser-check.mjs` và `node docs/q12b/input-check.mjs`; Playwright tại toolchain `/opt/codex/cua_node`.

## A/B và checklist review (sau khi deploy)

Các URL dùng fixture memory riêng; `feedback=baseline` chỉ được đọc khi có `playtest`. Không ghi progression thật; thêm `draftSeed=808` để cố định RNG, thao tác tay vẫn có thể khác.

- Baseline: `?playtest=chain&draftSeed=808&feedback=baseline`; Q12B: `?playtest=chain&draftSeed=808`. Baseline giữ120ms/tintFill/Perfect cũ và không impulse, cùng audio/simulation.
- Light1–2/Basic: đánh trúng thấy accent ngắn, camera đứng; đánh hụt/cancel/không đủresource không impact giả.
- L3/Charged: accent mạnh hơn, impulse nhỏ; Heavy/marked Detonate/Chain: có lực rõ, camera không giật cộng dồn. Touch giữ–kéo–thả Heavy/Charged; desktop WASD+mouse/Shift/E phải chính xác, reticle luôn sát pointer.
- Boss: `?playtest=boss` và bản tương ứng `&feedback=baseline`; tới warning/Boss, spam hit lúc windup, cue vẫn đọc rõ. Elite/Bulwark còn armor/telegraph như cũ; damage bị giảm vẫn là confirmed damage.
- Perfect Dodge accent ngắn, không stop mới. Pause/resume/rotate/resize/Replay không replay camera tail hoặc kẹt aim.
- Phản hồi: tình huống/thao tác, thấy gì, thiết bị/browser; cảm giác hit đủ rõ/đủ nhẹ, có lệch aim hoặc warning bị che không.
