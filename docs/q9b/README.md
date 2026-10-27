# Q9B — Victory Rewards & Legacy Progression

Trạng thái: triển khai để user playtest; **AWAITING USER PLAYTEST APPROVAL**. User mở Q9B ngày 2026-10-27; không mở Q9C. Giữ Q9A accepted1a08448, toàn bộ tuning/combat/art và mobile layout baselinec3694ed.

- Victory đầu tiên trong economy Q9B mở 2 Sigil khác nhau; sau đó 1 ID chưa sở hữu, đủ dependency. Weight **từng ID**: Sigil5/Branch3/Anomaly2. Pity sau3Victory không Sigil bảo đảm Sigil ở Victory tiếp nếu còn; Defeat không đổi collection/pity.
- 6Sigil/12Branch và6Anomaly DD-0001; Fractured Storm/Blood Moon mở sẵn, **không Anomaly nào hoạt động trong combat**. Không Ascension/Cosmetic mới/reaction.
- Profile schema2, Legacy schema2; giữ storage key `cursebreak.save.v1` để migration tại chỗ từ schema1. Giữ settings, totals, mutation unlocks, draft history và ticket/seed/offers/choice Q9A. Không đổi các Victory lịch sử thành reward hồi tố; Victory đầu economy mới nhận2Sigil.
- Save chỉ IDs/progression/ticket/receipt, derive combat từ catalog Q9A. Allowlist/dependency,6/12/6catalog caps; counters≤1,000,000, pity≤3; run IDs tăng dần đến1,000,000 (hết cap không tạo run mới). Kết quả đóng ticket, receipt giữ tới khi tạo ticket mới. Refresh màn kết quả hiện lại đúng reward; không settle lại.
- Journal `cursebreak.pending.v2` ghi snapshot kết quả trước main save. Nếu main write lỗi, UI giữ kết quả, không cho run mới đến khi retry lưu thành công. Load phục hồi journal khi main còn ticket cùng run/đã hỏng; journal cũ không thay ticket mới. Nếu browser chặn **mọi** ghi storage, không thể bảo đảm giữ kết quả sau khi đóng/refresh: UI báo lỗi và giữ memory để retry. Không giả lập persistence thành công. Offline-only, không chống DevTools hoặc đồng bộ nhiều tab.
- Mọi `playtest`, `draftSeed`, `draftDebug` dùng profile memory riêng, không đọc/ghi save thật; không cấp unlock production.
- UI vi/en: reveal tên/loại/effect/trạng thái; collection trong menu/pause/result có6Sigil/12Branch vàAnomaly lưu chờQ9C. Cuộn trong panel, touch và keyboard/mouse dùng cùng luật.

## Delivery

Code `c0a8247` đã push main fast-forward; [Pages40444521840](https://github.com/gizgity/a-new-game/actions/runs/40444521840), job121992491794 completed/SUCCESS (build/typecheck/upload/Deploy). [Chơi Q9B](https://gizgity.github.io/a-new-game/?v=c0a8247). Chưa xác minh liveHTTP/hash từ môi trường; commit bàn giao sau chỉMarkdown, không redeploy.

## Validation

- `npm test`:214tests PASS, gồm5focused Q9B tests;200seed first Victory,80collection completions,30,000weighted samples; dependency/no duplicates/pity/exhaustion/Defeat/runID/migration/corruption/journal retry/stale journal.
- `npm run build` (gồm typecheck): PASS; warning chunk Phaser>500KB có sẵn.
- [Browser script](browser-check.mjs), [raw results](evidence/browser.json), screenshot `evidence/`:320×740,390×844,844×390 touch và1440×1000 desktop. Fixture kích hoạt predicate Victory/Defeat thật bằng state browser context; không cheat URL production. Kiểm reward→refresh→collection vi/en→newrun→2offers→tap/keyboard→refresh giữchoice; Defeat không đổicollection. Failure injection kiểm journal/main-save failure, chặn newrun vàVictory thứ2 nhận1unlock.
- Software WebGL/emulation/fixture không thay thiết bị thật, iOS/Safari, FPS/latency/thermal/audio hoặc user experience approval. Không tuning Q9A.

## User playtest

Dùng link Pages của commit bàn giao. Thử normal URL, không dùng `?playtest=...` vì preset không lưu progression. Có thể dùng tab ẩn danh để bắt đầu collection sạch mà không xóa save thật.

1. Run đầu không Sigil. Thắng Boss: màn Victory hiện2Sigil khác nhau với effect và trạng thái đã mở.
2. Refresh ngay màn Victory: vẫn2reward đó, collection không tăng. Bấm Chơi tiếp:2Legacy offers, chọn1; refresh rồi bắt đầu lại vẫn seed/offers/lựa chọn đó.
3. Victory tiếp theo:1unlock mới. Defeat: không thêm unlock; run tiếp tạo ticket/roll mới.
4. Trên mobile vàdesktop: mở/cuộn Bộ sưu tập, đổi vi/en; tên/effect/locked/unlocked rõ, nút chơi tiếp và2offers dễ thao tác. Báo bước lỗi + điều quan sát + thiết bị/browser.

Dừng tại **AWAITING USER PLAYTEST APPROVAL**, không tự mởQ9C.
