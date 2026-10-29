# Khảo sát cân bằng run đầu — 2026-10-29

> **Khảo sát lịch sử.** User đã cho phép triển khai; thông số/kết quả mới nhất tại [bản triển khai bốn hướng](implementation.md). Các câu “chưa đổi source/deploy” bên dưới mô tả thời điểm khảo sát.

**Đề xuất để review, chưa đổi source gameplay hoặc deploy.** Baseline `893d744`, runtime Q12A accepted giữ nguyên. Mục tiêu: đo đoạn 1 Mutation + 1 Curse với ít/không dash, đề xuất giảm phụ thuộc phản xạ mà vẫn cần di chuyển/đánh đúng. Acceptance của khảo sát: có dữ liệu baseline, so sánh cấu hình thử và giới hạn kiểm chứng; không tự nghiệm thu balance.

**Bổ sung theo yêu cầu test hai đường còn lại:** xem [Counter/Ranged, 256 run và browser input thật](remaining-routes.md). Có cập nhật pool ngay trong run và rotation riêng; kết quả mới không so trực tiếp với bot cũ như cùng một thí nghiệm. Counter hưởng lợi từ V1; Ranged còn phụ thuộc né, chưa coi V1 cân bằng đủ mọi đường.

## Cách đo

- `npm test` baseline: **28 test files PASS**. Compile `.test-build` dùng simulation production `CombatWorld` + `RunDirector`.
- [Script đo](measure.mjs): mỗi cấu hình 60 run = 5 policy × 4 ưu tiên draft × 3 seed17/808/2026. Fresh-profile pools cố định đầu run để kiểm soát thí nghiệm, không Legacy/Anomaly/Ascension, không grant HP/Barrier/kills, không ép offer. Draft thật tại milestone; ưu tiên build mong muốn nếu có, fallback offer đầu. Seed chỉ ảnh hưởng draft: nhiều nhánh có cùng diễn biến, **không phải 60 mẫu độc lập hoặc win rate người chơi**.
- Quyết định mỗi300ms, aim target gần nhất; giữ Melee+Basic, Heavy/Surge mỗi3s; không Charged. Stationary là stress; approach tiến tới65worldpx; orbit giữ khoảng190–260px; slowDash theo lịch3s, không đọc telegraph; reflex đọc `imminentThreat()` mỗi tick là đối chứng phản xạ máy. Policy chung cho mọi build nên đặc biệt **không đại diện chiến thuật ranged tối ưu**.
- Window `onePlusOne` đo đúng số Mutation/Curse đang sở hữu, phần lớn50–85s. HP damage thực nhận, heal thực từ proc (không cộng10HP draft), Barrier thực tạo (không đồng nghĩa toàn bộ đã hấp thụ). Clocks có hitstop; không gọi tất cả là DPS theo thời gian combat không đóng băng.
- [Browser input thật](browser-play.mjs): Chromium1440×1000/softwareWebGL, profile riêng, seed do ticket production sinh, không dash, input keyboard/mouse khoảng300ms, RAF thật; không manual-step hay chỉnh resources. Kết quả tại [browser.json](evidence/browser.json) và [ảnh cuối](evidence/browser-final.png). Không phải human playtest, thiết bị thật, iOS/Safari hoặc FPS thiết bị. Browser dùng hướngWASD lượng tử hóa nên không kỳ vọng khớp tuyệt đối vector của bot simulation.

Browser thực tế đã chạy211s wall, screenshot ở khoảng156s simulation; dừng theo budget, **chưa kết thúc run/Boss**. Khôngpageerror. Draft20sReclaimer,50sParasitic,85sPhantom,120sEcho,155skeepParasitic. Từ50s(pre-choice)→80.15s: HP84→23, enemy damage tăng90, proc heal tăng24, thêm5HPdraft. Tại120s còn4HP. Đây là tái hiện cụ thể sustain hụt, không khẳng định mọi cách chơi đều chết. Seed không được lưu ở lượt đầu: override808 trước bấm Start bị ticket ghi đè; script đã sửa để các lượt sau ghi seed thực. Không gọi browser là replay seed808.

