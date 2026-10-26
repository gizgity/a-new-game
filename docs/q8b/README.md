> **Liên kết hiện hành:** user đã giao riêng [Q8D — validation/final tuning](../q8d/README.md) ngày2026-10-26. Các gate “không mở Q8D” ở lịch sử dưới đã được supersede về phạm vi; approval và baseline Q8B giữ nguyên. Q8D không đổi thông số runtime.

> Q8C hiện hành: [Boss warning/Enraged/combo](../q8c/README.md). Boss spawn tức thì và phase2 HP-predicate/timing cũ trong evidence dưới đây là lịch sử, được Q8C thay thế. Q8A dynamic spawn/Q8B milestone floors và approval giữ nguyên; warning thêm2s simulation trước spawn, không đổi threshold.

# Q8B — Run Pacing & Milestone Balance

**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “oki duyệt q8b” ngày2026-10-26 trên code/deployeb6fbbe (docs7b2d005), Pages40341327061 SUCCESS. Đây là approval trực tiếp, không suy ra từ tests/fixture. Baseline main `46a17ed`; Q8A code394341c ACCEPTED bởi user “q8a đạt yêu cầu”. Chỉ Q8B, không mở Q8C/D.

## Quy tắc hiện hành

`elapsed >= minSeconds && (kills >= target || elapsed >= fallback)`; kills tổng run, không tiêu/reset, không timer ảo. Mỗi mốc một lần, Draft tới hạn ưu tiên encounter. Pause/Draft dừng timer; deadline5:00 và Victory khi hạ Boss trước deadline giữ nguyên.

| Mốc | Kills | Sớm nhất | Fallback |
| --- | --- | --- | --- |
| Mutation1 (4hướng) | 25 | 0:20 | 0:30 |
| Curse1 | 80 | 0:50 | 1:00 |
| Mutation2 | 160 | 1:25 | 1:40 |
| Mutation3 | 220 | 2:00 | 2:20 |
| Elite | 200 | 2:05 | 2:30 |
| Curse2 | 300 | 2:35 | 3:00 |
| Mutation4 | 380 | 3:10 | 3:25 |
| Boss | 1200 | 3:40 | 4:00 |

Clear nhanh nhận sớm10–25s tại mỗi mốc, Boss tối đa20s. Giữ kill thresholds Draft/Elite để tránh đổi quá nhiều; floor giải quyết việc bank kills bỏ qua run. Boss1200 dựa clear bot Q8A khoảng1200kills/220s; build ít kills vẫn có Boss4:00. Draft cuối fallback sớm15s so với3:40 cũ, full build ít nhất15s trước Boss, thường30–50s. HUD vi/en hiển thị kills + floor + fallback.

**SUPERSEDED:** trước Q8B, sáu Draft OR25/30s,80/60s,160/100s,220/140s,300/180s,380/220s; Elite OR200/150s, Boss OR450/240s, không floor. Không xóa evidence/approval các checkpoint cũ. Không thay WAVES Q8A, opening/growth, HP/damage, Mutation/Curse, Boss AI/pattern, controls/artwork. Không warning2s hoặc Enraged Q8C.

## Audit/A-B

[Raw comparison](comparison.json), [script](compare.mjs): 4route Tank/Sustain/Counter/Ranged-Chain ×2styles normal/fast trên cả baseline và Q8B. Cùng pursuit bot dùng Light+Basic liên tục, Heavy/Charged chu kỳ130/90ticks (normal),50/20ticks (fast), Surge khi có, dash dựa predicate imminentThreat. Route offers hiện có/seed808, build được chọn ở từng Draft; không grants HP/kills/clock/build, không đổi combat. Bot đọc threat nên là kỹ thuật, không đại diện human playtest. Hai styles là nhịp dùng special, không cam kết fast luôn kill nhanh hơn vì positioning/resources.

| Build | Baseline Draft1→6 normal / fast (s) | Baseline Boss normal / fast | Baseline Victory normal / fast | Q8B Boss normal / fast | Q8B kết thúc normal / fast | Kills Q8B normal / fast |
| --- | --- | --- | --- | --- | --- | --- |
| Tank | 10.8/29.1/42/51.2/63/77 · 11/28.8/41.9/51/64/77 | 89.25 /89.02 | 100.97 /99.75 | 220 /220 | Victory233.02 /230.47 | 1224 /1205 |
| Sustain | 10.8/27/40/50/62/75.2 · 11/27.1/40/50/63.1/75 | 86.70 /86.97 | 94.72 /93.58 | 220 /220 | Victory230.75 /226.15 | 1261 /1252 |
| Counter | 10.8/26.9/40.5/49.6/62.5/75 · 11/27.1/41/50.8/63.3/78 | 88.23 /88.02 | 95.50 /94.40 | 220 /220 | Victory226.60 /225.87 | 1240 /1248 |
| Ranged/Chain | 10.8/27/39/49.5/62/75 · 11/26.9/40.9/49.8/64.5/77 | 86.97 /87.83 | 93.93 /92.80 | Chết trước Boss | Defeat178.05 /157.95 | 1002 /889 |

