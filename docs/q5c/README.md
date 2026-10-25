# Q5C — pool12/8

Bổ sung5Mutation/3Curse theo GAME_BRIEF. Giữ tank trade-off d42cdaf đã được duyệt; Draft có trọng số/anti-repeat chưa triển khai (Q5D). Chờ user playtest Q5C, không tự chuyển checkpoint.

## Cách thử

Tải lại [game](https://gizgity.github.io/a-new-game/). Các query dưới cấp build ngay, có nhãn, không lưu kills/unlocks/runs; không mô phỏng natural acquisition. Run thường vẫn6draft/4Mutation/1Curse với eligible10/7 mặc định, unlock Guard/Static/Death Echo giữ nguyên.

Mobile: joystick di chuyển, Lướt né, giữ Chém/Bắn; Heavy/Charged ngắm rồi thả. Desktop: WASD/Space, chuột trái Chém/phải Bắn, Shift Heavy/E Charged giữ-thả.

- [Sustain](https://gizgity.github.io/a-new-game/?playtest=sustain): Reclaimer+Catalyst+Parasitic. Khi đã mấtHP, chém để đánh dấu rồi Bắn/Charged kích nổ vào cụm. Mong đợi marked kill hồi3, Detonate trúng hồi2 nhưng tổng không vượt8HP/10s; unmarked kill không thưởng Reclaimer. Draft bất kỳ khi Parasitic active chỉ hồi5; đổi Curse ở300kills/3:00 lại hồi10 theo Curse mới.
- [Anchor](https://gizgity.github.io/a-new-game/?playtest=anchor): Reversal+Anchor+Blood. Để một hit địch làm mấtHP, Heavy trong4s phản công mạnh hơn; hụt/chờ quá hạn mất cơ hội. Sống sót ở≤25HP kích20Barrier và đẩy quái một lần/run, không hồi sinh. Blood giữ cost20%/heal cap6 khi không có khiên như bản đã duyệt.
- [Chamber](https://gizgity.github.io/a-new-game/?playtest=chamber): Echo Chamber+Catalyst+Death Echo. Rải Rupture lên ít nhất4quái đứng nối nhau rồi Bắn/Charged kích chain. Vụ Rupture thứ4 đã nổ phát vòng tím, quái gần chậm2s tạo khoảng trống;3vụ/Death Echo đơn thuần không đủ. Telegraph/Boss không chậm, Death Echo vẫn có rủi ro haste.
- [Glass](https://gizgity.github.io/a-new-game/?playtest=glass): Battery+Static+Glass. HP tối đa75, Basic/Charged trực tiếp mạnh30%, blast/bonus Static không nhân. Chạy/Dash vòng gần quái: mỗi120px tích1pin tối đa3 và1/s; hit địch chuyển pin thành4Barrier/pin trước damage, cooldown3s. Đứng im/chạy vào tường không tích; không thành bất tử.
- [Hunted](https://gizgity.github.io/a-new-game/?playtest=hunted): Battery+Reclaimer+Hunted. Kill liên tục thấy thưởng thêm2Barrier/3Surge tối đa1/s; ngừng giết thì thưởng dừng nhưng common/Elite vẫn đuổi nhanh15%. Boss/đạn/telegraph không nhanh hơn; đổi Curse gỡ chase bonus.

Phản hồi: link/build, bước gặp vấn đề, điều quan sát được/cảm giác quyết định và thiết bị/browser. Cần thử độ hữu dụng sustain/ranged/control/movement trong combat thật; không yêu cầu kiểm lại toàn Q1–Q5B.

## Kiểm tra và evidence

-122test definitions/9files PASS, gồm12focused Q5C: root/marked snapshot, heal budget/priorities/fullHP, Reversal/Anchor, executed chain+slow, pin movement/rate/collision exclusion, Glass/swap, Parasitic draft, Hunted/caps, pause/hitstop/reset. Giữ regression tank và Q2–Q4. Typecheck/build PASS; bundle Phaser>500KB là warning cũ.
- Chromium390: năm ảnh `sustain/anchor/chamber/glass/hunted-390.png` từ core/renderer thật, grant HP/targets/marks để kiểm trigger. Đã xem ảnh trực quan; HUD vi/en/pause/trial no-progress/no-overflow/no runtime errors PASS. Không là natural run; lỗi callback của script fixture ban đầu đã sửa và chạy lại PASS.
- Bản dist320/844/1440 kiểm input mobile/desktop, pause/resume, vi/en, HP75, no-overflow và runtime errors. Chưa Safari/iOS/thiết bị thật/full-run/balance acceptance. Evidence local/dist, không tự nhận smoke live.
- Deploy: đang thực hiện qua Pages Actions sau checks PASS; SHA/kết quả cập nhật trong HANDOFF.