**Giới hạn pool của simulation:** production `Progression.observe()` có thể mở Guard Breaker/Death Echo/Static Riposte ngay trong run rồi cập nhật pool. Script đo giữ pool fresh ban đầu, chưa mô phỏng cập nhật này hoặc draft-history profile. Vì vậy300run là thí nghiệm có kiểm soát trên combat thật, không phải300lượt end-to-end production; browser ở trên mới đi qua progression/input thật.

## Phát hiện baseline

1. **Sustain bị giới hạn mạnh:** chung8HP/10s cho Reclaimer/Parasitic/Blood. Blood riêng6HP/10s; các nguồn không cộng trần. Reclaimer còn cần kill target có Rupture; chỉ spam đánh không đảm bảo hồi. Damage một Grunt12, Archer10, Volatile16, Leap6 trước tăng trưởng: một lần trúng thường đã vượt trần hồi cả10s.
2. **Barrier không yếu đồng đều:** Aegis chuyển actual melee damage, cap4Barrier/s, chịu damage tax20%. Aegis+Oath damage×0.6; dash3.64s. Tuy vậy approach Aegis+Oath seed808/2026 không mất HP ở50–85s. Không có bằng chứng nên buff toàn bộ khiên; cách tiếp cận/aim ảnh hưởng mạnh hiệu quả.
3. **Cú dốc60–120s:** HP quái thường từ opening36/28/36 tăng về66/48/48; enemy growth cũng bắt đầu60s. Trong khi đó draft thứ2 Mutation sớm nhất85s/fallback100s: đoạn đầu ramp chỉ có1+1. Đây là tăng đồng thời áp lực clear và sát thương, chưa nên chữa bằng tăng charge dash đơn thuần.
4. Dash hồi **từng charge nối tiếp**: 2.8s/charge, cạn2 cần5.6s; Oath3.64/7.28s. Dash bảo vệ0.18s; hurt protection0.65s. Dash theo lịch có thể lao vào cụm quái, không mặc định tốt hơn không dash.

Ví dụ baseline approach, window50–85s, seed808:

| Build thực có | HP mất | HP hồi từ proc | Barrier tạo |
|---|---:|---:|---:|
| Blood Reclaimer + Parasitic Mark |91|21|0|
| Aegis Core + Iron Oath |0|0|42|

Approach sustain seed17 không roll được Parasitic: nhận Volatile Soul. Mọi raw report giữ draft thực; không gộp thành cùng build cố định. Đứng yên chết khoảng31–39s baseline, chưa kịp Curse: đây là stress, không là trải nghiệm người chơi điển hình.

## Cấu hình đề xuất V1

| Thông số | Hiện tại | Đề xuất |
|---|---:|---:|
| Grunt thường / Leap |12 / 6|9 / 5|
| Archer / Volatile damage lên player |10 / 16|8 / 12|
| Trần heal chung /10s |8|12|
| Reclaimer / Parasitic mỗi proc, giữCD2s |3 / 2|4 / 3|
| Blood Pact mỗi proc / trần riêng10s |2 / 6|3 / 9|
| Dash hồi mỗi charge |2.8s|2.2s|
| Oath nhân hồi dash |1.3|1.15 (2.53s/charge)|

Giữ2charge và0.18s bảo vệ dash; giữ perfect reward, damage tax và chặn Blood heal khi có Barrier. Chưa tăng Barrier/rate/cap, chưa giảm Boss/Elite, không đổi spawn/milestone/HP quái/growth. Giảm base damage **quái thường cho toàn bộ run**, không chỉ phút đầu; giữ growth hiện tại. Nếu triển khai phải đưa damage/dash về config tập trung và đồng bộ mô tả vi/en.

