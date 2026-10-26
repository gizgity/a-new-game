> Q8B: thông số milestones OR cũ trong tài liệu này là **SUPERSEDED**; giữ làm lịch sử/evidence/approval. Quy tắc hiện hành: [GAME_BRIEF](../../GAME_BRIEF.md#run-tối-đa-5-phút), [audit Q8B](../q8b/README.md). Spawn Q8A và approvals giữ nguyên.

# Q5E — thử độ đa dạng build và cân bằng

> Tham chiếu lịch sử checkpoint trước Q6; evidence và kết quả tại thời điểm đó giữ nguyên. Hiện hành: Q5A–Q5E đã được user duyệt (task Q6 ngày2026-10-26); Q6 hỗ trợ2Curse/4Mutation, lượt Curse thứ hai thêm hoặc Keep. Xem GAME_BRIEF.md và HANDOFF.md cho contract/trạng thái mới.

Bản8b1571d719a51c6f0da50a8b4435782c20a444ff đã deploy; Pages Actions40248846311 completed/success. Q5D514063a được user duyệt “oki r, làm tiếp đi” ngày2026-10-26. Lượt này bổ sung route trial theo các mốc draft thật để so bốn hướng chơi; **giữ nguyên toàn bộ tuning**, gồm tank costs đã duyệt. Chưa có feedback mất cân bằng mới để đổi số. Q5E đang chờ human playtest/acceptance; chưa đánh dấu toàn Q5 hoàn thành.

## Cách vào và thử

Tải lại từng link. Đây là draft trợ giúp, **không là natural acquisition**: route cho phép pool đầy đủ trong trial và đưa card theo hướng build lên đầu, có nhãn “Gợi ý cho lượt thử build”. Bắt đầu vẫn0Mutation/không Curse, HP/ammo/Heavy/Dash đúng baseline. Không lưu kills/unlocks/runs/offer-history; settings vẫn lưu như trước. Link cũ cấp build ngay từ đầu vẫn giữ.

Chọn card có nhãn gợi ý tại Mutation; tại Curse2 chọn giữ nếu muốn so cùng một build. Mốc thật theo kills HOẶC thời gian: Mutation25/0:30, Curse80/1:00, Mutation160/1:40, Elite200/2:30, Mutation220/2:20, Curse300/3:00, Mutation380/3:40, Boss450/4:00. Elite có thể sau Mutation3 nếu theo thời gian. Nếu chết sớm, ghi mốc/đòn gây khó; không yêu cầu mọi build thắng.

| Route | Build theo thứ tự4Mutation và Curse | Thử quyết định / mong đợi |
| --- | --- | --- |
| [Juggernaut](https://gizgity.github.io/a-new-game/?playtest=route-tank) | Aegis → Guard → Reversal → Battery; Iron Oath | Chém trúng tạo Barrier, Heavy đúng windup/giáp kín phá thế; chịu lâu hơn nhưng damage−40% khi Aegis+Oath, Dash hồi chậm. So đứng tank với chủ động di chuyển, không yêu cầu đứng im bất tử. |
| [Sustain](https://gizgity.github.io/a-new-game/?playtest=route-sustain) | Catalyst → Reclaimer → Echo Chamber → Battery; Parasitic | Sau khi mấtHP: chém đặt dấu rồi bắn/Heavy/Charged kích nổ và kết liễu marked. Heal hữu ích nhưng chung tối đa8HP/10s, draft5; unmarked kill không cho Reclaimer. So khi đang giết được với lúc bị dồn không kill. |
| [Phản công](https://gizgity.github.io/a-new-game/?playtest=route-counter) | Phantom → Static → Reversal → Battery; Ghost Step | Dash đúng cửa sổ vàng rồi Light phản công/Charged tiêu Static; giữ một Dash dự phòng thay vì tiêu sạch. Hết Dash chịu damage+20%; buff có timer, chờ lâu/hụt mất cơ hội. |
| [Ranged/chain](https://gizgity.github.io/a-new-game/?playtest=route-ranged) | Specialist → Echo Chamber → Catalyst → Battery; Glass Soul | Giữ khoảng cách, Basic cấp đạn, Charged gây Fracture rồi Heavy/Charged tiêu; nối4Detonate tạo khoảng trống. Direct bắn+30% nhưng HP75, không buff blast/Static phẳng. Thấy rõ rủi ro bị áp sát so với Juggernaut. |

Mobile joystick trái, Chém/Bắn giữ-kéo để ngắm, Lướt; Heavy/Charged ngắm rồi thả. Desktop WASD, chuột trái/phải, Space, Shift/E giữ-thả. Đi tới Elite/Boss hoặc ghi chết trước mốc nào. Xem đọc được Barrier/HP75/timer/slow/Perfect trên màn hình thật; cần đổi vi/en thì offer không reroll.

Phản hồi ngắn: route/build + mốc sống/chết, kỹ năng/đòn đang dùng, điều mạnh/yếu hoặc khó đọc, thiết bị/browser. Sau đó chỉ tune defaults Q5 có feedback; không tự đổi quái, baseline Q2–Q4, draft weights đã duyệt hoặc thêm nội dung.

[Game thường](https://gizgity.github.io/a-new-game/) giữ weighted draft/unlocks/progression để thử natural acquisition riêng. Không lấy draft trợ giúp làm bằng chứng phân bố Q5D.

## Kiểm tra kỹ thuật và giới hạn

- 137definitions/11files PASS (1focused mới kiểm4route×6draft, slotcap4, Curse giữ/đổi, không cấp build/resources đầu run). Typecheck/build PASS; warning bundle Phaser cũ. Browser kiểm profile totals/unlocks/history không đổi trong trial, normal unlock gates và link counter cũ PASS.
- Core thực fixed60Hz với script đọc vị trí/quái, tự ngắm và phản ứng Perfect theo predicate thật; chọn card theo route ở mốc thật, không grant HP/ammo/kills/time. Đây là chạy offline, **không là real-time browser/human playtest**. Cả4đến Elite/Boss và thắng trong một seed123456789; không chứng minh tỷ lệ thắng/độ khó. Logs ở scripted-routes.json.

| Route | Elite | Boss | Kết thúc (đồng hồ game) | HP cuối | Giới hạn nổi bật |
| --- | --- | --- | --- | --- | --- |
| Juggernaut | 1:37.2 | 3:05.6 | Victory3:17.2 | 76/100 | Absorb67HP, mất24HP; bot không đo trade-off cảm giác đứng tank. |
| Sustain | 1:36.3 | 3:01.9 | Victory3:07.1 | 100/100 | Không mấtHP nên actual heal=0; **chưa kiểm được ích lợi sustain bằng lượt này**. |
| Counter | 1:36.1 | 3:02.3 | Victory3:11.1 | 100/100 | Bot có7Perfect/8Dash, chính xác hơn người; chưa chứng minh rủi ro zeroDash dễ đọc. |
| Ranged | 1:36.6 | 3:03.3 | Victory3:10.7 | 36/75 | Mất39HP, absorb12; không dùng một seed để tự nerf/buff Glass. |

- Chromium390:4ảnh route-*-390.png từ renderer/core thật, fixture đưa kills lên mốc để xem card, chọn6lượt/reset/vi-en/no-grant/no-progress PASS. **Ảnh UI không phải các run offline trong bảng**. Dist320/844/1440 dùng input thật vài giây, pause/resume/vi-en/no-overflow/runtime PASS. Chưa Safari/iOS/device/full-run browser/human balance acceptance.
- Không đổi combat.ts/run.ts/balance.ts/Draft.ts. Q5E route chỉ nằm ở config/playtests.ts và wiring UI; run thường không query vẫn eligible/unlocks cũ. Thêm entry TypeScript cho config vào npm test để focused test import được.
- Deploy PASS8b1571d: Pages Actions40248846311 completed/success, job121336104379;13blobs đối chiếu local/remote tree, giữ core/tuning. Browser evidence local/dist, chưa tự nhận smoke live.
