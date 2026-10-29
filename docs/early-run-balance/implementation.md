# Cân bằng bốn hướng chơi — bản triển khai 2026-10-29

User cho phép triển khai: “làm theo đề xuất, đảm bảo cần bằng ở cả 4 hướng chơi, tỉ lệ thắng nên gần bằng nhau, hiện tại range hơi hụt”. Baseline mới nhất đã đồng bộ **3c8203f**, giữ Q12B/Q12C được duyệt. Các khảo sát trên893d744 ở README/remaining-routes là lịch sử, không phải thông số production sau lượt này.

## Thay đổi cuối

| Thông số | Trước | Sau |
|---|---:|---:|
| Grunt / Leap / Archer / Volatile damage lên player |12 / 6 / 10 / 16|9 / 5 / 8 / 12|
| Dash, hồi mỗi charge |2,8 s|2,2 s|
| Iron Oath nhân hồi Dash |1,3 (3,64 s)|1,15 (2,53 s)|
| Trần heal chung /10 s |8 HP|12 HP|
| Reclaimer / Parasitic mỗi lần kích hoạt |3 / 2 HP|4 / 3 HP|
| Blood Pact mỗi lần / trần riêng10 s |2 / 6 HP|3 / 9 HP|
| Archer chốt hướng cuối windup |theo đến lúc bắn|chốt250 ms cuối|
| Tốc độ đạn Archer |310|280 world px/s|
| Specialist phòng thủ |không có|Charged Detonate thực gây damage tạo6 Barrier, hồi2 s|

Specialist vẫn cần Charged/ammo và nổ trúng mục tiêu sống. Bắn hụt, nổ rỗng, Basic, Mutation không có hoặc nhiều hit trong hồi chiêu không tạo thêm Barrier. Dùng chung cap30, Oath nhân một lần, không hồi HP. Cooldown chỉ tiến khi simulation chạy; reset run xóa trạng thái. Có thể kết hợp với các Mutation/Curse phòng thủ khác nhưng vẫn chịu chi phí damage/slot của chúng. Mô tả vi/en đã đồng bộ.

Giữ damage đạn player20/84, Specialist bonus25%, Glass Soul75HP/+30%, Aegis4/s và damage tax, cap30, hai charge Dash/i-frame0,18 s; giữ Boss/Elite damage, HP, timeline, waves, Leap cadence/geometry, growth, input và các milestone/audio/art đã duyệt. Common damage giảm cho toàn run, không có ưu đãi theo thiết bị hay class.

## Đối chiếu cả bốn hướng

[Harness](four-routes.mjs): cùng seed và cadence quyết định300 ms, fresh profile, mở khóa và cập nhật pool ngay trong run, draft tự roll và đạt milestone thật; không grant resources/offers/Legacy/Anomaly/Ascension. Mỗi đường chỉ khác ưu tiên build và cách giữ khoảng cách phù hợp. Melee tiến65px; Ranged giữ190–260px với common và330–420px khi thấy Boss. Quy tắc Boss này sửa lỗi bài thử cũ đặt Ranged gần tầm chém230px; **đã chạy lại cả baseline và final cùng quy tắc**, không chỉ đổi policy cho bản mới.

8 seed development để thử thông số; **16 seed holdout được ghi trước tuning**, chỉ đo sau khi chốt source, không sửa tiếp thông số sau kết quả holdout. Cả baseline và final mỗi bên192 full run holdout =4đường×3cáchdash×16seed. Development96 full run mỗi cấu hình. Seed chủ yếu đổi draft, không là mẫu người chơi/layout độc lập.

Mục tiêu kỹ thuật: chênh lệch tỷ lệ thắng tối đa giữa4đường≤15 điểm% ở `observed`, kiểm phụ khôngdash≤25 điểm%. `Observed` đọc nguy hiểm160ms kế tiếp mỗi300ms; không đại diện đầy đủ phản xạ người. `Reflex` đọc mỗi tick là đối chứng máy. Bot aim theo tọa độ quái nên tỷ lệ thắng cao, **không phải tỷ lệ thắng thực của người chơi**.

| Hướng / observed | Baseline | Final |
|---|---:|---:|
| Tank |16/16 (100%)|16/16 (100%)|
| Sustain |8/16 (50%)|16/16 (100%)|
| Counter |8/16 (50%)|14/16 (87,5%)|
| Ranged |9/16 (56,25%)|15/16 (93,75%)|

Chênh lệch observed **50→12,5 điểm%**, đạt mục tiêu kỹ thuật đã đặt. Trong development final:8/8,7/8,8/8,8/8. Không chỉnh bot riêng sau khi xem kết quả để ép tỷ lệ ngang nhau.

