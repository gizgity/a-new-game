# BOSS-EASE-01 — Giảm độ khó Boss hiện tại

Revision 1 — 2026-11-13 — **APPROVED TO IMPLEMENT**.

User duyệt V1 qua “ok triển đi” sau bàn giao proposal/simulation trong hội thoại hiện tại (không permalink). Cho phép triển khai production V1; không tự suy user playtest acceptance. [Kết quả implementation](IMPLEMENTATION.md). Các đoạn chưa sửa source/chưa có URL phía dưới là snapshot của lượt proposal trước approval.

## Goal và phạm vi

Người chơi phản ánh chưa thắng Boss, đặc biệt phase 2. Mục tiêu: cho phép mắc lỗi và có thời gian né/phản công, vẫn cần chủ động chiến đấu. Đây là balance của game hiện tại, độc lập với redesign Combat V2/B1 đang chờ review; không mở milestone V2.

Acceptance của lượt này: đối chiếu code hiện tại, thử baseline/candidates bằng combat thật trong module tạm, lưu kết quả tái lập và đề xuất cụ thể để user duyệt. Chưa sửa `src`, chưa deploy, chưa có user playtest acceptance. Approval production phải đến từ user, không suy từ quyền auto-deploy lịch sử.

## Nguyên nhân quan sát được

Baseline source `78bc558782f45b957f8663202b69326182ad93cb`, thông số trong `src/game/config/balance.ts`, logic `CombatWorld.stepBoss`.

- 100 HP cơ bản; sweep 46, slam 50, mỗi viên đạn 18. Phase 2 không nhân damage nhưng tăng tốc đuổi 300→345, cooldown .55→.44 giây và nối slam→sweep.
- Followup gap .25 + windup .62 ≈ .87 giây sau slam; hurt protection .65 giây đã hết. Probe ép cả hai đòn trúng qua pipeline thật để lại **4 HP** trên nhân vật 100 HP không build. Với 60 HP sẽ chết; đây là hình phạt rất lớn cho hai lỗi liên tiếp.
- Recovery bình thường .32 giây nằm trong cooldown, không cộng thêm cooldown. Chỉ tăng recovery mà vẫn thấp hơn cooldown sẽ không nhất thiết giãn cả chu kỳ. Combo hiện hồi .75 giây sau sweep cuối.
- Đây là căn cứ cơ chế cho phản ánh, chưa xác định tỷ lệ chết hay nguyên nhân của từng người chơi vì không có telemetry người chơi.

## Đề xuất V1 — variant `candidate`

| Thông số | Hiện tại | V1 |
|---|---:|---:|
| Sweep / Slam / mỗi viên đạn, cả hai phase | 46 / 50 / 18 | **32 / 36 / 14** |
| Windup đòn thường phase 2 | .62s | **.80s** |
| Recovery đòn thường phase 2 | .32s | **.48s** |
| Cooldown phase 2, bao gồm recovery | .44s | **.65s** |
| Hệ số tốc đuổi phase 2 | 1.15 (345) | **1.05 (315)** |
| Khoảng nghỉ slam→sweep | .25s | **.45s** |
| Windup sweep nối | .62s | **.80s** |
| Recovery sau combo | .75s | **1.05s** |

Tổng damage slam+sweep 96→68, probe còn **32 HP**. Khoảng hai hit khoảng .87→1.25s; giữ aim lock và đủ telegraph. Phase 2 vẫn có combo và đuổi nhanh hơn phase 1, nhưng cho nhiều thời gian quyết định hơn. Giảm damage ở cả hai phase giúp người vào Boss với HP thấp; timing phase 1 giữ nguyên.

Giữ Boss 2400 HP, threshold 50%, transform 1.4s không hồi máu, ba loại đòn/15 viên đạn, projectile speed430, range/radius/leap, spawn/deadline300s. Không buff player, dash/i-frame, heal, build, quái khác, reward/progression, camera/art/UI/audio. Cùng balance trên touch và keyboard–mouse. Những mục này là phạm vi đề xuất V1, không phải khóa thiết kế vĩnh viễn.

## Thử nghiệm đã chạy

`python docs/boss-balance/experiment.py` từ root repository. Script compile TypeScript thật vào thư mục tạm, chỉnh export config **chỉ trong bản compiled tạm**, chạy rồi tự xóa. Hash toàn bộ `src` trước/sau giống nhau; revision/hash/variants trong [provenance](evidence/provenance.json). Chạy lại bộ Boss phase tests hiện hữu trên compiled baseline, kết quả trong [baseline-tests](evidence/baseline-tests.txt). Không browser/build/deploy production trong lượt này.

Mỗi variant có **144 fixture boss riêng**: 4 build cấp sẵn (counter/sustain/tank/ranged) × 2 điểm bắt đầu (Boss đầy HP hoặc bắt đầu phase2 với1200HP) × HP player60/100 (Glass tối đa90) × 3 policy × 3 vị trí. Tổng **720 fixture**, cộng **15 run từ đầu** qua RunDirector và 5 probe combo.

