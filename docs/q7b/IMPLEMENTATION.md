# Q7B — HUD runtime / bàn giao playtest

**CONCEPT / DESIGN APPROVED:** user “approved làm đi” ngày2026-10-26. Runtime **AWAITING USER PLAYTEST APPROVAL**; không tự accepted, không mở Q7C. Q2–Q7A và draft đầu4hướng giữ accepted; Q1 vẫn riêng chưa có visual approval.

## Bản sửa hiện hành theo playtest

User báo HUD che arena và giao sửa controls/auto aim/draft lock. **Xem [REVISION.md](REVISION.md) và [board hiện hành](index.html)** cho code/checks/ảnh/cách thử mới. Phần dưới là snapshot code6664ee0 (trước phản hồi); các câu “canvas/control geometry/input/core giữ nguyên” và checklist6nút giữ vị trí chỉ đúng snapshot đó, đã được ngoại lệ user supersede. Evidence/đo performance cũ không được dùng chứng nhận revision.

## Snapshot implementation6664ee0 — lịch sử

### Thay đổi

- CombatHUD gom HP/Barrier thành card riêng heart/thanh liên tục và shield/thanh phân đoạn; lowHP có chữ/icon/contrast, không chỉ đổi màu. Desktop tài nguyên ởrìa dưới, build6slots góc phải; portrait tài nguyên trên6nút hiện có.
- Một summary≥44px cho4Mutation+2Curse, empty/owned khác shape/fill; tap/click mở panel cuộn, tên/description/risk/state đầy đủ vi/en. Dùng pause/reset lifecycle cũ, focus trap/Back/Resume rõ, không thêm hotkey hay đổi lựa chọn build.
- Dash/Heavy còn lượt vẫn available khi đang hồi lượt kế; Charged hiện ammo+points, không timer giả; Surge READY chỉ khi100. Các nút vẫn nhận pointer/capture khi resource không đủ, không dùng HTML disabled.
- HUDFeedback tách presentation snapshot/queue:1notice + tối đa2pending, gộp trùng/priority, pending stale≤0.9s, notice promoted hiển thị0.9s. Clock dừng khi paused/hitstop; reset run xóa snapshot/queue. Hurt/heal/break/Perfect/cost/risk dùng flags/counters thật, không tổng damage/heal giả từ netHP.
- Proc/timers trên glyph/resource: Phantom,Static,Reversal,Frenzy,Kinetic/Anchor,heal/chamber/guard clocks và Curse state. Passive trade-off đầy đủ trong details, không kéo thành prose liên tục trên sân. World VFX/audio giữ nguyên.
- [hud-icons.svg](../../public/assets/ui/hud-icons.svg): authored24px SVG glyphsheet, không third-party/icon package/generated screenshot. [Runtime asset provenance/hash](runtime-assets.json). CSS chỉ layout/typography/state, không drawing engine/shader/framework/dependency mới.
- main.ts chỉ wiring/phase/progression cũ và calls HUD; TouchControls chỉ updateResources + type import. Đã so source bind/sample/consume/reset/release/move với main21f2c55; core game/AI/draft/balance/camera/PlayerVisual/BuildVisual/BarrierVisual không đổi. Floor Q7A nguyên hash `71b8d5b2b0850d40cd7c39a795a8caee129e4b14dc7f08f20093d17c18fea70a`.

## Renderer evidence / giới hạn

[Board trước–sau](index.html) đặt baseline renderer nguyên gốc cạnh ảnh mới; các hình concept cũ giữ nguyên làm lịch sử visual gate.

| File | Nguồn / cách đọc |
| --- | --- |
| baseline/crowd-full-build-{320,390,844,1440}.png | Renderer source21f2c55, explicit4Mutation/2Curse/resources,33enemy. Không natural acquisition/run |
| evidence/crowd-{320,390,844,768,1440}.png | Cùng crowd fixture/state class,HUD mới; canvas/control geometry giữ nguyên. Grant HP/marks/resources để soi, không human acceptance |
| evidence/details-{320,390,844,768,1440}.png,details-curses-390.png | Panel pause/cuộn/full4Mutation+2Curse; icon/name/description/state từ dictionary/code hiện có |
| evidence/feedback-{hit,heal,break,perfect}-390.png | Các snapshot flags/counters riêng để soi notice/card; không giả bốn event đồng thời. Heal dùng lastHeal2, không net HPdelta |
| evidence/boss-{0,1,2}-{390,844}.png,elite-{390,844}.png | Windup/pattern state fixture core/renderer thật. Không chứng minh thắng Boss hoặc user đọc tốt mọi frame |
| evidence/grayscale-390.png | CSS grayscale trên toàn arena-shell gồm HUD/controls/canvas, không chỉ floor; same runtime content, không ImageGen |
| evidence/draft-320.png,defeat-320.png,victory-320.png,glass-320.png | Fixture milestone/result/GlassHP75 để kiểm presentation/reset. Không natural full-run |
| evidence/production-{320,390,844,768,1440}.png | Dist/base thật,Start/input CDP touch hoặc mouse+WASD/Heavy release; không grant build/HP/enemy. Opening ngắn |

Portrait HUD box mới98px, so baseline198.5px ở390 và213.5px ở320. Tính từ đỉnh canvas qua timer tới notice là128px; Boss dùng hàng riêng tới152px. Không so số này với tổng diện tích pixel che khuất. Desktop chia nhiều cụm sát rìa nên root container phủ canvas nhưng pointer-events:none; không gọi bounding box root desktop là vùng opaque.