| Hướng / khôngdash | Baseline | Final |
|---|---:|---:|
| Tank |16/16|15/16|
| Sustain |8/16|16/16|
| Counter |11/16|14/16|
| Ranged |2/16|12/16|

Khôngdash final spread25 điểm%, ở giới hạn kiểm phụ; chưa thể nói bốn đường hoàn toàn ngang nhau nếu bỏ hẳn né. Reflex final16/16,16/16,14/16,16/16; Counter reflex baseline15/16→14/16 là một regression trajectory cần ghi rõ. Tank khôngdash16→15 cũng vậy. Cả192run final còn sống tại100s, nhưng không từ đó suy người mới chắc chắn thắng. Ranged thường kết thúc muộn hơn melee, giữ khác biệt cách chơi.

Raw: [baseline holdout](evidence/four-baseline-holdout.json), [final holdout](evidence/four-final-holdout.json), [baseline development](evidence/four-baseline-development.json), [final development](evidence/four-final-development.json), [kiểm tra acceptance](evidence/four-verification.json).

Các thử nghiệm chưa đạt được giữ evidence: tăng DPS/Glass, tăng Specialist multiplier, giảm Leap cadence và giảm wave density. Không đưa các biến thể này vào production. Chỉ tăng output không giúp ổn định cả4đường trong mẫu; cuối cùng giữ output/waves và bổ sung khả năng phòng thủ cần tài nguyên cho Specialist.

## Validation

- **30 test files PASS**, gồm focused tests mới: Archer khóa hướng cuối windup và né bằng đi bộ khôngdash; Specialist chỉ nhận Barrier khi có actual blast damage, khóa multi-hit/cooldown, cap/Oath/freeze/reset/khôngMutation/nổrỗng. Các expected damage/heal/recharge cũ được cập nhật theo thông số mới, không xóa cơ chế kiểm thử.
- Typecheck/build PASS; Phaser chunk>500KB là warning hiện có. Source audio, feedbackQ12B, visuals và DDR không đổi.
- [Browser fixtures4viewport](evidence/final-browser.json):320×740,390×844,844×390touch và1440×1000desktop; vi/en mô tả, input Charged giữ→thả thật, cấp6Barrier đúngHUD, khôngtựheal, pause đóngbăng cooldown, khôngoverflow/pageerror. Có grant Mutation/ammo/target rõ ràng để kiểm cơ chế, **không phải natural run**. [Script](browser-final-check.mjs), ảnh `final-*.png` trongevidence.
- Playtest ngắn input thật ở [script](browser-routes.mjs), final-natural Counter/Ranged: seed808, mỗi91s wall đạt33,8s simulation, Counter/Ranged cùng100HP,108/106kills, mỗi lượt1dash, khôngpageerror. Đã chọn Mutation tự nhiên20s, chưa Curse/Boss/kết thúc run; chỉ là smoke đầu run, không chứng minh natural full-run acceptance. Raw/ảnh `final-natural-*.json/png`. Không chứng nhận iOS/Safari/thiết bị thật/FPS/human feel từ Chromium softwareWebGL.

## Thử sau deploy

Mở run mới (tab ẩn danh để thử progression mới hoàn toàn). Tại20–30s chọn từng hướng; Curse đầu50–60s, quan sát đến85–100s khi còn1Mutation+1Curse. Đi bộ + Melee/Basic, dùng Heavy/Charged kiếm được; Dash để thoát cụm, không cần spam đúng từng telegraph. Ranged: giữ khoảng cách, tích đạn bằng Basic rồi giữ/thả E hoặc nút Charged bắn vào cụm; nổ gây damage được6Barrier, tối đa một lần/2s. Bắn hụt/nổ rỗng không tạo khiên; Barrier không tự hồi HP.

Mong đợi: sustain bù được thêm lỗi nhỏ, Tank vẫn đánh đổi damage, Counter còn thưởng perfect thật, Ranged có cơ hội sống/clear mà ít lệ thuộc né chuẩn. Boss vẫn là thử thách; thông số bot gần nhau chưa là user acceptance. Phản hồi ngắn: hướng/Mutation+Curse, mốc chết hoặc thắng, tình huống bị dồn và thiết bị/browser.

## Chạy lại

```bash
npm test
BALANCE_POLICY=bossSafe BALANCE_SET=holdout BALANCE_OUTPUT=docs/early-run-balance/evidence/four-final-holdout.json node docs/early-run-balance/four-routes.mjs
npm run build
node docs/early-run-balance/browser-final-check.mjs
```

Baseline cần compile source3c8203f vào thư mục riêng và đặt `BALANCE_MODULE_ROOT` cho harness; không chạy `experiments.py` cũ trên source mới (script đó dùng các literal baseline cũ và cố ý assert nếu baseline đã đổi).
