# Q8D — Balance Validation & Final Tuning

**AWAITING USER PLAYTEST APPROVAL** — chỉ Q8D, không Q9. Baseline main `7625fa2` (runtime `8cbff77`), Q8A `394341c`, Q8B `eb6fbbe`, Q8C `8cbff77` đã ACCEPTED. Approval Q2–Q8C giữ nguyên.

## Quyết định trước/sau

Không thay runtime/thông số: evidence chưa tách được vấn đề balance khỏi năng lực bot đủ để tune an toàn. Không buff Ranged theo bot áp sát, không nerf Tank/Sustain/Counter theo tốc độ hạ Boss của bot Perfect. Victory4:30–5:00 vẫn mục tiêu mềm đã được user duyệt ở Q8B; không ép chờ thắng.

| Hạng mục | Trước Q8D | Sau Q8D |
| --- | --- | --- |
| Spawn | Q8A EMA6s, cap18–30, pressure hardcap48 | Giữ nguyên |
| Pacing | 6Draft20/50/85/120/155/190s; Elite125–150s; warning220–240s | Giữ nguyên |
| Boss | 1500HP; warning2s; transform1.4s world freeze; phase2 speed+15%, cooldown0.44 | Giữ nguyên |
| Build/damage/input/art/deadline | Q2–Q8C / tối đa5:00 simulation | Giữ nguyên |
| Validation | Q8C8route-runs/encounters; thiếu density/damage cả run | Q8D32ô đo,20trajectory khác nhau, damage/HP/density theo giai đoạn + regression |

Đây là validation không tune: không dựng A/B cải thiện giả. Số đo sau áp dụng cho baseline trước vì source runtime bytewise không đổi; không phải lượt chạy A/B độc lập. Thông số cũ bị superseded: chỉ các timing được Q8B/Q8C thay thế trong lịch sử, Q8D không supersede thêm số balance nào.

## Cách đo, cấu hình và giới hạn

`npm test && node docs/q8d/measure.mjs`. [Raw runs](evidence/runs.json) và [script](measure.mjs). Route offers được điều khiển như preset route hiện có, **không** grant build/HP/kills/clock trong run. Draft được chọn/heal qua RunDirector thật. Seed808; không khảo sát xác suất weighted offers/unlocks. Mỗi run bắt đầu0build, phải kiếm đủ draft; không coi đây là run với offers ngẫu nhiên thường.

- Thường:4Mutation của route +1Curse, Draft5 giữ Curse. Cấu hình synergy cao (strong-candidate): cùng4Mutation + thêm Curse2 tại Draft5: Tank+BloodPact, Sustain+GhostStep, Counter+ParasiticMark, Ranged+ParasiticMark. Đây là ứng viên build mạnh có trade-off, không bảo đảm mạnh hơn. Không gọi số lượng Curse là power level.
- Tank:Aegis/Guard/Reversal/Kinetic +IronOath; Sustain:Reclaimer/Catalyst/Chamber/Kinetic +Parasitic; Counter:Phantom/Static/Reversal/Kinetic +Ghost; Ranged:Specialist/Chamber/Catalyst/Kinetic +Glass. Thứ tự chính xác trong raw drafts.
- Hai cadence riêng: moderate Heavy90ticks/Charged45ticks; fast50/20. Cả hai giữ melee/basic và dùng Surge khi sẵn sàng. Hai policy:pursuit áp sát65px; role-aware chỉ đổi Ranged thành orbit190–260px và melee khi<130px. Các policy còn lại giống nhau, **12ô trùng là control, không phải mẫu độc lập**; không suy ra win rate quần thể.
- Bot aim chính xác, đọc `imminentThreat()` và thử Dash mỗi2tick; né/Perfect/chain hiệu quả hơn người, di chuyển/cạnh arena còn đơn giản. Cadence có thể lệch cửa sổ giữ-thả; không mô phỏng ngón tay/nhận biết cue. Đây là simulation thật, không phải human playtest hay natural browser-input run.
- `runSeconds` là timer gameplay; `fixedStepSeconds` thêm1.4s transform trong các run vào phase2, chưa tính thời gian người chọn Draft/Pause. `bossTTK` từ spawn đến kill theo timer run; thêm1.4s để có thời gian encounter bao gồm transform. Warning2s không tính hitstop nên spawn có thể sau2.35–2.57s timer run đúng contract.
- Damage HP đo quanh `hurt` thật; selfDamage/Blood miss tách riêng, heal từ healPlayer tách Draft heal. Barrier absorb đo tại absorb vì Kinetic có thể gain trong hurt. Giảm maxHP do Glass là clamp, không ghi thành enemy damage. HP timeline10s và bins30s trong raw. Density common enemies, bỏ Elite/Boss, warning và transform; timer run gồm hitstop theo runtime. Kill rate cả run gồm kill Boss/Elite; bin rate chỉ phần preBoss được đo.

## Kết quả4hướng /2cấu hình

