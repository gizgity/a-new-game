# Q6 — Curse Stacking

Implementation đã kiểm; **AWAITING USER PLAYTEST APPROVAL**. Q5E ACCEPTED8b1571d và approval Q2–Q5 giữ nguyên. Contract hiện hành ở GAME_BRIEF.md; không thêm content/tune global balance.

## Vào tình huống

[Chơi run thường](https://gizgity.github.io/a-new-game/). Curse Draft đầu ở80kills HOẶC1:00; Curse Draft sau300kills HOẶC3:00, mốc tới trước kích hoạt. Mutation ở25/0:30,160/1:40,220/2:20,380/3:40. Weighted pool/unlock cũ giữ nguyên nên không bảo đảm roll đúng cặp; Death Echo vẫn cần unlock5Detonate tích lũy.

- A: chọn Curse đầu, tại draft sau chọn **Thêm Curse**. HUD có2tên, effect/risk Curse đầu vẫn hoạt động.
- B: run khác chọn **Giữ nguyên build** ở draft sau. Một Curse và một ô Trống; không nhận ngẫu nhiên.
- C nếu roll được: Iron Oath+Blood Pact hoặc Parasitic; thêm Aegis/Guard/Reclaimer khi có. Barrier≤30, heal combat chung≤8/10s (Blood≤6), có damage cost/Dash chậm; đứng im vẫn chết được.
- D: Volatile Soul+Death Echo; mark→Charged/Detonate giữa cụm. Có hazard tự hại/echo/haste, chain kết thúc; nhìn và nghe được cue địch.
- E: Glass Soul+Ghost Step. HP tối đa75, Perfect hồi recharge, zeroDash chịu thêm enemy damage; heal không vượt75.
- F: Play Again xóa cả2Curse; unlock/settings còn. Bốn Mutation vẫn là cap; timer dừng khi draft/pause. Xem cả2slot/ô trống trên điện thoại.

Mobile: joystick di chuyển, giữ Chém/Bắn, Heavy/Charged giữ-thả, Lướt để Perfect. Desktop: WASD/chuột, Shift/E giữ-thả, Space Dash. Phản hồi ngắn: cặp Curse, thao tác/mốc, điều thấy sai và thiết bị/browser. Không cần duyệt lại Q2–Q5.

## Kiểm kỹ thuật và giới hạn

- npm test PASS12files:149definitions (137trước+12stacking), typecheck/build/diff PASS. Focused tests A–F gồm cả2thứ tự slot của các cặp và full-slot replacement rõ ràng (không thêm draft thứ7). Modifier/cap lấy constants Q5 không thay số.
- Runtime8Curse dùng hasCurse cho cả2slot; chỉ dọn pending effect thuộc Curse bị gỡ, cooldown/shared budget không bị cấp mới. Haste Death Echo+Hunted OR×1.15. Không migration schema: profile v1 không lưu active run; save cũ/malformed vẫn whitelist/meta/settings cũ.
- Chromium local Vite320×740/390×844/844×390/1440×900: HUD2tên/draft Keep+Add/giữslot1/HPclamp/vi-en/nooverflow/no pageerrors PASS. Fixture grant build/kills, không natural run hoặc user acceptance. Ảnh draft320/844 đã xem trực quan.
- Chưa Safari/iOS/thiết bị thật/full-run browser; chưa đo SFX/FPS khi hai Curse chain đông. Automated bounds không thay đánh giá balance/feel của user.
- Không có README root để cập nhật; Q5 README/audit thêm ghi chú lịch sử superseded, không sửa evidence cũ thành Q6.

Ảnh fixture renderer thật đã xem: [HUD320](hud-320.png), [Draft844](draft-844.png).