Baseline Elite46.02–47.92s,452–458kills cuối run. Q8B Elite125s, sáu Draft20/50/85/120/155/190s cho các lượt sống; Ranged chỉ tới Draft5. Clear liên tục không bỏ qua run, nhưng có rủi ro chết thật.

**Giới hạn quan trọng:** Victory mục tiêu4:30–5:00 **chưa được chứng minh đạt**. Bot hiệu quả giết Boss chỉ5–13s, thắng3:46–3:53 dù arrival đúng3:40. Không thể bảo đảm duration này cho build mạnh với Boss tới≤4:00, giữ nguyên Boss/build và Victory lập tức. User đã xác nhận “Giữ mục tiêu mềm; cho phép thắng sớm” ngày2026-10-26. Victory4:30–5:00 là mục tiêu mềm; giữ Victory ngay khi hạ Boss trước deadline, không khóa thời gian hoặc thêm chờ sau Boss chết. Lượt bot thắng sớm được phép theo quyết định này. Quyết định mục tiêu mềm không tự là acceptance; user sau đó đã xác nhận “oki duyệt q8b”. Giữ evidence/giới hạn kỹ thuật, không mở Q8C.

## Validation

- `npm test`:16files PASS, bao gồm tests mới bank9999kills không bypass floor, cả6draft chỉ một lần/freeze/reset, fallback không kills, encounter floor/cleanup, mutual result/deadline. Fixtures tests cũ được đặt clock tới floor mới.
- `npm run build`: typecheck + production build PASS; warning chunk Phaser>500KB có sẵn.
- [Browser script](browser-check.mjs), [results](browser.json): Chromium1440×1000 và390×844, pause freeze,6Draft/fresh click sau grace1s/freeze, Boss≥220s, Victory→Replay, deadline→Replay; không errors/overflow. Đây là fixtures cấp kills/clock/bossSlain để test ranh giới, không natural input run; không chứng minh Safari/iOS/deviceFPS.
- Không thêm package/dependency/framework. Playwright chỉ cài tạm `/tmp/q8b-tools`. Script A/B cần compile baseline46a17ed vào `/tmp/q8b-baseline`, hiện tại vào `.test-build` qua `npm test`; không là replay framework.

## Playtest Q8B — ĐÃ USER ACCEPTED, GIỮ THAM CHIẾU

URL và deploy được ghi bên dưới. Chơi run mới, không dùng fixture cấp sẵn `playtest=tank/chain`. Có thể dùng `playtest=route-tank`, `route-sustain`, `route-counter`, `route-ranged`: chọn card hướng tương ứng ở Draft đầu, các lượt sau chọn gợi ý; route chỉ gợi offer, không cấp build/resources đầu run. Chọn Keep ở Curse2 nếu muốn chỉ một Curse.

1. Thử ít nhất một run clear nhanh và một run thường: Draft xuất hiện trong các cửa sổ bảng; không bị dồn card liên tiếp dù đã dư kills. Sau Draft6 có thời gian sử dụng build trước Boss, combat tiếp tục có quái.
2. Boss tới3:40–4:00 simulation, không trước3:40. Ghi thời điểm Boss, Victory/Defeat, kills cuối run và route. Victory4:30–5:00 là mục tiêu mềm đã được user xác nhận; thắng trước4:30 được phép, vẫn ghi thời điểm để đánh giá nhịp run. Báo nếu quá khó tới Boss.
3. Pause giữa run rồi Resume: timer đứng khi pause; Draft đứng timer, chọn bằng thao tác mới sau1s. Replay từ Victory/Defeat về run mới sạch kills/build/timer. Desktop WASD/chuột + specials hiện có; mobile di chuyển+bắn/giữ-thả như trước.
4. Báo route + thời điểm/số kills + bước/vấn đề, thiết bị/browser. Không yêu cầu duyệt lại artwork/Q8A; không có warning2s/Enraged Q8C ở bản này.

## Deploy

Code `eb6fbbe5bb3e52c7d5738f3ccf6fb9339c395265` đã push main fast-forward. [Pages40341327061](https://github.com/gizgity/a-new-game/actions/runs/40341327061), job121636501339 completed/SUCCESS, gồm bước Deploy. Connector list commit runs chỉ lọc PR nên trảrỗng; đã đọc trang Actions qua github.com và xác minh job qua connector. `gh` API bịproxy Forbidden; khôngbypass.

Chơi: https://gizgity.github.io/a-new-game/?v=eb6fbbe . Route ví dụ: https://gizgity.github.io/a-new-game/?v=eb6fbbe&playtest=route-tank (đổi route-sustain/route-counter/route-ranged). Production dist local390/1440 Start/HUD milestones/errors/overflow PASS. Livecurl bịproxy CONNECT403 như các lượt trước; workflow SUCCESS là bằng chứng deploy, không giả local smoke thành live. Deploy không là user approval.
