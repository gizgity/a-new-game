# Q7D — Full Run Experience Polish

User giao ngày 2026-10-26, baseline `main@688f331`. Q2–Q7C giữ ACCEPTED; Q7D đã user accepted qua “đã đạt q7d” ngày2026-10-26 trên66e0799, không mở Q8. [Contract](../../GAME_BRIEF.md#q7d-design-contract--full-run-experience-polish).

## Audit và ba ưu tiên

1. **Âm thanh chuyển mốc:** trước đây chỉ Victory có cue. Thêm Start, Draft, chọn card, Elite, Boss, Defeat; dừng âm đòn cũ khi đổi phase, Resume im lặng. Dùng cache ProceduralAudio hiện có, giữ mute/volume/autoplay và giới hạn combat mix. Đây là bổ sung polish, không phải lỗi balance.
2. **Kết thúc sạch:** fixture xác nhận remnant Boss vẫn còn 0.28s sau khi Victory hiện 1.5s, vì simulation dừng. Chỉ cho death remnant fade xong sau result, dọn slash/muzzle/dash echo; không tick gameplay thêm. Giữ artwork Q7C và Victory reveal 1100ms.
3. **Panel và Replay liên tục:** panel mới nhận focus heading và cuộn về đầu; locale/settings rerender giữ tương tác. Cập nhật HUD/canvas ngay khi đổi phase để Replay không chờ frame sau. Baseline tái hiện thiếu focus, chưa tái hiện lỗi scroll; reset scroll là polish phòng ngừa. CSS chỉ bỏ UA focus ring ở heading programmatic; nút giữ focus ring.

Không đổi CombatWorld, RunDirector, config, Draft, AI, effects, input, balance hoặc assets. Không artwork mới, nhạc, cutscene, content, dependency hay QA framework. Script kiểm tạm nằm ngoài repo.

## Input runs thực tế

Bot chỉ đọc state/vị trí/threat để điều khiển bằng input browser; không grants HP/kills/build, không override clock. Bot có lợi thế đọc predicate Perfect nên không được coi là human playtest.

| Run | 6 Draft (giây simulation) | Elite | Boss | Kết quả |
| --- | --- | --- | --- | --- |
| Baseline 688f331 | 13.47 / 43.87 / 81.78 / 111.02 / 140.25 / 167.15 | 103.42s, 204 kills | 193.73s, 453 kills | Defeat 219.82s, 472 kills |
| Sau sửa desktop 1100×850 | 13.42 / 41.07 / 77.92 / 106.80 / 136.88 / 164.90 | 100.12s, 200 kills | 186.32s, 450 kills | Victory 199.42s, 458 kills, 39 HP |

Desktop sau Victory: Replay về 0 build/kills; ngừng tấn công để Defeat tự nhiên ở 9.95s, rồi Replay tiếp. [Baseline log](evidence/audit-input-run.json), [desktop log](evidence/desktop-input-run.json), [Victory](evidence/desktop-victory.png), [Defeat](evidence/desktop-defeat.png). Script baseline thiếu offset zoom khi ngắm; đã sửa harness ở lượt sau, không suy ra thay đổi balance từ hai kết quả.

Mobile390×844: CDP joystick + Chém/Bắn giữ và specials giữ-thả, đủ6draft ở12.30/38.62/78.12/107.25/136.57/163.18s, Elite98.53s/200kills, Boss182.88s/451kills, Victory194.12s/458kills/85HP. Replay → naturalDefeat9.95s → Replay PASS. [Log](evidence/mobile-input-run.json), [Victory](evidence/mobile-victory.png), [Defeat](evidence/mobile-defeat.png). rAFmedian16.7ms/p95 xem log, chỉ software WebGL. Các lượt harness lỗi TouchEnd dư hoặc phase đổi trong lúc đọc tọa độ nút không được tính PASS; đã sửa harness, không sửa controls.

## Validation và fixture

- Build/typecheck và `npm test`: PASS, 15 files / 163 test definitions hiện có. Core/config/run/controls/i18n/assets không diff. Phaser chunk >500KB là warning có sẵn.
- [Edge fixtures](evidence/edge-fixtures.json): 320/390/844/768/1440, pause freeze, mute/volume, vi/en, draft grace, death fade và simulation freeze, deadline, Replay 8 vòng; không overflow/runtime errors, display list ổn định 29. **Fixture** cấp 25 kills, Boss slain hoặc ticks17999 để kiểm tình huống khó tái hiện; không natural run.
- [Death trước/sau](evidence/death-before-after.json): số đo riêng, chỉ có [ảnh sau](evidence/death-fixture-after.png). [Mobile Victory](evidence/mobile-victory-fixture.png) và [landscape deadline](evidence/landscape-deadline-fixture.png) cũng là fixture. Ảnh desktop Victory ban đầu còn UA focus ring; CSS cuối chỉ bỏ ring đó, không đổi bố cục.
- [Production dist](evidence/dist-smoke.json): 5 kích thước trên, assets/base `/a-new-game/`, Start/Pause/vi-en/Resume PASS; không lỗi request/runtime/overflow. Đã chạy lại sau CSS cuối.
- [WebAudio](evidence/audio.json): context running/unlocked, 7 cue buffers hữu hạn và khác 0; mỗi cue 1 voice, stop/mute còn 0 voice, volume0.25 PASS. Assertion ban đầu đọc gain trong cùng JS task trước audio quantum; đợi60ms rồi PASS, không sửa runtime. Chưa nghe âm trên loa/tai nghe thật.
- Performance desktop input run: rAF median16.7ms / p9566.6ms trong Chromium software WebGL, đồng thời chạy checks/screenshots. Đây không phải device FPS hoặc benchmark A/B. Không thêm texture/particle loop; audio buffers tạo một lần, Replay không tăng display list trong fixture.

Chưa xác minh Safari/iOS, nhiệt máy, độ mượt và tầm với trên thiết bị thật. Fixtures và build không thay user acceptance.

## Checklist playtest đã user chấp nhận — giữ tham chiếu

1. Start → đủ6draft: cue ngắn rõ, nhả tay rồi chọn card; sau draft không tự cast. Pause/resume giữa combat: timer đứng, không kéo tiếng đòn cũ.
2. Elite200kills HOẶC2:30, Boss450kills HOẶC4:00: có cue vào trận, đọc telegraph và giữ nhịp đã duyệt.
3. Hạ Boss trước5:00: death fade hết, Victory sau1100ms. Defeat doHP0 hoặc deadline rõ lý do. Chơi lại về build/resources/timer đầu, không ghost/cast cũ.
4. Mobile dọc/ngang và desktop: đổi vi/en, mute/volume qua Pause; panel cuộn/focus không kẹt. Nghe thử âm lượng và theo dõi độ mượt/nóng máy.

User đã xác nhận “đã đạt q7d” ngày2026-10-26. Dừng tại Q7D đã ACCEPTED, không mở Q8. Phát sinh mới ghi tình huống/bước gặp vấn đề, quan sát thực tế, thiết bị/browser.

## Bản bàn giao

**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “đã đạt q7d” ngày2026-10-26 trên bản code/deploy `66e0799` (handoff `bcfbfbe`), Pages40311723418 SUCCESS. Đây là approval trực tiếp của user, không suy ra từ build/tests/fixture. Không mở Q8.

Code `66e0799c65d1940692b94d9da8ac79f14550ca20` đã push main và [Pages40311723418](https://github.com/gizgity/a-new-game/actions/runs/40311723418) completed/SUCCESS, job121534293554 gồm Deploy. [Chơi bản Q7D](https://gizgity.github.io/a-new-game/?v=66e0799). Tài liệu bàn giao sau đó không đổi runtime.

Live smoke từ executor bị proxy CONNECT403; không bypass hoặc lấy local/dist làm bằng chứng live. Deployment được xác minh qua GitHub Actions. Q7D nay đã có user playtest approval; không suy rộng thành coverage mọi thiết bị/Safari. Q2–Q7C giữ nguyên.