Bảng chính dùng policy role-aware, cadence fast cho cả hai build để so cùng điều kiện. HPdamage là HP mất do enemy, không phải raw damage trước Barrier. Cột cuối baseline→Q8D giống nhau vì giữ runtime.

| Hướng / build | Kết quả | Run(s) | Kill/s | HP cuối | HPdamage / absorb | Density TB / đỉnh | Trống(s) | Boss TTK(s) trước→sau |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| tank thường | victory | 232.37 | 5.26 | 100.00 | 0.00 / 214.00 | 17.04 / 30 | 3.22 | 9.80 → 9.80 |
| tank synergy2Curse | victory | 234.98 | 5.19 | 70.00 | 32.00 / 208.00 | 17.34 / 30 | 3.22 | 12.43 → 12.43 |
| sustain thường | victory | 228.00 | 5.54 | 98.00 | 76.00 / 46.00 | 13.67 / 28 | 3.22 | 5.52 → 5.52 |
| sustain synergy2Curse | victory | 228.52 | 5.52 | 98.00 | 76.00 / 36.00 | 13.67 / 28 | 3.22 | 6.03 → 6.03 |
| counter thường | victory | 228.10 | 5.52 | 91.00 | 44.00 / 24.00 | 13.71 / 29 | 3.22 | 5.70 → 5.70 |
| counter synergy2Curse | victory | 228.10 | 5.52 | 100.00 | 44.00 / 24.00 | 13.71 / 29 | 3.22 | 5.70 → 5.70 |
| ranged thường | victory | 239.82 | 5.08 | 57.00 | 34.00 / 20.00 | 21.30 / 30 | 0.00 | 13.45 → 13.45 |
| ranged synergy2Curse | victory | 239.82 | 5.08 | 61.00 | 34.00 / 20.00 | 21.30 / 30 | 0.00 | 13.45 → 13.45 |

Các lượt role-aware đều đủ6Draft20/50/85/120/155/190s, Elite125s; warning220–224.15s, Boss222.35–226.60s. Fast8lượt đều thắng228.00–239.82s; moderate Counter thường thua228.60s/HP0, Counter thêmParasitic thắng229.55s/17.2HP. Sustain moderate mất159HP nhưng hồi108HP qua proc (Draft heal riêng), kết thúc69HP; thêmGhost tăng damage nhận201.8 và chỉ còn27.2HP. Tank+BloodPact có damage penalty, không phải nâng cấp miễn phí. Không ép build cùng DPS/kết quả.

## Phân tích / quyết định

- **Ranged không đủ bằng chứng yếu:** pursuit thường thua168.88s/956kills, synergy thua175.93s/992kills ở moderate; đổi đúng policy giữ khoảng cách thắng237.98s/1290kills với45/51HP. Fast pursuit vẫn chết157.95s; fast orbit thắng239.82s. Không lấy hành vi áp sát sai hướng làm lý do buff damage/HP.
- **Tank mạnh phòng thủ, không đồng nghĩa áp đảo DPS:** fast thường mất0HP nhưng absorb214damage, hạ Boss9.8s; thêmBloodPact mất32HP/TTK12.43s. Chưa có evidence người chơi đứng yên bất tử, nên giữ trade-off đã duyệt.
- **Sustain/Counter burst Boss nhanh:** fastTTK5.52–6.03/5.70s; một số kill trước combo, tất cả role-aware vào phase2. Moderate Counter thường chết ngay encounter, thêm sustain cứu được. Độ nhạy cadence và Perfect là lý do chưa tăng BossHP/nerf hàng loạt. Cần user đánh giá có đủ đọc và phản công combo hay chỉ bỏ qua Boss.
- **Arena:** role-aware mean13.67–21.30 (fast), peak30;0s>30 trong mẫu, không đụng hardcap48. Trống3.22–3.40s các route áp sát tập trung0–30s; từ30s trở đi không trống trong các mẫu này. Ranged orbit trống0–0.03s. Tank moderate mean tăng6.50(0–30s)→23.55(150–180s), không có bằng chứng arena cạn kéo dài/quá tải liên tục; số đếm không chứng minh readability trên điện thoại.
- **Duration/Boss:** thắng~3:48–4:01, sớm hơn mục tiêu mềm4:30; đây là risk cảm nhận cần xác nhận, không lỗi deadline. Không kéo dài bằng khóa Victory hoặc phá baseline accepted. Không kết luận “gameplay đã cân bằng” từ bot.

## Regression và tái lập

`npm test`:18files PASS/0fail; typecheck+Vite build PASS, warning bundlePhaser>500KB có sẵn. Không thêm dependency runtime/framework/test infrastructure. Scripts browser tái dùng fixture Q8B/Q8C, import Playwright qua `PLAYWRIGHT_MODULE` (package tạm bên ngoài repo), Chromium `/usr/bin/chromium`, dev5173/preview5175. Không ghi đè evidence lịch sử.