Ảnh đã xem: các lớp vitals/build/readiness rõ hơn prose cũ; player/threat/VFX giữ nguyên. Đây là đánh giá implementation để user review, **không tự quality approved**. Chưa Safari/iOS/device/full-run, không bảo đảm mọi camera/crowd/animation từ fixture.

## Kiểm tra

- npm test:13files PASS, trong đó5focused HUDFeedback cases: no refresh/spam,priority/stale,zero-dt/reset,risk re-entry,queued readable TTL. Typecheck/build PASS; warning Phaser bundle>500KB có từ trước.
- [Browser5viewports](evidence/browser.json):390×844/320×740/844×390/768×1024/1440×900,4Mutation/2Curse,details cuộn/vi-en/pause-resume; no pageerror/request>=400/document overflow. Same canvas và6button rectangles; min44px.
- [Scenario checks](evidence/scenarios.json):0/1/2charges+available/cooldown,Chargedpoints2/3 không timer,Surge99/100;hit/heal/break/Perfect;Boss3patterns+Elite;opening4cards chọncard4;Victory/Defeat/reset;GlassHP75+2Curses.
- Keyboard Space trên summary mở details không tiêuDash;Tab giữ focus trongpanel,Escape đóng/resume vàblur button. Desktop giữShift→details→nhả→resume không cast, simulation clock đứng khi paused. Mobile giữCharged→tap summary ngón thứ2→nhả/resume không bắn/tiêu ammo. Harness CDP phải nhả đúng touch ID; lỗi thứ tự ởscript đầu đã sửa, không sửa controls để chữa test.
- [Production smoke](evidence/production.json):5viewports,drag aim ngoài nút/Bắn/Heavy giữ-thả thật hoặc mouse/WASD,Heavy còn1/2,details/Pause/settings/vi-en/no-stuck-pressed/no-overflow/no runtime/request errors. Không inject stats, không full-run hoặc mobile device thật.
- Test compiler chỉ thêm build pure HUDFeedback cho focused tests; không thêm test/UI framework hoặc dependency.

## Performance

[Raw report](evidence/performance.json): cùng Chromium browser, baseline21f2c55 worktree và source Q7B, frozen33enemy/4Mutation/2Curse; HUD warm20+200callbacks và120rAF samples. Software WebGL headless, không benchmark simulation/full-run hoặc device FPS.

| Viewport | HUD CPU trước / sau ms | Frame median trước / sau ms | p95 trước / sau ms |
| --- | --- | --- | --- |
| 390×844 |0.041 /0.041 |16.7 /16.7 |16.8 /16.8 |
| 1440×900 |0.028 /0.0345 |33.4 /33.4 |66.6 /66.7 |

Không thấy suy giảm frame rõ trong mẫu; không khẳng định mượt trên mọi mobile. Asset SVG nhỏ, không thêm floor layers/particles/shader/per-frame artwork. Cần user cảm nhận độ mượt/độ rõ trên máy thật.

## Deploy / cách user thử

Code [6664ee0](https://github.com/gizgity/a-new-game/commit/6664ee09edf587e235b93112cea0186121cf4f88) đã fast-forward push main. [Pages40275065554](https://github.com/gizgity/a-new-game/actions/runs/40275065554) / job121415959796 completed/success gồmDeploy; giữ workflow/base hiện có. Live curl từ môi trường vẫn proxy403; không bypass policy. Evidence là local Vite/dist, không giả live. Deploy success không thay user acceptance.

[Chơi Q7B](https://gizgity.github.io/a-new-game/) — reload sau deploy.

1. **HUD / controls:** phone dọc/ngang hoặc desktop, chạy/bắn/Heavy giữ-thả như cũ. So HP/Barrier,Dash/Heavy charges+timer,Charged ammo+points vàSurge READY; mong đợi đọc nhanh,6nút không đổi vị trí/capture/giữ-thả.
2. **Build/details:** tap/click dải glyph4M/2C hoặc nút trongPause. Game dừng,cuộn xem tên/effect/risk,cóBack/Resume; đóng rồi cần thao tác mới, không tự tungHeavy/Charged. Build thường kiếm qua draft:Mutation25kills/0:30,160/1:40,220/2:20,380/3:40;Curse80/1:00,300/3:00. Không cần chờ fullbuild để báo UI issue.
3. **Feedback / crowd:** bị đánh/hồiHP/vỡkhiên và Perfect→Light/Charged với build phù hợp; mong đợi notice ngắn,proc gắnicon,không spam giữa sân. Ví dụ [counter trial](https://gizgity.github.io/a-new-game/?playtest=counter),[Juggernaut](https://gizgity.github.io/a-new-game/?playtest=juggernaut),[sustain](https://gizgity.github.io/a-new-game/?playtest=sustain) đã có,grant build có nhãn/không lưu progress; không natural acquisition.
4. **Elite/Boss nếu tiện:**200kills/2:30 và450kills/4:00. Quan sát cue dướiHUD mới,không yêu cầu full-run để báo chữ/icon/nút bị che. Draft/Pause/Victory/Defeat vẫn thao tác như cũ.

Gửi tình huống/vùng HUD,điều bị chìm/nhầm/tự cast,thiết bị/browser hoặc ảnh nếu có. Q7B dừng **AWAITING USER PLAYTEST APPROVAL**; không mở Q7C,không tự duyệt Q1.
