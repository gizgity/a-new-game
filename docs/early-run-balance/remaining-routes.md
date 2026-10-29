# Bổ sung Counter và Ranged — 2026-10-29

> **Khảo sát lịch sử.** User đã cho phép triển khai; thông số/kết quả mới nhất tại [bản triển khai bốn hướng](implementation.md). Các câu “chưa đổi source/deploy” bên dưới mô tả thời điểm khảo sát.

User: “sẳn thì test lun 2 đường còn lại xem thế nào”. Goal: kiểm hai đường với cách đánh phù hợp, so baseline và V1, ghi dữ liệu và giới hạn. **Chỉ khảo sát, chưa sửa gameplay hoặc deploy.** Baseline source `893d744`; V1 là compiled modules tạm từ [experiments.py](experiments.py).

## Cách thử

[remaining-routes.mjs](remaining-routes.mjs) chạy **256 full run simulation**: 128 run chính (2 đường × 4 chế độ dash × 8 seed × 2 cấu hình), 64 run Ranged đứng xa và 64 run Ranged kết hợp cận chiến. Seed 17/73/159/314/808/1337/2026/4096 chỉ ảnh hưởng draft, không phải 8 layout độc lập. Fresh profile, có `Progression.observe()` và cập nhật pool khi mở khóa ngay trong run; có Charged/Surge kiếm được. Không grant resources/build, không ép offer, không Legacy/Anomaly/Ascension. Khảo sát trước giữ pool fresh ban đầu: **không so trực tiếp kết quả hai script như hiệu ứng riêng của tuning**.

