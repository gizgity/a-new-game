# BOSS-EASE-01 V1 — Implementation

2026-11-13 — user duyệt **“ok triển đi”** trong hội thoại hiện tại sau proposal/simulation. Scope: đúng variant `candidate` của [proposal](PROPOSAL.md), không Combat V2/B1 hoặc thay balance khác. Source tích hợp trên remote `46c45bb`, giữ B1 REVERTED / PAUSED BY USER.

## Thay đổi

`src/game/config/balance.ts`: damage32/36/14 cả2phase; phase2 windup.8/recovery.48/cooldown.65/chase×1.05/followup gap.45/windup.8/combo recovery1.05. Không đổi logic combat. Giữ HP2400/threshold50%/transform1.4s/freeze/aim-lock/15shots/geometry/player/quái khác/progression.

Test Boss phase bỏ giả định timing hai phase bằng nhau, kiểm combo dựa state/timing thật, thêm probe cả hai hit còn32HP cách≥1.25s và hurt protection vẫn.65s. Test recovery phase1 dùng đúng config phase1. Không có text hiển thị số Boss cũ trong i18n nên không cần đổi dictionary. GAME_BRIEF bổ sung tuning hiện hành, giữ approval lịch sử.

## Validation

- `npm test`: **33 file PASS**, gồm Boss damage/pattern/threshold/transform freeze/noheal/followup aim-lock/recovery/Perfect Dodge/cadence và regression hiện hữu.
- `npm run build`: **typecheck + Vite PASS**. Warning chunk Phaser>500kB có sẵn.
- Compile production thật rồi chạy cùng `measure.mjs`: **144fixture +3run +combo probe khớp hoàn toàn JSON variant candidate đã duyệt**, kể cả full-run3/3, seed808 còn12HP. [Raw implementation](evidence/implementation.json); không suy human winrate.
- Chromium1440×1000 và390×844: keyboard movement/touch Dash thật, phase1.62s/phase2.8s, transform kết thúc đúng, gap.45s/followup.8s/locked aim, renderer screenshot, vi/en, không overflow/pageerror. [Browser evidence](evidence/implementation-browser.json), [mobile](evidence/phase2-390.png), [desktop](evidence/phase2-1440.png). Đây là fixture cấp Boss/HP/positions, tạm dừng Scene update để step/render có kiểm soát; không natural run/device FPS.
- Build dist smoke: Boss preset boot/native input/clock tiến trên hai viewport, không overflow/pageerror; [dist evidence](evidence/dist-smoke.json).
- Experiment tái lập được pin về git baseline78bc558 bằng snapshot tạm để lần chạy sau không lấy V1 làm baseline; evidence proposal gốc giữ nguyên. `src` không bị script experiment thay đổi.

## Deploy và cách thử

Đang chuẩn bị commit/push main và theo dõi GitHub Pages; chưa ghi SUCCESS trước khi workflow kết thúc. Cập nhật SHA/link sau deploy.

Sau deploy, mở `?playtest=boss` (3:40/1150kills, counter/sustain build cấp sẵn, không lưu progression), thêm50kills hoặc chờ4:00 để warning2s và Boss xuất hiện. Đánh đến nửa HP để vào phase2:

1. Mobile: joystick đi khỏi điểm slam, Lướt né nếu cần; desktop: WASD/Space tương tự. Sau slam còn sweep, hướng khóa khi bắt đầu telegraph, có khoảng nghỉ rõ để phản công sau combo.
2. Kiểm trúng một đòn không mất khoảng nửa HP như trước; hai hit slam+sweep không có modifier/barrier tổng68damage, không96. Trial có build nên damage vào HP thực có thể khác probe không build.
3. Chơi một run mới bình thường để thử Boss với tài nguyên đã tiêu từ đầu run. Phản hồi phase2/đòn gây khó, build/HP và thiết bị/browser nếu vẫn kẹt hoặc quá dễ.

Chưa human playtest acceptance, real-device/iOS/Safari/latency/FPS/fullrun browser. Giữ rủi ro quá dễ với build mạnh đã nêu trong proposal; không tự tune thêm. Rollback chỉ các thông số Boss về baseline46/50/18, phase2.62/.32/.44/chase1.15/gap.25/followup.62/combo.75.