Lý do chọn: hỗ trợ cả người đi hướng damage/counter chưa có hồi, thay vì bắt buộc pick sustain; trần heal12 vẫn thấp hơn sát thương nhiều hit, cần di chuyển và clear. Đường khiên vốn có kết quả tốt nên chỉ hưởng giảm áp lực chung và bớt penalty dash. Không thêm auto-dodge hay difficulty theo thiết bị.

## Thử A/B tạm

[experiments.py](experiments.py) chỉ sao compiled modules sang `/tmp/early-balance-*`, không sửa `src/`. Mỗi variant chạy cùng60kịch bản, tổng300run gồm baseline.

- `sustain`: trần16/10s, Blood12/10s; proc4/3/3, không giảm damage/dash.
- `comfort`: dash2.2s, Oath1.15, hurt protection0.8s, không giảm damage/tăngheal.
- `combined`: ghép hai nhóm trên.
- `candidate`: bảng V1, **giữ hurt protection0.65s**. Chưa thấy lý do đủ mạnh để tăng thêm i-frame.

| Kịch bản,3seed | Baseline: kết thúc trung vị / thắng | V1: kết thúc trung vị / thắng |
|---|---:|---:|
| Sustain approach, khôngdash |101.3s / 0 trên3|231.8s / 2 trên3|
| Sustain orbit, khôngdash |209.1s / 0 trên3|261.7s / 0 trên3|
| Sustain dash lịch3s |116.6s / 0 trên3|235.1s / 2 trên3|
| Counter dash lịch3s |109.8s / 0 trên3|231.8s / 2 trên3|
| Tank approach, khôngdash |247.3s / 3 trên3|247.3s / 3 trên3|

Thời gian kết thúc gồm cả thắng/thua; không diễn giải là thời gian sống tăng nếu run đã thắng. Sustain approach seed808: V1 đoạn1+1 mất70HP, hồi24HP (baseline91/21), vẫn mất ròng46HP; lợi ích còn nằm ở sống qua draft để hoàn thiện build. Candidate stationary vẫn chết36–48s. Sustain orbit vẫn thua ở246–262s; ranged policy chung vẫn thua mọi seed: **chưa đủ chứng cứ cân bằng mọi build hoặc đảm bảo hoàn thành run**.

Buff heal16 đơn lẻ cho approach sustain chỉ1/3thắng; comfort chỉ0/3. Candidate12+giảm common damage cho2/3, vì vậy ưu tiên giảm áp lực quái thường hơn tăng heal vô hạn/tăng số dash. Các thay đổi AI/va chạm/hitstop khiến kết quả phi tuyến; không coi chênh lệch vài giây là hiệu ứng chắc chắn của một thông số.

Raw: [baseline](evidence/baseline.json), [sustain](evidence/sustain.json), [comfort](evidence/comfort.json), [combined](evidence/combined.json), [candidate](evidence/candidate.json).

Chạy lại từrootrepo:

```bash
npm test
node docs/early-run-balance/measure.mjs
python docs/early-run-balance/experiments.py
BALANCE_MODULE_ROOT=/tmp/early-balance-candidate BALANCE_OUTPUT=docs/early-run-balance/evidence/candidate.json node docs/early-run-balance/measure.mjs
npm run dev -- --host 127.0.0.1
node docs/early-run-balance/browser-play.mjs
```

Phạm vi tiếp theo khi triển khai V1: focused checks heal budget/chặn double sustain/volatile damage/dash recharge, typecheck/build, browser mobile+desktop rồi thử run mới thật với sustain/tank. Tại50–100s kiểm di chuyển thường + Melee/Basic, Heavy có chủ đích, dash chỉ thoát cụm; mong đợi chịu được vài lỗi mà không đứng tank vô hạn. Theo dõi riêng Boss và ranged; không dùng3seed để tự accepted hay đổi thêm progression/art/audio.