- [Boss4sizes](evidence/boss-browser.json):1440×1000/390×844/844×390/320×740, warning pause/resume/spawn, phase1/transform/follow-up renderer, vi/en/Replay, không overflow/errors. Screenshots cấp clock/kills/HP/positions và freeze renderer, không full-run input.
- [World freeze](evidence/enrage-freeze.json):390/1440 giữD, world/player/grunt/shot/HP/run đứng khi transform tiến; Pause freeze transform, Resume combat. BossHP750/placement được cấp. Harness lượt đầu không nhận frame trong250ms trên software renderer; đổi chờ simulation transition, không sửa game để làm test pass.
- [Arrival](evidence/arrival-browser.json):4sizes/4beats, Pause/mute/volume/no stale beat/Replay, crowd24 fixture, pooling và CPUdraw. [Lifecycle](evidence/lifecycle.json):390/1440 đủ6Draft/freeze, warning→Boss, Victory/Defeat deadline5:00→Replay. Clock/kills/result grants chỉ cho kiểm boundary, không evidence thắng tự nhiên.
- [Dist](evidence/dist.json):390/1440 Start/Pause/vi-en/Resume, asset200, khôngrequesterror/JSerror/overflow. Dist local không giả là live.
- CPUdrawp95: Boss/follow-up fixture0.10–1.10ms, crowd24/Arrival0.20–0.50ms trong lần đo này. DisplayList ổn định khi toggle warning20lần; không leak pooling trong fixture.
- SoftwareWebGL CPUdraw/frozen crowd không là FPS thiết bị thật, không đánh giá iOS/Safari/thermal hay trải nghiệm đọc cue/âm thanh. Không thêm perf optimization khi chưa có evidence runtime regression.

## Checklist user playtest chỉ Q8D

1. [Chơi run](https://gizgity.github.io/a-new-game/): thử Tank/Sustain/Counter/Ranged qua `?playtest=route-tank|route-sustain|route-counter|route-ranged`. Route chỉ gợi ý offers, không cấp fullbuild; chơi bình thường. Thử giữ Curse và thêm Curse thứ2 (nếu được offer). Ghi run time, HP/kills, thắng/thua; build nào quá an toàn hoặc khó sống?
2. 0:15–3:30: áp sát/melee-chain rồi đổi giữ khoảng cách bắn. Đạt nếu có mục tiêu liên tục sau opening, vẫn đọc được đòn và tìm đường thoát; báo đoạn trống dài hoặc crowd ngợp. Không cần buộc mọi route cùng DPS.
3. Draft6mốc20–30/50–60/85–100/120–140/155–180/190–205s; Elite2:05–2:30; warning từ3:40 khi1200kills, fallback4:00. Thử Pause/resume và chọn Draft: combat/timer dừng đúng, không double-pick; không bỏ qua mốc.
4. Boss sau warning2s: tiếp tục di chuyển/tấn công, rồi kiểm transform1.4s tại nửaHP dừng thế giới/timer. Né slam→follow-up sector và phản công trong recovery. Đạt nếu Boss có nguy hiểm/cơ hội phản công rõ, build mạnh thắng sớm vẫn được; báo nếu Boss luôn chết trước khi thể hiện đòn hoặc quá khó với build thường. Có thể dùng `?playtest=boss` kiểm nhanh cue nhưng preset cấp build/kills, không dùng đánh giá full-run balance.
5. Một lượt desktop và điện thoại dọc/ngang: input giữ-thả/Dash, Pause, Replay sau thắng/thua; nếu tới5:00 phải Defeat. Đạt nếu không carry build/clock/cue cũ, không giật/che cue bất thường. Thiết bị thật/iOS/Safari/âm/nhiệt máy cần user, không tự ghi PASS.

Phản hồi: route + Mutation/Curse + mốc thời gian/tình huống + HP/kết quả + điều thấy quá mạnh/yếu + thiết bị/browser. Không yêu cầu duyệt lại Q2–Q8C. **Dừng AWAITING USER PLAYTEST APPROVAL; không mở Q9.**

## Deploy
Đã commit/push main fast-forward [`cbdb131`](https://github.com/gizgity/a-new-game/commit/cbdb131c31914e35761e132e16fcbecc888981fe). [Pages40360458461](https://github.com/gizgity/a-new-game/actions/runs/40360458461)/job121704168388 **completed/SUCCESS**, gồm Deploy. [Chơi Q8D](https://gizgity.github.io/a-new-game/?v=cbdb131). Commit bàn giao sau chỉ Markdown, không đổi runtime.

Live HTTP qua proxy: indexHTML, JS`index-CDtu8gf_`, CSS`index-MT4IgVwe`, EnragedPNG và ArrivalPNG đều200, SHA256 khớp byte-for-byte dist đã kiểm; đây là kiểm HTTP artifact, không thay livebrowser/device playtest. Runtime/src/public/package/workflow bytewise giữ baseline, hash cây tại [validation.json](evidence/validation.json). Dừng **AWAITING USER PLAYTEST APPROVAL**; không Q9.