`autoplay` dùng policy preview hiện hữu, phản ứng mỗi tick. `delayed` lấy quyết định/aim mỗi300ms, giữ intent giữa hai lần; không tương đương con người. `stationary` vẫn đánh/dùng tài nguyên nhưng không đi/dash. Phase2 độc lập bắt đầu với tài nguyên mới, không mô phỏng HP/charge đã tiêu từ phase1; không so thắng của hai nhóm để kết luận phase nào dễ hơn.

| Variant | Delayed, Boss đầy HP: thắng/24 | Delayed, phase2 độc lập: thắng/24 | Stationary, Boss đầy HP: thắng/24 | Run từ đầu, autoplay: thắng/3 |
|---|---:|---:|---:|---:|
| Baseline | 2 | 8 | 0 | 2 |
| Chỉ damage32/36/14 | 11 | 17 | 2 | 3 |
| Chỉ giãn nhịp phase2 như V1 | 11 | 21 | 0 | 0 |
| V1: kết hợp | **23** | **24** | **2** | **3** |
| Kết hợp nhẹ: damage38/40/16, cùng nhịp V1 | 19 | 24 | 0 | 2 |

Raw: [baseline](evidence/baseline.json), [damage](evidence/damage.json), [tempo](evidence/tempo.json), [V1](evidence/candidate.json), [moderate](evidence/moderate.json). Các variant đơn lẻ để phân tích tác động, không phải tính năng/difficulty option sẽ thêm vào game.

Run từ đầu dùng seed17/808/2026, draft tự roll và chọn offer0, fresh-profile pool cố định tại đầu run; chưa cập nhật pool qua Progression.observe, chưa Legacy/Anomaly/Ascension. Mọi policy/draft trước Boss giữ nguyên giữa variants. Chưa là end-to-end browser hoặc natural human play. Seed808 baseline chết237.67s khi Boss còn577.83HP; V1 thắng242.70s với12HP. Seed17/2026 baseline đã thắng; phản ánh của user vẫn có giá trị, bot không đại diện người chơi.

**Lựa chọn:** V1 có cải thiện nhất quán hơn ở các nhóm thử và vượt seed808. Chỉ giãn nhịp không đủ: cả3run từ đầu lại thua (Boss còn459.6/621.48/37HP), cho thấy timing làm thay đổi đường né/va chạm của policy. Bản nhẹ vẫn thua seed808. Không chọn bằng giả định mọi thay đổi giảm số đều giúp từng run.

**Rủi ro V1:** policy máy mạnh thắng24/24 cả hai nhóm Boss; phase2 độc lập đứng yên thắng18/24 (baseline12/24), có nguy cơ quá dễ với build hoàn thiện/tài nguyên đầy. Nhóm đứng yên đánh từ Boss đầy HP chỉ thắng2/24, nên chưa thấy có thể bỏ né suốt trận với đa số fixture. Vẫn cần người chơi đánh giá; không coi V1 đã cân bằng/accepted từ bot hoặc chọn tham số để bảo đảm bot thắng mọi seed.

## Gate review và cách thử tiếp theo — snapshot trước approval

**Hiện tại:** đề xuất và simulation hoàn tất, chưa có bản chơi V1. Link production/preview cũ vẫn là baseline; không dùng để review V1.

Sau user chọn V1: chuẩn bị bản preview tách biệt trước khi đưa production nếu user muốn tự thử. Checklist preview cần bàn giao cùng URL/version thật:

1. Manual Boss preset (mốc3:40/1150kills, build cấp sẵn, không lưu tiến trình) trên mobile và desktop. Đánh đến50%HP để kiểm transition rồi quan sát slam→sweep: có thời gian thấy telegraph và đi/dash né, sweep cuối có khoảng phản công rõ.
2. Thử bắt đầu ở60HP và100HP với counter/sustain/tank/ranged; cố ý trúng một đòn, rồi né đòn kế. Mong đợi không bị hai lỗi lấy96HP như baseline, vẫn phải xử lý combo.
3. Chạy từ đầu ít nhất vài lượt trên thiết bị đang gặp khó; kiểm vào Boss với tài nguyên thực, có thể thắng sau học pattern. Một lượt đứng yên là control, không mục tiêu trải nghiệm. User phản hồi build/HP vào phase2, đòn gây khó và thiết bị/browser.

Human target để review, chưa đo: người đang kẹt có thể giành chiến thắng đầu tiên trong vài lượt có chủ động né; phase2 vẫn cần chú ý, không yêu cầu tỷ lệ thắng dân số từ mẫu nhỏ. Nếu cảm giác quá dễ, chỉnh proposal rồi thử lại; không tự áp dụng variant khác.

Chỉ sau approval rõ ràng mới sửa config production, kiểm focused damage/timing/aim-lock/Perfect Dodge/transform, typecheck/build và browser touch+desktop; cập nhật mô tả i18n nếu có text số bị ảnh hưởng. Giữ baseline để rollback đúng các thông số Boss của V1. Chưa mở rộng balance sang enemy/build/progression hoặc V2.