- **Counter:** mở Phantom Edge, ưu tiên Ghost Step, Static Riposte rồi Iron Reversal/Kinetic; chỉ lấy nếu offer thật có. Tiến đánh cận chiến, kết hợp Basic/Charged/Heavy/Surge. Phantom/Static cần perfect dodge; bỏ dash thì hiệu ứng phản đòn không kích hoạt.
- **Ranged:** mở Detonation Specialist, ưu tiên Glass Soul rồi Catalyst/Echo/Kinetic/Parasitic theo offer. Giữ 190–260 world px, Basic+Charged, chỉ chém khi gần 130 px; steer trở vào sân khi sát biên. Test phụ giữ 320–400 px và hybrid 80–130 px. Charged cũng tự gắn 1 Rupture rồi kích nổ nên giữ xa vẫn dùng được Mutation mở đầu.
- Di chuyển/aim quyết định mỗi 300 ms. Dash: `none` tắt; `scheduled` theo lịch 3 s; `observed` đọc nguy hiểm trong 160 ms kế tiếp mỗi 300 ms; `reflex` đọc mỗi 16,7 ms là đối chứng máy. Observed không mô phỏng đầy đủ thời gian nhìn thấy→quyết định→bấm của người. Bot aim theo tọa độ quái thật.
- V1 giảm common damage, nới heal/dash như [bảng đề xuất](README.md#cấu-hình-đề-xuất-v1); giữ Boss/Elite/mốc spawn/HP quái. Clock run có hitstop. Cùng policy/seed giữa baseline và V1.

## Kết quả chính

Số lượt hạ Boss trước deadline / 8 kịch bản; **không phải tỷ lệ thắng dân số**:

| Đường / cách dash | Baseline | V1 |
|---|---:|---:|
| Counter / không dash |3/8|6/8|
| Counter / lịch 3 s |2/8|6/8|
| Counter / nguy hiểm mỗi 300 ms |4/8|7/8|
| Counter / phản xạ máy mỗi tick |7/8|8/8|
| Ranged 190–260 / không dash |0/8|2/8|
| Ranged 190–260 / lịch 3 s |1/8|1/8|
| Ranged 190–260 / nguy hiểm mỗi 300 ms |3/8|4/8|
| Ranged 190–260 / phản xạ máy mỗi tick |8/8|6/8|

V1 không tốt hơn trong mọi trajectory: hai Ranged reflex V1 chết bởi Boss ở 230,0/230,8 s, Boss còn 277,2/1044,8 HP. Dash hồi nhanh làm đổi đường đi, kill/draft/phase và lúc cạn charge; giảm damage không đảm bảo tăng số thắng mọi seed. Không che hai kết quả này bằng gộp số thắng chung.

**Counter:** V1 giúp 6/8 kịch bản không dash thắng nhờ combat/build còn lại, không chứng minh Phantom/Static hữu ích khi không né. Window 1+1 không dash: median HP damage 32→24,5. Dash lịch 3 s chỉ đạt 1–3 perfect/run baseline; observed đạt 3–11. Chưa cần buff damage Counter hay tự kích hoạt perfect.

**Ranged:** không dash, median kết thúc 116,1→173,9 s (trộn thắng/thua, không gọi chung là thời gian sống). Window 1+1 median HP damage 40→32. **Baseline cả 8 seed còn 50 HP tại Curse 50 s, trước chọn Glass hoặc Curse khác**; V1 còn 60 HP. Khó khăn đã có từ phút đầu, không thể quy hết cho Glass Soul 75 HP. Charged đã được bắn thường xuyên; lượt trước không dùng Charged chưa đủ để kết luận thiếu damage.

## Ranged: đổi khoảng đứng

| Khoảng đứng / dash | Baseline | V1 |
|---|---:|---:|
| Xa 320–400 / không dash |0/8|0/8|
| Xa 320–400 / lịch 3 s |0/8|1/8|
| Xa 320–400 / nguy hiểm mỗi 300 ms |1/8|2/8|
| Xa 320–400 / phản xạ máy |7/8|8/8|
| Hybrid 80–130 / không dash |3/8|3/8|
| Hybrid 80–130 / lịch 3 s |0/8|3/8|
| Hybrid 80–130 / nguy hiểm mỗi 300 ms |4/8|5/8|
| Hybrid 80–130 / phản xạ máy |7/8|7/8|

Đứng xa không tự an toàn trong policy này. Hybrid có Rupture/cận chiến tốt hơn nhưng chưa giải quyết mục tiêu ít phản xạ. Steer/đổi target của bot có thể tạo đường đi bất lợi; chưa loại trừ chiến thuật Ranged tốt hơn, không từ đó tự chốt nerf AI hoặc buff đạn.

## Browser thật

[browser-routes.mjs](browser-routes.mjs): hai context Chromium riêng, 1440×1000/softwareWebGL; mỗi context fresh profile chỉ có ticket first-run seed 808, không unlock/resource grants. Ticket nạp trước boot để tránh main ghi đè seed. Counter cận chiến và Ranged 190–260; WASD/mouse/Space, Special giữ 100 ms→thả; RAF thật, không manual step. Baseline only, V1 chỉ simulation. Budget mỗi lượt 180 s wall; không suy FPS/latency thiết bị hoặc mobile acceptance từ lượt này.

Raw/ảnh: [Counter](evidence/browser-counter.json), [ảnh Counter](evidence/browser-counter.png), [Ranged](evidence/browser-ranged.json), [ảnh Ranged](evidence/browser-ranged.png). Cả hai lượt dừng theo budget ở khoảng 61,6–61,7 s simulation, chưa Boss/kết thúc run, không pageerror. Counter có Phantom + Volatile Soul (không roll Ghost), còn 62 HP, 7 dash/3 perfect; Ranged có Specialist + Glass Soul, còn 10/75 HP, 10 dash/3 perfect. Ngay trước Curse 50 s, Ranged chỉ còn 20 HP, Counter 70 HP. Đây là tái hiện nguy cơ sống sót phút đầu, không phải so sánh hai build hoàn chỉnh. Ảnh Ranged cuối lượt có tình huống bị ép gần biên; cách steer/aim/input của bot là yếu tố cần giữ trong giới hạn kết luận. Chưa kiểm riêng từng lần Special thực thi trên browser; số Charged/hiệu ứng trong bảng phân tích lấy từ simulation đã instrument.

## Đề xuất sau thử

1. **Counter:** giữ phương án V1, chưa cần buff riêng. Người ít dash được hưởng giảm áp lực chung; build phản đòn vẫn thưởng cho perfect thật.
2. **Ranged:** V1 giúp nhưng **chưa đủ bằng chứng đạt mục tiêu ít phản xạ**. Chưa tăng damage đạn/giảm Boss: đối chứng reflex baseline đã 8/8, khó sống xuất hiện trước Curse. Lượt tuning tiếp nên ưu tiên áp lực truy đuổi/projectile/Leap trong phút đầu và cơ hội thoát cụm, giữ damage output làm đối chứng; chưa chốt thông số riêng chưa đo.
3. Glass Soul không mặc định là lựa chọn an toàn khi máu thấp; bot vẫn ưu tiên Glass nếu có. Cần kiểm người chơi chọn Curse theo tình trạng trước khi đổi luật. Không suy mọi người chơi Ranged đều phải thua từ policy này.

Validation: kiểm JSON/result/counts/seed/không NaN, `node --check`, `git diff --check`. Không chạy lại build/tests source khi không đổi runtime; baseline 28 test files PASS từ khảo sát trước giữ nguyên, không gọi là lượt test mới. Không user acceptance/device/mobile mới.

## Chạy lại

Từ root repo, sau `npm test` nếu chưa có `.test-build`, rồi `python docs/early-run-balance/experiments.py`:

```bash
node docs/early-run-balance/remaining-routes.mjs
BALANCE_MODULE_ROOT=/tmp/early-balance-candidate BALANCE_OUTPUT=docs/early-run-balance/evidence/remaining-candidate.json node docs/early-run-balance/remaining-routes.mjs
BALANCE_SPACING=far BALANCE_OUTPUT=docs/early-run-balance/evidence/ranged-far-baseline.json node docs/early-run-balance/remaining-routes.mjs
BALANCE_SPACING=hybrid BALANCE_OUTPUT=docs/early-run-balance/evidence/ranged-hybrid-baseline.json node docs/early-run-balance/remaining-routes.mjs
```

Cho far/hybrid V1 thêm `BALANCE_MODULE_ROOT=/tmp/early-balance-candidate` và đổi output thành `*-candidate.json`. Browser cần Vite local port 5173 rồi `node docs/early-run-balance/browser-routes.mjs`.

Raw đầy đủ: [baseline chính](evidence/remaining-baseline.json), [V1 chính](evidence/remaining-candidate.json), [xa baseline](evidence/ranged-far-baseline.json), [xa V1](evidence/ranged-far-candidate.json), [hybrid baseline](evidence/ranged-hybrid-baseline.json), [hybrid V1](evidence/ranged-hybrid-candidate.json).
