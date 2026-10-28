> **VFX follow-up V1.1 đã tích hợp:** user “duyệt, làm đi” ngày2026-10-28 duyệt visual và giao triển khai; code/deploy `ffd39a9`, [Pages40629442727](https://github.com/gizgity/a-new-game/actions/runs/40629442727) SUCCESS. [Production/evidence/checklist](vfx-production/README.md), [chơi bản mới](https://gizgity.github.io/a-new-game/?v=ffd39a9). Giữ gameplay/progression; **AWAITING USER PLAYTEST APPROVAL Q9D**. Các delivery/primitive cue bên dưới là baseline trước VFX.

# Q9D — Ascension System V1

**Implementation proposal — AWAITING USER PLAYTEST APPROVAL Q9D.** User giao ngày2026-10-27; không ghi DDR Approved, không Q9E. Giữ Q9A–Q9C accepted và tuning/artwork/input baseline7207745.

- Seal0–4 cộng dồn, mở chọn sau đủ6Core; thắng N mở tối đa N+1, không skip. Replay cấp thấp không giảm highest, Defeat không mở, Seal4 ghi clear. Subschema Ascension v1 trong profile/Legacy v2, migration mặc định Seal0; allowlist/contiguous clear validation. Ticket giữ Seal qua Restart/refresh. Q9B receipt+journal lưu reward và Seal cùng transaction, settle một lần/runID; Legacy economy độc lập.
- Config tại `src/game/config/ascension.ts`: Pulse35s sau Anomaly active, warning1.5s/active0.5s/radius48, damage12player/24enemy, offset92px vào trong arena; một pulse, mỗi victim tối đa một hit. Freeze theo simulation, hủy vùng khi Arrival/Boss attack để tránh chồng warning; không đổi Anomaly gốc.
- Hunter: cùng nhóm Grunt trong500px, khoảng cách từng con lệch≤36px so đầu window khi player di chuyển5s; cue tam giác vàng0.8s rồi đỏ4s, dự đoán0.45s; CD12s toàn cục từ lúc báo. Đổi nhóm/đứng yên/Dash reset window; chết/hết hạn bỏ Hunter. Không tăng speed/damage/HP, không đổi windup/collider/leap; không Elite/Boss.
- Fracture: Draft Mutation thứ hai là lần xét duy nhất, chọn ngẫu nhiên trong allowlist có mặt. **V1 chỉ Static Riposte**: proc damage độc lập có thể nhân đôi an toàn. Nếu vắng thì skip cả run, không reward giả. Chọn card cho thêm một damage proc50% khi Charged có Static proc thật; cùng root finite ledger, một lần/root, không duplicate primary/charge/status. Nhận thêm10% enemy damage25s simulation; giữ4M/2C. Không tự coi mọi Mutation có stat/CC/heal là proc an toàn.
- Echo: phase2 hoàn tất slam→followup combo mới đặt dấu ở vị trí player, warning1.3s/radius52/damage13 (50% slash26)/CD12s; một pending. Di chuyển/Dash né, không knockback/hitstop/stun. Hủy nếu Boss vào windup mới; không Arrival/transform. Giữ1500HP, thứ tự combo, clock và deadline300s.
- Primitive vòng/chữ thập/triangle là gameplay telegraph trong scope user; không production artwork mới. vi/en picker hiển thị tên5Seal/locked và modifiers cộng dồn, ticket khóa select; badge ở HUD lane, Victory clear/unlock riêng reward Legacy.

## Kiểm kỹ thuật

`npm test`, `npm run build` (gồm typecheck); suites Q9A–Q9C giữ nguyên, thêm focused `tests/ascension.test.mjs`: progression/replay/Defeat/idempotent, migration/corruption/ticket; Pulse cap/damage/warning/freeze/Boss overlap; Hunter activation/lead/CD/reset/exclusions; Fracture eligibility/skip/slots/root/actual damage/penalty; Echo real combo/warning/Dash/no knockback/transform; stack0–4.

`node docs/q9d/browser-check.mjs`: Chromium software WebGL320×740/390×844touch,844×390touch,1440×1000keyboard/mouse. Kiểm chọn/vi-en/Pulse/pause freeze/di chuyển bằng CDPjoystick hoặc bàn phím/HUD lane/no overflow/debug isolation; profile fixture production kiểm ticket refresh/Victory unlock/receipt refresh không thưởng lại. Raw/screenshot tại `evidence/`. Fixture có chủ đích, không chứng minh natural run balance/FPS/latency/iOS/Safari/thiết bị thật hoặc user acceptance. Warning chunk Phaser>500KB có sẵn.

## Playtest

Normal URL dùng collection thật: đủ6Core mới chọn Seal. Chọn trước run, thắng N mở N+1, refresh/restart phải giữ Seal ticket; Victory hiện clear/unlock riêng Legacy, refresh không cộng thưởng. Defeat không mở cấp.

Preset memory riêng, không đọc/ghi save thật; chọn Legacy rồi chơi:

| Preset | Cách thử / đạt |
| --- | --- |
| [?playtest=seal-0](https://gizgity.github.io/a-new-game/?playtest=seal-0) | Baseline bình thường, không modifier. |
| [?playtest=seal-1](https://gizgity.github.io/a-new-game/?playtest=seal-1) | Mở2:14; sau1s chọn Anomaly, sau35s pulse lệch vị trí. Vào/rời vòng hoặc Dash; không damage trong warning/pause. |
| [?playtest=seal-2](https://gizgity.github.io/a-new-game/?playtest=seal-2) | Chạy vòng giữ khoảng cách cùng nhóm Grunt≥5s; thấy tam giác vàng trước Hunter đỏ4s truy đón. Đứng yên không gọi Hunter. |
| [?playtest=seal-3](https://gizgity.github.io/a-new-game/?playtest=seal-3) | Mở1:39, đã cấp1Mutation/1Curse fixture. Sau1s Draft thứ2 có Static Riposte Fractured: đọc trade-off, chọn; Perfect Dodge rồi Charged trong4s để thấy proc.25s đầu enemy gây thêm10% damage; không thêm slot. |
| [?playtest=seal-4](https://gizgity.github.io/a-new-game/?playtest=seal-4) | Mở3:40 với build Boss fixture; chọn Anomaly nếu hiện. Boss fallback4:00, đánh xuống≤50% để transform; sau slam+followup phase2 rời vòng Echo hoặc Dash trước1.3s. Kiểm thêm modifiers1–3, readability khi đông. |

Thử riêng mobile dọc/ngang và desktop: joystick+Shoot hoặc WASD+mouse, giữ/thả Heavy/Charged, Dash, pause/resume; cue/Seal không che player ở biên/góc, không kẹt input khi Draft. Báo Seal/tình huống/thao tác/quan sát và thiết bị/browser. Tests/deploy không thay playtest approval.

## Delivery

Code `43c4e26` + guard `afd084a` đã push main fast-forward. [Pages40538754967](https://github.com/gizgity/a-new-game/actions/runs/40538754967) completed/SUCCESS, job122311064072 gồm build/typecheck/upload/Deploy. [Chơi Q9D](https://gizgity.github.io/a-new-game/?v=afd084a). PASS25testfiles gồm11focused Q9Dcases, typecheck/build và5browser reports. Chưa xác minh liveHTTP/hash; commit bàn giao chỉMarkdown, không redeploy. Dừng **AWAITING USER PLAYTEST APPROVAL Q9D**, không Q9E hoặc DDR Approved.
