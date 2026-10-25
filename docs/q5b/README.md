# Q5B — rework Mutation/Curse

Bản b06bf69f82c3384145556cfed0d453d2ff7be844 đã deploy, Actions40193133738 completed/success.

Rework5Mutation còn lại và4Curse cũ theo Q5 Design Contract; giữ Guard/Aegis/Oath và tuning Grunt6b7d7ad. Pool hiện7Mutation/5Curse, chưa Q5C/D. Implementation không là user experience acceptance.

- Phantom: Perfect→Light trúng→slash trễ18damage/+1dấu; không tự cấp charge/Aegis/Frenzy, không interrupt. Static: Perfect→Charged bonus40 direct, tốn ammo thường, hụt vẫn tiêu.
- Catalyst: mỗi root gồm trigger/relay/echo chia sẻ tối đa2seed sống gần blast nhất; dấu mới không tự kích trong cùng root. Budget12/tick và24VFX/overflow giữ.
- Berserker: L1→L2→L3 đều trúng cấp Frenzy4s cho direct melee+25%; miss/timeout mất tiến độ, HP damage hủy Frenzy, Barrier hấp thụ hết không hủy. Specialist chỉ buff blast Charged gốc +25%/radius142 và Fracture3s, Heavy/Charged tiếp tiêu+20flat.
- Volatile: +40%Detonate, hazard0.8s/8damage/radius70; không Perfect từ hazard. Ghost: Perfect giảm1s hồiDash, khi0charges enemy damage+20%; bỏ maxHP80/hồi2.1s cũ.
- Blood Pact: melee+30%, hit heal2/cooldown1.5s, chung8HP/10s; bỏ Light cost, Heavy hụt/hủy sau bắt đầu cost4HP sàn1 xuyênBarrier. Death Echo:20damage/radius80, max6echo/root; enemy sống hit echo có movement+15%/3s, Boss miễn; bỏ maxHP85.
- Đổi Curse xóa hazard/haste/pending echo/queued volatile boost và effect Blood trên attack cũ; giữ Curse không reset cooldown/budget, không cấp Barrier mới. Clock dừng theo simulation/hitstop/draft, reset sạch.

## Kiểm tra và evidence

103definitions/7files PASS, trong đó13focused Q5B kiểm trigger/miss/resources/buffs/root/overflow/heal-budget/Curse swap/timers/reset. Regression Q2–Q4/Q5A/difficulty giữ PASS. Typecheck/build/diff PASS; Phaser bundle>500KB là warning hiện trạng.

`counter-390.png`: fixture Grunt windup hợp lệ và input Dash thật trong core sinh Perfect, có Phantom/Static HUD. `chain-390.png`: fixture ba enemy1000HP, cấp1ammo, input Charged thật, seed/Fracture/hazard từ code thật. `frenzy-390.png`: fixture target1000HP giữ ở tầm mỗi combo, input Light core, HP50 để thấy heal. `echo-390.png`: fixture1HP+hai target khỏe, shot core giết rồi echo/haste. Các fixture freeze RunDirector để chụp state; không là natural run hoặc acquisition/balance evidence.

Browser Chromium390 kiểm4preset/vi-en/Curse swap/không lưu kills/unlocks/runs. Dist320/844/1440 kiểm start/input/pause/layout, run thường có input Bắn+WASD ngắn; không runtime errors/document overflow. Chưa Safari/iOS, thiết bị thật, full-run hoặc user approval. Live deploy đã xác nhận qua Actions; không coi local dist là đã smoke live.

## User playtest — chỉ Q5B

Tải lại trang sau deploy. Các link cấp build để vào đúng tình huống, không lưu tiến độ, không grant HP/ammo; phải tích Charged bằng Bắn/Perfect như thường. Các draft sau vẫn theo milestones cũ nên preset không đại diện số Mutation kiếm tự nhiên.

1. [Phản công](https://gizgity.github.io/a-new-game/?playtest=counter): đợi Grunt/đạn sắp trúng, Dash (mobile Lướt/desktop Space). Mong đợi hiện Phantom3s/Static4s; Light trúng trong3s có slash phụ/dấu, hụt không mất Phantom. Nhắm/thả Charged (Tích lực/E) trong4s có bonus, bắn hụt mất Static; Basic không tiêu. Tiêu hết Dash thấy cảnh báo damage nhận+20%, Perfect giúp hồi sớm.
2. [Chain](https://gizgity.github.io/a-new-game/?playtest=chain): gom2–3quái, Chém đặt dấu rồi Bắn/Heavy kích; tối đa2quái chưa có dấu nhận dấu mới nhưng chưa tự nổ trong chain đó. Bắn lần tiếp mới kích. Tích Charged rồi thả vào cụm quái khỏe: blast lớn, quái sống có rạn amber3s, Heavy/Charged tiếp tiêu rạn. Bước khỏi vòng cam sọc trước0.8s; đứng lại chịu8 qua Barrier. Opening dễ chết trước khi thấy rạn, dùng quái khỏe sau60s/Bulwark200kills hoặc2:30 nếu cần.
3. [Frenzy/sustain](https://gizgity.github.io/a-new-game/?playtest=frenzy): giữ Chém/chuột trái để L1–L3 đều trúng; HUD Frenzy4s, giữ nhịp phản công; một nhát hụt không hoàn thành tiến độ. Khi đã mấtHP, melee trúng hồi2 có cooldown/cap, không hồi đầy từ một cleave. Heavy (Đánh mạnh/Shift giữ-thả) vào khoảng trống hoặc dash hủy sau khi đã bắt đầu: mất4HP dù có Barrier, không tự giết; Light hụt không mấtHP. HP damage kết thúc Frenzy, Barrier hấp thụ hết không kết thúc nếu draft có Aegis.
4. [Death Echo](https://gizgity.github.io/a-new-game/?playtest=echo): giết quái yếu sát quái khỏe, thấy echo tím, quái sống chạy nhanh có vệt đỏ3s; kill chain đông không nổ vô hạn. Draft Curse thứ2 tại300kills/3:00 thử giữ/đổi; đổi gỡ haste/hazard cũ, giữ không refresh cooldown hoặc nhân effect.

Run thường: https://gizgity.github.io/a-new-game/. Draft Mutation25kills/0:30, Curse80/1:00, Mutation160/1:40 và220/2:20, Curse300/3:00, Mutation380/3:40; vẫn random cũ, không đảm bảo đủ combo. Feedback: link/build, bước/tình huống, quan sát và thiết bị/browser. Dừng Q5B ở AWAITING PLAYTEST APPROVAL, chưa Q5C/D.
