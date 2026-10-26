# Arrival Ambient V2 — implementation

**AWAITING USER PLAYTEST APPROVAL**. User đã duyệt [boardV2 + audio sketch](../arrival-concept/README.md) qua “ok, làm đi”, trước tích hợp. User đã nói phần Boss/Enraged ổn trên1302474; không yêu cầu duyệt lại. Chỉ warning presentation, không Q8D.

- Source ImageGen production riêng `source/arrival-edge-production-v1.png`; không crop board. `tools/pack-arrival-edge.py` chọn seam sáng/halo phía trong và normalize512×32. Runtime PNG34.6KB/64KiB decoded; [prompt/quyền/hash](source/asset.json), [exact prompt](source/PROMPT.md). Không art engine/framework/dependency mới. Floor/actor atlas/Boss sprite không đổi.
-4TileSprite pooled, đúng biên phần arena nhìn thấy; halo10screenpx mobile/14desktop chỉ vào trong view, không tràn HUD/controls. Depth0.95 dưới telegraph1/body1.2. Hình seam rạn/embers đến từ asset, không vẽ Graphics thay artwork. Không full-screen tint/camera shake/plate góc to.
-4nhịp trong2s đọc `run.bossWarning`: peak tại0.10/0.60/1.10/1.60, gain0.32/0.46/0.66/0.90; glow nền0.18, envelope decay9/s. Hình/âm chung pulse function; warning freeze không phát nhịp mới. Mất warning/spawn/death/Replay thì hide ngay, không VFX tail. Timings/spawn pause/input giữ nguyên.
- Âm1beat procedural0.38s, trầm76Hz +152Hz harmonic nghe trên phone và kim loại1187/1921/2857Hz + noise nhẹ, cùng timbre mẫu đã duyệt. Không external samples hoặc file WAV runtime. Dùng soundmanager volume/mute/autoplay hiện có; beat đã bỏ qua khi mute/locked không phát lại sau unmute. Pause/Draft/result/Boss cue stop tails như trước; Resume không replay beat đã qua. Ưu tiên warning khi crowd, giữ cap8SFX bằng nhường một gun/oldest sound; không đổi combat event/gameplay.

## Validation

- `npm test`18files PASS, thêm1focused cho4peaks/monotonicgain/reset/decay/bounds; `npm run build` typecheck+Vite PASS, warning bundle Phaser cũ giữ.
- [Browser4sizes](evidence/browser.json):390/1440/320/844, warning chạy Scene thật4audio beats, Pauseclock/audio freeze; actualWebAudio mute/no-unmute-replay/volume0.25, buffer0.38s/peak<0.32 không clip. Harness ban đầu đọc AudioParam ngay sau setter nên sai assertion; đã chờ audioquantum80ms, không sửa audio runtime để che lỗi test.
- Peak screenshot dùng fixture24enemies/windup và sceneUpdate freeze rõ ràng: [390](evidence/peak-390.png), [1440](evidence/peak-1440.png), [320](evidence/peak-320.png), [844](evidence/peak-844.png). Không naturalrun. Render20hide/show cycles displaylist50→50,4corner view samples, depth dưới cue/body, Replayhide; không errors/requestsfailed/overflow. CPUdraw p950.1–0.3ms ở softwareWebGL, không deviceFPS/device heat hoặc iOS/Safari approval.
- [Dist smoke390/1440](evidence/dist.json): Start/Pause/vi-en/Resume/edge PNG200,0errors/failed/overflow. Live verification và Pages sẽ ghi sau publish. Chưa nghe mix/device thật, user cần đánh giá độ thu hút/gắt âm.
- Các file combat/run/config/build/control/Enraged giữ bytewise so baseline bddc762; chỉ ArenaScene warning render/audio plumbing thay. Không balance hoặc inputcontract mới.

## Playtest

Mở preset `?playtest=boss`:1150kills tại3:40/buildsẵn; hạ thêm50quái hoặc đợi4:00. Trong warning2s, cảm nhận viền rạn/4nhịp tăng dần và tiếng xích/trầm; vẫn di chuyển/chém/bắn, telegraph ở rìa không bị che. Thử Pause giữa warning/Resume, mute/unmute/volume và Replay; warning không lặp nhịp cũ hoặc còn sót khi Boss đã xuất hiện. Thử phone dọc/ngang và desktop. Báo mức sáng/độ gắt, bước và thiết bị/browser; không yêu cầu duyệt lại Boss/Enraged.

## Deploy

Code/deploy [`8cbff77`](https://github.com/gizgity/a-new-game/commit/8cbff77801553481df4c84e764a7485d13d0c38b) đã publish main fast-forward qua GitHub connector vì Git CLI thiếu credential; không force. Remote tree khớp Git index đã test. [Pages40357489627](https://github.com/gizgity/a-new-game/actions/runs/40357489627)/job121693735446 completed/SUCCESS gồm Deploy. [Preset1150kills bản mới](https://gizgity.github.io/a-new-game/?playtest=boss&v=8cbff77). Livecurl trước bịproxy CONNECT403; production local/dist và Pages Deploy được ghi riêng. [Before](../evidence/warning-390.png) / [After](evidence/peak-390.png) là renderer thật nhưng crowd khác nhau, không A/B cùng scene. Commit handoff sau chỉMarkdown, không runtime mới. Dừng AWAITING USER PLAYTEST APPROVAL.
