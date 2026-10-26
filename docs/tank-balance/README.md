# Tank trade-off — feedback sau Q5B

> Note lịch sử, giữ nguyên evidence/approval tại thời điểm đó. Q5C–Q5E đã accepted; câu chưa mở ở dưới là trạng thái tại checkpoint lịch sử. Contract/trạng thái hiện hành ở [GAME_BRIEF](../../GAME_BRIEF.md) và [HANDOFF](../../HANDOFF.md); Q7A floor đã ACCEPTED, gameplay giữ nguyên; Q7B HUD đang design/visual gate theo contract riêng.

Bản d42cdaf4b69a2253307c5a194a2b58f022ad3f94 đã deploy, Actions40209412564 completed/success. User đã duyệt balance qua “oki, ổn r á” trên d42cdaf. ACCEPTED — USER PLAYTEST APPROVAL cho tank trade-off; Q5C/D chưa mở.

User yêu cầu chống chịu phải đánh đổi damage, tránh vừa Barrier vừa heal vừa damage lớn. Đây là điều chỉnh trực tiếp lên Q5A/Q5B đã có, không mở Q5C/D.

- Aegis Core: mọi damage player gây ra×0.8, trần tạo Barrier4/s thay8 (Oath5 thay10), vẫn4Barrier mỗi40actual melee damage. Damage sau cost/giáp và loại overkill mới tích khiên, phần dư không bank.
- Iron Oath: mọi damage×0.75, giữ benefit khiên/Heavy và Dash chậm hiện có.
- Blood Pact: mọi damage×0.8 thay bonus melee+30%; heal2HP/2s cap6HP/10s chỉ khi Barrier=0. Đòn vừa cấp khiên không đồng thời heal; bị chặn không tiêu cooldown/budget. Heavy miss/hủy cost4HP vẫn giữ.
- Cost nhân nhau, áp dụng một lần sau flat Fracture/Static trước giáp: bao gồm melee/ranged/Phantom/Detonate/relay/echo/Surge, không tác động enemy/environment damage. Aegis+Oath còn60%damage, Aegis+Blood còn64% trước bonus Frenzy/Guard. Baseline không có các lựa chọn phòng thủ giữ nguyên.
- Không sửa timing/controls, HP quái, wave, Boss/Archer hoặc tuning Grunt. Không tạo armor/class/equipment mới.

## Validation / evidence

110definitions/8files PASS,5focused tests mới kiểm từng modifier/cộng dồn/flat/proc/chain/environment, chặn heal cùng Barrier (kể cả cùng hit), rate cap, và sống lâu hơn baseline nhưng không vô hạn trong fixture đứng yên. Fixture sống sót dùng target50000HP để đánh và enemy hurt12 mỗi1s qua pipeline thật; không là natural run/balance acceptance.

Typecheck/build/diff PASS. Chromium320/390/844/1440 kiểm HUD36%/40%, Barrier14 vàHP50 sau hit100raw gây64actual, đổi Curse/vi-en/trial không lưu progress/no-overflow/runtime errors. `tank-390.png` là fixture core/renderer thật, cấp HP50/Barrier10/target5000HP để kiểm tương tác; không là natural run. Dist390 giữ Chém12s input thật, không grant resources/enemies ngoài preset build: còn24HP tại~12s simulation; chỉ là smoke, không chứng minh thắng/thua hay cảm giác cân bằng mọi build. Chưa thiết bị thật/Safari/full-run hoặc user acceptance. Bundle warning Phaser>500KB là hiện trạng.

## User thử sau deploy

- [Tank kết hợp](https://gizgity.github.io/a-new-game/?playtest=tank): Guard+Aegis+Berserker+Blood; HUD cost36%. Chém (mobile giữ nút/desktop chuột trái) vào cụm20–40s: khiên vẫn tạo nhưng chậm hơn, khi có khiên HP không tự tăng. Combo trúng vẫn Frenzy, nhưng không còn buff Blood+30%.
- [Juggernaut](https://gizgity.github.io/a-new-game/?playtest=juggernaut): Guard+Aegis+Oath; cost40%. Heavy đúng windup/giáp đóng vẫn nhận Barrier, Dash hồi chậm như trước; giết quái chậm hơn để đổi độ chịu đòn.
- [Frenzy/Blood](https://gizgity.github.io/a-new-game/?playtest=frenzy): cost20%, chưa có Aegis nên heal theo cap khiHP thấp. So damage với combo offensive, Heavy hụt vẫn mất4HP.

Trial có nhãn, không lưu kills/unlocks/runs, không đại diện natural acquisition. Tải lại trang trước thử. So đứng yên với di chuyển (joystick/WASD), né (Lướt/Space), phá thế Heavy (Đánh mạnh/Shift giữ-thả), Charged (Tích lực/E giữ-thả). Mong đợi tank chịu lâu hơn nhưng phải dùng kỹ năng/di chuyển, AoE vẫn dọn được quái với damage thấp hơn. Ghi build, tình huống, điều quan sát, thiết bị/browser; Tank trade-off đã được user duyệt; không suy rộng thành approval mọi vòng Q5B hoặc tự mở checkpoint mới.
